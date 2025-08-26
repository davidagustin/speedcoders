import { EventEmitter } from 'events';

interface RenderingConfig {
  width: number;
  height: number;
  theme: 'light' | 'dark' | 'colorful';
  interactive: boolean;
  animations: boolean;
  showLabels: boolean;
  showIndices: boolean;
  layout: 'auto' | 'compact' | 'spacious';
}

interface RenderElement {
  type: 'node' | 'edge' | 'label' | 'arrow' | 'group';
  id: string;
  position: { x: number; y: number };
  size?: { width: number; height: number };
  style: ElementStyle;
  content?: string | number;
  children?: RenderElement[];
  metadata?: { [key: string]: any };
}

interface ElementStyle {
  fill: string;
  stroke: string;
  strokeWidth: number;
  opacity: number;
  fontSize?: number;
  fontFamily?: string;
  fontWeight?: string;
  borderRadius?: number;
  animation?: AnimationStyle;
}

interface AnimationStyle {
  type: 'pulse' | 'bounce' | 'slide' | 'fade' | 'rotate' | 'scale';
  duration: number;
  delay: number;
  repeat: boolean;
  easing: 'linear' | 'ease-in' | 'ease-out' | 'ease-in-out';
}

export class DataStructureRenderer extends EventEmitter {
  private static instance: DataStructureRenderer;
  private canvas: HTMLCanvasElement | null = null;
  private context: CanvasRenderingContext2D | null = null;
  private svgContainer: SVGElement | null = null;
  private config: RenderingConfig;
  private animationFrame: number | null = null;
  private renderElements: Map<string, RenderElement> = new Map();
  
  private constructor() {
    super();
    this.config = this.getDefaultConfig();
  }

  static getInstance(): DataStructureRenderer {
    if (!DataStructureRenderer.instance) {
      DataStructureRenderer.instance = new DataStructureRenderer();
    }
    return DataStructureRenderer.instance;
  }

  // Initialize renderer
  initialize(container: HTMLElement, mode: 'canvas' | 'svg' = 'canvas'): void {
    this.clearContainer(container);

    if (mode === 'canvas') {
      this.initializeCanvas(container);
    } else {
      this.initializeSVG(container);
    }

    this.emit('renderer:initialized', { mode, config: this.config });
  }

  // Array rendering
  renderArray(
    data: any[],
    options: {
      highlights?: number[];
      labels?: { [index: number]: string };
      colors?: { [index: number]: string };
      comparisons?: [number, number][];
    } = {}
  ): RenderElement[] {
    const elements: RenderElement[] = [];
    const elementWidth = 60;
    const elementHeight = 40;
    const spacing = 10;
    const startX = (this.config.width - (data.length * (elementWidth + spacing) - spacing)) / 2;
    const startY = this.config.height / 2 - elementHeight / 2;

    // Render array elements
    data.forEach((value, index) => {
      const x = startX + index * (elementWidth + spacing);
      const y = startY;
      
      const isHighlighted = options.highlights?.includes(index);
      const isCompared = options.comparisons?.some(([i, j]) => i === index || j === index);
      const customColor = options.colors?.[index];
      
      // Element background
      elements.push({
        type: 'node',
        id: `array-${index}`,
        position: { x, y },
        size: { width: elementWidth, height: elementHeight },
        style: {
          fill: customColor || (isHighlighted ? '#ff6b6b' : isCompared ? '#ffd43b' : '#f8f9fa'),
          stroke: isHighlighted || isCompared ? '#495057' : '#dee2e6',
          strokeWidth: isHighlighted || isCompared ? 3 : 1,
          opacity: 1,
          borderRadius: 4,
          animation: isHighlighted ? {
            type: 'pulse',
            duration: 800,
            delay: 0,
            repeat: true,
            easing: 'ease-in-out'
          } : undefined
        },
        content: value,
        metadata: { index, value, type: 'array-element' }
      });

      // Element value text
      elements.push({
        type: 'label',
        id: `array-label-${index}`,
        position: { x: x + elementWidth / 2, y: y + elementHeight / 2 },
        style: {
          fill: '#212529',
          stroke: 'none',
          strokeWidth: 0,
          opacity: 1,
          fontSize: 16,
          fontFamily: 'monospace',
          fontWeight: 'bold'
        },
        content: value.toString()
      });

      // Index labels
      if (this.config.showIndices) {
        elements.push({
          type: 'label',
          id: `array-index-${index}`,
          position: { x: x + elementWidth / 2, y: y - 20 },
          style: {
            fill: '#6c757d',
            stroke: 'none',
            strokeWidth: 0,
            opacity: 1,
            fontSize: 12,
            fontFamily: 'system-ui'
          },
          content: index.toString()
        });
      }

      // Custom labels
      const customLabel = options.labels?.[index];
      if (customLabel) {
        elements.push({
          type: 'label',
          id: `array-custom-${index}`,
          position: { x: x + elementWidth / 2, y: y + elementHeight + 25 },
          style: {
            fill: '#339af0',
            stroke: 'none',
            strokeWidth: 0,
            opacity: 1,
            fontSize: 12,
            fontFamily: 'system-ui'
          },
          content: customLabel
        });
      }
    });

    // Render comparison arrows
    options.comparisons?.forEach(([i, j], compIndex) => {
      const x1 = startX + i * (elementWidth + spacing) + elementWidth / 2;
      const x2 = startX + j * (elementWidth + spacing) + elementWidth / 2;
      const y = startY - 40;

      elements.push({
        type: 'arrow',
        id: `comparison-${compIndex}`,
        position: { x: Math.min(x1, x2), y },
        size: { width: Math.abs(x2 - x1), height: 20 },
        style: {
          fill: 'none',
          stroke: '#ff6b6b',
          strokeWidth: 2,
          opacity: 1,
          animation: {
            type: 'fade',
            duration: 1000,
            delay: 0,
            repeat: false,
            easing: 'ease-in-out'
          }
        },
        metadata: { comparison: [i, j] }
      });
    });

    this.renderElements.clear();
    elements.forEach(el => this.renderElements.set(el.id, el));

    if (this.canvas && this.context) {
      this.renderToCanvas(elements);
    } else if (this.svgContainer) {
      this.renderToSVG(elements);
    }

    return elements;
  }

  // Binary tree rendering
  renderBinaryTree(
    root: TreeNode,
    options: {
      highlights?: string[];
      path?: string[];
      labels?: { [nodeId: string]: string };
      showNullNodes?: boolean;
    } = {}
  ): RenderElement[] {
    const elements: RenderElement[] = [];
    const nodeRadius = 25;
    const levelHeight = 80;
    
    // Calculate tree dimensions
    const treeInfo = this.calculateTreeDimensions(root);
    const startX = this.config.width / 2;
    const startY = 50;

    const renderNode = (
      node: TreeNode | null,
      x: number,
      y: number,
      level: number,
      parentX?: number,
      parentY?: number
    ) => {
      if (!node && !options.showNullNodes) return;

      // Draw edge to parent
      if (parentX !== undefined && parentY !== undefined && node) {
        elements.push({
          type: 'edge',
          id: `edge-${node.id}`,
          position: { x: parentX, y: parentY },
          size: { width: x - parentX, height: y - parentY },
          style: {
            fill: 'none',
            stroke: '#495057',
            strokeWidth: 2,
            opacity: 1
          },
          metadata: { from: 'parent', to: node.id }
        });
      }

      if (!node) {
        // Null node representation
        elements.push({
          type: 'node',
          id: `null-${x}-${y}`,
          position: { x: x - 8, y: y - 8 },
          size: { width: 16, height: 16 },
          style: {
            fill: '#e9ecef',
            stroke: '#adb5bd',
            strokeWidth: 1,
            opacity: 0.5,
            borderRadius: 8
          },
          content: '∅'
        });
        return;
      }

      const isHighlighted = options.highlights?.includes(node.id);
      const isOnPath = options.path?.includes(node.id);
      
      // Node circle
      elements.push({
        type: 'node',
        id: node.id,
        position: { x: x - nodeRadius, y: y - nodeRadius },
        size: { width: nodeRadius * 2, height: nodeRadius * 2 },
        style: {
          fill: isHighlighted ? '#ff6b6b' : isOnPath ? '#51cf66' : '#f8f9fa',
          stroke: isHighlighted || isOnPath ? '#495057' : '#dee2e6',
          strokeWidth: isHighlighted || isOnPath ? 3 : 2,
          opacity: 1,
          borderRadius: nodeRadius,
          animation: isHighlighted ? {
            type: 'pulse',
            duration: 1000,
            delay: 0,
            repeat: true,
            easing: 'ease-in-out'
          } : undefined
        },
        content: node.value,
        metadata: { nodeId: node.id, value: node.value, level }
      });

      // Node value text
      elements.push({
        type: 'label',
        id: `label-${node.id}`,
        position: { x, y },
        style: {
          fill: '#212529',
          stroke: 'none',
          strokeWidth: 0,
          opacity: 1,
          fontSize: 14,
          fontFamily: 'system-ui',
          fontWeight: 'bold'
        },
        content: node.value.toString()
      });

      // Custom label
      const customLabel = options.labels?.[node.id];
      if (customLabel) {
        elements.push({
          type: 'label',
          id: `custom-${node.id}`,
          position: { x, y: y + nodeRadius + 20 },
          style: {
            fill: '#339af0',
            stroke: 'none',
            strokeWidth: 0,
            opacity: 1,
            fontSize: 10,
            fontFamily: 'system-ui'
          },
          content: customLabel
        });
      }

      // Recursively render children
      const childSpacing = Math.max(80, (this.config.width / Math.pow(2, level + 2)));
      
      if (node.left || options.showNullNodes) {
        renderNode(
          node.left,
          x - childSpacing,
          y + levelHeight,
          level + 1,
          x,
          y
        );
      }
      
      if (node.right || options.showNullNodes) {
        renderNode(
          node.right,
          x + childSpacing,
          y + levelHeight,
          level + 1,
          x,
          y
        );
      }
    };

    renderNode(root, startX, startY + nodeRadius, 0);

    this.renderElements.clear();
    elements.forEach(el => this.renderElements.set(el.id, el));

    if (this.canvas && this.context) {
      this.renderToCanvas(elements);
    } else if (this.svgContainer) {
      this.renderToSVG(elements);
    }

    return elements;
  }

  // Graph rendering
  renderGraph(
    nodes: GraphNode[],
    edges: GraphEdge[],
    options: {
      highlights?: string[];
      visited?: string[];
      path?: string[];
      layout?: 'force' | 'circle' | 'grid' | 'custom';
    } = {}
  ): RenderElement[] {
    const elements: RenderElement[] = [];
    const nodeRadius = 30;
    
    // Apply layout algorithm
    const positions = this.calculateGraphLayout(nodes, edges, options.layout || 'force');

    // Render edges first (so they appear behind nodes)
    edges.forEach(edge => {
      const fromNode = nodes.find(n => n.id === edge.from);
      const toNode = nodes.find(n => n.id === edge.to);
      
      if (!fromNode || !toNode) return;

      const fromPos = positions[edge.from];
      const toPos = positions[edge.to];
      
      if (!fromPos || !toPos) return;

      const isOnPath = options.path?.includes(edge.from) && options.path?.includes(edge.to);
      
      // Edge line
      elements.push({
        type: 'edge',
        id: edge.id,
        position: { x: fromPos.x, y: fromPos.y },
        size: { width: toPos.x - fromPos.x, height: toPos.y - fromPos.y },
        style: {
          fill: 'none',
          stroke: isOnPath ? '#51cf66' : '#495057',
          strokeWidth: isOnPath ? 4 : 2,
          opacity: isOnPath ? 1 : 0.7
        },
        metadata: { from: edge.from, to: edge.to, weight: edge.weight }
      });

      // Edge weight label
      if (edge.weight !== undefined) {
        const midX = (fromPos.x + toPos.x) / 2;
        const midY = (fromPos.y + toPos.y) / 2;
        
        elements.push({
          type: 'label',
          id: `weight-${edge.id}`,
          position: { x: midX, y: midY },
          style: {
            fill: '#212529',
            stroke: '#ffffff',
            strokeWidth: 2,
            opacity: 1,
            fontSize: 12,
            fontFamily: 'system-ui',
            fontWeight: 'bold'
          },
          content: edge.weight.toString()
        });
      }

      // Arrow for directed edges
      if (edge.directed) {
        const angle = Math.atan2(toPos.y - fromPos.y, toPos.x - fromPos.x);
        const arrowX = toPos.x - Math.cos(angle) * nodeRadius;
        const arrowY = toPos.y - Math.sin(angle) * nodeRadius;
        
        elements.push({
          type: 'arrow',
          id: `arrow-${edge.id}`,
          position: { x: arrowX, y: arrowY },
          style: {
            fill: isOnPath ? '#51cf66' : '#495057',
            stroke: 'none',
            strokeWidth: 0,
            opacity: isOnPath ? 1 : 0.7
          },
          metadata: { angle, edgeId: edge.id }
        });
      }
    });

    // Render nodes
    nodes.forEach(node => {
      const position = positions[node.id];
      if (!position) return;

      const isHighlighted = options.highlights?.includes(node.id);
      const isVisited = options.visited?.includes(node.id);
      const isOnPath = options.path?.includes(node.id);
      
      // Node circle
      elements.push({
        type: 'node',
        id: node.id,
        position: { x: position.x - nodeRadius, y: position.y - nodeRadius },
        size: { width: nodeRadius * 2, height: nodeRadius * 2 },
        style: {
          fill: isHighlighted ? '#ff6b6b' : isOnPath ? '#51cf66' : isVisited ? '#74c0fc' : '#f8f9fa',
          stroke: '#495057',
          strokeWidth: isHighlighted ? 4 : 2,
          opacity: 1,
          borderRadius: nodeRadius,
          animation: isHighlighted ? {
            type: 'pulse',
            duration: 800,
            delay: 0,
            repeat: true,
            easing: 'ease-in-out'
          } : undefined
        },
        content: node.value,
        metadata: { nodeId: node.id, value: node.value }
      });

      // Node label
      elements.push({
        type: 'label',
        id: `label-${node.id}`,
        position: { x: position.x, y: position.y },
        style: {
          fill: '#212529',
          stroke: 'none',
          strokeWidth: 0,
          opacity: 1,
          fontSize: 14,
          fontFamily: 'system-ui',
          fontWeight: 'bold'
        },
        content: node.value.toString()
      });

      // Distance label (for pathfinding algorithms)
      if (node.distance !== undefined) {
        elements.push({
          type: 'label',
          id: `distance-${node.id}`,
          position: { x: position.x, y: position.y + nodeRadius + 15 },
          style: {
            fill: '#339af0',
            stroke: 'white',
            strokeWidth: 1,
            opacity: 1,
            fontSize: 10,
            fontFamily: 'monospace'
          },
          content: node.distance === Infinity ? '∞' : node.distance.toString()
        });
      }
    });

    this.renderElements.clear();
    elements.forEach(el => this.renderElements.set(el.id, el));

    if (this.canvas && this.context) {
      this.renderToCanvas(elements);
    } else if (this.svgContainer) {
      this.renderToSVG(elements);
    }

    return elements;
  }

  // Stack rendering
  renderStack(
    items: any[],
    options: {
      highlights?: number[];
      operation?: 'push' | 'pop' | null;
      operationIndex?: number;
    } = {}
  ): RenderElement[] {
    const elements: RenderElement[] = [];
    const elementWidth = 120;
    const elementHeight = 40;
    const spacing = 5;
    const centerX = this.config.width / 2;
    const bottomY = this.config.height - 100;

    items.forEach((item, index) => {
      const y = bottomY - (index * (elementHeight + spacing));
      const x = centerX - elementWidth / 2;
      
      const isHighlighted = options.highlights?.includes(index);
      const isOperationTarget = options.operationIndex === index;
      
      // Stack element
      elements.push({
        type: 'node',
        id: `stack-${index}`,
        position: { x, y },
        size: { width: elementWidth, height: elementHeight },
        style: {
          fill: isOperationTarget ? '#ffd43b' : isHighlighted ? '#ff6b6b' : '#f8f9fa',
          stroke: '#495057',
          strokeWidth: 2,
          opacity: 1,
          borderRadius: 4,
          animation: isOperationTarget ? {
            type: options.operation === 'push' ? 'slide' : 'bounce',
            duration: 600,
            delay: 0,
            repeat: false,
            easing: 'ease-out'
          } : undefined
        },
        content: item,
        metadata: { index, value: item, type: 'stack-element' }
      });

      // Element value
      elements.push({
        type: 'label',
        id: `stack-label-${index}`,
        position: { x: centerX, y: y + elementHeight / 2 },
        style: {
          fill: '#212529',
          stroke: 'none',
          strokeWidth: 0,
          opacity: 1,
          fontSize: 16,
          fontFamily: 'monospace',
          fontWeight: 'bold'
        },
        content: item.toString()
      });
    });

    // Stack base
    elements.push({
      type: 'node',
      id: 'stack-base',
      position: { x: centerX - elementWidth / 2 - 10, y: bottomY + 10 },
      size: { width: elementWidth + 20, height: 8 },
      style: {
        fill: '#495057',
        stroke: 'none',
        strokeWidth: 0,
        opacity: 1
      }
    });

    // Top pointer
    if (items.length > 0) {
      const topY = bottomY - ((items.length - 1) * (elementHeight + spacing));
      elements.push({
        type: 'arrow',
        id: 'stack-top-pointer',
        position: { x: centerX + elementWidth / 2 + 20, y: topY + elementHeight / 2 },
        style: {
          fill: '#339af0',
          stroke: '#339af0',
          strokeWidth: 2,
          opacity: 1
        }
      });

      elements.push({
        type: 'label',
        id: 'stack-top-label',
        position: { x: centerX + elementWidth / 2 + 40, y: topY + elementHeight / 2 },
        style: {
          fill: '#339af0',
          stroke: 'none',
          strokeWidth: 0,
          opacity: 1,
          fontSize: 14,
          fontFamily: 'system-ui',
          fontWeight: 'bold'
        },
        content: 'TOP'
      });
    }

    this.renderElements.clear();
    elements.forEach(el => this.renderElements.set(el.id, el));

    if (this.canvas && this.context) {
      this.renderToCanvas(elements);
    } else if (this.svgContainer) {
      this.renderToSVG(elements);
    }

    return elements;
  }

  // Update configuration
  updateConfig(newConfig: Partial<RenderingConfig>): void {
    this.config = { ...this.config, ...newConfig };
    this.emit('config:updated', this.config);
  }

  // Animation methods
  animateElement(elementId: string, animation: AnimationStyle): void {
    const element = this.renderElements.get(elementId);
    if (element) {
      element.style.animation = animation;
      this.emit('animation:started', { elementId, animation });
    }
  }

  // Clear renderer
  clear(): void {
    this.renderElements.clear();
    
    if (this.context) {
      this.context.clearRect(0, 0, this.config.width, this.config.height);
    }
    
    if (this.svgContainer) {
      this.svgContainer.innerHTML = '';
    }
    
    this.emit('renderer:cleared');
  }

  // Private methods
  private initializeCanvas(container: HTMLElement): void {
    this.canvas = document.createElement('canvas');
    this.canvas.width = this.config.width;
    this.canvas.height = this.config.height;
    this.canvas.style.border = '1px solid #dee2e6';
    this.context = this.canvas.getContext('2d');
    
    container.appendChild(this.canvas);
    
    if (this.config.interactive) {
      this.addCanvasInteractivity();
    }
  }

  private initializeSVG(container: HTMLElement): void {
    this.svgContainer = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    this.svgContainer.setAttribute('width', this.config.width.toString());
    this.svgContainer.setAttribute('height', this.config.height.toString());
    this.svgContainer.style.border = '1px solid #dee2e6';
    
    container.appendChild(this.svgContainer);
    
    if (this.config.interactive) {
      this.addSVGInteractivity();
    }
  }

  private renderToCanvas(elements: RenderElement[]): void {
    if (!this.context) return;

    // Clear canvas
    this.context.clearRect(0, 0, this.config.width, this.config.height);

    // Render elements
    elements.forEach(element => {
      this.drawCanvasElement(element);
    });
  }

  private renderToSVG(elements: RenderElement[]): void {
    if (!this.svgContainer) return;

    // Clear SVG
    this.svgContainer.innerHTML = '';

    // Render elements
    elements.forEach(element => {
      const svgElement = this.createSVGElement(element);
      this.svgContainer!.appendChild(svgElement);
    });
  }

  private drawCanvasElement(element: RenderElement): void {
    if (!this.context) return;

    this.context.save();

    switch (element.type) {
      case 'node':
        this.drawCanvasNode(element);
        break;
      case 'edge':
        this.drawCanvasEdge(element);
        break;
      case 'label':
        this.drawCanvasLabel(element);
        break;
      case 'arrow':
        this.drawCanvasArrow(element);
        break;
    }

    this.context.restore();
  }

  private drawCanvasNode(element: RenderElement): void {
    if (!this.context) return;

    const { position, size, style } = element;
    const width = size?.width || 40;
    const height = size?.height || 40;
    const radius = style.borderRadius || 0;

    // Fill
    this.context.fillStyle = style.fill;
    if (radius > 0) {
      this.drawRoundedRect(position.x, position.y, width, height, radius);
      this.context.fill();
    } else {
      this.context.fillRect(position.x, position.y, width, height);
    }

    // Stroke
    if (style.strokeWidth > 0) {
      this.context.strokeStyle = style.stroke;
      this.context.lineWidth = style.strokeWidth;
      if (radius > 0) {
        this.drawRoundedRect(position.x, position.y, width, height, radius);
        this.context.stroke();
      } else {
        this.context.strokeRect(position.x, position.y, width, height);
      }
    }
  }

  private drawCanvasEdge(element: RenderElement): void {
    if (!this.context) return;

    const { position, size, style } = element;
    
    this.context.strokeStyle = style.stroke;
    this.context.lineWidth = style.strokeWidth;
    this.context.globalAlpha = style.opacity;

    this.context.beginPath();
    this.context.moveTo(position.x, position.y);
    this.context.lineTo(position.x + (size?.width || 0), position.y + (size?.height || 0));
    this.context.stroke();
  }

  private drawCanvasLabel(element: RenderElement): void {
    if (!this.context) return;

    const { position, style, content } = element;
    
    this.context.fillStyle = style.fill;
    this.context.font = `${style.fontWeight || 'normal'} ${style.fontSize || 16}px ${style.fontFamily || 'sans-serif'}`;
    this.context.textAlign = 'center';
    this.context.textBaseline = 'middle';
    this.context.globalAlpha = style.opacity;

    if (style.strokeWidth > 0) {
      this.context.strokeStyle = style.stroke;
      this.context.lineWidth = style.strokeWidth;
      this.context.strokeText(content?.toString() || '', position.x, position.y);
    }

    this.context.fillText(content?.toString() || '', position.x, position.y);
  }

  private drawCanvasArrow(element: RenderElement): void {
    if (!this.context) return;

    const { position, style } = element;
    
    this.context.fillStyle = style.fill;
    this.context.strokeStyle = style.stroke;
    this.context.lineWidth = style.strokeWidth;
    this.context.globalAlpha = style.opacity;

    // Simple arrow implementation
    this.context.beginPath();
    this.context.moveTo(position.x - 10, position.y - 5);
    this.context.lineTo(position.x, position.y);
    this.context.lineTo(position.x - 10, position.y + 5);
    this.context.closePath();
    this.context.fill();
  }

  private createSVGElement(element: RenderElement): SVGElement {
    let svgElement: SVGElement;

    switch (element.type) {
      case 'node':
        svgElement = this.createSVGNode(element);
        break;
      case 'edge':
        svgElement = this.createSVGEdge(element);
        break;
      case 'label':
        svgElement = this.createSVGLabel(element);
        break;
      case 'arrow':
        svgElement = this.createSVGArrow(element);
        break;
      default:
        svgElement = document.createElementNS('http://www.w3.org/2000/svg', 'g');
    }

    svgElement.id = element.id;
    return svgElement;
  }

  private createSVGNode(element: RenderElement): SVGElement {
    const { position, size, style } = element;
    const width = size?.width || 40;
    const height = size?.height || 40;

    const rect = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
    rect.setAttribute('x', position.x.toString());
    rect.setAttribute('y', position.y.toString());
    rect.setAttribute('width', width.toString());
    rect.setAttribute('height', height.toString());
    rect.setAttribute('fill', style.fill);
    rect.setAttribute('stroke', style.stroke);
    rect.setAttribute('stroke-width', style.strokeWidth.toString());
    
    if (style.borderRadius) {
      rect.setAttribute('rx', style.borderRadius.toString());
      rect.setAttribute('ry', style.borderRadius.toString());
    }

    return rect;
  }

  private createSVGEdge(element: RenderElement): SVGElement {
    const { position, size, style } = element;
    
    const line = document.createElementNS('http://www.w3.org/2000/svg', 'line');
    line.setAttribute('x1', position.x.toString());
    line.setAttribute('y1', position.y.toString());
    line.setAttribute('x2', (position.x + (size?.width || 0)).toString());
    line.setAttribute('y2', (position.y + (size?.height || 0)).toString());
    line.setAttribute('stroke', style.stroke);
    line.setAttribute('stroke-width', style.strokeWidth.toString());
    line.setAttribute('opacity', style.opacity.toString());

    return line;
  }

  private createSVGLabel(element: RenderElement): SVGElement {
    const { position, style, content } = element;
    
    const text = document.createElementNS('http://www.w3.org/2000/svg', 'text');
    text.setAttribute('x', position.x.toString());
    text.setAttribute('y', position.y.toString());
    text.setAttribute('fill', style.fill);
    text.setAttribute('font-size', (style.fontSize || 16).toString());
    text.setAttribute('font-family', style.fontFamily || 'sans-serif');
    text.setAttribute('font-weight', style.fontWeight || 'normal');
    text.setAttribute('text-anchor', 'middle');
    text.setAttribute('dominant-baseline', 'middle');
    text.setAttribute('opacity', style.opacity.toString());
    
    if (style.strokeWidth > 0) {
      text.setAttribute('stroke', style.stroke);
      text.setAttribute('stroke-width', style.strokeWidth.toString());
    }

    text.textContent = content?.toString() || '';

    return text;
  }

  private createSVGArrow(element: RenderElement): SVGElement {
    const { position, style } = element;
    
    const polygon = document.createElementNS('http://www.w3.org/2000/svg', 'polygon');
    const points = [
      `${position.x - 10},${position.y - 5}`,
      `${position.x},${position.y}`,
      `${position.x - 10},${position.y + 5}`
    ].join(' ');
    
    polygon.setAttribute('points', points);
    polygon.setAttribute('fill', style.fill);
    polygon.setAttribute('stroke', style.stroke);
    polygon.setAttribute('stroke-width', style.strokeWidth.toString());
    polygon.setAttribute('opacity', style.opacity.toString());

    return polygon;
  }

  private drawRoundedRect(x: number, y: number, width: number, height: number, radius: number): void {
    if (!this.context) return;

    this.context.beginPath();
    this.context.moveTo(x + radius, y);
    this.context.lineTo(x + width - radius, y);
    this.context.quadraticCurveTo(x + width, y, x + width, y + radius);
    this.context.lineTo(x + width, y + height - radius);
    this.context.quadraticCurveTo(x + width, y + height, x + width - radius, y + height);
    this.context.lineTo(x + radius, y + height);
    this.context.quadraticCurveTo(x, y + height, x, y + height - radius);
    this.context.lineTo(x, y + radius);
    this.context.quadraticCurveTo(x, y, x + radius, y);
    this.context.closePath();
  }

  private calculateTreeDimensions(root: TreeNode): { width: number; height: number; levels: number } {
    let maxLevel = 0;
    let nodeCount = 0;

    const traverse = (node: TreeNode | null, level: number) => {
      if (!node) return;
      maxLevel = Math.max(maxLevel, level);
      nodeCount++;
      traverse(node.left, level + 1);
      traverse(node.right, level + 1);
    };

    traverse(root, 0);

    return {
      width: Math.pow(2, maxLevel) * 60,
      height: (maxLevel + 1) * 80,
      levels: maxLevel + 1
    };
  }

  private calculateGraphLayout(
    nodes: GraphNode[],
    edges: GraphEdge[],
    layout: 'force' | 'circle' | 'grid' | 'custom'
  ): { [nodeId: string]: { x: number; y: number } } {
    const positions: { [nodeId: string]: { x: number; y: number } } = {};

    switch (layout) {
      case 'circle':
        const centerX = this.config.width / 2;
        const centerY = this.config.height / 2;
        const radius = Math.min(centerX, centerY) - 100;
        
        nodes.forEach((node, index) => {
          const angle = (2 * Math.PI * index) / nodes.length;
          positions[node.id] = {
            x: centerX + radius * Math.cos(angle),
            y: centerY + radius * Math.sin(angle)
          };
        });
        break;

      case 'grid':
        const cols = Math.ceil(Math.sqrt(nodes.length));
        const spacing = Math.min(this.config.width, this.config.height) / (cols + 1);
        
        nodes.forEach((node, index) => {
          const row = Math.floor(index / cols);
          const col = index % cols;
          positions[node.id] = {
            x: spacing * (col + 1),
            y: spacing * (row + 1)
          };
        });
        break;

      case 'force':
        // Simple force-directed layout simulation
        positions[nodes[0]?.id] = { x: this.config.width / 2, y: this.config.height / 2 };
        nodes.slice(1).forEach((node, index) => {
          positions[node.id] = {
            x: Math.random() * this.config.width,
            y: Math.random() * this.config.height
          };
        });
        break;

      case 'custom':
        // Use provided positions or default
        nodes.forEach(node => {
          positions[node.id] = node.position || { x: Math.random() * this.config.width, y: Math.random() * this.config.height };
        });
        break;
    }

    return positions;
  }

  private addCanvasInteractivity(): void {
    if (!this.canvas) return;

    this.canvas.addEventListener('click', (event) => {
      const rect = this.canvas!.getBoundingClientRect();
      const x = event.clientX - rect.left;
      const y = event.clientY - rect.top;
      
      // Find clicked element
      for (const [id, element] of this.renderElements) {
        if (this.isPointInElement(x, y, element)) {
          this.emit('element:clicked', { elementId: id, element, position: { x, y } });
          break;
        }
      }
    });
  }

  private addSVGInteractivity(): void {
    if (!this.svgContainer) return;

    this.svgContainer.addEventListener('click', (event) => {
      const target = event.target as SVGElement;
      const elementId = target.id || target.parentElement?.id;
      
      if (elementId && this.renderElements.has(elementId)) {
        const element = this.renderElements.get(elementId)!;
        this.emit('element:clicked', { 
          elementId, 
          element, 
          position: { x: event.offsetX, y: event.offsetY } 
        });
      }
    });
  }

  private isPointInElement(x: number, y: number, element: RenderElement): boolean {
    const { position, size } = element;
    const width = size?.width || 40;
    const height = size?.height || 40;
    
    return x >= position.x && x <= position.x + width &&
           y >= position.y && y <= position.y + height;
  }

  private clearContainer(container: HTMLElement): void {
    container.innerHTML = '';
  }

  private getDefaultConfig(): RenderingConfig {
    return {
      width: 800,
      height: 600,
      theme: 'light',
      interactive: true,
      animations: true,
      showLabels: true,
      showIndices: false,
      layout: 'auto'
    };
  }
}

// Type definitions
interface TreeNode {
  id: string;
  value: any;
  left?: TreeNode;
  right?: TreeNode;
  position?: { x: number; y: number };
}

interface GraphNode {
  id: string;
  value: any;
  position?: { x: number; y: number };
  distance?: number;
  visited?: boolean;
}

interface GraphEdge {
  id: string;
  from: string;
  to: string;
  weight?: number;
  directed: boolean;
}