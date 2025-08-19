'use client'

import React, { useState, useEffect } from 'react'
import { useAuth } from '@/contexts/AuthContext'
import { fetchChannelMessages, sendChannelMessage, editChannelMessage, deleteChannelMessage, formatMessageTime, isMessageEdited } from '@/lib/messages'
import type { Message } from '@/lib/messages'

interface MessageListProps {
  channelId: string
}

export default function MessageList({ channelId }: MessageListProps) {
  const { user } = useAuth()
  const [messages, setMessages] = useState<Message[]>([])
  const [newMessage, setNewMessage] = useState('')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [editingMessage, setEditingMessage] = useState<string | null>(null)
  const [editContent, setEditContent] = useState('')

  useEffect(() => {
    loadMessages()
  }, [channelId])

  const loadMessages = async () => {
    try {
      setLoading(true)
      const result = await fetchChannelMessages(channelId)
      if (result.success) {
        setMessages(result.messages)
      } else {
        setError(result.error || 'Failed to load messages')
      }
    } catch (err) {
      setError('An unexpected error occurred')
    } finally {
      setLoading(false)
    }
  }

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!newMessage.trim()) return

    try {
      const result = await sendChannelMessage(channelId, { content: newMessage })
      if (result.success && result.message) {
        setMessages(prev => [...prev, result.message!])
        setNewMessage('')
      } else {
        setError(result.error || 'Failed to send message')
      }
    } catch (err) {
      setError('An unexpected error occurred')
    }
  }

  const handleEditMessage = async (messageId: string) => {
    if (!editContent.trim()) return

    try {
      const result = await editChannelMessage(messageId, editContent)
      if (result.success && result.message) {
        setMessages(prev => prev.map(msg => 
          msg.id === messageId ? result.message! : msg
        ))
        setEditingMessage(null)
        setEditContent('')
      } else {
        setError(result.error || 'Failed to edit message')
      }
    } catch (err) {
      setError('An unexpected error occurred')
    }
  }

  const handleDeleteMessage = async (messageId: string) => {
    if (!confirm('Are you sure you want to delete this message?')) return

    try {
      const result = await deleteChannelMessage(messageId)
      if (result.success) {
        setMessages(prev => prev.filter(msg => msg.id !== messageId))
      } else {
        setError(result.error || 'Failed to delete message')
      }
    } catch (err) {
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
        {messages.map((message) => (
          <div key={message.id} className="flex items-start space-x-3">
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
                  {user?.id === message.user_id && (
                    <div className="mt-2 space-x-2">
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
                    </div>
                  )}
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
