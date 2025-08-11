'use client';

import React from 'react';

export default function ServerPage() {
  const voiceMembers = [
    { id: 1, name: 'Ahmed', avatar: 'A' },
    { id: 2, name: 'Fatima', avatar: 'F' },
    { id: 3, name: 'Ali', avatar: 'A' },
    { id: 4, name: 'Sara', avatar: 'S' },
    { id: 5, name: 'Hassan', avatar: 'H' },
    { id: 6, name: 'Zara', avatar: 'Z' },
  ];

  return (
    <div className="flex flex-1">
      {/* Left Server Panel */}
      <aside className="w-[280px] flex flex-col" style={{ backgroundColor: 'var(--panel-dark)' }}>
        {/* Server Banner */}
        <div className="h-[120px] bg-gradient-to-r from-[var(--accent-purple)] to-[var(--accent-blue)] relative">
          <div className="absolute bottom-4 left-4">
            <div className="w-16 h-16 rounded-full bg-[var(--surface)] flex items-center justify-center text-2xl font-bold border-4 border-[var(--panel-dark)]">
              T
            </div>
          </div>
        </div>

        {/* Server Info */}
        <div className="p-4 border-b" style={{ borderColor: 'var(--divider)' }}>
          <h2 className="text-xl font-bold mb-1">Type shi</h2>
          <p className="text-sm opacity-60 mb-3">A community for sharing thoughts and ideas</p>
          <div className="flex items-center space-x-4 text-sm">
            <div className="flex items-center">
              <div className="w-2 h-2 rounded-full bg-[var(--accent-green)] mr-1"></div>
              <span>1,234 Online</span>
            </div>
            <div className="flex items-center">
              <div className="w-2 h-2 rounded-full bg-[var(--muted)] mr-1"></div>
              <span>5,678 Members</span>
            </div>
          </div>
        </div>

        {/* Text Channels */}
        <div className="p-4 border-b" style={{ borderColor: 'var(--divider)' }}>
          <h3 className="text-sm font-medium mb-3 opacity-60">TEXT CHANNELS</h3>
          <div className="space-y-1">
            <div className="flex items-center p-2 rounded bg-[var(--surface)] cursor-pointer">
              <span className="text-[var(--muted)] mr-2">#</span>
              <span className="text-sm">general</span>
            </div>
            <div className="flex items-center p-2 rounded hover:bg-[var(--surface)] cursor-pointer">
              <span className="text-[var(--muted)] mr-2">#</span>
              <span className="text-sm">random</span>
            </div>
            <div className="flex items-center p-2 rounded hover:bg-[var(--surface)] cursor-pointer">
              <span className="text-[var(--muted)] mr-2">#</span>
              <span className="text-sm">media</span>
              <div className="ml-auto w-2 h-2 rounded-full bg-[var(--accent-blue)]"></div>
            </div>
          </div>
        </div>

        {/* Voice Chat Grid */}
        <div className="flex-1 p-4">
          <h3 className="text-sm font-medium mb-3 opacity-60">VOICE CHAT</h3>
          <div className="grid grid-cols-2 gap-2">
            {voiceMembers.map((member) => (
              <div key={member.id} className="flex flex-col items-center p-3 rounded bg-[var(--surface)]">
                <div className="w-12 h-12 rounded-full bg-[var(--accent-purple)] flex items-center justify-center text-lg font-semibold mb-2">
                  {member.avatar}
                </div>
                <span className="text-xs text-center">{member.name}</span>
              </div>
            ))}
          </div>
        </div>
      </aside>

      {/* Chat column */}
      <main className="flex-1 flex flex-col" style={{ backgroundColor: 'var(--bg)' }}>
        {/* Header */}
        <div className="h-12 flex items-center justify-between px-4 border-b" style={{ borderColor: 'var(--divider)' }}>
          <div className="flex items-center">
            <span className="text-[var(--muted)] mr-2">#</span>
            <span className="font-semibold">media</span>
            <div className="ml-2 w-2 h-2 rounded-full bg-[var(--accent-blue)]"></div>
          </div>
          <div className="text-xs opacity-60">1,234 members online</div>
        </div>

        {/* Messages */}
        <div className="flex-1 p-4 space-y-4">
          <div className="flex items-start space-x-3">
            <div className="w-10 h-10 rounded-full bg-[var(--accent-orange)] flex items-center justify-center font-semibold">
              T
            </div>
            <div>
              <div className="flex items-center space-x-2 mb-1">
                <span className="font-semibold">tnuvv</span>
                <span className="text-xs opacity-60">Today at 4:20 PM</span>
              </div>
              <div className="mb-2">
                <img 
                  src="https://images.unsplash.com/photo-1565299624946-b28f40a0ca4b?w=300&h=200&fit=crop" 
                  alt="Pizza" 
                  className="rounded-lg max-w-[300px]"
                />
              </div>
            </div>
          </div>

          <div className="flex items-start space-x-3">
            <div className="w-10 h-10 rounded-full bg-[var(--accent-green)] flex items-center justify-center font-semibold">
              C
            </div>
            <div>
              <div className="flex items-center space-x-2 mb-1">
                <span className="font-semibold">crazy</span>
                <span className="text-xs opacity-60">Today at 4:21 PM</span>
              </div>
              <div className="text-[var(--text-secondary)]">
                keyboard warriors are real 😂😂😂
              </div>
            </div>
          </div>
        </div>

        {/* Message Input */}
        <div className="p-4">
          <div className="flex items-center bg-[var(--input-bg)] rounded-lg px-4 py-3">
            <input
              type="text"
              placeholder="Message #media"
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

        {/* Bottom Action Buttons */}
        <div className="flex justify-center space-x-4 p-4 border-t" style={{ borderColor: 'var(--divider)' }}>
          <button className="flex items-center space-x-2 px-4 py-2 bg-[var(--accent-blue)] rounded-lg hover:bg-opacity-80">
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
            </svg>
            <span className="text-sm font-medium">Join Voice</span>
          </button>
          <button className="flex items-center space-x-2 px-4 py-2 bg-[var(--surface)] rounded-lg hover:bg-[var(--bg-elevated)]">
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
              <path d="M18 16.08c-.76 0-1.44.3-1.96.77L8.91 12.7c.05-.23.09-.46.09-.7s-.04-.47-.09-.7l7.05-4.11c.54.5 1.25.81 2.04.81 1.66 0 3-1.34 3-3s-1.34-3-3-3-3 1.34-3 3c0 .24.04.47.09.7L8.04 9.81C7.5 9.31 6.79 9 6 9c-1.66 0-3 1.34-3 3s1.34 3 3 3c.79 0 1.50-.31 2.04-.81l7.12 4.16c-.05.21-.08.43-.08.65 0 1.61 1.31 2.92 2.92 2.92s2.92-1.31 2.92-2.92-1.31-2.92-2.92-2.92z"/>
            </svg>
            <span className="text-sm font-medium">Share</span>
          </button>
          <button className="flex items-center space-x-2 px-4 py-2 bg-[var(--surface)] rounded-lg hover:bg-[var(--bg-elevated)]">
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm3.5 6L12 10.5 8.5 8 12 5.5 15.5 8zM8.5 16L12 13.5 15.5 16 12 18.5 8.5 16z"/>
            </svg>
            <span className="text-sm font-medium">React</span>
          </button>
        </div>
      </main>
    </div>
  );
}
