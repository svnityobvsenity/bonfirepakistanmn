'use client'

import { useState } from 'react'
import { formatMessageTime, isMessageEdited } from '@/lib/messages'
import type { Message } from '@/lib/messages'

interface MessageItemProps {
  message: Message
  isOwnMessage: boolean
  onEdit?: (messageId: string, newContent: string) => void
  onDelete?: (messageId: string) => void
  showAvatar?: boolean
}

export default function MessageItem({ 
  message, 
  isOwnMessage, 
  onEdit, 
  onDelete, 
  showAvatar = true 
}: MessageItemProps) {
  const [isEditing, setIsEditing] = useState(false)
  const [editContent, setEditContent] = useState(message.content)
  const [showActions, setShowActions] = useState(false)

  const handleEdit = () => {
    if (onEdit) {
      onEdit(message.id, editContent)
      setIsEditing(false)
    }
  }

  const handleDelete = () => {
    if (onDelete && confirm('Are you sure you want to delete this message?')) {
      onDelete(message.id)
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleEdit()
    } else if (e.key === 'Escape') {
      setIsEditing(false)
      setEditContent(message.content)
    }
  }

  const displayName = message.user.display_name || message.user.username
  const username = `${message.user.username}#${message.user.discriminator}`

  return (
    <div 
      className={`message-item ${isOwnMessage ? 'own-message' : ''}`}
      onMouseEnter={() => setShowActions(true)}
      onMouseLeave={() => setShowActions(false)}
    >
      {showAvatar && (
        <div className="message-avatar">
          {message.user.avatar_url ? (
            <img
              src={message.user.avatar_url}
              alt={displayName}
              className="avatar-image"
            />
          ) : (
            <div className="avatar-fallback">
              {displayName.charAt(0).toUpperCase()}
            </div>
          )}
        </div>
      )}

      <div className="message-content">
        <div className="message-header">
          <span className="message-author">{displayName}</span>
          <span className="message-username">{username}</span>
          <span className="message-time">{formatMessageTime(message.created_at)}</span>
          {isMessageEdited(message) && (
            <span className="message-edited">(edited)</span>
          )}
        </div>

        <div className="message-text">
          {isEditing ? (
            <div className="edit-container">
              <textarea
                value={editContent}
                onChange={(e) => setEditContent(e.target.value)}
                onKeyDown={handleKeyDown}
                className="edit-textarea"
                autoFocus
                rows={Math.max(1, editContent.split('\n').length)}
              />
              <div className="edit-actions">
                <button
                  onClick={handleEdit}
                  className="edit-save-btn"
                  disabled={editContent.trim() === ''}
                >
                  Save
                </button>
                <button
                  onClick={() => {
                    setIsEditing(false)
                    setEditContent(message.content)
                  }}
                  className="edit-cancel-btn"
                >
                  Cancel
                </button>
              </div>
            </div>
          ) : (
            <div className="message-text-content">
              {message.content.split('\n').map((line, index) => (
                <div key={index}>
                  {line}
                  {index < message.content.split('\n').length - 1 && <br />}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {isOwnMessage && showActions && !isEditing && (
        <div className="message-actions">
          <button
            onClick={() => setIsEditing(true)}
            className="action-btn edit-btn"
            title="Edit message"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
            </svg>
          </button>
          <button
            onClick={handleDelete}
            className="action-btn delete-btn"
            title="Delete message"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
            </svg>
          </button>
        </div>
      )}

      <style jsx>{`
        .message-item {
          display: flex;
          gap: 12px;
          padding: 8px 16px;
          transition: background-color 0.2s ease;
          position: relative;
        }

        .message-item:hover {
          background-color: rgba(255, 255, 255, 0.02);
        }

        .message-avatar {
          flex-shrink: 0;
          width: 40px;
          height: 40px;
        }

        .avatar-image {
          width: 100%;
          height: 100%;
          border-radius: 50%;
          object-fit: cover;
        }

        .avatar-fallback {
          width: 100%;
          height: 100%;
          border-radius: 50%;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          display: flex;
          align-items: center;
          justify-content: center;
          color: white;
          font-weight: bold;
          font-size: 16px;
        }

        .message-content {
          flex: 1;
          min-width: 0;
        }

        .message-header {
          display: flex;
          align-items: center;
          gap: 8px;
          margin-bottom: 4px;
        }

        .message-author {
          font-weight: 600;
          color: white;
          font-size: 14px;
        }

        .message-username {
          color: #a0a0a0;
          font-size: 12px;
        }

        .message-time {
          color: #666;
          font-size: 12px;
        }

        .message-edited {
          color: #666;
          font-size: 12px;
          font-style: italic;
        }

        .message-text {
          color: #e0e0e0;
          font-size: 14px;
          line-height: 1.4;
        }

        .message-text-content {
          word-wrap: break-word;
          white-space: pre-wrap;
        }

        .edit-container {
          display: flex;
          flex-direction: column;
          gap: 8px;
        }

        .edit-textarea {
          background: rgba(0, 0, 0, 0.3);
          border: 1px solid rgba(255, 255, 255, 0.1);
          border-radius: 4px;
          color: white;
          font-size: 14px;
          line-height: 1.4;
          padding: 8px;
          resize: vertical;
          min-height: 60px;
          font-family: inherit;
        }

        .edit-textarea:focus {
          outline: none;
          border-color: #667eea;
        }

        .edit-actions {
          display: flex;
          gap: 8px;
        }

        .edit-save-btn,
        .edit-cancel-btn {
          padding: 4px 12px;
          border-radius: 4px;
          font-size: 12px;
          font-weight: 500;
          cursor: pointer;
          transition: all 0.2s ease;
        }

        .edit-save-btn {
          background: #667eea;
          color: white;
          border: none;
        }

        .edit-save-btn:hover:not(:disabled) {
          background: #5a67d8;
        }

        .edit-save-btn:disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }

        .edit-cancel-btn {
          background: transparent;
          color: #a0a0a0;
          border: 1px solid rgba(255, 255, 255, 0.2);
        }

        .edit-cancel-btn:hover {
          background: rgba(255, 255, 255, 0.1);
        }

        .message-actions {
          position: absolute;
          right: 16px;
          top: 50%;
          transform: translateY(-50%);
          display: flex;
          gap: 4px;
          background: rgba(0, 0, 0, 0.8);
          border-radius: 6px;
          padding: 4px;
          opacity: 0;
          transition: opacity 0.2s ease;
        }

        .message-item:hover .message-actions {
          opacity: 1;
        }

        .action-btn {
          width: 28px;
          height: 28px;
          border-radius: 4px;
          border: none;
          background: transparent;
          color: #a0a0a0;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: all 0.2s ease;
        }

        .action-btn:hover {
          background: rgba(255, 255, 255, 0.1);
          color: white;
        }

        .edit-btn:hover {
          color: #667eea;
        }

        .delete-btn:hover {
          color: #e53e3e;
        }

        .own-message {
          background-color: rgba(102, 126, 234, 0.05);
        }

        .own-message:hover {
          background-color: rgba(102, 126, 234, 0.08);
        }
      `}</style>
    </div>
  )
}
