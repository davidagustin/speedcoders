import { EventEmitter } from 'events';

interface VoiceSession {
  id: string;
  roomId: string;
  participants: Map<string, VoiceParticipant>;
  settings: VoiceSettings;
  recording: RecordingState | null;
  createdAt: Date;
  hostId: string;
}

interface VoiceParticipant {
  userId: string;
  userName: string;
  audioStream?: MediaStream;
  isMuted: boolean;
  isDeafened: boolean;
  volume: number;
  joinedAt: Date;
  permissions: VoicePermissions;
  statistics: VoiceStatistics;
}

interface VoicePermissions {
  canSpeak: boolean;
  canHear: boolean;
  canMuteOthers: boolean;
  canKickUsers: boolean;
  canRecord: boolean;
}

interface VoiceSettings {
  echoCancellation: boolean;
  noiseSuppression: boolean;
  autoGainControl: boolean;
  maxParticipants: number;
  quality: 'low' | 'medium' | 'high' | 'ultra';
  pushToTalk: boolean;
  voiceActivation: boolean;
  activationThreshold: number;
}

interface VoiceStatistics {
  packetsLost: number;
  jitter: number;
  latency: number;
  bitrate: number;
  connectionQuality: 'poor' | 'fair' | 'good' | 'excellent';
}

interface RecordingState {
  isRecording: boolean;
  startedAt: Date;
  duration: number;
  size: number;
  chunks: Blob[];
}

interface AudioProcessor {
  context: AudioContext;
  gainNode: GainNode;
  analyser: AnalyserNode;
  compressor: DynamicsCompressorNode;
  filter: BiquadFilterNode;
}

export class VoiceChatManager extends EventEmitter {
  private static instance: VoiceChatManager;
  private sessions: Map<string, VoiceSession> = new Map();
  private audioProcessors: Map<string, AudioProcessor> = new Map();
  private peerConnections: Map<string, RTCPeerConnection> = new Map();
  
  private readonly ICE_SERVERS = [
    { urls: 'stun:stun.l.google.com:19302' },
    { urls: 'stun:stun1.l.google.com:19302' },
    { urls: 'stun:stun2.l.google.com:19302' }
  ];

  private readonly AUDIO_CONSTRAINTS = {
    low: { sampleRate: 8000, channelCount: 1, echoCancellation: true },
    medium: { sampleRate: 16000, channelCount: 1, echoCancellation: true },
    high: { sampleRate: 44100, channelCount: 2, echoCancellation: true },
    ultra: { sampleRate: 48000, channelCount: 2, echoCancellation: true }
  };

  private constructor() {
    super();
    this.initializeAudioContext();
  }

  static getInstance(): VoiceChatManager {
    if (!VoiceChatManager.instance) {
      VoiceChatManager.instance = new VoiceChatManager();
    }
    return VoiceChatManager.instance;
  }

  // Create a voice chat session
  async createVoiceSession(
    roomId: string,
    hostId: string,
    settings?: Partial<VoiceSettings>
  ): Promise<VoiceSession> {
    const sessionId = this.generateSessionId();
    
    const defaultSettings: VoiceSettings = {
      echoCancellation: true,
      noiseSuppression: true,
      autoGainControl: true,
      maxParticipants: 10,
      quality: 'high',
      pushToTalk: false,
      voiceActivation: true,
      activationThreshold: -50
    };

    const session: VoiceSession = {
      id: sessionId,
      roomId,
      participants: new Map(),
      settings: { ...defaultSettings, ...settings },
      recording: null,
      createdAt: new Date(),
      hostId
    };

    this.sessions.set(sessionId, session);
    this.emit('voice:session:created', session);
    
    return session;
  }

  // Join voice chat
  async joinVoiceChat(
    sessionId: string,
    userId: string,
    userName: string
  ): Promise<{ 
    success: boolean; 
    stream?: MediaStream; 
    error?: string 
  }> {
    const session = this.sessions.get(sessionId);
    
    if (!session) {
      return { success: false, error: 'Voice session not found' };
    }

    if (session.participants.size >= session.settings.maxParticipants) {
      return { success: false, error: 'Voice chat is full' };
    }

    try {
      // Get user media
      const stream = await this.getUserMedia(session.settings);
      
      // Create audio processor
      const processor = await this.createAudioProcessor(stream, session.settings);
      this.audioProcessors.set(`${sessionId}_${userId}`, processor);

      // Create participant
      const participant: VoiceParticipant = {
        userId,
        userName,
        audioStream: stream,
        isMuted: false,
        isDeafened: false,
        volume: 1.0,
        joinedAt: new Date(),
        permissions: {
          canSpeak: true,
          canHear: true,
          canMuteOthers: userId === session.hostId,
          canKickUsers: userId === session.hostId,
          canRecord: userId === session.hostId
        },
        statistics: {
          packetsLost: 0,
          jitter: 0,
          latency: 0,
          bitrate: 0,
          connectionQuality: 'good'
        }
      };

      session.participants.set(userId, participant);

      // Setup peer connections for existing participants
      for (const [existingUserId, existingParticipant] of session.participants) {
        if (existingUserId !== userId) {
          await this.setupPeerConnection(
            sessionId,
            userId,
            existingUserId,
            stream
          );
        }
      }

      this.emit('voice:participant:joined', {
        sessionId,
        participant
      });

      // Start monitoring audio levels
      this.startAudioLevelMonitoring(sessionId, userId, processor);

      return { success: true, stream };
    } catch (error) {
      console.error('Failed to join voice chat:', error);
      return { 
        success: false, 
        error: error instanceof Error ? error.message : 'Failed to access microphone' 
      };
    }
  }

  // Leave voice chat
  async leaveVoiceChat(sessionId: string, userId: string): Promise<void> {
    const session = this.sessions.get(sessionId);
    const participant = session?.participants.get(userId);
    
    if (!session || !participant) return;

    // Stop audio stream
    if (participant.audioStream) {
      participant.audioStream.getTracks().forEach(track => track.stop());
    }

    // Clean up audio processor
    const processorKey = `${sessionId}_${userId}`;
    const processor = this.audioProcessors.get(processorKey);
    if (processor) {
      processor.context.close();
      this.audioProcessors.delete(processorKey);
    }

    // Close peer connections
    this.peerConnections.forEach((connection, key) => {
      if (key.includes(userId)) {
        connection.close();
        this.peerConnections.delete(key);
      }
    });

    session.participants.delete(userId);

    this.emit('voice:participant:left', {
      sessionId,
      userId
    });

    // If host left, transfer host or end session
    if (userId === session.hostId) {
      if (session.participants.size > 0) {
        const newHost = session.participants.keys().next().value;
        session.hostId = newHost;
        this.emit('voice:host:changed', { sessionId, newHostId: newHost });
      } else {
        this.endVoiceSession(sessionId);
      }
    }
  }

  // Mute/Unmute
  async toggleMute(sessionId: string, userId: string): Promise<boolean> {
    const session = this.sessions.get(sessionId);
    const participant = session?.participants.get(userId);
    
    if (!participant || !participant.audioStream) return false;

    participant.isMuted = !participant.isMuted;
    
    participant.audioStream.getAudioTracks().forEach(track => {
      track.enabled = !participant.isMuted;
    });

    this.emit('voice:participant:muted', {
      sessionId,
      userId,
      isMuted: participant.isMuted
    });

    this.broadcastToSession(sessionId, 'participant:muted', {
      userId,
      isMuted: participant.isMuted
    });

    return true;
  }

  // Deafen/Undeafen
  async toggleDeafen(sessionId: string, userId: string): Promise<boolean> {
    const session = this.sessions.get(sessionId);
    const participant = session?.participants.get(userId);
    
    if (!participant) return false;

    participant.isDeafened = !participant.isDeafened;

    // Also mute when deafening
    if (participant.isDeafened && !participant.isMuted) {
      await this.toggleMute(sessionId, userId);
    }

    this.emit('voice:participant:deafened', {
      sessionId,
      userId,
      isDeafened: participant.isDeafened
    });

    return true;
  }

  // Adjust volume
  async setVolume(
    sessionId: string,
    userId: string,
    targetUserId: string,
    volume: number
  ): Promise<boolean> {
    const processorKey = `${sessionId}_${targetUserId}`;
    const processor = this.audioProcessors.get(processorKey);
    
    if (!processor) return false;

    // Clamp volume between 0 and 2
    volume = Math.max(0, Math.min(2, volume));
    
    processor.gainNode.gain.value = volume;

    const session = this.sessions.get(sessionId);
    const participant = session?.participants.get(targetUserId);
    if (participant) {
      participant.volume = volume;
    }

    return true;
  }

  // Start recording
  async startRecording(sessionId: string, userId: string): Promise<boolean> {
    const session = this.sessions.get(sessionId);
    const participant = session?.participants.get(userId);
    
    if (!session || !participant?.permissions.canRecord) {
      return false;
    }

    if (session.recording?.isRecording) {
      return false; // Already recording
    }

    session.recording = {
      isRecording: true,
      startedAt: new Date(),
      duration: 0,
      size: 0,
      chunks: []
    };

    // Create a MediaRecorder for the mixed audio
    const mixedStream = await this.getMixedAudioStream(sessionId);
    if (!mixedStream) return false;

    const mediaRecorder = new MediaRecorder(mixedStream, {
      mimeType: 'audio/webm;codecs=opus'
    });

    mediaRecorder.ondataavailable = (event) => {
      if (event.data.size > 0 && session.recording) {
        session.recording.chunks.push(event.data);
        session.recording.size += event.data.size;
      }
    };

    mediaRecorder.start(1000); // Collect data every second

    this.emit('voice:recording:started', { sessionId, userId });
    this.broadcastToSession(sessionId, 'recording:started', { userId });

    return true;
  }

  // Stop recording
  async stopRecording(sessionId: string, userId: string): Promise<Blob | null> {
    const session = this.sessions.get(sessionId);
    const participant = session?.participants.get(userId);
    
    if (!session || !participant?.permissions.canRecord || !session.recording) {
      return null;
    }

    session.recording.isRecording = false;
    session.recording.duration = Date.now() - session.recording.startedAt.getTime();

    // Create final audio blob
    const audioBlob = new Blob(session.recording.chunks, {
      type: 'audio/webm;codecs=opus'
    });

    this.emit('voice:recording:stopped', {
      sessionId,
      userId,
      duration: session.recording.duration,
      size: session.recording.size
    });

    // Reset recording state
    session.recording = null;

    return audioBlob;
  }

  // Kick user
  async kickUser(
    sessionId: string,
    requesterId: string,
    targetUserId: string
  ): Promise<boolean> {
    const session = this.sessions.get(sessionId);
    const requester = session?.participants.get(requesterId);
    
    if (!session || !requester?.permissions.canKickUsers) {
      return false;
    }

    await this.leaveVoiceChat(sessionId, targetUserId);
    
    this.emit('voice:participant:kicked', {
      sessionId,
      kickedBy: requesterId,
      kickedUser: targetUserId
    });

    return true;
  }

  // Update settings
  async updateSettings(
    sessionId: string,
    userId: string,
    settings: Partial<VoiceSettings>
  ): Promise<boolean> {
    const session = this.sessions.get(sessionId);
    
    if (!session || session.hostId !== userId) {
      return false;
    }

    session.settings = { ...session.settings, ...settings };

    // Apply new settings to all participants
    for (const [participantId, participant] of session.participants) {
      if (participant.audioStream) {
        await this.applyAudioSettings(
          participant.audioStream,
          session.settings
        );
      }
    }

    this.emit('voice:settings:updated', { sessionId, settings });
    this.broadcastToSession(sessionId, 'settings:updated', settings);

    return true;
  }

  // Get voice statistics
  async getStatistics(
    sessionId: string,
    userId: string
  ): Promise<VoiceStatistics | null> {
    const session = this.sessions.get(sessionId);
    const participant = session?.participants.get(userId);
    
    if (!participant) return null;

    // Update statistics from peer connections
    const peerKey = this.getPeerConnectionKey(sessionId, userId);
    const peerConnection = this.peerConnections.get(peerKey);
    
    if (peerConnection) {
      const stats = await peerConnection.getStats();
      let audioStats: VoiceStatistics = { ...participant.statistics };

      stats.forEach(report => {
        if (report.type === 'inbound-rtp' && report.kind === 'audio') {
          audioStats.packetsLost = report.packetsLost || 0;
          audioStats.jitter = report.jitter || 0;
          audioStats.bitrate = report.bytesReceived 
            ? (report.bytesReceived * 8) / 1000 
            : 0;
        }
        if (report.type === 'candidate-pair' && report.state === 'succeeded') {
          audioStats.latency = report.currentRoundTripTime 
            ? report.currentRoundTripTime * 1000 
            : 0;
        }
      });

      // Calculate connection quality
      audioStats.connectionQuality = this.calculateConnectionQuality(audioStats);
      participant.statistics = audioStats;
    }

    return participant.statistics;
  }

  // Helper methods
  private async getUserMedia(settings: VoiceSettings): Promise<MediaStream> {
    const constraints = this.AUDIO_CONSTRAINTS[settings.quality];
    
    return await navigator.mediaDevices.getUserMedia({
      audio: {
        ...constraints,
        noiseSuppression: settings.noiseSuppression,
        autoGainControl: settings.autoGainControl
      }
    });
  }

  private async createAudioProcessor(
    stream: MediaStream,
    settings: VoiceSettings
  ): Promise<AudioProcessor> {
    const context = new AudioContext();
    const source = context.createMediaStreamSource(stream);
    
    // Create audio processing nodes
    const gainNode = context.createGain();
    const analyser = context.createAnalyser();
    const compressor = context.createDynamicsCompressor();
    const filter = context.createBiquadFilter();

    // Configure nodes
    analyser.fftSize = 256;
    compressor.threshold.value = -50;
    compressor.knee.value = 40;
    compressor.ratio.value = 12;
    compressor.attack.value = 0;
    compressor.release.value = 0.25;
    
    filter.type = 'highpass';
    filter.frequency.value = 100;

    // Connect nodes
    source
      .connect(filter)
      .connect(compressor)
      .connect(gainNode)
      .connect(analyser);

    return {
      context,
      gainNode,
      analyser,
      compressor,
      filter
    };
  }

  private async setupPeerConnection(
    sessionId: string,
    localUserId: string,
    remoteUserId: string,
    localStream: MediaStream
  ): Promise<void> {
    const peerConnection = new RTCPeerConnection({
      iceServers: this.ICE_SERVERS
    });

    const key = this.getPeerConnectionKey(sessionId, localUserId, remoteUserId);
    this.peerConnections.set(key, peerConnection);

    // Add local stream
    localStream.getTracks().forEach(track => {
      peerConnection.addTrack(track, localStream);
    });

    // Handle remote stream
    peerConnection.ontrack = (event) => {
      this.emit('voice:stream:received', {
        sessionId,
        userId: remoteUserId,
        stream: event.streams[0]
      });
    };

    // Handle ICE candidates
    peerConnection.onicecandidate = (event) => {
      if (event.candidate) {
        this.emit('voice:ice:candidate', {
          sessionId,
          from: localUserId,
          to: remoteUserId,
          candidate: event.candidate
        });
      }
    };

    // Create and send offer
    const offer = await peerConnection.createOffer();
    await peerConnection.setLocalDescription(offer);

    this.emit('voice:offer', {
      sessionId,
      from: localUserId,
      to: remoteUserId,
      offer
    });
  }

  private async applyAudioSettings(
    stream: MediaStream,
    settings: VoiceSettings
  ): Promise<void> {
    const tracks = stream.getAudioTracks();
    const constraints = this.AUDIO_CONSTRAINTS[settings.quality];
    
    for (const track of tracks) {
      await track.applyConstraints({
        ...constraints,
        noiseSuppression: settings.noiseSuppression,
        echoCancellation: settings.echoCancellation,
        autoGainControl: settings.autoGainControl
      });
    }
  }

  private startAudioLevelMonitoring(
    sessionId: string,
    userId: string,
    processor: AudioProcessor
  ): void {
    const analyser = processor.analyser;
    const dataArray = new Uint8Array(analyser.frequencyBinCount);
    
    const monitor = () => {
      const session = this.sessions.get(sessionId);
      const participant = session?.participants.get(userId);
      
      if (!participant || participant.isDeafened) {
        return;
      }

      analyser.getByteFrequencyData(dataArray);
      
      // Calculate average volume
      const average = dataArray.reduce((a, b) => a + b, 0) / dataArray.length;
      const volumeLevel = average / 255; // Normalize to 0-1
      
      this.emit('voice:audio:level', {
        sessionId,
        userId,
        level: volumeLevel
      });

      // Continue monitoring
      requestAnimationFrame(monitor);
    };
    
    monitor();
  }

  private async getMixedAudioStream(sessionId: string): Promise<MediaStream | null> {
    const session = this.sessions.get(sessionId);
    if (!session) return null;

    const audioContext = new AudioContext();
    const destination = audioContext.createMediaStreamDestination();

    for (const [userId, participant] of session.participants) {
      if (participant.audioStream && !participant.isMuted) {
        const source = audioContext.createMediaStreamSource(participant.audioStream);
        const gainNode = audioContext.createGain();
        gainNode.gain.value = participant.volume;
        source.connect(gainNode).connect(destination);
      }
    }

    return destination.stream;
  }

  private calculateConnectionQuality(stats: VoiceStatistics): 'poor' | 'fair' | 'good' | 'excellent' {
    const { packetsLost, jitter, latency } = stats;
    
    if (packetsLost > 5 || jitter > 50 || latency > 200) {
      return 'poor';
    }
    if (packetsLost > 2 || jitter > 30 || latency > 100) {
      return 'fair';
    }
    if (packetsLost > 0 || jitter > 10 || latency > 50) {
      return 'good';
    }
    return 'excellent';
  }

  private broadcastToSession(sessionId: string, event: string, data: any): void {
    const session = this.sessions.get(sessionId);
    if (!session) return;

    session.participants.forEach((participant, userId) => {
      this.emit(`session:${sessionId}:${event}`, { userId, data });
    });
  }

  private getPeerConnectionKey(...userIds: string[]): string {
    return userIds.sort().join('_');
  }

  private generateSessionId(): string {
    return `voice_${Date.now()}_${Math.random().toString(36).substring(2, 11)}`;
  }

  private initializeAudioContext(): void {
    // Initialize Web Audio API context when needed
    if (typeof window !== 'undefined' && !window.AudioContext) {
      // @ts-ignore
      window.AudioContext = window.AudioContext || window.webkitAudioContext;
    }
  }

  // End voice session
  private endVoiceSession(sessionId: string): void {
    const session = this.sessions.get(sessionId);
    if (!session) return;

    // Clean up all participants
    for (const userId of session.participants.keys()) {
      this.leaveVoiceChat(sessionId, userId);
    }

    this.sessions.delete(sessionId);
    this.emit('voice:session:ended', sessionId);
  }
}