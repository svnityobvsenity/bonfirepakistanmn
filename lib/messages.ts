import { supabase } from './supabaseClient'
import type { Message, DMMessage } from './supabaseClient'

export interface MessageWithUser extends Message {
  user: {
    id: string
    username: string
    display_name?: string
    avatar_url?: string
    discriminator: string
  }
}

export interface DMMessageWithUser extends DMMessage {
  user: {
    id: string
    username: string
    display_name?: string
    avatar_url?: string
    discriminator: string
  }
}

export interface SendMessageParams {
  content: string
  metadata?: Record<string, any>
}

export interface MessageResponse {
  success: boolean
  message?: MessageWithUser | DMMessageWithUser
  error?: string
}

// Channel Messages
export const fetchChannelMessages = async (
  channelId: string, 
  cursor?: string, 
  limit: number = 50
): Promise<{ messages: MessageWithUser[], hasMore: boolean, nextCursor?: string }> => {
  try {
    let query = supabase
      .from('messages')
      .select(`
        *,
        user:users!messages_user_id_fkey(
          id,
          username,
          display_name,
          avatar_url,
          discriminator
        )
      `)
      .eq('channel_id', channelId)
      .order('created_at', { ascending: false })
      .limit(limit)

    if (cursor) {
      query = query.lt('created_at', cursor)
    }

    const { data, error } = await query

    if (error) throw error

    const messages = (data || []) as MessageWithUser[]
    const hasMore = messages.length === limit
    const nextCursor = hasMore ? messages[messages.length - 1]?.created_at : undefined

    return {
      messages: messages.reverse(), // Return in chronological order
      hasMore,
      nextCursor
    }
  } catch (error: any) {
    console.error('Fetch channel messages error:', error)
    throw new Error(error.message || 'Failed to fetch messages')
  }
}

export const sendChannelMessage = async (
  channelId: string, 
  params: SendMessageParams
): Promise<MessageResponse> => {
  try {
    const { data: { session } } = await supabase.auth.getSession()
    if (!session) {
      throw new Error('Not authenticated')
    }

    const { data, error } = await supabase
      .from('messages')
      .insert({
        channel_id: channelId,
        user_id: session.user.id,
        content: params.content,
        metadata: params.metadata || {}
      })
      .select(`
        *,
        user:users!messages_user_id_fkey(
          id,
          username,
          display_name,
          avatar_url,
          discriminator
        )
      `)
      .single()

    if (error) throw error

    return {
      success: true,
      message: data as MessageWithUser
    }
  } catch (error: any) {
    console.error('Send channel message error:', error)
    return {
      success: false,
      error: error.message || 'Failed to send message'
    }
  }
}

export const editChannelMessage = async (
  messageId: string, 
  newContent: string
): Promise<MessageResponse> => {
  try {
    const { data: { session } } = await supabase.auth.getSession()
    if (!session) {
      throw new Error('Not authenticated')
    }

    // First check if user owns the message
    const { data: existingMessage } = await supabase
      .from('messages')
      .select('user_id')
      .eq('id', messageId)
      .single()

    if (!existingMessage || existingMessage.user_id !== session.user.id) {
      throw new Error('Not authorized to edit this message')
    }

    const { data, error } = await supabase
      .from('messages')
      .update({
        content: newContent,
        edited_at: new Date().toISOString()
      })
      .eq('id', messageId)
      .select(`
        *,
        user:users!messages_user_id_fkey(
          id,
          username,
          display_name,
          avatar_url,
          discriminator
        )
      `)
      .single()

    if (error) throw error

    return {
      success: true,
      message: data as MessageWithUser
    }
  } catch (error: any) {
    console.error('Edit channel message error:', error)
    return {
      success: false,
      error: error.message || 'Failed to edit message'
    }
  }
}

export const deleteChannelMessage = async (messageId: string): Promise<{ success: boolean; error?: string }> => {
  try {
    const { data: { session } } = await supabase.auth.getSession()
    if (!session) {
      throw new Error('Not authenticated')
    }

    // First check if user owns the message
    const { data: existingMessage } = await supabase
      .from('messages')
      .select('user_id')
      .eq('id', messageId)
      .single()

    if (!existingMessage || existingMessage.user_id !== session.user.id) {
      throw new Error('Not authorized to delete this message')
    }

    const { error } = await supabase
      .from('messages')
      .delete()
      .eq('id', messageId)

    if (error) throw error

    return { success: true }
  } catch (error: any) {
    console.error('Delete channel message error:', error)
    return {
      success: false,
      error: error.message || 'Failed to delete message'
    }
  }
}

// Direct Messages
export const getOrCreateDM = async (otherUserId: string): Promise<{ dmId: string; error?: string }> => {
  try {
    const { data: { session } } = await supabase.auth.getSession()
    if (!session) {
      throw new Error('Not authenticated')
    }

    const userId = session.user.id

    // Check if DM already exists
    const { data: existingDM } = await supabase
      .from('direct_messages')
      .select('id')
      .or(`and(user_a.eq.${userId},user_b.eq.${otherUserId}),and(user_a.eq.${otherUserId},user_b.eq.${userId})`)
      .single()

    if (existingDM) {
      return { dmId: existingDM.id }
    }

    // Create new DM (ensure proper ordering)
    const userA = userId < otherUserId ? userId : otherUserId
    const userB = userId < otherUserId ? otherUserId : userId

    const { data: newDM, error } = await supabase
      .from('direct_messages')
      .insert({
        user_a: userA,
        user_b: userB
      })
      .select('id')
      .single()

    if (error) throw error

    return { dmId: newDM.id }
  } catch (error: any) {
    console.error('Get or create DM error:', error)
    return {
      dmId: '',
      error: error.message || 'Failed to create DM'
    }
  }
}

export const fetchDMMessages = async (
  dmId: string, 
  cursor?: string, 
  limit: number = 50
): Promise<{ messages: DMMessageWithUser[], hasMore: boolean, nextCursor?: string }> => {
  try {
    let query = supabase
      .from('dm_messages')
      .select(`
        *,
        user:users!dm_messages_user_id_fkey(
          id,
          username,
          display_name,
          avatar_url,
          discriminator
        )
      `)
      .eq('dm_id', dmId)
      .order('created_at', { ascending: false })
      .limit(limit)

    if (cursor) {
      query = query.lt('created_at', cursor)
    }

    const { data, error } = await query

    if (error) throw error

    const messages = (data || []) as DMMessageWithUser[]
    const hasMore = messages.length === limit
    const nextCursor = hasMore ? messages[messages.length - 1]?.created_at : undefined

    return {
      messages: messages.reverse(), // Return in chronological order
      hasMore,
      nextCursor
    }
  } catch (error: any) {
    console.error('Fetch DM messages error:', error)
    throw new Error(error.message || 'Failed to fetch DM messages')
  }
}

export const sendDMMessage = async (
  dmId: string, 
  params: SendMessageParams
): Promise<MessageResponse> => {
  try {
    const { data: { session } } = await supabase.auth.getSession()
    if (!session) {
      throw new Error('Not authenticated')
    }

    const { data, error } = await supabase
      .from('dm_messages')
      .insert({
        dm_id: dmId,
        user_id: session.user.id,
        content: params.content,
        metadata: params.metadata || {}
      })
      .select(`
        *,
        user:users!dm_messages_user_id_fkey(
          id,
          username,
          display_name,
          avatar_url,
          discriminator
        )
      `)
      .single()

    if (error) throw error

    return {
      success: true,
      message: data as DMMessageWithUser
    }
  } catch (error: any) {
    console.error('Send DM message error:', error)
    return {
      success: false,
      error: error.message || 'Failed to send DM message'
    }
  }
}

export const editDMMessage = async (
  messageId: string, 
  newContent: string
): Promise<MessageResponse> => {
  try {
    const { data: { session } } = await supabase.auth.getSession()
    if (!session) {
      throw new Error('Not authenticated')
    }

    // First check if user owns the message
    const { data: existingMessage } = await supabase
      .from('dm_messages')
      .select('user_id')
      .eq('id', messageId)
      .single()

    if (!existingMessage || existingMessage.user_id !== session.user.id) {
      throw new Error('Not authorized to edit this message')
    }

    const { data, error } = await supabase
      .from('dm_messages')
      .update({
        content: newContent,
        edited_at: new Date().toISOString()
      })
      .eq('id', messageId)
      .select(`
        *,
        user:users!dm_messages_user_id_fkey(
          id,
          username,
          display_name,
          avatar_url,
          discriminator
        )
      `)
      .single()

    if (error) throw error

    return {
      success: true,
      message: data as DMMessageWithUser
    }
  } catch (error: any) {
    console.error('Edit DM message error:', error)
    return {
      success: false,
      error: error.message || 'Failed to edit DM message'
    }
  }
}

export const deleteDMMessage = async (messageId: string): Promise<{ success: boolean; error?: string }> => {
  try {
    const { data: { session } } = await supabase.auth.getSession()
    if (!session) {
      throw new Error('Not authenticated')
    }

    // First check if user owns the message
    const { data: existingMessage } = await supabase
      .from('dm_messages')
      .select('user_id')
      .eq('id', messageId)
      .single()

    if (!existingMessage || existingMessage.user_id !== session.user.id) {
      throw new Error('Not authorized to delete this message')
    }

    const { error } = await supabase
      .from('dm_messages')
      .delete()
      .eq('id', messageId)

    if (error) throw error

    return { success: true }
  } catch (error: any) {
    console.error('Delete DM message error:', error)
    return {
      success: false,
      error: error.message || 'Failed to delete DM message'
    }
  }
}

// Utility functions
export const formatMessageTime = (timestamp: string): string => {
  const date = new Date(timestamp)
  const now = new Date()
  const diffInHours = (now.getTime() - date.getTime()) / (1000 * 60 * 60)

  if (diffInHours < 24) {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
  } else if (diffInHours < 168) { // 7 days
    return date.toLocaleDateString([], { weekday: 'short' })
  } else {
    return date.toLocaleDateString([], { month: 'short', day: 'numeric' })
  }
}

export const isMessageEdited = (message: Message | DMMessage): boolean => {
  return !!message.edited_at
}
