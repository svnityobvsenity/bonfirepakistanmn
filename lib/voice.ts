import { supabase } from './supabaseClient'

export interface VoiceState {
  isConnected: boolean
  isMuted: boolean
  isDeafened: boolean
  isSpeaking: boolean
  currentChannel?: string
  currentCall?: string
}

export interface VoiceUser {
  userId: string
  username: string
  displayName?: string
  avatarUrl?: string
  isMuted: boolean
  isDeafened: boolean
  isSpeaking: boolean
  stream?: MediaStream
}

export interface VoiceConfig {
  signalingServerUrl: string
  turnServers?: RTCIceServer[]
  maxParticipants?: number
}

class VoiceClient {
  private config: VoiceConfig
  private state: VoiceState = {
    isConnected: false,
    isMuted: false,
    isDeafened: false,
    isSpeaking: false
  }
  
  private localStream?: MediaStream
  private peerConnections: Map<string, RTCPeerConnection> = new Map()
  private signalingSocket?: WebSocket
  private audioContext?: AudioContext
  private audioAnalyser?: AnalyserNode
  private speakingTimeout?: NodeJS.Timeout
  
  // Event callbacks
  private onStateChange?: (state: VoiceState) => void
  private onUserJoin?: (user: VoiceUser) => void
  private onUserLeave?: (userId: string) => void
  private onUserUpdate?: (user: VoiceUser) => void
  private onSpeakingStart?: (userId: string) => void
  private onSpeakingStop?: (userId: string) => void

  constructor(config: VoiceConfig) {
    this.config = {
      maxParticipants: 12, // Safe limit for mesh topology
      ...config
    }
  }

  // Initialize voice client
  async initialize(): Promise<void> {
    try {
      // Get user media
      this.localStream = await navigator.mediaDevices.getUserMedia({
        audio: {
          echoCancellation: true,
          noiseSuppression: true,
          autoGainControl: true
        },
        video: false
      })

      // Set up audio analysis for speaking detection
      this.setupAudioAnalysis()

      // Update state
      this.state.isConnected = true
      this.notifyStateChange()

      console.log('Voice client initialized')
    } catch (error) {
      console.error('Failed to initialize voice client:', error)
      throw error
    }
  }

  // Set up audio analysis for speaking detection
  private setupAudioAnalysis(): void {
    if (!this.localStream) return

    this.audioContext = new AudioContext()
    const source = this.audioContext.createMediaStreamSource(this.localStream)
    this.audioAnalyser = this.audioContext.createAnalyser()
    
    this.audioAnalyser.fftSize = 256
    this.audioAnalyser.smoothingTimeConstant = 0.8
    
    source.connect(this.audioAnalyser)
    
    // Start speaking detection
    this.detectSpeaking()
  }

  // Detect if user is speaking
  private detectSpeaking(): void {
    if (!this.audioAnalyser || this.state.isMuted || this.state.isDeafened) {
      this.state.isSpeaking = false
      this.notifyStateChange()
      return
    }

    const bufferLength = this.audioAnalyser.frequencyBinCount
    const dataArray = new Uint8Array(bufferLength)
    this.audioAnalyser.getByteFrequencyData(dataArray)

    // Calculate average volume
    const average = dataArray.reduce((sum, value) => sum + value, 0) / bufferLength
    const isSpeaking = average > 30 // Threshold for speaking detection

    if (isSpeaking !== this.state.isSpeaking) {
      this.state.isSpeaking = isSpeaking
      this.notifyStateChange()
      
      // Notify signaling server
      if (this.signalingSocket && this.signalingSocket.readyState === WebSocket.OPEN) {
        this.signalingSocket.send(JSON.stringify({
          type: 'speaking',
          speaking: isSpeaking
        }))
      }
    }

    // Continue detection
    requestAnimationFrame(() => this.detectSpeaking())
  }

  // Join a server voice channel
  async joinServerVC(channelId: string): Promise<void> {
    if (this.state.currentChannel === channelId) return

    try {
      // Get authentication token
      const { data: { session } } = await supabase.auth.getSession()
      if (!session) {
        throw new Error('Not authenticated')
      }

      // Connect to signaling server
      await this.connectToSignalingServer(channelId, session.access_token)

      // Update state
      this.state.currentChannel = channelId
      this.notifyStateChange()

      console.log(`Joined voice channel: ${channelId}`)
    } catch (error) {
      console.error('Failed to join voice channel:', error)
      throw error
    }
  }

  // Leave current voice channel
  async leaveServerVC(): Promise<void> {
    if (!this.state.currentChannel) return

    try {
      // Disconnect from signaling server
      if (this.signalingSocket) {
        this.signalingSocket.close()
        this.signalingSocket = undefined
      }

      // Close all peer connections
      for (const [peerId, connection] of this.peerConnections) {
        connection.close()
        this.onUserLeave?.(peerId)
      }
      this.peerConnections.clear()

      // Update state
      this.state.currentChannel = undefined
      this.notifyStateChange()

      console.log('Left voice channel')
    } catch (error) {
      console.error('Failed to leave voice channel:', error)
      throw error
    }
  }

  // Start a DM call
  async startDMCall(targetUserId: string): Promise<void> {
    if (this.state.currentCall) {
      throw new Error('Already in a call')
    }

    try {
      // Get authentication token
      const { data: { session } } = await supabase.auth.getSession()
      if (!session) {
        throw new Error('Not authenticated')
      }

      // Connect to signaling server for DM call
      await this.connectToSignalingServer(`dm-${targetUserId}`, session.access_token)

      // Update state
      this.state.currentCall = targetUserId
      this.notifyStateChange()

      console.log(`Started DM call with: ${targetUserId}`)
    } catch (error) {
      console.error('Failed to start DM call:', error)
      throw error
    }
  }

  // Accept a DM call
  async acceptCall(callId: string): Promise<void> {
    if (this.state.currentCall) {
      throw new Error('Already in a call')
    }

    try {
      // Get authentication token
      const { data: { session } } = await supabase.auth.getSession()
      if (!session) {
        throw new Error('Not authenticated')
      }

      // Connect to signaling server for DM call
      await this.connectToSignalingServer(`dm-${callId}`, session.access_token)

      // Update state
      this.state.currentCall = callId
      this.notifyStateChange()

      console.log(`Accepted DM call from: ${callId}`)
    } catch (error) {
      console.error('Failed to accept call:', error)
      throw error
    }
  }

  // End current call
  async endCall(): Promise<void> {
    if (!this.state.currentCall) return

    try {
      // Disconnect from signaling server
      if (this.signalingSocket) {
        this.signalingSocket.close()
        this.signalingSocket = undefined
      }

      // Close all peer connections
      for (const [peerId, connection] of this.peerConnections) {
        connection.close()
        this.onUserLeave?.(peerId)
      }
      this.peerConnections.clear()

      // Update state
      this.state.currentCall = undefined
      this.notifyStateChange()

      console.log('Ended call')
    } catch (error) {
      console.error('Failed to end call:', error)
      throw error
    }
  }

  // Toggle mute
  toggleMute(): void {
    if (!this.localStream) return

    const audioTrack = this.localStream.getAudioTracks()[0]
    if (audioTrack) {
      audioTrack.enabled = !audioTrack.enabled
      this.state.isMuted = !audioTrack.enabled
      this.notifyStateChange()

      // Notify signaling server
      if (this.signalingSocket && this.signalingSocket.readyState === WebSocket.OPEN) {
        this.signalingSocket.send(JSON.stringify({
          type: 'mute',
          muted: this.state.isMuted
        }))
      }
    }
  }

  // Toggle deafen
  toggleDeafen(): void {
    this.state.isDeafened = !this.state.isDeafened
    this.notifyStateChange()

    // Mute/unmute all remote audio
    for (const connection of this.peerConnections.values()) {
      connection.getReceivers().forEach(receiver => {
        if (receiver.track && receiver.track.kind === 'audio') {
          receiver.track.enabled = !this.state.isDeafened
        }
      })
    }

    // Notify signaling server
    if (this.signalingSocket && this.signalingSocket.readyState === WebSocket.OPEN) {
      this.signalingSocket.send(JSON.stringify({
        type: 'deafen',
        deafened: this.state.isDeafened
      }))
    }
  }

  // Connect to signaling server
  private async connectToSignalingServer(roomId: string, token: string): Promise<void> {
    return new Promise((resolve, reject) => {
      const wsUrl = `${this.config.signalingServerUrl}?room=${roomId}&token=${token}`
      this.signalingSocket = new WebSocket(wsUrl)

      this.signalingSocket.onopen = () => {
        console.log('Connected to signaling server')
        resolve()
      }

      this.signalingSocket.onmessage = (event) => {
        this.handleSignalingMessage(JSON.parse(event.data))
      }

      this.signalingSocket.onerror = (error) => {
        console.error('Signaling server error:', error)
        reject(error)
      }

      this.signalingSocket.onclose = () => {
        console.log('Disconnected from signaling server')
        this.state.isConnected = false
        this.notifyStateChange()
      }
    })
  }

  // Handle signaling messages
  private handleSignalingMessage(message: any): void {
    switch (message.type) {
      case 'user-joined':
        this.handleUserJoined(message.userId, message.userInfo)
        break
      case 'user-left':
        this.handleUserLeft(message.userId)
        break
      case 'offer':
        this.handleOffer(message.userId, message.offer)
        break
      case 'answer':
        this.handleAnswer(message.userId, message.answer)
        break
      case 'ice-candidate':
        this.handleIceCandidate(message.userId, message.candidate)
        break
      case 'user-update':
        this.handleUserUpdate(message.userId, message.updates)
        break
    }
  }

  // Handle user joining
  private async handleUserJoined(userId: string, userInfo: any): Promise<void> {
    console.log(`User joined: ${userId}`)

    // Create peer connection
    const peerConnection = this.createPeerConnection(userId)
    this.peerConnections.set(userId, peerConnection)

    // Add local stream
    if (this.localStream) {
      this.localStream.getTracks().forEach(track => {
        peerConnection.addTrack(track, this.localStream!)
      })
    }

    // Create and send offer
    const offer = await peerConnection.createOffer()
    await peerConnection.setLocalDescription(offer)

    this.signalingSocket?.send(JSON.stringify({
      type: 'offer',
      targetUserId: userId,
      offer
    }))

    // Notify UI
    this.onUserJoin?.({
      userId,
      username: userInfo.username,
      displayName: userInfo.displayName,
      avatarUrl: userInfo.avatarUrl,
      isMuted: false,
      isDeafened: false,
      isSpeaking: false
    })
  }

  // Handle user leaving
  private handleUserLeft(userId: string): void {
    console.log(`User left: ${userId}`)

    // Close peer connection
    const peerConnection = this.peerConnections.get(userId)
    if (peerConnection) {
      peerConnection.close()
      this.peerConnections.delete(userId)
    }

    // Notify UI
    this.onUserLeave?.(userId)
  }

  // Handle incoming offer
  private async handleOffer(userId: string, offer: RTCSessionDescriptionInit): Promise<void> {
    console.log(`Received offer from: ${userId}`)

    // Create peer connection
    const peerConnection = this.createPeerConnection(userId)
    this.peerConnections.set(userId, peerConnection)

    // Add local stream
    if (this.localStream) {
      this.localStream.getTracks().forEach(track => {
        peerConnection.addTrack(track, this.localStream!)
      })
    }

    // Set remote description and create answer
    await peerConnection.setRemoteDescription(offer)
    const answer = await peerConnection.createAnswer()
    await peerConnection.setLocalDescription(answer)

    this.signalingSocket?.send(JSON.stringify({
      type: 'answer',
      targetUserId: userId,
      answer
    }))
  }

  // Handle incoming answer
  private async handleAnswer(userId: string, answer: RTCSessionDescriptionInit): Promise<void> {
    console.log(`Received answer from: ${userId}`)

    const peerConnection = this.peerConnections.get(userId)
    if (peerConnection) {
      await peerConnection.setRemoteDescription(answer)
    }
  }

  // Handle ICE candidate
  private async handleIceCandidate(userId: string, candidate: RTCIceCandidateInit): Promise<void> {
    const peerConnection = this.peerConnections.get(userId)
    if (peerConnection) {
      await peerConnection.addIceCandidate(candidate)
    }
  }

  // Handle user update
  private handleUserUpdate(userId: string, updates: any): void {
    this.onUserUpdate?.({
      userId,
      username: updates.username || '',
      displayName: updates.displayName,
      avatarUrl: updates.avatarUrl,
      isMuted: updates.isMuted || false,
      isDeafened: updates.isDeafened || false,
      isSpeaking: updates.isSpeaking || false
    })
  }

  // Create peer connection
  private createPeerConnection(userId: string): RTCPeerConnection {
    const configuration: RTCConfiguration = {
      iceServers: this.config.turnServers || [
        { urls: 'stun:stun.l.google.com:19302' }
      ]
    }

    const peerConnection = new RTCPeerConnection(configuration)

    // Handle ICE candidates
    peerConnection.onicecandidate = (event) => {
      if (event.candidate) {
        this.signalingSocket?.send(JSON.stringify({
          type: 'ice-candidate',
          targetUserId: userId,
          candidate: event.candidate
        }))
      }
    }

    // Handle remote stream
    peerConnection.ontrack = (event) => {
      const [stream] = event.streams
      if (stream) {
        // Create audio element for remote stream
        const audio = new Audio()
        audio.srcObject = stream
        audio.autoplay = true
        audio.volume = this.state.isDeafened ? 0 : 1

        // Notify UI with stream
        this.onUserUpdate?.({
          userId,
          username: '',
          isMuted: false,
          isDeafened: false,
          isSpeaking: false,
          stream
        })
      }
    }

    return peerConnection
  }

  // Notify state change
  private notifyStateChange(): void {
    this.onStateChange?.({ ...this.state })
  }

  // Event listeners
  on(event: 'stateChange', callback: (state: VoiceState) => void): void
  on(event: 'userJoin', callback: (user: VoiceUser) => void): void
  on(event: 'userLeave', callback: (userId: string) => void): void
  on(event: 'userUpdate', callback: (user: VoiceUser) => void): void
  on(event: 'speakingStart', callback: (userId: string) => void): void
  on(event: 'speakingStop', callback: (userId: string) => void): void
  on(event: string, callback: any): void {
    switch (event) {
      case 'stateChange':
        this.onStateChange = callback
        break
      case 'userJoin':
        this.onUserJoin = callback
        break
      case 'userLeave':
        this.onUserLeave = callback
        break
      case 'userUpdate':
        this.onUserUpdate = callback
        break
      case 'speakingStart':
        this.onSpeakingStart = callback
        break
      case 'speakingStop':
        this.onSpeakingStop = callback
        break
    }
  }

  // Get current state
  getState(): VoiceState {
    return { ...this.state }
  }

  // Cleanup
  destroy(): void {
    this.endCall()
    this.leaveServerVC()
    
    if (this.localStream) {
      this.localStream.getTracks().forEach(track => track.stop())
    }
    
    if (this.audioContext) {
      this.audioContext.close()
    }
    
    if (this.speakingTimeout) {
      clearTimeout(this.speakingTimeout)
    }
  }
}

// Export singleton instance
let voiceClient: VoiceClient | null = null

export const getVoiceClient = (config?: VoiceConfig): VoiceClient => {
  if (!voiceClient && config) {
    voiceClient = new VoiceClient(config)
  }
  if (!voiceClient) {
    throw new Error('Voice client not initialized. Call getVoiceClient(config) first.')
  }
  return voiceClient
}

export const destroyVoiceClient = (): void => {
  if (voiceClient) {
    voiceClient.destroy()
    voiceClient = null
  }
}
