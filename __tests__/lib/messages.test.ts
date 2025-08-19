import { 
  fetchChannelMessages, 
  sendChannelMessage, 
  editChannelMessage, 
  deleteChannelMessage,
  formatMessageTime,
  isMessageEdited
} from '@/lib/messages'

// Mock Supabase client
jest.mock('@/lib/supabaseClient', () => ({
  supabase: {
    from: jest.fn(() => ({
      select: jest.fn(() => ({
        eq: jest.fn(() => ({
          order: jest.fn(() => ({
            limit: jest.fn(() => ({
              lt: jest.fn(() => Promise.resolve({
                data: [
                  {
                    id: '1',
                    channel_id: 'channel-1',
                    user_id: 'user-1',
                    content: 'Test message',
                    created_at: '2024-01-01T00:00:00Z',
                    user: {
                      id: 'user-1',
                      username: 'testuser',
                      display_name: 'Test User',
                      avatar_url: null,
                      discriminator: '0001'
                    }
                  }
                ])
              }))
            }))
          }))
        })),
        insert: jest.fn(() => ({
          select: jest.fn(() => ({
            single: jest.fn(() => Promise.resolve({
              data: {
                id: '2',
                channel_id: 'channel-1',
                user_id: 'user-1',
                content: 'New message',
                created_at: '2024-01-01T00:00:00Z',
                user: {
                  id: 'user-1',
                  username: 'testuser',
                  display_name: 'Test User',
                  avatar_url: null,
                  discriminator: '0001'
                }
              }
            }))
          }))
        })),
        update: jest.fn(() => ({
          eq: jest.fn(() => ({
            select: jest.fn(() => ({
              single: jest.fn(() => Promise.resolve({
                data: {
                  id: '1',
                  channel_id: 'channel-1',
                  user_id: 'user-1',
                  content: 'Updated message',
                  created_at: '2024-01-01T00:00:00Z',
                  edited_at: '2024-01-01T00:01:00Z',
                  user: {
                    id: 'user-1',
                    username: 'testuser',
                    display_name: 'Test User',
                    avatar_url: null,
                    discriminator: '0001'
                  }
                }
              }))
            }))
          }))
        })),
        delete: jest.fn(() => ({
          eq: jest.fn(() => Promise.resolve({ error: null }))
        }))
      }
    })),
    auth: {
      getSession: jest.fn(() => Promise.resolve({
        data: {
          session: {
            user: { id: 'user-1' },
            access_token: 'test-token'
          }
        }
      }))
    }
  }
}))

describe('Messages Library', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  describe('fetchChannelMessages', () => {
    it('should fetch messages for a channel', async () => {
      const result = await fetchChannelMessages('channel-1')
      
      expect(result.messages).toHaveLength(1)
      expect(result.messages[0].content).toBe('Test message')
      expect(result.hasMore).toBe(false)
    })

    it('should handle cursor pagination', async () => {
      const result = await fetchChannelMessages('channel-1', '2024-01-01T00:00:00Z')
      
      expect(result.messages).toHaveLength(1)
    })
  })

  describe('sendChannelMessage', () => {
    it('should send a message successfully', async () => {
      const result = await sendChannelMessage('channel-1', {
        content: 'New message'
      })
      
      expect(result.success).toBe(true)
      expect(result.message?.content).toBe('New message')
    })

    it('should handle send errors', async () => {
      // Mock error response
      const mockSupabase = require('@/lib/supabaseClient').supabase
      mockSupabase.from.mockReturnValue({
        insert: jest.fn(() => ({
          select: jest.fn(() => ({
            single: jest.fn(() => Promise.resolve({ error: 'Database error' }))
          }))
        }))
      })

      const result = await sendChannelMessage('channel-1', {
        content: 'New message'
      })
      
      expect(result.success).toBe(false)
      expect(result.error).toBe('Database error')
    })
  })

  describe('editChannelMessage', () => {
    it('should edit a message successfully', async () => {
      const result = await editChannelMessage('1', 'Updated message')
      
      expect(result.success).toBe(true)
      expect(result.message?.content).toBe('Updated message')
      expect(result.message?.edited_at).toBeDefined()
    })

    it('should handle unauthorized edit attempts', async () => {
      // Mock unauthorized response
      const mockSupabase = require('@/lib/supabaseClient').supabase
      mockSupabase.from.mockReturnValue({
        select: jest.fn(() => ({
          eq: jest.fn(() => ({
            single: jest.fn(() => Promise.resolve({ data: null }))
          }))
        }))
      })

      const result = await editChannelMessage('1', 'Updated message')
      
      expect(result.success).toBe(false)
      expect(result.error).toBe('Not authorized to edit this message')
    })
  })

  describe('deleteChannelMessage', () => {
    it('should delete a message successfully', async () => {
      const result = await deleteChannelMessage('1')
      
      expect(result.success).toBe(true)
    })

    it('should handle unauthorized delete attempts', async () => {
      // Mock unauthorized response
      const mockSupabase = require('@/lib/supabaseClient').supabase
      mockSupabase.from.mockReturnValue({
        select: jest.fn(() => ({
          eq: jest.fn(() => ({
            single: jest.fn(() => Promise.resolve({ data: null }))
          }))
        }))
      })

      const result = await deleteChannelMessage('1')
      
      expect(result.success).toBe(false)
      expect(result.error).toBe('Not authorized to delete this message')
    })
  })

  describe('formatMessageTime', () => {
    it('should format recent times correctly', () => {
      const now = new Date()
      const recentTime = new Date(now.getTime() - 1000 * 60 * 30) // 30 minutes ago
      
      const formatted = formatMessageTime(recentTime.toISOString())
      expect(formatted).toMatch(/^\d{1,2}:\d{2}$/) // HH:MM format
    })

    it('should format older times correctly', () => {
      const oldTime = new Date('2024-01-01T00:00:00Z')
      
      const formatted = formatMessageTime(oldTime.toISOString())
      expect(formatted).toMatch(/^[A-Za-z]{3}$/) // Day abbreviation
    })
  })

  describe('isMessageEdited', () => {
    it('should return true for edited messages', () => {
      const editedMessage = {
        id: '1',
        content: 'Test',
        created_at: '2024-01-01T00:00:00Z',
        edited_at: '2024-01-01T00:01:00Z'
      }
      
      expect(isMessageEdited(editedMessage)).toBe(true)
    })

    it('should return false for unedited messages', () => {
      const uneditedMessage = {
        id: '1',
        content: 'Test',
        created_at: '2024-01-01T00:00:00Z'
      }
      
      expect(isMessageEdited(uneditedMessage)).toBe(false)
    })
  })
})
