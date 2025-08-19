import React, { ReactElement } from 'react'
import { render, RenderOptions } from '@testing-library/react'
import { AuthProvider } from '@/contexts/AuthContext'

// Mock the auth context for testing
const mockAuthContext = {
  user: {
    id: 'test-user-id',
    username: 'testuser',
    display_name: 'Test User',
    avatar_url: null,
    discriminator: '0001',
    created_at: '2024-01-01T00:00:00Z'
  },
  isAuthenticated: true,
  isLoading: false,
  signUp: jest.fn(),
  signIn: jest.fn(),
  signOut: jest.fn(),
  updateProfile: jest.fn(),
  uploadAvatar: jest.fn(),
  deleteAvatar: jest.fn()
}

// Custom render function that includes providers
const AllTheProviders = ({ children }: { children: React.ReactNode }) => {
  return (
    <AuthProvider>
      {children}
    </AuthProvider>
  )
}

const customRender = (
  ui: ReactElement,
  options?: Omit<RenderOptions, 'wrapper'>
) => render(ui, { wrapper: AllTheProviders, ...options })

// Re-export everything
export * from '@testing-library/react'
export { customRender as render }

// Test data factories
export const createMockUser = (overrides = {}) => ({
  id: 'test-user-id',
  username: 'testuser',
  display_name: 'Test User',
  avatar_url: null,
  discriminator: '0001',
  created_at: '2024-01-01T00:00:00Z',
  ...overrides
})

export const createMockMessage = (overrides = {}) => ({
  id: 'test-message-id',
  channel_id: 'test-channel-id',
  user_id: 'test-user-id',
  content: 'Test message content',
  created_at: '2024-01-01T12:00:00Z',
  edited_at: null,
  user: createMockUser(),
  ...overrides
})

export const createMockChannel = (overrides = {}) => ({
  id: 'test-channel-id',
  name: 'test-channel',
  description: 'A test channel',
  is_private: false,
  created_at: '2024-01-01T00:00:00Z',
  owner_id: 'test-user-id',
  member_count: 1,
  last_message_at: '2024-01-01T12:00:00Z',
  owner: createMockUser(),
  ...overrides
})

// Mock data arrays
export const mockUsers = [
  createMockUser({ id: 'user-1', username: 'user1' }),
  createMockUser({ id: 'user-2', username: 'user2' }),
  createMockUser({ id: 'user-3', username: 'user3' })
]

export const mockMessages = [
  createMockMessage({ id: 'msg-1', content: 'First message' }),
  createMockMessage({ id: 'msg-2', content: 'Second message' }),
  createMockMessage({ id: 'msg-3', content: 'Third message' })
]

export const mockChannels = [
  createMockChannel({ id: 'channel-1', name: 'general' }),
  createMockChannel({ id: 'channel-2', name: 'random' }),
  createMockChannel({ id: 'channel-3', name: 'help' })
]

// Test helpers
export const waitForLoadingToFinish = () => {
  return new Promise(resolve => setTimeout(resolve, 0))
}

export const mockSupabaseResponse = (data: any, error: any = null) => ({
  data,
  error
})

export const mockSupabaseError = (message: string) => ({
  data: null,
  error: { message }
})
