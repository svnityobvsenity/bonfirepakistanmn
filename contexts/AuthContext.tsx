'use client'

import React, { createContext, useContext, useEffect, useState } from 'react'
import { supabase } from '@/lib/supabaseClient'
import { signUp, signIn, signOut, getCurrentUser, updateProfile, uploadAvatar, deleteAvatar } from '@/lib/auth'
import type { SignUpData, SignInData, UpdateProfileData } from '@/lib/auth'

interface User {
  id: string
  username: string
  display_name: string
  avatar_url?: string
  discriminator: string
  created_at: string
}

interface AuthContextType {
  user: User | null
  isAuthenticated: boolean
  isLoading: boolean
  signUp: (data: SignUpData) => Promise<{ success: boolean; error?: string }>
  signIn: (data: SignInData) => Promise<{ success: boolean; error?: string }>
  signOut: () => Promise<{ success: boolean; error?: string }>
  updateProfile: (data: UpdateProfileData) => Promise<{ success: boolean; error?: string }>
  uploadAvatar: (file: File) => Promise<{ success: boolean; error?: string }>
  deleteAvatar: () => Promise<{ success: boolean; error?: string }>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}

interface AuthProviderProps {
  children: React.ReactNode
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Get initial session
    const getInitialSession = async () => {
      try {
        const result = await getCurrentUser()
        if (result.success && result.user) {
          setUser(result.user)
        }
      } catch (error) {
        console.error('Error getting initial session:', error)
      } finally {
        setIsLoading(false)
      }
    }

    getInitialSession()

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (event === 'SIGNED_IN' && session) {
          const result = await getCurrentUser()
          if (result.success && result.user) {
            setUser(result.user)
          }
        } else if (event === 'SIGNED_OUT') {
          setUser(null)
        }
        setIsLoading(false)
      }
    )

    return () => subscription.unsubscribe()
  }, [])

  const handleSignUp = async (data: SignUpData) => {
    const result = await signUp(data)
    if (result.success && result.user) {
      // User will be set via auth state change
    }
    return result
  }

  const handleSignIn = async (data: SignInData) => {
    const result = await signIn(data)
    if (result.success && result.user) {
      // User will be set via auth state change
    }
    return result
  }

  const handleSignOut = async () => {
    const result = await signOut()
    if (result.success) {
      setUser(null)
    }
    return result
  }

  const handleUpdateProfile = async (data: UpdateProfileData) => {
    const result = await updateProfile(data)
    if (result.success && result.user) {
      setUser(result.user)
    }
    return result
  }

  const handleUploadAvatar = async (file: File) => {
    const result = await uploadAvatar(file)
    if (result.success) {
      // Refresh user data to get new avatar URL
      const userResult = await getCurrentUser()
      if (userResult.success && userResult.user) {
        setUser(userResult.user)
      }
    }
    return result
  }

  const handleDeleteAvatar = async () => {
    const result = await deleteAvatar()
    if (result.success) {
      // Refresh user data to remove avatar URL
      const userResult = await getCurrentUser()
      if (userResult.success && userResult.user) {
        setUser(userResult.user)
      }
    }
    return result
  }

  const value: AuthContextType = {
    user,
    isAuthenticated: !!user,
    isLoading,
    signUp: handleSignUp,
    signIn: handleSignIn,
    signOut: handleSignOut,
    updateProfile: handleUpdateProfile,
    uploadAvatar: handleUploadAvatar,
    deleteAvatar: handleDeleteAvatar
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}
