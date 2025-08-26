import { describe, it, expect, beforeEach, mock } from '@/lib/testing/TestFramework';
import { CollaborationManager } from '@/lib/CollaborationManager';

describe('CollaborationManager', () => {
  let manager: CollaborationManager;
  
  beforeEach(() => {
    manager = CollaborationManager.getInstance();
  });

  describe('Session Management', () => {
    it('should create a new collaborative session', async () => {
      const session = await manager.createSession('user123', 'problem456');
      
      expect(session).toBeDefined();
      expect(session.id).toBeTruthy();
      expect(session.hostId).toBe('user123');
      expect(session.problemId).toBe('problem456');
      expect(session.participants).toHaveLength(1);
      expect(session.status).toBe('waiting');
    });

    it('should allow users to join existing sessions', async () => {
      const session = await manager.createSession('host123', 'problem456');
      const joinResult = await manager.joinSession(session.roomId, 'user456', 'John Doe');
      
      expect(joinResult.success).toBe(true);
      expect(session.participants).toHaveLength(2);
      expect(session.participants[1].id).toBe('user456');
      expect(session.participants[1].role).toBe('participant');
    });

    it('should prevent joining full sessions', async () => {
      const session = await manager.createSession('host123', 'problem456', {
        maxParticipants: 2
      });
      
      await manager.joinSession(session.roomId, 'user1', 'User 1');
      const result = await manager.joinSession(session.roomId, 'user2', 'User 2');
      
      expect(result.success).toBe(false);
      expect(result.error).toContain('full');
    });

    it('should handle session termination correctly', async () => {
      const session = await manager.createSession('host123', 'problem456');
      await manager.joinSession(session.roomId, 'user456', 'John Doe');
      
      const terminated = await manager.endSession(session.id, 'host123');
      
      expect(terminated).toBe(true);
      expect(session.status).toBe('ended');
      expect(session.endedAt).toBeDefined();
    });
  });

  describe('Code Synchronization', () => {
    it('should update shared code', async () => {
      const session = await manager.createSession('host123', 'problem456');
      const newCode = 'function solve() { return 42; }';
      
      await manager.updateCode(session.id, 'host123', newCode, 5, 10);
      
      expect(session.sharedCode).toBe(newCode);
      expect(session.lastUpdate).toBeDefined();
    });

    it('should track cursor positions', async () => {
      const session = await manager.createSession('host123', 'problem456');
      await manager.joinSession(session.roomId, 'user456', 'John');
      
      await manager.updateCursor(session.id, 'user456', 10, 5);
      
      const participant = session.participants.find(p => p.id === 'user456');
      expect(participant?.cursor).toEqual({ line: 10, column: 5 });
    });

    it('should handle code conflicts', async () => {
      const session = await manager.createSession('host123', 'problem456');
      await manager.joinSession(session.roomId, 'user456', 'John');
      
      // Simulate concurrent edits
      await manager.updateCode(session.id, 'host123', 'code1', 0, 0);
      await manager.updateCode(session.id, 'user456', 'code2', 0, 0);
      
      // Should keep the latest update
      expect(session.sharedCode).toBe('code2');
    });
  });

  describe('Chat and Communication', () => {
    it('should handle chat messages', async () => {
      const session = await manager.createSession('host123', 'problem456', {
        allowChat: true
      });
      
      const message = await manager.sendChatMessage(
        session.id,
        'host123',
        'Hello everyone!'
      );
      
      expect(message).toBeDefined();
      expect(message.content).toBe('Hello everyone!');
      expect(message.senderId).toBe('host123');
      expect(session.chatHistory).toHaveLength(1);
    });

    it('should disable chat when not allowed', async () => {
      const session = await manager.createSession('host123', 'problem456', {
        allowChat: false
      });
      
      const message = await manager.sendChatMessage(
        session.id,
        'host123',
        'Hello!'
      );
      
      expect(message).toBeNull();
      expect(session.chatHistory).toHaveLength(0);
    });
  });

  describe('Performance and Scalability', () => {
    it('should handle multiple concurrent sessions', async () => {
      const sessions = await Promise.all([
        manager.createSession('host1', 'problem1'),
        manager.createSession('host2', 'problem2'),
        manager.createSession('host3', 'problem3')
      ]);
      
      expect(sessions).toHaveLength(3);
      sessions.forEach(session => {
        expect(session.id).toBeTruthy();
        expect(session.status).toBe('waiting');
      });
    });

    it('should clean up inactive sessions', async () => {
      const session = await manager.createSession('host123', 'problem456');
      
      // Mark all participants as disconnected
      session.participants.forEach(p => {
        p.status = 'disconnected';
        p.lastActivity = new Date(Date.now() - 1000 * 60 * 31); // 31 minutes ago
      });
      
      await manager.cleanupInactiveSessions();
      
      expect(session.status).toBe('ended');
    });
  });

  describe('Security', () => {
    it('should prevent unauthorized actions', async () => {
      const session = await manager.createSession('host123', 'problem456');
      
      // Try to end session as non-host
      const terminated = await manager.endSession(session.id, 'user456');
      
      expect(terminated).toBe(false);
      expect(session.status).toBe('waiting');
    });

    it('should validate room codes', async () => {
      const result = await manager.joinSession('invalid-room', 'user123', 'John');
      
      expect(result.success).toBe(false);
      expect(result.error).toContain('not found');
    });

    it('should sanitize chat messages', async () => {
      const session = await manager.createSession('host123', 'problem456', {
        allowChat: true
      });
      
      const message = await manager.sendChatMessage(
        session.id,
        'host123',
        '<script>alert("XSS")</script>'
      );
      
      expect(message?.content).not.toContain('<script>');
    });
  });
});