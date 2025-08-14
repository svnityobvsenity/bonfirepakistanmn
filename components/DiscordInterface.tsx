'use client';

import React, { useState } from 'react';

// Mock data structures based on Figma design
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
  { id: 1, author: 'daFoxy', time: 'Today at 9:41PM', text: 'I saw this really cool Discord clone tutorial', avatar: '/avatars/dafoxy.jpg' },
  { id: 2, author: 'Concept Central', time: 'Today at 9:41PM', text: 'Sure thing! Want to collaborate on it?', avatar: '/avatars/concept.jpg' },
  { id: 3, author: 'daFoxy', time: 'Today at 9:41PM', text: "oOoOOoo what's the tech stack?", avatar: '/avatars/dafoxy.jpg' },
  { id: 4, author: 'Concept Central', time: 'Today at 9:41PM', text: "It's this new Discord interface design I found", avatar: '/avatars/concept.jpg' },
  { id: 5, author: 'daFoxy', time: 'Today at 9:41PM', text: 'No, how does it work?', avatar: '/avatars/dafoxy.jpg' },
  { id: 6, author: 'Concept Central', time: 'Today at 9:44 PM', text: "Just paste a YouTube link and it'll automatically embed the video with a nice preview", avatar: '/avatars/concept.jpg' },
  { id: 7, author: 'daFoxy', time: 'Today at 9:41PM', text: "Woah! I'll start working on the frontend", avatar: '/avatars/dafoxy.jpg' },
  { id: 8, author: 'Concept Central', time: 'Today at 9:44 PM', text: "Cool, can't wait to see what you build!", avatar: '/avatars/concept.jpg' },
  { id: 9, author: 'daFoxy', time: 'Today at 9:41PM', text: 'Awesome, starting now!', avatar: '/avatars/dafoxy.jpg' },
  { id: 10, author: 'Concept Central', time: 'Today at 9:44 PM', text: 'Joined.', avatar: '/avatars/concept.jpg' },
];

const serverIcons = [
  { id: 1, name: 'Club', icon: '/servers/club.jpg', active: false },
  { id: 2, name: 'Gaming', icon: '/servers/gaming.jpg', active: false },
  { id: 3, name: 'Music', icon: '/servers/music.jpg', active: false },
];

const navigationIcons = {
  dms: '/servers/dms.jpg',
  discovery: '/servers/discovery.jpg',
  profile: '/servers/profile.jpg'
};

export default function DiscordInterface() {
  const [selectedUserId, setSelectedUserId] = useState(1);
  const [messageInput, setMessageInput] = useState('');
  const [currentMessages, setCurrentMessages] = useState(messages);
  const [activeView, setActiveView] = useState('dms'); // 'dms', 'server', 'discovery', 'profile'

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
    setActiveView('server');
    console.log('Navigating to server:', serverName);
  };

  const handleDiscoveryClick = () => {
    setActiveView('discovery');
    console.log('Navigating to discovery');
  };

  const handleProfileClick = () => {
    setActiveView('profile');
    console.log('Navigating to profile');
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
          font-family: 'SF Pro Display', -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', sans-serif;
          background: #000000;
          color: #ffffff;
          height: 100vh;
          overflow: hidden;
        }

        /* Scrollbar Styling */
        ::-webkit-scrollbar {
          width: 8px;
        }

        ::-webkit-scrollbar-track {
          background: rgba(0, 0, 0, 0.1);
        }

        ::-webkit-scrollbar-thumb {
          background: rgba(255, 255, 255, 0.2);
          border-radius: 4px;
        }

        ::-webkit-scrollbar-thumb:hover {
          background: rgba(255, 255, 255, 0.3);
        }
      `}</style>
      
      <style jsx>{`
        /* Main Container - Discord Style */
        .main-container {
          position: relative;
          width: 100vw;
          height: 100vh;
          background: #202225;
          overflow: hidden;
        }

        /* Server List (Left Side) */
        .server-list {
          position: absolute;
          left: 0;
          top: 0;
          width: 72px;
          height: 100vh;
          background: #202225;
          display: flex;
          flex-direction: column;
          align-items: center;
          padding: 12px 0;
          z-index: 10;
        }
        
        .server-separator {
          width: 32px;
          height: 2px;
          background: rgba(255, 255, 255, 0.1);
          border-radius: 1px;
          margin: 8px 0;
        }
        
        .server-separator-bottom {
          width: 32px;
          height: 2px;
          background: rgba(255, 255, 255, 0.1);
          border-radius: 1px;
          margin: 8px 0;
          flex-grow: 1;
          max-height: 2px;
        }
        
        .server-spacer {
          flex-grow: 1;
        }

        .server-icon {
          width: 48px;
          height: 48px;
          border-radius: 24px;
          background: #36393f;
          background-size: cover;
          background-position: center;
          cursor: pointer;
          transition: all 0.2s ease;
          position: relative;
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.3);
          margin: 4px 0;
        }

        .server-icon:hover {
          border-radius: 16px;
          transform: translateY(-2px);
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.4);
        }

        .server-icon.active {
          border-radius: 16px;
          box-shadow: 0 0 0 2px #5865f2;
        }

        .server-icon.discovery {
          background: linear-gradient(135deg, #5865f2 0%, #3b82f6 100%);
          background-image: url('/servers/discovery.jpg');
        }

        .server-icon.profile {
          background: linear-gradient(135deg, #10b981 0%, #059669 100%);
          background-image: url('/servers/profile.jpg');
        }
        
        /* Temporary colors for server icons until images are added */
        .server-icon:nth-child(4) { /* First server (Club) */
          background: linear-gradient(135deg, #ff6b6b 0%, #ee5a24 100%);
        }
        
        .server-icon:nth-child(5) { /* Second server (Gaming) */
          background: linear-gradient(135deg, #4834d4 0%, #686de0 100%);
        }
        
        .server-icon:nth-child(6) { /* Third server (Music) */
          background: linear-gradient(135deg, #00d2d3 0%, #01a3a4 100%);
        }

        /* DMs Sidebar */
        .dms-sidebar {
          position: absolute;
          left: 72px;
          top: 0;
          width: 240px;
          height: 100vh;
          background: #2f3136;
          border-right: 1px solid #202225;
          display: flex;
          flex-direction: column;
          z-index: 5;
        }

        @media (max-width: 768px) {
          .dms-sidebar {
            width: 200px;
          }
        }

        /* DMs Header */
        .dms-header {
          padding: 16px;
          border-bottom: 1px solid #202225;
        }

        .nav-buttons {
          display: flex;
          flex-direction: column;
          gap: 2px;
          margin-bottom: 16px;
        }

        .nav-button {
          display: flex;
          align-items: center;
          padding: 8px 12px;
          border-radius: 4px;
          color: #96989d;
          font-size: 14px;
          font-weight: 500;
          cursor: pointer;
          transition: all 0.2s ease;
        }

        .nav-button:hover {
          background: #393c43;
          color: #dcddde;
        }

        .nav-button.active {
          background: #393c43;
          color: #ffffff;
        }

        .nav-button-icon {
          width: 20px;
          height: 20px;
          margin-right: 12px;
          background: currentColor;
          mask-size: contain;
          mask-repeat: no-repeat;
          mask-position: center;
        }

        .friends-icon {
          mask-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='currentColor'%3E%3Cpath d='M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z'/%3E%3C/svg%3E");
        }

        .inbox-icon {
          mask-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='currentColor'%3E%3Cpath d='M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.89 2 2 2h14c1.11 0 2-.9 2-2V5c0-1.1-.89-2-2-2zm-5 14H7v-2h7v2zm3-4H7v-2h10v2zm0-4H7V7h10v2z'/%3E%3C/svg%3E");
        }

        .pinned-icon {
          mask-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='currentColor'%3E%3Cpath d='M16 12V4a1 1 0 0 0-1-1H9a1 1 0 0 0-1 1v8H6a1 1 0 0 0-1 1v1a1 1 0 0 0 1 1h2v5a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1v-5h2a1 1 0 0 0 1-1v-1a1 1 0 0 0-1-1h-2z'/%3E%3C/svg%3E");
        }

        .dms-title {
          font-size: 12px;
          font-weight: 600;
          color: #96989d;
          text-transform: uppercase;
          letter-spacing: 0.5px;
          margin-bottom: 8px;
        }

        /* User List */
        .user-list {
          flex: 1;
          overflow-y: auto;
          padding: 8px 0;
        }

        .user-item {
          display: flex;
          align-items: center;
          padding: 8px 12px;
          margin: 0 8px;
          border-radius: 4px;
          cursor: pointer;
          transition: background 0.2s ease;
          position: relative;
        }

        .user-item:hover {
          background: #393c43;
        }

        .user-item.selected {
          background: #393c43;
        }

        .user-avatar {
          width: 32px;
          height: 32px;
          border-radius: 50%;
          background-size: cover;
          background-position: center;
          margin-right: 12px;
          position: relative;
        }

        .online-indicator {
          position: absolute;
          bottom: -2px;
          right: -2px;
          width: 10px;
          height: 10px;
          background: #3ba55c;
          border: 2px solid #2f3136;
          border-radius: 50%;
        }

        .user-info {
          flex: 1;
        }

        .user-name {
          font-size: 14px;
          font-weight: 500;
          color: #dcddde;
          margin-bottom: 2px;
        }

        .user-status {
          font-size: 12px;
          color: #96989d;
        }

        /* Main Chat Area */
        .chat-area {
          position: absolute;
          left: 312px;
          top: 0;
          right: 0;
          height: 100vh;
          background: #36393f;
          display: flex;
          flex-direction: column;
        }

        @media (max-width: 768px) {
          .chat-area {
            left: 272px;
          }
        }

        /* Chat Header */
        .chat-header {
          height: 48px;
          background: #36393f;
          border-bottom: 1px solid #202225;
          display: flex;
          align-items: center;
          padding: 0 16px;
          box-shadow: 0 1px 0 rgba(4,4,5,0.2), 0 1.5px 0 rgba(6,6,7,0.05), 0 2px 0 rgba(4,4,5,0.05);
        }

        .chat-user-info {
          display: flex;
          align-items: center;
        }

        .chat-user-name {
          font-size: 16px;
          font-weight: 600;
          color: #ffffff;
          display: flex;
          align-items: center;
        }

        .status-dot {
          width: 8px;
          height: 8px;
          background: #3ba55c;
          border-radius: 50%;
          margin-left: 8px;
        }

        /* Messages Container */
        .messages-container {
          flex: 1;
          overflow-y: auto;
          padding: 20px;
          display: flex;
          flex-direction: column;
          gap: 16px;
        }

        .message-group {
          display: flex;
          align-items: flex-start;
          gap: 12px;
        }

        .message-avatar {
          width: 40px;
          height: 40px;
          border-radius: 50%;
          background-image: url('/avatars/default.jpg');
          background-size: cover;
          background-position: center;
          flex-shrink: 0;
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
          color: #ffffff;
        }

        .message-time {
          font-size: 12px;
          color: rgba(255, 255, 255, 0.5);
        }

        .message-text {
          font-size: 14px;
          color: #ffffff;
          line-height: 1.4;
        }

        /* Message Input */
        .message-input-container {
          padding: 20px;
          background: #36393f;
        }

        .message-input {
          background: #40444b;
          border: none;
          border-radius: 8px;
          padding: 12px 16px;
          display: flex;
          align-items: center;
          gap: 12px;
        }

        .message-input input {
          flex: 1;
          background: none;
          border: none;
          color: #dcddde;
          font-size: 14px;
          outline: none;
        }

        .message-input input::placeholder {
          color: #72767d;
        }

        .input-actions {
          display: flex;
          align-items: center;
          gap: 8px;
        }

        .input-button {
          width: 32px;
          height: 32px;
          border-radius: 50%;
          background: rgba(255, 255, 255, 0.1);
          border: none;
          color: #ffffff;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: background 0.2s ease;
        }

        .input-button:hover {
          background: rgba(255, 255, 255, 0.2);
        }

        .attach-btn {
          background-image: url('/icons/attach.svg');
          background-size: 16px;
          background-repeat: no-repeat;
          background-position: center;
        }

        .emoji-btn {
          background-image: url('/icons/emoji.svg');
          background-size: 16px;
          background-repeat: no-repeat;
          background-position: center;
        }

        .send-button {
          background: #5865f2;
          background-image: url('/icons/send.svg');
          background-size: 16px;
          background-repeat: no-repeat;
          background-position: center;
        }

        .send-button:hover {
          background: #4752c4;
        }

        /* Responsive Design */
        @media (max-width: 1024px) {
          .server-list {
            width: 60px;
          }
          .server-icon {
            width: 40px;
            height: 40px;
            border-radius: 20px;
          }
          .dms-sidebar {
            left: 60px;
            width: 220px;
          }
          .chat-area {
            left: 280px;
          }
        }

        @media (max-width: 768px) {
          .server-list {
            width: 50px;
          }
          .server-icon {
            width: 36px;
            height: 36px;
            border-radius: 18px;
          }
          .dms-sidebar {
            left: 50px;
            width: 200px;
          }
          .chat-area {
            left: 250px;
          }
        }
      `}</style>
      
      <div className="main-container">
        {/* Server List (Left Side) */}
        <div className="server-list">
          {/* DMs Icon */}
          <div 
            className={`server-icon ${activeView === 'dms' ? 'active' : ''}`}
            onClick={() => setActiveView('dms')}
            style={{backgroundImage: `url(${navigationIcons.dms})`}}
          />
          
          {/* Separator */}
          <div className="server-separator"></div>
          
          {/* Server Icons */}
          {serverIcons.map((server) => (
            <div
              key={server.id}
              className={`server-icon ${activeView === 'server' ? 'active' : ''}`}
              onClick={() => handleServerClick(server.name)}
              style={{backgroundImage: `url(${server.icon})`}}
            />
          ))}
          
          {/* Spacer to push bottom icons down */}
          <div className="server-spacer"></div>
          
          {/* Discovery Icon */}
          <div 
            className={`server-icon discovery ${activeView === 'discovery' ? 'active' : ''}`}
            onClick={handleDiscoveryClick}
            style={{backgroundImage: `url(${navigationIcons.discovery})`}}
          />
          
          {/* Profile Icon */}
          <div 
            className={`server-icon profile ${activeView === 'profile' ? 'active' : ''}`}
            onClick={handleProfileClick}
            style={{backgroundImage: `url(${navigationIcons.profile})`}}
          />
        </div>

        {/* DMs Sidebar */}
        <div className="dms-sidebar">
          <div className="dms-header">
            <div className="nav-buttons">
              <div className="nav-button">
                <div className="nav-button-icon friends-icon"></div>
                Friends
              </div>
              <div className="nav-button">
                <div className="nav-button-icon inbox-icon"></div>
                Inbox
              </div>
              <div className="nav-button">
                <div className="nav-button-icon pinned-icon"></div>
                Pinned Messages
              </div>
            </div>
            <div className="dms-title">Direct Messages</div>
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
                  {user.online && <div className="online-indicator" />}
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
          {/* Chat Header */}
          <div className="chat-header">
            <div className="chat-user-info">
              <div className="chat-user-name">
                {users.find(u => u.id === selectedUserId)?.name || 'Select a user'}
                <div className="status-dot"></div>
              </div>
            </div>
          </div>
          
          {/* Messages Container */}
          <div className="messages-container">
            {currentMessages.map((message) => (
              <div key={message.id} className="message-group">
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
          
          {/* Message Input */}
          <div className="message-input-container">
            <div className="message-input">
              <input 
                type="text" 
                placeholder={`Message ${users.find(u => u.id === selectedUserId)?.name || 'user'}`}
                value={messageInput}
                onChange={(e) => setMessageInput(e.target.value)}
                onKeyPress={handleKeyPress}
              />
              <div className="input-actions">
                <button className="input-button attach-btn"></button>
                <button className="input-button emoji-btn"></button>
                <button 
                  className="input-button send-button"
                  onClick={handleSendMessage}
                ></button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}