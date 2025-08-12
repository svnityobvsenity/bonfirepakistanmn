'use client';

import React, { useState } from 'react';
import { Hash, Volume2, Users, Settings, Plus } from 'lucide-react';

interface Channel {
  id: string;
  name: string;
  type: 'text' | 'voice';
  unreadCount?: number;
  members?: number;
}

interface SidebarProps {
  serverName: string;
  serverIcon: string;
  onChannelSelect: (channelId: string) => void;
  activeChannelId?: string;
}

export default function Sidebar({ 
  serverName, 
  serverIcon, 
  onChannelSelect, 
  activeChannelId 
}: SidebarProps) {
  const [currentUser] = useState({
    id: 'user1',
    name: 'Kaif',
    avatar: 'K',
    status: 'online' as const
  });

  const textChannels: Channel[] = [
    { id: 'general', name: 'general', type: 'text', unreadCount: 3 },
    { id: 'random', name: 'random', type: 'text' },
    { id: 'memes', name: 'memes', type: 'text', unreadCount: 12 },
    { id: 'tech-talk', name: 'tech-talk', type: 'text', unreadCount: 1 },
    { id: 'gaming', name: 'gaming', type: 'text' },
  ];

  const voiceChannels: Channel[] = [
    { id: 'general-voice', name: 'General', type: 'voice', members: 5 },
    { id: 'music', name: 'Music', type: 'voice', members: 2 },
    { id: 'study-room', name: 'Study Room', type: 'voice', members: 8 },
    { id: 'gaming-voice', name: 'Gaming', type: 'voice', members: 3 },
  ];

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
    <div className="w-[280px] h-full bg-[var(--panel-dark)] flex flex-col">
      {/* Server Header */}
      <div className="h-16 flex items-center justify-between px-4 border-b border-[var(--divider)] shadow-sm">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-full bg-gradient-to-r from-purple-500 to-blue-500 flex items-center justify-center text-xl font-bold">
            {serverIcon}
          </div>
          <div>
            <h2 className="font-semibold text-[var(--text-primary)]">{serverName}</h2>
            <div className="flex items-center space-x-1">
              <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
              <span className="text-xs text-[var(--muted)]">1,247 online</span>
            </div>
          </div>
        </div>
        <button className="w-8 h-8 rounded-md hover:bg-[var(--surface)] flex items-center justify-center transition-colors">
          <Settings className="w-4 h-4 text-[var(--muted)]" />
        </button>
      </div>

      {/* Channels */}
      <div className="flex-1 overflow-y-auto">
        {/* Text Channels */}
        <div className="p-4">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-xs font-semibold text-[var(--muted)] uppercase tracking-wider">
              Text Channels
            </h3>
            <button className="w-4 h-4 rounded-sm hover:bg-[var(--surface)] flex items-center justify-center transition-colors">
              <Plus className="w-3 h-3 text-[var(--muted)]" />
            </button>
          </div>
          <div className="space-y-1">
            {textChannels.map((channel) => (
              <button
                key={channel.id}
                onClick={() => onChannelSelect(channel.id)}
                className={`w-full flex items-center justify-between px-3 py-2 rounded-md transition-all duration-200 group ${
                  activeChannelId === channel.id
                    ? 'bg-[var(--surface)] text-[var(--text-primary)]'
                    : 'text-[var(--muted)] hover:bg-[var(--surface)] hover:text-[var(--text-secondary)]'
                }`}
              >
                <div className="flex items-center space-x-3">
                  <Hash className="w-4 h-4" />
                  <span className="text-sm font-medium">{channel.name}</span>
                </div>
                {channel.unreadCount && channel.unreadCount > 0 && (
                  <span className="bg-red-500 text-white text-xs rounded-full px-2 py-0.5 min-w-[18px] text-center">
                    {channel.unreadCount > 99 ? '99+' : channel.unreadCount}
                  </span>
                )}
              </button>
            ))}
          </div>
        </div>

        {/* Voice Channels */}
        <div className="p-4">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-xs font-semibold text-[var(--muted)] uppercase tracking-wider">
              Voice Chat
            </h3>
            <button className="w-4 h-4 rounded-sm hover:bg-[var(--surface)] flex items-center justify-center transition-colors">
              <Plus className="w-3 h-3 text-[var(--muted)]" />
            </button>
          </div>
          <div className="space-y-2">
            {voiceChannels.map((channel) => (
              <button
                key={channel.id}
                onClick={() => onChannelSelect(channel.id)}
                className={`w-full flex items-center justify-between px-3 py-2 rounded-md transition-all duration-200 group ${
                  activeChannelId === channel.id
                    ? 'bg-[var(--surface)] text-[var(--text-primary)]'
                    : 'text-[var(--muted)] hover:bg-[var(--surface)] hover:text-[var(--text-secondary)]'
                }`}
              >
                <div className="flex items-center space-x-3">
                  <Volume2 className="w-4 h-4" />
                  <span className="text-sm font-medium">{channel.name}</span>
                </div>
                {channel.members && channel.members > 0 && (
                  <div className="flex items-center space-x-1">
                    <Users className="w-3 h-3" />
                    <span className="text-xs">{channel.members}</span>
                  </div>
                )}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Bottom User Panel */}
      <div className="mt-auto p-3 border-t border-[var(--divider)]">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="relative">
              <div className="w-8 h-8 rounded-full bg-gradient-to-r from-purple-500 to-blue-500 flex items-center justify-center text-sm font-semibold text-white">
                {currentUser.avatar}
              </div>
              <div className={`absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full border-2 border-[var(--panel-dark)] ${getStatusColor(currentUser.status)}`}></div>
            </div>
            <div>
              <div className="text-sm font-medium text-[var(--text-primary)]">{currentUser.name}</div>
              <div className="text-xs text-[var(--muted)]">#{currentUser.id}</div>
            </div>
          </div>
          <div className="flex items-center space-x-1">
            <button className="w-8 h-8 rounded-md hover:bg-[var(--surface)] flex items-center justify-center transition-colors" title="Settings">
              <Settings className="w-4 h-4 text-[var(--muted)]" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}