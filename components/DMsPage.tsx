'use client';

import React, { useState, useRef, useEffect } from 'react';

export default function DMsPage() {
  const [selectedFriend, setSelectedFriend] = useState(1);
  const [message, setMessage] = useState('');
  const [isTyping] = useState(true);
  
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const messages = [
    { id: 1, author: 'daFoxy', time: 'Today at 9:41PM', content: 'I saw this really cool Discord clone tutorial', avatar: 'D' },
    { id: 2, author: 'Concept Central', time: 'Today at 9:41PM', content: 'Sure thing! Want to collaborate on it?', avatar: 'S' },
    { id: 3, author: 'daFoxy', time: 'Today at 9:41PM', content: 'oOoOOoo what\'s the tech stack?', avatar: 'D' },
    { id: 4, author: 'Concept Central', time: 'Today at 9:41PM', content: 'It\'s this new Discord interface design I found', avatar: 'S' },
    { id: 5, author: 'daFoxy', time: 'Today at 9:41PM', content: 'No, how does it work?', avatar: 'D' },
    { id: 6, author: 'Concept Central', time: 'Today at 9:44 PM', content: 'Just paste a YouTube link and it\'ll automatically embed the video with a nice preview', avatar: 'S' },
    { id: 7, author: 'daFoxy', time: 'Today at 9:41PM', content: 'Woah! I\'ll start working on the frontend', avatar: 'D' },
    { id: 8, author: 'Concept Central', time: 'Today at 9:44 PM', content: 'Cool, can\'t wait to see what you build!', avatar: 'S' },
    { id: 9, author: 'daFoxy', time: 'Today at 9:41PM', content: 'Awesome, starting now!', avatar: 'D' },
    { id: 10, author: 'Concept Central', time: 'Today at 9:44 PM', content: 'Joined.', avatar: 'C' }
  ];

  const friends = [
    { id: 1, name: 'daFoxy', status: 'Playing Blender', avatar: 'D', selected: true },
    { id: 2, name: 'james', status: 'Playing Procrast', avatar: 'J', selected: false },
    { id: 3, name: 'Ekmand', status: '', avatar: 'E', selected: false },
    { id: 4, name: 'Sticks', status: '', avatar: 'S', selected: false },
    { id: 5, name: 'FranzaGeek', status: 'Playing Powerpoi', avatar: 'F', selected: false },
    { id: 6, name: 'Markella\'s', status: 'Playing MTG Aren', avatar: 'M', selected: false },
    { id: 7, name: 'AY-Plays', status: '', avatar: 'A', selected: false },
    { id: 8, name: 'LemonTiger', status: '', avatar: 'L', selected: false },
    { id: 9, name: 'NRD', status: '', avatar: 'N', selected: false }
  ];

  const handleSendMessage = () => {
    if (!message.trim()) return;
    setMessage('');
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setMessage(e.target.value);
  };

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, []);

  return (
    <div style={{
      margin: 0,
      padding: 0,
      boxSizing: 'border-box',
      fontFamily: "'Inter', sans-serif",
      background: '#000000',
      color: '#ffffff',
      height: '100vh',
      overflow: 'hidden'
    }}>
      <div style={{
        display: 'flex',
        height: '100vh',
        width: '1049px',
        margin: '0 auto',
        position: 'relative'
      }}>
        {/* Sidebar */}
        <div style={{
          width: '236px',
          background: '#000000',
          borderRight: '1px solid #1A1A1A',
          display: 'flex',
          flexDirection: 'column',
          height: '100%'
        }}>
          <div style={{
            padding: '15px',
            borderBottom: '1px solid #1A1A1A'
          }}>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              color: '#FFFFFF',
              fontSize: '9.1px',
              fontWeight: '600',
              marginBottom: '10px'
            }}>
              📌 Pinned Messages
            </div>
            
            <div style={{
              background: 'linear-gradient(90deg, #202020 0%, #090909 100%)',
              border: '1px solid #0C0C0C',
              borderRadius: '6px',
              padding: '8px 12px',
              marginBottom: '10px'
            }}>
              <input
                type="text"
                placeholder="Inbox"
                style={{
                  background: 'none',
                  border: 'none',
                  color: '#BDBDBD',
                  fontSize: '9.3px',
                  outline: 'none',
                  width: '100%'
                }}
              />
            </div>
            
            <div style={{
              background: 'linear-gradient(90deg, #202020 0%, #090909 100%)',
              border: '1px solid #111111',
              borderRadius: '6px',
              padding: '8px 12px',
              display: 'flex',
              alignItems: 'center',
              color: '#696969',
              fontSize: '9.5px'
            }}>
              👥 Friends
            </div>
          </div>
          
          <div style={{
            flex: 1,
            overflowY: 'auto',
            padding: '15px 0'
          }}>
            {friends.map((friend) => (
              <div 
                key={friend.id} 
                onClick={() => setSelectedFriend(friend.id)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  padding: '8px 15px',
                  cursor: 'pointer',
                  transition: 'background 0.2s',
                  background: friend.selected ? 'linear-gradient(90deg, #202020 0%, #090909 100%)' : 'transparent',
                  borderRadius: friend.selected ? '6px' : '0',
                  margin: friend.selected ? '0 10px' : '0'
                }}
                onMouseEnter={(e) => {
                  if (!friend.selected) {
                    e.currentTarget.style.background = 'rgba(255, 255, 255, 0.05)';
                  }
                }}
                onMouseLeave={(e) => {
                  if (!friend.selected) {
                    e.currentTarget.style.background = 'transparent';
                  }
                }}
              >
                <div style={{
                  width: '26px',
                  height: '26px',
                  borderRadius: '50%',
                  background: '#333',
                  marginRight: '12px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '10px',
                  color: '#fff'
                }}>
                  {friend.avatar}
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{
                    fontSize: '11.5px',
                    color: '#FFFFFF',
                    marginBottom: '2px'
                  }}>
                    {friend.name}
                  </div>
                  <div style={{
                    fontSize: '7px',
                    color: '#333333'
                  }}>
                    {friend.status}
                  </div>
                </div>
              </div>
            ))}
          </div>
          
          <div style={{
            padding: '12px 15px',
            color: '#FFFFFF',
            fontSize: '9.4px',
            fontWeight: '400',
            borderTop: '1px solid #1A1A1A'
          }}>
            📧 Direct Messages
          </div>
        </div>

        {/* Main Content */}
        <div style={{
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          background: '#000000'
        }}>
          {/* Top Header */}
          <div style={{
            height: '79px',
            background: 'linear-gradient(93.68deg, #000000 16.57%, #2F2F2F 156.41%)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '0 20px'
          }}>
            <div style={{ display: 'flex', gap: '8px' }}>
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
            
            <div style={{
              display: 'flex',
              alignItems: 'center',
              background: 'rgba(0, 0, 0, 0.8)',
              backdropFilter: 'blur(3.25px)',
              borderRadius: '11px 27px 27px 11px',
              padding: '8px',
              boxShadow: 'inset 0px 0px 15.8px #181818'
            }}>
              <div style={{ marginRight: '12px' }}>
                <div style={{
                  fontSize: '8px',
                  fontWeight: '600',
                  color: '#FFFFFF'
                }}>
                  Kaif
                </div>
                <div style={{
                  fontSize: '4px',
                  color: '#6B6B6B'
                }}>
                  Kaif#001
                </div>
              </div>
              <div style={{
                width: '32px',
                height: '32px',
                borderRadius: '50%',
                background: '#333'
              }} />
            </div>
          </div>
          
          {/* Chat Container */}
          <div style={{
            flex: 1,
            background: 'rgba(0, 0, 0, 0.996078)',
            borderRadius: '141px 99px 64px 151px',
            margin: '8px 11px',
            display: 'flex',
            flexDirection: 'column',
            overflow: 'hidden'
          }}>
            {/* Messages */}
            <div style={{
              flex: 1,
              padding: '20px',
              overflowY: 'auto',
              display: 'flex',
              flexDirection: 'column',
              gap: '15px'
            }}>
              {messages.map(msg => (
                <div key={msg.id} style={{
                  display: 'flex',
                  alignItems: 'flex-start',
                  gap: '10px'
                }}>
                  <div style={{
                    width: '25px',
                    height: '25px',
                    borderRadius: '50%',
                    background: '#333',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '10px',
                    color: '#fff',
                    flexShrink: 0
                  }}>
                    {msg.avatar}
                  </div>
                  <div style={{ flex: 1 }}>
                    <div style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px',
                      marginBottom: '2px'
                    }}>
                      <span style={{
                        fontSize: '8.3px',
                        fontWeight: '400',
                        color: '#FFFFFF'
                      }}>
                        {msg.author}
                      </span>
                      <span style={{
                        fontSize: '7px',
                        color: '#4E4E4E'
                      }}>
                        {msg.time}
                      </span>
                    </div>
                    <div style={{
                      fontSize: '7.6px',
                      color: '#FFFFFF',
                      lineHeight: '1.2'
                    }}>
                      {msg.content}
                    </div>
                  </div>
                </div>
              ))}
              
              {/* Separator */}
              <div style={{
                height: '3px',
                background: '#040404',
                margin: '10px 0'
              }} />
              
              {/* Typing Indicator */}
              {isTyping && (
                <div style={{
                  padding: '15px 20px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  borderTop: '1px solid #1A1A1A'
                }}>
                  <div style={{
                    width: '25px',
                    height: '25px',
                    borderRadius: '50%',
                    background: '#333',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '10px',
                    color: '#fff'
                  }}>
                    D
                  </div>
                  <div style={{
                    fontSize: '15px',
                    fontWeight: '700',
                    color: '#959595'
                  }}>
                    daFoxy
                  </div>
                </div>
              )}
              
              <div ref={messagesEndRef} />
            </div>
            
            {/* Message Input */}
            <div style={{
              background: 'linear-gradient(90deg, #090909 0%, #202020 100%)',
              borderRadius: '4px 7px 4px 4px',
              margin: '7px 11px',
              padding: '8px 15px',
              display: 'flex',
              alignItems: 'center',
              gap: '12px'
            }}>
              <div style={{
                width: '17px',
                height: '17px',
                background: '#444',
                borderRadius: '3px'
              }} />
              <div style={{
                width: '17px',
                height: '17px',
                background: '#444',
                borderRadius: '3px'
              }} />
              <input
                ref={inputRef}
                type="text"
                value={message}
                onChange={handleInputChange}
                onKeyPress={handleKeyPress}
                placeholder="Message daFoxy"
                style={{
                  flex: 1,
                  background: 'transparent',
                  border: 'none',
                  color: '#383838',
                  fontSize: '9.4px',
                  outline: 'none'
                }}
              />
              <div style={{
                width: '17px',
                height: '17px',
                background: '#444',
                borderRadius: '3px'
              }} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}