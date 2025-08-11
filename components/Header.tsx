'use client';

import { Hash, Bell, Pin, Users, Search, Inbox, HelpCircle, Volume2 } from 'lucide-react';

interface HeaderProps {
  channelName?: string;
  channelType?: 'text' | 'voice' | 'dm';
  topic?: string;
}

export default function Header({ 
  channelName = 'general', 
  channelType = 'text',
  topic = 'Welcome to Bonfire Pakistan! Share your thoughts and connect with fellow Pakistanis.' 
}: HeaderProps) {
  return (
    <div className="h-12 border-b border-discord-darkest bg-discord-dark flex items-center px-4 shadow-sm">
      <div className="flex items-center flex-1 min-w-0">
        {channelType === 'text' && <Hash size={20} className="text-discord-greyple mr-2" />}
        {channelType === 'voice' && <Volume2 size={20} className="text-discord-greyple mr-2" />}
        
        <h1 className="text-white font-semibold mr-2">{channelName}</h1>
        
        {topic && channelType !== 'dm' && (
          <>
            <div className="w-px h-6 bg-discord-greyple mr-2" />
            <p className="text-discord-greyple text-sm truncate">{topic}</p>
          </>
        )}
      </div>

      <div className="flex items-center space-x-4">
        {channelType !== 'dm' && (
          <>
            <button className="text-discord-greyple hover:text-white transition-colors">
              <Bell size={20} />
            </button>
            <button className="text-discord-greyple hover:text-white transition-colors">
              <Pin size={20} />
            </button>
            <button className="text-discord-greyple hover:text-white transition-colors">
              <Users size={20} />
            </button>
          </>
        )}
        
        <div className="relative">
          <input
            type="text"
            placeholder="Search"
            className="w-36 h-6 bg-discord-darkest text-white text-sm px-2 rounded border-none outline-none placeholder-discord-greyple"
          />
          <Search size={14} className="absolute right-2 top-1 text-discord-greyple" />
        </div>

        <button className="text-discord-greyple hover:text-white transition-colors">
          <Inbox size={20} />
        </button>
        <button className="text-discord-greyple hover:text-white transition-colors">
          <HelpCircle size={20} />
        </button>
      </div>
    </div>
  );
}


