
# Fride - Discord-Style Single-Server App

A modern, real-time Discord-style application built with Next.js, Supabase, and TypeScript. Features include authentication, messaging, voice chat, friend requests, and real-time presence.

## 🚀 Features

- **Authentication & Profiles**: Secure user registration, login, and profile management
- **Real-time Messaging**: Instant message delivery with optimistic UI
- **Voice Chat**: Server voice channels and 1:1 DM calls with WebRTC
- **Friend System**: Send, accept, and manage friend requests
- **Presence System**: Real-time online/offline status
- **Channel Management**: Create, join, and manage channels
- **Responsive Design**: Modern UI with Tailwind CSS
- **Type Safety**: Full TypeScript implementation
- **Testing**: Comprehensive test suite with Jest and Playwright

## 🛠️ Tech Stack

- **Frontend**: Next.js 14 (App Router), React 18, TypeScript
- **Backend**: Supabase (PostgreSQL, Auth, Real-time)
- **Styling**: Tailwind CSS
- **Voice**: WebRTC, WebSocket signaling
- **Testing**: Jest, React Testing Library, Playwright
- **Deployment**: Netlify (Frontend), Railway/Render (Signaling Server)

## 📋 Prerequisites

- Node.js 18+ 
- npm or yarn
- Supabase account
- Git

## 🚀 Quick Start

### 1. Clone the Repository

```bash
git clone <your-repo-url>
cd fride
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Set Up Supabase

#### Option A: Automated Setup
```bash
npm run setup:supabase
```

#### Option B: Manual Setup
1. Create a Supabase project at [supabase.com](https://supabase.com)
2. Get your project URL and API keys from Settings > API
3. Create `.env.local` file:

```env
NEXT_PUBLIC_SUPABASE_URL=your_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
NEXT_PUBLIC_SIGNALING_SERVER_URL=ws://localhost:3001
```

### 4. Run Database Migrations

```bash
# Install Supabase CLI
npm install -g supabase

# Login and link project
supabase login
supabase link --project-ref your_project_ref

# Run migrations
supabase db push
```

### 5. Start Development Server

```bash
# Local development
npm run dev

# Development with ngrok tunnel (for testing with friends)
npm run dev:ngrok
```

Visit [http://localhost:3000](http://localhost:3000) to see the app!

### 6. Testing with Friends (Optional)

To make your local app accessible to friends for testing:

1. Get your ngrok auth token from [ngrok dashboard](https://dashboard.ngrok.com/get-started/your-authtoken)
2. Add `NGROK_AUTHTOKEN=your_token` to `.env.local`
3. Run `npm run dev:ngrok`
4. Share the ngrok URL with your friends

## 📁 Project Structure

```
fride/
├── app/                    # Next.js App Router
│   ├── (auth)/            # Authentication pages
│   ├── (main)/            # Main app pages
│   ├── api/               # API routes
│   └── globals.css        # Global styles
├── components/            # React components
├── contexts/              # React contexts
├── hooks/                 # Custom hooks
├── lib/                   # Utility libraries
├── migrations/            # Database migrations
├── scripts/               # Setup and utility scripts
├── tests/                 # Test files
└── types/                 # TypeScript type definitions
```

## 🧪 Testing

```bash
# Unit tests
npm run test

# E2E tests
npm run test:e2e

# All tests
npm run test:all

# Test coverage
npm run test:coverage
```

## 🚀 Deployment

### Frontend (Netlify)

1. Connect your repository to Netlify
2. Set environment variables in Netlify dashboard
3. Deploy automatically on push to main branch

### Signaling Server

```bash
# Deploy to Railway
railway up

# Or deploy to Render
# Follow Render's Docker deployment guide
```

## 📚 Documentation

- [Supabase Setup Guide](./SUPABASE_SETUP.md)
- [Deployment Guide](./DEPLOY.md)
- [API Documentation](./docs/API.md)

## 🔧 Configuration

### Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| `NEXT_PUBLIC_SUPABASE_URL` | Supabase project URL | Yes |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Supabase anonymous key | Yes |
| `SUPABASE_SERVICE_ROLE_KEY` | Supabase service role key | Yes |
| `NEXT_PUBLIC_SIGNALING_SERVER_URL` | WebSocket signaling server | No |
| `NEXT_PUBLIC_TURN_URL` | TURN server for voice chat | No |
| `NGROK_AUTHTOKEN` | Ngrok auth token for testing | No |

### Database Schema

The app uses the following main tables:
- `profiles` - User profiles and settings
- `channels` - Server channels
- `channel_members` - Channel membership
- `messages` - Channel messages
- `dm_messages` - Direct messages
- `friend_requests` - Friend request system
- `presence` - User online status

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests for new features
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License.

## 🆘 Support

If you encounter issues:

1. Check the [troubleshooting guide](./SUPABASE_SETUP.md#troubleshooting)
2. Review browser console for errors
3. Verify environment variables are set correctly
4. Check Supabase dashboard logs

## 🎯 Roadmap

- [ ] Mobile app
- [ ] File sharing
- [ ] Server roles and permissions
- [ ] Message reactions
- [ ] Thread support
- [ ] Advanced voice features