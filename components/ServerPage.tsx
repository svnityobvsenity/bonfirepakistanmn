'use client';

import React, { useState } from 'react';

export default function ServerPage() {
  const [activeSection, setActiveSection] = useState('channels');

  const cityChannels = [
    { id: 1, name: 'Karachi Voice', type: 'voice', icon: '🏢', members: 45, landmark: 'Quaid Mausoleum' },
    { id: 2, name: 'Lahore Voice', type: 'voice', icon: '🕌', members: 32, landmark: 'Badshahi Mosque' },
    { id: 3, name: 'Islamabad Voice', type: 'voice', icon: '🕌', members: 28, landmark: 'Faisal Mosque' },
    { id: 4, name: 'Faisalabad Voice', type: 'voice', icon: '🏭', members: 15, landmark: 'Clock Tower' },
    { id: 5, name: 'Rawalpindi Voice', type: 'voice', icon: '⛰️', members: 12, landmark: 'Ayub Park' },
    { id: 6, name: 'Multan Voice', type: 'voice', icon: '🌾', members: 8, landmark: 'Shah Rukn Alam' },
    { id: 7, name: 'Peshawar Voice', type: 'voice', icon: '🏔️', members: 18, landmark: 'Bala Hissar' },
    { id: 8, name: 'Quetta Voice', type: 'voice', icon: '🏜️', members: 6, landmark: 'Ziarat Valley' },
  ];

  const interestChannels = [
    { id: 9, name: 'general-chat', type: 'text', icon: '💬', unread: 5 },
    { id: 10, name: 'pakistani-memes', type: 'text', icon: '😂', unread: 12 },
    { id: 11, name: 'cricket-discussions', type: 'text', icon: '🏏', unread: 3 },
    { id: 12, name: 'tech-talks', type: 'text', icon: '💻', unread: 0 },
    { id: 13, name: 'food-corner', type: 'text', icon: '🍛', unread: 7 },
    { id: 14, name: 'music-zone', type: 'text', icon: '🎵', unread: 2 },
    { id: 15, name: 'job-opportunities', type: 'text', icon: '💼', unread: 4 },
    { id: 16, name: 'study-group', type: 'text', icon: '📚', unread: 1 },
  ];

  const forumTopics = [
    { id: 1, title: 'Should Pakistan adopt cryptocurrency?', replies: 156, lastActive: '2 hours ago', category: 'Economy' },
    { id: 2, title: 'Best Pakistani universities for CS?', replies: 89, lastActive: '5 hours ago', category: 'Education' },
    { id: 3, title: 'Climate change impact in Pakistan', replies: 203, lastActive: '1 day ago', category: 'Environment' },
    { id: 4, title: 'Freelancing opportunities in Pakistan', replies: 127, lastActive: '3 hours ago', category: 'Career' },
    { id: 5, title: 'Traditional vs Modern Pakistani weddings', replies: 67, lastActive: '6 hours ago', category: 'Culture' },
  ];

  const upcomingHolidays = [
    { name: 'Eid ul-Fitr', date: '2024-04-10', daysLeft: 45, type: 'religious' },
    { name: 'Pakistan Day', date: '2024-03-23', daysLeft: 27, type: 'national' },
    { name: 'Iqbal Day', date: '2024-11-09', daysLeft: 234, type: 'national' },
    { name: 'Quaid-e-Azam Birthday', date: '2024-12-25', daysLeft: 280, type: 'national' },
  ];

  const renderChannels = () => (
    <div className="flex-1 overflow-y-auto">
      {/* Pakistani Cities Voice Channels */}
      <div className="p-4 border-b" style={{ borderColor: 'var(--divider)' }}>
        <h3 className="text-sm font-medium mb-3 opacity-60 tracking-wider flex items-center">
          <span className="mr-2">🇵🇰</span>
          CITY VOICE CHANNELS
        </h3>
        <div className="space-y-1">
          {cityChannels.map((channel) => (
            <div 
              key={channel.id} 
              className="flex items-center p-3 rounded-lg hover:bg-[var(--surface)] cursor-pointer transition-all duration-200 group hover:scale-102 hover:shadow-lg"
            >
              <div className="w-8 h-8 rounded-full bg-gradient-to-r from-green-500 to-green-600 flex items-center justify-center text-white font-bold mr-3 transition-transform duration-200 group-hover:rotate-12 group-hover:scale-110">
                {channel.icon}
              </div>
              <div className="flex-1">
                <div className="text-sm font-medium">{channel.name}</div>
                <div className="text-xs opacity-60">{channel.landmark}</div>
              </div>
              <div className="flex items-center space-x-2">
                <span className="text-xs bg-green-500/20 text-green-400 px-2 py-1 rounded-full animate-pulse">
                  {channel.members} online
                </span>
                <div className="w-3 h-3 rounded-full bg-green-500 animate-ping"></div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Interest Text Channels */}
      <div className="p-4">
        <h3 className="text-sm font-medium mb-3 opacity-60 tracking-wider flex items-center">
          <span className="mr-2">📱</span>
          INTEREST CHANNELS
        </h3>
        <div className="space-y-1">
          {interestChannels.map((channel) => (
            <div 
              key={channel.id} 
              className="flex items-center p-2 rounded-lg hover:bg-[var(--surface)] cursor-pointer transition-all duration-200 group hover:translate-x-2"
            >
              <span className="text-lg mr-3 transition-transform duration-200 group-hover:bounce">{channel.icon}</span>
              <span className="text-sm flex-1">#{channel.name}</span>
              {channel.unread > 0 && (
                <span className="text-xs bg-red-500 text-white rounded-full px-2 py-1 animate-bounce">
                  {channel.unread}
                </span>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  const renderForum = () => (
    <div className="flex-1 overflow-y-auto p-4">
      <h3 className="text-lg font-bold mb-4 flex items-center">
        <span className="mr-2">🗣️</span>
        Pakistani Forum & Debates
      </h3>
      <div className="space-y-3">
        {forumTopics.map((topic) => (
          <div 
            key={topic.id} 
            className="p-4 rounded-lg bg-[var(--surface)] hover:bg-[var(--bg-elevated)] cursor-pointer transition-all duration-200 hover:scale-102 hover:shadow-lg"
          >
            <div className="flex items-start justify-between mb-2">
              <h4 className="font-medium text-sm line-clamp-2 flex-1">{topic.title}</h4>
              <span className="text-xs bg-blue-500/20 text-blue-400 px-2 py-1 rounded-full ml-2">
                {topic.category}
              </span>
            </div>
            <div className="flex items-center justify-between text-xs opacity-60">
              <span>{topic.replies} replies</span>
              <span>{topic.lastActive}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const renderHolidays = () => (
    <div className="flex-1 overflow-y-auto p-4">
      <h3 className="text-lg font-bold mb-4 flex items-center">
        <span className="mr-2">📅</span>
        Pakistani Holidays & Events
      </h3>
      <div className="space-y-3">
        {upcomingHolidays.map((holiday, index) => (
          <div 
            key={index} 
            className={`p-4 rounded-lg transition-all duration-200 hover:scale-102 cursor-pointer ${
              holiday.type === 'religious' ? 'bg-green-500/10 border border-green-500/20' :
              'bg-white/5 border border-white/10'
            }`}
          >
            <div className="flex items-center justify-between">
              <div>
                <h4 className="font-medium">{holiday.name}</h4>
                <p className="text-sm opacity-60">{holiday.date}</p>
              </div>
              <div className="text-right">
                <div className={`text-lg font-bold ${
                  holiday.type === 'religious' ? 'text-green-400' : 'text-blue-400'
                }`}>
                  {holiday.daysLeft}
                </div>
                <div className="text-xs opacity-60">days left</div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const renderReports = () => (
    <div className="flex-1 overflow-y-auto p-4">
      <h3 className="text-lg font-bold mb-4 flex items-center">
        <span className="mr-2">⚠️</span>
        Report Issues
      </h3>
      <div className="bg-[var(--surface)] rounded-lg p-4 mb-4">
        <textarea
          placeholder="Describe your issue in detail (Roman Urdu supported)..."
          className="w-full h-32 bg-[var(--input-bg)] rounded-lg p-3 text-sm resize-none outline-none"
        />
        <div className="flex items-center justify-between mt-3">
          <button className="flex items-center space-x-2 px-3 py-2 bg-[var(--surface)] rounded-lg text-sm">
            <span>📎</span>
            <span>Attach Proof</span>
          </button>
          <button className="px-4 py-2 bg-red-500 hover:bg-red-600 rounded-lg text-sm font-medium transition-colors">
            Submit Report
          </button>
        </div>
      </div>
      
      <div className="text-sm opacity-60">
        <p className="mb-2">📝 Recent Reports:</p>
        <div className="space-y-2">
          <div className="p-3 bg-[var(--input-bg)] rounded-lg">
            <div className="flex justify-between items-center">
              <span>Spam in #general-chat</span>
              <span className="text-xs bg-yellow-500/20 text-yellow-400 px-2 py-1 rounded">Pending</span>
            </div>
          </div>
          <div className="p-3 bg-[var(--input-bg)] rounded-lg">
            <div className="flex justify-between items-center">
              <span>Inappropriate content reported</span>
              <span className="text-xs bg-green-500/20 text-green-400 px-2 py-1 rounded">Resolved</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="flex flex-1">
      {/* Left Server Panel */}
      <aside className="w-[280px] flex flex-col" style={{ backgroundColor: 'var(--panel-dark)' }}>
        {/* Server Banner */}
        <div className="h-[120px] bg-gradient-to-r from-green-600 to-green-500 relative overflow-hidden">
          <div className="absolute inset-0 bg-white/5"></div>
          <div className="absolute bottom-4 left-4">
            <div className="w-16 h-16 rounded-full bg-white flex items-center justify-center text-3xl border-4 border-green-600 shadow-lg transition-transform duration-200 hover:scale-110 hover:rotate-12">
              🇵🇰
            </div>
          </div>
        </div>

        {/* Server Info */}
        <div className="p-4 border-b" style={{ borderColor: 'var(--divider)' }}>
          <h2 className="text-xl font-bold mb-1 flex items-center">
            Pakistan Community
            <span className="ml-2 text-sm bg-green-500/20 text-green-400 px-2 py-1 rounded-full">
              ✨ Active
            </span>
          </h2>
          <p className="text-sm opacity-60 mb-3">Sab Pakistani bhai behn ka ghar 🏠</p>
          <div className="flex items-center space-x-4 text-sm">
            <div className="flex items-center">
              <div className="w-2 h-2 rounded-full bg-green-500 mr-1 animate-pulse"></div>
              <span>2,847 Online</span>
            </div>
            <div className="flex items-center">
              <div className="w-2 h-2 rounded-full bg-[var(--muted)] mr-1"></div>
              <span>15,234 Members</span>
            </div>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="flex border-b" style={{ borderColor: 'var(--divider)' }}>
          {[
            { id: 'channels', label: 'Channels', icon: '📱' },
            { id: 'forum', label: 'Forum', icon: '🗣️' },
            { id: 'holidays', label: 'Holidays', icon: '📅' },
            { id: 'reports', label: 'Reports', icon: '⚠️' }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveSection(tab.id)}
              className={`flex-1 py-3 px-2 text-xs font-medium transition-all duration-200 hover:bg-[var(--surface)] ${
                activeSection === tab.id 
                  ? 'text-green-400 border-b-2 border-green-400 bg-[var(--surface)]' 
                  : 'opacity-60 hover:opacity-100'
              }`}
            >
              <div className="flex flex-col items-center space-y-1">
                <span className="text-sm">{tab.icon}</span>
                <span>{tab.label}</span>
              </div>
            </button>
          ))}
        </div>

        {/* Dynamic Content */}
        {activeSection === 'channels' && renderChannels()}
        {activeSection === 'forum' && renderForum()}
        {activeSection === 'holidays' && renderHolidays()}
        {activeSection === 'reports' && renderReports()}
      </aside>

      {/* Chat column */}
      <main className="flex-1 flex flex-col" style={{ backgroundColor: 'var(--bg)' }}>
        {/* Header */}
        <div className="h-16 flex items-center justify-between px-4 border-b backdrop-blur-sm bg-[var(--bg)]/80 sticky top-0 z-10" style={{ borderColor: 'var(--divider)' }}>
          <div className="flex items-center">
            <span className="text-2xl mr-3 animate-bounce">🏏</span>
            <div>
              <span className="font-semibold text-lg">#cricket-discussions</span>
              <div className="text-xs opacity-60">Pakistan vs India match discussion</div>
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <div className="text-xs opacity-60">2,847 online</div>
            <button className="w-9 h-9 rounded-md hover:bg-white/10 flex items-center justify-center transition-all duration-200 hover:scale-110">
              <span className="text-lg">🔔</span>
            </button>
          </div>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          <div className="flex items-start space-x-3 hover:bg-black/10 p-3 rounded-lg transition-all duration-200">
            <div className="w-10 h-10 rounded-full bg-gradient-to-r from-green-500 to-green-600 flex items-center justify-center font-bold text-white">
              A
            </div>
            <div className="flex-1">
              <div className="flex items-center space-x-2 mb-1">
                <span className="font-semibold">Ahmed_Bhai</span>
                <span className="text-xs bg-green-500/20 text-green-400 px-2 py-1 rounded">Karachi</span>
                <span className="text-xs opacity-60">Today at 4:20 PM</span>
              </div>
              <div className="text-[var(--text-secondary)]">
                Yaar Babar Azam ka form kya lagta hai? Next match mein century marega! 🏏
              </div>
              <div className="flex items-center space-x-2 mt-2">
                <button className="flex items-center space-x-1 text-xs bg-blue-500/10 hover:bg-blue-500/20 px-2 py-1 rounded transition-all">
                  <span>👍</span>
                  <span>12</span>
                </button>
                <button className="flex items-center space-x-1 text-xs bg-red-500/10 hover:bg-red-500/20 px-2 py-1 rounded transition-all">
                  <span>🏏</span>
                  <span>5</span>
                </button>
              </div>
            </div>
          </div>

          <div className="flex items-start space-x-3 hover:bg-black/10 p-3 rounded-lg transition-all duration-200">
            <div className="w-10 h-10 rounded-full bg-gradient-to-r from-blue-500 to-blue-600 flex items-center justify-center font-bold text-white">
              F
            </div>
            <div className="flex-1">
              <div className="flex items-center space-x-2 mb-1">
                <span className="font-semibold">Fatima_Shah</span>
                <span className="text-xs bg-blue-500/20 text-blue-400 px-2 py-1 rounded">Lahore</span>
                <span className="text-xs opacity-60">Today at 4:22 PM</span>
              </div>
              <div className="text-[var(--text-secondary)]">
                @Ahmed_Bhai bilkul sahi kaha! Rizwan bhi achha perform kar raha hai wicket keeping mein 🥎
              </div>
            </div>
          </div>
        </div>

        {/* Message Input */}
        <div className="p-4 border-t" style={{ borderColor: 'var(--divider)' }}>
          <div className="flex items-center bg-[var(--input-bg)] rounded-lg px-4 py-3 focus-within:ring-2 focus-within:ring-green-500/50 transition-all duration-200">
            <input
              type="text"
              placeholder="Message #cricket-discussions (Roman Urdu supported)"
              className="flex-1 bg-transparent text-[var(--text-primary)] placeholder-[var(--muted)] outline-none"
            />
            <div className="flex items-center space-x-2 ml-4">
              <button className="text-[var(--icon)] hover:text-green-400 transition-all duration-200 hover:scale-110">
                <span className="text-lg">😊</span>
              </button>
              <button className="text-[var(--icon)] hover:text-green-400 transition-all duration-200 hover:scale-110">
                <span className="text-lg">📎</span>
              </button>
              <button className="bg-green-500 hover:bg-green-600 text-white rounded-full w-8 h-8 flex items-center justify-center transition-all duration-200 hover:scale-110">
                <span>→</span>
              </button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}