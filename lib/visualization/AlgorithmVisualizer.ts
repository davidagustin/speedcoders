import { EventEmitter } from 'events';

interface VisualizationStep {
  id: string;
  timestamp: number;
  action: string;
  description: string;
  data: any;
  highlights: string[];
  annotations: Annotation[];
  duration: number;
  metadata?: { [key: string]: any };
}

interface Annotation {
  id: string;
  type: 'arrow' | 'highlight' | 'label' | 'tooltip' | 'line' | 'box';
  position: Position;
  text: string;
  color: string;
  style?: { [key: string]: any };
}

interface Position {
  x: number;
  y: number;
  width?: number;
  height?: number;
}

interface VisualizationState {
  currentStep: number;
  totalSteps: number;
  isPlaying: boolean;
  playbackSpeed: number;
  data: any;
  history: VisualizationStep[];
}

interface DataStructure {
  type: 'array' | 'tree' | 'graph' | 'stack' | 'queue' | 'heap' | 'linkedlist' | 'hashtable';
  data: any;
  metadata: { [key: string]: any };
}

interface TreeNode {
  id: string;
  value: any;
  left?: TreeNode;
  right?: TreeNode;
  parent?: TreeNode;
  level: number;
  position: Position;
  style?: { [key: string]: any };
}

interface GraphNode {
  id: string;
  value: any;
  position: Position;
  edges: GraphEdge[];
  visited?: boolean;
  distance?: number;
  style?: { [key: string]: any };
}

interface GraphEdge {
  id: string;
  from: string;
  to: string;
  weight?: number;
  directed: boolean;
  style?: { [key: string]: any };
}

interface ArrayElement {
  index: number;
  value: any;
  highlighted?: boolean;
  style?: { [key: string]: any };
}

interface VisualizationConfig {
  theme: 'light' | 'dark' | 'colorful';
  animation: {
    duration: number;
    easing: 'linear' | 'ease-in' | 'ease-out' | 'ease-in-out';
    staggerDelay: number;
  };
  layout: {
    spacing: number;
    padding: number;
    nodeSize: number;
    fontSize: number;
  };
  colors: {
    primary: string;
    secondary: string;
    accent: string;
    background: string;
    text: string;
    highlight: string;
    visited: string;
    current: string;
  };
  interactive: boolean;
  showCode: boolean;
  showComplexity: boolean;
  showStepCounter: boolean;
}

export class AlgorithmVisualizer extends EventEmitter {
  private static instance: AlgorithmVisualizer;
  private visualizations: Map<string, VisualizationState> = new Map();
  private algorithms: Map<string, AlgorithmDefinition> = new Map();
  private config: VisualizationConfig;

  private constructor() {
    super();
    this.config = this.getDefaultConfig();
    this.initializeBuiltInAlgorithms();
  }

  static getInstance(): AlgorithmVisualizer {
    if (!AlgorithmVisualizer.instance) {
      AlgorithmVisualizer.instance = new AlgorithmVisualizer();
    }
    return AlgorithmVisualizer.instance;
  }

  // Create a new visualization
  async createVisualization(
    algorithmName: string,
    initialData: any,
    options?: Partial<VisualizationConfig>
  ): Promise<string> {
    const visualizationId = this.generateId();
    const algorithm = this.algorithms.get(algorithmName);
    
    if (!algorithm) {
      throw new Error(`Algorithm "${algorithmName}" not found`);
    }

    const config = { ...this.config, ...options };
    const state: VisualizationState = {
      currentStep: 0,
      totalSteps: 0,
      isPlaying: false,
      playbackSpeed: 1.0,
      data: this.cloneData(initialData),
      history: []
    };

    this.visualizations.set(visualizationId, state);

    // Initialize the algorithm
    const steps = await algorithm.initialize(initialData, config);
    state.history = steps;
    state.totalSteps = steps.length;

    this.emit('visualization:created', {
      id: visualizationId,
      algorithm: algorithmName,
      totalSteps: steps.length
    });

    return visualizationId;
  }

  // Sorting algorithms
  async visualizeBubbleSort(array: number[]): Promise<string> {
    const visualizationId = await this.createVisualization('bubbleSort', array);
    const state = this.visualizations.get(visualizationId)!;
    const steps: VisualizationStep[] = [];
    const arr = [...array];
    let stepId = 0;

    for (let i = 0; i < arr.length - 1; i++) {
      for (let j = 0; j < arr.length - i - 1; j++) {
        // Compare step
        steps.push({
          id: `step-${stepId++}`,
          timestamp: Date.now(),
          action: 'compare',
          description: `Comparing ${arr[j]} and ${arr[j + 1]}`,
          data: [...arr],
          highlights: [j.toString(), (j + 1).toString()],
          annotations: [
            {
              id: `compare-${j}`,
              type: 'highlight',
              position: { x: j * 60, y: 50 },
              text: `${arr[j]} vs ${arr[j + 1]}`,
              color: '#ff6b6b'
            }
          ],
          duration: 1000
        });

        if (arr[j] > arr[j + 1]) {
          // Swap step
          [arr[j], arr[j + 1]] = [arr[j + 1], arr[j]];
          steps.push({
            id: `step-${stepId++}`,
            timestamp: Date.now(),
            action: 'swap',
            description: `Swapping ${arr[j + 1]} and ${arr[j]}`,
            data: [...arr],
            highlights: [j.toString(), (j + 1).toString()],
            annotations: [
              {
                id: `swap-${j}`,
                type: 'arrow',
                position: { x: j * 60, y: 30 },
                text: 'Swap',
                color: '#51cf66'
              }
            ],
            duration: 1500
          });
        }
      }

      // Mark as sorted
      steps.push({
        id: `step-${stepId++}`,
        timestamp: Date.now(),
        action: 'sorted',
        description: `Position ${arr.length - i - 1} is now in its final position`,
        data: [...arr],
        highlights: [(arr.length - i - 1).toString()],
        annotations: [
          {
            id: `sorted-${arr.length - i - 1}`,
            type: 'highlight',
            position: { x: (arr.length - i - 1) * 60, y: 50 },
            text: 'Sorted',
            color: '#339af0'
          }
        ],
        duration: 800
      });
    }

    state.history = steps;
    state.totalSteps = steps.length;

    return visualizationId;
  }

  async visualizeQuickSort(array: number[]): Promise<string> {
    const visualizationId = await this.createVisualization('quickSort', array);
    const state = this.visualizations.get(visualizationId)!;
    const steps: VisualizationStep[] = [];
    const arr = [...array];
    let stepId = 0;

    const quickSort = (arr: number[], low: number, high: number) => {
      if (low < high) {
        const pi = partition(arr, low, high);
        quickSort(arr, low, pi - 1);
        quickSort(arr, pi + 1, high);
      }
    };

    const partition = (arr: number[], low: number, high: number): number => {
      const pivot = arr[high];
      
      steps.push({
        id: `step-${stepId++}`,
        timestamp: Date.now(),
        action: 'select_pivot',
        description: `Selected pivot: ${pivot}`,
        data: [...arr],
        highlights: [high.toString()],
        annotations: [
          {
            id: `pivot-${high}`,
            type: 'highlight',
            position: { x: high * 60, y: 50 },
            text: `Pivot: ${pivot}`,
            color: '#ffd43b'
          }
        ],
        duration: 1000
      });

      let i = low - 1;

      for (let j = low; j <= high - 1; j++) {
        steps.push({
          id: `step-${stepId++}`,
          timestamp: Date.now(),
          action: 'compare_with_pivot',
          description: `Comparing ${arr[j]} with pivot ${pivot}`,
          data: [...arr],
          highlights: [j.toString(), high.toString()],
          annotations: [
            {
              id: `compare-${j}`,
              type: 'highlight',
              position: { x: j * 60, y: 30 },
              text: `${arr[j]} ${arr[j] <= pivot ? '<=' : '>'} ${pivot}`,
              color: arr[j] <= pivot ? '#51cf66' : '#ff6b6b'
            }
          ],
          duration: 800
        });

        if (arr[j] <= pivot) {
          i++;
          [arr[i], arr[j]] = [arr[j], arr[i]];
          
          if (i !== j) {
            steps.push({
              id: `step-${stepId++}`,
              timestamp: Date.now(),
              action: 'swap',
              description: `Swapping ${arr[j]} and ${arr[i]}`,
              data: [...arr],
              highlights: [i.toString(), j.toString()],
              annotations: [
                {
                  id: `swap-${i}-${j}`,
                  type: 'arrow',
                  position: { x: Math.min(i, j) * 60, y: 20 },
                  text: 'Swap',
                  color: '#51cf66'
                }
              ],
              duration: 1200
            });
          }
        }
      }

      [arr[i + 1], arr[high]] = [arr[high], arr[i + 1]];
      
      steps.push({
        id: `step-${stepId++}`,
        timestamp: Date.now(),
        action: 'place_pivot',
        description: `Placing pivot ${pivot} in its correct position`,
        data: [...arr],
        highlights: [(i + 1).toString()],
        annotations: [
          {
            id: `pivot-placed-${i + 1}`,
            type: 'highlight',
            position: { x: (i + 1) * 60, y: 50 },
            text: 'Pivot in place',
            color: '#339af0'
          }
        ],
        duration: 1000
      });

      return i + 1;
    };

    quickSort(arr, 0, arr.length - 1);

    state.history = steps;
    state.totalSteps = steps.length;

    return visualizationId;
  }

  // Tree traversal algorithms
  async visualizeBinaryTreeTraversal(
    tree: TreeNode,
    traversalType: 'inorder' | 'preorder' | 'postorder'
  ): Promise<string> {
    const visualizationId = await this.createVisualization(`${traversalType}Traversal`, tree);
    const state = this.visualizations.get(visualizationId)!;
    const steps: VisualizationStep[] = [];
    let stepId = 0;
    const result: any[] = [];

    const traverse = (node: TreeNode | undefined) => {
      if (!node) return;

      steps.push({
        id: `step-${stepId++}`,
        timestamp: Date.now(),
        action: 'visit',
        description: `Visiting node ${node.value}`,
        data: this.cloneTree(tree),
        highlights: [node.id],
        annotations: [
          {
            id: `visit-${node.id}`,
            type: 'highlight',
            position: node.position,
            text: `Visit: ${node.value}`,
            color: '#ffd43b'
          }
        ],
        duration: 1000,
        metadata: { currentResult: [...result] }
      });

      if (traversalType === 'preorder') {
        result.push(node.value);
        steps.push({
          id: `step-${stepId++}`,
          timestamp: Date.now(),
          action: 'add_to_result',
          description: `Adding ${node.value} to result`,
          data: this.cloneTree(tree),
          highlights: [node.id],
          annotations: [
            {
              id: `add-${node.id}`,
              type: 'highlight',
              position: node.position,
              text: `Added: ${node.value}`,
              color: '#51cf66'
            }
          ],
          duration: 800,
          metadata: { currentResult: [...result] }
        });
      }

      if (node.left) traverse(node.left);

      if (traversalType === 'inorder') {
        result.push(node.value);
        steps.push({
          id: `step-${stepId++}`,
          timestamp: Date.now(),
          action: 'add_to_result',
          description: `Adding ${node.value} to result`,
          data: this.cloneTree(tree),
          highlights: [node.id],
          annotations: [
            {
              id: `add-${node.id}`,
              type: 'highlight',
              position: node.position,
              text: `Added: ${node.value}`,
              color: '#51cf66'
            }
          ],
          duration: 800,
          metadata: { currentResult: [...result] }
        });
      }

      if (node.right) traverse(node.right);

      if (traversalType === 'postorder') {
        result.push(node.value);
        steps.push({
          id: `step-${stepId++}`,
          timestamp: Date.now(),
          action: 'add_to_result',
          description: `Adding ${node.value} to result`,
          data: this.cloneTree(tree),
          highlights: [node.id],
          annotations: [
            {
              id: `add-${node.id}`,
              type: 'highlight',
              position: node.position,
              text: `Added: ${node.value}`,
              color: '#51cf66'
            }
          ],
          duration: 800,
          metadata: { currentResult: [...result] }
        });
      }
    };

    traverse(tree);

    steps.push({
      id: `step-${stepId++}`,
      timestamp: Date.now(),
      action: 'complete',
      description: `${traversalType} traversal complete: ${result.join(', ')}`,
      data: this.cloneTree(tree),
      highlights: [],
      annotations: [
        {
          id: 'complete',
          type: 'label',
          position: { x: 200, y: 300 },
          text: `Result: [${result.join(', ')}]`,
          color: '#339af0'
        }
      ],
      duration: 2000,
      metadata: { finalResult: result }
    });

    state.history = steps;
    state.totalSteps = steps.length;

    return visualizationId;
  }

  // Graph algorithms
  async visualizeDijkstra(
    graph: GraphNode[],
    startNodeId: string
  ): Promise<string> {
    const visualizationId = await this.createVisualization('dijkstra', graph);
    const state = this.visualizations.get(visualizationId)!;
    const steps: VisualizationStep[] = [];
    let stepId = 0;

    const distances: { [key: string]: number } = {};
    const visited: Set<string> = new Set();
    const previous: { [key: string]: string | null } = {};

    // Initialize distances
    graph.forEach(node => {
      distances[node.id] = node.id === startNodeId ? 0 : Infinity;
      previous[node.id] = null;
    });

    steps.push({
      id: `step-${stepId++}`,
      timestamp: Date.now(),
      action: 'initialize',
      description: `Starting Dijkstra's algorithm from node ${startNodeId}`,
      data: this.cloneGraph(graph),
      highlights: [startNodeId],
      annotations: [
        {
          id: 'start',
          type: 'highlight',
          position: this.getNodePosition(graph, startNodeId),
          text: 'Start: distance = 0',
          color: '#51cf66'
        }
      ],
      duration: 1500,
      metadata: { distances: { ...distances }, visited: Array.from(visited) }
    });

    while (visited.size < graph.length) {
      // Find unvisited node with minimum distance
      let currentNode: string | null = null;
      let minDistance = Infinity;

      for (const node of graph) {
        if (!visited.has(node.id) && distances[node.id] < minDistance) {
          minDistance = distances[node.id];
          currentNode = node.id;
        }
      }

      if (currentNode === null || minDistance === Infinity) break;

      visited.add(currentNode);

      steps.push({
        id: `step-${stepId++}`,
        timestamp: Date.now(),
        action: 'select_current',
        description: `Selecting node ${currentNode} with distance ${distances[currentNode]}`,
        data: this.cloneGraph(graph),
        highlights: [currentNode],
        annotations: [
          {
            id: `current-${currentNode}`,
            type: 'highlight',
            position: this.getNodePosition(graph, currentNode),
            text: `Current: ${distances[currentNode]}`,
            color: '#ffd43b'
          }
        ],
        duration: 1000,
        metadata: { distances: { ...distances }, visited: Array.from(visited) }
      });

      // Update distances to neighbors
      const current = graph.find(n => n.id === currentNode)!;
      for (const edge of current.edges) {
        if (!visited.has(edge.to)) {
          const newDistance = distances[currentNode] + (edge.weight || 1);
          
          steps.push({
            id: `step-${stepId++}`,
            timestamp: Date.now(),
            action: 'check_neighbor',
            description: `Checking neighbor ${edge.to}: ${distances[edge.to]} vs ${newDistance}`,
            data: this.cloneGraph(graph),
            highlights: [currentNode, edge.to],
            annotations: [
              {
                id: `check-${edge.to}`,
                type: 'arrow',
                position: this.getNodePosition(graph, edge.to),
                text: `${distances[edge.to]} vs ${newDistance}`,
                color: newDistance < distances[edge.to] ? '#51cf66' : '#ff6b6b'
              }
            ],
            duration: 1000,
            metadata: { distances: { ...distances }, visited: Array.from(visited) }
          });

          if (newDistance < distances[edge.to]) {
            distances[edge.to] = newDistance;
            previous[edge.to] = currentNode;

            steps.push({
              id: `step-${stepId++}`,
              timestamp: Date.now(),
              action: 'update_distance',
              description: `Updated distance to ${edge.to}: ${newDistance}`,
              data: this.cloneGraph(graph),
              highlights: [edge.to],
              annotations: [
                {
                  id: `update-${edge.to}`,
                  type: 'highlight',
                  position: this.getNodePosition(graph, edge.to),
                  text: `New distance: ${newDistance}`,
                  color: '#51cf66'
                }
              ],
              duration: 1200,
              metadata: { distances: { ...distances }, visited: Array.from(visited) }
            });
          }
        }
      }
    }

    steps.push({
      id: `step-${stepId++}`,
      timestamp: Date.now(),
      action: 'complete',
      description: 'Dijkstra\'s algorithm completed',
      data: this.cloneGraph(graph),
      highlights: [],
      annotations: [
        {
          id: 'complete',
          type: 'label',
          position: { x: 50, y: 400 },
          text: 'Algorithm Complete',
          color: '#339af0'
        }
      ],
      duration: 2000,
      metadata: { 
        finalDistances: distances, 
        shortestPaths: previous,
        visited: Array.from(visited)
      }
    });

    state.history = steps;
    state.totalSteps = steps.length;

    return visualizationId;
  }

  // Playback controls
  async play(visualizationId: string): Promise<void> {
    const state = this.visualizations.get(visualizationId);
    if (!state) throw new Error('Visualization not found');

    state.isPlaying = true;
    this.emit('playback:started', visualizationId);

    while (state.isPlaying && state.currentStep < state.totalSteps) {
      const step = state.history[state.currentStep];
      await this.executeStep(visualizationId, step);
      state.currentStep++;
      
      const delay = step.duration / state.playbackSpeed;
      await this.sleep(delay);
      
      this.emit('step:executed', {
        visualizationId,
        step: state.currentStep,
        totalSteps: state.totalSteps
      });
    }

    state.isPlaying = false;
    this.emit('playback:finished', visualizationId);
  }

  async pause(visualizationId: string): Promise<void> {
    const state = this.visualizations.get(visualizationId);
    if (!state) throw new Error('Visualization not found');

    state.isPlaying = false;
    this.emit('playback:paused', visualizationId);
  }

  async stop(visualizationId: string): Promise<void> {
    const state = this.visualizations.get(visualizationId);
    if (!state) throw new Error('Visualization not found');

    state.isPlaying = false;
    state.currentStep = 0;
    this.emit('playback:stopped', visualizationId);
  }

  async stepForward(visualizationId: string): Promise<void> {
    const state = this.visualizations.get(visualizationId);
    if (!state) throw new Error('Visualization not found');

    if (state.currentStep < state.totalSteps) {
      const step = state.history[state.currentStep];
      await this.executeStep(visualizationId, step);
      state.currentStep++;
      
      this.emit('step:forward', {
        visualizationId,
        step: state.currentStep,
        totalSteps: state.totalSteps
      });
    }
  }

  async stepBackward(visualizationId: string): Promise<void> {
    const state = this.visualizations.get(visualizationId);
    if (!state) throw new Error('Visualization not found');

    if (state.currentStep > 0) {
      state.currentStep--;
      const step = state.history[state.currentStep];
      await this.executeStep(visualizationId, step);
      
      this.emit('step:backward', {
        visualizationId,
        step: state.currentStep,
        totalSteps: state.totalSteps
      });
    }
  }

  async jumpToStep(visualizationId: string, stepNumber: number): Promise<void> {
    const state = this.visualizations.get(visualizationId);
    if (!state) throw new Error('Visualization not found');

    if (stepNumber >= 0 && stepNumber < state.totalSteps) {
      state.currentStep = stepNumber;
      const step = state.history[stepNumber];
      await this.executeStep(visualizationId, step);
      
      this.emit('step:jumped', {
        visualizationId,
        step: state.currentStep,
        totalSteps: state.totalSteps
      });
    }
  }

  setPlaybackSpeed(visualizationId: string, speed: number): void {
    const state = this.visualizations.get(visualizationId);
    if (!state) throw new Error('Visualization not found');

    state.playbackSpeed = Math.max(0.1, Math.min(5.0, speed));
    this.emit('speed:changed', { visualizationId, speed: state.playbackSpeed });
  }

  // Export visualization
  async exportVisualization(
    visualizationId: string,
    format: 'gif' | 'mp4' | 'json' | 'svg'
  ): Promise<Blob | string> {
    const state = this.visualizations.get(visualizationId);
    if (!state) throw new Error('Visualization not found');

    switch (format) {
      case 'json':
        return JSON.stringify({
          id: visualizationId,
          steps: state.history,
          config: this.config
        }, null, 2);
      
      case 'svg':
        return this.generateSVGAnimation(state);
      
      default:
        throw new Error(`Export format "${format}" not implemented yet`);
    }
  }

  // Helper methods
  private async executeStep(visualizationId: string, step: VisualizationStep): Promise<void> {
    this.emit('step:executing', { visualizationId, step });
  }

  private generateSVGAnimation(state: VisualizationState): string {
    // Generate SVG with animation
    return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 600">
      <!-- SVG animation would be generated here -->
    </svg>`;
  }

  private cloneData(data: any): any {
    return JSON.parse(JSON.stringify(data));
  }

  private cloneTree(tree: TreeNode): TreeNode {
    return JSON.parse(JSON.stringify(tree));
  }

  private cloneGraph(graph: GraphNode[]): GraphNode[] {
    return JSON.parse(JSON.stringify(graph));
  }

  private getNodePosition(graph: GraphNode[], nodeId: string): Position {
    const node = graph.find(n => n.id === nodeId);
    return node ? node.position : { x: 0, y: 0 };
  }

  private sleep(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  private generateId(): string {
    return `viz_${Date.now()}_${Math.random().toString(36).substring(2, 11)}`;
  }

  private getDefaultConfig(): VisualizationConfig {
    return {
      theme: 'light',
      animation: {
        duration: 1000,
        easing: 'ease-in-out',
        staggerDelay: 100
      },
      layout: {
        spacing: 60,
        padding: 20,
        nodeSize: 40,
        fontSize: 14
      },
      colors: {
        primary: '#339af0',
        secondary: '#495057',
        accent: '#ffd43b',
        background: '#ffffff',
        text: '#212529',
        highlight: '#ff6b6b',
        visited: '#51cf66',
        current: '#ffd43b'
      },
      interactive: true,
      showCode: true,
      showComplexity: true,
      showStepCounter: true
    };
  }

  private initializeBuiltInAlgorithms(): void {
    // Initialize built-in algorithm definitions
    this.algorithms.set('bubbleSort', {
      name: 'Bubble Sort',
      category: 'sorting',
      timeComplexity: 'O(n²)',
      spaceComplexity: 'O(1)',
      initialize: async (data: number[], config: VisualizationConfig) => []
    });

    this.algorithms.set('quickSort', {
      name: 'Quick Sort',
      category: 'sorting',
      timeComplexity: 'O(n log n)',
      spaceComplexity: 'O(log n)',
      initialize: async (data: number[], config: VisualizationConfig) => []
    });

    this.algorithms.set('dijkstra', {
      name: 'Dijkstra\'s Algorithm',
      category: 'graph',
      timeComplexity: 'O((V + E) log V)',
      spaceComplexity: 'O(V)',
      initialize: async (data: GraphNode[], config: VisualizationConfig) => []
    });
  }
}

interface AlgorithmDefinition {
  name: string;
  category: 'sorting' | 'searching' | 'tree' | 'graph' | 'dynamic-programming';
  timeComplexity: string;
  spaceComplexity: string;
  initialize: (data: any, config: VisualizationConfig) => Promise<VisualizationStep[]>;
}