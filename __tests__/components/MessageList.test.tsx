import React from 'react'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import '@testing-library/jest-dom'
import MessageList from '@/components/MessageList'

// Mock the messages library
jest.mock('@/lib/messages', () => ({
  fetchChannelMessages: jest.fn(),
  sendChannelMessage: jest.fn(),
  editChannelMessage: jest.fn(),
  deleteChannelMessage: jest.fn(),
  formatMessageTime: jest.fn(() => '12:00'),
  isMessageEdited: jest.fn(() => false)
}))

// Mock the auth context
jest.mock('@/contexts/AuthContext', () => ({
  useAuth: () => ({
    user: {
      id: 'user-1',
      username: 'testuser',
      display_name: 'Test User',
      avatar_url: null,
      discriminator: '0001'
    },
    isAuthenticated: true
  })
}))

const mockMessages = [
  {
    id: '1',
    channel_id: 'channel-1',
    user_id: 'user-1',
    content: 'Hello world!',
    created_at: '2024-01-01T12:00:00Z',
    edited_at: null,
    user: {
      id: 'user-1',
      username: 'testuser',
      display_name: 'Test User',
      avatar_url: null,
      discriminator: '0001'
    }
  },
  {
    id: '2',
    channel_id: 'channel-1',
    user_id: 'user-2',
    content: 'Hi there!',
    created_at: '2024-01-01T12:01:00Z',
    edited_at: null,
    user: {
      id: 'user-2',
      username: 'otheruser',
      display_name: 'Other User',
      avatar_url: null,
      discriminator: '0002'
    }
  }
]

describe('MessageList Component', () => {
  const mockFetchMessages = require('@/lib/messages').fetchChannelMessages
  const mockSendMessage = require('@/lib/messages').sendChannelMessage
  const mockEditMessage = require('@/lib/messages').editChannelMessage
  const mockDeleteMessage = require('@/lib/messages').deleteChannelMessage

  beforeEach(() => {
    jest.clearAllMocks()
    mockFetchMessages.mockResolvedValue({
      messages: mockMessages,
      hasMore: false
    })
    mockSendMessage.mockResolvedValue({
      success: true,
      message: {
        id: '3',
        content: 'New message',
        created_at: '2024-01-01T12:02:00Z'
      }
    })
  })

  it('should render messages correctly', async () => {
    render(<MessageList channelId="channel-1" />)
    
    await waitFor(() => {
      expect(screen.getByText('Hello world!')).toBeInTheDocument()
      expect(screen.getByText('Hi there!')).toBeInTheDocument()
    })
  })

  it('should display user information correctly', async () => {
    render(<MessageList channelId="channel-1" />)
    
    await waitFor(() => {
      expect(screen.getByText('Test User')).toBeInTheDocument()
      expect(screen.getByText('Other User')).toBeInTheDocument()
      expect(screen.getByText('#0001')).toBeInTheDocument()
      expect(screen.getByText('#0002')).toBeInTheDocument()
    })
  })

  it('should send a new message', async () => {
    render(<MessageList channelId="channel-1" />)
    
    await waitFor(() => {
      expect(screen.getByPlaceholderText('Message #general')).toBeInTheDocument()
    })

    const input = screen.getByPlaceholderText('Message #general')
    const sendButton = screen.getByRole('button', { name: /send/i })

    fireEvent.change(input, { target: { value: 'New message' } })
    fireEvent.click(sendButton)

    await waitFor(() => {
      expect(mockSendMessage).toHaveBeenCalledWith('channel-1', {
        content: 'New message'
      })
    })
  })

  it('should not send empty messages', async () => {
    render(<MessageList channelId="channel-1" />)
    
    await waitFor(() => {
      expect(screen.getByPlaceholderText('Message #general')).toBeInTheDocument()
    })

    const input = screen.getByPlaceholderText('Message #general')
    const sendButton = screen.getByRole('button', { name: /send/i })

    fireEvent.change(input, { target: { value: '   ' } })
    fireEvent.click(sendButton)

    expect(mockSendMessage).not.toHaveBeenCalled()
  })

  it('should handle message editing', async () => {
    mockEditMessage.mockResolvedValue({
      success: true,
      message: {
        id: '1',
        content: 'Updated message',
        edited_at: '2024-01-01T12:01:00Z'
      }
    })

    render(<MessageList channelId="channel-1" />)
    
    await waitFor(() => {
      expect(screen.getByText('Hello world!')).toBeInTheDocument()
    })

    // Find and click edit button for the first message
    const editButtons = screen.getAllByRole('button', { name: /edit/i })
    fireEvent.click(editButtons[0])

    // Find the edit input and update button
    const editInput = screen.getByDisplayValue('Hello world!')
    const updateButton = screen.getByRole('button', { name: /update/i })

    fireEvent.change(editInput, { target: { value: 'Updated message' } })
    fireEvent.click(updateButton)

    await waitFor(() => {
      expect(mockEditMessage).toHaveBeenCalledWith('1', 'Updated message')
    })
  })

  it('should handle message deletion', async () => {
    mockDeleteMessage.mockResolvedValue({
      success: true
    })

    render(<MessageList channelId="channel-1" />)
    
    await waitFor(() => {
      expect(screen.getByText('Hello world!')).toBeInTheDocument()
    })

    // Find and click delete button for the first message
    const deleteButtons = screen.getAllByRole('button', { name: /delete/i })
    fireEvent.click(deleteButtons[0])

    // Confirm deletion
    const confirmButton = screen.getByRole('button', { name: /confirm/i })
    fireEvent.click(confirmButton)

    await waitFor(() => {
      expect(mockDeleteMessage).toHaveBeenCalledWith('1')
    })
  })

  it('should show loading state', () => {
    mockFetchMessages.mockImplementation(() => new Promise(() => {})) // Never resolves
    
    render(<MessageList channelId="channel-1" />)
    
    expect(screen.getByText(/loading/i)).toBeInTheDocument()
  })

  it('should show error state', async () => {
    mockFetchMessages.mockResolvedValue({
      success: false,
      error: 'Failed to load messages'
    })

    render(<MessageList channelId="channel-1" />)
    
    await waitFor(() => {
      expect(screen.getByText(/failed to load messages/i)).toBeInTheDocument()
    })
  })

  it('should handle keyboard shortcuts', async () => {
    render(<MessageList channelId="channel-1" />)
    
    await waitFor(() => {
      expect(screen.getByPlaceholderText('Message #general')).toBeInTheDocument()
    })

    const input = screen.getByPlaceholderText('Message #general')
    
    // Test Enter key to send message
    fireEvent.change(input, { target: { value: 'New message' } })
    fireEvent.keyDown(input, { key: 'Enter', code: 'Enter' })

    await waitFor(() => {
      expect(mockSendMessage).toHaveBeenCalledWith('channel-1', {
        content: 'New message'
      })
    })
  })

  it('should show edited indicator for edited messages', async () => {
    const { isMessageEdited } = require('@/lib/messages')
    isMessageEdited.mockReturnValue(true)

    render(<MessageList channelId="channel-1" />)
    
    await waitFor(() => {
      expect(screen.getByText(/edited/i)).toBeInTheDocument()
    })
  })

  it('should handle pagination', async () => {
    mockFetchMessages.mockResolvedValue({
      messages: mockMessages,
      hasMore: true
    })

    render(<MessageList channelId="channel-1" />)
    
    await waitFor(() => {
      expect(screen.getByText('Hello world!')).toBeInTheDocument()
    })

    // Scroll to top to trigger load more
    const messageList = screen.getByRole('list')
    fireEvent.scroll(messageList, { target: { scrollTop: 0 } })

    await waitFor(() => {
      expect(mockFetchMessages).toHaveBeenCalledTimes(2)
    })
  })

  it('should show typing indicator', async () => {
    render(<MessageList channelId="channel-1" />)
    
    await waitFor(() => {
      expect(screen.getByPlaceholderText('Message #general')).toBeInTheDocument()
    })

    const input = screen.getByPlaceholderText('Message #general')
    
    // Start typing
    fireEvent.change(input, { target: { value: 'Typing...' } })
    
    // Should show typing indicator (if implemented)
    // This test would need to be updated based on actual typing indicator implementation
  })
})
