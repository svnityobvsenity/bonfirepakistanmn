# Bonfire Discord Interface

A clean Discord-like chat interface built with Next.js and TypeScript.

## Project Structure

```
bonfire/
├── app/
│   ├── globals.css      # Minimal global styles
│   ├── layout.tsx       # Root layout
│   └── page.tsx         # Homepage (renders DiscordInterface)
├── components/
│   └── DiscordInterface.tsx  # Main Discord UI component
└── package.json
```

## Features

- **Clean Design**: Exact replica of Discord's interface with custom styling
- **Mock Data**: Hardcoded users and messages for demo purposes
- **Responsive**: Fixed width container (1049px) with proper scaling
- **Interactive**: Clickable user selection and hover effects

## Tech Stack

- Next.js 14
- TypeScript
- CSS-in-JS (styled-jsx)
- Inter font family

## Getting Started

```bash
npm install
npm run dev
```

Visit `http://localhost:3000` to see the Discord interface.

## Component Overview

The `DiscordInterface` component includes:
- **Sidebar**: User list, pinned messages, search box, friends section
- **Main Content**: Top header with avatars and user profile
- **Chat Area**: Messages, typing indicator, message input
- **Mock Data**: 9 users and 10 messages for demonstration

All styling is contained within the component using styled-jsx for a clean, self-contained implementation.