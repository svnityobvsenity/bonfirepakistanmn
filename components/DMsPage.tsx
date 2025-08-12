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
      content: 'I saw this really cool Discord clone tutorial',
      timestamp: new Date('2024-01-15T21:41:00'),
      reactions: [],
      mentions: []
    },
    {
      id: 2,
      userId: 10,
      content: 'Sure thing! Want to collaborate on it?',
      timestamp: new Date('2024-01-15T21:41:00'),
      reactions: [],
      mentions: []
    },
    {
      id: 3,
      userId: 1,
      content: 'oOoOOoo what\'s the tech stack?',
      timestamp: new Date('2024-01-15T21:41:00'),
      reactions: [],
      mentions: []
    },
    {
      id: 4,
      userId: 10,
      content: 'It\'s this new Discord interface design I found',
      timestamp: new Date('2024-01-15T21:41:00'),
      reactions: [],
      mentions: []
    },
    {
      id: 5,
      userId: 1,
      content: 'No, how does it work?',
      timestamp: new Date('2024-01-15T21:41:00'),
      reactions: [],
      mentions: []
    },
    {
      id: 6,
      userId: 10,
      content: 'Just paste a YouTube link and it\'ll automatically embed the video with a nice preview',
      timestamp: new Date('2024-01-15T21:44:00'),
      reactions: [],
      mentions: []
    },
    {
      id: 7,
      userId: 1,
      content: 'Woah! I\'ll start working on the frontend',
      timestamp: new Date('2024-01-15T21:41:00'),
      reactions: [],
      mentions: []
    },
    {
      id: 8,
      userId: 10,
      content: 'Cool, can\'t wait to see what you build!',
      timestamp: new Date('2024-01-15T21:44:00'),
      reactions: [],
      mentions: []
    },
    {
      id: 9,
      userId: 1,
      content: 'Awesome, starting now!',
      timestamp: new Date('2024-01-15T21:41:00'),
      reactions: [],
      mentions: []
    },
    {
      id: 10,
      userId: 10,
      content: 'Joined.',
      timestamp: new Date('2024-01-15T21:44:00'),
      reactions: [],
      mentions: []
    }
  ]);

  const friends = [
    { 
      id: 1, 
      name: 'daFoxy', 
      username: 'daFoxy#1234',
      status: 'Playing Blender',
      avatar: 'D',
      lastSeen: new Date(),
      unreadCount: 0
    },
    { 
      id: 2, 
      name: 'james', 
      username: 'james#5678',
      status: 'Playing Procrast', 
      avatar: 'J',
      lastSeen: new Date(Date.now() - 300000),
      unreadCount: 0
    },
    { 
      id: 3, 
      name: 'Ekmand', 
      username: 'Ekmand#9012',
      status: 'offline', 
      avatar: 'E',
      lastSeen: new Date(Date.now() - 600000),
      unreadCount: 0
    },
    { 
      id: 4, 
      name: 'Sticks', 
      username: 'Sticks#3456',
      status: 'offline', 
      avatar: 'S',
      lastSeen: new Date(Date.now() - 86400000),
      unreadCount: 0
    },
    { 
      id: 5, 
      name: 'FranzaGeek', 
      username: 'FranzaGeek#7890',
      status: 'Playing Powerpoi', 
      avatar: 'F',
      lastSeen: new Date(),
      unreadCount: 0
    },
    { 
      id: 6, 
      name: 'Markella\'s', 
      username: 'Markella#1111',
      status: 'Playing MTG Aren', 
      avatar: 'M',
      lastSeen: new Date(),
      unreadCount: 0
    },
    { 
      id: 7, 
      name: 'AY-Plays', 
      username: 'AY-Plays#2222',
      status: 'offline', 
      avatar: 'A',
      lastSeen: new Date(),
      unreadCount: 0
    },
    { 
      id: 8, 
      name: 'LemonTiger', 
      username: 'LemonTiger#3333',
      status: 'offline', 
      avatar: 'L',
      lastSeen: new Date(),
      unreadCount: 0
    },
    { 
      id: 9, 
      name: 'NRD', 
      username: 'NRD#4444',
      status: 'offline', 
      avatar: 'N',
      lastSeen: new Date(),
      unreadCount: 0
    },
    { 
      id: 10, 
      name: 'Concept Central', 
      username: 'ConceptCentral#5555',
      status: 'online', 
      avatar: 'C',
      lastSeen: new Date(),
      unreadCount: 0
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
          <div className="flex items-center space-x-2 mb-2">
            <span className="font-semibold hover:underline cursor-pointer transition-colors duration-200 text-sm">
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
    <div className="flex h-screen bg-black text-white font-['Inter'] max-w-[1049px] mx-auto">
      {/* Sidebar */}
      <div className="w-[236px] bg-black border-r border-[#1A1A1A] flex flex-col h-full">
        <div className="p-[15px] border-b border-[#1A1A1A]">
          <div className="flex items-center text-white text-[9.1px] font-semibold mb-[10px]">
            📌 Pinned Messages
          </div>
          <div className="bg-gradient-to-r from-[#202020] to-[#090909] border border-[#0C0C0C] rounded-md p-2 mb-[10px]">
            <input
              type="text"
              placeholder="Inbox"
              className="bg-transparent border-none text-[#BDBDBD] text-[9.3px] outline-none w-full"
            />
          </div>
          <div className="bg-gradient-to-r from-[#202020] to-[#090909] border border-[#111111] rounded-md p-2 flex items-center text-[#696969] text-[9.5px]">
            👥 Friends
          </div>
        </div>
        
        <div className="flex-1 overflow-y-auto py-[15px]">
          {friends.map((friend) => (
            <div 
              key={friend.id} 
              onClick={() => setSelectedFriend(friend.id)}
              className={`flex items-center p-2 mx-[15px] cursor-pointer transition-all hover:bg-white/5 ${
                selectedFriend === friend.id ? 'bg-gradient-to-r from-[#202020] to-[#090909] rounded-md' : ''
              }`}
            >
              <div className="w-[26px] h-[26px] rounded-full bg-[#333] mr-3 flex items-center justify-center text-[10px] text-white">
                {friend.avatar}
              </div>
              <div className="flex-1">
                <div className="text-white text-[11.5px] mb-0.5">{friend.name}</div>
                <div className="text-[#333333] text-[7px]">{friend.status}</div>
              </div>
            </div>
          ))}
        </div>
        
        <div className="p-3 text-white text-[9.4px] border-t border-[#1A1A1A]">
          📧 Direct Messages
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col bg-black">
        {/* Top Header */}
        <div className="h-[79px] bg-gradient-to-r from-black via-black to-[#2F2F2F] flex items-center justify-between px-5">
          <div className="flex gap-2">
            {Array.from({ length: 14 }, (_, i) => (
              <div key={i} className="w-[44px] h-[44px] rounded-[22px] bg-[#333]"></div>
            ))}
          </div>
          
          <div className="flex items-center bg-black/80 backdrop-blur-[3.25px] rounded-[11px_27px_27px_11px] p-2 shadow-[inset_0px_0px_15.8px_#181818]">
            <div className="mr-3">
              <div className="text-white text-[8px] font-semibold">Kaif</div>
              <div className="text-[#6B6B6B] text-[4px]">Kaif#001</div>
            </div>
            <div className="w-8 h-8 rounded-full bg-[#333]"></div>
          </div>
        </div>
        
        {/* Chat Container */}
        <div className="flex-1 bg-black/[0.996078] rounded-[141px_99px_64px_151px] mx-[11px] my-2 flex flex-col overflow-hidden">
          {/* Messages */}
          <div className="flex-1 p-5 overflow-y-auto flex flex-col gap-[15px]">
            {messages.map(msg => {
              const user = msg.userId === currentUser.id ? currentUser : friends.find(f => f.id === msg.userId);
              return (
                <div key={msg.id} className="flex items-start gap-[10px]">
                  <div className="w-[25px] h-[25px] rounded-full bg-[#333] flex items-center justify-center text-[10px] text-white flex-shrink-0">
                    {user?.avatar}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-0.5">
                      <span className="text-white text-[8.3px] font-normal">{user?.name}</span>
                      <span className="text-[#4E4E4E] text-[7px]">{formatTime(msg.timestamp)}</span>
                    </div>
                    <div className="text-white text-[7.6px] leading-tight">{msg.content}</div>
                  </div>
                </div>
              );
            })}
            
            {/* Separator */}
            <div className="h-[3px] bg-[#040404] mx-[-10px]"></div>
            
            {/* Typing Indicator */}
            <div className="flex items-center gap-2 p-[15px_20px] border-t border-[#1A1A1A]">
              <div className="w-[25px] h-[25px] rounded-full bg-[#333] flex items-center justify-center text-[10px] text-white">
                D
              </div>
              <div className="text-[#959595] text-[15px] font-bold">daFoxy</div>
            </div>
            
            <div ref={messagesEndRef} />
          </div>
          
          {/* Message Input */}
          <div className="bg-gradient-to-r from-[#090909] to-[#202020] rounded-[4px_7px_4px_4px] m-[7px_11px] p-2 flex items-center gap-3">
            <div className="w-[17px] h-[17px] bg-[#444] rounded-sm"></div>
            <div className="w-[17px] h-[17px] bg-[#444] rounded-sm"></div>
            <input
              ref={inputRef}
              type="text"
              value={message}
              onChange={handleInputChange}
              onKeyPress={handleKeyPress}
              placeholder="Message daFoxy"
              className="flex-1 bg-transparent text-[#383838] placeholder-[#383838] text-[9.4px] outline-none"
            />
            <div className="w-[17px] h-[17px] bg-[#444] rounded-sm"></div>
          </div>
        </div>
      </div>
    </div>
  );
}
