'use client';

import { useState } from 'react';
import ServerSidebar from '@/components/ServerSidebar';
import DMsSidebar from '@/components/DMsSidebar';
import ChatArea from '@/components/ChatArea';
import { directMessages } from '@/data/sampleData';

const dmMessages = [
  {
    id: '1',
    author: { name: 'Ahmed', avatar: '/avatars/ahmed.png' },
    content: 'Hey, are you free for a quick call?',
    timestamp: 'Today at 2:45 PM',
  },
  {
    id: '2',
    author: { name: 'Kaif' },
    content: 'Sure! Give me 5 minutes to finish this up.',
    timestamp: 'Today at 2:46 PM',
  },
  {
    id: '3',
    author: { name: 'Ahmed', avatar: '/avatars/ahmed.png' },
    content: 'Perfect! I\'ll be waiting in the voice channel.',
    timestamp: 'Today at 2:47 PM',
  },
];

export default function DMsPage() {
  const [activeDMId, setActiveDMId] = useState('1');

  const activeDM = directMessages.find(dm => dm.id === activeDMId);

  const handleSendMessage = (content: string) => {
    // In a real app, this would send the DM
    console.log('Sending DM:', content);
  };

  return (
    <div className="flex h-screen w-screen bg-discord-dark text-white">
      <ServerSidebar 
        activeServerId={undefined} // No server selected in DMs view
        onServerSelect={(serverId) => {
          if (serverId !== 'home') {
            // Navigate to server view
            window.location.href = '/';
          }
        }}
      />
      
      <DMsSidebar 
        activeDMId={activeDMId}
        onDMSelect={setActiveDMId}
      />
      
      <ChatArea 
        channelName={activeDM?.user.name}
        channelType="dm"
        messages={dmMessages}
        onSendMessage={handleSendMessage}
      />
    </div>
  );
}
