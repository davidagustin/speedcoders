'use client'

import { useState, useEffect, useRef, useCallback } from 'react'
import {
  PlayIcon,
  PauseIcon,
  UserGroupIcon,
  ChatBubbleLeftEllipsisIcon,
  MicrophoneIcon,
  VideoCameraIcon,
  ShareIcon,
  DocumentDuplicateIcon,
  ExclamationTriangleIcon,
  CheckCircleIcon,
  ClockIcon
} from '@heroicons/react/24/outline'
import { 
  CollaborativeSession, 
  Participant, 
  CursorPosition, 
  ChatMessage,
  collaborationManager 
} from '@/lib/CollaborationManager'
import { LoadingSpinner } from './LoadingSpinner'

interface CollaborativeCodeEditorProps {
  sessionId?: string
  roomId?: string
  userId: string
  problemId?: string
  onSessionEnd?: () => void
}

export function CollaborativeCodeEditor({
  sessionId: initialSessionId,
  roomId,
  userId,
  problemId,
  onSessionEnd
}: CollaborativeCodeEditorProps) {
  const [session, setSession] = useState<CollaborativeSession | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string>('')
  const [code, setCode] = useState('')
  const [language, setLanguage] = useState<'javascript' | 'python' | 'java' | 'cpp' | 'typescript'>('javascript')
  const [isExecuting, setIsExecuting] = useState(false)
  const [executionResult, setExecutionResult] = useState<any>(null)
  const [showChat, setShowChat] = useState(true)
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([])
  const [newMessage, setNewMessage] = useState('')
  const [currentUser, setCurrentUser] = useState<Participant | null>(null)
  
  const codeEditorRef = useRef<HTMLTextAreaElement>(null)
  const chatScrollRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    initializeSession()
    
    return () => {
      if (session) {
        collaborationManager.leaveSession(session.id, userId)
      }
    }
  }, [initialSessionId, roomId, userId])

  useEffect(() => {
    if (session) {
      setupEventListeners(session.id)
    }
  }, [session])

  useEffect(() => {
    // Auto-scroll chat to bottom
    if (chatScrollRef.current) {
      chatScrollRef.current.scrollTop = chatScrollRef.current.scrollHeight
    }
  }, [chatMessages])

  const initializeSession = async () => {
    try {
      setLoading(true)
      let sessionData: CollaborativeSession | null = null

      if (initialSessionId) {
        // Join existing session by ID
        sessionData = await collaborationManager.joinSession(initialSessionId, userId)
      } else if (roomId) {
        // Join session by room ID
        sessionData = await collaborationManager.joinSession(roomId, userId)
      } else if (problemId) {
        // Create new session
        sessionData = await collaborationManager.createSession(userId, problemId, {
          maxParticipants: 4,
          allowSpectators: true,
          showCursors: true,
          interviewMode: false
        })
      }

      if (sessionData) {
        setSession(sessionData)
        setCode(sessionData.code)
        setLanguage(sessionData.language)
        setCurrentUser(sessionData.participants.find(p => p.userId === userId) || null)
      } else {
        setError('Failed to join or create session')
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to initialize session')
    } finally {
      setLoading(false)
    }
  }

  const setupEventListeners = (sessionId: string) => {
    collaborationManager.onSessionUpdate(sessionId, (updatedSession) => {
      setSession(updatedSession)
      setCurrentUser(updatedSession.participants.find(p => p.userId === userId) || null)
    })

    collaborationManager.onCodeChange(sessionId, (change, newCode) => {
      if (change.userId !== userId) {
        setCode(newCode)
      }
    })

    collaborationManager.onChatMessage(sessionId, (message) => {
      setChatMessages(prev => [...prev, message])
    })
  }

  const handleCodeChange = useCallback((e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newCode = e.target.value
    const oldCode = code
    
    setCode(newCode)

    if (session && newCode !== oldCode) {
      // Calculate the change
      const textarea = e.target
      const cursorPos = textarea.selectionStart
      const lines = oldCode.split('\n')
      let line = 0
      let column = cursorPos

      for (let i = 0; i < lines.length; i++) {
        if (column <= lines[i].length) {
          line = i
          break
        }
        column -= lines[i].length + 1
      }

      collaborationManager.updateCode(session.id, userId, {
        type: newCode.length > oldCode.length ? 'insert' : 'delete',
        position: { line, column },
        content: newCode.length > oldCode.length 
          ? newCode.slice(cursorPos - (newCode.length - oldCode.length), cursorPos)
          : '',
        length: newCode.length < oldCode.length ? oldCode.length - newCode.length : undefined
      })
    }
  }, [code, session, userId])

  const handleCursorMove = useCallback((e: React.MouseEvent<HTMLTextAreaElement> | React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (!session) return

    const textarea = e.target as HTMLTextAreaElement
    const cursorPos = textarea.selectionStart
    const lines = code.split('\n')
    let line = 0
    let column = cursorPos

    for (let i = 0; i < lines.length; i++) {
      if (column <= lines[i].length) {
        line = i
        break
      }
      column -= lines[i].length + 1
    }

    const cursor: CursorPosition = { line, column }
    
    if (textarea.selectionStart !== textarea.selectionEnd) {
      // Handle selection
      let selectionStartLine = 0
      let selectionStartColumn = textarea.selectionStart
      
      for (let i = 0; i < lines.length; i++) {
        if (selectionStartColumn <= lines[i].length) {
          selectionStartLine = i
          break
        }
        selectionStartColumn -= lines[i].length + 1
      }
      
      cursor.selection = {
        startLine: selectionStartLine,
        startColumn: selectionStartColumn,
        endLine: line,
        endColumn: column
      }
    }

    collaborationManager.updateCursor(session.id, userId, cursor)
  }, [session, userId, code])

  const executeCode = async () => {
    if (!session) return

    setIsExecuting(true)
    try {
      const result = await collaborationManager.runCode(session.id, userId)
      setExecutionResult(result)
    } catch (error) {
      setExecutionResult({
        success: false,
        error: 'Execution failed',
        output: ''
      })
    } finally {
      setIsExecuting(false)
    }
  }

  const sendChatMessage = async () => {
    if (!session || !newMessage.trim()) return

    await collaborationManager.sendMessage(session.id, userId, newMessage)
    setNewMessage('')
  }

  const copyRoomId = () => {
    if (session?.roomId) {
      navigator.clipboard.writeText(session.roomId)
      // You could add a toast notification here
    }
  }

  const getParticipantColor = (participantId: string): string => {
    const colors = [
      'text-blue-600', 'text-green-600', 'text-purple-600', 
      'text-orange-600', 'text-pink-600', 'text-indigo-600'
    ]
    const hash = participantId.split('').reduce((a, b) => {
      a = ((a << 5) - a) + b.charCodeAt(0)
      return a & a
    }, 0)
    return colors[Math.abs(hash) % colors.length]
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <LoadingSpinner size="lg" />
      </div>
    )
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-6">
        <div className="flex items-center">
          <ExclamationTriangleIcon className="w-6 h-6 text-red-600 mr-3" />
          <div>
            <h3 className="text-red-800 font-medium">Session Error</h3>
            <p className="text-red-600 text-sm">{error}</p>
          </div>
        </div>
      </div>
    )
  }

  if (!session) {
    return (
      <div className="bg-gray-50 border border-gray-200 rounded-lg p-6">
        <p className="text-gray-600">No session found</p>
      </div>
    )
  }

  const activeParticipants = session.participants.filter(p => p.status !== 'offline')
  const isHost = currentUser?.role === 'host'
  const canEdit = currentUser?.role !== 'observer'

  return (
    <div className="bg-white rounded-lg shadow-lg overflow-hidden">
      {/* Header */}
      <div className="bg-gray-900 text-white p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <UserGroupIcon className="w-5 h-5" />
              <span className="font-medium">Room: {session.roomId}</span>
              <button
                onClick={copyRoomId}
                className="p-1 hover:bg-gray-700 rounded"
                title="Copy room ID"
              >
                <DocumentDuplicateIcon className="w-4 h-4" />
              </button>
            </div>
            
            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-300">
                {activeParticipants.length} participant{activeParticipants.length !== 1 ? 's' : ''}
              </span>
              <div className="flex -space-x-2">
                {activeParticipants.slice(0, 4).map(participant => (
                  <div
                    key={participant.id}
                    className={`w-6 h-6 rounded-full bg-gray-600 border-2 border-gray-900 flex items-center justify-center text-xs font-medium ${getParticipantColor(participant.id)}`}
                    title={`${participant.username} (${participant.role})`}
                  >
                    {participant.username.charAt(0).toUpperCase()}
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <select
              value={language}
              onChange={(e) => setLanguage(e.target.value as any)}
              disabled={!canEdit || !isHost}
              className="bg-gray-800 border border-gray-700 rounded px-3 py-1 text-sm"
            >
              <option value="javascript">JavaScript</option>
              <option value="python">Python</option>
              <option value="java">Java</option>
              <option value="cpp">C++</option>
              <option value="typescript">TypeScript</option>
            </select>

            <button
              onClick={executeCode}
              disabled={!canEdit || isExecuting}
              className="flex items-center gap-2 bg-green-600 hover:bg-green-700 disabled:bg-gray-600 px-4 py-2 rounded text-sm font-medium"
            >
              {isExecuting ? <LoadingSpinner size="sm" /> : <PlayIcon className="w-4 h-4" />}
              Run
            </button>
          </div>
        </div>

        {/* Participant status bar */}
        <div className="mt-3 flex items-center gap-4">
          {activeParticipants.map(participant => (
            <div
              key={participant.id}
              className="flex items-center gap-2 text-sm"
            >
              <div className={`w-2 h-2 rounded-full ${
                participant.status === 'coding' ? 'bg-green-400' :
                participant.status === 'reviewing' ? 'bg-yellow-400' :
                'bg-gray-400'
              }`} />
              <span className={participant.userId === userId ? 'font-medium' : ''}>
                {participant.username}
                {participant.role === 'host' && ' (Host)'}
                {participant.role === 'observer' && ' (Observer)'}
              </span>
            </div>
          ))}
        </div>
      </div>

      <div className="flex h-96">
        {/* Code Editor */}
        <div className="flex-1 relative">
          <textarea
            ref={codeEditorRef}
            value={code}
            onChange={handleCodeChange}
            onMouseUp={handleCursorMove}
            onKeyUp={handleCursorMove}
            disabled={!canEdit}
            className="w-full h-full p-4 font-mono text-sm bg-gray-50 border-r border-gray-200 resize-none focus:outline-none focus:bg-white disabled:bg-gray-100 disabled:text-gray-500"
            placeholder={canEdit ? "Write your code here..." : "You are in observer mode"}
            spellCheck={false}
          />
          
          {/* Participant cursors would be rendered here in a real implementation */}
          {session.settings.showCursors && (
            <div className="absolute inset-0 pointer-events-none">
              {/* Cursor indicators would be positioned here */}
            </div>
          )}
        </div>

        {/* Chat Panel */}
        {showChat && (
          <div className="w-80 border-l border-gray-200 flex flex-col">
            <div className="p-3 border-b border-gray-200 flex items-center justify-between">
              <h3 className="font-medium flex items-center gap-2">
                <ChatBubbleLeftEllipsisIcon className="w-4 h-4" />
                Chat
              </h3>
              <button
                onClick={() => setShowChat(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                ×
              </button>
            </div>
            
            <div ref={chatScrollRef} className="flex-1 overflow-y-auto p-3 space-y-3">
              {chatMessages.map(message => (
                <div key={message.id} className="text-sm">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-medium text-xs text-gray-600">
                      {message.username}
                    </span>
                    <span className="text-xs text-gray-400">
                      {new Date(message.timestamp).toLocaleTimeString()}
                    </span>
                  </div>
                  <div className={`${
                    message.type === 'system' ? 'text-gray-500 italic' :
                    message.type === 'code_snippet' ? 'bg-gray-100 p-2 rounded font-mono text-xs' :
                    ''
                  }`}>
                    {message.message}
                  </div>
                </div>
              ))}
            </div>
            
            <div className="p-3 border-t border-gray-200">
              <div className="flex gap-2">
                <input
                  type="text"
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && sendChatMessage()}
                  placeholder="Type a message..."
                  className="flex-1 px-3 py-2 border border-gray-300 rounded text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <button
                  onClick={sendChatMessage}
                  disabled={!newMessage.trim()}
                  className="px-3 py-2 bg-blue-600 text-white rounded text-sm hover:bg-blue-700 disabled:bg-gray-300"
                >
                  Send
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Execution Results */}
      {executionResult && (
        <div className="border-t border-gray-200 p-4">
          <h3 className="font-medium mb-3 flex items-center gap-2">
            {executionResult.success ? (
              <CheckCircleIcon className="w-5 h-5 text-green-600" />
            ) : (
              <ExclamationTriangleIcon className="w-5 h-5 text-red-600" />
            )}
            Execution Results
          </h3>
          
          <div className="bg-gray-900 text-gray-100 rounded p-4 font-mono text-sm">
            {executionResult.success ? (
              <div>
                <div className="text-green-400 mb-2">✓ Execution completed successfully</div>
                {executionResult.output && (
                  <pre className="whitespace-pre-wrap">{executionResult.output}</pre>
                )}
                {executionResult.testResults && (
                  <div className="mt-4">
                    <div className="text-blue-400 mb-2">Test Results:</div>
                    {executionResult.testResults.map((test: any, index: number) => (
                      <div key={index} className={`${test.passed ? 'text-green-400' : 'text-red-400'} mb-1`}>
                        Test {index + 1}: {test.passed ? '✓ PASS' : '✗ FAIL'} ({test.time}ms)
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ) : (
              <div>
                <div className="text-red-400 mb-2">✗ Execution failed</div>
                {executionResult.error && (
                  <div className="text-red-300">{executionResult.error}</div>
                )}
                {executionResult.output && (
                  <pre className="whitespace-pre-wrap mt-2">{executionResult.output}</pre>
                )}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Floating Chat Toggle */}
      {!showChat && (
        <button
          onClick={() => setShowChat(true)}
          className="fixed bottom-4 right-4 bg-blue-600 text-white p-3 rounded-full shadow-lg hover:bg-blue-700"
        >
          <ChatBubbleLeftEllipsisIcon className="w-6 h-6" />
        </button>
      )}
    </div>
  )
}