'use client'

import { useState, useEffect, useCallback } from 'react'
import { VoiceClient, VoiceState, VoiceUser } from '@/lib/voice'
import { useAuth } from '@/contexts/AuthContext'

interface VoicePanelProps {
  channelId?: string
  dmId?: string
  channelName?: string
}

export default function VoicePanel({ channelId, dmId, channelName }: VoicePanelProps) {
  const { user } = useAuth()
  const [voiceClient, setVoiceClient] = useState<VoiceClient | null>(null)
  const [voiceState, setVoiceState] = useState<VoiceState>({
    isConnected: false,
    isMuted: false,
    isDeafened: false,
    isSpeaking: false
  })
  const [voiceUsers, setVoiceUsers] = useState<VoiceUser[]>([])
  const [error, setError] = useState<string | null>(null)
  const [isInitializing, setIsInitializing] = useState(false)

  // Initialize voice client
  const initializeVoice = useCallback(async () => {
    if (!user || isInitializing) return

    try {
      setIsInitializing(true)
      setError(null)

      const signalingServerUrl = process.env.NEXT_PUBLIC_SIGNALING_SERVER_URL || 'ws://localhost:3001'
      
      const client = new VoiceClient({
        signalingServerUrl,
        turnServers: [
          {
            urls: process.env.NEXT_PUBLIC_TURN_URL || 'stun:stun.l.google.com:19302'
          }
        ]
      })

      // Set up event listeners
      client.onStateChange = (state) => setVoiceState(state)
      client.onUserJoin = (voiceUser) => {
        setVoiceUsers(prev => [...prev, voiceUser])
      }
      client.onUserLeave = (userId) => {
        setVoiceUsers(prev => prev.filter(u => u.userId !== userId))
      }
      client.onUserUpdate = (voiceUser) => {
        setVoiceUsers(prev => prev.map(u => 
          u.userId === voiceUser.userId ? voiceUser : u
        ))
      }

      await client.initialize()
      setVoiceClient(client)
    } catch (err: any) {
      setError(err.message || 'Failed to initialize voice')
      console.error('Voice initialization error:', err)
    } finally {
      setIsInitializing(false)
    }
  }, [user, isInitializing])

  // Join voice channel
  const joinVoice = useCallback(async () => {
    if (!voiceClient || !user) return

    try {
      if (channelId) {
        await voiceClient.joinServerVC(channelId)
      } else if (dmId) {
        await voiceClient.startDMCall(dmId)
      }
    } catch (err: any) {
      setError(err.message || 'Failed to join voice')
    }
  }, [voiceClient, channelId, dmId, user])

  // Leave voice
  const leaveVoice = useCallback(async () => {
    if (!voiceClient) return

    try {
      if (channelId) {
        await voiceClient.leaveServerVC()
      } else if (dmId) {
        await voiceClient.endCall()
      }
      setVoiceUsers([])
    } catch (err: any) {
      setError(err.message || 'Failed to leave voice')
    }
  }, [voiceClient, channelId, dmId])

  // Toggle mute
  const toggleMute = useCallback(() => {
    if (!voiceClient) return
    voiceClient.toggleMute()
  }, [voiceClient])

  // Toggle deafen
  const toggleDeafen = useCallback(() => {
    if (!voiceClient) return
    voiceClient.toggleDeafen()
  }, [voiceClient])

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (voiceClient) {
        voiceClient.disconnect()
      }
    }
  }, [voiceClient])

  if (!channelId && !dmId) {
    return null
  }

  return (
    <div className="voice-panel bg-gray-800 border-t border-gray-700 p-4">
      {error && (
        <div className="mb-4 p-3 bg-red-500/20 border border-red-500/30 rounded-lg text-red-300 text-sm">
          {error}
          <button 
            onClick={() => setError(null)}
            className="ml-2 text-red-400 hover:text-red-300"
          >
            ×
          </button>
        </div>
      )}

      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-2">
          <div className="w-2 h-2 bg-green-500 rounded-full"></div>
          <span className="text-white font-medium">
            {channelName || 'Direct Call'}
          </span>
        </div>
        
        {!voiceState.isConnected ? (
          <button
            onClick={voiceClient ? joinVoice : initializeVoice}
            disabled={isInitializing}
            className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors disabled:opacity-50"
          >
            {isInitializing ? 'Initializing...' : voiceClient ? 'Join' : 'Connect'}
          </button>
        ) : (
          <button
            onClick={leaveVoice}
            className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors"
          >
            Leave
          </button>
        )}
      </div>

      {voiceState.isConnected && (
        <>
          {/* Voice Controls */}
          <div className="flex items-center space-x-2 mb-4">
            <button
              onClick={toggleMute}
              className={`p-2 rounded-lg transition-colors ${
                voiceState.isMuted 
                  ? 'bg-red-600 hover:bg-red-700' 
                  : 'bg-gray-600 hover:bg-gray-700'
              }`}
              title={voiceState.isMuted ? 'Unmute' : 'Mute'}
            >
              <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                {voiceState.isMuted ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" />
                )}
              </svg>
            </button>

            <button
              onClick={toggleDeafen}
              className={`p-2 rounded-lg transition-colors ${
                voiceState.isDeafened 
                  ? 'bg-red-600 hover:bg-red-700' 
                  : 'bg-gray-600 hover:bg-gray-700'
              }`}
              title={voiceState.isDeafened ? 'Undeafen' : 'Deafen'}
            >
              <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                {voiceState.isDeafened ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                )}
              </svg>
            </button>

            {voiceState.isSpeaking && (
              <div className="flex items-center space-x-1 text-green-400">
                <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                <span className="text-sm">Speaking</span>
              </div>
            )}
          </div>

          {/* Voice Users */}
          <div className="space-y-2">
            <h4 className="text-gray-400 text-sm font-medium">
              In Voice ({voiceUsers.length + 1})
            </h4>
            
            {/* Current User */}
            <div className="flex items-center space-x-3 p-2 rounded-lg bg-gray-700/50">
              <div className="relative">
                {user?.avatar_url ? (
                  <img
                    src={user.avatar_url}
                    alt={user.display_name}
                    className="w-8 h-8 rounded-full"
                  />
                ) : (
                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-purple-500 to-violet-500 flex items-center justify-center text-white text-sm font-bold">
                    {user?.username?.charAt(0).toUpperCase()}
                  </div>
                )}
                {voiceState.isSpeaking && (
                  <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-green-400 rounded-full border-2 border-gray-800 animate-pulse"></div>
                )}
              </div>
              <div className="flex-1">
                <div className="text-white text-sm font-medium">
                  {user?.display_name || user?.username} (You)
                </div>
              </div>
              <div className="flex space-x-1">
                {voiceState.isMuted && (
                  <div className="w-4 h-4 text-red-400">
                    <svg fill="currentColor" viewBox="0 0 24 24">
                      <path d="M16 9v1.5c0 .83-.67 1.5-1.5 1.5s-1.5-.67-1.5-1.5V9c0-.83.67-1.5 1.5-1.5s1.5.67 1.5 1.5z"/>
                    </svg>
                  </div>
                )}
                {voiceState.isDeafened && (
                  <div className="w-4 h-4 text-red-400">
                    <svg fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12 14c1.66 0 3-1.34 3-3V5c0-1.66-1.34-3-3-3S9 3.34 9 5v6c0 1.66 1.34 3 3 3z"/>
                    </svg>
                  </div>
                )}
              </div>
            </div>

            {/* Other Users */}
            {voiceUsers.map((voiceUser) => (
              <div key={voiceUser.userId} className="flex items-center space-x-3 p-2 rounded-lg hover:bg-gray-700/30">
                <div className="relative">
                  {voiceUser.avatarUrl ? (
                    <img
                      src={voiceUser.avatarUrl}
                      alt={voiceUser.displayName}
                      className="w-8 h-8 rounded-full"
                    />
                  ) : (
                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center text-white text-sm font-bold">
                      {voiceUser.username.charAt(0).toUpperCase()}
                    </div>
                  )}
                  {voiceUser.isSpeaking && (
                    <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-green-400 rounded-full border-2 border-gray-800 animate-pulse"></div>
                  )}
                </div>
                <div className="flex-1">
                  <div className="text-white text-sm font-medium">
                    {voiceUser.displayName || voiceUser.username}
                  </div>
                </div>
                <div className="flex space-x-1">
                  {voiceUser.isMuted && (
                    <div className="w-4 h-4 text-red-400">
                      <svg fill="currentColor" viewBox="0 0 24 24">
                        <path d="M16 9v1.5c0 .83-.67 1.5-1.5 1.5s-1.5-.67-1.5-1.5V9c0-.83.67-1.5 1.5-1.5s1.5.67 1.5 1.5z"/>
                      </svg>
                    </div>
                  )}
                  {voiceUser.isDeafened && (
                    <div className="w-4 h-4 text-red-400">
                      <svg fill="currentColor" viewBox="0 0 24 24">
                        <path d="M12 14c1.66 0 3-1.34 3-3V5c0-1.66-1.34-3-3-3S9 3.34 9 5v6c0 1.66 1.34 3 3 3z"/>
                      </svg>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  )
}
