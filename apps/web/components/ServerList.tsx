'use client'

import React from 'react'

interface Server {
  id: string
  name: string
  icon?: string
  initials: string
  active?: boolean
}

const servers: Server[] = [
  { id: '1', name: 'Home', initials: 'H', active: true },
  { id: '2', name: 'Gaming Server', initials: 'GS' },
  { id: '3', name: 'Work', initials: 'W' },
  { id: '4', name: 'Friends', initials: 'F' },
]

export default function ServerList() {
  return (
    <div className="w-server-list bg-discord-tertiary flex flex-col items-center py-3 space-y-2 h-screen overflow-y-auto scrollbar-thin">
      {/* Home Server - Special styling */}
      <div className="relative">
        <div className="server-icon active bg-discord-blurple">
          <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
            <path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057 19.9 19.9 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028c.462-.63.874-1.295 1.226-1.994a.076.076 0 0 0-.041-.106 13.107 13.107 0 0 1-1.872-.892.077.077 0 0 1-.008-.128 10.2 10.2 0 0 0 .372-.292.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127 12.299 12.299 0 0 1-1.873.892.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.839 19.839 0 0 0 6.002-3.03.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.03zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.956-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.955-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.946 2.418-2.157 2.418z"/>
          </svg>
        </div>
        {/* Active indicator */}
        <div className="absolute -left-1 top-0 bottom-0 w-1 bg-white rounded-r-full"></div>
      </div>

      {/* Divider */}
      <div className="w-8 h-0.5 bg-discord-divider rounded-full"></div>

      {/* Other servers */}
      {servers.slice(1).map((server) => (
        <div key={server.id} className="relative group">
          <div className="server-icon bg-discord-hover group-hover:bg-discord-blurple">
            {server.initials}
          </div>
          {/* Hover indicator */}
          <div className="absolute -left-1 top-1/2 transform -translate-y-1/2 w-1 h-2 bg-white rounded-r-full opacity-0 group-hover:opacity-100 transition-all duration-200"></div>
        </div>
      ))}

      {/* Add Server Button */}
      <div className="server-icon bg-discord-hover hover:bg-green-500">
        <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
          <path d="M20 11H13V4a1 1 0 0 0-2 0v7H4a1 1 0 0 0 0 2h7v7a1 1 0 0 0 2 0v-7h7a1 1 0 0 0 0-2z"/>
        </svg>
      </div>

      {/* Discover Servers Button */}
      <div className="server-icon bg-discord-hover hover:bg-green-500">
        <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
          <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
        </svg>
      </div>
    </div>
  )
}
