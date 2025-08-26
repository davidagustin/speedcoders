"use client";

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { 
  UserGroupIcon,
  ChatBubbleLeftIcon,
  PlayIcon,
  ShareIcon,
  UserIcon,
  CursorArrowRaysIcon
} from '@heroicons/react/24/outline';
import { collaborationManager } from '@/lib/collaboration/CollaborationManager';

interface CollaborativeEditorProps {
  problemId: number;
  initialCode?: string;
  language?: string;
  onCodeRun?: (code: string) => void;
}

interface Participant {
  id: string;
  name: string;
  color: string;
  isOnline: boolean;
  cursor?: { x: number; y: number };
  selection?: { start: number; end: number };
}

interface ChatMessage {
  id: string;
  userId: string;
  userName: string;
  message: string;
  timestamp: Date;
  type: 'text' | 'code' | 'system';
}

const CollaborativeEditor: React.FC<CollaborativeEditorProps> = ({
  problemId,
  initialCode = '',
  language = 'javascript',
  onCodeRun
}) => {
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [participants, setParticipants] = useState<Map<string, Participant>>(new Map());
  const [code, setCode] = useState(initialCode);
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [isHost, setIsHost] = useState(false);
  const [inviteLink, setInviteLink] = useState('');
  
  const editorRef = useRef<HTMLTextAreaElement>(null);
  const chatEndRef = useRef<HTMLDivElement>(null);
  const currentUserId = 'user-' + Math.random().toString(36).substr(2, 9); // In real app, get from auth

  useEffect(() => {
    // Initialize collaboration session
    const initSession = () => {
      const newSessionId = collaborationManager.createSession(
        problemId,
        currentUserId,
        'Anonymous User' // In real app, get from user context
      );
      
      setSessionId(newSessionId);
      setIsHost(true);
      setInviteLink(`${window.location.origin}/collaborate?session=${newSessionId}`);
      
      // Listen to session events
      setupEventListeners(newSessionId);
    };

    initSession();

    return () => {
      if (sessionId) {
        collaborationManager.leaveSession(sessionId, currentUserId);
      }
    };
  }, [problemId]);

  const setupEventListeners = (sessionId: string) => {
    // User joined
    collaborationManager.on('userJoined', ({ userId, userName }) => {
      const session = collaborationManager.getSession(sessionId);
      if (session) {
        setParticipants(new Map(session.participants));
      }
    });

    // User left
    collaborationManager.on('userLeft', ({ userId }) => {
      const session = collaborationManager.getSession(sessionId);
      if (session) {
        setParticipants(new Map(session.participants));
      }
    });

    // Code changed
    collaborationManager.on('codeChanged', ({ change }) => {
      if (change.userId !== currentUserId) {
        const session = collaborationManager.getSession(sessionId);
        if (session) {
          setCode(session.code);
        }
      }
    });

    // Chat message
    collaborationManager.on('chatMessage', ({ message }) => {
      setChatMessages(prev => [...prev, message]);
    });

    // Cursor moved
    collaborationManager.on(`session:${sessionId}:${currentUserId}:cursorMoved`, 
      ({ userId, cursor, color }) => {
        setParticipants(prev => {
          const updated = new Map(prev);
          const participant = updated.get(userId);
          if (participant) {
            updated.set(userId, { ...participant, cursor });
          }
          return updated;
        });
      }
    );

    // Selection changed
    collaborationManager.on(`session:${sessionId}:${currentUserId}:selectionChanged`,
      ({ userId, selection, color }) => {
        setParticipants(prev => {
          const updated = new Map(prev);
          const participant = updated.get(userId);
          if (participant) {
            updated.set(userId, { ...participant, selection });
          }
          return updated;
        });
      }
    );
  };

  const handleCodeChange = useCallback((newCode: string) => {
    if (!sessionId) return;

    const oldCode = code;
    setCode(newCode);

    // Calculate change
    if (newCode.length > oldCode.length) {
      // Insert operation
      let insertPos = 0;
      for (let i = 0; i < Math.min(oldCode.length, newCode.length); i++) {
        if (oldCode[i] !== newCode[i]) {
          insertPos = i;
          break;
        }
      }
      if (insertPos === oldCode.length) insertPos = oldCode.length;
      
      collaborationManager.updateCode(sessionId, currentUserId, {
        operation: 'insert',
        position: insertPos,
        content: newCode.slice(insertPos, insertPos + (newCode.length - oldCode.length))
      });
    } else if (newCode.length < oldCode.length) {
      // Delete operation
      let deletePos = 0;
      for (let i = 0; i < Math.min(oldCode.length, newCode.length); i++) {
        if (oldCode[i] !== newCode[i]) {
          deletePos = i;
          break;
        }
      }
      
      collaborationManager.updateCode(sessionId, currentUserId, {
        operation: 'delete',
        position: deletePos,
        length: oldCode.length - newCode.length
      });
    }
  }, [code, sessionId, currentUserId]);

  const handleCursorMove = useCallback((e: React.MouseEvent<HTMLTextAreaElement>) => {
    if (!sessionId) return;
    
    const rect = e.currentTarget.getBoundingClientRect();
    const cursor = {
      x: e.clientX - rect.left,
      y: e.clientY - rect.top
    };
    
    collaborationManager.updateCursor(sessionId, currentUserId, cursor);
  }, [sessionId, currentUserId]);

  const handleSelectionChange = useCallback(() => {
    if (!sessionId || !editorRef.current) return;
    
    const { selectionStart, selectionEnd } = editorRef.current;
    collaborationManager.updateSelection(sessionId, currentUserId, {
      start: selectionStart,
      end: selectionEnd
    });
  }, [sessionId, currentUserId]);

  const sendChatMessage = () => {
    if (!sessionId || !newMessage.trim()) return;
    
    collaborationManager.sendChatMessage(sessionId, currentUserId, newMessage.trim());
    setNewMessage('');
  };

  const shareInviteLink = async () => {
    try {
      await navigator.clipboard.writeText(inviteLink);
      // Show toast notification
    } catch (err) {
      console.error('Failed to copy invite link:', err);
    }
  };

  const runCode = () => {
    if (onCodeRun) {
      onCodeRun(code);
    }
    
    if (sessionId) {
      collaborationManager.sendChatMessage(
        sessionId,
        currentUserId,
        `\`\`\`${language}\n${code}\n\`\`\``,
        'code'
      );
    }
  };

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chatMessages]);

  const renderCursor = (participant: Participant) => {
    if (!participant.cursor || participant.id === currentUserId) return null;
    
    return (
      <div
        key={`cursor-${participant.id}`}
        className="absolute pointer-events-none z-10"
        style={{
          left: participant.cursor.x,
          top: participant.cursor.y,
          transform: 'translate(-2px, -2px)'
        }}
      >
        <CursorArrowRaysIcon
          className="h-4 w-4"
          style={{ color: participant.color }}
        />
        <div
          className="absolute top-4 left-0 px-2 py-1 rounded text-xs text-white whitespace-nowrap"
          style={{ backgroundColor: participant.color }}
        >
          {participant.name}
        </div>
      </div>
    );
  };

  const renderSelection = (participant: Participant) => {
    if (!participant.selection || participant.id === currentUserId) return null;
    
    // This would require more complex positioning logic in a real implementation
    // For now, just show a visual indicator
    return null;
  };

  return (
    <div className="flex h-full bg-gray-50">
      {/* Main Editor Area */}
      <div className="flex-1 flex flex-col">
        {/* Toolbar */}
        <div className="bg-white border-b border-gray-200 p-4 flex justify-between items-center">
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <UserGroupIcon className="h-5 w-5 text-gray-600" />
              <span className="text-sm text-gray-600">
                {participants.size} participant{participants.size !== 1 ? 's' : ''}
              </span>
            </div>
            
            {/* Participant avatars */}
            <div className="flex -space-x-2">
              {Array.from(participants.values()).map(participant => (
                <div
                  key={participant.id}
                  className="w-8 h-8 rounded-full border-2 border-white flex items-center justify-center text-white text-xs font-medium"
                  style={{ backgroundColor: participant.color }}
                  title={participant.name}
                >
                  {participant.name.charAt(0).toUpperCase()}
                </div>
              ))}
            </div>
          </div>
          
          <div className="flex items-center space-x-2">
            <button
              onClick={shareInviteLink}
              className="flex items-center space-x-2 px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              <ShareIcon className="h-4 w-4" />
              <span>Share</span>
            </button>
            
            <button
              onClick={runCode}
              className="flex items-center space-x-2 px-3 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
            >
              <PlayIcon className="h-4 w-4" />
              <span>Run</span>
            </button>
            
            <button
              onClick={() => setIsChatOpen(!isChatOpen)}
              className="flex items-center space-x-2 px-3 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
            >
              <ChatBubbleLeftIcon className="h-4 w-4" />
              <span>Chat</span>
              {chatMessages.length > 0 && (
                <span className="bg-purple-800 text-xs px-2 py-1 rounded-full">
                  {chatMessages.length}
                </span>
              )}
            </button>
          </div>
        </div>

        {/* Code Editor */}
        <div className="flex-1 relative">
          <textarea
            ref={editorRef}
            value={code}
            onChange={(e) => handleCodeChange(e.target.value)}
            onMouseMove={handleCursorMove}
            onSelect={handleSelectionChange}
            className="w-full h-full p-4 font-mono text-sm bg-gray-900 text-gray-100 resize-none focus:outline-none"
            placeholder={`Write your ${language} code here...`}
            spellCheck={false}
          />
          
          {/* Render cursors and selections */}
          {Array.from(participants.values()).map(participant => (
            <React.Fragment key={participant.id}>
              {renderCursor(participant)}
              {renderSelection(participant)}
            </React.Fragment>
          ))}
        </div>
      </div>

      {/* Chat Sidebar */}
      {isChatOpen && (
        <div className="w-80 bg-white border-l border-gray-200 flex flex-col">
          <div className="p-4 border-b border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900">Chat</h3>
          </div>
          
          {/* Chat Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3">
            {chatMessages.map(message => (
              <div key={message.id} className="flex space-x-2">
                <div
                  className="w-8 h-8 rounded-full flex items-center justify-center text-white text-xs font-medium flex-shrink-0"
                  style={{ 
                    backgroundColor: message.type === 'system' ? '#6B7280' : 
                      participants.get(message.userId)?.color || '#9CA3AF'
                  }}
                >
                  {message.type === 'system' ? 'S' : message.userName.charAt(0).toUpperCase()}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center space-x-2">
                    <span className="text-sm font-medium text-gray-900">
                      {message.userName}
                    </span>
                    <span className="text-xs text-gray-500">
                      {message.timestamp.toLocaleTimeString()}
                    </span>
                  </div>
                  <div className={`mt-1 text-sm ${
                    message.type === 'code' 
                      ? 'bg-gray-100 p-2 rounded font-mono text-xs' 
                      : 'text-gray-700'
                  }`}>
                    {message.type === 'code' ? (
                      <pre className="whitespace-pre-wrap">{message.message}</pre>
                    ) : (
                      message.message
                    )}
                  </div>
                </div>
              </div>
            ))}
            <div ref={chatEndRef} />
          </div>
          
          {/* Chat Input */}
          <div className="p-4 border-t border-gray-200">
            <div className="flex space-x-2">
              <input
                type="text"
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && sendChatMessage()}
                placeholder="Type a message..."
                className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <button
                onClick={sendChatMessage}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                Send
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CollaborativeEditor;