'use client';

import { Hash, Volume2, Mic, Headphones, Settings, ChevronDown, Plus } from 'lucide-react';
import { channels } from '@/data/sampleData';

interface ChannelSidebarProps {
  serverName?: string;
  activeChannelId?: string;
  onChannelSelect?: (channelId: string) => void;
}

export default function ChannelSidebar({ 
  serverName = 'Bonfire Pakistan', 
  activeChannelId, 
  onChannelSelect 
}: ChannelSidebarProps) {
  const groupedChannels = channels.reduce((acc, channel) => {
    const category = channel.category || 'UNCATEGORIZED';
    if (!acc[category]) {
      acc[category] = [];
    }
    acc[category].push(channel);
    return acc;
  }, {} as Record<string, typeof channels>);

  return (
    <div className="w-60 bg-discord-darker flex flex-col">
      {/* Server header */}
      <div className="h-12 border-b border-discord-darkest flex items-center justify-between px-4 shadow-sm">
        <h1 className="font-semibold text-white truncate">{serverName}</h1>
        <ChevronDown size={18} className="text-discord-greyple" />
      </div>

      {/* Channels list */}
      <div className="flex-1 overflow-y-auto px-2 py-2">
        {Object.entries(groupedChannels).map(([category, categoryChannels]) => (
          <div key={category} className="mb-4">
            {/* Category header */}
            <div className="flex items-center justify-between px-2 py-1">
              <h2 className="text-xs font-semibold text-discord-greyple uppercase tracking-wide">
                {category}
              </h2>
              <Plus size={16} className="text-discord-greyple hover:text-white cursor-pointer" />
            </div>

            {/* Category channels */}
            <div className="space-y-0.5">
              {categoryChannels.map((channel) => (
                <button
                  key={channel.id}
                  className={`w-full flex items-center px-2 py-1 rounded text-left transition-colors ${
                    activeChannelId === channel.id
                      ? 'bg-discord-dark-but-not-black text-white'
                      : 'text-discord-greyple hover:bg-discord-dark-but-not-black hover:text-discord-greyple'
                  }`}
                  onClick={() => onChannelSelect?.(channel.id)}
                >
                  {channel.type === 'text' ? (
                    <Hash size={16} className="mr-2 flex-shrink-0" />
                  ) : (
                    <Volume2 size={16} className="mr-2 flex-shrink-0" />
                  )}
                  <span className="truncate">{channel.name}</span>
                </button>
              ))}
            </div>
          </div>
        ))}
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


