'use client';

import React, { useState, useRef, useEffect } from 'react';

interface Reaction {
  emoji: string;
  count: number;
  users: string[];
}

interface Message {
  id: number;
  userId: number;
  content: string;
  timestamp: Date;
  reactions: Reaction[];
  mentions: string[];
}

interface Friend {
  id: number;
  name: string;
  username: string;
  status: string;
  avatar: string;
  lastSeen: Date;
  unreadCount: number;
}

export default function DMsPage() {
  const [selectedFriend, setSelectedFriend] = useState(1);
  const [message, setMessage] = useState('');
  const [isMuted, setIsMuted] = useState(false);
  const [isDeafened, setIsDeafened] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 1,
      userId: 1,
      content: 'yo bro whats good',
      timestamp: new Date('2024-01-15T15:42:00'),
      reactions: [{ emoji: '👍', count: 2, users: ['Kaif', 'Ahmed'] }],
      mentions: []
    },
    {
      id: 2,
      userId: 2,
      content: 'nothing much just working on some projects',
      timestamp: new Date('2024-01-15T15:43:00'),
      reactions: [],
      mentions: []
    },
    {
      id: 3,
      userId: 1,
      content: 'Nice! What kind of projects? @Kaif',
      timestamp: new Date('2024-01-15T15:44:00'),
      reactions: [],
      mentions: ['Kaif']
    }
  ]);

  const friends = [
    { 
      id: 1, 
      name: 'daFoxy', 
      username: 'daFoxy#1234',
      status: 'online',
      avatar: 'D',
      lastSeen: new Date(),
      unreadCount: 2
    },
    { 
      id: 2, 
      name: 'Ahmed', 
      username: 'Ahmed#5678',
      status: 'away', 
      avatar: 'A',
      lastSeen: new Date(Date.now() - 300000),
      unreadCount: 0
    },
    { 
      id: 3, 
      name: 'Fatima', 
      username: 'Fatima#9012',
      status: 'dnd', 
      avatar: 'F',
      lastSeen: new Date(Date.now() - 600000),
      unreadCount: 1
    },
    { 
      id: 4, 
      name: 'Ali', 
      username: 'Ali#3456',
      status: 'offline', 
      avatar: 'A',
      lastSeen: new Date(Date.now() - 86400000),
      unreadCount: 0
    },
    { 
      id: 5, 
      name: 'Sara', 
      username: 'Sara#7890',
      status: 'online', 
      avatar: 'S',
      lastSeen: new Date(),
      unreadCount: 3
    },
  ];

  const currentUser = {
    id: 2,
    name: 'Kaif',
    username: 'Kaif#0001',
    avatar: 'K',
    status: 'online'
  };

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'online': return 'var(--accent-green)';
      case 'away': return 'var(--accent-orange)';
      case 'dnd': return '#F04747';
      case 'offline': return '#747F8D';
      default: return '#747F8D';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'online': return '🟢';
      case 'away': return '🟡';
      case 'dnd': return '🔴';
      case 'offline': return '⚫';
      default: return '⚫';
    }
  };

  const handleSendMessage = () => {
    if (!message.trim()) return;
    
    const newMessage = {
      id: messages.length + 1,
      userId: currentUser.id,
      content: message,
      timestamp: new Date(),
      reactions: [],
      mentions: message.match(/@\w+/g) || []
    };
    
    setMessages([...messages, newMessage]);
    setMessage('');
    setIsTyping(false);
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setMessage(e.target.value);
    if (!isTyping && e.target.value.trim()) {
      setIsTyping(true);
      setTimeout(() => setIsTyping(false), 3000);
    }
  };

  const toggleReaction = (messageId: number, emoji: string) => {
    setMessages(messages.map(msg => {
      if (msg.id === messageId) {
        const existingReaction = msg.reactions.find(r => r.emoji === emoji);
        if (existingReaction) {
          if (existingReaction.users.includes(currentUser.name)) {
            existingReaction.users = existingReaction.users.filter(u => u !== currentUser.name);
            existingReaction.count--;
            if (existingReaction.count === 0) {
              msg.reactions = msg.reactions.filter(r => r.emoji !== emoji);
            }
          } else {
            existingReaction.users.push(currentUser.name);
            existingReaction.count++;
          }
        } else {
          msg.reactions.push({ emoji, count: 1, users: [currentUser.name] });
        }
      }
      return msg;
    }));
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('en-US', { 
      hour: 'numeric', 
      minute: '2-digit',
      hour12: true 
    });
  };

  const renderMessage = (msg: Message) => {
    const user = msg.userId === currentUser.id ? currentUser : friends.find(f => f.id === msg.userId);
    const isCurrentUser = msg.userId === currentUser.id;
    
    return (
      <div 
        key={msg.id} 
        className={`group flex items-start space-x-3 hover:bg-black/10 px-4 py-2 -mx-4 rounded transition-all duration-200 ${
          msg.mentions.some(mention => mention.includes(currentUser.name)) ? 'bg-yellow-500/10 border-l-4 border-yellow-500' : ''
        }`}
      >
        <div className="relative">
          <div className={`w-10 h-10 rounded-full flex items-center justify-center font-semibold text-white transition-transform duration-200 group-hover:scale-105 ${
            isCurrentUser ? 'bg-[var(--accent-blue)]' : 'bg-[var(--accent-purple)]'
          }`}>
            {user?.avatar}
          </div>
          <div 
            className="absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full border-2"
            style={{ 
              backgroundColor: getStatusColor(user?.status || 'offline'),
              borderColor: 'var(--panel-dark)'
            }}
          />
        </div>
        <div className="flex-1">
          <div className="flex items-center space-x-2 mb-1">
            <span className="font-semibold hover:underline cursor-pointer transition-colors duration-200">
              {user?.name}
            </span>
            <span className="text-xs opacity-60">
              {formatTime(msg.timestamp)}
            </span>
          </div>
          <div className="text-[var(--text-secondary)] leading-relaxed">
            {msg.content.split(/(@\w+)/g).map((part, i) => 
              part.startsWith('@') ? (
                <span key={i} className="bg-[var(--accent-blue)]/20 text-[var(--accent-blue)] px-1 rounded font-medium">
                  {part}
                </span>
              ) : part
            )}
          </div>
          {msg.reactions.length > 0 && (
            <div className="flex flex-wrap gap-1 mt-2">
              {msg.reactions.map((reaction, i) => (
                <button
                  key={i}
                  onClick={() => toggleReaction(msg.id, reaction.emoji)}
                  className={`flex items-center space-x-1 px-2 py-1 rounded-full text-xs transition-all duration-200 hover:scale-105 ${
                    reaction.users.includes(currentUser.name) 
                      ? 'bg-[var(--accent-blue)]/20 text-[var(--accent-blue)]' 
                      : 'bg-gray-700/50 hover:bg-gray-600/50'
                  }`}
                >
                  <span>{reaction.emoji}</span>
                  <span>{reaction.count}</span>
                </button>
              ))}
            </div>
          )}
        </div>
        <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex space-x-1">
          <button 
            onClick={() => toggleReaction(msg.id, '👍')}
            className="w-8 h-8 rounded-md hover:bg-white/10 flex items-center justify-center transition-all duration-200 hover:scale-110"
            title="Add reaction"
          >
            <span className="text-sm">👍</span>
          </button>
          <button 
            onClick={() => toggleReaction(msg.id, '❤️')}
            className="w-8 h-8 rounded-md hover:bg-white/10 flex items-center justify-center transition-all duration-200 hover:scale-110"
            title="Add reaction"
          >
            <span className="text-sm">❤️</span>
          </button>
          <button 
            className="w-8 h-8 rounded-md hover:bg-white/10 flex items-center justify-center transition-all duration-200 hover:scale-110"
            title="More options"
          >
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 8c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2zm0 2c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm0 6c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2z"/>
            </svg>
          </button>
        </div>
      </div>
    );
  };

  const selectedFriendData = friends.find(f => f.id === selectedFriend);

  return (
    <div className="flex flex-1">
      {/* Left Friends Panel */}
      <aside className="w-[280px] flex flex-col" style={{ backgroundColor: 'var(--panel-dark)' }}>
        <div className="p-4 flex-1 overflow-y-auto">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold">Friends</h2>
            <button className="w-8 h-8 rounded-md hover:bg-white/10 flex items-center justify-center transition-all duration-200 hover:scale-110" title="Add Friend">
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z"/>
              </svg>
            </button>
          </div>

          <div className="space-y-2 mb-6">
            <div className="flex items-center text-sm p-2 rounded hover:bg-[var(--surface)] cursor-pointer transition-colors duration-200">
              <span className="w-2 h-2 rounded-full bg-[var(--accent-green)] mr-3 animate-pulse"></span>
              <span>Inbox</span>
              <span className="ml-auto text-xs bg-red-500 text-white rounded-full px-2 py-0.5">3</span>
            </div>
          </div>
          
          <h3 className="text-sm font-medium mb-3 opacity-60 tracking-wider">PINNED MESSAGES</h3>
          <div className="mb-6">
            <div className="text-sm opacity-60 italic">No pinned messages yet</div>
          </div>

          <h3 className="text-sm font-medium mb-3 opacity-60 tracking-wider">DIRECT MESSAGES</h3>
          <div className="space-y-1">
            {friends.map((friend) => (
              <div 
                key={friend.id} 
                onClick={() => setSelectedFriend(friend.id)}
                className={`flex items-center p-2 rounded cursor-pointer transition-all duration-200 hover:bg-[var(--surface)] group ${
                  selectedFriend === friend.id ? 'bg-[var(--surface)] border-l-4 border-[var(--accent-blue)]' : ''
                }`}
              >
                <div className="relative mr-3">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold transition-transform duration-200 group-hover:scale-105 ${
                    selectedFriend === friend.id ? 'bg-[var(--accent-blue)]' : 'bg-[var(--accent-purple)]'
                  }`}>
                    {friend.avatar}
                  </div>
                  <div 
                    className="absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full border-2 transition-colors duration-200"
                    style={{ 
                      backgroundColor: getStatusColor(friend.status),
                      borderColor: 'var(--panel-dark)'
                    }}
                  />
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <div className="text-sm font-medium">{friend.name}</div>
                    {friend.unreadCount > 0 && (
                      <span className="text-xs bg-red-500 text-white rounded-full px-2 py-0.5 animate-pulse">
                        {friend.unreadCount}
                      </span>
                    )}
                  </div>
                  <div className="text-xs opacity-60 flex items-center">
                    <span className="mr-1">{getStatusIcon(friend.status)}</span>
                    {friend.status === 'online' ? 'Online' : 
                     friend.status === 'away' ? 'Away' :
                     friend.status === 'dnd' ? 'Do Not Disturb' : 'Offline'}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Bottom user panel with controls */}
        <div className="mt-auto p-3 border-t" style={{ borderColor: 'var(--divider)' }}>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="relative">
                <div className="w-8 h-8 rounded-full bg-[var(--accent-blue)] flex items-center justify-center text-sm font-semibold">
                  {currentUser.avatar}
                </div>
                <div 
                  className="absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full border-2" 
                  style={{ 
                    backgroundColor: getStatusColor(currentUser.status),
                    borderColor: 'var(--panel-dark)' 
                  }} 
                />
              </div>
              <div>
                <div className="text-sm font-medium">{currentUser.name}</div>
                <div className="text-xs opacity-60">{currentUser.username}</div>
              </div>
            </div>
            <div className="flex gap-1">
              {/* Mute */}
              <button 
                onClick={() => setIsMuted(!isMuted)}
                className={`w-8 h-8 rounded-md hover:bg-white/10 flex items-center justify-center transition-all duration-200 hover:scale-110 ${
                  isMuted ? 'bg-red-500/20 text-red-400' : ''
                }`} 
                title={isMuted ? "Unmute" : "Mute"}
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  {isMuted ? (
                    <path d="M19 11h-1.7c0 .74-.16 1.43-.43 2.05l1.23 1.23c.56-.98.9-2.09.9-3.28zm-4.02.17c0-.06.02-.11.02-.17V5c0-1.66-1.34-3-3-3S9 3.34 9 5v.18l5.98 5.99zM4.27 3L3 4.27l6.01 6.01V11c0 1.66 1.33 3 2.99 3 .22 0 .44-.03.65-.08l1.66 1.66c-.71.33-1.5.52-2.31.52-2.76 0-5.3-2.1-5.3-5.1H5c0 3.41 2.72 6.23 6 6.72V21h2v-3.28c.91-.13 1.77-.45 2.54-.9L19.73 21 21 19.73 4.27 3z"/>
                  ) : (
                    <path d="M12 14c1.66 0 2.99-1.34 2.99-3L15 5c0-1.66-1.34-3-3-3S9 3.34 9 5v6c0 1.66 1.34 3 3 3zm5.3-3c0 3-2.54 5.1-5.3 5.1S6.7 14 6.7 11H5c0 3.41 2.72 6.23 6 6.72V21h2v-3.28c3.28-.48 6-3.3 6-6.72h-1.7z"/>
                  )}
                </svg>
              </button>
              {/* Deafen */}
              <button 
                onClick={() => setIsDeafened(!isDeafened)}
                className={`w-8 h-8 rounded-md hover:bg-white/10 flex items-center justify-center transition-all duration-200 hover:scale-110 ${
                  isDeafened ? 'bg-red-500/20 text-red-400' : ''
                }`} 
                title={isDeafened ? "Undeafen" : "Deafen"}
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  {isDeafened ? (
                    <path d="M16.5 12c0-1.77-1.02-3.29-2.5-4.03v2.21l2.45 2.45c.03-.2.05-.42.05-.63zm2.5 0c0 .94-.2 1.82-.54 2.64l1.51 1.51C20.63 14.91 21 13.5 21 12c0-4.28-2.99-7.86-7-8.77v2.06c2.89.86 5 3.54 5 6.71zM4.27 3L3 4.27 7.73 9H3v6h4l5 5v-6.73l4.25 4.25c-.67.52-1.42.93-2.25 1.18v2.06c1.38-.31 2.63-.95 3.69-1.81L19.73 21 21 19.73l-9-9L4.27 3zM12 4L9.91 6.09 12 8.18V4z"/>
                  ) : (
                    <path d="M3 9v6h4l5 5V4L7 9H3zm13.5 3c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02zM14 3.23v2.06c2.89.86 5 3.54 5 6.71s-2.11 5.85-5 6.71v2.06c4.01-.91 7-4.49 7-8.77s-2.99-7.86-7-8.77z"/>
                  )}
                </svg>
              </button>
              {/* Settings */}
              <button className="w-8 h-8 rounded-md hover:bg-white/10 flex items-center justify-center transition-all duration-200 hover:scale-110" title="Settings">
                <svg className="w-5 h-5 opacity-80" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M19.14 12.94c.04-.3.06-.61.06-.94 0-.32-.02-.64-.07-.94l2.03-1.58c.18-.14.23-.41.12-.61l-1.92-3.32c-.12-.22-.37-.29-.59-.22l-2.39.96c-.5-.38-1.03-.7-1.62-.94l-.36-2.54c-.04-.24-.24-.41-.48-.41h-3.84c-.24 0-.43.17-.47.41l-.36 2.54c-.59.24-1.13.57-1.62.94l-2.39-.96c-.22-.08-.47 0-.59.22L2.74 8.87c-.12.21-.08.47.12.61l2.03 1.58c-.05.3-.09.63-.09.94s.02.64.07.94l-2.03 1.58c-.18.14-.23.41-.12.61l1.92 3.32c.12.22.37.29.59.22l2.39-.96c.5.38 1.03.7 1.62.94l.36 2.54c.05.24.24.41.48.41h3.84c.24 0 .44-.17.47-.41l.36-2.54c.59-.24 1.13-.56 1.62-.94l2.39.96c.22.08.47 0 .59-.22l1.92-3.32c.12-.22.07-.47-.12-.61l-2.01-1.58zM12 15.6c-1.98 0-3.6-1.62-3.6-3.6s1.62-3.6 3.6-3.6 3.6 1.62 3.6 3.6-1.62 3.6-3.6 3.6z"/>
                </svg>
              </button>
            </div>
          </div>
        </div>
      </aside>

      {/* Chat column */}
      <main className="flex-1 flex flex-col" style={{ backgroundColor: 'var(--bg)' }}>
        {/* Header */}
        <div className="h-16 flex items-center justify-between px-4 border-b backdrop-blur-sm bg-[var(--bg)]/80 sticky top-0 z-10" style={{ borderColor: 'var(--divider)' }}>
          <div className="flex items-center">
            <div className="relative mr-3">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold ${
                selectedFriend === selectedFriendData?.id ? 'bg-[var(--accent-blue)]' : 'bg-[var(--accent-purple)]'
              }`}>
                {selectedFriendData?.avatar}
              </div>
              <div 
                className="absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full border-2"
                style={{ 
                  backgroundColor: getStatusColor(selectedFriendData?.status || 'offline'),
                  borderColor: 'var(--bg)'
                }}
              />
            </div>
            <div>
              <div className="font-semibold text-[var(--text-primary)]">{selectedFriendData?.name}</div>
              <div className="text-xs text-[var(--muted)] flex items-center">
                <span className="mr-1">{getStatusIcon(selectedFriendData?.status || 'offline')}</span>
                {selectedFriendData?.status === 'online' ? 'Online' : 
                 selectedFriendData?.status === 'away' ? 'Away' :
                 selectedFriendData?.status === 'dnd' ? 'Do Not Disturb' : 'Offline'}
              </div>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <button className="w-9 h-9 rounded-md hover:bg-white/10 flex items-center justify-center transition-all duration-200 hover:scale-110" title="Start Voice Call">
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M20.01 15.38c-1.23 0-2.42-.2-3.53-.56-.35-.12-.74-.03-1.01.24l-1.57 1.97c-2.83-1.35-5.48-3.9-6.89-6.83l1.95-1.66c.27-.28.35-.67.24-1.02-.37-1.11-.56-2.3-.56-3.53 0-.54-.45-.99-.99-.99H4.19C3.65 3 3 3.24 3 3.99 3 13.28 10.73 21 20.01 21c.71 0 .99-.63.99-1.18v-3.45c0-.54-.45-.99-.99-.99z"/>
              </svg>
            </button>
            <button className="w-9 h-9 rounded-md hover:bg-white/10 flex items-center justify-center transition-all duration-200 hover:scale-110" title="Start Video Call">
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M17 10.5V7c0-.55-.45-1-1-1H4c-.55 0-1 .45-1 1v10c0 .55.45 1 1 1h12c.55 0 1-.45 1-1v-3.5l4 4v-11l-4 4z"/>
              </svg>
            </button>
            <button className="w-9 h-9 rounded-md hover:bg-white/10 flex items-center justify-center transition-all duration-200 hover:scale-110" title="Pinned Messages">
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M16 12V4a1 1 0 00-1-1H9a1 1 0 00-1 1v8a1 1 0 001 1h2v6h2v-6h2a1 1 0 001-1z"/>
              </svg>
            </button>
            <button className="w-9 h-9 rounded-md hover:bg-white/10 flex items-center justify-center transition-all duration-200 hover:scale-110" title="User Profile">
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
              </svg>
            </button>
          </div>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto">
          <div className="p-4 space-y-4">
            {messages.map(msg => renderMessage(msg))}
            
            {/* Typing Indicator */}
            {isTyping && (
              <div className="flex items-start space-x-3 animate-pulse">
                <div className="w-10 h-10 rounded-full bg-[var(--accent-purple)] flex items-center justify-center font-semibold">
                  {selectedFriendData?.avatar}
                </div>
                <div className="flex items-center space-x-1 bg-[var(--surface)] rounded-full px-4 py-2">
                  <div className="w-2 h-2 bg-[var(--muted)] rounded-full animate-bounce"></div>
                  <div className="w-2 h-2 bg-[var(--muted)] rounded-full animate-bounce" style={{animationDelay: '0.1s'}}></div>
                  <div className="w-2 h-2 bg-[var(--muted)] rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>
        </div>

        {/* Message Input */}
        <div className="p-4 border-t" style={{ borderColor: 'var(--divider)' }}>
          <div className="flex items-center bg-[var(--input-bg)] rounded-lg px-4 py-3 transition-all duration-200 focus-within:ring-2 focus-within:ring-[var(--accent-blue)]/50">
            <button className="text-[var(--icon)] hover:text-[var(--text-primary)] transition-colors duration-200 mr-3">
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z"/>
              </svg>
            </button>
            <input
              ref={inputRef}
              type="text"
              value={message}
              onChange={handleInputChange}
              onKeyPress={handleKeyPress}
              placeholder={`Message @${selectedFriendData?.name}`}
              className="flex-1 bg-transparent text-[var(--text-primary)] placeholder-[var(--muted)] outline-none"
            />
            <div className="flex items-center space-x-2 ml-4">
              <button 
                onClick={() => setShowEmojiPicker(!showEmojiPicker)}
                className="text-[var(--icon)] hover:text-[var(--text-primary)] transition-all duration-200 hover:scale-110"
                title="Add Emoji"
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
                </svg>
              </button>
              <button className="text-[var(--icon)] hover:text-[var(--text-primary)] transition-all duration-200 hover:scale-110" title="Upload File">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M14,2H6A2,2 0 0,0 4,4V20A2,2 0 0,0 6,22H18A2,2 0 0,0 20,20V8L14,2M18,20H6V4H13V9H18V20Z"/>
                </svg>
              </button>
              <button className="text-[var(--icon)] hover:text-[var(--text-primary)] transition-all duration-200 hover:scale-110" title="GIF">
                <span className="text-sm font-bold">GIF</span>
              </button>
              {message.trim() && (
                <button 
                  onClick={handleSendMessage}
                  className="bg-[var(--accent-blue)] hover:bg-[var(--accent-blue)]/80 text-white rounded-full w-8 h-8 flex items-center justify-center transition-all duration-200 hover:scale-110"
                  title="Send Message"
                >
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z"/>
                  </svg>
                </button>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
