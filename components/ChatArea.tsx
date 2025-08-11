'use client';

import Header from './Header';
import MessageList from './MessageList';
import MessageInput from './MessageInput';
import { type Message } from '@/data/sampleData';

interface ChatAreaProps {
  channelName?: string;
  channelType?: 'text' | 'voice' | 'dm';
  topic?: string;
  messages?: Message[];
  onSendMessage?: (content: string) => void;
}

export default function ChatArea({
  channelName = 'general',
  channelType = 'text',
  topic,
  messages,
  onSendMessage
}: ChatAreaProps) {
  return (
    <div className="flex-1 bg-discord-dark flex flex-col">
      <Header 
        channelName={channelName} 
        channelType={channelType}
        topic={topic} 
      />
      
      <MessageList messages={messages} />
      
      <MessageInput 
        channelName={channelName}
        onSendMessage={onSendMessage} 
      />
    </div>
  );
}
