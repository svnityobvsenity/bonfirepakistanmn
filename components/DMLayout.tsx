'use client';

import React, { useState } from 'react';
import { MessageCircle, Users, Phone, Video, Settings, Search, Plus } from 'lucide-react';

export default function DMLayout() {
  const [selectedFriendId, setSelectedFriendId] = useState('friend1');

  const friends = [
    {
      id: 'friend1',
      name: 'daFoxy',
      username: 'daFoxy#1234',
      avatar: 'D',
      status: 'online',
      unreadCount: 2,
      lastMessage: 'yo bro whats good'
    },
    {
      id: 'friend2',
      name: 'Ahmed',
      username: 'Ahmed#5678',
      avatar: 'A',
      status: 'away',
      unreadCount: 0,
      lastMessage: 'Thanks for the help!'
    },
    {
      id: 'friend3',
      name: 'Sara',
      username: 'Sara#7890',
      avatar: 'S',
      status: 'online',
      unreadCount: 3,
      lastMessage: 'Did you see the update?'
    }
  ];

  const selectedFriend = friends.find(f => f.id === selectedFriendId);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'online': return 'bg-green-500';
      case 'away': return 'bg-yellow-500';
      case 'dnd': return 'bg-red-500';
      case 'offline': return 'bg-gray-500';
      default: return 'bg-gray-500';
    }
  };

  return (
    <div className="flex flex-col h-full bg-[var(--bg)]">
      {/* Top Navigation */}
      <div className="h-16 flex items-center justify-between px-4 border-b border-[var(--divider)] bg-[var(--panel-mid)]">
        <div className="flex items-center space-x-6">
          <button className="flex items-center space-x-2 px-3 py-2 rounded-md bg-[var(--surface)] text-[var(--text-primary)]">
            <Users className="w-5 h-5" />
            <span className="text-sm font-medium">Friends</span>
          </button>
          <button className="flex items-center space-x-2 px-3 py-2 rounded-md text-[var(--muted)] hover:bg-[var(--surface)]">
            <Phone className="w-5 h-5" />
            <span className="text-sm font-medium">Calls</span>
          </button>
        </div>

        <div className="flex items-center space-x-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-[var(--muted)]" />
            <input
              type="text"
              placeholder="Search conversations..."
              className="w-64 h-9 bg-[var(--input-bg)] rounded-md pl-10 pr-3 text-sm text-[var(--text-primary)] placeholder-[var(--muted)] focus:outline-none focus:ring-2 focus:ring-blue-500/50"
            />
          </div>
          <button className="w-9 h-9 rounded-md hover:bg-[var(--surface)] flex items-center justify-center transition-colors">
            <Settings className="w-5 h-5 text-[var(--muted)]" />
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex flex-1 overflow-hidden">
        {/* Friends List */}
        <div className="w-80 bg-[var(--panel-dark)] border-r border-[var(--divider)] flex flex-col">
          <div className="p-4 border-b border-[var(--divider)]">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold text-[var(--text-primary)]">Direct Messages</h2>
              <button className="w-8 h-8 rounded-md hover:bg-[var(--surface)] flex items-center justify-center transition-colors">
                <Plus className="w-5 h-5 text-[var(--muted)]" />
              </button>
            </div>
          </div>

          <div className="flex-1 overflow-y-auto p-2">
            {friends.map((friend) => (
              <button
                key={friend.id}
                onClick={() => setSelectedFriendId(friend.id)}
                className={`w-full flex items-center space-x-3 p-3 rounded-lg transition-colors hover:bg-[var(--surface)] ${
                  selectedFriendId === friend.id ? 'bg-[var(--surface)]' : ''
                }`}
              >
                <div className="relative flex-shrink-0">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-r from-purple-500 to-blue-500 flex items-center justify-center text-sm font-semibold text-white">
                    {friend.avatar}
                  </div>
                  <div className={`absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full border-2 border-[var(--panel-dark)] ${getStatusColor(friend.status)}`}></div>
                </div>
                
                <div className="flex-1 min-w-0 text-left">
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-medium text-[var(--text-primary)] truncate">{friend.name}</span>
                    {friend.unreadCount > 0 && (
                      <span className="bg-red-500 text-white text-xs rounded-full px-2 py-0.5">
                        {friend.unreadCount}
                      </span>
                    )}
                  </div>
                  <div className="text-sm text-[var(--muted)] truncate">
                    {friend.lastMessage}
                  </div>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Chat Area */}
        {selectedFriend ? (
          <div className="flex-1 flex flex-col">
            {/* Chat Header */}
            <div className="h-16 flex items-center justify-between px-6 border-b border-[var(--divider)] bg-[var(--bg)]">
              <div className="flex items-center space-x-3">
                <div className="relative">
                  <div className="w-8 h-8 rounded-full bg-gradient-to-r from-purple-500 to-blue-500 flex items-center justify-center text-sm font-semibold text-white">
                    {selectedFriend.avatar}
                  </div>
                  <div className={`absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full border-2 border-[var(--bg)] ${getStatusColor(selectedFriend.status)}`}></div>
                </div>
                <div>
                  <div className="font-semibold text-[var(--text-primary)] text-sm">{selectedFriend.name}</div>
                  <div className="text-xs text-[var(--muted)] capitalize">{selectedFriend.status}</div>
                </div>
              </div>
              
              <div className="flex items-center space-x-1">
                <button className="w-9 h-9 rounded-md hover:bg-[var(--surface)] flex items-center justify-center transition-colors">
                  <Phone className="w-4 h-4 text-[var(--muted)]" />
                </button>
                <button className="w-9 h-9 rounded-md hover:bg-[var(--surface)] flex items-center justify-center transition-colors">
                  <Video className="w-4 h-4 text-[var(--muted)]" />
                </button>
              </div>
            </div>
            
            {/* Messages */}
            <div className="flex-1 overflow-y-auto px-4 py-6">
              <div className="space-y-6">
                <div className="flex items-start space-x-3">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-r from-purple-500 to-blue-500 flex items-center justify-center text-sm font-semibold text-white">
                    {selectedFriend.avatar}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center space-x-2 mb-2">
                      <span className="font-semibold text-[var(--text-primary)]">{selectedFriend.name}</span>
                      <span className="text-xs text-[var(--muted)]">Today at 3:45 PM</span>
                    </div>
                    <div className="text-[var(--text-secondary)] leading-relaxed">
                      yo bro whats good
                    </div>
                  </div>
                </div>
                
                <div className="flex items-start space-x-3">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 flex items-center justify-center text-sm font-semibold text-white">
                    K
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center space-x-2 mb-2">
                      <span className="font-semibold text-[var(--text-primary)]">Kaif</span>
                      <span className="text-xs text-[var(--muted)]">Today at 3:46 PM</span>
                    </div>
                    <div className="text-[var(--text-secondary)] leading-relaxed">
                      nothing much just working on some projects
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Message Input */}
            <div className="px-4 py-4 border-t border-[var(--divider)]">
              <div className="bg-[var(--input-bg)] rounded-lg px-4 py-3 flex items-center space-x-3 min-h-[48px]">
                <input
                  type="text"
                  placeholder={`Message @${selectedFriend.name}`}
                  className="flex-1 bg-transparent text-[var(--text-primary)] placeholder-[var(--muted)] outline-none text-sm"
                />
                <div className="flex items-center space-x-2">
                  <button className="text-[var(--muted)] hover:text-[var(--text-primary)] transition-colors p-1">
                    😊
                  </button>
                  <button className="text-[var(--muted)] hover:text-[var(--text-primary)] transition-colors p-1">
                    📎
                  </button>
                  <button className="bg-blue-500 hover:bg-blue-600 text-white rounded-full w-8 h-8 flex items-center justify-center transition-colors text-sm">
                    →
                  </button>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="flex-1 flex items-center justify-center">
            <div className="text-center">
              <MessageCircle className="w-16 h-16 text-[var(--muted)] mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-[var(--text-primary)] mb-2">
                Select a conversation
              </h3>
              <p className="text-[var(--muted)]">
                Choose a friend to start chatting
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
