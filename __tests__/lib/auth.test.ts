import { 
  signUp, 
  signIn, 
  signOut, 
  getCurrentUser,
  updateProfile,
  uploadAvatar,
  deleteAvatar
} from '@/lib/auth'

// Mock Supabase client
jest.mock('@/lib/supabaseClient', () => ({
  supabase: {
    auth: {
      signUp: jest.fn(() => Promise.resolve({
        data: {
          user: {
            id: 'user-1',
            email: 'test@example.com',
            user_metadata: {
              username: 'testuser',
              display_name: 'Test User'
            }
          },
          session: {
            access_token: 'test-token',
            refresh_token: 'refresh-token'
          }
        },
        error: null
      })),
      signInWithPassword: jest.fn(() => Promise.resolve({
        data: {
          user: {
            id: 'user-1',
            email: 'test@example.com',
            user_metadata: {
              username: 'testuser',
              display_name: 'Test User'
            }
          },
          session: {
            access_token: 'test-token',
            refresh_token: 'refresh-token'
          }
        },
        error: null
      })),
      signOut: jest.fn(() => Promise.resolve({ error: null })),
      getSession: jest.fn(() => Promise.resolve({
        data: {
          session: {
            user: {
              id: 'user-1',
              email: 'test@example.com',
              user_metadata: {
                username: 'testuser',
                display_name: 'Test User'
              }
            },
            access_token: 'test-token'
          }
        }
      })),
      updateUser: jest.fn(() => Promise.resolve({
        data: {
          user: {
            id: 'user-1',
            email: 'test@example.com',
            user_metadata: {
              username: 'updateduser',
              display_name: 'Updated User'
            }
          }
        },
        error: null
      }))
    },
    from: jest.fn(() => ({
      select: jest.fn(() => ({
        eq: jest.fn(() => ({
          single: jest.fn(() => Promise.resolve({
            data: {
              id: 'user-1',
              username: 'testuser',
              display_name: 'Test User',
              avatar_url: null,
              discriminator: '0001',
              created_at: '2024-01-01T00:00:00Z'
            }
          }))
        }))
      })),
      insert: jest.fn(() => ({
        select: jest.fn(() => ({
          single: jest.fn(() => Promise.resolve({
            data: {
              id: 'user-1',
              username: 'testuser',
              display_name: 'Test User',
              avatar_url: null,
              discriminator: '0001'
            }
          }))
        }))
      })),
      update: jest.fn(() => ({
        eq: jest.fn(() => ({
          select: jest.fn(() => ({
            single: jest.fn(() => Promise.resolve({
              data: {
                id: 'user-1',
                username: 'updateduser',
                display_name: 'Updated User',
                avatar_url: 'https://example.com/avatar.jpg',
                discriminator: '0001'
              }
            }))
          }))
        }))
      }))
    })),
    storage: {
      from: jest.fn(() => ({
        upload: jest.fn(() => Promise.resolve({
          data: {
            path: 'avatars/user-1/avatar.jpg'
          },
          error: null
        })),
        remove: jest.fn(() => Promise.resolve({ error: null }))
      }))
    }
  }
}))

describe('Auth Library', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  describe('signUp', () => {
    it('should sign up successfully', async () => {
      const result = await signUp({
        email: 'test@example.com',
        password: 'password123',
        username: 'testuser',
        displayName: 'Test User'
      })
      
      expect(result.success).toBe(true)
      expect(result.user?.id).toBe('user-1')
      expect(result.user?.email).toBe('test@example.com')
    })

    it('should handle signup errors', async () => {
      // Mock error response
      const mockSupabase = require('@/lib/supabaseClient').supabase
      mockSupabase.auth.signUp.mockResolvedValue({
        data: { user: null, session: null },
        error: { message: 'Email already registered' }
      })

      const result = await signUp({
        email: 'existing@example.com',
        password: 'password123',
        username: 'existinguser',
        displayName: 'Existing User'
      })
      
      expect(result.success).toBe(false)
      expect(result.error).toBe('Email already registered')
    })

    it('should validate input data', async () => {
      const result = await signUp({
        email: 'invalid-email',
        password: '123', // Too short
        username: 'a', // Too short
        displayName: 'Test'
      })
      
      expect(result.success).toBe(false)
      expect(result.error).toContain('Invalid email')
    })
  })

  describe('signIn', () => {
    it('should sign in successfully', async () => {
      const result = await signIn({
        email: 'test@example.com',
        password: 'password123'
      })
      
      expect(result.success).toBe(true)
      expect(result.user?.id).toBe('user-1')
    })

    it('should handle signin errors', async () => {
      // Mock error response
      const mockSupabase = require('@/lib/supabaseClient').supabase
      mockSupabase.auth.signInWithPassword.mockResolvedValue({
        data: { user: null, session: null },
        error: { message: 'Invalid credentials' }
      })

      const result = await signIn({
        email: 'test@example.com',
        password: 'wrongpassword'
      })
      
      expect(result.success).toBe(false)
      expect(result.error).toBe('Invalid credentials')
    })
  })

  describe('signOut', () => {
    it('should sign out successfully', async () => {
      const result = await signOut()
      
      expect(result.success).toBe(true)
    })

    it('should handle signout errors', async () => {
      // Mock error response
      const mockSupabase = require('@/lib/supabaseClient').supabase
      mockSupabase.auth.signOut.mockResolvedValue({
        error: { message: 'Signout failed' }
      })

      const result = await signOut()
      
      expect(result.success).toBe(false)
      expect(result.error).toBe('Signout failed')
    })
  })

  describe('getCurrentUser', () => {
    it('should get current user successfully', async () => {
      const result = await getCurrentUser()
      
      expect(result.success).toBe(true)
      expect(result.user?.id).toBe('user-1')
      expect(result.user?.username).toBe('testuser')
    })

    it('should handle no session', async () => {
      // Mock no session response
      const mockSupabase = require('@/lib/supabaseClient').supabase
      mockSupabase.auth.getSession.mockResolvedValue({
        data: { session: null }
      })

      const result = await getCurrentUser()
      
      expect(result.success).toBe(false)
      expect(result.error).toBe('No active session')
    })
  })

  describe('updateProfile', () => {
    it('should update profile successfully', async () => {
      const result = await updateProfile({
        username: 'updateduser',
        displayName: 'Updated User'
      })
      
      expect(result.success).toBe(true)
      expect(result.user?.username).toBe('updateduser')
      expect(result.user?.display_name).toBe('Updated User')
    })

    it('should handle update errors', async () => {
      // Mock error response
      const mockSupabase = require('@/lib/supabaseClient').supabase
      mockSupabase.from.mockReturnValue({
        update: jest.fn(() => ({
          eq: jest.fn(() => ({
            select: jest.fn(() => ({
              single: jest.fn(() => Promise.resolve({ error: 'Username already taken' }))
            }))
          }))
        }))
      })

      const result = await updateProfile({
        username: 'existinguser'
      })
      
      expect(result.success).toBe(false)
      expect(result.error).toBe('Username already taken')
    })

    it('should validate username format', async () => {
      const result = await updateProfile({
        username: 'invalid username' // Contains space
      })
      
      expect(result.success).toBe(false)
      expect(result.error).toContain('Username can only contain letters, numbers, and underscores')
    })
  })

  describe('uploadAvatar', () => {
    it('should upload avatar successfully', async () => {
      const file = new File(['test'], 'avatar.jpg', { type: 'image/jpeg' })
      
      const result = await uploadAvatar(file)
      
      expect(result.success).toBe(true)
      expect(result.avatarUrl).toContain('avatars/user-1/avatar.jpg')
    })

    it('should handle upload errors', async () => {
      // Mock error response
      const mockSupabase = require('@/lib/supabaseClient').supabase
      mockSupabase.storage.from.mockReturnValue({
        upload: jest.fn(() => Promise.resolve({
          data: null,
          error: { message: 'Upload failed' }
        }))
      })

      const file = new File(['test'], 'avatar.jpg', { type: 'image/jpeg' })
      
      const result = await uploadAvatar(file)
      
      expect(result.success).toBe(false)
      expect(result.error).toBe('Upload failed')
    })

    it('should validate file type', async () => {
      const file = new File(['test'], 'document.txt', { type: 'text/plain' })
      
      const result = await uploadAvatar(file)
      
      expect(result.success).toBe(false)
      expect(result.error).toContain('Only image files are allowed')
    })

    it('should validate file size', async () => {
      // Create a large file (5MB)
      const largeFile = new File(['x'.repeat(5 * 1024 * 1024)], 'large.jpg', { type: 'image/jpeg' })
      
      const result = await uploadAvatar(largeFile)
      
      expect(result.success).toBe(false)
      expect(result.error).toContain('File size must be less than 2MB')
    })
  })

  describe('deleteAvatar', () => {
    it('should delete avatar successfully', async () => {
      const result = await deleteAvatar()
      
      expect(result.success).toBe(true)
    })

    it('should handle delete errors', async () => {
      // Mock error response
      const mockSupabase = require('@/lib/supabaseClient').supabase
      mockSupabase.storage.from.mockReturnValue({
        remove: jest.fn(() => Promise.resolve({ error: { message: 'Delete failed' } }))
      })

      const result = await deleteAvatar()
      
      expect(result.success).toBe(false)
      expect(result.error).toBe('Delete failed')
    })
  })
})
