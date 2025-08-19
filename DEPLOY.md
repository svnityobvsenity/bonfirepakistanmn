# Bonfire Deployment Guide

This guide covers deploying the Bonfire Discord clone to production environments.

## 🌐 Frontend Deployment (Netlify)

### Prerequisites
- GitHub repository connected to Netlify
- Supabase project set up
- Environment variables configured

### Environment Variables (Netlify)

Set these environment variables in your Netlify dashboard:

```bash
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key

# Voice Chat Configuration
NEXT_PUBLIC_SIGNALING_SERVER_URL=wss://your-signaling-server.com
NEXT_PUBLIC_TURN_URL=stun:stun.l.google.com:19302

# Optional: TURN Server for production voice
NEXT_PUBLIC_TURN_URL=turn:your-turn-server.com:3478
NEXT_PUBLIC_TURN_USERNAME=your-turn-username
NEXT_PUBLIC_TURN_CREDENTIAL=your-turn-password
```

### Deployment Steps

1. **Connect Repository**
   ```bash
   # Connect your GitHub repo to Netlify
   # Build settings are configured in netlify.toml
   ```

2. **Install Dependencies**
   ```bash
   npm install
   ```

3. **Build and Deploy**
   ```bash
   npm run build
   # Netlify will automatically deploy on git push
   ```

4. **Verify Deployment**
   - Check that `/` returns HTTP 200
   - Verify auth flows work
   - Test real-time messaging
   - Confirm API routes are functional

## 🔧 Signaling Server Deployment (Railway/Render/Fly)

### Railway Deployment

1. **Create Railway Project**
   ```bash
   # Install Railway CLI
   npm install -g @railway/cli
   
   # Login and create project
   railway login
   railway init
   ```

2. **Configure Environment Variables**
   ```bash
   # Set in Railway dashboard or CLI
   railway variables set SUPABASE_URL=https://your-project.supabase.co
   railway variables set SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
   railway variables set PORT=3001
   ```

3. **Deploy**
   ```bash
   # Deploy from apps/signaling directory
   cd apps/signaling
   railway up
   ```

### Docker Deployment (Alternative)

```bash
# Build Docker image
cd apps/signaling
docker build -t bonfire-signaling .

# Run container
docker run -p 3001:3001 \
  -e SUPABASE_URL=https://your-project.supabase.co \
  -e SUPABASE_SERVICE_ROLE_KEY=your-service-role-key \
  bonfire-signaling
```

## 🗄️ Database Setup (Supabase)

### 1. Create Supabase Project
1. Go to [supabase.com](https://supabase.com)
2. Create new project
3. Save your project URL and keys

### 2. Run Database Migrations
```sql
-- Run the migration file in Supabase SQL editor
-- File: infra/migrations/002_app_schema.sql
```

### 3. Configure Storage Buckets
The migration creates these buckets automatically:
- `avatars` (public)
- `banners` (public)  
- `attachments` (private)

### 4. Enable Realtime
```sql
-- Enable realtime for tables
ALTER PUBLICATION supabase_realtime ADD TABLE messages;
ALTER PUBLICATION supabase_realtime ADD TABLE friend_requests;
ALTER PUBLICATION supabase_realtime ADD TABLE presence;
```

## 🔐 Security Configuration

### Row Level Security (RLS)
RLS policies are included in the migration file and provide:
- Users can only edit their own profiles
- Messages are visible to channel members
- Friend requests are private to involved users
- Proper authentication checks

### Rate Limiting
The app includes built-in rate limiting:
- 5 messages per 5 seconds per user
- Configurable via `RateLimiter` class
- In-memory store (upgrade to Redis for production scale)

## 📊 Monitoring and Scaling

### Performance Monitoring
- Monitor Supabase connection usage
- Track API response times
- Watch for rate limit hits

### Scaling Thresholds
See `SCALE_README.md` for detailed scaling recommendations:
- 0-1K users: Current setup
- 1K-10K users: Add Redis, CDN
- 10K+ users: Database sharding, SFU for voice

## 🔧 Troubleshooting

### Common Issues

1. **Build Fails on Netlify**
   ```bash
   # Check Node.js version in netlify.toml
   NODE_VERSION = "18"
   ```

2. **API Routes Not Working**
   ```bash
   # Ensure @netlify/plugin-nextjs is installed
   npm install @netlify/plugin-nextjs --save-dev
   ```

3. **WebSocket Connection Fails**
   ```bash
   # Check signaling server URL in environment variables
   NEXT_PUBLIC_SIGNALING_SERVER_URL=wss://your-server.com
   ```

4. **Database Connection Issues**
   ```bash
   # Verify Supabase environment variables
   NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
   ```

## 📱 Production Checklist

- [ ] Environment variables configured
- [ ] Database migrations applied
- [ ] RLS policies enabled
- [ ] Storage buckets created
- [ ] Realtime enabled for required tables
- [ ] Signaling server deployed and accessible
- [ ] TURN servers configured (for production voice)
- [ ] SSL certificates installed
- [ ] Monitoring and alerting set up
- [ ] Backup strategy implemented
- [ ] Rate limiting configured
- [ ] Error logging configured

## 🚀 Manual Deploy Commands

### Netlify CLI Deploy
```bash
# Install Netlify CLI
npm install -g netlify-cli

# Login and link site
netlify login
netlify link

# Deploy
netlify deploy --prod
```

### Railway CLI Deploy
```bash
# From signaling server directory
cd apps/signaling
railway up
```

## 📞 Support

If you encounter issues:
1. Check the logs in Netlify/Railway dashboard
2. Verify environment variables are set correctly
3. Ensure database migrations have been applied
4. Test API endpoints individually
5. Check browser console for client-side errors

For production deployments, consider:
- Setting up monitoring (Sentry, LogRocket)
- Implementing proper backup strategies
- Using a CDN for static assets
- Setting up proper SSL certificates
- Implementing proper error boundaries
