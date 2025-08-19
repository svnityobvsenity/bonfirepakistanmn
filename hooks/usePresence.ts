import { useEffect, useRef, useCallback } from 'react'
import { supabase } from '@/lib/supabaseClient'
import { useState } from 'react'

interface PresenceData {
  user_id: string
  last_active: string
  status: 'online' | 'away' | 'busy' | 'invisible' | 'offline'
  activity?: Record<string, any>
}

interface UsePresenceOptions {
  onPresenceUpdate?: (presence: PresenceData) => void
  onUserOnline?: (userId: string) => void
  onUserOffline?: (userId: string) => void
}

export function usePresence({
  onPresenceUpdate,
  onUserOnline,
  onUserOffline
}: UsePresenceOptions = {}) {
  const heartbeatRef = useRef<NodeJS.Timeout | null>(null)
  const subscriptionRef = useRef<any>(null)

  // Update user's own presence
  const updatePresence = useCallback(async (status: PresenceData['status'] = 'online', activity?: Record<string, any>) => {
    try {
      const { data: { session } } = await supabase.auth.getSession()
      if (!session) return

      await supabase
        .from('presence')
        .upsert({
          user_id: session.user.id,
          last_active: new Date().toISOString(),
          status,
          activity: activity || {}
        })
    } catch (error) {
      console.error('Failed to update presence:', error)
    }
  }, [])

  // Start heartbeat to keep user online
  const startHeartbeat = useCallback(() => {
    if (heartbeatRef.current) {
      clearInterval(heartbeatRef.current)
    }

    heartbeatRef.current = setInterval(() => {
      updatePresence('online')
    }, 30000) // Update every 30 seconds
  }, [updatePresence])

  // Stop heartbeat
  const stopHeartbeat = useCallback(() => {
    if (heartbeatRef.current) {
      clearInterval(heartbeatRef.current)
      heartbeatRef.current = null
    }
  }, [])

  // Set user status
  const setStatus = useCallback((status: PresenceData['status']) => {
    updatePresence(status)
  }, [updatePresence])

  // Set user activity
  const setActivity = useCallback((activity: Record<string, any>) => {
    updatePresence('online', activity)
  }, [updatePresence])

  useEffect(() => {
    // Initialize presence
    updatePresence('online')

    // Start heartbeat
    startHeartbeat()

    // Set up presence subscription
    subscriptionRef.current = supabase
      .channel('presence')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'presence'
        },
        (payload) => {
          const presence = payload.new as PresenceData
          
          if (payload.eventType === 'INSERT') {
            onUserOnline?.(presence.user_id)
          } else if (payload.eventType === 'UPDATE') {
            onPresenceUpdate?.(presence)
            
            // Check if user went offline (status changed to offline)
            const oldPresence = payload.old as PresenceData
            if (oldPresence?.status !== 'offline' && presence.status === 'offline') {
              onUserOffline?.(presence.user_id)
            } else if (oldPresence?.status === 'offline' && presence.status !== 'offline') {
              onUserOnline?.(presence.user_id)
            }
          } else if (payload.eventType === 'DELETE') {
            onUserOffline?.(presence.user_id)
          }
        }
      )
      .subscribe()

    // Handle page visibility changes
    const handleVisibilityChange = () => {
      if (document.hidden) {
        updatePresence('away')
        stopHeartbeat()
      } else {
        updatePresence('online')
        startHeartbeat()
      }
    }

    // Handle beforeunload
    const handleBeforeUnload = () => {
      updatePresence('offline')
    }

    document.addEventListener('visibilitychange', handleVisibilityChange)
    window.addEventListener('beforeunload', handleBeforeUnload)

    return () => {
      // Cleanup
      stopHeartbeat()
      updatePresence('offline')
      
      if (subscriptionRef.current) {
        supabase.removeChannel(subscriptionRef.current)
      }
      
      document.removeEventListener('visibilitychange', handleVisibilityChange)
      window.removeEventListener('beforeunload', handleBeforeUnload)
    }
  }, [updatePresence, startHeartbeat, stopHeartbeat, onPresenceUpdate, onUserOnline, onUserOffline])

  return {
    setStatus,
    setActivity,
    updatePresence
  }
}

// Hook to get all online users
export function useOnlineUsers() {
  const [onlineUsers, setOnlineUsers] = useState<PresenceData[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchOnlineUsers = async () => {
      try {
        setLoading(true)
        
        const { data, error } = await supabase
          .from('presence')
          .select('*')
          .neq('status', 'offline')
          .order('last_active', { ascending: false })

        if (error) throw error

        setOnlineUsers(data || [])
      } catch (error) {
        console.error('Failed to fetch online users:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchOnlineUsers()

    // Subscribe to presence changes
    const subscription = supabase
      .channel('online-users')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'presence'
        },
        () => {
          // Refetch online users when presence changes
          fetchOnlineUsers()
        }
      )
      .subscribe()

    return () => {
      supabase.removeChannel(subscription)
    }
  }, [])

  return { onlineUsers, loading }
}
