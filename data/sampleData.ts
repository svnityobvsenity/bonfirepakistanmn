export interface Server {
  id: string;
  name: string;
  icon?: string;
  initials: string;
}

export interface Channel {
  id: string;
  name: string;
  type: 'text' | 'voice';
  category?: string;
}

export interface Message {
  id: string;
  author: {
    name: string;
    avatar?: string;
  };
  content: string;
  timestamp: string;
}

export interface DirectMessage {
  id: string;
  user: {
    name: string;
    avatar?: string;
    status: 'online' | 'idle' | 'dnd' | 'offline';
  };
  lastMessage: string;
  timestamp: string;
}

export const servers: Server[] = [
  { id: '1', name: 'Bonfire Pakistan', initials: 'BP' },
  { id: '2', name: 'Gaming Hub', initials: 'GH' },
  { id: '3', name: 'Dev Community', initials: 'DC' },
  { id: '4', name: 'Music Lounge', initials: 'ML' },
];

export const channels: Channel[] = [
  { id: '1', name: 'general', type: 'text', category: 'TEXT CHANNELS' },
  { id: '2', name: 'random', type: 'text', category: 'TEXT CHANNELS' },
  { id: '3', name: 'announcements', type: 'text', category: 'TEXT CHANNELS' },
  { id: '4', name: 'General', type: 'voice', category: 'VOICE CHANNELS' },
  { id: '5', name: 'Gaming', type: 'voice', category: 'VOICE CHANNELS' },
  { id: '6', name: 'Music', type: 'voice', category: 'VOICE CHANNELS' },
];

export const messages: Message[] = [
  {
    id: '1',
    author: { name: 'Kaif', avatar: '/avatars/kaif.png' },
    content: 'Hey everyone! Welcome to Bonfire Pakistan 🔥',
    timestamp: 'Today at 2:30 PM',
  },
  {
    id: '2',
    author: { name: 'Ahmed', avatar: '/avatars/ahmed.png' },
    content: 'Thanks for creating this server! Looking forward to some great discussions.',
    timestamp: 'Today at 2:32 PM',
  },
  {
    id: '3',
    author: { name: 'Fatima', avatar: '/avatars/fatima.png' },
    content: 'This is amazing! Finally a Pakistani community on Discord 🇵🇰',
    timestamp: 'Today at 2:35 PM',
  },
  {
    id: '4',
    author: { name: 'Ali', avatar: '/avatars/ali.png' },
    content: 'Can we get some gaming channels going? Would love to play some CS:GO with you all',
    timestamp: 'Today at 2:40 PM',
  },
];

export const directMessages: DirectMessage[] = [
  {
    id: '1',
    user: { name: 'Ahmed', avatar: '/avatars/ahmed.png', status: 'online' },
    lastMessage: 'Hey, are you free for a quick call?',
    timestamp: '2:45 PM',
  },
  {
    id: '2',
    user: { name: 'Fatima', avatar: '/avatars/fatima.png', status: 'idle' },
    lastMessage: 'Thanks for the help with the project!',
    timestamp: '1:20 PM',
  },
  {
    id: '3',
    user: { name: 'Ali', avatar: '/avatars/ali.png', status: 'dnd' },
    lastMessage: 'Let\'s play some games later tonight',
    timestamp: '12:30 PM',
  },
  {
    id: '4',
    user: { name: 'Sara', avatar: '/avatars/sara.png', status: 'offline' },
    lastMessage: 'See you tomorrow!',
    timestamp: 'Yesterday',
  },
];
