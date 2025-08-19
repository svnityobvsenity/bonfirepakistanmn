-- =====================================================
-- BONFIRE DISCORD CLONE - COMPLETE DATABASE SCHEMA
-- Migration: 002_app_schema.sql
-- Description: Production-ready schema for Discord-like app
-- =====================================================

-- Enable necessary extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- =====================================================
-- CORE TABLES
-- =====================================================

-- Users table (extends auth.users)
CREATE TABLE IF NOT EXISTS public.users (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    username TEXT NOT NULL,
    discriminator TEXT NOT NULL DEFAULT '0001',
    display_name TEXT,
    avatar_url TEXT,
    banner_url TEXT,
    bio TEXT,
    status TEXT DEFAULT 'offline' CHECK (status IN ('online', 'away', 'busy', 'invisible', 'offline')),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    
    -- Ensure username + discriminator uniqueness
    CONSTRAINT unique_username_discriminator UNIQUE (username, discriminator),
    CONSTRAINT username_length CHECK (char_length(username) >= 2 AND char_length(username) <= 32),
    CONSTRAINT discriminator_format CHECK (discriminator ~ '^[0-9]{4}$')
);

-- Channels table (for server channels)
CREATE TABLE IF NOT EXISTS public.channels (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL,
    type TEXT NOT NULL DEFAULT 'text' CHECK (type IN ('text', 'voice')),
    description TEXT,
    position INTEGER DEFAULT 0,
    metadata JSONB DEFAULT '{}',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    
    CONSTRAINT channel_name_length CHECK (char_length(name) >= 1 AND char_length(name) <= 100)
);

-- Messages table (for channel messages)
CREATE TABLE IF NOT EXISTS public.messages (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    channel_id UUID NOT NULL REFERENCES public.channels(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
    content TEXT NOT NULL,
    metadata JSONB DEFAULT '{}',
    edited_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    
    CONSTRAINT message_content_length CHECK (char_length(content) >= 1 AND char_length(content) <= 2000)
);

-- Direct Messages table (for 1:1 conversations)
CREATE TABLE IF NOT EXISTS public.direct_messages (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_a UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
    user_b UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    
    -- Ensure no duplicate DM channels (order user_a < user_b)
    CONSTRAINT no_duplicate_dms CHECK (user_a < user_b),
    CONSTRAINT different_users CHECK (user_a != user_b),
    CONSTRAINT unique_dm_pair UNIQUE (user_a, user_b)
);

-- DM Messages table (messages in direct conversations)
CREATE TABLE IF NOT EXISTS public.dm_messages (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    dm_id UUID NOT NULL REFERENCES public.direct_messages(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
    content TEXT NOT NULL,
    metadata JSONB DEFAULT '{}',
    edited_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    
    CONSTRAINT dm_message_content_length CHECK (char_length(content) >= 1 AND char_length(content) <= 2000)
);

-- Friend Requests table
CREATE TABLE IF NOT EXISTS public.friend_requests (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    from_user UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
    to_user UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
    status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'accepted', 'rejected')),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    
    -- Prevent self-friend requests and duplicates
    CONSTRAINT no_self_friend CHECK (from_user != to_user),
    CONSTRAINT unique_friend_request UNIQUE (from_user, to_user)
);

-- Friends table (mutual friendships)
CREATE TABLE IF NOT EXISTS public.friends (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_a UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
    user_b UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    
    -- Ensure ordered friendship (user_a < user_b) and no duplicates
    CONSTRAINT ordered_friendship CHECK (user_a < user_b),
    CONSTRAINT no_self_friendship CHECK (user_a != user_b),
    CONSTRAINT unique_friendship UNIQUE (user_a, user_b)
);

-- Presence table (user online status)
CREATE TABLE IF NOT EXISTS public.presence (
    user_id UUID PRIMARY KEY REFERENCES public.users(id) ON DELETE CASCADE,
    last_active TIMESTAMPTZ DEFAULT NOW(),
    status TEXT DEFAULT 'offline' CHECK (status IN ('online', 'away', 'busy', 'invisible', 'offline')),
    activity JSONB DEFAULT '{}',
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Voice Channels State (who's in which voice channel)
CREATE TABLE IF NOT EXISTS public.voice_sessions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
    channel_id UUID NOT NULL REFERENCES public.channels(id) ON DELETE CASCADE,
    is_muted BOOLEAN DEFAULT FALSE,
    is_deafened BOOLEAN DEFAULT FALSE,
    joined_at TIMESTAMPTZ DEFAULT NOW(),
    
    CONSTRAINT unique_user_voice_session UNIQUE (user_id)
);

-- =====================================================
-- INDEXES FOR PERFORMANCE
-- =====================================================

-- Messages indexes (critical for chat performance)
CREATE INDEX IF NOT EXISTS idx_messages_channel_created 
    ON public.messages(channel_id, created_at DESC);

CREATE INDEX IF NOT EXISTS idx_messages_user 
    ON public.messages(user_id);

-- DM Messages indexes
CREATE INDEX IF NOT EXISTS idx_dm_messages_dm_created 
    ON public.dm_messages(dm_id, created_at DESC);

CREATE INDEX IF NOT EXISTS idx_dm_messages_user 
    ON public.dm_messages(user_id);

-- Friend requests indexes
CREATE INDEX IF NOT EXISTS idx_friend_requests_to_user_status 
    ON public.friend_requests(to_user, status);

CREATE INDEX IF NOT EXISTS idx_friend_requests_from_user 
    ON public.friend_requests(from_user);

-- Users indexes
CREATE INDEX IF NOT EXISTS idx_users_username_discriminator 
    ON public.users(username, discriminator);

-- Presence indexes
CREATE INDEX IF NOT EXISTS idx_presence_last_active 
    ON public.presence(last_active DESC);

-- Voice sessions indexes
CREATE INDEX IF NOT EXISTS idx_voice_sessions_channel 
    ON public.voice_sessions(channel_id);

-- =====================================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- =====================================================

-- Enable RLS on all tables
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.channels ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.direct_messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.dm_messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.friend_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.friends ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.presence ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.voice_sessions ENABLE ROW LEVEL SECURITY;

-- Users policies
CREATE POLICY "Users can view all profiles" ON public.users
    FOR SELECT USING (true);

CREATE POLICY "Users can update own profile" ON public.users
    FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Service role can insert users" ON public.users
    FOR INSERT WITH CHECK (auth.role() = 'service_role');

-- Channels policies (public read for now - can be restricted later)
CREATE POLICY "Everyone can view channels" ON public.channels
    FOR SELECT USING (true);

-- Messages policies
CREATE POLICY "Users can view messages in channels" ON public.messages
    FOR SELECT USING (true);

CREATE POLICY "Authenticated users can insert messages" ON public.messages
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own messages" ON public.messages
    FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own messages" ON public.messages
    FOR DELETE USING (auth.uid() = user_id);

-- Direct Messages policies
CREATE POLICY "Users can view own DM channels" ON public.direct_messages
    FOR SELECT USING (auth.uid() = user_a OR auth.uid() = user_b);

CREATE POLICY "Users can create DM channels" ON public.direct_messages
    FOR INSERT WITH CHECK (auth.uid() = user_a OR auth.uid() = user_b);

-- DM Messages policies
CREATE POLICY "Users can view messages in their DMs" ON public.dm_messages
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM public.direct_messages dm 
            WHERE dm.id = dm_id 
            AND (dm.user_a = auth.uid() OR dm.user_b = auth.uid())
        )
    );

CREATE POLICY "Users can send messages in their DMs" ON public.dm_messages
    FOR INSERT WITH CHECK (
        auth.uid() = user_id AND
        EXISTS (
            SELECT 1 FROM public.direct_messages dm 
            WHERE dm.id = dm_id 
            AND (dm.user_a = auth.uid() OR dm.user_b = auth.uid())
        )
    );

CREATE POLICY "Users can update own DM messages" ON public.dm_messages
    FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own DM messages" ON public.dm_messages
    FOR DELETE USING (auth.uid() = user_id);

-- Friend Requests policies
CREATE POLICY "Users can view friend requests involving them" ON public.friend_requests
    FOR SELECT USING (auth.uid() = from_user OR auth.uid() = to_user);

CREATE POLICY "Users can send friend requests" ON public.friend_requests
    FOR INSERT WITH CHECK (auth.uid() = from_user);

CREATE POLICY "Users can update friend requests sent to them" ON public.friend_requests
    FOR UPDATE USING (auth.uid() = to_user);

-- Friends policies
CREATE POLICY "Users can view their friendships" ON public.friends
    FOR SELECT USING (auth.uid() = user_a OR auth.uid() = user_b);

CREATE POLICY "Service role can manage friendships" ON public.friends
    FOR ALL USING (auth.role() = 'service_role');

-- Presence policies
CREATE POLICY "Users can view all presence" ON public.presence
    FOR SELECT USING (true);

CREATE POLICY "Users can update own presence" ON public.presence
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own presence" ON public.presence
    FOR UPDATE USING (auth.uid() = user_id);

-- Voice Sessions policies
CREATE POLICY "Users can view voice sessions" ON public.voice_sessions
    FOR SELECT USING (true);

CREATE POLICY "Users can manage own voice sessions" ON public.voice_sessions
    FOR ALL USING (auth.uid() = user_id);

-- =====================================================
-- FUNCTIONS AND TRIGGERS
-- =====================================================

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Add updated_at triggers
CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON public.users
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_channels_updated_at BEFORE UPDATE ON public.channels
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_friend_requests_updated_at BEFORE UPDATE ON public.friend_requests
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_presence_updated_at BEFORE UPDATE ON public.presence
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Function to generate unique discriminator
CREATE OR REPLACE FUNCTION generate_discriminator(username_param TEXT)
RETURNS TEXT AS $$
DECLARE
    discriminator_val TEXT;
    counter INTEGER := 1;
BEGIN
    -- Try discriminators from 0001 to 9999
    WHILE counter <= 9999 LOOP
        discriminator_val := LPAD(counter::TEXT, 4, '0');
        
        -- Check if this username + discriminator combo is available
        IF NOT EXISTS (
            SELECT 1 FROM public.users 
            WHERE username = username_param AND discriminator = discriminator_val
        ) THEN
            RETURN discriminator_val;
        END IF;
        
        counter := counter + 1;
    END LOOP;
    
    -- If all discriminators are taken, raise error
    RAISE EXCEPTION 'No available discriminator for username: %', username_param;
END;
$$ LANGUAGE plpgsql;

-- Function to accept friend request and create mutual friendship
CREATE OR REPLACE FUNCTION accept_friend_request(request_id UUID)
RETURNS VOID AS $$
DECLARE
    req_record RECORD;
    user_a_id UUID;
    user_b_id UUID;
BEGIN
    -- Get the friend request
    SELECT * INTO req_record FROM public.friend_requests 
    WHERE id = request_id AND status = 'pending';
    
    IF NOT FOUND THEN
        RAISE EXCEPTION 'Friend request not found or not pending';
    END IF;
    
    -- Ensure proper ordering for friendship (smaller UUID first)
    IF req_record.from_user < req_record.to_user THEN
        user_a_id := req_record.from_user;
        user_b_id := req_record.to_user;
    ELSE
        user_a_id := req_record.to_user;
        user_b_id := req_record.from_user;
    END IF;
    
    -- Update request status
    UPDATE public.friend_requests 
    SET status = 'accepted', updated_at = NOW()
    WHERE id = request_id;
    
    -- Create mutual friendship
    INSERT INTO public.friends (user_a, user_b)
    VALUES (user_a_id, user_b_id)
    ON CONFLICT (user_a, user_b) DO NOTHING;
END;
$$ LANGUAGE plpgsql;

-- =====================================================
-- SAMPLE DATA (for development)
-- =====================================================

-- Insert default channels
INSERT INTO public.channels (id, name, type, description, position) VALUES
    ('550e8400-e29b-41d4-a716-446655440001', 'general', 'text', 'General discussion', 0),
    ('550e8400-e29b-41d4-a716-446655440002', 'random', 'text', 'Random chat', 1),
    ('550e8400-e29b-41d4-a716-446655440003', 'announcements', 'text', 'Important announcements', 2),
    ('550e8400-e29b-41d4-a716-446655440004', 'General Voice', 'voice', 'General voice channel', 3),
    ('550e8400-e29b-41d4-a716-446655440005', 'Gaming Voice', 'voice', 'Gaming voice channel', 4)
ON CONFLICT (id) DO NOTHING;

-- =====================================================
-- STORAGE BUCKETS (for avatars and attachments)
-- =====================================================

-- Create storage buckets
INSERT INTO storage.buckets (id, name, public) VALUES 
    ('avatars', 'avatars', true),
    ('banners', 'banners', true),
    ('attachments', 'attachments', false)
ON CONFLICT (id) DO NOTHING;

-- Storage policies for avatars
CREATE POLICY "Avatar images are publicly accessible" ON storage.objects
    FOR SELECT USING (bucket_id = 'avatars');

CREATE POLICY "Users can upload their own avatar" ON storage.objects
    FOR INSERT WITH CHECK (
        bucket_id = 'avatars' AND 
        auth.uid()::text = (storage.foldername(name))[1]
    );

CREATE POLICY "Users can update their own avatar" ON storage.objects
    FOR UPDATE USING (
        bucket_id = 'avatars' AND 
        auth.uid()::text = (storage.foldername(name))[1]
    );

-- Storage policies for banners
CREATE POLICY "Banner images are publicly accessible" ON storage.objects
    FOR SELECT USING (bucket_id = 'banners');

CREATE POLICY "Users can upload their own banner" ON storage.objects
    FOR INSERT WITH CHECK (
        bucket_id = 'banners' AND 
        auth.uid()::text = (storage.foldername(name))[1]
    );

-- =====================================================
-- COMPLETION
-- =====================================================

-- Log completion
DO $$
BEGIN
    RAISE NOTICE 'Bonfire Discord Clone schema migration completed successfully!';
    RAISE NOTICE 'Tables created: users, channels, messages, direct_messages, dm_messages, friend_requests, friends, presence, voice_sessions';
    RAISE NOTICE 'Indexes created for optimal query performance';
    RAISE NOTICE 'RLS policies enabled for security';
    RAISE NOTICE 'Storage buckets created for avatars, banners, attachments';
    RAISE NOTICE 'Helper functions created for discriminator generation and friend acceptance';
END $$;
