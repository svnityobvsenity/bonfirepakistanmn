'use client';

import React from 'react';

export default function DMsPage() {
  const friends = [
    { id: 1, name: 'Ahmed', status: '🟢 Online' },
    { id: 2, name: 'Fatima', status: '🟡 Away' },
    { id: 3, name: 'Ali', status: '🔴 Do Not Disturb' },
    { id: 4, name: 'Sara', status: '⚫ Offline' },
    { id: 5, name: 'Hassan', status: '🟢 Online' },
  ];

  return (
    <div className="flex flex-1">
      {/* Left Friends Panel */}
      <aside className="w-[280px] flex flex-col" style={{ backgroundColor: 'var(--panel-dark)' }}>
        <div className="p-4">
          <h2 className="text-lg font-semibold mb-4">Friends</h2>
          <div className="space-y-2 mb-6">
            <div className="flex items-center text-sm">
              <span className="w-2 h-2 rounded-full bg-[var(--accent-green)] mr-2"></span>
              <span>Inbox</span>
            </div>
          </div>
          
          <h3 className="text-sm font-medium mb-3 opacity-60">PINNED MESSAGES</h3>
          <div className="mb-6">
            <div className="text-sm opacity-60">No pinned messages yet</div>
          </div>

          <h3 className="text-sm font-medium mb-3 opacity-60">DIRECT MESSAGES</h3>
          <div className="space-y-1">
            {friends.map((friend) => (
              <div key={friend.id} className="flex items-center p-2 rounded hover:bg-[var(--surface)] cursor-pointer">
                <div className="w-8 h-8 rounded-full bg-[var(--accent-purple)] flex items-center justify-center text-sm font-semibold mr-3">
                  {friend.name.charAt(0)}
                </div>
                <div>
                  <div className="text-sm">{friend.name}</div>
                  <div className="text-xs opacity-60">{friend.status}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Bottom user panel with controls */}
        <div className="mt-auto p-3 border-t" style={{ borderColor: 'var(--divider)' }}>
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <div className="relative">
                <div className="w-8 h-8 rounded-full bg-[var(--accent-purple)]" />
                <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full" style={{ backgroundColor: 'var(--accent-green)', border: '2px solid var(--panel-dark)' }} />
              </div>
              <div>
                <div className="text-sm font-medium">Kaif#001</div>
                <div className="text-xs opacity-60">#0001</div>
              </div>
            </div>
            <div className="flex gap-1">
              {/* Mute */}
              <button className="w-8 h-8 rounded-md hover:bg-white/5 flex items-center justify-center" title="Mute">
                <svg className="w-5 h-5 opacity-80" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 14c1.66 0 2.99-1.34 2.99-3L15 5c0-1.66-1.34-3-3-3S9 3.34 9 5v6c0 1.66 1.34 3 3 3zm5.3-3c0 3-2.54 5.1-5.3 5.1S6.7 14 6.7 11H5c0 3.41 2.72 6.23 6 6.72V21h2v-3.28c3.28-.48 6-3.3 6-6.72h-1.7z"/>
                </svg>
              </button>
              {/* Deafen */}
              <button className="w-8 h-8 rounded-md hover:bg-white/5 flex items-center justify-center" title="Deafen">
                <svg className="w-5 h-5 opacity-80" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M3 9v6h4l5 5V4L7 9H3zm13.5 3c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02zM14 3.23v2.06c2.89.86 5 3.54 5 6.71s-2.11 5.85-5 6.71v2.06c4.01-.91 7-4.49 7-8.77s-2.99-7.86-7-8.77z"/>
                </svg>
              </button>
              {/* Settings */}
              <button className="w-8 h-8 rounded-md hover:bg-white/5 flex items-center justify-center" title="Settings">
                <svg className="w-5 h-5 opacity-80" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M19.14 12.94c.04-.3.06-.61.06-.94 0-.32-.02-.64-.07-.94l2.03-1.58c.18-.14.23-.41.12-.61l-1.92-3.32c-.12-.22-.37-.29-.59-.22l-2.39.96c-.5-.38-1.03-.7-1.62-.94l-.36-2.54c-.04-.24-.24-.41-.48-.41h-3.84c-.24 0-.43.17-.47.41l-.36 2.54c-.59.24-1.13.57-1.62.94l-2.39-.96c-.22-.08-.47 0-.59.22L2.74 8.87c-.12.21-.08.47.12.61l2.03 1.58c-.05.3-.09.63-.09.94s.02.64.07.94l-2.03 1.58c-.18.14-.23.41-.12.61l1.92 3.32c.12.22.37.29.59.22l2.39-.96c.5.38 1.03.7 1.62.94l.36 2.54c.05.24.24.41.48.41h3.84c.24 0 .44-.17.47-.41l.36-2.54c.59-.24 1.13-.56 1.62-.94l2.39.96c.22.08.47 0 .59-.22l1.92-3.32c.12-.22.07-.47-.12-.61l-2.01-1.58zM12 15.6c-1.98 0-3.6-1.62-3.6-3.6s1.62-3.6 3.6-3.6 3.6 1.62 3.6 3.6-1.62 3.6-3.6 3.6z"/>
                </svg>
              </button>
            </div>
          </div>
        </div>
      </aside>

      {/* Chat column */}
      <main className="flex-1 flex flex-col" style={{ backgroundColor: 'var(--bg)' }}>
        {/* Header */}
        <div className="h-12 flex items-center justify-between px-4 border-b" style={{ borderColor: 'var(--divider)' }}>
          <div className="flex items-center">
            <div className="w-6 h-6 rounded-full bg-[var(--accent-purple)] flex items-center justify-center text-xs font-semibold mr-2">
              D
            </div>
            <span className="font-semibold">daFoxy</span>
          </div>
          <div className="text-xs opacity-60">Today at 3:42 PM</div>
        </div>

        {/* Messages */}
        <div className="flex-1 p-4 space-y-4">
          <div className="flex items-start space-x-3">
            <div className="w-10 h-10 rounded-full bg-[var(--accent-purple)] flex items-center justify-center font-semibold">
              D
            </div>
            <div>
              <div className="flex items-center space-x-2 mb-1">
                <span className="font-semibold">daFoxy</span>
                <span className="text-xs opacity-60">Today at 3:42 PM</span>
              </div>
              <div className="text-[var(--text-secondary)]">
                yo bro whats good
              </div>
            </div>
          </div>

          <div className="flex items-start space-x-3">
            <div className="w-10 h-10 rounded-full bg-[var(--accent-blue)] flex items-center justify-center font-semibold">
              K
            </div>
            <div>
              <div className="flex items-center space-x-2 mb-1">
                <span className="font-semibold">Kaif</span>
                <span className="text-xs opacity-60">Today at 3:43 PM</span>
              </div>
              <div className="text-[var(--text-secondary)]">
                nothing much just working on some projects
              </div>
            </div>
          </div>
        </div>

        {/* Message Input */}
        <div className="p-4">
          <div className="flex items-center bg-[var(--input-bg)] rounded-lg px-4 py-3">
            <input
              type="text"
              placeholder="Message @daFoxy"
              className="flex-1 bg-transparent text-[var(--text-primary)] placeholder-[var(--muted)] outline-none"
            />
            <div className="flex items-center space-x-2 ml-4">
              <button className="text-[var(--icon)] hover:text-[var(--text-primary)]">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
                </svg>
              </button>
              <button className="text-[var(--icon)] hover:text-[var(--text-primary)]">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M9 11H7v3h2v-3zm4 0h-2v3h2v-3zm4 0h-2v3h2v-3zm2-7h-1V2h-2v2H8V2H6v2H5c-1.1 0-1.99.9-1.99 2L3 20c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 16H5V9h14v11z"/>
                </svg>
              </button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
