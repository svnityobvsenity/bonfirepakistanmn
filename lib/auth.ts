import { supabase } from './supabaseClient'

export interface SignUpData {
  email: string
  password: string
  username: string
  displayName: string
}

export interface SignInData {
  email: string
  password: string
}

export interface UpdateProfileData {
  username?: string
  displayName?: string
}

export interface AuthResult {
  success: boolean
  user?: any
  error?: string
}

export interface ProfileResult {
  success: boolean
  user?: any
  error?: string
}

export interface AvatarResult {
  success: boolean
  avatarUrl?: string
  error?: string
}

// Validation functions
const validateEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email)
}

const validatePassword = (password: string): boolean => {
  return password.length >= 6
}

const validateUsername = (username: string): boolean => {
  const usernameRegex = /^[a-zA-Z0-9_]{2,32}$/
  return usernameRegex.test(username)
}

const validateDisplayName = (displayName: string): boolean => {
  return displayName.length >= 1 && displayName.length <= 32
}

// Auth functions
export const signUp = async (data: SignUpData): Promise<AuthResult> => {
  try {
    // Validate input
    if (!validateEmail(data.email)) {
      return { success: false, error: 'Invalid email format' }
    }
    if (!validatePassword(data.password)) {
      return { success: false, error: 'Password must be at least 6 characters' }
    }
    if (!validateUsername(data.username)) {
      return { success: false, error: 'Username must be 2-32 characters and contain only letters, numbers, and underscores' }
    }
    if (!validateDisplayName(data.displayName)) {
      return { success: false, error: 'Display name must be 1-32 characters' }
    }

    // Sign up with Supabase
    const { data: authData, error } = await supabase.auth.signUp({
      email: data.email,
      password: data.password,
      options: {
        data: {
          username: data.username,
          display_name: data.displayName
        }
      }
    })

    if (error) {
      return { success: false, error: error.message }
    }

    if (authData.user) {
      // Create profile in profiles table
      const { error: profileError } = await supabase
        .from('profiles')
        .insert({
          id: authData.user.id,
          username: data.username,
          display_name: data.displayName,
          discriminator: Math.floor(Math.random() * 10000).toString().padStart(4, '0')
        })

      if (profileError) {
        return { success: false, error: profileError.message }
      }

      return { success: true, user: authData.user }
    }

    return { success: false, error: 'Sign up failed' }
  } catch (error) {
    return { success: false, error: 'An unexpected error occurred' }
  }
}

export const signIn = async (data: SignInData): Promise<AuthResult> => {
  try {
    const { data: authData, error } = await supabase.auth.signInWithPassword({
      email: data.email,
      password: data.password
    })

    if (error) {
      return { success: false, error: error.message }
    }

    return { success: true, user: authData.user }
  } catch (error) {
    return { success: false, error: 'An unexpected error occurred' }
  }
}

export const signOut = async (): Promise<AuthResult> => {
  try {
    const { error } = await supabase.auth.signOut()
    
    if (error) {
      return { success: false, error: error.message }
    }

    return { success: true }
  } catch (error) {
    return { success: false, error: 'An unexpected error occurred' }
  }
}

export const getCurrentUser = async (): Promise<AuthResult> => {
  try {
    const { data: { session } } = await supabase.auth.getSession()
    
    if (!session) {
      return { success: false, error: 'No active session' }
    }

    // Get user profile
    const { data: profile, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', session.user.id)
      .single()

    if (error) {
      return { success: false, error: error.message }
    }

    return { success: true, user: profile }
  } catch (error) {
    return { success: false, error: 'An unexpected error occurred' }
  }
}

export const updateProfile = async (data: UpdateProfileData): Promise<ProfileResult> => {
  try {
    const { data: { session } } = await supabase.auth.getSession()
    
    if (!session) {
      return { success: false, error: 'No active session' }
    }

    // Validate username if provided
    if (data.username && !validateUsername(data.username)) {
      return { success: false, error: 'Username can only contain letters, numbers, and underscores' }
    }

    // Validate display name if provided
    if (data.displayName && !validateDisplayName(data.displayName)) {
      return { success: false, error: 'Display name must be 1-32 characters' }
    }

    // Update profile
    const { data: profile, error } = await supabase
      .from('profiles')
      .update({
        ...(data.username && { username: data.username }),
        ...(data.displayName && { display_name: data.displayName })
      })
      .eq('id', session.user.id)
      .select()
      .single()

    if (error) {
      return { success: false, error: error.message }
    }

    return { success: true, user: profile }
  } catch (error) {
    return { success: false, error: 'An unexpected error occurred' }
  }
}

export const uploadAvatar = async (file: File): Promise<AvatarResult> => {
  try {
    const { data: { session } } = await supabase.auth.getSession()
    
    if (!session) {
      return { success: false, error: 'No active session' }
    }

    // Validate file type
    if (!file.type.startsWith('image/')) {
      return { success: false, error: 'Only image files are allowed' }
    }

    // Validate file size (2MB limit)
    if (file.size > 2 * 1024 * 1024) {
      return { success: false, error: 'File size must be less than 2MB' }
    }

    const fileName = `${session.user.id}/${Date.now()}-${file.name}`
    
    const { data, error } = await supabase.storage
      .from('avatars')
      .upload(fileName, file)

    if (error) {
      return { success: false, error: error.message }
    }

    // Get public URL
    const { data: { publicUrl } } = supabase.storage
      .from('avatars')
      .getPublicUrl(fileName)

    // Update profile with new avatar URL
    const { error: updateError } = await supabase
      .from('profiles')
      .update({ avatar_url: publicUrl })
      .eq('id', session.user.id)

    if (updateError) {
      return { success: false, error: updateError.message }
    }

    return { success: true, avatarUrl: publicUrl }
  } catch (error) {
    return { success: false, error: 'An unexpected error occurred' }
  }
}

export const deleteAvatar = async (): Promise<AvatarResult> => {
  try {
    const { data: { session } } = await supabase.auth.getSession()
    
    if (!session) {
      return { success: false, error: 'No active session' }
    }

    // Get current avatar URL
    const { data: profile } = await supabase
      .from('profiles')
      .select('avatar_url')
      .eq('id', session.user.id)
      .single()

    if (profile?.avatar_url) {
      // Extract file path from URL
      const urlParts = profile.avatar_url.split('/')
      const fileName = urlParts[urlParts.length - 1]
      const filePath = `${session.user.id}/${fileName}`

      // Delete from storage
      const { error: deleteError } = await supabase.storage
        .from('avatars')
        .remove([filePath])

      if (deleteError) {
        return { success: false, error: deleteError.message }
      }
    }

    // Update profile to remove avatar URL
    const { error: updateError } = await supabase
      .from('profiles')
      .update({ avatar_url: null })
      .eq('id', session.user.id)

    if (updateError) {
      return { success: false, error: updateError.message }
    }

    return { success: true }
  } catch (error) {
    return { success: false, error: 'An unexpected error occurred' }
  }
}
