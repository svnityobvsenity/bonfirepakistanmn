'use client'

import { useState } from 'react'
import { supabase } from '@/lib/supabaseClient'

interface FriendRequestButtonProps {
  targetUserId: string
  targetUsername: string
  className?: string
  onSuccess?: () => void
  onError?: (error: string) => void
}

export default function FriendRequestButton({ 
  targetUserId, 
  targetUsername, 
  className = '',
  onSuccess,
  onError 
}: FriendRequestButtonProps) {
  const [loading, setLoading] = useState(false)
  const [sent, setSent] = useState(false)

  const sendFriendRequest = async () => {
    try {
      setLoading(true)

      const { data: { session } } = await supabase.auth.getSession()
      if (!session) {
        throw new Error('Not authenticated')
      }

      const response = await fetch('/api/friend-request', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${session.access_token}`
        },
        body: JSON.stringify({ toUserId: targetUserId })
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.error || 'Failed to send friend request')
      }

      setSent(true)
      if (onSuccess) {
        onSuccess()
      }
    } catch (error: any) {
      if (onError) {
        onError(error.message || 'Failed to send friend request')
      }
    } finally {
      setLoading(false)
    }
  }

  if (sent) {
    return (
      <button
        disabled
        className={`px-3 py-1 bg-gray-600 text-gray-300 text-sm rounded cursor-not-allowed ${className}`}
      >
        Request Sent
      </button>
    )
  }

  return (
    <button
      onClick={sendFriendRequest}
      disabled={loading}
      className={`px-3 py-1 bg-blue-600 hover:bg-blue-700 text-white text-sm rounded transition-colors disabled:opacity-50 disabled:cursor-not-allowed ${className}`}
      title={`Send friend request to ${targetUsername}`}
    >
      {loading ? 'Sending...' : 'Add Friend'}
    </button>
  )
}
