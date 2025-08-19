import { 
  fetchUserChannels, 
  createChannel, 
  joinChannel, 
  leaveChannel,
  getChannelById,
  updateChannelSettings
} from '@/lib/channels'

// Mock Supabase client
jest.mock('@/lib/supabaseClient', () => ({
  supabase: {
    from: jest.fn(() => ({
      select: jest.fn(() => ({
        eq: jest.fn(() => ({
          order: jest.fn(() => Promise.resolve({
            data: [
              {
                id: 'channel-1',
                name: 'general',
                description: 'General chat',
                is_private: false,
                created_at: '2024-01-01T00:00:00Z',
                owner_id: 'user-1',
                member_count: 5,
                last_message_at: '2024-01-01T00:00:00Z',
                owner: {
                  id: 'user-1',
                  username: 'owner',
                  display_name: 'Channel Owner',
                  avatar_url: null,
                  discriminator: '0001'
                }
              }
            ]
          }))
        })),
        insert: jest.fn(() => ({
          select: jest.fn(() => ({
            single: jest.fn(() => Promise.resolve({
              data: {
                id: 'channel-2',
                name: 'new-channel',
                description: 'New channel',
                is_private: false,
                created_at: '2024-01-01T00:00:00Z',
                owner_id: 'user-1'
              }
            }))
          }))
        })),
        update: jest.fn(() => ({
          eq: jest.fn(() => ({
            select: jest.fn(() => ({
              single: jest.fn(() => Promise.resolve({
                data: {
                  id: 'channel-1',
                  name: 'updated-channel',
                  description: 'Updated description',
                  is_private: true
                }
              }))
            }))
          }))
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

describe('Channels Library', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  describe('fetchUserChannels', () => {
    it('should fetch user channels successfully', async () => {
      const result = await fetchUserChannels()
      
      expect(result.success).toBe(true)
      expect(result.channels).toHaveLength(1)
      expect(result.channels[0].name).toBe('general')
      expect(result.channels[0].member_count).toBe(5)
    })

    it('should handle fetch errors', async () => {
      // Mock error response
      const mockSupabase = require('@/lib/supabaseClient').supabase
      mockSupabase.from.mockReturnValue({
        select: jest.fn(() => ({
          eq: jest.fn(() => ({
            order: jest.fn(() => Promise.resolve({ error: 'Database error' }))
          }))
        }))
      })

      const result = await fetchUserChannels()
      
      expect(result.success).toBe(false)
      expect(result.error).toBe('Database error')
    })
  })

  describe('createChannel', () => {
    it('should create a channel successfully', async () => {
      const result = await createChannel({
        name: 'new-channel',
        description: 'New channel',
        isPrivate: false
      })
      
      expect(result.success).toBe(true)
      expect(result.channel?.name).toBe('new-channel')
      expect(result.channel?.description).toBe('New channel')
    })

    it('should handle creation errors', async () => {
      // Mock error response
      const mockSupabase = require('@/lib/supabaseClient').supabase
      mockSupabase.from.mockReturnValue({
        insert: jest.fn(() => ({
          select: jest.fn(() => ({
            single: jest.fn(() => Promise.resolve({ error: 'Channel name already exists' }))
          }))
        }))
      })

      const result = await createChannel({
        name: 'existing-channel',
        description: 'Test',
        isPrivate: false
      })
      
      expect(result.success).toBe(false)
      expect(result.error).toBe('Channel name already exists')
    })

    it('should validate channel name', async () => {
      const result = await createChannel({
        name: 'a', // Too short
        description: 'Test',
        isPrivate: false
      })
      
      expect(result.success).toBe(false)
      expect(result.error).toBe('Channel name must be between 2 and 32 characters')
    })
  })

  describe('joinChannel', () => {
    it('should join a channel successfully', async () => {
      const result = await joinChannel('channel-1')
      
      expect(result.success).toBe(true)
    })

    it('should handle join errors', async () => {
      // Mock error response
      const mockSupabase = require('@/lib/supabaseClient').supabase
      mockSupabase.from.mockReturnValue({
        insert: jest.fn(() => Promise.resolve({ error: 'Already a member' }))
      })

      const result = await joinChannel('channel-1')
      
      expect(result.success).toBe(false)
      expect(result.error).toBe('Already a member')
    })
  })

  describe('leaveChannel', () => {
    it('should leave a channel successfully', async () => {
      const result = await leaveChannel('channel-1')
      
      expect(result.success).toBe(true)
    })

    it('should handle leave errors', async () => {
      // Mock error response
      const mockSupabase = require('@/lib/supabaseClient').supabase
      mockSupabase.from.mockReturnValue({
        delete: jest.fn(() => ({
          eq: jest.fn(() => Promise.resolve({ error: 'Not a member' }))
        }))
      })

      const result = await leaveChannel('channel-1')
      
      expect(result.success).toBe(false)
      expect(result.error).toBe('Not a member')
    })
  })

  describe('getChannelById', () => {
    it('should fetch channel by ID successfully', async () => {
      const result = await getChannelById('channel-1')
      
      expect(result.success).toBe(true)
      expect(result.channel?.id).toBe('channel-1')
    })

    it('should handle not found', async () => {
      // Mock not found response
      const mockSupabase = require('@/lib/supabaseClient').supabase
      mockSupabase.from.mockReturnValue({
        select: jest.fn(() => ({
          eq: jest.fn(() => ({
            single: jest.fn(() => Promise.resolve({ data: null }))
          }))
        }))
      })

      const result = await getChannelById('nonexistent')
      
      expect(result.success).toBe(false)
      expect(result.error).toBe('Channel not found')
    })
  })

  describe('updateChannelSettings', () => {
    it('should update channel settings successfully', async () => {
      const result = await updateChannelSettings('channel-1', {
        name: 'updated-channel',
        description: 'Updated description',
        isPrivate: true
      })
      
      expect(result.success).toBe(true)
      expect(result.channel?.name).toBe('updated-channel')
      expect(result.channel?.description).toBe('Updated description')
      expect(result.channel?.is_private).toBe(true)
    })

    it('should handle unauthorized updates', async () => {
      // Mock unauthorized response
      const mockSupabase = require('@/lib/supabaseClient').supabase
      mockSupabase.from.mockReturnValue({
        select: jest.fn(() => ({
          eq: jest.fn(() => ({
            single: jest.fn(() => Promise.resolve({ data: null }))
          }))
        }))
      })

      const result = await updateChannelSettings('channel-1', {
        name: 'updated-channel'
      })
      
      expect(result.success).toBe(false)
      expect(result.error).toBe('Not authorized to update this channel')
    })
  })
})
