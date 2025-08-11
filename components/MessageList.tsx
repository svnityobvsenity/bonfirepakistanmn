'use client';

import { messages, type Message } from '@/data/sampleData';

interface MessageListProps {
  messages?: Message[];
}

export default function MessageList({ messages: messagesProp = messages }: MessageListProps) {
  return (
    <div className="flex-1 overflow-y-auto px-4 py-4 space-y-4">
      {messagesProp.map((message) => (
        <div key={message.id} className="flex space-x-3 hover:bg-discord-darker/30 px-2 py-1 rounded group">
          <div className="w-10 h-10 rounded-full bg-discord-blurple flex items-center justify-center text-white font-semibold flex-shrink-0">
            {message.author.avatar ? (
              <img 
                src={message.author.avatar} 
                alt={message.author.name} 
                className="w-10 h-10 rounded-full"
              />
            ) : (
              message.author.name.charAt(0).toUpperCase()
            )}
          </div>
          
          <div className="flex-1 min-w-0">
            <div className="flex items-center space-x-2 mb-1">
              <span className="font-semibold text-white hover:underline cursor-pointer">
                {message.author.name}
              </span>
              <span className="text-xs text-discord-greyple">
                {message.timestamp}
              </span>
            </div>
            
            <div className="text-discord-greyple leading-relaxed">
              {message.content}
            </div>
          </div>
        </div>
      ))}
      
      {/* Scroll anchor */}
      <div className="h-1" />
    </div>
  );
}
