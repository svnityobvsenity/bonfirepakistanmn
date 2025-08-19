'use client'

import React, { useState, useEffect } from 'react'
import { useAuth } from '@/contexts/AuthContext'
import { fetchChannelMessages, sendChannelMessage, editChannelMessage, deleteChannelMessage, formatMessageTime, isMessageEdited } from '@/lib/messages'
import type { Message } from '@/lib/messages'

interface OptimisticMessage extends Message {
  isOptimistic?: boolean
  isError?: boolean
}

interface MessageListProps {
  channelId: string
}

export default function MessageList({ channelId }: MessageListProps) {
  const { user } = useAuth()
  const [messages, setMessages] = useState<OptimisticMessage[]>([])
  const [newMessage, setNewMessage] = useState('')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [editingMessage, setEditingMessage] = useState<string | null>(null)
  const [editContent, setEditContent] = useState('')
  const [hasMore, setHasMore] = useState(false)
  const [loadingMore, setLoadingMore] = useState(false)

  useEffect(() => {
    loadMessages()
  }, [channelId])

  const loadMessages = async (cursor?: string) => {
    try {
      if (!cursor) {
        setLoading(true)
      } else {
        setLoadingMore(true)
      }
      
      const result = await fetchChannelMessages(channelId, cursor)
      if (result.success) {
        if (cursor) {
          // Load more - prepend to existing messages
          setMessages(prev => [...result.messages, ...prev])
        } else {
          // Initial load - replace messages
          setMessages(result.messages)
        }
        setHasMore(result.hasMore)
      } else {
        setError(result.error || 'Failed to load messages')
      }
    } catch (err) {
      setError('An unexpected error occurred')
    } finally {
      setLoading(false)
      setLoadingMore(false)
    }
  }

  const loadMoreMessages = () => {
    if (hasMore && !loadingMore && messages.length > 0) {
      const cursor = messages[0]?.created_at
      loadMessages(cursor)
    }
  }

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!newMessage.trim() || !user) return

    const content = newMessage.trim()
    const tempId = `temp-${Date.now()}`
    
    // Optimistic UI - add message immediately
    const optimisticMessage: OptimisticMessage = {
      id: tempId,
      channel_id: channelId,
      user_id: user.id,
      content,
      created_at: new Date().toISOString(),
      user: {
        id: user.id,
        username: user.username,
        display_name: user.display_name,
        avatar_url: user.avatar_url,
        discriminator: user.discriminator
      },
      isOptimistic: true
    }

    setMessages(prev => [...prev, optimisticMessage])
    setNewMessage('')

    try {
      const result = await sendChannelMessage(channelId, { content })
      if (result.success && result.message) {
        // Replace optimistic message with real message
        setMessages(prev => prev.map(msg => 
          msg.id === tempId ? result.message! : msg
        ))
      } else {
        // Mark as error but keep the message
        setMessages(prev => prev.map(msg => 
          msg.id === tempId ? { ...msg, isError: true, isOptimistic: false } : msg
        ))
        setError(result.error || 'Failed to send message')
      }
    } catch (err) {
      // Mark as error but keep the message
      setMessages(prev => prev.map(msg => 
        msg.id === tempId ? { ...msg, isError: true, isOptimistic: false } : msg
      ))
      setError('An unexpected error occurred')
    }
  }

  const handleEditMessage = async (messageId: string) => {
    if (!editContent.trim()) return

    const originalMessage = messages.find(msg => msg.id === messageId)
    if (!originalMessage) return

    // Optimistic UI - update message immediately
    setMessages(prev => prev.map(msg => 
      msg.id === messageId 
        ? { ...msg, content: editContent.trim(), edited_at: new Date().toISOString(), isOptimistic: true }
        : msg
    ))
    setEditingMessage(null)
    const tempContent = editContent
    setEditContent('')

    try {
      const result = await editChannelMessage(messageId, tempContent)
      if (result.success && result.message) {
        // Replace optimistic edit with real message
        setMessages(prev => prev.map(msg => 
          msg.id === messageId ? { ...result.message!, isOptimistic: false } : msg
        ))
      } else {
        // Rollback to original message
        setMessages(prev => prev.map(msg => 
          msg.id === messageId ? { ...originalMessage, isError: true } : msg
        ))
        setError(result.error || 'Failed to edit message')
      }
    } catch (err) {
      // Rollback to original message
      setMessages(prev => prev.map(msg => 
        msg.id === messageId ? { ...originalMessage, isError: true } : msg
      ))
      setError('An unexpected error occurred')
    }
  }

  const handleDeleteMessage = async (messageId: string) => {
    if (!confirm('Are you sure you want to delete this message?')) return

    const originalMessage = messages.find(msg => msg.id === messageId)
    if (!originalMessage) return

    // Optimistic UI - remove message immediately
    setMessages(prev => prev.filter(msg => msg.id !== messageId))

    try {
      const result = await deleteChannelMessage(messageId)
      if (!result.success) {
        // Rollback - restore the message
        setMessages(prev => {
          const index = prev.findIndex(msg => 
            new Date(msg.created_at) > new Date(originalMessage.created_at)
          )
          if (index === -1) {
            return [...prev, { ...originalMessage, isError: true }]
          }
          return [
            ...prev.slice(0, index),
            { ...originalMessage, isError: true },
            ...prev.slice(index)
          ]
        })
        setError(result.error || 'Failed to delete message')
      }
    } catch (err) {
      // Rollback - restore the message
      setMessages(prev => {
        const index = prev.findIndex(msg => 
          new Date(msg.created_at) > new Date(originalMessage.created_at)
        )
        if (index === -1) {
          return [...prev, { ...originalMessage, isError: true }]
        }
        return [
          ...prev.slice(0, index),
          { ...originalMessage, isError: true },
          ...prev.slice(index)
        ]
      })
      setError('An unexpected error occurred')
    }
  }

  const retryMessage = async (messageId: string) => {
    const message = messages.find(msg => msg.id === messageId)
    if (!message || !message.isError) return

    // Remove error state and try again
    setMessages(prev => prev.map(msg => 
      msg.id === messageId ? { ...msg, isError: false, isOptimistic: true } : msg
    ))

    try {
      const result = await sendChannelMessage(channelId, { content: message.content })
      if (result.success && result.message) {
        // Replace with real message
        setMessages(prev => prev.map(msg => 
          msg.id === messageId ? result.message! : msg
        ))
      } else {
        // Mark as error again
        setMessages(prev => prev.map(msg => 
          msg.id === messageId ? { ...msg, isError: true, isOptimistic: false } : msg
        ))
        setError(result.error || 'Failed to send message')
      }
    } catch (err) {
      // Mark as error again
      setMessages(prev => prev.map(msg => 
        msg.id === messageId ? { ...msg, isError: true, isOptimistic: false } : msg
      ))
      setError('An unexpected error occurred')
    }
  }

  const startEditing = (message: Message) => {
    setEditingMessage(message.id)
    setEditContent(message.content)
  }

  if (loading) {
    return <div data-testid="message-list">Loading...</div>
  }

  if (error) {
    return <div data-testid="message-list">Error: {error}</div>
  }

  return (
    <div data-testid="message-list" className="flex flex-col h-full">
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {/* Load More Button */}
        {hasMore && (
          <div className="text-center">
            <button
              onClick={loadMoreMessages}
              disabled={loadingMore}
              className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50"
            >
              {loadingMore ? 'Loading...' : 'Load More Messages'}
            </button>
          </div>
        )}
        
        {messages.map((message) => (
          <div 
            key={message.id} 
            className={`flex items-start space-x-3 ${
              message.isOptimistic ? 'opacity-70' : ''
            } ${message.isError ? 'bg-red-50 border border-red-200 rounded p-2' : ''}`}
          >
            <div className="flex-shrink-0">
              {message.user.avatar_url ? (
                <img 
                  src={message.user.avatar_url} 
                  alt={`${message.user.display_name}'s avatar`}
                  className="w-8 h-8 rounded-full"
                />
              ) : (
                <div className="w-8 h-8 rounded-full bg-gray-300 flex items-center justify-center">
                  <span className="text-xs text-gray-600">
                    {message.user.display_name.charAt(0).toUpperCase()}
                  </span>
                </div>
              )}
            </div>
            <div className="flex-1">
              <div className="flex items-center space-x-2">
                <span className="font-medium">{message.user.display_name}</span>
                <span className="text-gray-500">#{message.user.discriminator}</span>
                <span className="text-gray-400 text-sm">
                  {formatMessageTime(message.created_at)}
                </span>
                {isMessageEdited(message) && (
                  <span className="text-gray-400 text-sm">(edited)</span>
                )}
                {message.isOptimistic && (
                  <span className="text-blue-400 text-sm">(sending...)</span>
                )}
                {message.isError && (
                  <span className="text-red-400 text-sm">(failed)</span>
                )}
              </div>
              {editingMessage === message.id ? (
                <div className="mt-2">
                  <input
                    type="text"
                    value={editContent}
                    onChange={(e) => setEditContent(e.target.value)}
                    className="w-full p-2 border rounded"
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        handleEditMessage(message.id)
                      } else if (e.key === 'Escape') {
                        setEditingMessage(null)
                        setEditContent('')
                      }
                    }}
                  />
                  <div className="mt-2 space-x-2">
                    <button
                      onClick={() => handleEditMessage(message.id)}
                      className="px-3 py-1 bg-blue-500 text-white rounded text-sm"
                    >
                      Update
                    </button>
                    <button
                      onClick={() => {
                        setEditingMessage(null)
                        setEditContent('')
                      }}
                      className="px-3 py-1 bg-gray-500 text-white rounded text-sm"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              ) : (
                <div className="mt-1">
                  <p className="text-gray-800">{message.content}</p>
                  <div className="mt-2 space-x-2">
                    {message.isError && user?.id === message.user_id && (
                      <button
                        onClick={() => retryMessage(message.id)}
                        className="text-orange-500 text-sm hover:underline"
                      >
                        Retry
                      </button>
                    )}
                    {user?.id === message.user_id && !message.isOptimistic && (
                      <>
                        <button
                          onClick={() => startEditing(message)}
                          data-testid="edit-message"
                          className="text-blue-500 text-sm hover:underline"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleDeleteMessage(message.id)}
                          data-testid="delete-message"
                          className="text-red-500 text-sm hover:underline"
                        >
                          Delete
                        </button>
                      </>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
      <form onSubmit={handleSendMessage} className="p-4 border-t">
        <div className="flex space-x-2">
          <input
            type="text"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            placeholder={`Message #${channelId}`}
            className="flex-1 p-2 border rounded"
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault()
                handleSendMessage(e)
              }
            }}
          />
          <button
            type="submit"
            disabled={!newMessage.trim()}
            className="px-4 py-2 bg-blue-500 text-white rounded disabled:opacity-50"
          >
            Send
          </button>
        </div>
      </form>
    </div>
  )
}
