import { EventEmitter } from 'events';

interface Point {
  x: number;
  y: number;
}

interface DrawingElement {
  id: string;
  type: 'line' | 'rectangle' | 'circle' | 'text' | 'arrow' | 'freehand';
  points: Point[];
  color: string;
  strokeWidth: number;
  fillColor?: string;
  text?: string;
  fontSize?: number;
  userId: string;
  timestamp: Date;
}

interface WhiteboardSession {
  id: string;
  roomId: string;
  elements: DrawingElement[];
  participants: Map<string, ParticipantCursor>;
  history: DrawingElement[][];
  historyIndex: number;
  permissions: Map<string, Permission>;
  isLocked: boolean;
  backgroundColor: string;
  gridEnabled: boolean;
}

interface ParticipantCursor {
  userId: string;
  position: Point;
  color: string;
  lastUpdate: Date;
  isDrawing: boolean;
}

interface Permission {
  canDraw: boolean;
  canErase: boolean;
  canClear: boolean;
  isPresenter: boolean;
}

export class WhiteboardManager extends EventEmitter {
  private static instance: WhiteboardManager;
  private sessions: Map<string, WhiteboardSession> = new Map();
  private readonly MAX_HISTORY_SIZE = 50;
  private readonly CURSOR_COLORS = [
    '#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4', 
    '#FFEAA7', '#DDA0DD', '#98D8C8', '#F7DC6F'
  ];

  private constructor() {
    super();
    this.initializeCleanup();
  }

  static getInstance(): WhiteboardManager {
    if (!WhiteboardManager.instance) {
      WhiteboardManager.instance = new WhiteboardManager();
    }
    return WhiteboardManager.instance;
  }

  // Create a new whiteboard session
  async createWhiteboard(roomId: string, hostId: string): Promise<WhiteboardSession> {
    const sessionId = this.generateSessionId();
    
    const session: WhiteboardSession = {
      id: sessionId,
      roomId,
      elements: [],
      participants: new Map(),
      history: [[]],
      historyIndex: 0,
      permissions: new Map([[hostId, {
        canDraw: true,
        canErase: true,
        canClear: true,
        isPresenter: true
      }]]),
      isLocked: false,
      backgroundColor: '#FFFFFF',
      gridEnabled: true
    };

    this.sessions.set(sessionId, session);
    this.emit('whiteboard:created', { sessionId, roomId });
    
    return session;
  }

  // Add participant to whiteboard
  async joinWhiteboard(
    sessionId: string, 
    userId: string, 
    userName: string
  ): Promise<{ success: boolean; cursor?: ParticipantCursor; error?: string }> {
    const session = this.sessions.get(sessionId);
    
    if (!session) {
      return { success: false, error: 'Whiteboard session not found' };
    }

    if (session.isLocked && !session.permissions.get(userId)?.isPresenter) {
      return { success: false, error: 'Whiteboard is locked' };
    }

    const cursor: ParticipantCursor = {
      userId,
      position: { x: 0, y: 0 },
      color: this.getNextCursorColor(session),
      lastUpdate: new Date(),
      isDrawing: false
    };

    session.participants.set(userId, cursor);
    
    // Set default permissions for new participant
    if (!session.permissions.has(userId)) {
      session.permissions.set(userId, {
        canDraw: true,
        canErase: false,
        canClear: false,
        isPresenter: false
      });
    }

    this.emit('participant:joined', { sessionId, userId, userName });
    this.broadcastToSession(sessionId, 'cursor:joined', cursor);
    
    return { success: true, cursor };
  }

  // Drawing operations
  async addElement(
    sessionId: string, 
    userId: string, 
    element: Omit<DrawingElement, 'id' | 'userId' | 'timestamp'>
  ): Promise<DrawingElement | null> {
    const session = this.sessions.get(sessionId);
    const permission = session?.permissions.get(userId);
    
    if (!session || !permission?.canDraw) {
      return null;
    }

    const newElement: DrawingElement = {
      ...element,
      id: this.generateElementId(),
      userId,
      timestamp: new Date()
    };

    session.elements.push(newElement);
    this.addToHistory(session);
    
    this.broadcastToSession(sessionId, 'element:added', newElement);
    this.emit('drawing:updated', { sessionId, element: newElement });
    
    return newElement;
  }

  // Batch add elements for complex drawings
  async addElements(
    sessionId: string,
    userId: string,
    elements: Omit<DrawingElement, 'id' | 'userId' | 'timestamp'>[]
  ): Promise<DrawingElement[]> {
    const session = this.sessions.get(sessionId);
    const permission = session?.permissions.get(userId);
    
    if (!session || !permission?.canDraw) {
      return [];
    }

    const newElements = elements.map(element => ({
      ...element,
      id: this.generateElementId(),
      userId,
      timestamp: new Date()
    }));

    session.elements.push(...newElements);
    this.addToHistory(session);
    
    this.broadcastToSession(sessionId, 'elements:added', newElements);
    
    return newElements;
  }

  // Update element
  async updateElement(
    sessionId: string,
    userId: string,
    elementId: string,
    updates: Partial<DrawingElement>
  ): Promise<boolean> {
    const session = this.sessions.get(sessionId);
    const permission = session?.permissions.get(userId);
    
    if (!session || !permission?.canDraw) {
      return false;
    }

    const elementIndex = session.elements.findIndex(el => el.id === elementId);
    if (elementIndex === -1) return false;

    // Check if user can edit this element
    const element = session.elements[elementIndex];
    if (element.userId !== userId && !permission.isPresenter) {
      return false;
    }

    session.elements[elementIndex] = {
      ...element,
      ...updates,
      id: elementId, // Preserve ID
      userId: element.userId, // Preserve original creator
      timestamp: new Date()
    };

    this.addToHistory(session);
    this.broadcastToSession(sessionId, 'element:updated', {
      elementId,
      updates
    });
    
    return true;
  }

  // Erase elements
  async eraseElements(
    sessionId: string,
    userId: string,
    elementIds: string[]
  ): Promise<boolean> {
    const session = this.sessions.get(sessionId);
    const permission = session?.permissions.get(userId);
    
    if (!session || !permission?.canErase) {
      return false;
    }

    session.elements = session.elements.filter(
      el => !elementIds.includes(el.id)
    );

    this.addToHistory(session);
    this.broadcastToSession(sessionId, 'elements:erased', elementIds);
    
    return true;
  }

  // Clear whiteboard
  async clearWhiteboard(
    sessionId: string,
    userId: string
  ): Promise<boolean> {
    const session = this.sessions.get(sessionId);
    const permission = session?.permissions.get(userId);
    
    if (!session || !permission?.canClear) {
      return false;
    }

    session.elements = [];
    this.addToHistory(session);
    
    this.broadcastToSession(sessionId, 'whiteboard:cleared', { userId });
    this.emit('whiteboard:cleared', { sessionId, userId });
    
    return true;
  }

  // Undo/Redo operations
  async undo(sessionId: string, userId: string): Promise<boolean> {
    const session = this.sessions.get(sessionId);
    const permission = session?.permissions.get(userId);
    
    if (!session || !permission?.canDraw || session.historyIndex <= 0) {
      return false;
    }

    session.historyIndex--;
    session.elements = [...session.history[session.historyIndex]];
    
    this.broadcastToSession(sessionId, 'history:undo', {
      elements: session.elements,
      userId
    });
    
    return true;
  }

  async redo(sessionId: string, userId: string): Promise<boolean> {
    const session = this.sessions.get(sessionId);
    const permission = session?.permissions.get(userId);
    
    if (!session || !permission?.canDraw || 
        session.historyIndex >= session.history.length - 1) {
      return false;
    }

    session.historyIndex++;
    session.elements = [...session.history[session.historyIndex]];
    
    this.broadcastToSession(sessionId, 'history:redo', {
      elements: session.elements,
      userId
    });
    
    return true;
  }

  // Cursor tracking
  async updateCursor(
    sessionId: string,
    userId: string,
    position: Point,
    isDrawing: boolean = false
  ): Promise<void> {
    const session = this.sessions.get(sessionId);
    const cursor = session?.participants.get(userId);
    
    if (!session || !cursor) return;

    cursor.position = position;
    cursor.isDrawing = isDrawing;
    cursor.lastUpdate = new Date();
    
    this.broadcastToSession(sessionId, 'cursor:moved', {
      userId,
      position,
      isDrawing
    }, userId); // Exclude sender
  }

  // Permission management
  async updatePermissions(
    sessionId: string,
    adminId: string,
    targetUserId: string,
    permissions: Partial<Permission>
  ): Promise<boolean> {
    const session = this.sessions.get(sessionId);
    const adminPermission = session?.permissions.get(adminId);
    
    if (!session || !adminPermission?.isPresenter) {
      return false;
    }

    const currentPermission = session.permissions.get(targetUserId) || {
      canDraw: true,
      canErase: false,
      canClear: false,
      isPresenter: false
    };

    session.permissions.set(targetUserId, {
      ...currentPermission,
      ...permissions
    });

    this.broadcastToSession(sessionId, 'permissions:updated', {
      userId: targetUserId,
      permissions: session.permissions.get(targetUserId)
    });
    
    return true;
  }

  // Lock/Unlock whiteboard
  async toggleLock(sessionId: string, userId: string): Promise<boolean> {
    const session = this.sessions.get(sessionId);
    const permission = session?.permissions.get(userId);
    
    if (!session || !permission?.isPresenter) {
      return false;
    }

    session.isLocked = !session.isLocked;
    
    this.broadcastToSession(sessionId, 'whiteboard:lock', {
      isLocked: session.isLocked,
      userId
    });
    
    return true;
  }

  // Export whiteboard as image data
  async exportWhiteboard(
    sessionId: string,
    format: 'svg' | 'png' | 'pdf' = 'svg'
  ): Promise<string | null> {
    const session = this.sessions.get(sessionId);
    if (!session) return null;

    // Generate SVG representation
    const svg = this.generateSVG(session);
    
    if (format === 'svg') {
      return svg;
    }
    
    // For other formats, would need additional conversion
    // This is a placeholder for the conversion logic
    return svg;
  }

  // Import whiteboard data
  async importWhiteboard(
    sessionId: string,
    userId: string,
    data: DrawingElement[]
  ): Promise<boolean> {
    const session = this.sessions.get(sessionId);
    const permission = session?.permissions.get(userId);
    
    if (!session || !permission?.isPresenter) {
      return false;
    }

    session.elements = data.map(el => ({
      ...el,
      id: this.generateElementId(),
      timestamp: new Date()
    }));

    this.addToHistory(session);
    this.broadcastToSession(sessionId, 'whiteboard:imported', {
      elements: session.elements,
      userId
    });
    
    return true;
  }

  // Grid and background settings
  async updateSettings(
    sessionId: string,
    userId: string,
    settings: {
      backgroundColor?: string;
      gridEnabled?: boolean;
    }
  ): Promise<boolean> {
    const session = this.sessions.get(sessionId);
    const permission = session?.permissions.get(userId);
    
    if (!session || !permission?.isPresenter) {
      return false;
    }

    if (settings.backgroundColor) {
      session.backgroundColor = settings.backgroundColor;
    }
    if (settings.gridEnabled !== undefined) {
      session.gridEnabled = settings.gridEnabled;
    }

    this.broadcastToSession(sessionId, 'settings:updated', settings);
    
    return true;
  }

  // Helper methods
  private addToHistory(session: WhiteboardSession): void {
    // Remove any redo history when new action is performed
    if (session.historyIndex < session.history.length - 1) {
      session.history = session.history.slice(0, session.historyIndex + 1);
    }

    // Add current state to history
    session.history.push([...session.elements]);
    session.historyIndex++;

    // Limit history size
    if (session.history.length > this.MAX_HISTORY_SIZE) {
      session.history.shift();
      session.historyIndex--;
    }
  }

  private generateSVG(session: WhiteboardSession): string {
    let svg = `<svg xmlns="http://www.w3.org/2000/svg" width="1920" height="1080" style="background-color: ${session.backgroundColor}">`;
    
    if (session.gridEnabled) {
      svg += this.generateGridPattern();
    }

    for (const element of session.elements) {
      svg += this.elementToSVG(element);
    }
    
    svg += '</svg>';
    return svg;
  }

  private generateGridPattern(): string {
    return `
      <defs>
        <pattern id="grid" width="20" height="20" patternUnits="userSpaceOnUse">
          <path d="M 20 0 L 0 0 0 20" fill="none" stroke="rgba(0,0,0,0.1)" stroke-width="1"/>
        </pattern>
      </defs>
      <rect width="100%" height="100%" fill="url(#grid)" />
    `;
  }

  private elementToSVG(element: DrawingElement): string {
    switch (element.type) {
      case 'line':
        return `<line x1="${element.points[0].x}" y1="${element.points[0].y}" 
                      x2="${element.points[1].x}" y2="${element.points[1].y}" 
                      stroke="${element.color}" stroke-width="${element.strokeWidth}"/>`;
      
      case 'rectangle':
        const width = element.points[1].x - element.points[0].x;
        const height = element.points[1].y - element.points[0].y;
        return `<rect x="${element.points[0].x}" y="${element.points[0].y}" 
                      width="${width}" height="${height}" 
                      stroke="${element.color}" stroke-width="${element.strokeWidth}"
                      fill="${element.fillColor || 'none'}"/>`;
      
      case 'circle':
        const radius = Math.sqrt(
          Math.pow(element.points[1].x - element.points[0].x, 2) +
          Math.pow(element.points[1].y - element.points[0].y, 2)
        );
        return `<circle cx="${element.points[0].x}" cy="${element.points[0].y}" 
                        r="${radius}" 
                        stroke="${element.color}" stroke-width="${element.strokeWidth}"
                        fill="${element.fillColor || 'none'}"/>`;
      
      case 'text':
        return `<text x="${element.points[0].x}" y="${element.points[0].y}" 
                      font-size="${element.fontSize || 16}" 
                      fill="${element.color}">${element.text || ''}</text>`;
      
      case 'freehand':
        const path = element.points
          .map((p, i) => (i === 0 ? `M ${p.x} ${p.y}` : `L ${p.x} ${p.y}`))
          .join(' ');
        return `<path d="${path}" stroke="${element.color}" 
                      stroke-width="${element.strokeWidth}" fill="none"/>`;
      
      default:
        return '';
    }
  }

  private broadcastToSession(
    sessionId: string,
    event: string,
    data: any,
    excludeUserId?: string
  ): void {
    const session = this.sessions.get(sessionId);
    if (!session) return;

    session.participants.forEach((cursor, userId) => {
      if (userId !== excludeUserId) {
        this.emit(`session:${sessionId}:${event}`, { userId, data });
      }
    });
  }

  private getNextCursorColor(session: WhiteboardSession): string {
    const usedColors = Array.from(session.participants.values())
      .map(c => c.color);
    
    const availableColors = this.CURSOR_COLORS.filter(
      color => !usedColors.includes(color)
    );
    
    return availableColors.length > 0 
      ? availableColors[0] 
      : this.CURSOR_COLORS[Math.floor(Math.random() * this.CURSOR_COLORS.length)];
  }

  private generateSessionId(): string {
    return `wb_${Date.now()}_${Math.random().toString(36).substring(2, 11)}`;
  }

  private generateElementId(): string {
    return `el_${Date.now()}_${Math.random().toString(36).substring(2, 11)}`;
  }

  private initializeCleanup(): void {
    // Clean up inactive sessions every hour
    setInterval(() => {
      const now = Date.now();
      this.sessions.forEach((session, sessionId) => {
        const lastActivity = Math.max(
          ...Array.from(session.participants.values())
            .map(c => c.lastUpdate.getTime())
        );
        
        // Remove sessions inactive for more than 2 hours
        if (now - lastActivity > 2 * 60 * 60 * 1000) {
          this.sessions.delete(sessionId);
          this.emit('session:expired', sessionId);
        }
      });
    }, 60 * 60 * 1000);
  }

  // Get session data
  getSession(sessionId: string): WhiteboardSession | undefined {
    return this.sessions.get(sessionId);
  }

  // Get all active sessions
  getActiveSessions(): string[] {
    return Array.from(this.sessions.keys());
  }
}