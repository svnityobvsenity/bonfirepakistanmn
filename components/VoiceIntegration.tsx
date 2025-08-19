'use client';

import React, { useEffect, useState } from 'react';

/**
 * Voice Integration Component
 * Add this to your existing Discord clone components to enable voice chat
 */

interface VoiceUser {
  socketId: string;
  username: string;
  muted: boolean;
  deafened: boolean;
  speaking: boolean;
}

interface VoiceIntegrationProps {
  currentServer?: string;
  currentDM?: string;
  onServerChange?: (serverName: string) => void;
  onDMChange?: (dmId: string) => void;
}

export default function VoiceIntegration({ 
  currentServer, 
  currentDM, 
  onServerChange, 
  onDMChange 
}: VoiceIntegrationProps) {
  const [isConnected, setIsConnected] = useState(false);
  const [isInVoice, setIsInVoice] = useState(false);
  const [voiceUsers, setVoiceUsers] = useState<VoiceUser[]>([]);
  const [voiceState, setVoiceState] = useState({
    muted: false,
    deafened: false,
    speaking: false
  });

  useEffect(() => {
    // Initialize voice client when component mounts
    if (typeof window !== 'undefined' && (window as any).discordVoice) {
      const voice = (window as any).discordVoice;
      
      // Listen for voice state changes
      voice.socket?.on('voice-state-updated', (data: any) => {
        setVoiceUsers(prev => 
          prev.map(user => 
            user.socketId === data.socketId 
              ? { ...user, ...data.voiceState }
              : user
          )
        );
      });

      voice.socket?.on('user-joined-voice', (data: any) => {
        setVoiceUsers(prev => [...prev, {
          socketId: data.socketId,
          username: data.username,
          muted: false,
          deafened: false,
          speaking: false
        }]);
      });

      voice.socket?.on('user-left-voice', (data: any) => {
        setVoiceUsers(prev => prev.filter(user => user.socketId !== data.socketId));
      });

      setIsConnected(true);
    }
  }, []);

  useEffect(() => {
    // Join server when currentServer changes
    if (currentServer && (window as any).discordVoice) {
      (window as any).discordVoice.joinServer(currentServer);
    }
  }, [currentServer]);

  useEffect(() => {
    // Join DM when currentDM changes
    if (currentDM && (window as any).discordVoice) {
      (window as any).discordVoice.joinDM(currentDM);
    }
  }, [currentDM]);

  const handleJoinVoice = async () => {
    if ((window as any).discordVoice) {
      await (window as any).discordVoice.joinVoice();
      setIsInVoice(true);
    }
  };

  const handleLeaveVoice = () => {
    if ((window as any).discordVoice) {
      (window as any).discordVoice.leaveVoice();
      setIsInVoice(false);
      setVoiceUsers([]);
    }
  };

  const handleToggleMute = () => {
    if ((window as any).discordVoice) {
      (window as any).discordVoice.toggleMute();
      setVoiceState(prev => ({ ...prev, muted: !prev.muted }));
    }
  };

  const handleToggleDeafen = () => {
    if ((window as any).discordVoice) {
      (window as any).discordVoice.toggleDeafen();
      setVoiceState(prev => ({ ...prev, deafened: !prev.deafened }));
    }
  };

  if (!isConnected) {
    return (
      <div style={{ padding: '10px', background: '#f0f0f0', borderRadius: '4px', margin: '10px' }}>
        <p>🔄 Connecting to voice server...</p>
      </div>
    );
  }

  return (
    <div style={{ padding: '10px', background: '#2f3136', borderRadius: '4px', margin: '10px' }}>
      {/* Voice Controls */}
      <div style={{ display: 'flex', gap: '10px', marginBottom: '10px' }}>
        {!isInVoice ? (
          <button 
            onClick={handleJoinVoice}
            style={{
              background: '#5865f2',
              color: 'white',
              border: 'none',
              padding: '8px 16px',
              borderRadius: '4px',
              cursor: 'pointer'
            }}
            className="voice-join-btn"
          >
            🎤 Join Voice
          </button>
        ) : (
          <>
            <button 
              onClick={handleLeaveVoice}
              style={{
                background: '#ed4245',
                color: 'white',
                border: 'none',
                padding: '8px 16px',
                borderRadius: '4px',
                cursor: 'pointer'
              }}
              className="voice-leave-btn"
            >
              🔇 Leave Voice
            </button>
            
            <button 
              onClick={handleToggleMute}
              style={{
                background: voiceState.muted ? '#ed4245' : '#4f545c',
                color: 'white',
                border: 'none',
                padding: '8px 16px',
                borderRadius: '4px',
                cursor: 'pointer'
              }}
              className="voice-mute-btn"
            >
              {voiceState.muted ? '🔇 Unmute' : '🎤 Mute'}
            </button>
            
            <button 
              onClick={handleToggleDeafen}
              style={{
                background: voiceState.deafened ? '#ed4245' : '#4f545c',
                color: 'white',
                border: 'none',
                padding: '8px 16px',
                borderRadius: '4px',
                cursor: 'pointer'
              }}
              className="voice-deafen-btn"
            >
              {voiceState.deafened ? '🔇 Undeafen' : '🔊 Deafen'}
            </button>
          </>
        )}
      </div>

      {/* Voice Users List */}
      {isInVoice && voiceUsers.length > 0 && (
        <div>
          <h4 style={{ color: '#b9bbbe', margin: '10px 0 5px 0', fontSize: '12px' }}>
            VOICE CHAT ({voiceUsers.length})
          </h4>
          {voiceUsers.map(user => (
            <div 
              key={user.socketId}
              style={{
                display: 'flex',
                alignItems: 'center',
                padding: '4px 8px',
                borderRadius: '3px',
                marginBottom: '2px',
                background: user.speaking ? '#3ba55c' : 'transparent',
                color: '#dcddde'
              }}
            >
              <span style={{ fontSize: '12px', marginRight: '8px' }}>
                {user.muted ? '🔇' : user.speaking ? '🎤' : '🔊'}
              </span>
              <span style={{ fontSize: '14px' }}>
                {user.username}
              </span>
              {user.deafened && (
                <span style={{ fontSize: '12px', marginLeft: '8px' }}>🔇</span>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Connection Status */}
      <div style={{ 
        fontSize: '10px', 
        color: '#72767d', 
        marginTop: '10px',
        textAlign: 'center'
      }}>
        {currentServer ? `Connected to: ${currentServer}` : 
         currentDM ? `DM: ${currentDM}` : 
         'Select a server or DM'}
      </div>
    </div>
  );
}

// Helper function to add voice controls to existing components
export function addVoiceControlsToServer(serverName: string) {
  if (typeof window !== 'undefined' && (window as any).discordVoice) {
    (window as any).discordVoice.joinServer(serverName);
  }
}

export function addVoiceControlsToDM(targetUsername: string) {
  if (typeof window !== 'undefined' && (window as any).discordVoice) {
    (window as any).discordVoice.joinDM(targetUsername);
  }
}

export function sendMessage(message: string) {
  if (typeof window !== 'undefined' && (window as any).discordVoice) {
    (window as any).discordVoice.sendMessage(message);
  }
}

