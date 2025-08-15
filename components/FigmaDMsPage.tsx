'use client';

import React, { useState } from 'react';
import FigmaServerPage from './FigmaServerPage';

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
  const [currentView, setCurrentView] = useState<'dms' | 'server'>('dms');
  const [selectedServer, setSelectedServer] = useState<string>('bonfire pakistan');

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

  // Show server view if selected
  if (currentView === 'server') {
    return <FigmaServerPage onBackToDMs={() => setCurrentView('dms')} serverName={selectedServer} />;
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
          background-size: cover;
          background-position: center;
          cursor: pointer;
          transition: all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
          position: relative;
          box-shadow: 
            0 4px 20px rgba(0, 0, 0, 0.6),
            0 0 0 2px rgba(255, 255, 255, 0.1);
          border: 2px solid transparent;
          flex-shrink: 0;
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

        .online-dot {
          position: absolute;
          bottom: -2px;
          right: -2px;
          width: 14px;
          height: 14px;
          background: linear-gradient(135deg, #43e97b 0%, #38f9d7 100%);
          border: 3px solid rgba(0, 0, 0, 0.8);
          border-radius: 50%;
          box-shadow: 0 0 10px rgba(67, 233, 123, 0.6);
          animation: heartbeat 2s ease-in-out infinite;
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
          <div className="server-icon github">
            ⚡
            <div className="server-notification">3</div>
          </div>
          <div className="server-separator"></div>
          <div 
            className="server-icon blender active"
            onClick={() => handleServerClick('The Club // Pakistan')}
          >
            <div className="server-notification">12</div>
          </div>
          <div 
            className="server-icon coinbase"
            onClick={() => handleServerClick('Crypto Trading')}
          >
            <div className="server-notification">5</div>
          </div>
          <div 
            className="server-icon instagram"
            onClick={() => handleServerClick('Instagram Creators')}
          ></div>
          <div 
            className="server-icon vscode"
            onClick={() => handleServerClick('VS Code Developers')}
          >
            <div className="server-notification">2</div>
          </div>
          <div 
            className="server-icon github-desktop"
            onClick={() => handleServerClick('GitHub Community')}
          ></div>
          <div 
            className="server-icon nova"
            onClick={() => handleServerClick('Nova Users')}
          >
            <div className="server-notification">7</div>
          </div>
          <div 
            className="server-icon google-chrome"
            onClick={() => handleServerClick('Chrome Extensions')}
          ></div>
          <div 
            className="server-icon superstar"
            onClick={() => handleServerClick('Superstar Gaming')}
          >
            <div className="server-notification">99+</div>
          </div>
          <div 
            className="server-icon microsoft"
            onClick={() => handleServerClick('Microsoft Office')}
          ></div>
          <div 
            className="server-icon youtube"
            onClick={() => handleServerClick('YouTube Creators')}
          >
            <div className="server-notification">1</div>
          </div>
        </div>

        {/* Left Sidebar - Enhanced DMs */}
        <div className="left-sidebar">
          <div className="sidebar-header">
            <div className="sidebar-title">Messages</div>
            <input 
              type="text" 
              className="search-input" 
              placeholder="Search conversations..."
            />
          </div>

          <div className="quick-actions">
            <button className="quick-action-btn active">All</button>
            <button className="quick-action-btn">Unread</button>
            <button className="quick-action-btn">Priority</button>
          </div>
          
          <div className="user-list">
            <div className="section-header">
              <span>Recent</span>
              <span className="section-count">4</span>
            </div>
            {users.slice(0, 4).map((user, index) => (
              <div
                key={user.id}
                className={`user-item ${selectedUserId === user.id ? 'selected' : ''} ${
                  index === 0 ? 'has-unread priority-high' : ''
                } ${index === 1 ? 'typing' : ''} ${index === 2 ? 'priority-medium' : ''}`}
                onClick={() => setSelectedUserId(user.id)}
              >
                <div className="priority-indicator"></div>
                <div className="activity-indicator"></div>
                <div 
                  className="user-avatar"
                  style={{backgroundImage: `url(${user.avatar})`}}
                >
                  {user.online && <div className="online-dot" />}
                </div>
                <div className="user-info">
                  <div className="user-name">{user.name}</div>
                  {user.status && <div className="user-status">{user.status}</div>}
                  <div className="user-preview">
                    {index === 0 ? "Hey, are you free for a call?" : 
                     index === 1 ? "typing..." :
                     index === 2 ? "Thanks for the help earlier!" :
                     "Sent you some files"}
                  </div>
                </div>
              </div>
            ))}

            <div className="section-header">
              <span>Others</span>
              <span className="section-count">{users.length - 4}</span>
            </div>
            {users.slice(4).map((user) => (
              <div
                key={user.id}
                className={`user-item ${selectedUserId === user.id ? 'selected' : ''}`}
                onClick={() => setSelectedUserId(user.id)}
              >
                <div className="priority-indicator"></div>
                <div className="activity-indicator"></div>
                <div 
                  className="user-avatar"
                  style={{backgroundImage: `url(${user.avatar})`}}
                >
                  {user.online && <div className="online-dot" />}
                </div>
                <div className="user-info">
                  <div className="user-name">{user.name}</div>
                  {user.status && <div className="user-status">{user.status}</div>}
                  <div className="user-preview">Last seen recently</div>
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
            {currentMessages.map((message, index) => (
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
                  
                  {index < 3 && (
                    <div className="message-reactions">
                      <button className="reaction-btn">👍 2</button>
                      <button className="reaction-btn">❤️ 1</button>
                    </div>
                  )}
                  
                  <div className="message-meta">
                    <div className={`read-receipt ${index < 2 ? 'read' : index < 5 ? 'delivered' : ''}`}>
                      {index < 2 ? '✓✓ Read' : index < 5 ? '✓ Delivered' : '○ Sending...'}
                    </div>
                  </div>
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