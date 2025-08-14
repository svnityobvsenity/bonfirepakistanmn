'use client';

import React, { useState } from 'react';
import { Inter } from 'next/font/google';

const inter = Inter({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700'],
});

// Mock data structures
const users = [
  { id: 1, avatar: 'D', name: 'daFoxy', status: 'Playing Blender', selected: true },
  { id: 2, avatar: 'J', name: 'james', status: 'Playing Procrast', selected: false },
  { id: 3, avatar: 'E', name: 'Ekmand', status: '', selected: false },
  { id: 4, avatar: 'S', name: 'Sticks', status: '', selected: false },
  { id: 5, avatar: 'F', name: 'FranzaGeek', status: 'Playing Powerpoi', selected: false },
  { id: 6, avatar: 'M', name: "Markella's", status: 'Playing MTG Aren', selected: false },
  { id: 7, avatar: 'A', name: 'AY-Plays', status: '', selected: false },
  { id: 8, avatar: 'L', name: 'LemonTiger', status: '', selected: false },
  { id: 9, avatar: 'N', name: 'NRD', status: '', selected: false },
];

const messages = [
  { id: 1, avatar: 'D', author: 'daFoxy', time: 'Today at 9:41PM', text: 'I saw this really cool Discord clone tutorial' },
  { id: 2, avatar: 'S', author: 'Concept Central', time: 'Today at 9:41PM', text: 'Sure thing! Want to collaborate on it?' },
  { id: 3, avatar: 'D', author: 'daFoxy', time: 'Today at 9:41PM', text: "oOoOOoo what's the tech stack?" },
  { id: 4, avatar: 'S', author: 'Concept Central', time: 'Today at 9:41PM', text: "It's this new Discord interface design I found" },
  { id: 5, avatar: 'D', author: 'daFoxy', time: 'Today at 9:41PM', text: 'No, how does it work?' },
  { id: 6, avatar: 'S', author: 'Concept Central', time: 'Today at 9:44 PM', text: "Just paste a YouTube link and it'll automatically embed the video with a nice preview" },
  { id: 7, avatar: 'D', author: 'daFoxy', time: 'Today at 9:41PM', text: "Woah! I'll start working on the frontend" },
  { id: 8, avatar: 'S', author: 'Concept Central', time: 'Today at 9:44 PM', text: "Cool, can't wait to see what you build!" },
  { id: 9, avatar: 'D', author: 'daFoxy', time: 'Today at 9:41PM', text: 'Awesome, starting now!' },
  { id: 10, avatar: 'C', author: 'Concept Central', time: 'Today at 9:44 PM', text: 'Joined.' },
];

export default function DiscordInterface() {
  const [selectedUserId, setSelectedUserId] = useState(1);
  const [messageInput, setMessageInput] = useState('');
  const [currentMessages, setCurrentMessages] = useState(messages);

  const handleSendMessage = () => {
    if (messageInput.trim()) {
      const newMessage = {
        id: currentMessages.length + 1,
        avatar: 'K',
        author: 'Kaif',
        time: 'Today at ' + new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'}),
        text: messageInput.trim()
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
    <div className={inter.className}>
      <style jsx global>{`
        * {
          margin: 0;
          padding: 0;
          box-sizing: border-box;
        }

        body {
          font-family: 'Inter', sans-serif;
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
          background: #1a1a1a;
        }

        ::-webkit-scrollbar-thumb {
          background: #333;
          border-radius: 4px;
        }

        ::-webkit-scrollbar-thumb:hover {
          background: #555;
        }
      `}</style>
      
      <style jsx>{`
        .container {
          display: flex;
          height: 100vh;
          width: 100vw;
          min-width: 800px;
          position: relative;
        }

        /* Sidebar */
        .sidebar {
          min-width: 236px;
          width: 236px;
          background: #000000;
          border-right: 1px solid #1A1A1A;
          display: flex;
          flex-direction: column;
          height: 100%;
        }

        @media (max-width: 1024px) {
          .sidebar {
            min-width: 220px;
            width: 220px;
          }
        }
        
        @media (max-width: 768px) {
          .sidebar {
            min-width: 200px;
            width: 200px;
          }
        }

        .sidebar-header {
          padding: 15px;
          border-bottom: 1px solid #1A1A1A;
        }

        .pinned-messages {
          display: flex;
          align-items: center;
          color: #FFFFFF;
          font-size: 9.1px;
          font-weight: 600;
          margin-bottom: 10px;
        }

        .search-box {
          background: linear-gradient(90deg, #202020 0%, #090909 100%);
          border: 1px solid #0C0C0C;
          border-radius: 6px;
          padding: 8px 12px;
          margin-bottom: 10px;
        }

        .search-box input {
          background: none;
          border: none;
          color: #BDBDBD;
          font-size: 9.3px;
          outline: none;
          width: 100%;
        }

        .search-box input::placeholder {
          color: #BDBDBD;
        }

        .friends-section {
          background: linear-gradient(90deg, #202020 0%, #090909 100%);
          border: 1px solid #111111;
          border-radius: 6px;
          padding: 8px 12px;
          display: flex;
          align-items: center;
          color: #696969;
          font-size: 9.5px;
        }

        .user-list {
          flex: 1;
          overflow-y: auto;
          padding: 15px 0;
        }

        .user-item {
          display: flex;
          align-items: center;
          padding: 8px 15px;
          cursor: pointer;
          transition: background 0.2s;
        }

        .user-item:hover {
          background: rgba(255, 255, 255, 0.05);
        }

        .user-item.selected {
          background: linear-gradient(90deg, #202020 0%, #090909 100%);
          border-radius: 6px;
          margin: 0 10px;
        }

        .user-avatar {
          width: 26px;
          height: 26px;
          border-radius: 50%;
          background: #333;
          margin-right: 12px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 10px;
          color: #fff;
        }

        .user-info {
          flex: 1;
        }

        .user-name {
          font-size: 11.5px;
          color: #FFFFFF;
          margin-bottom: 2px;
        }

        .user-status {
          font-size: 7px;
          color: #333333;
        }

        .direct-messages {
          padding: 12px 15px;
          color: #FFFFFF;
          font-size: 9.4px;
          font-weight: 400;
          border-top: 1px solid #1A1A1A;
        }

        /* Main Chat Area */
        .main-content {
          flex: 1;
          display: flex;
          flex-direction: column;
          background: #000000;
        }

        .top-header {
          height: 79px;
          background: linear-gradient(93.68deg, #000000 16.57%, #2F2F2F 156.41%);
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 0 20px;
        }

        .user-avatars {
          display: flex;
          gap: 8px;
        }

        .avatar {
          width: 44px;
          height: 44px;
          border-radius: 22px;
          background: #333;
        }

        .user-profile {
          display: flex;
          align-items: center;
          background: rgba(0, 0, 0, 0.8);
          backdrop-filter: blur(3.25px);
          border-radius: 11px 27px 27px 11px;
          padding: 8px;
          box-shadow: inset 0px 0px 15.8px #181818;
        }

        .profile-info {
          margin-right: 12px;
        }

        .profile-name {
          font-size: 8px;
          font-weight: 600;
          color: #FFFFFF;
        }

        .profile-tag {
          font-size: 4px;
          color: #6B6B6B;
        }

        .profile-avatar {
          width: 32px;
          height: 32px;
          border-radius: 50%;
          background: #333;
        }

        .chat-container {
          flex: 1;
          background: rgba(0, 0, 0, 0.996078);
          border-radius: 141px 99px 64px 151px;
          margin: 8px 11px;
          display: flex;
          flex-direction: column;
          overflow: hidden;
          min-height: 0;
        }

        @media (max-width: 1400px) {
          .chat-container {
            border-radius: 50px 30px 20px 50px;
            margin: 8px;
          }
        }

        @media (max-width: 1024px) {
          .chat-container {
            border-radius: 25px 15px 10px 25px;
            margin: 6px;
          }
        }

        @media (max-width: 768px) {
          .chat-container {
            border-radius: 15px 8px 5px 15px;
            margin: 4px;
          }
        }

        .chat-messages {
          flex: 1;
          padding: 20px;
          overflow-y: auto;
          display: flex;
          flex-direction: column;
          gap: 15px;
        }

        .message {
          display: flex;
          align-items: flex-start;
          gap: 10px;
        }

        .message-avatar {
          width: 25px;
          height: 25px;
          border-radius: 50%;
          background: #333;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 10px;
          color: #fff;
          flex-shrink: 0;
        }

        .message-content {
          flex: 1;
        }

        .message-header {
          display: flex;
          align-items: center;
          gap: 8px;
          margin-bottom: 2px;
        }

        .message-author {
          font-size: 8.3px;
          font-weight: 400;
          color: #FFFFFF;
        }

        .message-time {
          font-size: 7px;
          color: #4E4E4E;
        }

        .message-text {
          font-size: 7.6px;
          color: #FFFFFF;
          line-height: 1.2;
        }

        .separator {
          height: 3px;
          background: #040404;
          margin: 10px 0;
        }

        .typing-indicator {
          padding: 15px 20px;
          display: flex;
          align-items: center;
          gap: 8px;
          border-top: 1px solid #1A1A1A;
        }

        .typing-avatar {
          width: 25px;
          height: 25px;
          border-radius: 50%;
          background: #333;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 10px;
          color: #fff;
        }

        .typing-text {
          font-size: 15px;
          font-weight: 700;
          color: #959595;
        }

        .message-input {
          background: linear-gradient(90deg, #090909 0%, #202020 100%);
          border-radius: 4px 7px 4px 4px;
          margin: 7px 11px;
          padding: 8px 15px;
          display: flex;
          align-items: center;
          gap: 12px;
        }

        .message-input input {
          flex: 1;
          background: none;
          border: none;
          color: #FFFFFF;
          font-size: 9.4px;
          outline: none;
        }

        .message-input input::placeholder {
          color: #6B6B6B;
        }

        .input-icon {
          width: 17px;
          height: 17px;
          background: #444;
          border-radius: 3px;
        }
      `}</style>
      
      <div className="container">
        {/* Sidebar */}
        <div className="sidebar">
          <div className="sidebar-header">
            <div className="pinned-messages">📌 Pinned Messages</div>
            <div className="search-box">
              <input type="text" placeholder="Inbox" />
            </div>
            <div className="friends-section">
              👥 Friends
            </div>
          </div>
          
          <div className="user-list">
            {users.map((user) => (
              <div
                key={user.id}
                className={`user-item ${selectedUserId === user.id ? 'selected' : ''}`}
                onClick={() => setSelectedUserId(user.id)}
              >
                <div className="user-avatar">{user.avatar}</div>
                <div className="user-info">
                  <div className="user-name">{user.name}</div>
                  {user.status && <div className="user-status">{user.status}</div>}
                </div>
              </div>
            ))}
          </div>
          
          <div className="direct-messages">
            📧 Direct Messages
          </div>
        </div>

        {/* Main Content */}
        <div className="main-content">
          <div className="top-header">
            <div className="user-avatars">
              {Array.from({ length: 14 }, (_, i) => (
                <div key={i} className="avatar"></div>
              ))}
            </div>
            
            <div className="user-profile">
              <div className="profile-info">
                <div className="profile-name">Kaif</div>
                <div className="profile-tag">Kaif#001</div>
              </div>
              <div className="profile-avatar"></div>
            </div>
          </div>
          
          <div className="chat-container">
            <div className="chat-messages">
              {currentMessages.map((message) => (
                <div key={message.id} className="message">
                  <div className="message-avatar">{message.avatar}</div>
                  <div className="message-content">
                    <div className="message-header">
                      <span className="message-author">{message.author}</span>
                      <span className="message-time">{message.time}</span>
                    </div>
                    <div className="message-text">{message.text}</div>
                  </div>
                </div>
              ))}
              
              <div className="separator"></div>
              
              <div className="typing-indicator">
                <div className="typing-avatar">D</div>
                <div className="typing-text">daFoxy is typing...</div>
              </div>
            </div>
            
            <div className="message-input">
              <div className="input-icon"></div>
              <div className="input-icon"></div>
              <input 
                type="text" 
                placeholder="Message daFoxy" 
                value={messageInput}
                onChange={(e) => setMessageInput(e.target.value)}
                onKeyPress={handleKeyPress}
              />
              <div className="input-icon" onClick={handleSendMessage} style={{cursor: 'pointer'}}></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}