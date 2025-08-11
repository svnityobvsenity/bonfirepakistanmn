'use client';

import { Home, Plus, Compass } from 'lucide-react';
import { servers } from '@/data/sampleData';

interface ServerSidebarProps {
  activeServerId?: string;
  onServerSelect?: (serverId: string) => void;
}

export default function ServerSidebar({ activeServerId, onServerSelect }: ServerSidebarProps) {
  return (
    <div className="w-[72px] bg-discord-darkest flex flex-col items-center py-3 space-y-2">
      {/* Home/DMs button */}
      <button 
        className={`w-12 h-12 rounded-[24px] flex items-center justify-center transition-all duration-200 hover:rounded-[16px] ${
          !activeServerId 
            ? 'bg-discord-blurple text-white rounded-[16px]' 
            : 'bg-discord-dark text-discord-greyple hover:bg-discord-blurple hover:text-white'
        }`}
        onClick={() => onServerSelect?.('home')}
      >
        <Home size={24} />
      </button>

      {/* Divider */}
      <div className="w-8 h-[2px] bg-discord-dark rounded-full" />

      {/* Server list */}
      <div className="flex flex-col space-y-2">
        {servers.map((server) => (
          <button
            key={server.id}
            className={`w-12 h-12 rounded-[24px] flex items-center justify-center text-white font-semibold transition-all duration-200 hover:rounded-[16px] ${
              activeServerId === server.id
                ? 'bg-discord-blurple rounded-[16px]'
                : 'bg-discord-dark hover:bg-discord-blurple'
            }`}
            onClick={() => onServerSelect?.(server.id)}
            title={server.name}
          >
            {server.icon ? (
              <img src={server.icon} alt={server.name} className="w-12 h-12 rounded-full" />
            ) : (
              server.initials
            )}
          </button>
        ))}
      </div>

      {/* Add server button */}
      <button className="w-12 h-12 rounded-[24px] bg-discord-dark text-discord-green flex items-center justify-center transition-all duration-200 hover:rounded-[16px] hover:bg-discord-green hover:text-white">
        <Plus size={24} />
      </button>

      {/* Explore servers */}
      <button className="w-12 h-12 rounded-[24px] bg-discord-dark text-discord-green flex items-center justify-center transition-all duration-200 hover:rounded-[16px] hover:bg-discord-green hover:text-white">
        <Compass size={24} />
      </button>
    </div>
  );
}
