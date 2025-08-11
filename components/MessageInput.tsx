'use client';

import { useState } from 'react';
import { Plus, Smile, Gift } from 'lucide-react';

interface MessageInputProps {
  channelName?: string;
  onSendMessage?: (content: string) => void;
}

export default function MessageInput({ 
  channelName = 'general', 
  onSendMessage 
}: MessageInputProps) {
  const [message, setMessage] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (message.trim()) {
      onSendMessage?.(message.trim());
      setMessage('');
    }
  };

  return (
    <div className="px-4 pb-6">
      <form onSubmit={handleSubmit} className="relative">
        <div className="flex items-center bg-discord-dark-but-not-black rounded-lg">
          <button
            type="button"
            className="p-3 text-discord-greyple hover:text-white transition-colors"
          >
            <Plus size={20} />
          </button>
          
          <input
            type="text"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder={`Message #${channelName}`}
            className="flex-1 bg-transparent text-white placeholder-discord-greyple py-3 px-1 outline-none"
          />
          
          <div className="flex items-center px-3 space-x-2">
            <button
              type="button"
              className="text-discord-greyple hover:text-white transition-colors"
            >
              <Gift size={20} />
            </button>
            <button
              type="button"
              className="text-discord-greyple hover:text-white transition-colors"
            >
              <Smile size={20} />
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}
