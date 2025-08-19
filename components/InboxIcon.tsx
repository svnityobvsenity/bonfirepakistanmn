'use client'

import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabaseClient'

interface FriendRequest {
  id: string
  fromUser: {
    id: string
    username: string
    displayName?: string
    avatarUrl?: string
    discriminator: string
  }
  status: string
  createdAt: string
}

interface InboxIconProps {
  onRequestAction?: (requestId: string, action: 'accept' | 'reject') => void
}

export default function InboxIcon({ onRequestAction }: InboxIconProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [pendingRequests, setPendingRequests] = useState<FriendRequest[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const fetchPendingRequests = async () => {
    try {
      setLoading(true)
      setError('')

      const { data: { session } } = await supabase.auth.getSession()
      if (!session) return

      const response = await fetch('/api/friend-request', {
        headers: {
          'Authorization': `Bearer ${session.access_token}`
        }
      })

      if (!response.ok) {
        throw new Error('Failed to fetch friend requests')
      }

      const result = await response.json()
      setPendingRequests(result.pendingRequests || [])
    } catch (error: any) {
      setError(error.message || 'Failed to load friend requests')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (isOpen) {
      fetchPendingRequests()
    }
  }, [isOpen])

  const handleAction = async (requestId: string, action: 'accept' | 'reject') => {
    try {
      const { data: { session } } = await supabase.auth.getSession()
      if (!session) return

      const response = await fetch(`/api/friend-request/${requestId}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${session.access_token}`
        },
        body: JSON.stringify({ action })
      })

      if (!response.ok) {
        throw new Error(`Failed to ${action} friend request`)
      }

      // Remove the request from the list
      setPendingRequests(prev => prev.filter(req => req.id !== requestId))
      
      // Call the parent callback if provided
      if (onRequestAction) {
        onRequestAction(requestId, action)
      }
    } catch (error: any) {
      setError(error.message || `Failed to ${action} friend request`)
    }
  }

  const pendingCount = pendingRequests.length

  return (
    <div className="relative">
      {/* Inbox Icon */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="relative p-2 text-gray-400 hover:text-white transition-colors"
        title="Friend Requests"
      >
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
        </svg>
        
        {/* Notification Badge */}
        {pendingCount > 0 && (
          <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center font-medium">
            {pendingCount > 9 ? '9+' : pendingCount}
          </span>
        )}
      </button>

      {/* Dropdown */}
      {isOpen && (
        <div className="absolute top-full left-0 mt-2 w-80 bg-gray-800 border border-gray-700 rounded-lg shadow-xl z-50">
          <div className="p-4 border-b border-gray-700">
            <h3 className="text-white font-medium">Friend Requests</h3>
            <p className="text-gray-400 text-sm">
              {pendingCount === 0 ? 'No pending requests' : `${pendingCount} pending request${pendingCount !== 1 ? 's' : ''}`}
            </p>
          </div>

          {error && (
            <div className="p-4 bg-red-500/20 border-b border-red-500/30">
              <p className="text-red-300 text-sm">{error}</p>
            </div>
          )}

          <div className="max-h-64 overflow-y-auto">
            {loading ? (
              <div className="p-4 text-center">
                <div className="text-gray-400 text-sm">Loading...</div>
              </div>
            ) : pendingRequests.length === 0 ? (
              <div className="p-4 text-center">
                <div className="text-gray-400 text-sm">No pending friend requests</div>
              </div>
            ) : (
              pendingRequests.map((request) => (
                <div key={request.id} className="p-4 border-b border-gray-700 last:border-b-0">
                  <div className="flex items-center space-x-3">
                    {/* Avatar */}
                    <div className="flex-shrink-0">
                      {request.fromUser.avatarUrl ? (
                        <img
                          src={request.fromUser.avatarUrl}
                          alt={request.fromUser.username}
                          className="w-10 h-10 rounded-full"
                        />
                      ) : (
                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-500 to-violet-500 flex items-center justify-center text-white font-medium">
                          {request.fromUser.username.charAt(0).toUpperCase()}
                        </div>
                      )}
                    </div>

                    {/* User Info */}
                    <div className="flex-1 min-w-0">
                      <div className="text-white font-medium truncate">
                        {request.fromUser.displayName || request.fromUser.username}
                      </div>
                      <div className="text-gray-400 text-sm">
                        {request.fromUser.username}#{request.fromUser.discriminator}
                      </div>
                      <div className="text-gray-500 text-xs">
                        {new Date(request.createdAt).toLocaleDateString()}
                      </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex-shrink-0 flex space-x-2">
                      <button
                        onClick={() => handleAction(request.id, 'accept')}
                        className="px-3 py-1 bg-green-600 hover:bg-green-700 text-white text-sm rounded transition-colors"
                      >
                        Accept
                      </button>
                      <button
                        onClick={() => handleAction(request.id, 'reject')}
                        className="px-3 py-1 bg-red-600 hover:bg-red-700 text-white text-sm rounded transition-colors"
                      >
                        Reject
                      </button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}

      {/* Backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 z-40"
          onClick={() => setIsOpen(false)}
        />
      )}
    </div>
  )
}
