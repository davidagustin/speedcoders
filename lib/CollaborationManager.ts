import { supabase } from './supabase'
import { CacheService } from './CacheService'

export interface CollaborativeSession {
  id: string
  roomId: string
  hostId: string
  participants: Participant[]
  problemId: string
  language: 'javascript' | 'python' | 'java' | 'cpp' | 'typescript'
  code: string
  status: 'waiting' | 'active' | 'completed' | 'paused'
  createdAt: string
  updatedAt: string
  settings: SessionSettings
}

export interface Participant {
  id: string
  userId: string
  username: string
  role: 'host' | 'participant' | 'observer'
  status: 'online' | 'offline' | 'coding' | 'reviewing'
  cursor?: CursorPosition
  joinedAt: string
  lastActiveAt: string
}

export interface CursorPosition {
  line: number
  column: number
  selection?: {
    startLine: number
    startColumn: number
    endLine: number
    endColumn: number
  }
}

export interface SessionSettings {
  maxParticipants: number
  allowSpectators: boolean
  enableVoiceChat: boolean
  showCursors: boolean
  autoSave: boolean
  timeLimit?: number
  difficulty: 'Easy' | 'Medium' | 'Hard'
  interviewMode: boolean
}

export interface CodeChange {
  id: string
  sessionId: string
  userId: string
  timestamp: string
  type: 'insert' | 'delete' | 'replace'
  position: {
    line: number
    column: number
  }
  content: string
  length?: number
}

export interface ChatMessage {
  id: string
  sessionId: string
  userId: string
  username: string
  message: string
  type: 'text' | 'code_snippet' | 'system' | 'hint'
  timestamp: string
  metadata?: any
}

export class CollaborationManager {
  private cache = CacheService.getInstance()
  private activeSessions = new Map<string, CollaborativeSession>()
  private eventHandlers = new Map<string, Set<Function>>()

  // Real-time session management
  async createSession(
    hostId: string, 
    problemId: string, 
    settings: Partial<SessionSettings> = {}
  ): Promise<CollaborativeSession> {
    try {
      const sessionId = `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
      const roomId = `room_${Math.random().toString(36).substr(2, 6).toUpperCase()}`

      const defaultSettings: SessionSettings = {
        maxParticipants: 4,
        allowSpectators: true,
        enableVoiceChat: false,
        showCursors: true,
        autoSave: true,
        difficulty: 'Medium',
        interviewMode: false,
        ...settings
      }

      const session: CollaborativeSession = {
        id: sessionId,
        roomId,
        hostId,
        participants: [{
          id: `participant_${hostId}`,
          userId: hostId,
          username: await this.getUsernameById(hostId),
          role: 'host',
          status: 'online',
          joinedAt: new Date().toISOString(),
          lastActiveAt: new Date().toISOString()
        }],
        problemId,
        language: 'javascript',
        code: '// Write your solution here\n\n',
        status: 'waiting',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        settings: defaultSettings
      }

      // Store in database
      const { error } = await supabase
        .from('collaborative_sessions')
        .insert({
          id: sessionId,
          room_id: roomId,
          host_id: hostId,
          problem_id: problemId,
          language: session.language,
          code: session.code,
          status: session.status,
          settings: defaultSettings,
          participants: session.participants
        })

      if (error) throw error

      // Cache the session
      await this.cache.set(`session:${sessionId}`, session, 7200) // 2 hours
      await this.cache.set(`room:${roomId}`, sessionId, 7200)
      
      this.activeSessions.set(sessionId, session)

      return session
    } catch (error) {
      console.error('Error creating collaborative session:', error)
      throw new Error('Failed to create collaborative session')
    }
  }

  async joinSession(roomId: string, userId: string): Promise<CollaborativeSession | null> {
    try {
      // Get session ID from room ID
      const sessionId = await this.cache.get<string>(`room:${roomId}`)
      if (!sessionId) {
        // Try to find in database
        const { data, error } = await supabase
          .from('collaborative_sessions')
          .select('id')
          .eq('room_id', roomId)
          .eq('status', 'waiting')
          .single()

        if (error || !data) return null
        return this.joinSession(roomId, userId) // Retry with cached data
      }

      let session = this.activeSessions.get(sessionId)
      if (!session) {
        session = await this.getSession(sessionId)
        if (!session) return null
      }

      // Check if user is already in session
      const existingParticipant = session.participants.find(p => p.userId === userId)
      if (existingParticipant) {
        existingParticipant.status = 'online'
        existingParticipant.lastActiveAt = new Date().toISOString()
      } else {
        // Check participant limit
        const activeParticipants = session.participants.filter(p => p.status !== 'offline').length
        if (activeParticipants >= session.settings.maxParticipants) {
          if (!session.settings.allowSpectators) return null
          // Add as observer
          session.participants.push({
            id: `participant_${userId}`,
            userId,
            username: await this.getUsernameById(userId),
            role: 'observer',
            status: 'online',
            joinedAt: new Date().toISOString(),
            lastActiveAt: new Date().toISOString()
          })
        } else {
          // Add as participant
          session.participants.push({
            id: `participant_${userId}`,
            userId,
            username: await this.getUsernameById(userId),
            role: 'participant',
            status: 'online',
            joinedAt: new Date().toISOString(),
            lastActiveAt: new Date().toISOString()
          })
        }
      }

      session.updatedAt = new Date().toISOString()
      
      // Update database
      await this.updateSessionInDB(session)
      
      // Update cache and active sessions
      await this.cache.set(`session:${sessionId}`, session, 7200)
      this.activeSessions.set(sessionId, session)

      // Notify other participants
      this.broadcastSessionUpdate(sessionId, session)

      return session
    } catch (error) {
      console.error('Error joining session:', error)
      return null
    }
  }

  async updateCode(sessionId: string, userId: string, change: Omit<CodeChange, 'id' | 'sessionId' | 'userId' | 'timestamp'>): Promise<boolean> {
    try {
      const session = this.activeSessions.get(sessionId) || await this.getSession(sessionId)
      if (!session) return false

      // Verify user is in session
      const participant = session.participants.find(p => p.userId === userId)
      if (!participant || participant.role === 'observer') return false

      // Apply the change to the code
      const lines = session.code.split('\n')
      const { line, column } = change.position

      if (change.type === 'insert') {
        const currentLine = lines[line] || ''
        lines[line] = currentLine.slice(0, column) + change.content + currentLine.slice(column)
      } else if (change.type === 'delete') {
        const currentLine = lines[line] || ''
        lines[line] = currentLine.slice(0, column) + currentLine.slice(column + (change.length || 1))
      } else if (change.type === 'replace') {
        const currentLine = lines[line] || ''
        lines[line] = currentLine.slice(0, column) + change.content + currentLine.slice(column + (change.length || 0))
      }

      session.code = lines.join('\n')
      session.updatedAt = new Date().toISOString()

      // Update participant status
      participant.status = 'coding'
      participant.lastActiveAt = new Date().toISOString()

      // Store change record
      const codeChange: CodeChange = {
        id: `change_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        sessionId,
        userId,
        timestamp: new Date().toISOString(),
        ...change
      }

      // Save to database and cache
      await Promise.all([
        this.updateSessionInDB(session),
        this.cache.set(`session:${sessionId}`, session, 7200),
        supabase.from('code_changes').insert(codeChange)
      ])

      this.activeSessions.set(sessionId, session)

      // Broadcast change to other participants
      this.broadcastCodeChange(sessionId, codeChange, session.code)

      return true
    } catch (error) {
      console.error('Error updating code:', error)
      return false
    }
  }

  async updateCursor(sessionId: string, userId: string, cursor: CursorPosition): Promise<boolean> {
    try {
      const session = this.activeSessions.get(sessionId) || await this.getSession(sessionId)
      if (!session) return false

      const participant = session.participants.find(p => p.userId === userId)
      if (!participant) return false

      participant.cursor = cursor
      participant.lastActiveAt = new Date().toISOString()

      // Update cache (no need to update DB for cursor movements)
      await this.cache.set(`session:${sessionId}`, session, 7200)
      this.activeSessions.set(sessionId, session)

      // Broadcast cursor update
      this.broadcastCursorUpdate(sessionId, userId, cursor)

      return true
    } catch (error) {
      console.error('Error updating cursor:', error)
      return false
    }
  }

  async sendMessage(sessionId: string, userId: string, message: string, type: ChatMessage['type'] = 'text'): Promise<boolean> {
    try {
      const session = this.activeSessions.get(sessionId) || await this.getSession(sessionId)
      if (!session) return false

      const participant = session.participants.find(p => p.userId === userId)
      if (!participant) return false

      const chatMessage: ChatMessage = {
        id: `msg_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        sessionId,
        userId,
        username: participant.username,
        message,
        type,
        timestamp: new Date().toISOString()
      }

      // Store message in database
      await supabase.from('chat_messages').insert(chatMessage)

      // Broadcast to participants
      this.broadcastChatMessage(sessionId, chatMessage)

      return true
    } catch (error) {
      console.error('Error sending message:', error)
      return false
    }
  }

  async runCode(sessionId: string, userId: string, testCases?: any[]): Promise<{
    success: boolean
    output?: string
    error?: string
    testResults?: any[]
  }> {
    try {
      const session = this.activeSessions.get(sessionId) || await this.getSession(sessionId)
      if (!session) return { success: false, error: 'Session not found' }

      const participant = session.participants.find(p => p.userId === userId)
      if (!participant || participant.role === 'observer') {
        return { success: false, error: 'Not authorized to run code' }
      }

      // In a real implementation, this would execute the code safely in a sandboxed environment
      // For now, we'll simulate code execution
      const result = await this.simulateCodeExecution(session.code, session.language, testCases)

      // Broadcast execution result
      this.broadcastCodeExecution(sessionId, userId, result)

      // Update participant status
      participant.status = 'reviewing'
      participant.lastActiveAt = new Date().toISOString()

      return result
    } catch (error) {
      console.error('Error running code:', error)
      return { success: false, error: 'Code execution failed' }
    }
  }

  // Event handling for real-time updates
  onSessionUpdate(sessionId: string, handler: (session: CollaborativeSession) => void): void {
    const key = `session_update_${sessionId}`
    if (!this.eventHandlers.has(key)) {
      this.eventHandlers.set(key, new Set())
    }
    this.eventHandlers.get(key)!.add(handler)
  }

  onCodeChange(sessionId: string, handler: (change: CodeChange, newCode: string) => void): void {
    const key = `code_change_${sessionId}`
    if (!this.eventHandlers.has(key)) {
      this.eventHandlers.set(key, new Set())
    }
    this.eventHandlers.get(key)!.add(handler)
  }

  onCursorUpdate(sessionId: string, handler: (userId: string, cursor: CursorPosition) => void): void {
    const key = `cursor_update_${sessionId}`
    if (!this.eventHandlers.has(key)) {
      this.eventHandlers.set(key, new Set())
    }
    this.eventHandlers.get(key)!.add(handler)
  }

  onChatMessage(sessionId: string, handler: (message: ChatMessage) => void): void {
    const key = `chat_message_${sessionId}`
    if (!this.eventHandlers.has(key)) {
      this.eventHandlers.set(key, new Set())
    }
    this.eventHandlers.get(key)!.add(handler)
  }

  // Private helper methods
  private async getSession(sessionId: string): Promise<CollaborativeSession | null> {
    try {
      // Check cache first
      const cached = await this.cache.get<CollaborativeSession>(`session:${sessionId}`)
      if (cached) return cached

      // Fetch from database
      const { data, error } = await supabase
        .from('collaborative_sessions')
        .select('*')
        .eq('id', sessionId)
        .single()

      if (error || !data) return null

      const session: CollaborativeSession = {
        id: data.id,
        roomId: data.room_id,
        hostId: data.host_id,
        participants: data.participants || [],
        problemId: data.problem_id,
        language: data.language,
        code: data.code,
        status: data.status,
        createdAt: data.created_at,
        updatedAt: data.updated_at,
        settings: data.settings
      }

      // Cache it
      await this.cache.set(`session:${sessionId}`, session, 7200)
      
      return session
    } catch (error) {
      console.error('Error getting session:', error)
      return null
    }
  }

  private async updateSessionInDB(session: CollaborativeSession): Promise<void> {
    await supabase
      .from('collaborative_sessions')
      .update({
        code: session.code,
        status: session.status,
        participants: session.participants,
        updated_at: session.updatedAt
      })
      .eq('id', session.id)
  }

  private async getUsernameById(userId: string): Promise<string> {
    try {
      const { data } = await supabase
        .from('profiles')
        .select('full_name')
        .eq('id', userId)
        .single()
      
      return data?.full_name || `User${userId.slice(-4)}`
    } catch {
      return `User${userId.slice(-4)}`
    }
  }

  private broadcastSessionUpdate(sessionId: string, session: CollaborativeSession): void {
    const handlers = this.eventHandlers.get(`session_update_${sessionId}`)
    if (handlers) {
      handlers.forEach(handler => (handler as any)(session))
    }
  }

  private broadcastCodeChange(sessionId: string, change: CodeChange, newCode: string): void {
    const handlers = this.eventHandlers.get(`code_change_${sessionId}`)
    if (handlers) {
      handlers.forEach(handler => (handler as any)(change, newCode))
    }
  }

  private broadcastCursorUpdate(sessionId: string, userId: string, cursor: CursorPosition): void {
    const handlers = this.eventHandlers.get(`cursor_update_${sessionId}`)
    if (handlers) {
      handlers.forEach(handler => (handler as any)(userId, cursor))
    }
  }

  private broadcastChatMessage(sessionId: string, message: ChatMessage): void {
    const handlers = this.eventHandlers.get(`chat_message_${sessionId}`)
    if (handlers) {
      handlers.forEach(handler => (handler as any)(message))
    }
  }

  private broadcastCodeExecution(sessionId: string, userId: string, result: any): void {
    // Broadcast code execution results to all participants
    const handlers = this.eventHandlers.get(`code_execution_${sessionId}`)
    if (handlers) {
      handlers.forEach(handler => (handler as any)(userId, result))
    }
  }

  private async simulateCodeExecution(code: string, language: string, testCases?: any[]): Promise<any> {
    // Simulate code execution - in production, this would use a secure sandbox
    await new Promise(resolve => setTimeout(resolve, 1000 + Math.random() * 2000))
    
    const success = Math.random() > 0.3 // 70% success rate
    
    if (success) {
      return {
        success: true,
        output: `Code executed successfully in ${language}\nOutput: [1, 2, 3]\nTime: 42ms`,
        testResults: testCases?.map(() => ({
          passed: Math.random() > 0.2,
          expected: 'expected output',
          actual: 'actual output',
          time: Math.round(Math.random() * 100)
        }))
      }
    } else {
      return {
        success: false,
        error: 'SyntaxError: Unexpected token at line 5',
        output: 'Compilation failed'
      }
    }
  }

  async leaveSession(sessionId: string, userId: string): Promise<boolean> {
    try {
      const session = this.activeSessions.get(sessionId) || await this.getSession(sessionId)
      if (!session) return false

      const participantIndex = session.participants.findIndex(p => p.userId === userId)
      if (participantIndex === -1) return false

      // Mark as offline instead of removing
      session.participants[participantIndex].status = 'offline'
      session.updatedAt = new Date().toISOString()

      // If host is leaving and there are other active participants, transfer host
      if (session.participants[participantIndex].role === 'host') {
        const activeParticipants = session.participants.filter(p => p.status === 'online' && p.userId !== userId)
        if (activeParticipants.length > 0) {
          activeParticipants[0].role = 'host'
        } else {
          // No active participants, mark session as completed
          session.status = 'completed'
        }
      }

      await this.updateSessionInDB(session)
      await this.cache.set(`session:${sessionId}`, session, 7200)
      this.activeSessions.set(sessionId, session)

      this.broadcastSessionUpdate(sessionId, session)
      
      return true
    } catch (error) {
      console.error('Error leaving session:', error)
      return false
    }
  }
}

export const collaborationManager = new CollaborationManager()