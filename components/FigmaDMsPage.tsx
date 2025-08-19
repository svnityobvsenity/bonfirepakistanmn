'use client';

import React, { useState } from 'react';
import FigmaServerPage from './FigmaServerPage';
import InboxIcon from './InboxIcon';

// Server icon component with better error handling
const ServerIcon = ({ src, alt, fallback, className, style, onClick, title }: {
  src: string;
  alt: string;
  fallback: string;
  className?: string;
  style?: React.CSSProperties;
  onClick?: () => void;
  title?: string;
}) => {
  const [hasError, setHasError] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);

  const handleError = () => {
    setHasError(true);
    console.warn(`Failed to load server icon: ${src}`);
  };

  const handleLoad = () => {
    setIsLoaded(true);
  };

  if (hasError) {
    return (
      <div 
        className={className} 
        style={{...style, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '24px'}}
        onClick={onClick}
        title={title}
      >
        {fallback}
      </div>
    );
  }

  return (
    <div className={className} style={style} onClick={onClick} title={title}>
      <img 
        src={src} 
        alt={alt} 
        style={{width: '36px', height: '36px', borderRadius: '12px', objectFit: 'cover'}}
        onError={handleError}
        onLoad={handleLoad}
        loading="eager"
      />
    </div>
  );
};

// Avatar component with fallback
const Avatar = ({ src, alt, fallback, size = 40, className = "", style = {} }: {
  src: string;
  alt: string;
  fallback: string;
  size?: number;
  className?: string;
  style?: React.CSSProperties;
}) => {
  const [hasError, setHasError] = useState(false);

  const handleError = () => {
    setHasError(true);
    console.warn(`Failed to load avatar: ${src}`);
  };

  if (hasError) {
    return (
      <div 
        className={`${className} avatar-fallback`}
        style={{
          ...style,
          width: `${size}px`,
          height: `${size}px`,
          borderRadius: '50%',
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: 'white',
          fontSize: `${size * 0.4}px`,
          fontWeight: 'bold',
          border: '3px solid transparent',
          backgroundClip: 'padding-box'
        }}
      >
        {fallback}
      </div>
    );
  }

  return (
    <img
      src={src}
      alt={alt}
      className={className}
      style={{
        ...style,
        width: `${size}px`,
        height: `${size}px`,
        borderRadius: '50%',
        objectFit: 'cover',
        border: '3px solid transparent',
        backgroundClip: 'padding-box'
      }}
      onError={handleError}
      loading="lazy"
    />
  );
};

// User data will be populated by real-time data
const users: any[] = [];

// Voice channels and messages will be populated by real-time data
const voiceChannels: any[] = [];
const messages: any[] = [];

export default function FigmaDMsPage() {
  const [selectedUserId, setSelectedUserId] = useState(1);
  const [messageInput, setMessageInput] = useState('');
  const [currentMessages, setCurrentMessages] = useState(messages);
  const [currentView, setCurrentView] = useState<'dms' | 'server' | 'voice'>('dms');
  const [selectedServer, setSelectedServer] = useState<string>('bonfire pakistan');
  const [searchQuery, setSearchQuery] = useState('');
  const [isVoiceConnected, setIsVoiceConnected] = useState(false);
  const [voiceSettings, setVoiceSettings] = useState({
    muted: false,
    deafened: false,
    camera: false,
    screenShare: false
  });
  const [connectedVoiceChannel, setConnectedVoiceChannel] = useState<string | null>(null);
  const [showSettings, setShowSettings] = useState(false);

  const handleSendMessage = () => {
    if (messageInput.trim()) {
      const newMessage = {
        id: currentMessages.length + 1,
        author: 'You',
        time: 'Today at ' + new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'}),
        text: messageInput.trim(),
        avatar: '/avatars/you.jpg'
      };
      setCurrentMessages([...currentMessages, newMessage]);
      setMessageInput('');
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSendMessage();
    }
  };

  const handleServerClick = (serverName: string) => {
    setSelectedServer(serverName);
    setCurrentView('server');
  };

  const handleVoiceChannelJoin = (channelId: string) => {
    setConnectedVoiceChannel(channelId);
    setIsVoiceConnected(true);
    setCurrentView('voice');
  };

  const handleVoiceDisconnect = () => {
    setConnectedVoiceChannel(null);
    setIsVoiceConnected(false);
    setCurrentView('dms');
    setVoiceSettings({
      muted: false,
      deafened: false,
      camera: false,
      screenShare: false
    });
  };

  const toggleVoiceSetting = (setting: keyof typeof voiceSettings) => {
    setVoiceSettings(prev => ({
      ...prev,
      [setting]: !prev[setting]
    }));
  };

  const filteredUsers = users.filter(user => 
    user.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Show server view if selected
  if (currentView === 'server') {
    return <FigmaServerPage onBackToDMs={() => setCurrentView('dms')} serverName={selectedServer} />;
  }

  // Show voice channel interface if connected
  if (currentView === 'voice' && connectedVoiceChannel) {
    const channel = voiceChannels.find(vc => vc.id === connectedVoiceChannel);
    return (
      <div className="voice-interface">
        <style jsx>{`
          .voice-interface {
            position: fixed;
            top: 0;
            left: 0;
            width: 100vw;
            height: 100vh;
            background: linear-gradient(135deg, #0a0a0a 0%, #1a1a2e 50%, #16213e 100%);
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            z-index: 1000;
          }

          .voice-header {
            position: absolute;
            top: 40px;
            left: 50%;
            transform: translateX(-50%);
            text-align: center;
          }

          .voice-channel-name {
            font-size: 32px;
            font-weight: 700;
            color: #ffffff;
            margin-bottom: 8px;
            text-shadow: 0 4px 20px rgba(102, 126, 234, 0.5);
          }

          .voice-users-count {
            font-size: 16px;
            color: rgba(255, 255, 255, 0.7);
          }

          .voice-users-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
            gap: 30px;
            max-width: 800px;
            margin: 40px 0;
          }

          .voice-user-card {
            background: rgba(255, 255, 255, 0.1);
            backdrop-filter: blur(20px);
            border-radius: 20px;
            border: 2px solid rgba(102, 126, 234, 0.3);
            padding: 30px;
            text-align: center;
            transition: all 0.3s ease;
            position: relative;
            overflow: hidden;
          }

          .voice-user-card::before {
            content: '';
            position: absolute;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background: linear-gradient(45deg, transparent 30%, rgba(102, 126, 234, 0.1) 50%, transparent 70%);
            opacity: 0;
            transition: opacity 0.3s ease;
          }

          .voice-user-card:hover::before {
            opacity: 1;
          }

          .voice-user-avatar {
            width: 80px;
            height: 80px;
            border-radius: 50%;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            margin: 0 auto 20px;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 36px;
            color: white;
            position: relative;
            box-shadow: 0 8px 30px rgba(102, 126, 234, 0.4);
          }

          .voice-user-name {
            font-size: 18px;
            font-weight: 600;
            color: #ffffff;
            margin-bottom: 8px;
          }

          .voice-user-status {
            font-size: 14px;
            color: rgba(255, 255, 255, 0.6);
          }

          .voice-controls {
            position: absolute;
            bottom: 40px;
            left: 50%;
            transform: translateX(-50%);
            display: flex;
            gap: 20px;
          }

          .voice-control-btn {
            width: 60px;
            height: 60px;
            border-radius: 50%;
            border: none;
            cursor: pointer;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 24px;
            transition: all 0.3s ease;
            position: relative;
            backdrop-filter: blur(20px);
          }

          .voice-control-btn.mute {
            background: ${voiceSettings.muted ? 'linear-gradient(135deg, #ff4757 0%, #ff3838 100%)' : 'rgba(255, 255, 255, 0.2)'};
            color: white;
          }

          .voice-control-btn.deafen {
            background: ${voiceSettings.deafened ? 'linear-gradient(135deg, #ff4757 0%, #ff3838 100%)' : 'rgba(255, 255, 255, 0.2)'};
            color: white;
          }

          .voice-control-btn.camera {
            background: ${voiceSettings.camera ? 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' : 'rgba(255, 255, 255, 0.2)'};
            color: white;
          }

          .voice-control-btn.screen {
            background: ${voiceSettings.screenShare ? 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' : 'rgba(255, 255, 255, 0.2)'};
            color: white;
          }

          .voice-control-btn.disconnect {
            background: linear-gradient(135deg, #ff4757 0%, #ff3838 100%);
            color: white;
          }

          .voice-control-btn:hover {
            transform: translateY(-4px);
            box-shadow: 0 8px 30px rgba(0, 0, 0, 0.3);
          }

          .back-to-dms {
            position: absolute;
            top: 40px;
            left: 40px;
            width: 50px;
            height: 50px;
            border-radius: 50%;
            background: rgba(255, 255, 255, 0.1);
            backdrop-filter: blur(20px);
            border: 1px solid rgba(255, 255, 255, 0.2);
            color: white;
            cursor: pointer;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 20px;
            transition: all 0.3s ease;
          }

          .back-to-dms:hover {
            background: rgba(102, 126, 234, 0.3);
            transform: translateY(-2px);
          }
        `}</style>

        <button className="back-to-dms" onClick={() => setCurrentView('dms')}>
          ←
        </button>

        <div className="voice-header">
          <div className="voice-channel-name">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor" style={{marginRight: '8px'}}>
              <path d="M14,3.23V5.29C16.89,6.15 19,8.83 19,12C19,15.17 16.89,17.84 14,18.7V20.77C18,19.86 21,16.28 21,12C21,7.72 18,4.14 14,3.23M16.5,12C16.5,10.23 15.5,8.71 14,7.97V16C15.5,15.29 16.5,13.76 16.5,12M3,9V15H7L12,20V4L7,9H3Z"/>
            </svg>
            {channel?.name}
          </div>
          <div className="voice-users-count">{channel?.users.length}/{channel?.maxUsers} users</div>
        </div>

        <div className="voice-users-grid">
          {channel?.users.map((username: string, index: number) => (
            <div key={index} className="voice-user-card">
              <div className="voice-user-avatar">
                {username.charAt(0).toUpperCase()}
              </div>
              <div className="voice-user-name">{username}</div>
              <div className="voice-user-status">Connected</div>
            </div>
          ))}
          
          <div className="voice-user-card">
            <div className="voice-user-avatar">
              Y
            </div>
            <div className="voice-user-name">You</div>
            <div className="voice-user-status">
              {voiceSettings.muted ? 'Muted' : 'Speaking'}
            </div>
          </div>
        </div>

        <div className="voice-controls">
          <button 
            className="voice-control-btn mute"
            onClick={() => toggleVoiceSetting('muted')}
            title={voiceSettings.muted ? 'Unmute' : 'Mute'}
          >
{voiceSettings.muted ? (
              <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                <path d="M19,11C19,12.19 18.66,13.3 18.1,14.28L16.87,13.05C17.14,12.43 17.3,11.74 17.3,11H19M15,11.16L9,5.18V5A3,3 0 0,1 12,2A3,3 0 0,1 15,5V11L15,11.16M4.27,3L21,19.73L19.73,21L15.54,16.81C14.77,17.27 13.91,17.58 13,17.72V21H11V17.72C7.72,17.23 5,14.41 5,11H6.7C6.7,14 9.24,16.1 12,16.1C12.81,16.1 13.6,15.91 14.31,15.58L12.65,13.92L12,14A3,3 0 0,1 9,11V10.28L3,4.27L4.27,3Z"/>
              </svg>
            ) : (
              <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12,2A3,3 0 0,1 15,5V11A3,3 0 0,1 12,14A3,3 0 0,1 9,11V5A3,3 0 0,1 12,2M19,11C19,14.53 16.39,17.44 13,17.93V21H11V17.93C7.61,17.44 5,14.53 5,11H7A5,5 0 0,0 12,16A5,5 0 0,0 17,11H19Z"/>
              </svg>
            )}
          </button>
          
          <button 
            className="voice-control-btn deafen"
            onClick={() => toggleVoiceSetting('deafened')}
            title={voiceSettings.deafened ? 'Undeafen' : 'Deafen'}
          >
{voiceSettings.deafened ? (
              <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                <path d="M19,11C19,12.19 18.66,13.3 18.1,14.28L16.87,13.05C17.14,12.43 17.3,11.74 17.3,11H19M15,11.16L9,5.18V5A3,3 0 0,1 12,2A3,3 0 0,1 15,5V11L15,11.16M4.27,3L21,19.73L19.73,21L15.54,16.81C14.77,17.27 13.91,17.58 13,17.72V21H11V17.72C7.72,17.23 5,14.41 5,11H6.7C6.7,14 9.24,16.1 12,16.1C12.81,16.1 13.6,15.91 14.31,15.58L12.65,13.92L12,14A3,3 0 0,1 9,11V10.28L3,4.27L4.27,3Z"/>
              </svg>
            ) : (
              <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                <path d="M14,3.23V5.29C16.89,6.15 19,8.83 19,12C19,15.17 16.89,17.84 14,18.7V20.77C18,19.86 21,16.28 21,12C21,7.72 18,4.14 14,3.23M16.5,12C16.5,10.23 15.5,8.71 14,7.97V16C15.5,15.29 16.5,13.76 16.5,12M3,9V15H7L12,20V4L7,9H3Z"/>
              </svg>
            )}
          </button>
          
          <button 
            className="voice-control-btn camera"
            onClick={() => toggleVoiceSetting('camera')}
            title={voiceSettings.camera ? 'Turn off camera' : 'Turn on camera'}
          >
{voiceSettings.camera ? (
              <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                <path d="M17,10.5V7A1,1 0 0,0 16,6H4A1,1 0 0,0 3,7V17A1,1 0 0,0 4,18H16A1,1 0 0,0 17,17V13.5L21,17.5V6.5L17,10.5Z"/>
              </svg>
            ) : (
              <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                <path d="M4,4H7L9,2H15L17,4H20A2,2 0 0,1 22,6V18A2,2 0 0,1 20,20H4A2,2 0 0,1 2,18V6A2,2 0 0,1 4,4M12,7A5,5 0 0,0 7,12A5,5 0 0,0 12,17A5,5 0 0,0 17,12A5,5 0 0,0 12,7M12,9A3,3 0 0,1 15,12A3,3 0 0,1 12,15A3,3 0 0,1 9,12A3,3 0 0,1 12,9Z"/>
              </svg>
            )}
          </button>
          
          <button 
            className="voice-control-btn screen"
            onClick={() => toggleVoiceSetting('screenShare')}
            title={voiceSettings.screenShare ? 'Stop sharing' : 'Share screen'}
          >
{voiceSettings.screenShare ? (
              <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                <path d="M21,2H3C1.89,2 1,2.89 1,4V16C1,17.11 1.89,18 3,18H10V20H8V22H16V20H14V18H21C22.11,18 23,17.11 23,16V4C23,2.89 22.11,2 21,2M21,16H3V4H21V16Z"/>
              </svg>
            ) : (
              <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                <path d="M21,2H3C1.89,2 1,2.89 1,4V16C1,17.11 1.89,18 3,18H10V20H8V22H16V20H14V18H21C22.11,18 23,17.11 23,16V4C23,2.89 22.11,2 21,2M21,16H3V4H21V16Z"/>
              </svg>
            )}
          </button>
          
          <button 
            className="voice-control-btn disconnect"
            onClick={handleVoiceDisconnect}
            title="Disconnect"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12,9C10.89,9 10,8.1 10,7C10,5.89 10.89,5 12,5C13.11,5 14,5.89 14,7C14,8.1 13.11,9 12,9M12,20C7.59,20 4,16.41 4,12C4,7.59 7.59,4 12,4C16.41,4 20,7.59 20,12C20,16.41 16.41,20 12,20M12,2C6.48,2 2,6.48 2,12C2,17.52 6.48,22 12,22C17.52,22 22,17.52 22,12C22,6.48 17.52,2 12,2Z"/>
            </svg>
          </button>
        </div>
      </div>
    );
  }

  return (
    <div>
      <style jsx global>{`
        * {
          margin: 0;
          padding: 0;
          box-sizing: border-box;
        }

        body {
          font-family: 'SF Pro Display', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
          background: #000000;
          color: #ffffff;
          height: 100vh;
          overflow: hidden;
        }

        ::-webkit-scrollbar {
          width: 8px;
        }

        ::-webkit-scrollbar-track {
          background: rgba(255, 255, 255, 0.05);
          border-radius: 10px;
        }

        ::-webkit-scrollbar-thumb {
          background: linear-gradient(135deg, #ff6b9d 0%, #667eea 100%);
          border-radius: 10px;
          border: 1px solid rgba(255, 255, 255, 0.1);
          box-shadow: 0 2px 10px rgba(255, 107, 157, 0.3);
        }

        ::-webkit-scrollbar-thumb:hover {
          background: linear-gradient(135deg, #ff5588 0%, #5a6fd8 100%);
          box-shadow: 0 4px 15px rgba(255, 107, 157, 0.5);
        }
      `}</style>
      
      <style jsx>{`
        /* Main Container - Exact Figma Frame */
        .figma-main {
          position: relative;
          width: 100vw;
          height: 100vh;
          background: #000000;
          overflow: hidden;
        }

        /* Background - x: 0, y: 0, width: 1512, height: 982 */
        .background {
          position: absolute;
          width: 100%;
          height: 100%;
          background: linear-gradient(135deg, #1a1a2e 0%, #16213e 25%, #0f3460 50%, #533483 75%, #e94560 100%);
          opacity: 0.9;
        }

        /* Blur Overlay */
        .blur-overlay {
          position: absolute;
          width: 100%;
          height: 100%;
          backdrop-filter: blur(40px);
          -webkit-backdrop-filter: blur(40px);
          background: rgba(0, 0, 0, 0.3);
        }



        /* Server List - Enhanced Cool Design */
        .server-list {
          position: absolute;
          left: 24px;
          top: 20px;
          width: calc(100vw - 48px);
          height: 100px;
          display: flex;
          flex-direction: row;
          align-items: center;
          gap: 16px;
          padding: 16px 24px;
          background: linear-gradient(135deg, rgba(0, 0, 0, 0.95) 0%, rgba(15, 15, 35, 0.95) 100%);
          backdrop-filter: blur(30px);
          -webkit-backdrop-filter: blur(30px);
          border-radius: 20px;
          border: 2px solid rgba(102, 126, 234, 0.3);
          box-shadow: 
            0 8px 40px rgba(0, 0, 0, 0.7),
            0 0 0 1px rgba(255, 255, 255, 0.1),
            inset 0 1px 0 rgba(255, 255, 255, 0.1);
          z-index: 50;
          overflow-x: auto;
          overflow-y: hidden;
        }

        .server-icon {
          width: 72px;
          height: 72px;
          border-radius: 16px;
          cursor: pointer;
          transition: all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
          position: relative;
          box-shadow: 
            0 4px 20px rgba(0, 0, 0, 0.6),
            0 0 0 2px rgba(255, 255, 255, 0.1);
          border: 2px solid transparent;
          flex-shrink: 0;
          overflow: hidden;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 32px;
          font-weight: bold;
          color: white;
        }

        .server-icon::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: linear-gradient(135deg, rgba(255, 255, 255, 0.1) 0%, transparent 50%);
          opacity: 0;
          transition: opacity 0.3s ease;
        }

        .server-icon:hover {
          transform: translateY(-8px) scale(1.1);
          box-shadow: 
            0 12px 40px rgba(0, 0, 0, 0.8),
            0 0 0 3px rgba(102, 126, 234, 0.5),
            0 0 30px rgba(102, 126, 234, 0.3);
          border-color: rgba(102, 126, 234, 0.6);
        }

        .server-icon:hover::before {
          opacity: 1;
        }

        .server-icon:active {
          transform: translateY(-6px) scale(1.05);
        }

        /* Inbox Icon Styling */
        .inbox-icon {
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .inbox-icon button {
          width: 100%;
          height: 100%;
          display: flex;
          align-items: center;
          justify-content: center;
          background: transparent;
          border: none;
          color: white;
          cursor: pointer;
          transition: all 0.3s ease;
        }

        .inbox-icon:hover button {
          transform: scale(1.1);
        }

        /* Server Notification Badge */
        .server-notification {
          position: absolute;
          top: -4px;
          right: -4px;
          min-width: 20px;
          height: 20px;
          background: linear-gradient(135deg, #ff4757 0%, #ff3838 100%);
          border: 2px solid rgba(0, 0, 0, 0.8);
          border-radius: 10px;
          color: white;
          font-size: 11px;
          font-weight: 700;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 0 4px;
          box-shadow: 0 2px 8px rgba(255, 71, 87, 0.4);
          animation: pulse 2s infinite;
        }

        @keyframes pulse {
          0%, 100% { transform: scale(1); opacity: 1; }
          50% { transform: scale(1.1); opacity: 0.8; }
        }

        /* Cute Floating Animations */
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-10px); }
        }

        @keyframes sparkle {
          0%, 100% { opacity: 0; transform: scale(0); }
          50% { opacity: 1; transform: scale(1); }
        }

        @keyframes heartbeat {
          0%, 100% { transform: scale(1); }
          25% { transform: scale(1.1); }
          50% { transform: scale(1.05); }
          75% { transform: scale(1.15); }
        }

        @keyframes wiggle {
          0%, 100% { transform: rotate(0deg); }
          25% { transform: rotate(2deg); }
          75% { transform: rotate(-2deg); }
        }

        /* Subtle Background Elements */
        .background-elements {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          pointer-events: none;
          z-index: 1;
          opacity: 0.3;
        }

        .bg-circle {
          position: absolute;
          border-radius: 50%;
          background: linear-gradient(135deg, rgba(102, 126, 234, 0.1) 0%, rgba(118, 75, 162, 0.1) 100%);
          animation: float 8s ease-in-out infinite;
        }

        .bg-circle:nth-child(1) { 
          width: 120px; 
          height: 120px; 
          top: 10%; 
          left: 5%; 
          animation-delay: 0s; 
        }
        .bg-circle:nth-child(2) { 
          width: 80px; 
          height: 80px; 
          top: 60%; 
          right: 10%; 
          animation-delay: 2s; 
        }
        .bg-circle:nth-child(3) { 
          width: 60px; 
          height: 60px; 
          bottom: 20%; 
          left: 15%; 
          animation-delay: 4s; 
        }

        /* Active Server Indicator */
        .server-icon.active {
          border-color: rgba(102, 126, 234, 0.8);
          box-shadow: 
            0 4px 20px rgba(0, 0, 0, 0.6),
            0 0 0 3px rgba(102, 126, 234, 0.6),
            0 0 20px rgba(102, 126, 234, 0.4);
        }

        .server-icon.active::after {
          content: '';
          position: absolute;
          left: -6px;
          top: 50%;
          transform: translateY(-50%);
          width: 4px;
          height: 40px;
          background: linear-gradient(180deg, #667eea 0%, #764ba2 100%);
          border-radius: 2px;
          box-shadow: 0 0 10px rgba(102, 126, 234, 0.6);
        }

        /* Enhanced Server Icons with Glowing Effects */
        .server-icon.github {
          background: linear-gradient(135deg, #24292f 0%, #1a1e23 100%);
          color: white;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 36px;
          font-weight: bold;
        }

        .server-icon.github:hover {
          box-shadow: 
            0 12px 40px rgba(0, 0, 0, 0.8),
            0 0 0 3px rgba(36, 41, 47, 0.8),
            0 0 30px rgba(36, 41, 47, 0.6);
        }

        .server-icon.blender {
          background: linear-gradient(135deg, #E87D0D 0%, #F5792A 50%, #FF6B35 100%);
          position: relative;
        }

        .server-icon.blender:hover {
          box-shadow: 
            0 12px 40px rgba(0, 0, 0, 0.8),
            0 0 0 3px rgba(232, 125, 13, 0.8),
            0 0 30px rgba(232, 125, 13, 0.6);
        }

        .server-icon.coinbase {
          background: linear-gradient(135deg, #0052FF 0%, #0041CC 50%, #003399 100%);
        }

        .server-icon.coinbase:hover {
          box-shadow: 
            0 12px 40px rgba(0, 0, 0, 0.8),
            0 0 0 3px rgba(0, 82, 255, 0.8),
            0 0 30px rgba(0, 82, 255, 0.6);
        }

        .server-icon.instagram {
          background: linear-gradient(135deg, #E4405F 0%, #833AB4 30%, #C13584 60%, #F77737 100%);
        }

        .server-icon.instagram:hover {
          box-shadow: 
            0 12px 40px rgba(0, 0, 0, 0.8),
            0 0 0 3px rgba(228, 64, 95, 0.8),
            0 0 30px rgba(228, 64, 95, 0.6);
        }

        .server-icon.vscode {
          background: linear-gradient(135deg, #007ACC 0%, #005A9E 50%, #004B87 100%);
        }

        .server-icon.vscode:hover {
          box-shadow: 
            0 12px 40px rgba(0, 0, 0, 0.8),
            0 0 0 3px rgba(0, 122, 204, 0.8),
            0 0 30px rgba(0, 122, 204, 0.6);
        }

        .server-icon.github-desktop {
          background: linear-gradient(135deg, #6f42c1 0%, #5A2D91 50%, #4A1F7A 100%);
        }

        .server-icon.github-desktop:hover {
          box-shadow: 
            0 12px 40px rgba(0, 0, 0, 0.8),
            0 0 0 3px rgba(111, 66, 193, 0.8),
            0 0 30px rgba(111, 66, 193, 0.6);
        }

        .server-icon.nova {
          background: linear-gradient(135deg, #00C4A7 0%, #00A085 50%, #008B73 100%);
        }

        .server-icon.nova:hover {
          box-shadow: 
            0 12px 40px rgba(0, 0, 0, 0.8),
            0 0 0 3px rgba(0, 196, 167, 0.8),
            0 0 30px rgba(0, 196, 167, 0.6);
        }

        .server-icon.google-chrome {
          background: linear-gradient(135deg, #4285F4 0%, #34A853 25%, #FBBC05 50%, #EA4335 75%, #DB4437 100%);
        }

        .server-icon.google-chrome:hover {
          box-shadow: 
            0 12px 40px rgba(0, 0, 0, 0.8),
            0 0 0 3px rgba(66, 133, 244, 0.8),
            0 0 30px rgba(66, 133, 244, 0.6);
        }

        .server-icon.superstar {
          background: linear-gradient(135deg, #FFD700 0%, #FFA500 50%, #FF8C00 100%);
        }

        .server-icon.superstar:hover {
          box-shadow: 
            0 12px 40px rgba(0, 0, 0, 0.8),
            0 0 0 3px rgba(255, 215, 0, 0.8),
            0 0 30px rgba(255, 215, 0, 0.6);
        }

        .server-icon.microsoft {
          background: linear-gradient(135deg, #00BCF2 0%, #0078D4 50%, #005A9E 100%);
        }

        .server-icon.microsoft:hover {
          box-shadow: 
            0 12px 40px rgba(0, 0, 0, 0.8),
            0 0 0 3px rgba(0, 188, 242, 0.8),
            0 0 30px rgba(0, 188, 242, 0.6);
        }

        .server-icon.youtube {
          background: linear-gradient(135deg, #FF0000 0%, #CC0000 50%, #990000 100%);
        }

        .server-icon.youtube:hover {
          box-shadow: 
            0 12px 40px rgba(0, 0, 0, 0.8),
            0 0 0 3px rgba(255, 0, 0, 0.8),
            0 0 30px rgba(255, 0, 0, 0.6);
        }

        .server-separator {
          width: 3px;
          height: 48px;
          background: linear-gradient(180deg, transparent 0%, rgba(102, 126, 234, 0.5) 30%, rgba(255, 255, 255, 0.4) 50%, rgba(102, 126, 234, 0.5) 70%, transparent 100%);
          border-radius: 2px;
          margin: 0 8px;
          box-shadow: 0 0 10px rgba(102, 126, 234, 0.3);
        }

        /* Left Sidebar - DMs */
        .left-sidebar {
          position: absolute;
          left: 24px;
          top: 140px;
          width: 280px;
          height: calc(100vh - 164px);
          background: rgba(0, 0, 0, 0.6);
          backdrop-filter: blur(20px);
          -webkit-backdrop-filter: blur(20px);
          border-radius: 20px;
          border: 1px solid rgba(255, 255, 255, 0.1);
          display: flex;
          flex-direction: column;
          overflow: hidden;
          z-index: 40;
        }

        .sidebar-header {
          padding: 20px 20px 16px 20px;
          background: linear-gradient(135deg, rgba(102, 126, 234, 0.15) 0%, rgba(118, 75, 162, 0.15) 100%);
          position: relative;
          overflow: hidden;
        }

        .sidebar-header::before {
          content: '';
          position: absolute;
          top: 8px;
          right: 16px;
          width: 8px;
          height: 8px;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          border-radius: 50%;
          box-shadow: 0 0 10px rgba(102, 126, 234, 0.6);
          animation: pulse 2s ease-in-out infinite;
        }

        .sidebar-title {
          font-size: 16px;
          font-weight: 600;
          color: #ffffff;
          margin-bottom: 16px;
          text-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
          position: relative;
          display: flex;
          align-items: center;
          justify-content: space-between;
        }

        .sidebar-title::after {
          content: '';
          width: 4px;
          height: 4px;
          background: rgba(255, 255, 255, 0.4);
          border-radius: 50%;
        }

        .search-input {
          width: 100%;
          padding: 14px 20px;
          background: linear-gradient(135deg, rgba(255, 255, 255, 0.12) 0%, rgba(255, 255, 255, 0.08) 100%);
          border: 2px solid transparent;
          background-clip: padding-box;
          border-radius: 20px;
          color: #ffffff;
          font-size: 14px;
          outline: none;
          transition: all 0.3s ease;
          position: relative;
        }

        .search-input:focus {
          background: rgba(255, 255, 255, 0.18);
          transform: translateY(-2px);
          box-shadow: 0 8px 25px rgba(102, 126, 234, 0.3);
          border-color: rgba(102, 126, 234, 0.6);
        }

        .search-input::placeholder {
          color: rgba(255, 255, 255, 0.6);
          font-weight: 400;
        }

        /* Quick Actions Bar */
        .quick-actions {
          padding: 12px 16px;
          border-bottom: 1px solid rgba(255, 255, 255, 0.1);
          display: flex;
          gap: 8px;
        }

        .quick-action-btn {
          flex: 1;
          padding: 8px 12px;
          background: rgba(255, 255, 255, 0.1);
          border: 1px solid rgba(255, 255, 255, 0.2);
          border-radius: 8px;
          color: rgba(255, 255, 255, 0.8);
          font-size: 11px;
          font-weight: 500;
          cursor: pointer;
          transition: all 0.3s ease;
          text-align: center;
        }

        .quick-action-btn:hover {
          background: rgba(102, 126, 234, 0.3);
          border-color: rgba(102, 126, 234, 0.5);
          color: #ffffff;
          transform: translateY(-1px);
        }

        .quick-action-btn.active {
          background: linear-gradient(135deg, rgba(102, 126, 234, 0.4) 0%, rgba(118, 75, 162, 0.4) 100%);
          border-color: rgba(102, 126, 234, 0.6);
          color: #ffffff;
        }

        .user-list {
          flex: 1;
          overflow-y: auto;
          padding: 12px 8px;
        }

        /* Section Headers */
        .section-header {
          padding: 8px 16px;
          font-size: 11px;
          font-weight: 600;
          color: rgba(255, 255, 255, 0.6);
          text-transform: uppercase;
          letter-spacing: 0.5px;
          margin-bottom: 4px;
          display: flex;
          align-items: center;
          justify-content: space-between;
        }

        .section-count {
          background: rgba(255, 255, 255, 0.1);
          padding: 2px 6px;
          border-radius: 10px;
          font-size: 10px;
        }

        .user-item {
          display: flex;
          align-items: center;
          padding: 14px 18px;
          margin: 6px 8px;
          border-radius: 16px;
          cursor: pointer;
          transition: all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
          position: relative;
          overflow: hidden;
        }

        .user-item::before {
          content: '';
          position: absolute;
          top: 0;
          left: -100%;
          width: 100%;
          height: 100%;
          background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.1), transparent);
          transition: left 0.5s ease;
        }

        .user-item:hover::before {
          left: 100%;
        }

        .user-item:hover {
          background: linear-gradient(135deg, rgba(255, 255, 255, 0.12) 0%, rgba(102, 126, 234, 0.1) 100%);
          transform: translateX(8px) translateY(-2px);
          box-shadow: 0 8px 25px rgba(0, 0, 0, 0.3);
        }

        .user-item.selected {
          background: linear-gradient(90deg, rgba(102, 126, 234, 0.4) 0%, rgba(118, 75, 162, 0.4) 100%);
          border-left: 5px solid #667eea;
          box-shadow: 0 8px 30px rgba(102, 126, 234, 0.4);
          transform: translateX(4px);
        }

        .user-item.selected::after {
          content: '';
          position: absolute;
          right: 16px;
          top: 50%;
          transform: translateY(-50%);
          width: 8px;
          height: 8px;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          border-radius: 50%;
          box-shadow: 0 0 12px rgba(102, 126, 234, 0.8);
          animation: pulse 2s ease-in-out infinite;
        }

        .user-avatar {
          width: 40px;
          height: 40px;
          border-radius: 50%;
          background-size: cover;
          background-position: center;
          margin-right: 12px;
          position: relative;
          border: 3px solid transparent;
          background-clip: padding-box;
          transition: all 0.3s ease;
        }

        .user-avatar::before {
          content: '';
          position: absolute;
          top: -3px;
          left: -3px;
          right: -3px;
          bottom: -3px;
          background: linear-gradient(45deg, #ff6b9d, #c44569, #f8b500, #ff6b9d);
          border-radius: 50%;
          z-index: -1;
          animation: rotate-border 3s linear infinite;
          opacity: 0;
          transition: opacity 0.3s ease;
        }

        .user-item:hover .user-avatar::before {
          opacity: 1;
        }

        @keyframes rotate-border {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }

        .user-avatar:hover {
          transform: scale(1.1);
          animation: wiggle 0.5s ease-in-out;
        }

        .status-dot {
          position: absolute;
          bottom: -2px;
          right: -2px;
          width: 14px;
          height: 14px;
          border: 3px solid rgba(0, 0, 0, 0.8);
          border-radius: 50%;
          box-shadow: 0 0 10px rgba(67, 233, 123, 0.6);
          animation: heartbeat 2s ease-in-out infinite;
        }

        .status-dot.online {
          background: linear-gradient(135deg, #43e97b 0%, #38f9d7 100%);
        }

        .status-dot.offline {
          background: rgba(255, 255, 255, 0.3);
          box-shadow: 0 0 10px rgba(255, 255, 255, 0.2);
        }

        .unread-badge {
          position: absolute;
          top: -4px;
          right: -4px;
          min-width: 18px;
          height: 18px;
          background: linear-gradient(135deg, #ff4757 0%, #ff3838 100%);
          border: 2px solid rgba(0, 0, 0, 0.8);
          border-radius: 10px;
          color: white;
          font-size: 11px;
          font-weight: 700;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 0 4px;
          box-shadow: 0 2px 8px rgba(255, 71, 87, 0.4);
          animation: pulse 2s infinite;
        }

        .user-item.selected .online-dot {
          animation: heartbeat 1s ease-in-out infinite, sparkle 2s ease-in-out infinite;
        }

        .user-info {
          flex: 1;
        }

        .user-name {
          font-size: 15px;
          font-weight: 500;
          color: #ffffff;
          margin-bottom: 2px;
        }

        .user-status {
          font-size: 12px;
          color: rgba(255, 255, 255, 0.6);
        }

        /* Message Preview System */
        .user-preview {
          font-size: 11px;
          color: rgba(255, 255, 255, 0.5);
          margin-top: 2px;
          font-style: italic;
          max-width: 150px;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }

        .user-item.has-unread .user-preview {
          color: rgba(102, 126, 234, 0.8);
          font-weight: 500;
        }

        /* Activity Indicators */
        .activity-indicator {
          position: absolute;
          top: 8px;
          right: 8px;
          width: 6px;
          height: 6px;
          border-radius: 50%;
          opacity: 0;
          transition: opacity 0.3s ease;
        }

        .user-item.typing .activity-indicator {
          background: linear-gradient(135deg, #ffa726 0%, #ff9800 100%);
          opacity: 1;
          animation: pulse 1s ease-in-out infinite;
        }

        .user-item.has-unread .activity-indicator {
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          opacity: 1;
          animation: heartbeat 2s ease-in-out infinite;
        }

        /* Priority System */
        .priority-indicator {
          position: absolute;
          left: -2px;
          top: 50%;
          transform: translateY(-50%);
          width: 3px;
          height: 20px;
          border-radius: 2px;
          opacity: 0;
          transition: opacity 0.3s ease;
        }

        .user-item.priority-high .priority-indicator {
          background: linear-gradient(180deg, #ff4757 0%, #ff3838 100%);
          opacity: 1;
        }

        .user-item.priority-medium .priority-indicator {
          background: linear-gradient(180deg, #ffa726 0%, #ff9800 100%);
          opacity: 1;
        }

        /* Main Chat Area */
        .chat-area {
          position: absolute;
          left: 328px;
          top: 140px;
          right: 24px;
          height: calc(100vh - 164px);
          background: rgba(0, 0, 0, 0.4);
          backdrop-filter: blur(20px);
          -webkit-backdrop-filter: blur(20px);
          border-radius: 20px;
          border: 1px solid rgba(255, 255, 255, 0.1);
          display: flex;
          flex-direction: column;
          overflow: hidden;
          z-index: 30;
        }

        .chat-header {
          height: 80px;
          padding: 0 30px;
          display: flex;
          align-items: center;
          border-bottom: 2px solid rgba(255, 255, 255, 0.1);
          background: linear-gradient(135deg, rgba(102, 126, 234, 0.15) 0%, rgba(118, 75, 162, 0.15) 100%);
          position: relative;
          overflow: hidden;
        }

        .chat-header::before {
          content: '';
          position: absolute;
          top: 0;
          left: -100%;
          width: 100%;
          height: 100%;
          background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.05), transparent);
          animation: shimmer 3s ease-in-out infinite;
        }

        @keyframes shimmer {
          0% { left: -100%; }
          100% { left: 100%; }
        }

        .chat-user-name {
          font-size: 22px;
          font-weight: 700;
          color: #ffffff;
          text-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
          position: relative;
        }

        .chat-user-name::after {
          content: '';
          margin-left: 12px;
          width: 6px;
          height: 6px;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          border-radius: 50%;
          box-shadow: 0 0 8px rgba(102, 126, 234, 0.6);
          animation: pulse 2s ease-in-out infinite;
        }

        .chat-status {
          margin-left: 16px;
          width: 12px;
          height: 12px;
          background: linear-gradient(135deg, #43e97b 0%, #38f9d7 100%);
          border-radius: 50%;
          box-shadow: 0 0 15px rgba(67, 233, 123, 0.6);
          animation: pulse 2s ease-in-out infinite;
        }

        .messages-area {
          flex: 1;
          overflow-y: auto;
          padding: 24px;
          display: flex;
          flex-direction: column;
          gap: 20px;
        }

        .message {
          display: flex;
          gap: 12px;
          padding: 16px 20px;
          border-radius: 20px;
          transition: all 0.3s ease;
          position: relative;
          margin: 8px 0;
        }

        .message::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: linear-gradient(135deg, rgba(255, 107, 157, 0.1) 0%, rgba(102, 126, 234, 0.1) 100%);
          border-radius: 20px;
          opacity: 0;
          transition: opacity 0.3s ease;
        }

        .message:hover {
          background: rgba(255, 255, 255, 0.08);
          transform: translateY(-2px);
          box-shadow: 0 8px 25px rgba(0, 0, 0, 0.3);
        }

        .message:hover::before {
          opacity: 1;
        }

        .message-avatar {
          width: 40px;
          height: 40px;
          border-radius: 50%;
          background-size: cover;
          background-position: center;
          flex-shrink: 0;
          border: 3px solid transparent;
          background-clip: padding-box;
          position: relative;
          transition: all 0.3s ease;
        }

        .message-avatar::after {
          content: '';
          position: absolute;
          top: -3px;
          left: -3px;
          right: -3px;
          bottom: -3px;
          background: linear-gradient(45deg, #667eea, #764ba2, #667eea);
          border-radius: 50%;
          z-index: -1;
          opacity: 0.6;
        }

        .message:hover .message-avatar {
          transform: scale(1.1) rotate(5deg);
          animation: wiggle 0.5s ease-in-out;
        }

        .message-content {
          flex: 1;
        }

        .message-header {
          display: flex;
          align-items: center;
          gap: 8px;
          margin-bottom: 4px;
        }

        .message-author {
          font-size: 14px;
          font-weight: 600;
          color: #667eea;
        }

        .message-time {
          font-size: 12px;
          color: rgba(255, 255, 255, 0.5);
        }

        .message-text {
          font-size: 14px;
          color: #ffffff;
          line-height: 1.6;
          margin-bottom: 4px;
        }

        /* Message Metadata */
        .message-meta {
          display: flex;
          align-items: center;
          gap: 8px;
          margin-top: 4px;
        }

        /* Message Actions */
        .message-actions {
          display: flex;
          align-items: center;
          gap: 6px;
          margin-top: 6px;
          opacity: 0;
          transition: opacity 0.3s ease;
        }

        .message:hover .message-actions {
          opacity: 1;
        }

        .message-action-btn {
          width: 24px;
          height: 24px;
          border-radius: 50%;
          background: rgba(255, 255, 255, 0.1);
          border: 1px solid rgba(255, 255, 255, 0.2);
          color: rgba(255, 255, 255, 0.7);
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: all 0.3s ease;
        }

        .message-action-btn:hover {
          background: rgba(102, 126, 234, 0.3);
          border-color: rgba(102, 126, 234, 0.5);
          color: white;
          transform: scale(1.1);
        }

        .read-receipt {
          font-size: 10px;
          color: rgba(255, 255, 255, 0.4);
          display: flex;
          align-items: center;
          gap: 4px;
        }

        .read-receipt.delivered {
          color: rgba(102, 126, 234, 0.6);
        }

        .read-receipt.read {
          color: rgba(67, 233, 123, 0.6);
        }

        .message-reactions {
          display: flex;
          gap: 4px;
          margin-top: 6px;
        }

        .reaction-btn {
          padding: 2px 6px;
          background: rgba(255, 255, 255, 0.1);
          border: 1px solid rgba(255, 255, 255, 0.2);
          border-radius: 12px;
          font-size: 11px;
          color: rgba(255, 255, 255, 0.7);
          cursor: pointer;
          transition: all 0.3s ease;
        }

        .reaction-btn:hover {
          background: rgba(102, 126, 234, 0.3);
          border-color: rgba(102, 126, 234, 0.5);
          transform: scale(1.05);
        }

        /* Message Input - Bottom of chat area */
        .message-input-area {
          padding: 24px;
          border-top: 1px solid rgba(255, 255, 255, 0.1);
          background: linear-gradient(135deg, rgba(0, 0, 0, 0.3) 0%, rgba(0, 0, 0, 0.6) 100%);
        }

        .message-input-container {
          display: flex;
          align-items: center;
          gap: 12px;
          background: linear-gradient(135deg, rgba(255, 255, 255, 0.12) 0%, rgba(255, 255, 255, 0.08) 100%);
          border: 2px solid transparent;
          background-clip: padding-box;
          border-radius: 25px;
          padding: 14px 20px;
          transition: all 0.3s ease;
          position: relative;
          overflow: hidden;
        }

        .message-input-container::before {
          content: '';
          position: absolute;
          top: -2px;
          left: -2px;
          right: -2px;
          bottom: -2px;
          background: linear-gradient(45deg, #ff6b9d, #667eea, #764ba2, #ff6b9d);
          border-radius: 25px;
          z-index: -1;
          opacity: 0;
          transition: opacity 0.3s ease;
        }

        .message-input-container:focus-within {
          background: rgba(255, 255, 255, 0.18);
          transform: translateY(-2px);
          box-shadow: 0 8px 30px rgba(102, 126, 234, 0.3);
        }

        .message-input-container:focus-within::before {
          opacity: 1;
        }

        .message-input {
          flex: 1;
          background: none;
          border: none;
          color: #ffffff;
          font-size: 15px;
          outline: none;
          font-weight: 500;
        }

        .message-input::placeholder {
          color: rgba(255, 255, 255, 0.6);
          font-weight: 400;
        }

        .input-actions {
          display: flex;
          gap: 10px;
        }

        .input-btn {
          width: 36px;
          height: 36px;
          border-radius: 18px;
          background: rgba(102, 126, 234, 0.3);
          border: 2px solid rgba(102, 126, 234, 0.5);
          color: #ffffff;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
          font-size: 16px;
          position: relative;
          overflow: hidden;
        }

        .input-btn::before {
          content: '';
          position: absolute;
          top: 50%;
          left: 50%;
          width: 0;
          height: 0;
          background: rgba(255, 255, 255, 0.2);
          border-radius: 50%;
          transform: translate(-50%, -50%);
          transition: all 0.3s ease;
        }

        .input-btn:hover {
          background: rgba(102, 126, 234, 0.6);
          transform: translateY(-3px) scale(1.1);
          box-shadow: 0 8px 20px rgba(102, 126, 234, 0.4);
          animation: wiggle 0.5s ease-in-out;
        }

        .input-btn:hover::before {
          width: 100%;
          height: 100%;
        }

        .input-btn:active {
          transform: translateY(-1px) scale(1.05);
        }

        .send-btn {
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          border-color: transparent;
          box-shadow: 0 4px 15px rgba(102, 126, 234, 0.3);
        }

        .send-btn:hover {
          background: linear-gradient(135deg, #5a6fd8 0%, #6a4190 100%);
          box-shadow: 0 8px 25px rgba(102, 126, 234, 0.5);
          animation: heartbeat 0.6s ease-in-out;
        }

        /* New Enhanced Styles for Redesigned Components */

        /* Clean Sidebar Header */
        .sidebar-title {
          font-size: 20px;
          font-weight: 700;
          color: #ffffff;
          margin-bottom: 16px;
          text-align: left;
        }

        .search-container {
          position: relative;
        }





        /* Enhanced Chat Components */
        .chat-user-info {
          display: flex;
          align-items: center;
        }

        .chat-user-avatar {
          width: 40px;
          height: 40px;
          border-radius: 50%;
          background-size: cover;
          background-position: center;
          margin-right: 12px;
          position: relative;
          border: 2px solid rgba(255, 255, 255, 0.2);
        }

        .chat-user-details {
          flex: 1;
        }

        .chat-user-status {
          font-size: 12px;
          color: rgba(255, 255, 255, 0.6);
          margin-top: 2px;
        }

        .chat-actions {
          display: flex;
          gap: 8px;
        }

        .chat-action-btn {
          width: 36px;
          height: 36px;
          border-radius: 50%;
          background: rgba(255, 255, 255, 0.1);
          border: 1px solid rgba(255, 255, 255, 0.2);
          color: white;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 16px;
          transition: all 0.3s ease;
        }

        .chat-action-btn:hover {
          background: rgba(102, 126, 234, 0.3);
          transform: translateY(-2px);
        }

        .chat-action-btn.voice-call:hover {
          background: rgba(34, 197, 94, 0.3);
          border-color: rgba(34, 197, 94, 0.5);
        }

        .chat-action-btn.video-call:hover {
          background: rgba(59, 130, 246, 0.3);
          border-color: rgba(59, 130, 246, 0.5);
        }

        .chat-action-btn.search:hover {
          background: rgba(168, 85, 247, 0.3);
          border-color: rgba(168, 85, 247, 0.5);
        }

        /* User Action Buttons */
        .user-action-btn {
          width: 28px;
          height: 28px;
          border-radius: 50%;
          background: rgba(255, 255, 255, 0.1);
          border: 1px solid rgba(255, 255, 255, 0.2);
          color: white;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 12px;
          transition: all 0.3s ease;
        }

        .user-action-btn:hover {
          background: rgba(102, 126, 234, 0.3);
          transform: scale(1.1);
        }

        .user-action-btn.voice-call:hover {
          background: rgba(34, 197, 94, 0.3);
          border-color: rgba(34, 197, 94, 0.5);
        }

        .user-action-btn.video-call:hover {
          background: rgba(59, 130, 246, 0.3);
          border-color: rgba(59, 130, 246, 0.5);
        }

        /* Typing Indicator */
        .typing-indicator {
          display: flex;
          align-items: center;
          padding: 12px 20px;
          margin: 8px 0;
          opacity: 0.8;
        }

        .typing-avatar {
          width: 32px;
          height: 32px;
          border-radius: 50%;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          margin-right: 12px;
        }

        .typing-content {
          display: flex;
          flex-direction: column;
        }

        .typing-name {
          font-size: 12px;
          color: rgba(255, 255, 255, 0.6);
          margin-bottom: 4px;
        }

        .typing-dots {
          display: flex;
          gap: 4px;
        }

        .typing-dots span {
          width: 6px;
          height: 6px;
          border-radius: 50%;
          background: rgba(255, 255, 255, 0.6);
          animation: typingBounce 1.4s infinite;
        }

        .typing-dots span:nth-child(2) {
          animation-delay: 0.2s;
        }

        .typing-dots span:nth-child(3) {
          animation-delay: 0.4s;
        }

        @keyframes typingBounce {
          0%, 60%, 100% {
            transform: translateY(0);
            opacity: 0.6;
          }
          30% {
            transform: translateY(-10px);
            opacity: 1;
          }
        }

        /* Enhanced Input Components */
        .input-extras {
          display: flex;
          gap: 8px;
          margin-right: 12px;
        }

        .input-extra-btn {
          width: 32px;
          height: 32px;
          border-radius: 50%;
          background: rgba(255, 255, 255, 0.1);
          border: 1px solid rgba(255, 255, 255, 0.2);
          color: white;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 14px;
          transition: all 0.3s ease;
        }

        .input-extra-btn:hover {
          background: rgba(102, 126, 234, 0.3);
          transform: translateY(-2px);
        }

        .quick-actions-bar {
          display: flex;
          gap: 12px;
          padding: 8px 0;
          border-top: 1px solid rgba(255, 255, 255, 0.1);
          margin-top: 8px;
        }

        .quick-action-btn {
          padding: 8px 16px;
          border-radius: 20px;
          background: rgba(255, 255, 255, 0.1);
          border: 1px solid rgba(255, 255, 255, 0.2);
          color: white;
          cursor: pointer;
          font-size: 12px;
          transition: all 0.3s ease;
        }

        .quick-action-btn:hover {
          background: rgba(102, 126, 234, 0.3);
          transform: translateY(-1px);
        }

        .messages-date-header {
          text-align: center;
          padding: 20px 0;
          font-size: 14px;
          font-weight: 600;
          color: rgba(255, 255, 255, 0.6);
          position: relative;
        }

        /* DMs Home Icon Special Styling */
        .server-icon.dms-home:hover {
          box-shadow: 
            0 12px 40px rgba(0, 0, 0, 0.8),
            0 0 0 3px rgba(102, 126, 234, 0.8),
            0 0 30px rgba(102, 126, 234, 0.6);
          border-color: rgba(102, 126, 234, 0.8);
        }

        .server-icon.dms-home.active {
          border-color: rgba(102, 126, 234, 0.8);
          box-shadow: 
            0 6px 30px rgba(0, 0, 0, 0.7),
            0 0 0 3px rgba(102, 126, 234, 0.6),
            0 0 20px rgba(102, 126, 234, 0.4);
        }

        /* Responsive Design */
        @media (max-width: 1200px) {
          .server-list {
            gap: 12px;
            padding: 12px 20px;
          }
          .server-icon {
            width: 64px;
            height: 64px;
          }
        }

        @media (max-width: 900px) {
          .server-list {
            gap: 10px;
            padding: 10px 16px;
            height: 80px;
          }
          .server-icon {
            width: 56px;
            height: 56px;
            font-size: 28px;
          }
          .left-sidebar {
            width: 240px;
            top: 120px;
            height: calc(100vh - 144px);
          }
          .chat-area {
            left: 284px;
            right: 16px;
            top: 120px;
            height: calc(100vh - 144px);
          }
        }

        @media (max-width: 768px) {
          .server-list {
            width: calc(100vw - 32px);
            left: 16px;
            gap: 8px;
            padding: 8px 12px;
            height: 70px;
            overflow-x: auto;
          }
          .server-icon {
            width: 48px;
            height: 48px;
            font-size: 24px;
          }
          .server-separator {
            height: 32px;
            width: 2px;
          }
          .left-sidebar {
            left: 16px;
            width: 200px;
            top: 106px;
            height: calc(100vh - 130px);
          }
          .chat-area {
            left: 232px;
            right: 16px;
            top: 106px;
            height: calc(100vh - 130px);
          }
        }
      `}</style>
      
      <div className="figma-main">
        <div className="background"></div>
        <div className="blur-overlay"></div>
        
        {/* Subtle Background Elements */}
        <div className="background-elements">
          <div className="bg-circle"></div>
          <div className="bg-circle"></div>
          <div className="bg-circle"></div>
        </div>
        
        {/* Server List - Enhanced Cool Design */}
        <div className="server-list">
          <ServerIcon
            src="/server-icons/01bc4f2897376613febb1d498bf46717.jpg"
            alt="Home"
            fallback="🏠"
            className="server-icon dms-home active"
            style={{background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'}}
            title="DMs Home"
          />
          
          {/* Friend Requests Inbox */}
          <div className="server-icon inbox-icon" style={{position: 'relative'}}>
            <InboxIcon onRequestAction={(requestId: string, action: 'accept' | 'reject') => {
              console.log(`Friend request ${action}:`, requestId);
            }} />
          </div>
          
          <div className="server-separator"></div>
          <div 
            className="server-icon github"
            onClick={() => handleServerClick('Dev Community')}
          >
            <ServerIcon
              src="/server-icons/0490b20ab0113ed5f1888dbf8aa942fb.jpg"
              alt="Dev Community"
              fallback="DC"
              style={{}}
            />
            <div className="server-notification">5</div>
          </div>
          <div className="server-separator"></div>
          <div className="server-icon blender active" style={{position: 'relative'}}>
            <ServerIcon
              src="/server-icons/3f567664e36f2cf1d7db0151a268f799.jpg"
              alt="The Club Pakistan"
              fallback="TC"
              onClick={() => handleServerClick('The Club // Pakistan')}
              style={{}}
            />
            <div className="server-notification">12</div>
          </div>
          <div 
            className="server-icon coinbase"
            onClick={() => handleServerClick('Crypto Trading')}
          >
            <img 
              src="/server-icons/53d49a6aa2aeff61fd8ef985a96144dbe.jpg" 
              alt="Crypto Trading" 
              style={{width: '36px', height: '36px', borderRadius: '12px', objectFit: 'cover'}}
              onError={(e) => {
                e.currentTarget.style.display = 'none';
                e.currentTarget.parentElement!.style.fontSize = '24px';
                e.currentTarget.parentElement!.textContent = '₿';
              }}
            />
            <div className="server-notification">5</div>
          </div>
          <div 
            className="server-icon instagram"
            onClick={() => handleServerClick('Instagram Creators')}
          >
            <img 
              src="/server-icons/580f58c411d2109942782c106268fecc.jpg" 
              alt="Instagram Creators" 
              style={{width: '36px', height: '36px', borderRadius: '12px', objectFit: 'cover'}}
              onError={(e) => {
                e.currentTarget.style.display = 'none';
                e.currentTarget.parentElement!.style.fontSize = '24px';
                e.currentTarget.parentElement!.innerHTML = '<svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor"><path d="M4,4H7L9,2H15L17,4H20A2,2 0 0,1 22,6V18A2,2 0 0,1 20,20H4A2,2 0 0,1 2,18V6A2,2 0 0,1 4,4M12,7A5,5 0 0,0 7,12A5,5 0 0,0 12,17A5,5 0 0,0 17,12A5,5 0 0,0 12,7M12,9A3,3 0 0,1 15,12A3,3 0 0,1 12,15A3,3 0 0,1 9,12A3,3 0 0,1 12,9Z"/></svg>';
              }}
            />
          </div>
          <div 
            className="server-icon vscode"
            onClick={() => handleServerClick('VS Code Developers')}
          >
            <img 
              src="/server-icons/5ad5eebc4deb5eaf9c4ae763b1288030.jpg" 
              alt="VS Code Developers" 
              style={{width: '36px', height: '36px', borderRadius: '12px', objectFit: 'cover'}}
              onError={(e) => {
                e.currentTarget.style.display = 'none';
                e.currentTarget.parentElement!.style.fontSize = '24px';
                e.currentTarget.parentElement!.textContent = 'VS';
              }}
            />
            <div className="server-notification">2</div>
          </div>
          <div 
            className="server-icon github-desktop"
            onClick={() => handleServerClick('GitHub Community')}
          >
            <img 
              src="/server-icons/7014fac3aa9bc359185869c4c4240147.jpg" 
              alt="GitHub Community" 
              style={{width: '36px', height: '36px', borderRadius: '12px', objectFit: 'cover'}}
              onError={(e) => {
                e.currentTarget.style.display = 'none';
                e.currentTarget.parentElement!.style.fontSize = '24px';
                e.currentTarget.parentElement!.textContent = 'GH';
              }}
            />
          </div>
          <div 
            className="server-icon nova"
            onClick={() => handleServerClick('Nova Users')}
          >
            <img 
              src="/server-icons/71b228b9bd2b6eb5aa62f7209875deeb.jpg" 
              alt="Nova Users" 
              style={{width: '36px', height: '36px', borderRadius: '12px', objectFit: 'cover'}}
              onError={(e) => {
                e.currentTarget.style.display = 'none';
                e.currentTarget.parentElement!.style.fontSize = '24px';
                e.currentTarget.parentElement!.textContent = 'N';
              }}
            />
            <div className="server-notification">7</div>
          </div>
          <div 
            className="server-icon google-chrome"
            onClick={() => handleServerClick('Chrome Extensions')}
          >
            <img 
              src="/server-icons/f2d253b769bb2960dc38d9d2109f2faf.jpg" 
              alt="Chrome Extensions" 
              style={{width: '36px', height: '36px', borderRadius: '12px', objectFit: 'cover'}}
              onError={(e) => {
                e.currentTarget.style.display = 'none';
                e.currentTarget.parentElement!.style.fontSize = '24px';
                e.currentTarget.parentElement!.textContent = '🌐';
              }}
            />
          </div>
          <div 
            className="server-icon superstar"
            onClick={() => handleServerClick('Superstar Gaming')}
          >
            <img 
              src="/server-icons/01bc4f2897376613febb1d498bf46717.jpg" 
              alt="Superstar Gaming" 
              style={{width: '36px', height: '36px', borderRadius: '12px', objectFit: 'cover'}}
              onError={(e) => {
                e.currentTarget.style.display = 'none';
                e.currentTarget.parentElement!.style.fontSize = '24px';
                e.currentTarget.parentElement!.textContent = '⭐';
              }}
            />
            <div className="server-notification">99+</div>
          </div>
          <div 
            className="server-icon microsoft"
            onClick={() => handleServerClick('Microsoft Office')}
          >
            <img 
              src="/server-icons/0490b20ab0113ed5f1888dbf8aa942fb.jpg" 
              alt="Microsoft Office" 
              style={{width: '36px', height: '36px', borderRadius: '12px', objectFit: 'cover'}}
              onError={(e) => {
                e.currentTarget.style.display = 'none';
                e.currentTarget.parentElement!.style.fontSize = '24px';
                e.currentTarget.parentElement!.textContent = 'MS';
              }}
            />
          </div>
          <div 
            className="server-icon youtube"
            onClick={() => handleServerClick('YouTube Creators')}
          >
            <img 
              src="/server-icons/3f567664e36f2cf1d7db0151a268f799.jpg" 
              alt="YouTube Creators" 
              style={{width: '36px', height: '36px', borderRadius: '12px', objectFit: 'cover'}}
              onError={(e) => {
                e.currentTarget.style.display = 'none';
                e.currentTarget.parentElement!.style.fontSize = '24px';
                e.currentTarget.parentElement!.innerHTML = '<svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor"><path d="M21,2H3C1.89,2 1,2.89 1,4V16C1,17.11 1.89,18 3,18H10V20H8V22H16V20H14V18H21C22.11,18 23,17.11 23,16V4C23,2.89 22.11,2 21,2M21,16H3V4H21V16Z"/></svg>';
              }}
            />
            <div className="server-notification">1</div>
          </div>
        </div>

        {/* Left Sidebar - Completely Redesigned */}
        <div className="left-sidebar">
          {/* Clean Header */}
          <div className="sidebar-header">
            <div className="sidebar-title">Messages</div>
            <div className="search-container">
              <input 
                type="text" 
                className="search-input" 
                placeholder="Search conversations..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>





          {/* Enhanced user list */}
          <div className="user-list">
            <div className="section-header">
              <span>Direct Messages</span>
              <span className="section-count">{filteredUsers.length}</span>
            </div>
            
            {filteredUsers.map((user, index) => (
              <div
                key={user.id}
                className={`user-item ${selectedUserId === user.id ? 'selected' : ''} ${
                  user.unread > 0 ? 'has-unread' : ''
                }`}
                onClick={() => setSelectedUserId(user.id)}
              >
                <div className="user-avatar-container">
                  <div style={{position: 'relative'}}>
                    <Avatar
                      src={user.avatar}
                      alt={user.name}
                      fallback={user.fallback}
                      size={40}
                      className="user-avatar"
                    />
                    <div className={`status-dot ${user.online ? 'online' : 'offline'}`} />
                  </div>
                  {user.unread > 0 && (
                    <div className="unread-badge">{user.unread}</div>
                  )}
                </div>
                <div className="user-info">
                  <div className="user-name">{user.name}</div>
                  <div className="user-status">{user.status}</div>
                  <div className="user-last-seen">{user.lastSeen}</div>
                </div>
                <div className="user-actions">
                  <button className="user-action-btn voice-call" title="Voice call">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M6.62 10.79c1.44 2.83 3.76 5.14 6.59 6.59l2.2-2.2c.27-.27.67-.36 1.02-.24 1.12.37 2.33.57 3.57.57.55 0 1 .45 1 1V20c0 .55-.45 1-1 1-9.39 0-17-7.61-17-17 0-.55.45-1 1-1h3.5c.55 0 1 .45 1 1 0 1.25.2 2.45.57 3.57.11.35.03.74-.25 1.02l-2.2 2.2z"/>
                    </svg>
                  </button>
                  <button className="user-action-btn video-call" title="Video call">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M17 10.5V7c0-.55-.45-1-1-1H4c-.55 0-1 .45-1 1v10c0 .55.45 1 1 1h12c.55 0 1-.45 1-1v-3.5l4 4v-11l-4 4z"/>
                    </svg>
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Voice connection status at bottom */}
          {isVoiceConnected && (
            <div className="voice-status-bar">
              <div className="voice-status-info">
                <div className="voice-status-channel">
                  Connected to {voiceChannels.find(vc => vc.id === connectedVoiceChannel)?.name}
                </div>
                <div className="voice-mini-controls">
                  <button 
                    className={`voice-mini-btn ${voiceSettings.muted ? 'active' : ''}`}
                    onClick={() => toggleVoiceSetting('muted')}
                  >
        {voiceSettings.muted ? (
              <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                <path d="M19,11C19,12.19 18.66,13.3 18.1,14.28L16.87,13.05C17.14,12.43 17.3,11.74 17.3,11H19M15,11.16L9,5.18V5A3,3 0 0,1 12,2A3,3 0 0,1 15,5V11L15,11.16M4.27,3L21,19.73L19.73,21L15.54,16.81C14.77,17.27 13.91,17.58 13,17.72V21H11V17.72C7.72,17.23 5,14.41 5,11H6.7C6.7,14 9.24,16.1 12,16.1C12.81,16.1 13.6,15.91 14.31,15.58L12.65,13.92L12,14A3,3 0 0,1 9,11V10.28L3,4.27L4.27,3Z"/>
              </svg>
            ) : (
              <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12,2A3,3 0 0,1 15,5V11A3,3 0 0,1 12,14A3,3 0 0,1 9,11V5A3,3 0 0,1 12,2M19,11C19,14.53 16.39,17.44 13,17.93V21H11V17.93C7.61,17.44 5,14.53 5,11H7A5,5 0 0,0 12,16A5,5 0 0,0 17,11H19Z"/>
              </svg>
            )}
                  </button>
                  <button 
                    className={`voice-mini-btn ${voiceSettings.deafened ? 'active' : ''}`}
                    onClick={() => toggleVoiceSetting('deafened')}
                  >
        {voiceSettings.deafened ? (
              <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                <path d="M19,11C19,12.19 18.66,13.3 18.1,14.28L16.87,13.05C17.14,12.43 17.3,11.74 17.3,11H19M15,11.16L9,5.18V5A3,3 0 0,1 12,2A3,3 0 0,1 15,5V11L15,11.16M4.27,3L21,19.73L19.73,21L15.54,16.81C14.77,17.27 13.91,17.58 13,17.72V21H11V17.72C7.72,17.23 5,14.41 5,11H6.7C6.7,14 9.24,16.1 12,16.1C12.81,16.1 13.6,15.91 14.31,15.58L12.65,13.92L12,14A3,3 0 0,1 9,11V10.28L3,4.27L4.27,3Z"/>
              </svg>
            ) : (
              <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                <path d="M14,3.23V5.29C16.89,6.15 19,8.83 19,12C19,15.17 16.89,17.84 14,18.7V20.77C18,19.86 21,16.28 21,12C21,7.72 18,4.14 14,3.23M16.5,12C16.5,10.23 15.5,8.71 14,7.97V16C15.5,15.29 16.5,13.76 16.5,12M3,9V15H7L12,20V4L7,9H3Z"/>
              </svg>
            )}
                  </button>
                  <button 
                    className="voice-mini-btn disconnect"
                    onClick={handleVoiceDisconnect}
                  >
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12,9C10.89,9 10,8.1 10,7C10,5.89 10.89,5 12,5C13.11,5 14,5.89 14,7C14,8.1 13.11,9 12,9M12,20C7.59,20 4,16.41 4,12C4,7.59 7.59,4 12,4C16.41,4 20,7.59 20,12C20,16.41 16.41,20 12,20M12,2C6.48,2 2,6.48 2,12C2,17.52 6.48,22 12,22C17.52,22 22,17.52 22,12C22,6.48 17.52,2 12,2Z"/>
            </svg>
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Main Chat Area - Completely Enhanced */}
        <div className="chat-area">
          {/* Enhanced Chat Header */}
          <div className="chat-header">
            <div className="chat-user-info">
              <div style={{position: 'relative'}}>
                <Avatar
                  src={users.find(u => u.id === selectedUserId)?.avatar || '/avatars/default.jpg'}
                  alt={users.find(u => u.id === selectedUserId)?.name || 'User'}
                  fallback={users.find(u => u.id === selectedUserId)?.fallback || 'U'}
                  size={40}
                  className="chat-user-avatar"
                />
                <div className={`status-dot ${users.find(u => u.id === selectedUserId)?.online ? 'online' : 'offline'}`} />
              </div>
              <div className="chat-user-details">
                <div className="chat-user-name">
                  {users.find(u => u.id === selectedUserId)?.name || 'Select a user'}
                </div>
                <div className="chat-user-status">
                  {users.find(u => u.id === selectedUserId)?.status || 'Last seen recently'}
                </div>
              </div>
            </div>
            <div className="chat-actions">
              <button className="chat-action-btn voice-call" title="Voice call">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M6.62 10.79c1.44 2.83 3.76 5.14 6.59 6.59l2.2-2.2c.27-.27.67-.36 1.02-.24 1.12.37 2.33.57 3.57.57.55 0 1 .45 1 1V20c0 .55-.45 1-1 1-9.39 0-17-7.61-17-17 0-.55.45-1 1-1h3.5c.55 0 1 .45 1 1 0 1.25.2 2.45.57 3.57.11.35.03.74-.25 1.02l-2.2 2.2z"/>
                </svg>
              </button>
              <button className="chat-action-btn video-call" title="Video call">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M17 10.5V7c0-.55-.45-1-1-1H4c-.55 0-1 .45-1 1v10c0 .55.45 1 1 1h12c.55 0 1-.45 1-1v-3.5l4 4v-11l-4 4z"/>
                </svg>
              </button>
              <button className="chat-action-btn search" title="Search">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M15.5 14h-.79l-.28-.27C15.41 12.59 16 11.11 16 9.5 16 5.91 13.09 3 9.5 3S3 5.91 3 9.5 5.91 16 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z"/>
                </svg>
              </button>
              <button className="chat-action-btn more" title="More options">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 8c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2zm0 2c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm0 6c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2z"/>
                </svg>
              </button>
            </div>
          </div>
          
          {/* Enhanced Messages Area */}
          <div className="messages-area">
            <div className="messages-date-header">Today</div>
            {currentMessages.map((message, index) => (
              <div key={message.id} className="message">
                <Avatar
                  src={message.avatar}
                  alt={message.author}
                  fallback={message.author.charAt(0).toUpperCase()}
                  size={36}
                  className="message-avatar"
                />
                <div className="message-content">
                  <div className="message-header">
                    <span className="message-author">{message.author}</span>
                    <span className="message-time">{message.time}</span>
                  </div>
                  <div className="message-text">{message.text}</div>
                  
                  {/* Enhanced message reactions */}
                  {index < 4 && (
                    <div className="message-reactions">
                      <button className="reaction-btn active">
                        <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor" style={{marginRight: '4px'}}>
                          <path d="M5,9V21H1V9H5M9,21A2,2 0 0,1 7,19V9C7,8.45 7.22,7.95 7.59,7.59L14.17,1L15.23,2.06C15.5,2.33 15.67,2.7 15.67,3.11L15.64,3.43L14.69,8H21C22.11,8 23,8.9 23,10V12C23,12.26 22.95,12.5 22.86,12.73L19.84,19.78C19.54,20.5 18.83,21 18,21H9M9,19H18.03L21,12V10H12.21L13.34,4.68L9,9.03V19Z"/>
                        </svg>
                        2
                      </button>
                      <button className="reaction-btn">
                        <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor" style={{marginRight: '4px'}}>
                          <path d="M12,21.35L10.55,20.03C5.4,15.36 2,12.27 2,8.5 2,5.41 4.42,3 7.5,3C9.24,3 10.91,3.81 12,5.08C13.09,3.81 14.76,3 16.5,3C19.58,3 22,5.41 22,8.5C22,12.27 18.6,15.36 13.45,20.03L12,21.35Z"/>
                        </svg>
                        1
                      </button>
                      <button className="reaction-btn">
                        <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor" style={{marginRight: '4px'}}>
                          <path d="M12,2C6.486,2 2,6.486 2,12C2,17.515 6.486,22 12,22C17.515,22 22,17.515 22,12C22,6.486 17.515,2 12,2M12,20C7.589,20 4,16.411 4,12C4,7.589 7.589,4 12,4C16.411,4 20,7.589 20,12C20,16.411 16.411,20 12,20M8.5,11A1.5,1.5 0 0,1 7,9.5A1.5,1.5 0 0,1 8.5,8A1.5,1.5 0 0,1 10,9.5A1.5,1.5 0 0,1 8.5,11M15.5,11A1.5,1.5 0 0,1 14,9.5A1.5,1.5 0 0,1 15.5,8A1.5,1.5 0 0,1 17,9.5A1.5,1.5 0 0,1 15.5,11M12,17.5C14.33,17.5 16.31,16.04 17.11,14H6.89C7.69,16.04 9.67,17.5 12,17.5Z"/>
                        </svg>
                        3
                      </button>
                      <button className="add-reaction-btn">+</button>
                    </div>
                  )}
                  
                  {/* Message actions */}
                  <div className="message-actions">
                    <button className="message-action-btn" title="Reply">
                      <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M10,9V5L3,12L10,19V14.9C15,14.9 18.5,16.5 21,20C20,15 17,10 10,9Z"/>
                      </svg>
                    </button>
                    <button className="message-action-btn" title="React">
                      <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M12,2C6.486,2 2,6.486 2,12C2,17.515 6.486,22 12,22C17.515,22 22,17.515 22,12C22,6.486 17.515,2 12,2M12,20C7.589,20 4,16.411 4,12C4,7.589 7.589,4 12,4C16.411,4 20,7.589 20,12C20,16.411 16.411,20 12,20M8.5,11A1.5,1.5 0 0,1 7,9.5A1.5,1.5 0 0,1 8.5,8A1.5,1.5 0 0,1 10,9.5A1.5,1.5 0 0,1 8.5,11M15.5,11A1.5,1.5 0 0,1 14,9.5A1.5,1.5 0 0,1 15.5,8A1.5,1.5 0 0,1 17,9.5A1.5,1.5 0 0,1 15.5,11M12,17.5C14.33,17.5 16.31,16.04 17.11,14H6.89C7.69,16.04 9.67,17.5 12,17.5Z"/>
                      </svg>
                    </button>
                    <button className="message-action-btn" title="More">
                      <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M12,16A2,2 0 0,1 14,18A2,2 0 0,1 12,20A2,2 0 0,1 10,18A2,2 0 0,1 12,16M12,10A2,2 0 0,1 14,12A2,2 0 0,1 12,14A2,2 0 0,1 10,12A2,2 0 0,1 12,10M12,4A2,2 0 0,1 14,6A2,2 0 0,1 12,8A2,2 0 0,1 10,6A2,2 0 0,1 12,4Z"/>
                      </svg>
                    </button>
                  </div>
                  
                  {/* Enhanced read receipts */}
                  <div className="message-meta">
                    <div className={`read-receipt ${index < 2 ? 'read' : index < 5 ? 'delivered' : 'sending'}`}>
                      {index < 2 ? (
                        <span style={{display: 'flex', alignItems: 'center', gap: '4px'}}>
                          <svg width="10" height="10" viewBox="0 0 24 24" fill="currentColor">
                            <path d="M21,7L9,19L3.5,13.5L4.91,12.09L9,16.17L19.59,5.59L21,7Z"/>
                          </svg>
                          <svg width="10" height="10" viewBox="0 0 24 24" fill="currentColor">
                            <path d="M21,7L9,19L3.5,13.5L4.91,12.09L9,16.17L19.59,5.59L21,7Z"/>
                          </svg>
                          Read
                        </span>
                      ) : index < 5 ? (
                        <span style={{display: 'flex', alignItems: 'center', gap: '4px'}}>
                          <svg width="10" height="10" viewBox="0 0 24 24" fill="currentColor">
                            <path d="M21,7L9,19L3.5,13.5L4.91,12.09L9,16.17L19.59,5.59L21,7Z"/>
                          </svg>
                          Delivered
                        </span>
                      ) : (
                        <span style={{display: 'flex', alignItems: 'center', gap: '4px'}}>
                          <svg width="10" height="10" viewBox="0 0 24 24" fill="currentColor">
                            <path d="M12,4V2A10,10 0 0,0 2,12H4A8,8 0 0,1 12,4Z"/>
                            <animateTransform attributeName="transform" type="rotate" from="0 12 12" to="360 12 12" dur="1s" repeatCount="indefinite"/>
                          </svg>
                          Sending...
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
            
            {/* Typing indicator */}
            <div className="typing-indicator">
              <div className="typing-avatar" />
              <div className="typing-content">
                <div className="typing-name">james</div>
                <div className="typing-dots">
                  <span></span>
                  <span></span>
                  <span></span>
                </div>
              </div>
            </div>
          </div>
          
          {/* Enhanced Message Input */}
          <div className="message-input-area">
            <div className="message-input-container">
              <div className="input-extras">
                <button className="input-extra-btn" title="Upload file">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M14,2H6A2,2 0 0,0 4,4V20A2,2 0 0,0 6,22H18A2,2 0 0,0 20,20V8L14,2M18,20H6V4H13V9H18V20Z"/>
                  </svg>
                </button>
                <button className="input-extra-btn" title="GIF">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M11.5,9H13V7H11.5V9M12,20A8,8 0 0,1 4,12A8,8 0 0,1 12,4A8,8 0 0,1 20,12A8,8 0 0,1 12,20M12,2A10,10 0 0,0 2,12A10,10 0 0,0 12,22A10,10 0 0,0 22,12A10,10 0 0,0 12,2M7,13H9V11H7V13M15,11H17V13H15V11M13,15H11V17H13V15Z"/>
                  </svg>
                </button>
                <button className="input-extra-btn" title="Sticker">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M18.5,2A1.5,1.5 0 0,1 20,3.5V11.5A1.5,1.5 0 0,1 18.5,13H13V18.5A1.5,1.5 0 0,1 11.5,20H3.5A1.5,1.5 0 0,1 2,18.5V3.5A1.5,1.5 0 0,1 3.5,2H18.5M18.5,11.5V3.5H3.5V18.5H11.5V11.5H18.5Z"/>
                  </svg>
                </button>
              </div>
              <input 
                type="text" 
                className="message-input"
                placeholder={`Message ${users.find(u => u.id === selectedUserId)?.name || 'user'}...`}
                value={messageInput}
                onChange={(e) => setMessageInput(e.target.value)}
                onKeyPress={handleKeyPress}
              />
              <div className="input-actions">
                <button className="input-btn emoji-btn" title="Emoji">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12,2C6.486,2 2,6.486 2,12C2,17.515 6.486,22 12,22C17.515,22 22,17.515 22,12C22,6.486 17.515,2 12,2M12,20C7.589,20 4,16.411 4,12C4,7.589 7.589,4 12,4C16.411,4 20,7.589 20,12C20,16.411 16.411,20 12,20M8.5,11A1.5,1.5 0 0,1 7,9.5A1.5,1.5 0 0,1 8.5,8A1.5,1.5 0 0,1 10,9.5A1.5,1.5 0 0,1 8.5,11M15.5,11A1.5,1.5 0 0,1 14,9.5A1.5,1.5 0 0,1 15.5,8A1.5,1.5 0 0,1 17,9.5A1.5,1.5 0 0,1 15.5,11M12,17.5C14.33,17.5 16.31,16.04 17.11,14H6.89C7.69,16.04 9.67,17.5 12,17.5Z"/>
                  </svg>
                </button>
                <button 
                  className="input-btn send-btn"
                  onClick={handleSendMessage}
                  disabled={!messageInput.trim()}
                >
                  {messageInput.trim() ? (
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M2,21L23,12L2,3V10L17,12L2,14V21Z"/>
                    </svg>
                  ) : (
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M12,2A3,3 0 0,1 15,5V11A3,3 0 0,1 12,14A3,3 0 0,1 9,11V5A3,3 0 0,1 12,2M19,11C19,14.53 16.39,17.44 13,17.93V21H11V17.93C7.61,17.44 5,14.53 5,11H7A5,5 0 0,0 12,16A5,5 0 0,0 17,11H19Z"/>
                    </svg>
                  )}
                </button>
              </div>
            </div>
            
            {/* Quick actions bar */}
            <div className="quick-actions-bar">
              <button className="quick-action-btn">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" style={{marginRight: '6px'}}>
                  <path d="M4,4H7L9,2H15L17,4H20A2,2 0 0,1 22,6V18A2,2 0 0,1 20,20H4A2,2 0 0,1 2,18V6A2,2 0 0,1 4,4M12,7A5,5 0 0,0 7,12A5,5 0 0,0 12,17A5,5 0 0,0 17,12A5,5 0 0,0 12,7M12,9A3,3 0 0,1 15,12A3,3 0 0,1 12,15A3,3 0 0,1 9,12A3,3 0 0,1 12,9Z"/>
                </svg>
                Photo
              </button>
              <button className="quick-action-btn">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" style={{marginRight: '6px'}}>
                  <path d="M14,3.23V5.29C16.89,6.15 19,8.83 19,12C19,15.17 16.89,17.84 14,18.7V20.77C18,19.86 21,16.28 21,12C21,7.72 18,4.14 14,3.23M16.5,12C16.5,10.23 15.5,8.71 14,7.97V16C15.5,15.29 16.5,13.76 16.5,12M3,9V15H7L12,20V4L7,9H3Z"/>
                </svg>
                Audio
              </button>
              <button className="quick-action-btn">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" style={{marginRight: '6px'}}>
                  <path d="M12,11.5A2.5,2.5 0 0,1 9.5,9A2.5,2.5 0 0,1 12,6.5A2.5,2.5 0 0,1 14.5,9A2.5,2.5 0 0,1 12,11.5M12,2A7,7 0 0,0 5,9C5,14.25 12,22 12,22C12,22 19,14.25 19,9A7,7 0 0,0 12,2Z"/>
                </svg>
                Location
              </button>
              <button className="quick-action-btn">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" style={{marginRight: '6px'}}>
                  <path d="M7,15H9C9,16.08 10.37,17 12,17C13.63,17 15,16.08 15,15C15,13.9 13.96,13.5 11.76,12.97C9.64,12.44 7,11.78 7,9C7,7.21 8.47,5.69 10.5,5.18V3H13.5V5.18C15.53,5.69 17,7.21 17,9H15C15,7.92 13.63,7 12,7C10.37,7 9,7.92 9,9C9,10.1 10.04,10.5 12.24,11.03C14.36,11.56 17,12.22 17,15C17,16.79 15.53,18.31 13.5,18.82V21H10.5V18.82C8.47,18.31 7,16.79 7,15Z"/>
                </svg>
                Payment
              </button>
            </div>
          </div>
        </div>


      </div>
    </div>
  );
}