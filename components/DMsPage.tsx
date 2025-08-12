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
  const [isTyping, setIsTyping] = useState(true);
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
    username: 'Kaif#001',
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

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('en-US', { 
      hour: 'numeric', 
      minute: '2-digit',
      hour12: true 
    });
  };

  const selectedFriendData = friends.find(f => f.id === selectedFriend);

  return (
    <div 
      className="flex h-screen overflow-hidden"
      style={{
        fontFamily: "'Inter', sans-serif",
        background: '#000000',
        color: '#ffffff',
        width: '1049px',
        margin: '0 auto',
        position: 'relative'
      }}
    >
      {/* Sidebar */}
      <div 
        className="flex flex-col h-full"
        style={{
          width: '236px',
          background: '#000000',
          borderRight: '1px solid #1A1A1A'
        }}
      >
        <div 
          className="p-[15px]"
          style={{ borderBottom: '1px solid #1A1A1A' }}
        >
          <div 
            className="flex items-center mb-[10px]"
            style={{
              color: '#FFFFFF',
              fontSize: '9.1px',
              fontWeight: '600'
            }}
          >
            📌 Pinned Messages
          </div>
          
          <div 
            className="rounded-md p-2 mb-[10px]"
            style={{
              background: 'linear-gradient(90deg, #202020 0%, #090909 100%)',
              border: '1px solid #0C0C0C',
              borderRadius: '6px'
            }}
          >
            <input
              type="text"
              placeholder="Inbox"
              className="w-full outline-none"
              style={{
                background: 'none',
                border: 'none',
                color: '#BDBDBD',
                fontSize: '9.3px'
              }}
            />
          </div>
          
          <div 
            className="flex items-center p-2"
            style={{
              background: 'linear-gradient(90deg, #202020 0%, #090909 100%)',
              border: '1px solid #111111',
              borderRadius: '6px',
              color: '#696969',
              fontSize: '9.5px'
            }}
          >
            👥 Friends
          </div>
        </div>
        
        <div className="flex-1 overflow-y-auto py-[15px]">
          {friends.map((friend) => (
            <div 
              key={friend.id} 
              onClick={() => setSelectedFriend(friend.id)}
              className={`flex items-center p-2 cursor-pointer transition-all hover:bg-white/5 ${
                selectedFriend === friend.id ? 'mx-[10px] rounded-md' : ''
              }`}
              style={{
                background: selectedFriend === friend.id 
                  ? 'linear-gradient(90deg, #202020 0%, #090909 100%)' 
                  : 'transparent',
                padding: '8px 15px'
              }}
            >
              <div 
                className="rounded-full flex items-center justify-center mr-3"
                style={{
                  width: '26px',
                  height: '26px',
                  background: '#333',
                  fontSize: '10px',
                  color: '#fff'
                }}
              >
                {friend.avatar}
              </div>
              <div className="flex-1">
                <div 
                  style={{
                    fontSize: '11.5px',
                    color: '#FFFFFF',
                    marginBottom: '2px'
                  }}
                >
                  {friend.name}
                </div>
                <div 
                  style={{
                    fontSize: '7px',
                    color: '#333333'
                  }}
                >
                  {friend.status}
                </div>
              </div>
            </div>
          ))}
        </div>
        
        <div 
          className="p-3"
          style={{
            color: '#FFFFFF',
            fontSize: '9.4px',
            fontWeight: '400',
            borderTop: '1px solid #1A1A1A'
          }}
        >
          📧 Direct Messages
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col" style={{ background: '#000000' }}>
        {/* Top Header */}
        <div 
          className="flex items-center justify-between px-5"
          style={{
            height: '79px',
            background: 'linear-gradient(93.68deg, #000000 16.57%, #2F2F2F 156.41%)'
          }}
        >
          <div className="flex gap-2">
            {Array.from({ length: 14 }, (_, i) => (
              <div 
                key={i} 
                style={{
                  width: '44px',
                  height: '44px',
                  borderRadius: '22px',
                  background: '#333'
                }}
              />
            ))}
          </div>
          
          <div 
            className="flex items-center p-2"
            style={{
              background: 'rgba(0, 0, 0, 0.8)',
              backdropFilter: 'blur(3.25px)',
              borderRadius: '11px 27px 27px 11px',
              boxShadow: 'inset 0px 0px 15.8px #181818'
            }}
          >
            <div className="mr-3">
              <div 
                style={{
                  fontSize: '8px',
                  fontWeight: '600',
                  color: '#FFFFFF'
                }}
              >
                Kaif
              </div>
              <div 
                style={{
                  fontSize: '4px',
                  color: '#6B6B6B'
                }}
              >
                Kaif#001
              </div>
            </div>
            <div 
              style={{
                width: '32px',
                height: '32px',
                borderRadius: '50%',
                background: '#333'
              }}
            />
          </div>
        </div>
        
        {/* Chat Container */}
        <div 
          className="flex-1 flex flex-col overflow-hidden m-2"
          style={{
            background: 'rgba(0, 0, 0, 0.996078)',
            borderRadius: '141px 99px 64px 151px',
            margin: '8px 11px'
          }}
        >
          {/* Messages */}
          <div className="flex-1 p-5 overflow-y-auto flex flex-col gap-[15px]">
            {messages.map(msg => {
              const user = msg.userId === currentUser.id ? currentUser : friends.find(f => f.id === msg.userId);
              return (
                <div key={msg.id} className="flex items-start gap-[10px]">
                  <div 
                    className="rounded-full flex items-center justify-center flex-shrink-0"
                    style={{
                      width: '25px',
                      height: '25px',
                      background: '#333',
                      fontSize: '10px',
                      color: '#fff'
                    }}
                  >
                    {user?.avatar}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-0.5">
                      <span 
                        style={{
                          fontSize: '8.3px',
                          fontWeight: '400',
                          color: '#FFFFFF'
                        }}
                      >
                        {user?.name}
                      </span>
                      <span 
                        style={{
                          fontSize: '7px',
                          color: '#4E4E4E'
                        }}
                      >
                        Today at {formatTime(msg.timestamp)}
                      </span>
                    </div>
                    <div 
                      style={{
                        fontSize: '7.6px',
                        color: '#FFFFFF',
                        lineHeight: '1.2'
                      }}
                    >
                      {msg.content}
                    </div>
                  </div>
                </div>
              );
            })}
            
            {/* Separator */}
            <div 
              style={{
                height: '3px',
                background: '#040404',
                margin: '10px 0'
              }}
            />
            
            {/* Typing Indicator */}
            {isTyping && (
              <div 
                className="flex items-center gap-2 p-[15px_20px]"
                style={{ borderTop: '1px solid #1A1A1A' }}
              >
                <div 
                  className="rounded-full flex items-center justify-center"
                  style={{
                    width: '25px',
                    height: '25px',
                    background: '#333',
                    fontSize: '10px',
                    color: '#fff'
                  }}
                >
                  D
                </div>
                <div 
                  style={{
                    fontSize: '15px',
                    fontWeight: '700',
                    color: '#959595'
                  }}
                >
                  daFoxy
                </div>
              </div>
            )}
            
            <div ref={messagesEndRef} />
          </div>
          
          {/* Message Input */}
          <div 
            className="flex items-center gap-3 p-2"
            style={{
              background: 'linear-gradient(90deg, #090909 0%, #202020 100%)',
              borderRadius: '4px 7px 4px 4px',
              margin: '7px 11px'
            }}
          >
            <div 
              style={{
                width: '17px',
                height: '17px',
                background: '#444',
                borderRadius: '3px'
              }}
            />
            <div 
              style={{
                width: '17px',
                height: '17px',
                background: '#444',
                borderRadius: '3px'
              }}
            />
            <input
              ref={inputRef}
              type="text"
              value={message}
              onChange={handleInputChange}
              onKeyPress={handleKeyPress}
              placeholder="Message daFoxy"
              className="flex-1 outline-none"
              style={{
                background: 'transparent',
                color: '#383838',
                fontSize: '9.4px',
                border: 'none'
              }}
            />
            <div 
              style={{
                width: '17px',
                height: '17px',
                background: '#444',
                borderRadius: '3px'
              }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}