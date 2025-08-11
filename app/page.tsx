'use client';

import { useState } from 'react';
import ServerSidebar from '@/components/ServerSidebar';
import ChannelSidebar from '@/components/ChannelSidebar';
import ChatArea from '@/components/ChatArea';
import { servers, channels, messages } from '@/data/sampleData';

export default function Home() {
  const [activeServerId, setActiveServerId] = useState('1');
  const [activeChannelId, setActiveChannelId] = useState('1');

  const activeServer = servers.find(s => s.id === activeServerId);
  const activeChannel = channels.find(c => c.id === activeChannelId);

  const handleSendMessage = (content: string) => {
    // In a real app, this would send the message to the server
    console.log('Sending message:', content);
  };

  return (
    <div className="flex h-screen w-screen bg-discord-dark text-white">
      <ServerSidebar 
        activeServerId={activeServerId}
        onServerSelect={setActiveServerId}
      />
      
      <ChannelSidebar 
        serverName={activeServer?.name}
        activeChannelId={activeChannelId}
        onChannelSelect={setActiveChannelId}
      />
      
      <ChatArea 
        channelName={activeChannel?.name}
        channelType={activeChannel?.type}
        topic="Welcome to Bonfire Pakistan! Share your thoughts and connect with fellow Pakistanis."
        messages={messages}
        onSendMessage={handleSendMessage}
      />
    </div>
  );
}
