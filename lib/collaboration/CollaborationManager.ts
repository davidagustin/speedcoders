import { EventEmitter } from 'events';

interface Participant {
  id: string;
  name: string;
  avatar?: string;
  isOnline: boolean;
  cursor?: { x: number; y: number };
  selection?: { start: number; end: number };
  color: string;
}

interface CollaborationSession {
  id: string;
  problemId: number;
  participants: Map<string, Participant>;
  code: string;
  language: string;
  chat: ChatMessage[];
  createdAt: Date;
  isActive: boolean;
}

interface ChatMessage {
  id: string;
  userId: string;
  userName: string;
  message: string;
  timestamp: Date;
  type: 'text' | 'code' | 'system';
}

interface CodeChange {
  userId: string;
  operation: 'insert' | 'delete' | 'replace';
  position: number;
  content?: string;
  length?: number;
  timestamp: Date;
}

export class CollaborationManager extends EventEmitter {
  private sessions: Map<string, CollaborationSession> = new Map();
  private userSessions: Map<string, Set<string>> = new Map();
  private operationHistory: Map<string, CodeChange[]> = new Map();
  private readonly MAX_PARTICIPANTS = 4;
  private readonly COLORS = [
    '#FF6B6B', '#4ECDC4', '#45B7D1', '#FFA07A',
    '#98D8C8', '#FFD93D', '#6BCB77', '#9B59B6'
  ];

  createSession(
    problemId: number,
    hostId: string,
    hostName: string
  ): string {
    const sessionId = this.generateSessionId();
    const session: CollaborationSession = {
      id: sessionId,
      problemId,
      participants: new Map(),
      code: '',
      language: 'javascript',
      chat: [],
      createdAt: new Date(),
      isActive: true
    };

    // Add host as first participant
    const host: Participant = {
      id: hostId,
      name: hostName,
      isOnline: true,
      color: this.COLORS[0]
    };
    session.participants.set(hostId, host);

    this.sessions.set(sessionId, session);
    this.addUserSession(hostId, sessionId);
    this.operationHistory.set(sessionId, []);

    this.emit('sessionCreated', { sessionId, hostId });
    return sessionId;
  }

  joinSession(
    sessionId: string,
    userId: string,
    userName: string
  ): { success: boolean; error?: string } {
    const session = this.sessions.get(sessionId);
    
    if (!session) {
      return { success: false, error: 'Session not found' };
    }

    if (!session.isActive) {
      return { success: false, error: 'Session is no longer active' };
    }

    if (session.participants.size >= this.MAX_PARTICIPANTS) {
      return { success: false, error: 'Session is full' };
    }

    if (session.participants.has(userId)) {
      return { success: true }; // Already in session
    }

    const participant: Participant = {
      id: userId,
      name: userName,
      isOnline: true,
      color: this.COLORS[session.participants.size]
    };

    session.participants.set(userId, participant);
    this.addUserSession(userId, sessionId);

    // Notify other participants
    this.broadcastToSession(sessionId, 'userJoined', {
      user: participant
    }, userId);

    // Add system message to chat
    this.addChatMessage(sessionId, {
      id: this.generateMessageId(),
      userId: 'system',
      userName: 'System',
      message: `${userName} joined the session`,
      timestamp: new Date(),
      type: 'system'
    });

    this.emit('userJoined', { sessionId, userId, userName });
    return { success: true };
  }

  leaveSession(sessionId: string, userId: string): void {
    const session = this.sessions.get(sessionId);
    if (!session) return;

    const participant = session.participants.get(userId);
    if (!participant) return;

    session.participants.delete(userId);
    this.removeUserSession(userId, sessionId);

    // Notify other participants
    this.broadcastToSession(sessionId, 'userLeft', {
      userId,
      userName: participant.name
    }, userId);

    // Add system message
    this.addChatMessage(sessionId, {
      id: this.generateMessageId(),
      userId: 'system',
      userName: 'System',
      message: `${participant.name} left the session`,
      timestamp: new Date(),
      type: 'system'
    });

    // Close session if empty
    if (session.participants.size === 0) {
      this.closeSession(sessionId);
    }

    this.emit('userLeft', { sessionId, userId });
  }

  updateCode(
    sessionId: string,
    userId: string,
    change: Omit<CodeChange, 'userId' | 'timestamp'>
  ): void {
    const session = this.sessions.get(sessionId);
    if (!session || !session.participants.has(userId)) return;

    const codeChange: CodeChange = {
      ...change,
      userId,
      timestamp: new Date()
    };

    // Apply change to session code
    session.code = this.applyCodeChange(session.code, codeChange);

    // Store in history
    const history = this.operationHistory.get(sessionId) || [];
    history.push(codeChange);
    if (history.length > 1000) {
      history.shift(); // Keep last 1000 operations
    }

    // Broadcast to other participants
    this.broadcastToSession(sessionId, 'codeChanged', codeChange, userId);
    this.emit('codeChanged', { sessionId, userId, change: codeChange });
  }

  updateCursor(
    sessionId: string,
    userId: string,
    cursor: { x: number; y: number }
  ): void {
    const session = this.sessions.get(sessionId);
    if (!session) return;

    const participant = session.participants.get(userId);
    if (!participant) return;

    participant.cursor = cursor;

    // Broadcast cursor position
    this.broadcastToSession(sessionId, 'cursorMoved', {
      userId,
      cursor,
      color: participant.color
    }, userId);
  }

  updateSelection(
    sessionId: string,
    userId: string,
    selection: { start: number; end: number }
  ): void {
    const session = this.sessions.get(sessionId);
    if (!session) return;

    const participant = session.participants.get(userId);
    if (!participant) return;

    participant.selection = selection;

    // Broadcast selection
    this.broadcastToSession(sessionId, 'selectionChanged', {
      userId,
      selection,
      color: participant.color
    }, userId);
  }

  sendChatMessage(
    sessionId: string,
    userId: string,
    message: string,
    type: 'text' | 'code' = 'text'
  ): void {
    const session = this.sessions.get(sessionId);
    if (!session) return;

    const participant = session.participants.get(userId);
    if (!participant) return;

    const chatMessage: ChatMessage = {
      id: this.generateMessageId(),
      userId,
      userName: participant.name,
      message,
      timestamp: new Date(),
      type
    };

    this.addChatMessage(sessionId, chatMessage);

    // Broadcast message
    this.broadcastToSession(sessionId, 'chatMessage', chatMessage);
    this.emit('chatMessage', { sessionId, message: chatMessage });
  }

  getSession(sessionId: string): CollaborationSession | undefined {
    return this.sessions.get(sessionId);
  }

  getUserSessions(userId: string): string[] {
    return Array.from(this.userSessions.get(userId) || []);
  }

  getSessionHistory(sessionId: string): CodeChange[] {
    return this.operationHistory.get(sessionId) || [];
  }

  // Conflict Resolution using Operational Transform
  resolveConflict(
    sessionId: string,
    localOp: CodeChange,
    remoteOp: CodeChange
  ): CodeChange {
    // Simple operational transform for concurrent edits
    if (localOp.operation === 'insert' && remoteOp.operation === 'insert') {
      if (localOp.position < remoteOp.position) {
        return localOp;
      } else if (localOp.position > remoteOp.position) {
        return {
          ...localOp,
          position: localOp.position + (remoteOp.content?.length || 0)
        };
      } else {
        // Same position - use timestamp to determine order
        return localOp.timestamp < remoteOp.timestamp ? localOp : {
          ...localOp,
          position: localOp.position + (remoteOp.content?.length || 0)
        };
      }
    }

    if (localOp.operation === 'delete' && remoteOp.operation === 'delete') {
      if (localOp.position < remoteOp.position) {
        return localOp;
      } else if (localOp.position > remoteOp.position) {
        return {
          ...localOp,
          position: Math.max(0, localOp.position - (remoteOp.length || 0))
        };
      }
    }

    // For more complex cases, return local operation
    return localOp;
  }

  private applyCodeChange(code: string, change: CodeChange): string {
    switch (change.operation) {
      case 'insert':
        return code.slice(0, change.position) + 
               (change.content || '') + 
               code.slice(change.position);
      
      case 'delete':
        return code.slice(0, change.position) + 
               code.slice(change.position + (change.length || 0));
      
      case 'replace':
        return code.slice(0, change.position) + 
               (change.content || '') + 
               code.slice(change.position + (change.length || 0));
      
      default:
        return code;
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

    session.participants.forEach((participant, userId) => {
      if (userId !== excludeUserId && participant.isOnline) {
        this.emit(`session:${sessionId}:${userId}:${event}`, data);
      }
    });
  }

  private addChatMessage(sessionId: string, message: ChatMessage): void {
    const session = this.sessions.get(sessionId);
    if (!session) return;

    session.chat.push(message);
    
    // Keep last 100 messages
    if (session.chat.length > 100) {
      session.chat.shift();
    }
  }

  private addUserSession(userId: string, sessionId: string): void {
    if (!this.userSessions.has(userId)) {
      this.userSessions.set(userId, new Set());
    }
    this.userSessions.get(userId)!.add(sessionId);
  }

  private removeUserSession(userId: string, sessionId: string): void {
    const sessions = this.userSessions.get(userId);
    if (sessions) {
      sessions.delete(sessionId);
      if (sessions.size === 0) {
        this.userSessions.delete(userId);
      }
    }
  }

  private closeSession(sessionId: string): void {
    const session = this.sessions.get(sessionId);
    if (!session) return;

    session.isActive = false;
    
    // Clean up after 1 hour
    setTimeout(() => {
      this.sessions.delete(sessionId);
      this.operationHistory.delete(sessionId);
    }, 60 * 60 * 1000);

    this.emit('sessionClosed', { sessionId });
  }

  private generateSessionId(): string {
    return `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  private generateMessageId(): string {
    return `msg_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }
}

// Singleton instance
export const collaborationManager = new CollaborationManager();