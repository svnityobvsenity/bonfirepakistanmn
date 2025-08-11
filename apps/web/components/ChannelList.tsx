'use client'

import React from 'react'

interface Channel {
  id: string
  name: string
  type: 'text' | 'voice'
  active?: boolean
}

const channels: Channel[] = [
  { id: '1', name: 'general', type: 'text', active: true },
  { id: '2', name: 'random', type: 'text' },
  { id: '3', name: 'tech-talk', type: 'text' },
  { id: '4', name: 'General', type: 'voice' },
  { id: '5', name: 'Gaming', type: 'voice' },
]

const ChannelIcon = ({ type }: { type: 'text' | 'voice' }) => {
  if (type === 'text') {
    return (
      <svg className="w-5 h-5 mr-1.5 text-discord-text-muted" fill="currentColor" viewBox="0 0 24 24">
        <path d="M5.503 4.627 5.5 6.75v10.504a3.25 3.25 0 0 0 3.25 3.25h8.5a3.25 3.25 0 0 0 3.25-3.25V8.375a4.625 4.625 0 0 0-4.625-4.625H8.753a3.25 3.25 0 0 0-3.25 3.877Z"/>
      </svg>
    )
  }
  
  return (
    <svg className="w-5 h-5 mr-1.5 text-discord-text-muted" fill="currentColor" viewBox="0 0 24 24">
      <path d="M12 2a10 10 0 1 0 10 10A10.011 10.011 0 0 0 12 2ZM8.5 7.5a1.5 1.5 0 1 1-1.5 1.5A1.5 1.5 0 0 1 8.5 7.5Zm7 0A1.5 1.5 0 1 1 14 9a1.5 1.5 0 0 1 1.5-1.5ZM12 17a6 6 0 0 1-5.09-2.81 1 1 0 0 1 1.71-1.06A4 4 0 0 0 12 15a4 4 0 0 0 3.38-1.87 1 1 0 0 1 1.71 1.06A6 6 0 0 1 12 17Z"/>
    </svg>
  )
}

export default function ChannelList() {
  const textChannels = channels.filter(channel => channel.type === 'text')
  const voiceChannels = channels.filter(channel => channel.type === 'voice')

  return (
    <div className="w-channel-list bg-discord-secondary flex flex-col h-screen">
      {/* Server header */}
      <div className="h-12 px-4 flex items-center border-b border-discord-divider shadow-sm">
        <h1 className="text-white font-semibold text-base">Bonfire Server</h1>
        <svg className="w-4 h-4 ml-auto text-discord-text-muted hover:text-white cursor-pointer" fill="currentColor" viewBox="0 0 24 24">
          <path d="M7.41 8.59L12 13.17l4.59-4.58L18 10l-6 6-6-6 1.41-1.41z"/>
        </svg>
      </div>

      {/* Channel list */}
      <div className="flex-1 overflow-y-auto scrollbar-thin p-2">
        {/* Text Channels */}
        <div className="mb-6">
          <div className="flex items-center px-2 py-1.5 text-xs font-semibold text-discord-text-muted uppercase tracking-wide">
            <svg className="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 24 24">
              <path d="M7.41 8.59L12 13.17l4.59-4.58L18 10l-6 6-6-6 1.41-1.41z"/>
            </svg>
            Text Channels
            <svg className="w-4 h-4 ml-auto hover:text-white cursor-pointer" fill="currentColor" viewBox="0 0 24 24">
              <path d="M20 11H13V4a1 1 0 0 0-2 0v7H4a1 1 0 0 0 0 2h7v7a1 1 0 0 0 2 0v-7h7a1 1 0 0 0 0-2z"/>
            </svg>
          </div>
          
          {textChannels.map((channel) => (
            <div 
              key={channel.id} 
              className={`channel-item flex items-center text-sm ${
                channel.active ? 'active' : ''
              }`}
            >
              <ChannelIcon type={channel.type} />
              # {channel.name}
            </div>
          ))}
        </div>

        {/* Voice Channels */}
        <div>
          <div className="flex items-center px-2 py-1.5 text-xs font-semibold text-discord-text-muted uppercase tracking-wide">
            <svg className="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 24 24">
              <path d="M7.41 8.59L12 13.17l4.59-4.58L18 10l-6 6-6-6 1.41-1.41z"/>
            </svg>
            Voice Channels
            <svg className="w-4 h-4 ml-auto hover:text-white cursor-pointer" fill="currentColor" viewBox="0 0 24 24">
              <path d="M20 11H13V4a1 1 0 0 0-2 0v7H4a1 1 0 0 0 0 2h7v7a1 1 0 0 0 2 0v-7h7a1 1 0 0 0 0-2z"/>
            </svg>
          </div>
          
          {voiceChannels.map((channel) => (
            <div 
              key={channel.id} 
              className="channel-item flex items-center text-sm"
            >
              <ChannelIcon type={channel.type} />
              {channel.name}
            </div>
          ))}
        </div>
      </div>

      {/* User panel */}
      <div className="h-14 bg-discord-tertiary px-2 flex items-center">
        <div className="flex items-center flex-1 min-w-0">
          <div className="relative">
            <div className="avatar bg-indigo-500 w-8 h-8 text-xs">
              U
            </div>
            <div className="status-indicator status-online"></div>
          </div>
          <div className="ml-2 flex-1 min-w-0">
            <div className="text-sm font-medium text-white truncate">User</div>
            <div className="text-xs text-discord-text-muted truncate">#1234</div>
          </div>
        </div>
        
        {/* User controls */}
        <div className="flex space-x-2">
          <button className="p-1 text-discord-text-muted hover:text-white transition-colors">
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
            </svg>
          </button>
          <button className="p-1 text-discord-text-muted hover:text-white transition-colors">
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
            </svg>
          </button>
          <button className="p-1 text-discord-text-muted hover:text-white transition-colors">
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
              <path d="M19.14 12.94c.04-.3.06-.61.06-.94 0-.32-.02-.64-.07-.94l2.03-1.58c.18-.14.23-.41.12-.61l-1.92-3.32c-.12-.22-.37-.29-.59-.22l-2.39.96c-.5-.38-1.03-.7-1.62-.94l-.36-2.54c-.04-.24-.24-.41-.48-.41h-3.84c-.24 0-.43.17-.47.41l-.36 2.54c-.59.24-1.13.57-1.62.94l-2.39-.96c-.22-.08-.47 0-.59.22L2.74 8.87c-.12.21-.08.47.12.61l2.03 1.58c-.05.3-.09.63-.09.94s.02.64.07.94l-2.03 1.58c-.18.14-.23.41-.12.61l1.92 3.32c.12.22.37.29.59.22l2.39-.96c.5.38 1.03.7 1.62.94l.36 2.54c.05.24.24.41.48.41h3.84c.24 0 .44-.17.47-.41l.36-2.54c.59-.24 1.13-.56 1.62-.94l2.39.96c.22.08.47 0 .59-.22l1.92-3.32c.12-.22.07-.47-.12-.61l-2.01-1.58zM12 15.6c-1.98 0-3.6-1.62-3.6-3.6s1.62-3.6 3.6-3.6 3.6 1.62 3.6 3.6-1.62 3.6-3.6 3.6z"/>
            </svg>
          </button>
        </div>
      </div>
    </div>
  )
}
