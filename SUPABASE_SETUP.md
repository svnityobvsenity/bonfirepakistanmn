# Supabase Project Setup Guide

## 1. Create Supabase Project

1. Go to [supabase.com](https://supabase.com) and sign in
2. Click "New Project"
3. Choose your organization
4. Enter project details:
   - **Name**: `fride-discord-app` (or your preferred name)
   - **Database Password**: Generate a strong password (save it!)
   - **Region**: Choose closest to your users
5. Click "Create new project"
6. Wait for the project to be created (2-3 minutes)

## 2. Get Project Credentials

1. Go to **Settings** → **API** in your Supabase dashboard
2. Copy these values:
   - **Project URL** (starts with `https://`)
   - **anon public** key (starts with `eyJ`)
   - **service_role** key (starts with `eyJ`)

## 3. Set Environment Variables

Create a `.env.local` file in your project root:

```env
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=your_project_url_here
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key_here
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key_here

# Optional: TURN Server for Voice Chat
NEXT_PUBLIC_TURN_URL=your_turn_server_url
NEXT_PUBLIC_TURN_USER=your_turn_username
NEXT_PUBLIC_TURN_PASS=your_turn_password

# Optional: Signaling Server
NEXT_PUBLIC_SIGNALING_SERVER_URL=ws://localhost:3001
```

## 4. Run Database Migrations

The database schema is already defined in the migrations. Run them:

```bash
# Install Supabase CLI (if not already installed)
npm install -g supabase

# Login to Supabase
supabase login

# Link your project
supabase link --project-ref your_project_ref

# Run migrations
supabase db push
```

## 5. Enable Row Level Security (RLS)

All tables have RLS policies defined. Verify they're enabled:

1. Go to **Authentication** → **Policies** in Supabase dashboard
2. Ensure RLS is enabled for all tables:
   - `profiles`
   - `channels`
   - `channel_members`
   - `messages`
   - `dm_messages`
   - `friend_requests`
   - `presence`

## 6. Configure Authentication

1. Go to **Authentication** → **Settings**
2. Configure email templates (optional but recommended)
3. Set up OAuth providers if needed (Google, GitHub, etc.)
4. Configure redirect URLs:
   - Add `http://localhost:3000/auth/callback` for development
   - Add your production URL when deployed

## 7. Enable Real-time

1. Go to **Database** → **Replication**
2. Enable real-time for these tables:
   - `messages`
   - `dm_messages`
   - `presence`
   - `friend_requests`

## 8. Set Up Storage (for Avatars)

1. Go to **Storage** → **Buckets**
2. Create a new bucket called `avatars`
3. Set it to public
4. Add RLS policies for the bucket

## 9. Test the Setup

Run the application and test:

```bash
npm run dev
```

Visit `http://localhost:3000` and try:
1. Creating an account
2. Logging in
3. Creating a channel
4. Sending messages
5. Real-time updates

## 10. Optional: Seed Test Data

If you want to populate with test data:

```bash
npm run seed:test
```

## Troubleshooting

### Common Issues:

1. **"supabaseUrl is required" error**
   - Check your `.env.local` file exists
   - Verify the URL and keys are correct
   - Restart your development server

2. **RLS Policy Errors**
   - Ensure RLS is enabled on all tables
   - Check that policies are properly defined
   - Verify user authentication is working

3. **Real-time not working**
   - Check that real-time is enabled for required tables
   - Verify your Supabase plan supports real-time
   - Check browser console for connection errors

4. **Storage upload errors**
   - Verify the `avatars` bucket exists
   - Check bucket permissions
   - Ensure RLS policies allow uploads

### Support

If you encounter issues:
1. Check the Supabase dashboard logs
2. Review the browser console for errors
3. Verify all environment variables are set correctly
4. Ensure you're using the latest version of the Supabase client

## Production Deployment

When deploying to production:

1. Update environment variables with production Supabase project
2. Add production redirect URLs in Supabase dashboard
3. Configure custom domain if needed
4. Set up monitoring and logging
5. Test all features in production environment
