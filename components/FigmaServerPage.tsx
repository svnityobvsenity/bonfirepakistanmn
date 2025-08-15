'use client';

import React, { useState } from 'react';

// Server data based on Figma JSON
const channels = [
  { id: 1, name: 'Main-Chat', type: 'text', selected: true },
  { id: 2, name: 'Media', type: 'text', selected: false },
  { id: 3, name: 'Forum', type: 'text', selected: false },
  { id: 4, name: 'Memes', type: 'text', selected: false },
  { id: 5, name: 'General', type: 'voice', selected: false },
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
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 36px;
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
        /* Frame 1000002743: x: 24, y: 140, width: 280, height: 818 */
        .channels-sidebar {
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
          padding: 8px 20px;
          margin: 2px 8px;
          border-radius: 8px;
          cursor: pointer;
          transition: all 0.2s ease;
          position: relative;
        }

        .channel-item:hover {
          background: rgba(255, 255, 255, 0.1);
        }

        .channel-item.selected {
          background: rgba(102, 126, 234, 0.3);
          border-left: 4px solid #667eea;
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
        }

        /* Main Chat Area */
        /* Frame 1000002747: x: 328, y: 140, width: 944, height: 818 */
        .server-chat-area {
          position: absolute;
          left: 328px;
          top: 140px;
          width: calc(100vw - 592px);
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
        /* Frame 1000002749: x: 1296, y: 140, width: 240, height: 818 */
        .members-sidebar {
          position: absolute;
          right: 24px;
          top: 140px;
          width: 240px;
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

        /* Back Button */
        .back-button {
          position: absolute;
          top: 32px;
          left: 32px;
          width: 40px;
          height: 40px;
          background: rgba(0, 0, 0, 0.8);
          backdrop-filter: blur(20px);
          border: 1px solid rgba(255, 255, 255, 0.2);
          border-radius: 50%;
          color: #ffffff;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: all 0.3s ease;
          z-index: 60;
          font-size: 16px;
          border: none;
        }

        .back-button:hover {
          background: rgba(102, 126, 234, 0.8);
          transform: translateY(-2px);
          box-shadow: 0 4px 20px rgba(102, 126, 234, 0.4);
        }
      `}</style>
      
      <div className="figma-server">
        <div className="server-background"></div>
        <div className="server-blur-overlay"></div>
        
        {/* Back Button */}
        <button className="back-button" onClick={onBackToDMs}>
          ←
        </button>
        
        {/* Server List - Enhanced with Active State */}
        <div className="server-list">
          <div className="server-icon github">
            ⚡
            <div className="server-notification">3</div>
          </div>
          <div className="server-separator"></div>
          <div className="server-icon blender active">
            <div className="server-notification">12</div>
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
                className={`channel-item ${selectedChannelId === channel.id ? 'selected' : ''}`}
                onClick={() => setSelectedChannelId(channel.id)}
              >
                <div className="channel-icon">🔊</div>
                <div className="channel-name">{channel.name}</div>
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
