'use client'

import React from 'react'
import { sampleMessages, type Message } from '../data/sampleMessages'

const getStatusColor = (status: string) => {
  switch (status) {
    case 'online': return 'bg-green-500'
    case 'idle': return 'bg-yellow-500'
    case 'dnd': return 'bg-red-500'
    case 'offline': return 'bg-gray-500'
    default: return 'bg-gray-500'
  }
}

const getAvatarColor = (name: string) => {
  const colors = [
    'bg-red-500',
    'bg-blue-500', 
    'bg-green-500',
    'bg-yellow-500',
    'bg-purple-500',
    'bg-pink-500',
    'bg-indigo-500',
    'bg-teal-500',
  ]
  
  const hash = name.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0)
  return colors[hash % colors.length]
}

const MessageItem = ({ message }: { message: Message }) => {
  return (
    <div className="message-item group relative">
      <div className="flex items-start space-x-4">
        <div className="relative mt-0.5">
          <div className={`avatar ${getAvatarColor(message.author.name)}`}>
            {message.author.avatar}
          </div>
          <div className={`status-indicator ${getStatusColor(message.author.status)}`}></div>
        </div>
        
        <div className="flex-1 min-w-0">
          <div className="flex items-baseline space-x-2 mb-1">
            <span className="font-medium text-white text-base">
              {message.author.name}
            </span>
            <span className="text-xs text-discord-text-muted">
              {message.timestamp}
            </span>
          </div>
          
          <div className="text-discord-text-primary leading-relaxed">
            {message.content}
          </div>
        </div>

        {/* Message actions (show on hover) */}
        <div className="absolute top-0 right-4 bg-discord-primary border border-discord-divider rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex">
          <button className="p-1 hover:bg-discord-hover rounded text-discord-text-muted hover:text-white">
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
            </svg>
          </button>
          <button className="p-1 hover:bg-discord-hover rounded text-discord-text-muted hover:text-white">
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
            </svg>
          </button>
          <button className="p-1 hover:bg-discord-hover rounded text-discord-text-muted hover:text-white">
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 8c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2zm0 2c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm0 6c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2z"/>
            </svg>
          </button>
        </div>
      </div>
    </div>
  )
}

export default function ChatWindow() {
  return (
    <div className="flex-1 flex flex-col bg-discord-primary h-screen">
      {/* Chat header */}
      <div className="h-12 px-4 flex items-center border-b border-discord-divider bg-discord-primary shadow-sm">
        <div className="flex items-center">
          <svg className="w-6 h-6 mr-2 text-discord-text-muted" fill="currentColor" viewBox="0 0 24 24">
            <path d="M5.503 4.627 5.5 6.75v10.504a3.25 3.25 0 0 0 3.25 3.25h8.5a3.25 3.25 0 0 0 3.25-3.25V8.375a4.625 4.625 0 0 0-4.625-4.625H8.753a3.25 3.25 0 0 0-3.25 3.877Z"/>
          </svg>
          <span className="font-semibold text-white mr-2">general</span>
          <div className="w-px h-6 bg-discord-divider mx-2"></div>
          <span className="text-sm text-discord-text-muted">General discussion and chat</span>
        </div>

        {/* Header actions */}
        <div className="ml-auto flex items-center space-x-4">
          <button className="text-discord-text-muted hover:text-white transition-colors">
            <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
            </svg>
          </button>
          <button className="text-discord-text-muted hover:text-white transition-colors">
            <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
              <path d="M15.5 14h-.79l-.28-.27C15.41 12.59 16 11.11 16 9.5 16 5.91 13.09 3 9.5 3S3 5.91 3 9.5 5.91 16 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z"/>
            </svg>
          </button>
          <button className="text-discord-text-muted hover:text-white transition-colors">
            <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 8c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2zm0 2c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm0 6c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2z"/>
            </svg>
          </button>
        </div>
      </div>

      {/* Messages area */}
      <div className="flex-1 overflow-y-auto scrollbar-thin">
        {/* Welcome message */}
        <div className="p-4 pb-0">
          <div className="flex items-center justify-center mb-4">
            <div className="w-16 h-16 bg-discord-hover rounded-full flex items-center justify-center">
              <svg className="w-8 h-8 text-discord-text-muted" fill="currentColor" viewBox="0 0 24 24">
                <path d="M5.503 4.627 5.5 6.75v10.504a3.25 3.25 0 0 0 3.25 3.25h8.5a3.25 3.25 0 0 0 3.25-3.25V8.375a4.625 4.625 0 0 0-4.625-4.625H8.753a3.25 3.25 0 0 0-3.25 3.877Z"/>
              </svg>
            </div>
          </div>
          <div className="text-center mb-2">
            <h2 className="text-3xl font-bold text-white mb-2">Welcome to #general!</h2>
            <p className="text-discord-text-muted">This is the start of the #general channel.</p>
          </div>
        </div>

        {/* Messages */}
        <div className="pb-4">
          {sampleMessages.map((message) => (
            <MessageItem key={message.id} message={message} />
          ))}
        </div>
      </div>

      {/* Message input */}
      <div className="p-4">
        <div className="bg-discord-hover rounded-lg">
          <div className="flex items-center px-4 py-3">
            <button className="text-discord-text-muted hover:text-white transition-colors mr-4">
              <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                <path d="M20 11H13V4a1 1 0 0 0-2 0v7H4a1 1 0 0 0 0 2h7v7a1 1 0 0 0 2 0v-7h7a1 1 0 0 0 0-2z"/>
              </svg>
            </button>
            
            <input 
              type="text" 
              placeholder="Message #general"
              className="flex-1 bg-transparent text-white placeholder-discord-text-muted focus:outline-none"
            />
            
            <div className="flex items-center space-x-2 ml-4">
              <button className="text-discord-text-muted hover:text-white transition-colors">
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
                </svg>
              </button>
              <button className="text-discord-text-muted hover:text-white transition-colors">
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
                </svg>
              </button>
              <button className="text-discord-text-muted hover:text-white transition-colors">
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
                </svg>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
