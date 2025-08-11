'use client';

import React from 'react';

interface TopServerBarProps {
  setActivePage: (page: string) => void;
  activePage: string;
}

export default function TopServerBar({ setActivePage, activePage }: TopServerBarProps) {
  const apps = [
    { id: 'dms', icon: 'B', label: 'DMs' },
    { id: 'server', icon: null, label: 'Type shi' },
    { id: 'club', icon: null, label: 'The Club' },
    { id: 'files', icon: null, label: 'Files' },
    { id: 'ig', icon: null, label: 'Instagram' },
    { id: 'code', icon: null, label: 'Code' },
    { id: 'github', icon: null, label: 'GitHub' },
    { id: 'chatgpt', icon: null, label: 'ChatGPT' },
    { id: 'google', icon: null, label: 'Google' },
    { id: 'firebase', icon: null, label: 'Firebase' },
    { id: 'microsoft', icon: null, label: 'Microsoft' },
    { id: 'youtube', icon: null, label: 'YouTube' },
  ];

  return (
    <header className="flex items-center justify-between h-[48px] px-[16px] bg-[var(--panel-mid)] border-b-[var(--borders-hairline)]">
      <div className="flex items-center space-x-[16px]">
        <button
          className={`w-[36px] h-[36px] rounded-full flex items-center justify-center text-lg font-bold transition-all duration-120 ease ${
            activePage === 'dms' ? 'bg-[var(--accent-purple)]' : 'bg-[var(--surface)] hover:bg-[var(--bg-elevated)]'
          }`}
          onClick={() => setActivePage('dms')}
        >
          B
        </button>
        <div className="w-[1px] h-[24px] bg-[var(--divider)]"></div>
                    <div className="flex space-x-[8px]">
              {apps.map((app) => (
                <button
                  key={app.id}
                  className={`w-[36px] h-[36px] rounded-full flex items-center justify-center text-sm transition-all duration-120 ease ${
                    activePage === app.id ? 'bg-[var(--accent-purple)]' : 'bg-[var(--surface)] hover:bg-[var(--bg-elevated)]'
                  }`}
                  onClick={() => setActivePage(app.id)}
                >
                  {app.icon ? (
                    <span className="text-lg font-bold">{app.icon}</span>
                  ) : (
                    <svg className="w-[20px] h-[20px] text-white" fill="currentColor" viewBox="0 0 24 24">
                      <circle cx="12" cy="12" r="12" fill="currentColor"/>
                      {/* X symbol (top left) */}
                      <g transform="translate(6,6)">
                        <path d="M2 2 L6 6 M6 2 L2 6" stroke="#000" strokeWidth="1.5" strokeLinecap="round"/>
                      </g>
                      {/* Square (top right) */}
                      <g transform="translate(14,6)">
                        <rect x="1" y="1" width="4" height="4" fill="none" stroke="#000" strokeWidth="1.5" rx="0.5"/>
                      </g>
                      {/* Circle (bottom left) */}
                      <g transform="translate(6,14)">
                        <circle cx="3" cy="3" r="2.5" fill="none" stroke="#000" strokeWidth="1.5"/>
                      </g>
                      {/* Triangle (bottom right) */}
                      <g transform="translate(14,14)">
                        <path d="M3 1 L1 5 L5 5 Z" fill="none" stroke="#000" strokeWidth="1.5" strokeLinejoin="round"/>
                      </g>
                    </svg>
                  )}
                </button>
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
