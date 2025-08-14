'use client';

import React, { useState } from 'react';

// Data based on your Figma design
const users = [
  { id: 1, name: 'daFoxy', status: 'Playing Blender', avatar: '/avatars/dafoxy.jpg', selected: true, online: true },
  { id: 2, name: 'james', status: 'Playing Procrast', avatar: '/avatars/james.jpg', selected: false, online: true },
  { id: 3, name: 'Ekmand', status: '', avatar: '/avatars/ekmand.jpg', selected: false, online: false },
  { id: 4, name: 'Sticks', status: '', avatar: '/avatars/sticks.jpg', selected: false, online: false },
  { id: 5, name: 'FranzaGeek', status: 'Playing Powerpoi', avatar: '/avatars/franzageek.jpg', selected: false, online: true },
  { id: 6, name: "Markella's", status: 'Playing MTG Aren', avatar: '/avatars/markellas.jpg', selected: false, online: true },
  { id: 7, name: 'AY-Plays', status: '', avatar: '/avatars/ayplays.jpg', selected: false, online: false },
  { id: 8, name: 'LemonTiger', status: '', avatar: '/avatars/lemontiger.jpg', selected: false, online: false },
  { id: 9, name: 'NRD', status: '', avatar: '/avatars/nrd.jpg', selected: false, online: false },
];

const messages = [
  { id: 1, author: 'daFoxy', time: 'Today at 9:41PM', text: 'I saw this really cool tutorial', avatar: '/avatars/dafoxy.jpg' },
  { id: 2, author: 'Kalf', time: 'Today at 9:41PM', text: 'Sure thing! Want to start a Watch Party?', avatar: '/avatars/kalf.jpg' },
  { id: 3, author: 'daFoxy', time: 'Today at 9:41PM', text: "oOoOOoo what's that?", avatar: '/avatars/dafoxy.jpg' },
  { id: 4, author: 'Kalf', time: 'Today at 9:41PM', text: "It's this new feature. Have you heard of it?", avatar: '/avatars/kalf.jpg' },
  { id: 5, author: 'daFoxy', time: 'Today at 9:41PM', text: 'No, how does it work?', avatar: '/avatars/dafoxy.jpg' },
  { id: 6, author: 'Kalf', time: 'Today at 9:44 PM', text: "Just paste a YouTube link into the DM and we can all see you if you want to start a Watch Party!", avatar: '/avatars/kalf.jpg' },
  { id: 7, author: 'daFoxy', time: 'Today at 9:41PM', text: "Woah! I'll start one now!", avatar: '/avatars/dafoxy.jpg' },
  { id: 8, author: 'Kalf', time: 'Today at 9:44 PM', text: "Cool, can't wait to see the video:D", avatar: '/avatars/kalf.jpg' },
  { id: 9, author: 'daFoxy', time: 'Today at 9:41PM', text: 'Awesome, starting now...', avatar: '/avatars/dafoxy.jpg' },
  { id: 10, author: 'Kalf', time: 'Today at 9:44 PM', text: 'Joined.', avatar: '/avatars/kalf.jpg' },
];

export default function FigmaDMsPage() {
  const [selectedUserId, setSelectedUserId] = useState(1);
  const [messageInput, setMessageInput] = useState('');
  const [currentMessages, setCurrentMessages] = useState(messages);

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
          width: 6px;
        }

        ::-webkit-scrollbar-track {
          background: rgba(255, 255, 255, 0.05);
        }

        ::-webkit-scrollbar-thumb {
          background: rgba(255, 255, 255, 0.15);
          border-radius: 3px;
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



        /* Server List - Taskbar Style */
        .server-list {
          position: absolute;
          left: 24px;
          top: 24px;
          width: calc(100vw - 48px);
          height: 60px;
          display: flex;
          flex-direction: row;
          align-items: center;
          gap: 8px;
          padding: 8px 16px;
          background: rgba(0, 0, 0, 0.85);
          backdrop-filter: blur(20px);
          -webkit-backdrop-filter: blur(20px);
          border-radius: 12px;
          border: 1px solid rgba(255, 255, 255, 0.15);
          box-shadow: 0 4px 32px rgba(0, 0, 0, 0.5);
          z-index: 50;
        }

        .server-icon {
          width: 44px;
          height: 44px;
          border-radius: 8px;
          background-size: cover;
          background-position: center;
          cursor: pointer;
          transition: all 0.2s ease;
          position: relative;
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.4);
          border: 1px solid rgba(255, 255, 255, 0.1);
          flex-shrink: 0;
        }

        .server-icon:hover {
          transform: translateY(-1px);
          box-shadow: 0 4px 16px rgba(0, 0, 0, 0.5);
          border-color: rgba(255, 255, 255, 0.2);
        }

        /* Taskbar App Icons - Exact Match */
        .server-icon.github {
          background: #24292f;
          color: white;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 24px;
        }

        .server-icon.blender {
          background: linear-gradient(135deg, #E87D0D 0%, #F5792A 100%);
        }

        .server-icon.coinbase {
          background: linear-gradient(135deg, #0052FF 0%, #0041CC 100%);
        }

        .server-icon.instagram {
          background: linear-gradient(135deg, #E4405F 0%, #833AB4 50%, #F77737 100%);
        }

        .server-icon.vscode {
          background: linear-gradient(135deg, #007ACC 0%, #005A9E 100%);
        }

        .server-icon.github-desktop {
          background: linear-gradient(135deg, #6f42c1 0%, #5A2D91 100%);
        }

        .server-icon.nova {
          background: linear-gradient(135deg, #00C4A7 0%, #00A085 100%);
        }

        .server-icon.google-chrome {
          background: linear-gradient(135deg, #4285F4 0%, #34A853 25%, #FBBC05 50%, #EA4335 100%);
        }

        .server-icon.superstar {
          background: linear-gradient(135deg, #FFD700 0%, #FFA500 100%);
        }

        .server-icon.microsoft {
          background: linear-gradient(135deg, #00BCF2 0%, #0078D4 100%);
        }

        .server-icon.youtube {
          background: linear-gradient(135deg, #FF0000 0%, #CC0000 100%);
        }

        .server-separator {
          width: 2px;
          height: 32px;
          background: linear-gradient(180deg, transparent 0%, rgba(255, 255, 255, 0.3) 50%, transparent 100%);
          border-radius: 1px;
          margin: 0 4px;
        }

        /* Left Sidebar - DMs */
        .left-sidebar {
          position: absolute;
          left: 24px;
          top: 100px;
          width: 280px;
          height: calc(100vh - 124px);
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
          padding: 16px 20px 8px 20px;
          background: linear-gradient(135deg, rgba(102, 126, 234, 0.1) 0%, rgba(118, 75, 162, 0.1) 100%);
        }

        .sidebar-title {
          font-size: 16px;
          font-weight: 600;
          color: #ffffff;
          margin-bottom: 8px;
          text-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
        }

        .search-input {
          width: 100%;
          padding: 12px 16px;
          background: rgba(255, 255, 255, 0.1);
          border: 1px solid rgba(255, 255, 255, 0.2);
          border-radius: 12px;
          color: #ffffff;
          font-size: 14px;
          outline: none;
          transition: all 0.3s ease;
        }

        .search-input:focus {
          background: rgba(255, 255, 255, 0.15);
          border-color: rgba(102, 126, 234, 0.6);
          box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.2);
        }

        .search-input::placeholder {
          color: rgba(255, 255, 255, 0.5);
        }

        .user-list {
          flex: 1;
          overflow-y: auto;
          padding: 8px;
        }

        .user-item {
          display: flex;
          align-items: center;
          padding: 12px 16px;
          margin: 4px 0;
          border-radius: 12px;
          cursor: pointer;
          transition: all 0.3s ease;
          position: relative;
        }

        .user-item:hover {
          background: rgba(255, 255, 255, 0.1);
          transform: translateX(4px);
        }

        .user-item.selected {
          background: linear-gradient(90deg, rgba(102, 126, 234, 0.3) 0%, rgba(118, 75, 162, 0.3) 100%);
          border-left: 4px solid #667eea;
        }

        .user-avatar {
          width: 40px;
          height: 40px;
          border-radius: 50%;
          background-size: cover;
          background-position: center;
          margin-right: 12px;
          position: relative;
          border: 2px solid rgba(255, 255, 255, 0.2);
        }

        .online-dot {
          position: absolute;
          bottom: -2px;
          right: -2px;
          width: 12px;
          height: 12px;
          background: linear-gradient(135deg, #43e97b 0%, #38f9d7 100%);
          border: 2px solid rgba(0, 0, 0, 0.8);
          border-radius: 50%;
          box-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
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

        /* Main Chat Area */
        .chat-area {
          position: absolute;
          left: 328px;
          top: 100px;
          right: 24px;
          height: calc(100vh - 124px);
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
          height: 70px;
          padding: 0 24px;
          display: flex;
          align-items: center;
          border-bottom: 1px solid rgba(255, 255, 255, 0.1);
          background: linear-gradient(135deg, rgba(102, 126, 234, 0.1) 0%, rgba(118, 75, 162, 0.1) 100%);
        }

        .chat-user-name {
          font-size: 20px;
          font-weight: 600;
          color: #ffffff;
          text-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
        }

        .chat-status {
          margin-left: 12px;
          width: 8px;
          height: 8px;
          background: linear-gradient(135deg, #43e97b 0%, #38f9d7 100%);
          border-radius: 50%;
          box-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
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
          padding: 12px 16px;
          border-radius: 16px;
          transition: all 0.3s ease;
        }

        .message:hover {
          background: rgba(255, 255, 255, 0.05);
        }

        .message-avatar {
          width: 36px;
          height: 36px;
          border-radius: 50%;
          background-size: cover;
          background-position: center;
          flex-shrink: 0;
          border: 2px solid rgba(255, 255, 255, 0.1);
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
          line-height: 1.5;
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
          background: rgba(255, 255, 255, 0.1);
          border: 1px solid rgba(255, 255, 255, 0.2);
          border-radius: 16px;
          padding: 12px 16px;
          transition: all 0.3s ease;
        }

        .message-input-container:focus-within {
          background: rgba(255, 255, 255, 0.15);
          border-color: rgba(102, 126, 234, 0.6);
          box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.2);
        }

        .message-input {
          flex: 1;
          background: none;
          border: none;
          color: #ffffff;
          font-size: 14px;
          outline: none;
        }

        .message-input::placeholder {
          color: rgba(255, 255, 255, 0.5);
        }

        .input-actions {
          display: flex;
          gap: 8px;
        }

        .input-btn {
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

        .input-btn:hover {
          background: rgba(102, 126, 234, 0.5);
          transform: translateY(-1px);
        }

        .send-btn {
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          border-color: transparent;
        }

        .send-btn:hover {
          background: linear-gradient(135deg, #5a6fd8 0%, #6a4190 100%);
        }



        /* Responsive Design */
        @media (max-width: 900px) {
          .server-list {
            width: 240px;
          }
          .left-sidebar {
            width: 240px;
          }
          .chat-area {
            left: 284px;
            right: 16px;
          }
        }

        @media (max-width: 768px) {
          .server-list {
            width: 200px;
            left: 16px;
          }
          .left-sidebar {
            left: 16px;
            width: 200px;
            top: 92px;
          }
          .chat-area {
            left: 232px;
            right: 16px;
          }
        }
      `}</style>
      
      <div className="figma-main">
        <div className="background"></div>
        <div className="blur-overlay"></div>
        
        {/* Server List - Taskbar Style */}
        <div className="server-list">
          <div className="server-icon github">⚡</div>
          <div className="server-separator"></div>
          <div className="server-icon blender"></div>
          <div className="server-icon coinbase"></div>
          <div className="server-icon instagram"></div>
          <div className="server-icon vscode"></div>
          <div className="server-icon github-desktop"></div>
          <div className="server-icon nova"></div>
          <div className="server-icon google-chrome"></div>
          <div className="server-icon superstar"></div>
          <div className="server-icon microsoft"></div>
          <div className="server-icon youtube"></div>
        </div>

        {/* Left Sidebar - DMs */}
        <div className="left-sidebar">
          <div className="sidebar-header">
            <div className="sidebar-title">Direct Messages</div>
            <input 
              type="text" 
              className="search-input" 
              placeholder="Search conversations..."
            />
          </div>
          
          <div className="user-list">
            {users.map((user) => (
              <div
                key={user.id}
                className={`user-item ${selectedUserId === user.id ? 'selected' : ''}`}
                onClick={() => setSelectedUserId(user.id)}
              >
                <div 
                  className="user-avatar"
                  style={{backgroundImage: `url(${user.avatar})`}}
                >
                  {user.online && <div className="online-dot" />}
                </div>
                <div className="user-info">
                  <div className="user-name">{user.name}</div>
                  {user.status && <div className="user-status">{user.status}</div>}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Main Chat Area */}
        <div className="chat-area">
          <div className="chat-header">
            <div className="chat-user-name">
              {users.find(u => u.id === selectedUserId)?.name || 'Select a user'}
            </div>
            <div className="chat-status"></div>
          </div>
          
          <div className="messages-area">
            {currentMessages.map((message) => (
              <div key={message.id} className="message">
                <div 
                  className="message-avatar"
                  style={{backgroundImage: `url(${message.avatar})`}}
                />
                <div className="message-content">
                  <div className="message-header">
                    <span className="message-author">{message.author}</span>
                    <span className="message-time">{message.time}</span>
                  </div>
                  <div className="message-text">{message.text}</div>
                </div>
              </div>
            ))}
          </div>
          
          <div className="message-input-area">
            <div className="message-input-container">
              <input 
                type="text" 
                className="message-input"
                placeholder={`Message ${users.find(u => u.id === selectedUserId)?.name || 'user'}`}
                value={messageInput}
                onChange={(e) => setMessageInput(e.target.value)}
                onKeyPress={handleKeyPress}
              />
              <div className="input-actions">
                <button className="input-btn">📎</button>
                <button className="input-btn">😊</button>
                <button 
                  className="input-btn send-btn"
                  onClick={handleSendMessage}
                >
                  ➤
                </button>
              </div>
            </div>
          </div>
        </div>


      </div>
    </div>
  );
}