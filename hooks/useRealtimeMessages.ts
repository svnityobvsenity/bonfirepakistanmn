import { useEffect, useRef, useCallback } from 'react'
import { supabase } from '@/lib/supabaseClient'
import type { Message } from '@/lib/messages'

interface UseRealtimeMessagesOptions {
  channelId?: string
  dmId?: string
  onNewMessage?: (message: Message) => void
  onMessageUpdate?: (message: Message) => void
  onMessageDelete?: (messageId: string) => void
}

export function useRealtimeMessages({
  channelId,
  dmId,
  onNewMessage,
  onMessageUpdate,
  onMessageDelete
}: UseRealtimeMessagesOptions) {
  const subscriptionRef = useRef<any>(null)
  const broadcastChannelRef = useRef<BroadcastChannel | null>(null)

  const handleNewMessage = useCallback((payload: any) => {
    const message = payload.new as Message
    
    // Only handle messages for the current channel/DM
    if (channelId && 'channel_id' in message && message.channel_id === channelId) {
      onNewMessage?.(message)
      // Broadcast to other tabs
      broadcastChannelRef.current?.postMessage({
        type: 'NEW_MESSAGE',
        message,
        channelId
      })
    } else if (dmId && 'dm_id' in message && message.dm_id === dmId) {
      onNewMessage?.(message)
      // Broadcast to other tabs
      broadcastChannelRef.current?.postMessage({
        type: 'NEW_DM_MESSAGE',
        message,
        dmId
      })
    }
  }, [channelId, dmId, onNewMessage])

  const handleMessageUpdate = useCallback((payload: any) => {
    const message = payload.new as Message
    
    if (channelId && 'channel_id' in message && message.channel_id === channelId) {
      onMessageUpdate?.(message)
      broadcastChannelRef.current?.postMessage({
        type: 'MESSAGE_UPDATE',
        message,
        channelId
      })
    } else if (dmId && 'dm_id' in message && message.dm_id === dmId) {
      onMessageUpdate?.(message)
      broadcastChannelRef.current?.postMessage({
        type: 'DM_MESSAGE_UPDATE',
        message,
        dmId
      })
    }
  }, [channelId, dmId, onMessageUpdate])

  const handleMessageDelete = useCallback((payload: any) => {
    const messageId = payload.old?.id
    
    if (messageId) {
      onMessageDelete?.(messageId)
      broadcastChannelRef.current?.postMessage({
        type: 'MESSAGE_DELETE',
        messageId,
        channelId,
        dmId
      })
    }
  }, [channelId, dmId, onMessageDelete])

  // Handle messages from other tabs
  const handleBroadcastMessage = useCallback((event: MessageEvent) => {
    const { type, message, messageId, channelId: msgChannelId, dmId: msgDmId } = event.data

    // Only handle messages for the current channel/DM
    if (channelId && msgChannelId !== channelId) return
    if (dmId && msgDmId !== dmId) return

    switch (type) {
      case 'NEW_MESSAGE':
      case 'NEW_DM_MESSAGE':
        onNewMessage?.(message)
        break
      case 'MESSAGE_UPDATE':
      case 'DM_MESSAGE_UPDATE':
        onMessageUpdate?.(message)
        break
      case 'MESSAGE_DELETE':
        onMessageDelete?.(messageId)
        break
    }
  }, [channelId, dmId, onNewMessage, onMessageUpdate, onMessageDelete])

  useEffect(() => {
    // Set up BroadcastChannel for cross-tab communication
    if (typeof window !== 'undefined' && 'BroadcastChannel' in window) {
      const channelName = channelId ? `messages-${channelId}` : `dm-messages-${dmId}`
      broadcastChannelRef.current = new BroadcastChannel(channelName)
      broadcastChannelRef.current.onmessage = handleBroadcastMessage
    }

    // Set up Supabase realtime subscription
    if (channelId) {
      // Subscribe to channel messages
      subscriptionRef.current = supabase
        .channel(`messages:${channelId}`)
        .on(
          'postgres_changes',
          {
            event: 'INSERT',
            schema: 'public',
            table: 'messages',
            filter: `channel_id=eq.${channelId}`
          },
          handleNewMessage
        )
        .on(
          'postgres_changes',
          {
            event: 'UPDATE',
            schema: 'public',
            table: 'messages',
            filter: `channel_id=eq.${channelId}`
          },
          handleMessageUpdate
        )
        .on(
          'postgres_changes',
          {
            event: 'DELETE',
            schema: 'public',
            table: 'messages',
            filter: `channel_id=eq.${channelId}`
          },
          handleMessageDelete
        )
        .subscribe()
    } else if (dmId) {
      // Subscribe to DM messages
      subscriptionRef.current = supabase
        .channel(`dm-messages:${dmId}`)
        .on(
          'postgres_changes',
          {
            event: 'INSERT',
            schema: 'public',
            table: 'dm_messages',
            filter: `dm_id=eq.${dmId}`
          },
          handleNewMessage
        )
        .on(
          'postgres_changes',
          {
            event: 'UPDATE',
            schema: 'public',
            table: 'dm_messages',
            filter: `dm_id=eq.${dmId}`
          },
          handleMessageUpdate
        )
        .on(
          'postgres_changes',
          {
            event: 'DELETE',
            schema: 'public',
            table: 'dm_messages',
            filter: `dm_id=eq.${dmId}`
          },
          handleMessageDelete
        )
        .subscribe()
    }

    return () => {
      // Cleanup subscriptions
      if (subscriptionRef.current) {
        supabase.removeChannel(subscriptionRef.current)
      }
      if (broadcastChannelRef.current) {
        broadcastChannelRef.current.close()
      }
    }
  }, [channelId, dmId, handleNewMessage, handleMessageUpdate, handleMessageDelete, handleBroadcastMessage])

  return {
    isConnected: !!subscriptionRef.current
  }
}
