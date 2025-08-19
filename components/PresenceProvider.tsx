'use client'

import { useEffect } from 'react'
import { useAuth } from '@/contexts/AuthContext'
import { usePresence } from '@/hooks/usePresence'

interface PresenceProviderProps {
  children: React.ReactNode
}

export default function PresenceProvider({ children }: PresenceProviderProps) {
  const { isAuthenticated, user } = useAuth()
  
  // Initialize presence tracking for authenticated users
  const { setStatus, setActivity } = usePresence({
    onPresenceUpdate: (presence) => {
      console.log('Presence updated:', presence)
    },
    onUserOnline: (userId) => {
      console.log('User came online:', userId)
    },
    onUserOffline: (userId) => {
      console.log('User went offline:', userId)
    }
  })

  // Update presence when user authentication state changes
  useEffect(() => {
    if (isAuthenticated && user) {
      setStatus('online')
    }
  }, [isAuthenticated, user, setStatus])

  // Handle typing indicators
  useEffect(() => {
    let typingTimeout: NodeJS.Timeout

    const handleKeyPress = () => {
      setActivity({ typing: true })
      
      clearTimeout(typingTimeout)
      typingTimeout = setTimeout(() => {
        setActivity({ typing: false })
      }, 3000) // Stop typing indicator after 3 seconds
    }

    // Listen for typing across the app
    document.addEventListener('keypress', handleKeyPress)
    
    return () => {
      document.removeEventListener('keypress', handleKeyPress)
      clearTimeout(typingTimeout)
    }
  }, [setActivity])

  return <>{children}</>
}
