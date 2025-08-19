import { supabase } from './supabaseClient'

export interface Channel {
  id: string
  name: string
  description?: string
  is_private: boolean
  created_at: string
  owner_id: string
  member_count: number
  last_message_at?: string
  owner: {
    id: string
    username: string
    display_name: string
    avatar_url?: string
    discriminator: string
  }
}

export interface CreateChannelData {
  name: string
  description?: string
  isPrivate?: boolean
}

export interface UpdateChannelData {
  name?: string
  description?: string
  isPrivate?: boolean
}

export interface ChannelResult {
  success: boolean
  channel?: Channel
  error?: string
}

export interface ChannelsResult {
  success: boolean
  channels: Channel[]
  error?: string
}

export const fetchUserChannels = async (): Promise<ChannelsResult> => {
  try {
    const { data: { session } } = await supabase.auth.getSession()
    
    if (!session) {
      return { success: false, channels: [], error: 'Not authenticated' }
    }

    const { data, error } = await supabase
      .from('channel_members')
      .select(`
        channel:channels(
          *,
          owner:profiles(id, username, display_name, avatar_url, discriminator)
        )
      `)
      .eq('user_id', session.user.id)
      .order('last_message_at', { ascending: false, nullsFirst: false })

    if (error) {
      return { success: false, channels: [], error: error.message }
    }

    const channels = (data?.map(item => item.channel).filter(Boolean) || []) as unknown as Channel[]

    return { success: true, channels }
  } catch (error) {
    return { success: false, channels: [], error: 'An unexpected error occurred' }
  }
}

export const createChannel = async (data: CreateChannelData): Promise<ChannelResult> => {
  try {
    const { data: { session } } = await supabase.auth.getSession()
    
    if (!session) {
      return { success: false, error: 'Not authenticated' }
    }

    // Validate channel name
    if (!data.name || data.name.length < 2 || data.name.length > 32) {
      return { success: false, error: 'Channel name must be between 2 and 32 characters' }
    }

    // Check if channel name already exists
    const { data: existingChannel } = await supabase
      .from('channels')
      .select('id')
      .eq('name', data.name)
      .single()

    if (existingChannel) {
      return { success: false, error: 'Channel name already exists' }
    }

    // Create channel
    const { data: channel, error } = await supabase
      .from('channels')
      .insert({
        name: data.name,
        description: data.description || '',
        is_private: data.isPrivate || false,
        owner_id: session.user.id
      })
      .select(`
        *,
        owner:profiles(id, username, display_name, avatar_url, discriminator)
      `)
      .single()

    if (error) {
      return { success: false, error: error.message }
    }

    // Add creator as member
    const { error: memberError } = await supabase
      .from('channel_members')
      .insert({
        channel_id: channel.id,
        user_id: session.user.id
      })

    if (memberError) {
      return { success: false, error: memberError.message }
    }

    return { success: true, channel }
  } catch (error) {
    return { success: false, error: 'An unexpected error occurred' }
  }
}

export const joinChannel = async (channelId: string): Promise<{ success: boolean; error?: string }> => {
  try {
    const { data: { session } } = await supabase.auth.getSession()
    
    if (!session) {
      return { success: false, error: 'Not authenticated' }
    }

    // Check if channel exists and is public
    const { data: channel } = await supabase
      .from('channels')
      .select('is_private')
      .eq('id', channelId)
      .single()

    if (!channel) {
      return { success: false, error: 'Channel not found' }
    }

    if (channel.is_private) {
      return { success: false, error: 'Cannot join private channel' }
    }

    // Check if already a member
    const { data: existingMember } = await supabase
      .from('channel_members')
      .select('id')
      .eq('channel_id', channelId)
      .eq('user_id', session.user.id)
      .single()

    if (existingMember) {
      return { success: false, error: 'Already a member of this channel' }
    }

    // Join channel
    const { error } = await supabase
      .from('channel_members')
      .insert({
        channel_id: channelId,
        user_id: session.user.id
      })

    if (error) {
      return { success: false, error: error.message }
    }

    return { success: true }
  } catch (error) {
    return { success: false, error: 'An unexpected error occurred' }
  }
}

export const leaveChannel = async (channelId: string): Promise<{ success: boolean; error?: string }> => {
  try {
    const { data: { session } } = await supabase.auth.getSession()
    
    if (!session) {
      return { success: false, error: 'Not authenticated' }
    }

    // Check if user is the owner
    const { data: channel } = await supabase
      .from('channels')
      .select('owner_id')
      .eq('id', channelId)
      .single()

    if (channel?.owner_id === session.user.id) {
      return { success: false, error: 'Channel owner cannot leave the channel' }
    }

    // Leave channel
    const { error } = await supabase
      .from('channel_members')
      .delete()
      .eq('channel_id', channelId)
      .eq('user_id', session.user.id)

    if (error) {
      return { success: false, error: error.message }
    }

    return { success: true }
  } catch (error) {
    return { success: false, error: 'An unexpected error occurred' }
  }
}

export const getChannelById = async (channelId: string): Promise<ChannelResult> => {
  try {
    const { data: { session } } = await supabase.auth.getSession()
    
    if (!session) {
      return { success: false, error: 'Not authenticated' }
    }

    // Check if user is a member
    const { data: member } = await supabase
      .from('channel_members')
      .select('id')
      .eq('channel_id', channelId)
      .eq('user_id', session.user.id)
      .single()

    if (!member) {
      return { success: false, error: 'Not a member of this channel' }
    }

    // Get channel details
    const { data: channel, error } = await supabase
      .from('channels')
      .select(`
        *,
        owner:profiles(id, username, display_name, avatar_url, discriminator)
      `)
      .eq('id', channelId)
      .single()

    if (error) {
      return { success: false, error: error.message }
    }

    if (!channel) {
      return { success: false, error: 'Channel not found' }
    }

    return { success: true, channel }
  } catch (error) {
    return { success: false, error: 'An unexpected error occurred' }
  }
}

export const updateChannelSettings = async (
  channelId: string,
  data: UpdateChannelData
): Promise<ChannelResult> => {
  try {
    const { data: { session } } = await supabase.auth.getSession()
    
    if (!session) {
      return { success: false, error: 'Not authenticated' }
    }

    // Check if user is the owner
    const { data: channel } = await supabase
      .from('channels')
      .select('owner_id')
      .eq('id', channelId)
      .single()

    if (!channel || channel.owner_id !== session.user.id) {
      return { success: false, error: 'Not authorized to update this channel' }
    }

    // Validate channel name if provided
    if (data.name && (data.name.length < 2 || data.name.length > 32)) {
      return { success: false, error: 'Channel name must be between 2 and 32 characters' }
    }

    // Check if new name already exists (if changing name)
    if (data.name) {
      const { data: existingChannel } = await supabase
        .from('channels')
        .select('id')
        .eq('name', data.name)
        .neq('id', channelId)
        .single()

      if (existingChannel) {
        return { success: false, error: 'Channel name already exists' }
      }
    }

    // Update channel
    const { data: updatedChannel, error } = await supabase
      .from('channels')
      .update({
        ...(data.name && { name: data.name }),
        ...(data.description !== undefined && { description: data.description }),
        ...(data.isPrivate !== undefined && { is_private: data.isPrivate })
      })
      .eq('id', channelId)
      .select(`
        *,
        owner:profiles(id, username, display_name, avatar_url, discriminator)
      `)
      .single()

    if (error) {
      return { success: false, error: error.message }
    }

    return { success: true, channel: updatedChannel }
  } catch (error) {
    return { success: false, error: 'An unexpected error occurred' }
  }
}
