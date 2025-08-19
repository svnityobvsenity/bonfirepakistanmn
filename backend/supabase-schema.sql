-- Discord Clone Database Schema for Supabase
-- Run this in your Supabase SQL Editor

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Users table (extends Supabase auth.users)
CREATE TABLE public.users (
  id UUID REFERENCES auth.users(id) PRIMARY KEY,
  username VARCHAR(30) UNIQUE NOT NULL,
  display_name VARCHAR(50),
  avatar_url TEXT,
  status VARCHAR(20) DEFAULT 'offline' CHECK (status IN ('online', 'away', 'busy', 'invisible', 'offline')),
  about_me TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  last_seen TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Servers table
CREATE TABLE public.servers (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  description TEXT,
  icon_url TEXT,
  owner_id UUID REFERENCES public.users(id) NOT NULL,
  invite_code VARCHAR(20) UNIQUE,
  is_public BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Server members table
CREATE TABLE public.server_members (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  server_id UUID REFERENCES public.servers(id) ON DELETE CASCADE,
  user_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
  role VARCHAR(20) DEFAULT 'member' CHECK (role IN ('owner', 'admin', 'moderator', 'member')),
  nickname VARCHAR(50),
  joined_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(server_id, user_id)
);

-- Channels table (text and voice channels)
CREATE TABLE public.channels (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  server_id UUID REFERENCES public.servers(id) ON DELETE CASCADE,
  name VARCHAR(100) NOT NULL,
  type VARCHAR(10) DEFAULT 'text' CHECK (type IN ('text', 'voice')),
  topic TEXT,
  position INTEGER DEFAULT 0,
  is_nsfw BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Messages table (server and DM messages)
CREATE TABLE public.messages (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  content TEXT NOT NULL,
  author_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
  channel_id UUID REFERENCES public.channels(id) ON DELETE CASCADE,
  server_id UUID REFERENCES public.servers(id) ON DELETE CASCADE,
  reply_to_id UUID REFERENCES public.messages(id) ON DELETE SET NULL,
  edited_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  message_type VARCHAR(20) DEFAULT 'text' CHECK (message_type IN ('text', 'system', 'join', 'leave'))
);

-- DM conversations table
CREATE TABLE public.dm_conversations (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- DM participants table
CREATE TABLE public.dm_participants (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  conversation_id UUID REFERENCES public.dm_conversations(id) ON DELETE CASCADE,
  user_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
  joined_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(conversation_id, user_id)
);

-- DM messages table
CREATE TABLE public.dm_messages (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  content TEXT NOT NULL,
  author_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
  conversation_id UUID REFERENCES public.dm_conversations(id) ON DELETE CASCADE,
  reply_to_id UUID REFERENCES public.dm_messages(id) ON DELETE SET NULL,
  edited_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  message_type VARCHAR(20) DEFAULT 'text' CHECK (message_type IN ('text', 'system'))
);

-- Voice sessions table (track who's in voice channels)
CREATE TABLE public.voice_sessions (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
  channel_id UUID REFERENCES public.channels(id) ON DELETE CASCADE,
  server_id UUID REFERENCES public.servers(id) ON DELETE CASCADE,
  conversation_id UUID REFERENCES public.dm_conversations(id) ON DELETE CASCADE,
  is_muted BOOLEAN DEFAULT false,
  is_deafened BOOLEAN DEFAULT false,
  is_speaking BOOLEAN DEFAULT false,
  joined_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id) -- User can only be in one voice channel at a time
);

-- Friend requests table
CREATE TABLE public.friend_requests (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  requester_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
  addressee_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
  status VARCHAR(20) DEFAULT 'pending' CHECK (status IN ('pending', 'accepted', 'declined', 'blocked')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(requester_id, addressee_id)
);

-- User presence table (online status, current activity)
CREATE TABLE public.user_presence (
  user_id UUID REFERENCES public.users(id) ON DELETE CASCADE PRIMARY KEY,
  status VARCHAR(20) DEFAULT 'offline' CHECK (status IN ('online', 'away', 'busy', 'invisible', 'offline')),
  current_server_id UUID REFERENCES public.servers(id) ON DELETE SET NULL,
  current_channel_id UUID REFERENCES public.channels(id) ON DELETE SET NULL,
  current_dm_id UUID REFERENCES public.dm_conversations(id) ON DELETE SET NULL,
  socket_id VARCHAR(50),
  last_seen TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX idx_messages_channel_id ON public.messages(channel_id);
CREATE INDEX idx_messages_author_id ON public.messages(author_id);
CREATE INDEX idx_messages_created_at ON public.messages(created_at DESC);
CREATE INDEX idx_dm_messages_conversation_id ON public.dm_messages(conversation_id);
CREATE INDEX idx_dm_messages_author_id ON public.dm_messages(author_id);
CREATE INDEX idx_dm_messages_created_at ON public.dm_messages(created_at DESC);
CREATE INDEX idx_server_members_server_id ON public.server_members(server_id);
CREATE INDEX idx_server_members_user_id ON public.server_members(user_id);
CREATE INDEX idx_voice_sessions_channel_id ON public.voice_sessions(channel_id);
CREATE INDEX idx_voice_sessions_user_id ON public.voice_sessions(user_id);
CREATE INDEX idx_user_presence_status ON public.user_presence(status);
CREATE INDEX idx_users_username ON public.users(username);

-- Row Level Security (RLS) Policies

-- Enable RLS on all tables
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.servers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.server_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.channels ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.dm_conversations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.dm_participants ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.dm_messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.voice_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.friend_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_presence ENABLE ROW LEVEL SECURITY;

-- Users can read all public user profiles, but only update their own
CREATE POLICY "Public profiles are viewable by everyone" ON public.users
  FOR SELECT USING (true);

CREATE POLICY "Users can update own profile" ON public.users
  FOR UPDATE USING (auth.uid() = id);

-- Server policies
CREATE POLICY "Public servers are viewable by everyone" ON public.servers
  FOR SELECT USING (is_public = true);

CREATE POLICY "Server members can view their servers" ON public.servers
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.server_members 
      WHERE server_id = id AND user_id = auth.uid()
    )
  );

CREATE POLICY "Server owners can update their servers" ON public.servers
  FOR UPDATE USING (owner_id = auth.uid());

-- Server members policies
CREATE POLICY "Server members are viewable by server members" ON public.server_members
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.server_members sm 
      WHERE sm.server_id = server_members.server_id AND sm.user_id = auth.uid()
    )
  );

-- Messages policies
CREATE POLICY "Messages are viewable by server members" ON public.messages
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.server_members 
      WHERE server_id = messages.server_id AND user_id = auth.uid()
    )
  );

CREATE POLICY "Users can insert messages in servers they're members of" ON public.messages
  FOR INSERT WITH CHECK (
    author_id = auth.uid() AND
    EXISTS (
      SELECT 1 FROM public.server_members 
      WHERE server_id = messages.server_id AND user_id = auth.uid()
    )
  );

-- DM policies
CREATE POLICY "DM participants can view their conversations" ON public.dm_conversations
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.dm_participants 
      WHERE conversation_id = id AND user_id = auth.uid()
    )
  );

CREATE POLICY "DM messages are viewable by participants" ON public.dm_messages
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.dm_participants 
      WHERE conversation_id = dm_messages.conversation_id AND user_id = auth.uid()
    )
  );

-- Voice sessions policies
CREATE POLICY "Voice sessions are viewable by server/DM members" ON public.voice_sessions
  FOR SELECT USING (
    (server_id IS NOT NULL AND EXISTS (
      SELECT 1 FROM public.server_members 
      WHERE server_id = voice_sessions.server_id AND user_id = auth.uid()
    )) OR
    (conversation_id IS NOT NULL AND EXISTS (
      SELECT 1 FROM public.dm_participants 
      WHERE conversation_id = voice_sessions.conversation_id AND user_id = auth.uid()
    ))
  );

-- User presence policies
CREATE POLICY "User presence is viewable by everyone" ON public.user_presence
  FOR SELECT USING (true);

CREATE POLICY "Users can update their own presence" ON public.user_presence
  FOR ALL USING (user_id = auth.uid());

-- Functions for common operations

-- Function to create a new server with default channels
CREATE OR REPLACE FUNCTION create_server_with_defaults(
  server_name TEXT,
  server_description TEXT DEFAULT NULL,
  server_icon_url TEXT DEFAULT NULL
) RETURNS UUID AS $$
DECLARE
  new_server_id UUID;
  general_channel_id UUID;
BEGIN
  -- Create the server
  INSERT INTO public.servers (name, description, icon_url, owner_id, invite_code)
  VALUES (server_name, server_description, server_icon_url, auth.uid(), 
          SUBSTR(MD5(RANDOM()::TEXT), 1, 8))
  RETURNING id INTO new_server_id;
  
  -- Add owner as member
  INSERT INTO public.server_members (server_id, user_id, role)
  VALUES (new_server_id, auth.uid(), 'owner');
  
  -- Create default general text channel
  INSERT INTO public.channels (server_id, name, type, position)
  VALUES (new_server_id, 'general', 'text', 0)
  RETURNING id INTO general_channel_id;
  
  -- Create default voice channel
  INSERT INTO public.channels (server_id, name, type, position)
  VALUES (new_server_id, 'General', 'voice', 1);
  
  RETURN new_server_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to get or create DM conversation
CREATE OR REPLACE FUNCTION get_or_create_dm_conversation(other_user_id UUID)
RETURNS UUID AS $$
DECLARE
  conversation_id UUID;
BEGIN
  -- Check if conversation already exists
  SELECT dc.id INTO conversation_id
  FROM public.dm_conversations dc
  WHERE EXISTS (
    SELECT 1 FROM public.dm_participants dp1 
    WHERE dp1.conversation_id = dc.id AND dp1.user_id = auth.uid()
  ) AND EXISTS (
    SELECT 1 FROM public.dm_participants dp2 
    WHERE dp2.conversation_id = dc.id AND dp2.user_id = other_user_id
  ) AND (
    SELECT COUNT(*) FROM public.dm_participants dp 
    WHERE dp.conversation_id = dc.id
  ) = 2;
  
  -- If conversation doesn't exist, create it
  IF conversation_id IS NULL THEN
    INSERT INTO public.dm_conversations DEFAULT VALUES
    RETURNING id INTO conversation_id;
    
    -- Add both participants
    INSERT INTO public.dm_participants (conversation_id, user_id)
    VALUES (conversation_id, auth.uid()), (conversation_id, other_user_id);
  END IF;
  
  RETURN conversation_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger to update user presence when they come online
CREATE OR REPLACE FUNCTION update_user_last_seen()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE public.user_presence 
  SET last_seen = NOW(), updated_at = NOW()
  WHERE user_id = NEW.id;
  
  IF NOT FOUND THEN
    INSERT INTO public.user_presence (user_id, last_seen, updated_at)
    VALUES (NEW.id, NOW(), NOW());
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger
CREATE TRIGGER update_user_last_seen_trigger
  AFTER UPDATE ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION update_user_last_seen();

-- Insert some default servers (you can modify or remove these)
INSERT INTO public.servers (id, name, description, owner_id, is_public, invite_code) VALUES
  ('550e8400-e29b-41d4-a716-446655440001', 'Dev Community', 'A place for developers to chat and share knowledge', (SELECT id FROM auth.users LIMIT 1), true, 'devcommunity'),
  ('550e8400-e29b-41d4-a716-446655440002', 'Gaming Hub', 'Discuss games, stream, and find teammates', (SELECT id FROM auth.users LIMIT 1), true, 'gaminghub'),
  ('550e8400-e29b-41d4-a716-446655440003', 'Creative Corner', 'Share your art, music, and creative projects', (SELECT id FROM auth.users LIMIT 1), true, 'creative');

-- Insert default channels for each server
INSERT INTO public.channels (server_id, name, type, position) VALUES
  ('550e8400-e29b-41d4-a716-446655440001', 'general', 'text', 0),
  ('550e8400-e29b-41d4-a716-446655440001', 'react-help', 'text', 1),
  ('550e8400-e29b-41d4-a716-446655440001', 'showcase', 'text', 2),
  ('550e8400-e29b-41d4-a716-446655440001', 'General Voice', 'voice', 3),
  ('550e8400-e29b-41d4-a716-446655440001', 'Study Hall', 'voice', 4),
  
  ('550e8400-e29b-41d4-a716-446655440002', 'general', 'text', 0),
  ('550e8400-e29b-41d4-a716-446655440002', 'game-chat', 'text', 1),
  ('550e8400-e29b-41d4-a716-446655440002', 'looking-for-group', 'text', 2),
  ('550e8400-e29b-41d4-a716-446655440002', 'Gaming Voice', 'voice', 3),
  ('550e8400-e29b-41d4-a716-446655440002', 'Party Up', 'voice', 4),
  
  ('550e8400-e29b-41d4-a716-446655440003', 'general', 'text', 0),
  ('550e8400-e29b-41d4-a716-446655440003', 'art-share', 'text', 1),
  ('550e8400-e29b-41d4-a716-446655440003', 'feedback', 'text', 2),
  ('550e8400-e29b-41d4-a716-446655440003', 'Creative Voice', 'voice', 3),
  ('550e8400-e29b-41d4-a716-446655440003', 'Collab Room', 'voice', 4);

