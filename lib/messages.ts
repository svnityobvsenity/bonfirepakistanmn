import { supabase } from './supabaseClient'

export interface Message {
  id: string
  channel_id: string
  user_id: string
  content: string
  created_at: string
  edited_at?: string
  user: {
    id: string
    username: string
    display_name: string
    avatar_url?: string
    discriminator: string
  }
}

export interface MessageResult {
  success: boolean
  message?: Message
  error?: string
}

export interface MessagesResult {
  success: boolean
  messages: Message[]
  hasMore: boolean
  error?: string
}

export const fetchChannelMessages = async (
  channelId: string,
  cursor?: string
): Promise<MessagesResult> => {
  try {
    let query = supabase
      .from('messages')
      .select(`
        *,
        user:profiles(id, username, display_name, avatar_url, discriminator)
      `)
      .eq('channel_id', channelId)
      .order('created_at', { ascending: false })
      .limit(50)

    if (cursor) {
      query = query.lt('created_at', cursor)
    }

    const { data, error } = await query

    if (error) {
      return { success: false, messages: [], hasMore: false, error: error.message }
    }

    const messages = data || []
    const hasMore = messages.length === 50

    return {
      success: true,
      messages: messages.reverse(), // Show oldest first
      hasMore
    }
  } catch (error) {
    return { success: false, messages: [], hasMore: false, error: 'An unexpected error occurred' }
  }
}

export const sendChannelMessage = async (
  channelId: string,
  data: { content: string }
): Promise<MessageResult> => {
  try {
    const { data: { session } } = await supabase.auth.getSession()
    
    if (!session) {
      return { success: false, error: 'Not authenticated' }
    }

    if (!data.content.trim()) {
      return { success: false, error: 'Message content is required' }
    }

    const { data: message, error } = await supabase
      .from('messages')
      .insert({
        channel_id: channelId,
        user_id: session.user.id,
        content: data.content.trim()
      })
      .select(`
        *,
        user:profiles(id, username, display_name, avatar_url, discriminator)
      `)
      .single()

    if (error) {
      return { success: false, error: error.message }
    }

    return { success: true, message }
  } catch (error) {
    return { success: false, error: 'An unexpected error occurred' }
  }
}

export const editChannelMessage = async (
  messageId: string,
  content: string
): Promise<MessageResult> => {
  try {
    const { data: { session } } = await supabase.auth.getSession()
    
    if (!session) {
      return { success: false, error: 'Not authenticated' }
    }

    if (!content.trim()) {
      return { success: false, error: 'Message content is required' }
    }

    // Check if user owns the message
    const { data: existingMessage } = await supabase
      .from('messages')
      .select('user_id')
      .eq('id', messageId)
      .single()

    if (!existingMessage || existingMessage.user_id !== session.user.id) {
      return { success: false, error: 'Not authorized to edit this message' }
    }

    const { data: message, error } = await supabase
      .from('messages')
      .update({
        content: content.trim(),
        edited_at: new Date().toISOString()
      })
      .eq('id', messageId)
      .select(`
        *,
        user:profiles(id, username, display_name, avatar_url, discriminator)
      `)
      .single()

    if (error) {
      return { success: false, error: error.message }
    }

    return { success: true, message }
  } catch (error) {
    return { success: false, error: 'An unexpected error occurred' }
  }
}

export const deleteChannelMessage = async (messageId: string): Promise<{ success: boolean; error?: string }> => {
  try {
    const { data: { session } } = await supabase.auth.getSession()
    
    if (!session) {
      return { success: false, error: 'Not authenticated' }
    }

    // Check if user owns the message
    const { data: existingMessage } = await supabase
      .from('messages')
      .select('user_id')
      .eq('id', messageId)
      .single()

    if (!existingMessage || existingMessage.user_id !== session.user.id) {
      return { success: false, error: 'Not authorized to delete this message' }
    }

    const { error } = await supabase
      .from('messages')
      .delete()
      .eq('id', messageId)

    if (error) {
      return { success: false, error: error.message }
    }

    return { success: true }
  } catch (error) {
    return { success: false, error: 'An unexpected error occurred' }
  }
}

export const formatMessageTime = (timestamp: string): string => {
  const date = new Date(timestamp)
  const now = new Date()
  const diffInHours = (now.getTime() - date.getTime()) / (1000 * 60 * 60)

  if (diffInHours < 24) {
    // Today - show time
    return date.toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true
    })
  } else if (diffInHours < 168) { // 7 days
    // This week - show day
    return date.toLocaleDateString('en-US', { weekday: 'short' })
  } else {
    // Older - show date
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: date.getFullYear() !== now.getFullYear() ? 'numeric' : undefined
    })
  }
}

export const isMessageEdited = (message: Message): boolean => {
  return !!message.edited_at
}
