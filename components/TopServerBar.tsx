'use client';

import React from 'react';

interface TopServerBarProps {
  setActivePage: (page: string) => void;
  activePage: string;
}

export default function TopServerBar({ setActivePage, activePage }: TopServerBarProps) {
  const apps = [
    { id: 'dms', icon: '💬', label: 'DMs', color: 'from-blue-500 to-blue-600' },
    { id: 'server', icon: '🇵🇰', label: 'Pakistan Community', color: 'from-green-500 to-green-600' },
    { id: 'islam', icon: '🕌', label: 'Islam Server', color: 'from-emerald-500 to-emerald-600' },
    { id: 'tech', icon: '💻', label: 'Tech Hub', color: 'from-purple-500 to-purple-600' },
    { id: 'cricket', icon: '🏏', label: 'Cricket Zone', color: 'from-orange-500 to-orange-600' },
    { id: 'food', icon: '🍛', label: 'Desi Food', color: 'from-red-500 to-red-600' },
    { id: 'memes', icon: '😂', label: 'Pakistani Memes', color: 'from-yellow-500 to-yellow-600' },
    { id: 'study', icon: '📚', label: 'Study Group', color: 'from-indigo-500 to-indigo-600' },
  ];

  return (
    <header className="flex items-center justify-between h-[48px] px-[16px] bg-[var(--panel-mid)] border-b-[var(--borders-hairline)]">
      <div className="flex items-center space-x-[16px]">
        <div className="flex space-x-[8px]">
          {apps.map((app) => (
            <div key={app.id} className="relative group">
              <button
                className={`w-[36px] h-[36px] rounded-full flex items-center justify-center text-lg transition-all duration-300 ease-out transform hover:scale-110 hover:-translate-y-1 ${
                  activePage === app.id 
                    ? `bg-gradient-to-r ${app.color} shadow-lg scale-110` 
                    : 'bg-[var(--surface)] hover:bg-gradient-to-r hover:from-white/10 hover:to-white/20'
                } ${
                  activePage === app.id ? 'animate-pulse' : 'hover:animate-bounce'
                }`}
                onClick={() => setActivePage(app.id)}
                title={app.label}
              >
                <span className={`transition-all duration-300 ${
                  activePage === app.id ? 'animate-wiggle' : 'group-hover:animate-spin'
                }`}>
                  {app.icon}
                </span>
              </button>
              
              {/* Tooltip */}
              <div className="absolute top-full mt-2 left-1/2 transform -translate-x-1/2 bg-black/80 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap z-50">
                {app.label}
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="flex items-center space-x-[12px]">
        <div className="relative">
          <input
            type="text"
            placeholder="Search..."
            className="h-[36px] w-[180px] bg-[rgba(255,255,255,0.02)] rounded-[8px] px-[12px] text-sm text-[var(--text-primary)] placeholder-[rgba(198,200,202,0.45)] focus:outline-none focus:ring-1 focus:ring-[var(--accent-purple)]"
          />
          <svg className="absolute right-3 top-1/2 -translate-y-1/2 w-[18px] h-[18px] text-[rgba(255,255,255,0.6)]" fill="currentColor" viewBox="0 0 24 24">
            <path d="M15.5 14h-.79l-.28-.27C15.41 12.59 16 11.11 16 9.5 16 5.91 13.09 3 9.5 3S3 5.91 3 9.5 5.91 16 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zM9.5 14C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z"/>
          </svg>
        </div>
        <div className="flex items-center space-x-2 bg-[var(--surface)] rounded-full pl-2 pr-3 py-1">
          <div className="w-6 h-6 rounded-full bg-[var(--accent-purple)] flex items-center justify-center text-xs font-semibold">K</div>
          <span className="text-sm text-[var(--text-primary)]">Kaif#001</span>
        </div>
      </div>
    </header>
  );
}
