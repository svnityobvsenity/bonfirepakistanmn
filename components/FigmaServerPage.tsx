'use client';

import React, { useState } from 'react';

// Server data based on Figma JSON
const channels = [
  { id: 1, name: 'Main-Chat', type: 'text', selected: true },
  { id: 2, name: 'Media', type: 'text', selected: false },
  { id: 3, name: 'Forum', type: 'text', selected: false },
  { id: 4, name: 'Memes', type: 'text', selected: false },
  { id: 5, name: 'Announcements', type: 'text', selected: false },
  { id: 6, name: 'Random', type: 'text', selected: false },
  { id: 7, name: 'Help-Desk', type: 'text', selected: false },
  { id: 8, name: 'General', type: 'voice', selected: false },
  { id: 9, name: 'Music', type: 'voice', selected: false },
  { id: 10, name: 'Gaming', type: 'voice', selected: false },
];

const members = [
  { id: 1, name: 'daFoxy', status: 'Online', avatar: '/avatars/dafoxy.jpg', role: 'Owner' },
  { id: 2, name: 'james', status: 'Online', avatar: '/avatars/james.jpg', role: 'Admin' },
  { id: 3, name: 'Ekmand', status: 'Away', avatar: '/avatars/ekmand.jpg', role: 'Member' },
  { id: 4, name: 'Sticks', status: 'Offline', avatar: '/avatars/sticks.jpg', role: 'Member' },
];

const getServerMessages = (serverName: string) => [
  { id: 1, author: 'daFoxy', time: 'Today at 9:41PM', text: 'I saw this really cool video the other day mind if I send it?', avatar: '/avatars/dafoxy.jpg' },
  { id: 2, author: 'Kalf', time: 'Today at 9:41PM', text: 'Sure thing! Want to start a Watch Party?', avatar: '/avatars/kalf.jpg' },
  { id: 3, author: 'daFoxy', time: 'Today at 9:41PM', text: 'oOoOOoo what\'s that?', avatar: '/avatars/dafoxy.jpg' },
  { id: 4, author: 'Kalf', time: 'Today at 9:41PM', text: 'It\'s this new Discord feature. Have you heard of it?', avatar: '/avatars/kalf.jpg' },
  { id: 5, author: 'daFoxy', time: 'Today at 9:41PM', text: 'No, how does it work?', avatar: '/avatars/kalf.jpg' },
  { id: 6, author: 'Kalf', time: 'Today at 9:44 PM', text: 'Just paste a YouTube link into the DM and Discord will ask you if you want to start a Watch Party!', avatar: '/avatars/kalf.jpg' },
  { id: 7, author: 'daFoxy', time: 'Today at 9:41PM', text: 'Woah! I\'ll start one now!', avatar: '/avatars/dafoxy.jpg' },
  { id: 8, author: 'Kalf', time: 'Today at 9:44 PM', text: 'Cool, can\'t wait to see the video:D', avatar: '/avatars/kalf.jpg' },
  { id: 9, author: 'daFoxy', time: 'Today at 9:41PM', text: 'Awesome, starting now...', avatar: '/avatars/dafoxy.jpg' },
  { id: 10, author: 'Kalf', time: 'Today at 9:44 PM', text: 'Joined.', avatar: '/avatars/kalf.jpg' },
];

interface FigmaServerPageProps {
  onBackToDMs: () => void;
  serverName: string;
}

export default function FigmaServerPage({ onBackToDMs, serverName }: FigmaServerPageProps) {
  const [selectedChannelId, setSelectedChannelId] = useState(1);
  const [messageInput, setMessageInput] = useState('');
  const [currentMessages, setCurrentMessages] = useState(getServerMessages(serverName));
  const [currentView, setCurrentView] = useState<'server' | 'voice'>('server');
  const [isVoiceConnected, setIsVoiceConnected] = useState(false);
  const [voiceSettings, setVoiceSettings] = useState({
    muted: false,
    deafened: false,
    camera: false,
    screenShare: false
  });
  const [connectedVoiceChannel, setConnectedVoiceChannel] = useState<number | null>(null);

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

  const handleVoiceChannelJoin = (channelId: number) => {
    setConnectedVoiceChannel(channelId);
    setIsVoiceConnected(true);
    setCurrentView('voice');
  };

  const handleVoiceDisconnect = () => {
    setConnectedVoiceChannel(null);
    setIsVoiceConnected(false);
    setCurrentView('server');
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

  // Show voice channel interface if connected
  if (currentView === 'voice' && connectedVoiceChannel) {
    const channel = channels.find(c => c.id === connectedVoiceChannel);
    return (
      <div className="server-voice-interface">
        <style jsx>{`
          .server-voice-interface {
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

          .server-voice-header {
            position: absolute;
            top: 40px;
            left: 50%;
            transform: translateX(-50%);
            text-align: center;
          }

          .server-voice-channel-name {
            font-size: 32px;
            font-weight: 700;
            color: #ffffff;
            margin-bottom: 8px;
            text-shadow: 0 4px 20px rgba(102, 126, 234, 0.5);
          }

          .server-voice-server-name {
            font-size: 16px;
            color: rgba(255, 255, 255, 0.7);
          }

          .server-voice-users-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
            gap: 30px;
            max-width: 800px;
            margin: 40px 0;
          }

          .server-voice-user-card {
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

          .server-voice-user-card::before {
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

          .server-voice-user-card:hover::before {
            opacity: 1;
          }

          .server-voice-user-avatar {
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

          .server-voice-user-name {
            font-size: 18px;
            font-weight: 600;
            color: #ffffff;
            margin-bottom: 8px;
          }

          .server-voice-user-status {
            font-size: 14px;
            color: rgba(255, 255, 255, 0.6);
          }

          .server-voice-controls {
            position: absolute;
            bottom: 40px;
            left: 50%;
            transform: translateX(-50%);
            display: flex;
            gap: 20px;
          }

          .server-voice-control-btn {
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

          .server-voice-control-btn.mute {
            background: ${voiceSettings.muted ? 'linear-gradient(135deg, #ff4757 0%, #ff3838 100%)' : 'rgba(255, 255, 255, 0.2)'};
            color: white;
          }

          .server-voice-control-btn.deafen {
            background: ${voiceSettings.deafened ? 'linear-gradient(135deg, #ff4757 0%, #ff3838 100%)' : 'rgba(255, 255, 255, 0.2)'};
            color: white;
          }

          .server-voice-control-btn.camera {
            background: ${voiceSettings.camera ? 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' : 'rgba(255, 255, 255, 0.2)'};
            color: white;
          }

          .server-voice-control-btn.screen {
            background: ${voiceSettings.screenShare ? 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' : 'rgba(255, 255, 255, 0.2)'};
            color: white;
          }

          .server-voice-control-btn.disconnect {
            background: linear-gradient(135deg, #ff4757 0%, #ff3838 100%);
            color: white;
          }

          .server-voice-control-btn:hover {
            transform: translateY(-4px);
            box-shadow: 0 8px 30px rgba(0, 0, 0, 0.3);
          }

          .back-to-server {
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

          .back-to-server:hover {
            background: rgba(102, 126, 234, 0.3);
            transform: translateY(-2px);
          }
        `}</style>

        <button className="back-to-server" onClick={() => setCurrentView('server')}>
          ←
        </button>

        <div className="server-voice-header">
          <div className="server-voice-channel-name">🔊 {channel?.name}</div>
          <div className="server-voice-server-name">{serverName}</div>
        </div>

        <div className="server-voice-users-grid">
          <div className="server-voice-user-card">
            <div className="server-voice-user-avatar">
              D
            </div>
            <div className="server-voice-user-name">daFoxy</div>
            <div className="server-voice-user-status">Speaking</div>
          </div>
          
          <div className="server-voice-user-card">
            <div className="server-voice-user-avatar">
              J
            </div>
            <div className="server-voice-user-name">james</div>
            <div className="server-voice-user-status">Connected</div>
          </div>
          
          <div className="server-voice-user-card">
            <div className="server-voice-user-avatar">
              Y
            </div>
            <div className="server-voice-user-name">You</div>
            <div className="server-voice-user-status">
              {voiceSettings.muted ? 'Muted' : 'Speaking'}
            </div>
          </div>
        </div>

        <div className="server-voice-controls">
          <button 
            className="server-voice-control-btn mute"
            onClick={() => toggleVoiceSetting('muted')}
            title={voiceSettings.muted ? 'Unmute' : 'Mute'}
          >
            {voiceSettings.muted ? '🔇' : '🎤'}
          </button>
          
          <button 
            className="server-voice-control-btn deafen"
            onClick={() => toggleVoiceSetting('deafened')}
            title={voiceSettings.deafened ? 'Undeafen' : 'Deafen'}
          >
            {voiceSettings.deafened ? '🔇' : '🔊'}
          </button>
          
          <button 
            className="server-voice-control-btn camera"
            onClick={() => toggleVoiceSetting('camera')}
            title={voiceSettings.camera ? 'Turn off camera' : 'Turn on camera'}
          >
            {voiceSettings.camera ? '📹' : '📷'}
          </button>
          
          <button 
            className="server-voice-control-btn screen"
            onClick={() => toggleVoiceSetting('screenShare')}
            title={voiceSettings.screenShare ? 'Stop sharing' : 'Share screen'}
          >
            {voiceSettings.screenShare ? '🖥️' : '📺'}
          </button>
          
          <button 
            className="server-voice-control-btn disconnect"
            onClick={handleVoiceDisconnect}
            title="Disconnect"
          >
            📞
          </button>
        </div>
      </div>
    );
  }

  return (
    <div>
      <style jsx>{`
        /* Main Container - Exact Figma Frame: bonfire pakistan */
        .figma-server {
          position: relative;
          width: 100vw;
          height: 100vh;
          background: #000000;
          overflow: hidden;
        }

        /* Background - Exact match from Figma JSON */
        .server-background {
          position: absolute;
          width: 100%;
          height: 100%;
          /* Frame 1000002742: x: 0, y: 0, width: 1512, height: 982 */
          background: linear-gradient(135deg, #1a1a2e 0%, #16213e 25%, #0f3460 50%, #533483 75%, #e94560 100%);
          opacity: 0.9;
        }

        /* Blur Overlay */
        .server-blur-overlay {
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
          height: 110px;
          display: flex;
          flex-direction: row;
          align-items: center;
          gap: 20px;
          padding: 20px 32px;
          background: linear-gradient(135deg, rgba(0, 0, 0, 0.98) 0%, rgba(15, 15, 35, 0.98) 50%, rgba(25, 25, 45, 0.98) 100%);
          backdrop-filter: blur(40px);
          -webkit-backdrop-filter: blur(40px);
          border-radius: 24px;
          border: 2px solid rgba(102, 126, 234, 0.4);
          box-shadow: 
            0 12px 50px rgba(0, 0, 0, 0.8),
            0 0 0 1px rgba(255, 255, 255, 0.15),
            inset 0 2px 0 rgba(255, 255, 255, 0.15),
            0 0 60px rgba(102, 126, 234, 0.2);
          z-index: 50;
          overflow-x: auto;
          overflow-y: hidden;
          position: relative;
        }

        .server-list::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: linear-gradient(45deg, transparent 30%, rgba(102, 126, 234, 0.1) 50%, transparent 70%);
          border-radius: 24px;
          pointer-events: none;
          opacity: 0.8;
        }

        .server-icon {
          width: 80px;
          height: 80px;
          border-radius: 20px;
          cursor: pointer;
          transition: all 0.4s cubic-bezier(0.34, 1.56, 0.64, 1);
          position: relative;
          box-shadow: 
            0 6px 30px rgba(0, 0, 0, 0.7),
            0 0 0 3px rgba(255, 255, 255, 0.15),
            inset 0 2px 0 rgba(255, 255, 255, 0.2);
          border: 2px solid transparent;
          flex-shrink: 0;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 40px;
          font-weight: bold;
          color: white;
          overflow: hidden;
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

        .server-icon.github {
          background: linear-gradient(135deg, #24292f 0%, #1a1e23 100%);
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

        .server-separator {
          width: 3px;
          height: 48px;
          background: linear-gradient(180deg, transparent 0%, rgba(102, 126, 234, 0.5) 30%, rgba(255, 255, 255, 0.4) 50%, rgba(102, 126, 234, 0.5) 70%, transparent 100%);
          border-radius: 2px;
          margin: 0 8px;
          box-shadow: 0 0 10px rgba(102, 126, 234, 0.3);
        }

        /* Left Sidebar - Channels */
        /* Frame 1000002743: x: 24, y: 150, width: 280, height: 808 */
        .channels-sidebar {
          position: absolute;
          left: 24px;
          top: 150px;
          width: 280px;
          height: calc(100vh - 174px);
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

        /* Server Header */
        /* Frame 1000002744: x: 0, y: 0, width: 280, height: 70 */
        .server-header {
          height: 70px;
          padding: 16px 20px;
          background: linear-gradient(135deg, rgba(102, 126, 234, 0.1) 0%, rgba(118, 75, 162, 0.1) 100%);
          border-bottom: 1px solid rgba(255, 255, 255, 0.1);
          display: flex;
          align-items: center;
          justify-content: space-between;
        }

        /* Server Name */
        /* Text 1000002745: x: 20, y: 25, width: 140, height: 20 */
        .server-name {
          font-size: 18px;
          font-weight: 700;
          color: #ffffff;
          text-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
        }

        .server-dropdown {
          width: 16px;
          height: 16px;
          color: rgba(255, 255, 255, 0.7);
          cursor: pointer;
        }

        /* Channels Section */
        .channels-section {
          flex: 1;
          padding: 16px 0;
          overflow-y: auto;
        }

        /* Channel Category */
        .channel-category {
          padding: 8px 20px;
          font-size: 12px;
          font-weight: 600;
          color: rgba(255, 255, 255, 0.6);
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }

        /* Channel Item */
        /* Frame 1000002746: x: 0, y: 110, width: 280, height: 40 */
        .channel-item {
          display: flex;
          align-items: center;
          padding: 10px 20px;
          margin: 3px 12px;
          border-radius: 12px;
          cursor: pointer;
          transition: all 0.3s ease;
          position: relative;
          border: 1px solid transparent;
        }

        .channel-item:hover {
          background: rgba(255, 255, 255, 0.12);
          border-color: rgba(102, 126, 234, 0.3);
          transform: translateX(4px);
        }

        .channel-item.selected {
          background: linear-gradient(135deg, rgba(102, 126, 234, 0.4) 0%, rgba(118, 75, 162, 0.4) 100%);
          border-left: 4px solid #667eea;
          border-color: rgba(102, 126, 234, 0.6);
          box-shadow: 
            0 4px 20px rgba(102, 126, 234, 0.3),
            inset 0 1px 0 rgba(255, 255, 255, 0.1);
        }

        .channel-icon {
          width: 16px;
          height: 16px;
          margin-right: 8px;
          color: rgba(255, 255, 255, 0.6);
        }

        .channel-name {
          font-size: 14px;
          font-weight: 500;
          color: #ffffff;
          flex: 1;
        }

        /* Voice Channel Enhancements */
        .voice-channel {
          display: flex;
          align-items: center;
          justify-content: space-between;
        }

        .voice-channel-controls {
          display: flex;
          align-items: center;
          gap: 8px;
          opacity: 0;
          transition: opacity 0.3s ease;
        }

        .voice-channel:hover .voice-channel-controls {
          opacity: 1;
        }

        .voice-join-btn {
          width: 24px;
          height: 24px;
          border-radius: 50%;
          background: rgba(102, 126, 234, 0.3);
          border: 1px solid rgba(102, 126, 234, 0.5);
          color: white;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 12px;
          transition: all 0.3s ease;
        }

        .voice-join-btn:hover {
          background: rgba(102, 126, 234, 0.6);
          transform: scale(1.1);
        }

        .voice-users-count {
          font-size: 11px;
          color: rgba(255, 255, 255, 0.6);
          min-width: 30px;
          text-align: center;
        }

        /* DMs Icon Special Styling */
        .server-icon.dms-icon:hover {
          box-shadow: 
            0 12px 40px rgba(0, 0, 0, 0.8),
            0 0 0 3px rgba(30, 58, 138, 0.8),
            0 0 30px rgba(30, 58, 138, 0.6);
          border-color: rgba(30, 58, 138, 0.8);
        }

        /* Main Chat Area */
        /* Frame 1000002747: x: 328, y: 150, width: 944, height: 808 */
        .server-chat-area {
          position: absolute;
          left: 328px;
          top: 150px;
          width: calc(100vw - 592px);
          height: calc(100vh - 174px);
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

        /* Chat Header */
        /* Frame 1000002748: x: 0, y: 0, width: 944, height: 70 */
        .server-chat-header {
          height: 70px;
          padding: 0 24px;
          display: flex;
          align-items: center;
          border-bottom: 1px solid rgba(255, 255, 255, 0.1);
          background: linear-gradient(135deg, rgba(102, 126, 234, 0.1) 0%, rgba(118, 75, 162, 0.1) 100%);
        }

        .channel-header-info {
          display: flex;
          align-items: center;
        }

        .channel-hash {
          font-size: 20px;
          color: rgba(255, 255, 255, 0.6);
          margin-right: 8px;
        }

        .channel-title {
          font-size: 18px;
          font-weight: 600;
          color: #ffffff;
          text-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
        }

        /* Messages Area */
        .server-messages-area {
          flex: 1;
          overflow-y: auto;
          padding: 24px;
          display: flex;
          flex-direction: column;
          gap: 20px;
        }

        .server-message {
          display: flex;
          gap: 12px;
          padding: 12px 16px;
          border-radius: 16px;
          transition: all 0.3s ease;
        }

        .server-message:hover {
          background: rgba(255, 255, 255, 0.05);
        }

        .server-message-avatar {
          width: 36px;
          height: 36px;
          border-radius: 50%;
          background-size: cover;
          background-position: center;
          flex-shrink: 0;
          border: 2px solid rgba(255, 255, 255, 0.1);
        }

        .server-message-content {
          flex: 1;
        }

        .server-message-header {
          display: flex;
          align-items: center;
          gap: 8px;
          margin-bottom: 4px;
        }

        .server-message-author {
          font-size: 14px;
          font-weight: 600;
          color: #667eea;
        }

        .server-message-time {
          font-size: 12px;
          color: rgba(255, 255, 255, 0.5);
        }

        .server-message-text {
          font-size: 14px;
          color: #ffffff;
          line-height: 1.5;
        }

        /* Message Input Area */
        .server-message-input-area {
          padding: 24px;
          border-top: 1px solid rgba(255, 255, 255, 0.1);
          background: linear-gradient(135deg, rgba(0, 0, 0, 0.3) 0%, rgba(0, 0, 0, 0.6) 100%);
        }

        .server-message-input-container {
          display: flex;
          align-items: center;
          gap: 12px;
          background: rgba(255, 255, 255, 0.1);
          border: 1px solid rgba(255, 255, 255, 0.2);
          border-radius: 16px;
          padding: 12px 16px;
          transition: all 0.3s ease;
        }

        .server-message-input-container:focus-within {
          background: rgba(255, 255, 255, 0.15);
          border-color: rgba(102, 126, 234, 0.6);
          box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.2);
        }

        .server-message-input {
          flex: 1;
          background: none;
          border: none;
          color: #ffffff;
          font-size: 14px;
          outline: none;
        }

        .server-message-input::placeholder {
          color: rgba(255, 255, 255, 0.5);
        }

        .server-input-actions {
          display: flex;
          gap: 8px;
        }

        .server-input-btn {
          width: 32px;
          height: 32px;
          border-radius: 8px;
          background: rgba(102, 126, 234, 0.3);
          border: 1px solid rgba(102, 126, 234, 0.5);
          color: #ffffff;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: all 0.3s ease;
          font-size: 14px;
        }

        .server-input-btn:hover {
          background: rgba(102, 126, 234, 0.5);
          transform: translateY(-1px);
        }

        .server-send-btn {
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          border-color: transparent;
        }

        .server-send-btn:hover {
          background: linear-gradient(135deg, #5a6fd8 0%, #6a4190 100%);
        }

        /* Members Sidebar */
        /* Frame 1000002749: x: 1296, y: 150, width: 240, height: 808 */
        .members-sidebar {
          position: absolute;
          right: 24px;
          top: 150px;
          width: 240px;
          height: calc(100vh - 174px);
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

        .members-header {
          padding: 16px 20px;
          background: linear-gradient(135deg, rgba(102, 126, 234, 0.1) 0%, rgba(118, 75, 162, 0.1) 100%);
          border-bottom: 1px solid rgba(255, 255, 255, 0.1);
        }

        .members-title {
          font-size: 14px;
          font-weight: 600;
          color: rgba(255, 255, 255, 0.8);
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }

        .members-list {
          flex: 1;
          overflow-y: auto;
          padding: 16px 0;
        }

        .member-item {
          display: flex;
          align-items: center;
          padding: 8px 20px;
          margin: 2px 8px;
          border-radius: 8px;
          cursor: pointer;
          transition: all 0.2s ease;
        }

        .member-item:hover {
          background: rgba(255, 255, 255, 0.1);
        }

        .member-avatar {
          width: 32px;
          height: 32px;
          border-radius: 50%;
          background-size: cover;
          background-position: center;
          margin-right: 12px;
          position: relative;
          border: 2px solid rgba(255, 255, 255, 0.2);
        }

        .member-status-dot {
          position: absolute;
          bottom: -2px;
          right: -2px;
          width: 10px;
          height: 10px;
          border: 2px solid rgba(0, 0, 0, 0.8);
          border-radius: 50%;
          box-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
        }

        .member-status-dot.online {
          background: linear-gradient(135deg, #43e97b 0%, #38f9d7 100%);
        }

        .member-status-dot.away {
          background: linear-gradient(135deg, #ffa726 0%, #ff9800 100%);
        }

        .member-status-dot.offline {
          background: rgba(255, 255, 255, 0.3);
        }

        .member-info {
          flex: 1;
        }

        .member-name {
          font-size: 14px;
          font-weight: 500;
          color: #ffffff;
          margin-bottom: 2px;
        }

        .member-role {
          font-size: 11px;
          color: rgba(255, 255, 255, 0.6);
          text-transform: uppercase;
          letter-spacing: 0.3px;
        }


      `}</style>
      
      <div className="figma-server">
        <div className="server-background"></div>
        <div className="server-blur-overlay"></div>
        

        
        {/* Server List - Enhanced with Active State */}
        <div className="server-list">
          <div 
            className="server-icon dms-icon"
            onClick={onBackToDMs}
            title="Back to DMs"
            style={{background: 'linear-gradient(135deg, #1e3a8a 0%, #3730a3 100%)'}}
          >
            ⛈️
          </div>
          <div className="server-separator"></div>
          <div className="server-icon github">
            ⚡
            <div className="server-notification">3</div>
          </div>
          <div className="server-separator"></div>
          <div className="server-icon blender active">
            🔥
            <div className="server-notification">12</div>
          </div>
          <div className="server-separator"></div>
          <div className="server-icon" style={{background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'}}>
            🎮
            <div className="server-notification">7</div>
          </div>
          <div className="server-separator"></div>
          <div className="server-icon" style={{background: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)'}}>
            💬
            <div className="server-notification">2</div>
          </div>
        </div>

        {/* Left Sidebar - Channels */}
        <div className="channels-sidebar">
          <div className="server-header">
            <div className="server-name">{serverName}</div>
            <div className="server-dropdown">▼</div>
          </div>
          
          <div className="channels-section">
            <div className="channel-category">Text Channels</div>
            {channels.filter(c => c.type === 'text').map((channel) => (
              <div
                key={channel.id}
                className={`channel-item ${selectedChannelId === channel.id ? 'selected' : ''}`}
                onClick={() => setSelectedChannelId(channel.id)}
              >
                <div className="channel-icon">#</div>
                <div className="channel-name">{channel.name}</div>
              </div>
            ))}
            
            <div className="channel-category">Voice Channels</div>
            {channels.filter(c => c.type === 'voice').map((channel) => (
              <div
                key={channel.id}
                className={`channel-item voice-channel ${selectedChannelId === channel.id ? 'selected' : ''}`}
                onClick={() => setSelectedChannelId(channel.id)}
              >
                <div className="channel-icon">🔊</div>
                <div className="channel-name">{channel.name}</div>
                <div className="voice-channel-controls">
                  <button 
                    className="voice-join-btn" 
                    title="Join Voice"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleVoiceChannelJoin(channel.id);
                    }}
                  >
                    🎤
                  </button>
                  <div className="voice-users-count">2/10</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Main Chat Area */}
        <div className="server-chat-area">
          <div className="server-chat-header">
            <div className="channel-header-info">
              <div className="channel-hash">#</div>
              <div className="channel-title">
                {channels.find(c => c.id === selectedChannelId)?.name || 'general'}
              </div>
            </div>
          </div>
          
          <div className="server-messages-area">
            {currentMessages.map((message) => (
              <div key={message.id} className="server-message">
                <div 
                  className="server-message-avatar"
                  style={{backgroundImage: `url(${message.avatar})`}}
                />
                <div className="server-message-content">
                  <div className="server-message-header">
                    <span className="server-message-author">{message.author}</span>
                    <span className="server-message-time">{message.time}</span>
                  </div>
                  <div className="server-message-text">{message.text}</div>
                </div>
              </div>
            ))}
          </div>
          
          <div className="server-message-input-area">
            <div className="server-message-input-container">
              <input 
                type="text" 
                className="server-message-input"
                placeholder={`Message #${channels.find(c => c.id === selectedChannelId)?.name || 'general'}`}
                value={messageInput}
                onChange={(e) => setMessageInput(e.target.value)}
                onKeyPress={handleKeyPress}
              />
              <div className="server-input-actions">
                <button className="server-input-btn">📎</button>
                <button className="server-input-btn">😊</button>
                <button 
                  className="server-input-btn server-send-btn"
                  onClick={handleSendMessage}
                >
                  ➤
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Members Sidebar */}
        <div className="members-sidebar">
          <div className="members-header">
            <div className="members-title">Members — {members.length}</div>
          </div>
          
          <div className="members-list">
            {members.map((member) => (
              <div key={member.id} className="member-item">
                <div 
                  className="member-avatar"
                  style={{backgroundImage: `url(${member.avatar})`}}
                >
                  <div className={`member-status-dot ${member.status.toLowerCase()}`} />
                </div>
                <div className="member-info">
                  <div className="member-name">{member.name}</div>
                  <div className="member-role">{member.role}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
