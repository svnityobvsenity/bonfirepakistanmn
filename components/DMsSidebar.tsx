'use client';

import { useState } from 'react';
import { Search, Users, Mic, Headphones, Settings } from 'lucide-react';
import { directMessages } from '@/data/sampleData';

interface DMsSidebarProps {
  activeDMId?: string;
  onDMSelect?: (dmId: string) => void;
}

const statusColors = {
  online: 'bg-discord-green',
  idle: 'bg-discord-yellow',
  dnd: 'bg-discord-red',
  offline: 'bg-discord-greyple',
};

export default function DMsSidebar({ activeDMId, onDMSelect }: DMsSidebarProps) {
  const [searchQuery, setSearchQuery] = useState('');

  const filteredDMs = directMessages.filter(dm =>
    dm.user.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="w-60 bg-discord-darker flex flex-col">
      {/* Search bar */}
      <div className="p-2 border-b border-discord-darkest">
        <div className="relative">
          <input
            type="text"
            placeholder="Find or start a conversation"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full h-8 bg-discord-darkest text-white text-sm px-8 rounded border-none outline-none placeholder-discord-greyple"
          />
          <Search size={16} className="absolute left-2 top-2 text-discord-greyple" />
        </div>
      </div>

      {/* Friends section */}
      <div className="px-2 py-2">
        <button className="w-full flex items-center px-2 py-1 rounded text-left text-discord-greyple hover:bg-discord-dark-but-not-black hover:text-white transition-colors">
          <Users size={16} className="mr-2" />
          <span>Friends</span>
        </button>
      </div>

      {/* Direct Messages */}
      <div className="flex-1 overflow-y-auto">
        <div className="px-2 pb-2">
          <h2 className="text-xs font-semibold text-discord-greyple uppercase tracking-wide px-2 py-1">
            Direct Messages
          </h2>
          
          <div className="space-y-0.5">
            {filteredDMs.map((dm) => (
              <button
                key={dm.id}
                className={`w-full flex items-center px-2 py-2 rounded text-left transition-colors ${
                  activeDMId === dm.id
                    ? 'bg-discord-dark-but-not-black text-white'
                    : 'text-discord-greyple hover:bg-discord-dark-but-not-black hover:text-white'
                }`}
                onClick={() => onDMSelect?.(dm.id)}
              >
                <div className="relative mr-3 flex-shrink-0">
                  <div className="w-8 h-8 rounded-full bg-discord-blurple flex items-center justify-center text-white text-sm font-semibold">
                    {dm.user.avatar ? (
                      <img 
                        src={dm.user.avatar} 
                        alt={dm.user.name} 
                        className="w-8 h-8 rounded-full"
                      />
                    ) : (
                      dm.user.name.charAt(0).toUpperCase()
                    )}
                  </div>
                  <div 
                    className={`absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full border-2 border-discord-darker ${statusColors[dm.user.status]}`}
                  />
                </div>
                
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <span className="font-medium truncate">{dm.user.name}</span>
                    <span className="text-xs text-discord-greyple">{dm.timestamp}</span>
                  </div>
                  <p className="text-xs text-discord-greyple truncate">{dm.lastMessage}</p>
                </div>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* User control bar */}
      <div className="h-[52px] bg-discord-darkest flex items-center px-2">
        <div className="flex items-center flex-1 min-w-0">
          <div className="w-8 h-8 rounded-full bg-discord-blurple flex items-center justify-center text-sm font-semibold mr-2">
            K
          </div>
          <div className="flex-1 min-w-0">
            <div className="text-sm font-semibold text-white truncate">Kaif</div>
            <div className="text-xs text-discord-greyple truncate">#0001</div>
          </div>
        </div>
        
        <div className="flex items-center space-x-2">
          <button className="w-8 h-8 flex items-center justify-center text-discord-greyple hover:text-white hover:bg-discord-dark rounded transition-colors">
            <Mic size={16} />
          </button>
          <button className="w-8 h-8 flex items-center justify-center text-discord-greyple hover:text-white hover:bg-discord-dark rounded transition-colors">
            <Headphones size={16} />
          </button>
          <button className="w-8 h-8 flex items-center justify-center text-discord-greyple hover:text-white hover:bg-discord-dark rounded transition-colors">
            <Settings size={16} />
          </button>
        </div>
      </div>
    </div>
  );
}
