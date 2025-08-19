import { NextRequest } from 'next/server'
import { GET, POST, PUT, DELETE } from '@/app/api/messages/route'

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
                ]
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

describe('Messages API Routes', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  describe('GET /api/messages', () => {
    it('should fetch messages for a channel', async () => {
      const request = new NextRequest('http://localhost:3000/api/messages?channelId=channel-1')
      
      const response = await GET(request)
      const data = await response.json()
      
      expect(response.status).toBe(200)
      expect(data.messages).toHaveLength(1)
      expect(data.messages[0].content).toBe('Test message')
    })

    it('should handle missing channelId parameter', async () => {
      const request = new NextRequest('http://localhost:3000/api/messages')
      
      const response = await GET(request)
      const data = await response.json()
      
      expect(response.status).toBe(400)
      expect(data.error).toBe('Channel ID is required')
    })

    it('should handle cursor pagination', async () => {
      const request = new NextRequest('http://localhost:3000/api/messages?channelId=channel-1&cursor=2024-01-01T00:00:00Z')
      
      const response = await GET(request)
      const data = await response.json()
      
      expect(response.status).toBe(200)
      expect(data.messages).toHaveLength(1)
    })

    it('should handle fetch errors', async () => {
      // Mock error response
      const mockSupabase = require('@/lib/supabaseClient').supabase
      mockSupabase.from.mockReturnValue({
        select: jest.fn(() => ({
          eq: jest.fn(() => ({
            order: jest.fn(() => ({
              limit: jest.fn(() => ({
                lt: jest.fn(() => Promise.resolve({ error: 'Database error' }))
              }))
            }))
          }))
        }))
      })

      const request = new NextRequest('http://localhost:3000/api/messages?channelId=channel-1')
      
      const response = await GET(request)
      const data = await response.json()
      
      expect(response.status).toBe(500)
      expect(data.error).toBe('Database error')
    })
  })

  describe('POST /api/messages', () => {
    it('should create a new message', async () => {
      const request = new NextRequest('http://localhost:3000/api/messages', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          channelId: 'channel-1',
          content: 'New message'
        })
      })
      
      const response = await POST(request)
      const data = await response.json()
      
      expect(response.status).toBe(201)
      expect(data.message.content).toBe('New message')
      expect(data.message.channel_id).toBe('channel-1')
    })

    it('should handle missing required fields', async () => {
      const request = new NextRequest('http://localhost:3000/api/messages', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          channelId: 'channel-1'
          // Missing content
        })
      })
      
      const response = await POST(request)
      const data = await response.json()
      
      expect(response.status).toBe(400)
      expect(data.error).toBe('Content is required')
    })

    it('should handle creation errors', async () => {
      // Mock error response
      const mockSupabase = require('@/lib/supabaseClient').supabase
      mockSupabase.from.mockReturnValue({
        insert: jest.fn(() => ({
          select: jest.fn(() => ({
            single: jest.fn(() => Promise.resolve({ error: 'Channel not found' }))
          }))
        }))
      })

      const request = new NextRequest('http://localhost:3000/api/messages', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          channelId: 'nonexistent',
          content: 'New message'
        })
      })
      
      const response = await POST(request)
      const data = await response.json()
      
      expect(response.status).toBe(500)
      expect(data.error).toBe('Channel not found')
    })
  })

  describe('PUT /api/messages', () => {
    it('should update a message', async () => {
      const request = new NextRequest('http://localhost:3000/api/messages', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          messageId: '1',
          content: 'Updated message'
        })
      })
      
      const response = await PUT(request)
      const data = await response.json()
      
      expect(response.status).toBe(200)
      expect(data.message.content).toBe('Updated message')
      expect(data.message.edited_at).toBeDefined()
    })

    it('should handle missing required fields', async () => {
      const request = new NextRequest('http://localhost:3000/api/messages', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          messageId: '1'
          // Missing content
        })
      })
      
      const response = await PUT(request)
      const data = await response.json()
      
      expect(response.status).toBe(400)
      expect(data.error).toBe('Message ID and content are required')
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

      const request = new NextRequest('http://localhost:3000/api/messages', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          messageId: '1',
          content: 'Updated message'
        })
      })
      
      const response = await PUT(request)
      const data = await response.json()
      
      expect(response.status).toBe(403)
      expect(data.error).toBe('Not authorized to edit this message')
    })
  })

  describe('DELETE /api/messages', () => {
    it('should delete a message', async () => {
      const request = new NextRequest('http://localhost:3000/api/messages', {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          messageId: '1'
        })
      })
      
      const response = await DELETE(request)
      const data = await response.json()
      
      expect(response.status).toBe(200)
      expect(data.success).toBe(true)
    })

    it('should handle missing messageId', async () => {
      const request = new NextRequest('http://localhost:3000/api/messages', {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({})
      })
      
      const response = await DELETE(request)
      const data = await response.json()
      
      expect(response.status).toBe(400)
      expect(data.error).toBe('Message ID is required')
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

      const request = new NextRequest('http://localhost:3000/api/messages', {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          messageId: '1'
        })
      })
      
      const response = await DELETE(request)
      const data = await response.json()
      
      expect(response.status).toBe(403)
      expect(data.error).toBe('Not authorized to delete this message')
    })
  })
})
