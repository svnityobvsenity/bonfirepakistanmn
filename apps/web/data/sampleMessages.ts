export interface Message {
  id: string;
  author: {
    name: string;
    avatar: string;
    status: 'online' | 'idle' | 'dnd' | 'offline';
  };
  content: string;
  timestamp: string;
  edited?: boolean;
}

export const sampleMessages: Message[] = [
  {
    id: '1',
    author: {
      name: 'Concept Central',
      avatar: 'CA',
      status: 'online',
    },
    content: 'What do you all think of the Nothing Phone???',
    timestamp: 'Today at 8:43 PM',
  },
  {
    id: '2',
    author: {
      name: 'Concept Central',
      avatar: 'CA',
      status: 'online',
    },
    content: 'Concept Central: What do you all think of the Nothing Phone???',
    timestamp: 'Today at 8:43 PM',
  },
  {
    id: '3',
    author: {
      name: 'hayat',
      avatar: 'H',
      status: 'idle',
    },
    content: 'Definitely',
    timestamp: 'Today at 8:42 PM',
  },
  {
    id: '4',
    author: {
      name: 'hayat',
      avatar: 'H',
      status: 'idle',
    },
    content: 'I think it\'s over hyped.',
    timestamp: 'Today at 8:42 PM',
  },
  {
    id: '5',
    author: {
      name: 'Sticks',
      avatar: 'S',
      status: 'online',
    },
    content: 'It\'s just a phone with a fancy back and blinking LEDs.',
    timestamp: 'Today at 9:43 PM',
  },
  {
    id: '6',
    author: {
      name: 'Mockup',
      avatar: 'M',
      status: 'online',
    },
    content: 'I think the LEDs are pretty cool, but they only work well if you put the phone face down',
    timestamp: 'Today at 9:43 PM',
  },
  {
    id: '7',
    author: {
      name: 'Mockup',
      avatar: 'M',
      status: 'online',
    },
    content: 'I think the LEDs are pretty cool,But they only work well if you put the phone face down',
    timestamp: 'Today at 9:43 PM',
  },
  {
    id: '8',
    author: {
      name: 'Concept Central',
      avatar: 'CA',
      status: 'online',
    },
    content: 'I like the LEDs too. The device looks great in my opinion. But the fact that they have to be face down to be useful is dumb',
    timestamp: 'Today at 9:43 PM',
  },
  {
    id: '9',
    author: {
      name: 'hayat',
      avatar: 'H',
      status: 'idle',
    },
    content: 'Marketing is just what Can Pei is best at.',
    timestamp: 'Today at 9:43 PM',
  },
  {
    id: '10',
    author: {
      name: 'FranzaGeek',
      avatar: 'F',
      status: 'online',
    },
    content: 'The best thing about the Phone(1) is the attention to detail on the overall user experience.',
    timestamp: 'Today at 9:42 PM',
  },
  {
    id: '11',
    author: {
      name: 'Mockup',
      avatar: 'M',
      status: 'online',
    },
    content: 'For Sure. I love how the UI is similar to stock Android without any bloatware.',
    timestamp: 'Today at 9:42 PM',
  },
];
