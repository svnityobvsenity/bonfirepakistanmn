import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true
  }
})

// Server-side client with service role (for admin operations)
export const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
  {
    auth: {
      autoRefreshToken: false,
      persistSession: false
    }
  }
)

// Type definitions for our database schema
export interface User {
  id: string
  username: string
  discriminator: string
  display_name?: string
  avatar_url?: string
  banner_url?: string
  bio?: string
  status: 'online' | 'away' | 'busy' | 'invisible' | 'offline'
  created_at: string
  updated_at: string
}

export interface Channel {
  id: string
  name: string
  type: 'text' | 'voice'
  description?: string
  position: number
  metadata: Record<string, any>
  created_at: string
  updated_at: string
}

export interface Message {
  id: string
  channel_id: string
  user_id: string
  content: string
  metadata: Record<string, any>
  edited_at?: string
  created_at: string
}

export interface DirectMessage {
  id: string
  user_a: string
  user_b: string
  created_at: string
}

export interface DMMessage {
  id: string
  dm_id: string
  user_id: string
  content: string
  metadata: Record<string, any>
  edited_at?: string
  created_at: string
}

export interface FriendRequest {
  id: string
  from_user: string
  to_user: string
  status: 'pending' | 'accepted' | 'rejected'
  created_at: string
  updated_at: string
}

export interface Friend {
  id: string
  user_a: string
  user_b: string
  created_at: string
}

export interface Presence {
  user_id: string
  last_active: string
  status: 'online' | 'away' | 'busy' | 'invisible' | 'offline'
  activity: Record<string, any>
  updated_at: string
}

export interface VoiceSession {
  id: string
  user_id: string
  channel_id: string
  is_muted: boolean
  is_deafened: boolean
  joined_at: string
}
