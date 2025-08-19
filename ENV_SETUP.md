# Environment Setup Instructions

## Required Environment Variables

To complete the authentication system setup, you need to create a `.env.local` file in the project root with the following variables:

### 1. Create `.env.local` file

Create a file named `.env.local` in the project root directory with the following content:

```env
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=https://svhbcxchtvpnbfwsfgms.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InN2aGJjeGNodHZwbmJmd3NmZ21zIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTU1Mzk2NTMsImV4cCI6MjA3MTExNTY1M30.bcIb7Ejf5NaXk6-ot6gJwBwjKCH9CcDxKPmuKfTh0cw
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InN2aGJjeGNodHZwbmJmd3NmZ21zIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1NTUzOTY1MywiZXhwIjoyMDcxMTE1NjUzfQ.tQnCgAjEDC3NMfSH-S6HiO8ia0Eft7tHlGy4Ik4V1eQ

# Voice Chat Configuration (Optional)
NEXT_PUBLIC_SIGNALING_SERVER_URL=wss://localhost:3001
TURN_URL=stun:stun.l.google.com:19302
TURN_USER=
TURN_PASS=

# Development
NODE_ENV=development
```

### 2. Apply Database Migration

Before testing the auth system, you need to apply the database schema:

```bash
# Option 1: Using Supabase Dashboard
# 1. Go to https://supabase.com/dashboard/project/svhbcxchtvpnbfwsfgms
# 2. Navigate to "SQL Editor"
# 3. Copy and paste the contents of infra/migrations/002_app_schema.sql
# 4. Execute the SQL

# Option 2: Using psql (if you have access)
psql "postgresql://postgres:[password]@db.svhbcxchtvpnbfwsfgms.supabase.co:5432/postgres" -f infra/migrations/002_app_schema.sql
```

### 3. Test the Authentication System

After setting up the environment variables and applying the migration:

```bash
# Build the project
npm run build

# Start the development server
npm run dev
```

Then visit:
- `http://localhost:3000/login` - Login/Signup page
- `http://localhost:3000/profile` - Profile management (requires authentication)

### 4. Demo Accounts

The login page includes demo accounts for testing:
- **Demo User 1**: demo1@example.com / demo123
- **Demo User 2**: demo2@example.com / demo123  
- **Demo User 3**: demo3@example.com / demo123

### 5. Features Implemented

✅ **Complete Authentication System:**
- Email/password signup and signin
- Username + discriminator generation
- Profile creation on first signup
- Session persistence
- Protected routes

✅ **Profile Management:**
- Avatar upload to Supabase Storage
- Profile editing (username, display name, bio, status)
- Real-time profile updates

✅ **Database Integration:**
- Complete schema with RLS policies
- User profiles, channels, messages tables
- Friend requests and presence system
- Storage buckets for avatars

### 6. Next Steps

Once the environment is set up and working:

1. **Test Authentication Flow:**
   - Create a new account
   - Sign in with existing account
   - Upload avatar and edit profile
   - Test session persistence

2. **Verify Database:**
   - Check that user profiles are created
   - Verify avatar uploads work
   - Test RLS policies

3. **Continue with Next Stages:**
   - Friends/Requests system
   - Messaging CRUD
   - Real-time features
   - Voice chat integration

### Troubleshooting

**Build Errors:**
- Ensure `.env.local` file exists and has correct values
- Check that Supabase URL and keys are valid
- Verify database migration was applied

**Authentication Issues:**
- Check browser console for errors
- Verify Supabase project is active
- Ensure RLS policies are applied

**Avatar Upload Issues:**
- Check storage bucket permissions
- Verify storage policies are applied
- Check file size limits (default 50MB)
