import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabaseClient'

export async function POST(request: NextRequest) {
  try {
    const { username, displayName } = await request.json()

    // Get the current user from the request
    const authHeader = request.headers.get('authorization')
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const token = authHeader.substring(7)
    
    // Verify the JWT token and get user info
    const { data: { user }, error: authError } = await supabaseAdmin.auth.getUser(token)
    
    if (authError || !user) {
      return NextResponse.json({ error: 'Invalid token' }, { status: 401 })
    }

    // Check if user already has a profile
    const { data: existingProfile } = await supabaseAdmin
      .from('users')
      .select('id')
      .eq('id', user.id)
      .single()

    if (existingProfile) {
      return NextResponse.json({ error: 'Profile already exists' }, { status: 400 })
    }

    // Check if username is available
    const { data: existingUsername } = await supabaseAdmin
      .from('users')
      .select('username, discriminator')
      .eq('username', username)
      .limit(9999) // Get all existing discriminators for this username

    // Generate unique discriminator
    let discriminator = '0001'
    if (existingUsername && existingUsername.length > 0) {
      const usedDiscriminators = existingUsername.map(u => u.discriminator)
      for (let i = 1; i <= 9999; i++) {
        const candidate = i.toString().padStart(4, '0')
        if (!usedDiscriminators.includes(candidate)) {
          discriminator = candidate
          break
        }
      }
    }

    // Create the user profile
    const { data: profile, error: profileError } = await supabaseAdmin
      .from('users')
      .insert({
        id: user.id,
        username,
        discriminator,
        display_name: displayName || username,
        status: 'online'
      })
      .select()
      .single()

    if (profileError) {
      console.error('Profile creation error:', profileError)
      return NextResponse.json({ error: 'Failed to create profile' }, { status: 500 })
    }

    // Create presence record
    await supabaseAdmin
      .from('presence')
      .insert({
        user_id: user.id,
        status: 'online'
      })

    return NextResponse.json({
      success: true,
      profile: {
        id: profile.id,
        username: profile.username,
        discriminator: profile.discriminator,
        display_name: profile.display_name,
        avatar_url: profile.avatar_url,
        status: profile.status
      }
    })

  } catch (error) {
    console.error('Create profile error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
