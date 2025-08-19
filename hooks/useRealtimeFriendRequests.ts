import { useEffect, useRef, useCallback } from 'react'
import { supabase } from '@/lib/supabaseClient'

interface FriendRequest {
  id: string
  from_user: string
  to_user: string
  status: 'pending' | 'accepted' | 'rejected'
  created_at: string
  from_user_details?: {
    id: string
    username: string
    display_name?: string
    avatar_url?: string
    discriminator: string
  }
}

interface UseRealtimeFriendRequestsOptions {
  onNewRequest?: (request: FriendRequest) => void
  onRequestUpdate?: (request: FriendRequest) => void
  onRequestDelete?: (requestId: string) => void
}

export function useRealtimeFriendRequests({
  onNewRequest,
  onRequestUpdate,
  onRequestDelete
}: UseRealtimeFriendRequestsOptions = {}) {
  const subscriptionRef = useRef<any>(null)
  const broadcastChannelRef = useRef<BroadcastChannel | null>(null)

  const handleNewRequest = useCallback((payload: any) => {
    const request = payload.new as FriendRequest
    
    onNewRequest?.(request)
    
    // Broadcast to other tabs
    broadcastChannelRef.current?.postMessage({
      type: 'NEW_FRIEND_REQUEST',
      request
    })
  }, [onNewRequest])

  const handleRequestUpdate = useCallback((payload: any) => {
    const request = payload.new as FriendRequest
    
    onRequestUpdate?.(request)
    
    // Broadcast to other tabs
    broadcastChannelRef.current?.postMessage({
      type: 'FRIEND_REQUEST_UPDATE',
      request
    })
  }, [onRequestUpdate])

  const handleRequestDelete = useCallback((payload: any) => {
    const requestId = payload.old?.id
    
    if (requestId) {
      onRequestDelete?.(requestId)
      
      // Broadcast to other tabs
      broadcastChannelRef.current?.postMessage({
        type: 'FRIEND_REQUEST_DELETE',
        requestId
      })
    }
  }, [onRequestDelete])

  // Handle messages from other tabs
  const handleBroadcastMessage = useCallback((event: MessageEvent) => {
    const { type, request, requestId } = event.data

    switch (type) {
      case 'NEW_FRIEND_REQUEST':
        onNewRequest?.(request)
        break
      case 'FRIEND_REQUEST_UPDATE':
        onRequestUpdate?.(request)
        break
      case 'FRIEND_REQUEST_DELETE':
        onRequestDelete?.(requestId)
        break
    }
  }, [onNewRequest, onRequestUpdate, onRequestDelete])

  useEffect(() => {
    // Set up BroadcastChannel for cross-tab communication
    if (typeof window !== 'undefined' && 'BroadcastChannel' in window) {
      broadcastChannelRef.current = new BroadcastChannel('friend-requests')
      broadcastChannelRef.current.onmessage = handleBroadcastMessage
    }

    // Get current user ID
    const getCurrentUserId = async () => {
      const { data: { session } } = await supabase.auth.getSession()
      return session?.user?.id
    }

    // Set up Supabase realtime subscription
    const setupSubscription = async () => {
      const userId = await getCurrentUserId()
      if (!userId) return

      subscriptionRef.current = supabase
        .channel('friend-requests')
        .on(
          'postgres_changes',
          {
            event: 'INSERT',
            schema: 'public',
            table: 'friend_requests',
            filter: `to_user=eq.${userId}`
          },
          handleNewRequest
        )
        .on(
          'postgres_changes',
          {
            event: 'UPDATE',
            schema: 'public',
            table: 'friend_requests',
            filter: `to_user=eq.${userId}`
          },
          handleRequestUpdate
        )
        .on(
          'postgres_changes',
          {
            event: 'DELETE',
            schema: 'public',
            table: 'friend_requests',
            filter: `to_user=eq.${userId}`
          },
          handleRequestDelete
        )
        .subscribe()
    }

    setupSubscription()

    return () => {
      // Cleanup subscriptions
      if (subscriptionRef.current) {
        supabase.removeChannel(subscriptionRef.current)
      }
      if (broadcastChannelRef.current) {
        broadcastChannelRef.current.close()
      }
    }
  }, [handleNewRequest, handleRequestUpdate, handleRequestDelete, handleBroadcastMessage])

  return {
    isConnected: !!subscriptionRef.current
  }
}
