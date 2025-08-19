# Database Migration Instructions

## Migration: 002_app_schema.sql

This migration creates the complete database schema for the Bonfire Discord clone.

### What's Included:

**Tables:**
- `users` - User profiles (extends auth.users)
- `channels` - Server channels (text/voice)
- `messages` - Channel messages
- `direct_messages` - DM conversation channels
- `dm_messages` - Messages in DM conversations
- `friend_requests` - Friend request system
- `friends` - Mutual friendships
- `presence` - User online status
- `voice_sessions` - Voice channel participants

**Security:**
- Row Level Security (RLS) policies on all tables
- Proper user authentication and authorization
- Service role permissions for server-side operations

**Performance:**
- Optimized indexes for chat queries
- Efficient pagination support
- Fast friend request lookups

**Storage:**
- Avatar upload bucket with proper policies
- Banner upload bucket
- Attachment storage (private)

### How to Apply Migration:

#### Option 1: Using Supabase CLI
```bash
# Navigate to project root
cd /path/to/bonfire

# Apply migration
supabase db push

# Or apply specific migration file
psql -h db.xxx.supabase.co -p 5432 -U postgres -d postgres -f infra/migrations/002_app_schema.sql
```

#### Option 2: Using Supabase Dashboard
1. Go to your Supabase project dashboard
2. Navigate to "SQL Editor"
3. Copy and paste the contents of `infra/migrations/002_app_schema.sql`
4. Execute the SQL

#### Option 3: Using psql directly
```bash
# Replace with your actual Supabase connection details
psql "postgresql://postgres:[password]@db.[ref].supabase.co:5432/postgres" -f infra/migrations/002_app_schema.sql
```

### Verification:

After running the migration, verify it worked:

```sql
-- Check tables were created
SELECT table_name FROM information_schema.tables 
WHERE table_schema = 'public' 
AND table_name IN ('users', 'channels', 'messages', 'friend_requests');

-- Check RLS is enabled
SELECT schemaname, tablename, rowsecurity 
FROM pg_tables 
WHERE schemaname = 'public' 
AND rowsecurity = true;

-- Check storage buckets
SELECT * FROM storage.buckets;
```

### Sample Data:

The migration includes sample channels:
- `general` (text)
- `random` (text) 
- `announcements` (text)
- `General Voice` (voice)
- `Gaming Voice` (voice)

### Next Steps:

1. **Set Environment Variables:**
   ```env
   SUPABASE_URL=your_supabase_url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
   SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
   ```

2. **Test Database Connection:**
   - Try creating a user profile
   - Send a test message
   - Create a friend request

3. **Configure Storage:**
   - Verify avatar upload works
   - Test file permissions

### Rollback (if needed):

```sql
-- WARNING: This will delete all data
DROP TABLE IF EXISTS public.voice_sessions CASCADE;
DROP TABLE IF EXISTS public.presence CASCADE;
DROP TABLE IF EXISTS public.friends CASCADE;
DROP TABLE IF EXISTS public.friend_requests CASCADE;
DROP TABLE IF EXISTS public.dm_messages CASCADE;
DROP TABLE IF EXISTS public.direct_messages CASCADE;
DROP TABLE IF EXISTS public.messages CASCADE;
DROP TABLE IF EXISTS public.channels CASCADE;
DROP TABLE IF EXISTS public.users CASCADE;

-- Remove storage buckets
DELETE FROM storage.buckets WHERE id IN ('avatars', 'banners', 'attachments');
```

### Troubleshooting:

**Common Issues:**

1. **RLS Policy Errors:**
   - Ensure you're using the correct auth context
   - Check if service role is needed for admin operations

2. **Storage Permission Errors:**
   - Verify storage policies are applied
   - Check bucket public/private settings

3. **Unique Constraint Violations:**
   - Username + discriminator must be unique
   - Friend requests prevent duplicates

**Need Help?**
- Check Supabase logs in dashboard
- Verify environment variables are set correctly
- Test with simple queries first before complex operations
