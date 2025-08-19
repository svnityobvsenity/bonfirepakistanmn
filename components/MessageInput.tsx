'use client'

import { useState, useRef, useEffect } from 'react'

interface MessageInputProps {
  onSendMessage: (content: string) => void
  placeholder?: string
  disabled?: boolean
  className?: string
}

export default function MessageInput({ 
  onSendMessage, 
  placeholder = "Message...", 
  disabled = false,
  className = ""
}: MessageInputProps) {
  const [message, setMessage] = useState('')
  const [isComposing, setIsComposing] = useState(false)
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  const handleSubmit = () => {
    const trimmedMessage = message.trim()
    if (trimmedMessage && !disabled) {
      onSendMessage(trimmedMessage)
      setMessage('')
      
      // Reset textarea height
      if (textareaRef.current) {
        textareaRef.current.style.height = 'auto'
      }
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey && !isComposing) {
      e.preventDefault()
      handleSubmit()
    }
  }

  const handleInput = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setMessage(e.target.value)
    
    // Auto-resize textarea
    const textarea = e.target
    textarea.style.height = 'auto'
    textarea.style.height = `${Math.min(textarea.scrollHeight, 120)}px`
  }

  const handleCompositionStart = () => {
    setIsComposing(true)
  }

  const handleCompositionEnd = () => {
    setIsComposing(false)
  }

  // Focus textarea when component mounts
  useEffect(() => {
    if (textareaRef.current && !disabled) {
      textareaRef.current.focus()
    }
  }, [disabled])

  return (
    <div className={`message-input-container ${className}`}>
      <div className="message-input-wrapper">
        <textarea
          ref={textareaRef}
          value={message}
          onChange={handleInput}
          onKeyDown={handleKeyDown}
          onCompositionStart={handleCompositionStart}
          onCompositionEnd={handleCompositionEnd}
          placeholder={placeholder}
          disabled={disabled}
          className="message-textarea"
          rows={1}
          maxLength={2000}
        />
        
        <div className="message-input-actions">
          <div className="message-input-info">
            <span className="character-count">
              {message.length}/2000
            </span>
          </div>
          
          <button
            onClick={handleSubmit}
            disabled={!message.trim() || disabled}
            className="send-button"
            title="Send message (Enter)"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
            </svg>
          </button>
        </div>
      </div>

      <style jsx>{`
        .message-input-container {
          padding: 16px;
          border-top: 1px solid rgba(255, 255, 255, 0.1);
          background: rgba(0, 0, 0, 0.2);
        }

        .message-input-wrapper {
          display: flex;
          align-items: flex-end;
          gap: 12px;
          background: rgba(0, 0, 0, 0.3);
          border: 1px solid rgba(255, 255, 255, 0.1);
          border-radius: 8px;
          padding: 12px;
          transition: border-color 0.2s ease;
        }

        .message-input-wrapper:focus-within {
          border-color: #667eea;
        }

        .message-textarea {
          flex: 1;
          background: transparent;
          border: none;
          color: white;
          font-size: 14px;
          line-height: 1.4;
          resize: none;
          outline: none;
          font-family: inherit;
          min-height: 20px;
          max-height: 120px;
        }

        .message-textarea::placeholder {
          color: #666;
        }

        .message-textarea:disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }

        .message-input-actions {
          display: flex;
          align-items: center;
          gap: 8px;
          flex-shrink: 0;
        }

        .message-input-info {
          display: flex;
          align-items: center;
        }

        .character-count {
          color: #666;
          font-size: 12px;
          min-width: 50px;
          text-align: right;
        }

        .send-button {
          width: 32px;
          height: 32px;
          border-radius: 6px;
          border: none;
          background: #667eea;
          color: white;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: all 0.2s ease;
          flex-shrink: 0;
        }

        .send-button:hover:not(:disabled) {
          background: #5a67d8;
          transform: scale(1.05);
        }

        .send-button:disabled {
          opacity: 0.5;
          cursor: not-allowed;
          background: #4a5568;
        }

        .send-button:active:not(:disabled) {
          transform: scale(0.95);
        }
      `}</style>
    </div>
  )
}
