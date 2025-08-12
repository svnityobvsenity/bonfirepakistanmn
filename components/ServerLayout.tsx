'use client';

import React, { useState } from 'react';
import Sidebar from './Sidebar';

export default function ServerLayout() {
  const [activeChannelId, setActiveChannelId] = useState('general');

  const currentUser = {
    id: 'user1',
    name: 'Kaif',
    username: 'Kaif#001',
    avatar: 'K'
  };

  return (
    <div className="flex h-full">
      <Sidebar
        serverName="Bonfire Community"
        serverIcon="🔥"
        onChannelSelect={setActiveChannelId}
        activeChannelId={activeChannelId}
      />
      
      <div className="flex-1 flex flex-col bg-[var(--bg)]">
        {/* Chat Header */}
        <div className="h-16 flex items-center justify-between px-6 border-b border-[var(--divider)] bg-[var(--bg)]">
          <div className="flex items-center space-x-3">
            <span className="text-lg text-[var(--muted)]">#</span>
            <div>
              <h2 className="font-semibold text-[var(--text-primary)] text-sm">{activeChannelId}</h2>
              <p className="text-xs text-[var(--muted)]">Welcome to #{activeChannelId}</p>
            </div>
          </div>
          <div className="text-sm text-[var(--muted)]">1,247 members</div>
        </div>
        
        {/* Messages Area */}
        <div className="flex-1 overflow-y-auto px-4 py-6">
          <div className="space-y-6">
            <div className="flex items-start space-x-3">
              <div className="w-10 h-10 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 flex items-center justify-center text-sm font-semibold text-white">
                A
              </div>
              <div className="flex-1">
                <div className="flex items-center space-x-2 mb-2">
                  <span className="font-semibold text-[var(--text-primary)]">Ahmed</span>
                  <span className="text-xs text-[var(--muted)]">Today at 4:20 PM</span>
                </div>
                <div className="text-[var(--text-secondary)] leading-relaxed">
                  Welcome to the new Bonfire chat! 🔥 This looks amazing!
                </div>
              </div>
            </div>
            
            <div className="flex items-start space-x-3">
              <div className="w-10 h-10 rounded-full bg-gradient-to-r from-green-500 to-blue-500 flex items-center justify-center text-sm font-semibold text-white">
                S
              </div>
              <div className="flex-1">
                <div className="flex items-center space-x-2 mb-2">
                  <span className="font-semibold text-[var(--text-primary)]">Sara</span>
                  <span className="text-xs text-[var(--muted)]">Today at 4:22 PM</span>
                </div>
                <div className="text-[var(--text-secondary)] leading-relaxed">
                  I love the new design! Much cleaner than before 💙
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
              placeholder={`Message #${activeChannelId}`}
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
    </div>
  );
}
