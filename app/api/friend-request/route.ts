import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabaseClient'

export async function POST(request: NextRequest) {
  try {
    const { toUserId } = await request.json()

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

    const fromUserId = user.id

    // Prevent self-friend requests
    if (fromUserId === toUserId) {
      return NextResponse.json({ error: 'Cannot send friend request to yourself' }, { status: 400 })
    }

    // Check if target user exists
    const { data: targetUser, error: targetError } = await supabaseAdmin
      .from('users')
      .select('id, username')
      .eq('id', toUserId)
      .single()

    if (targetError || !targetUser) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }

    // Check if friend request already exists
    const { data: existingRequest } = await supabaseAdmin
      .from('friend_requests')
      .select('id, status')
      .or(`and(from_user.eq.${fromUserId},to_user.eq.${toUserId}),and(from_user.eq.${toUserId},to_user.eq.${fromUserId})`)
      .single()

    if (existingRequest) {
      if (existingRequest.status === 'pending') {
        return NextResponse.json({ error: 'Friend request already pending' }, { status: 400 })
      } else if (existingRequest.status === 'accepted') {
        return NextResponse.json({ error: 'Already friends' }, { status: 400 })
      }
    }

    // Check if already friends
    const { data: existingFriendship } = await supabaseAdmin
      .from('friends')
      .select('id')
      .or(`and(user_a.eq.${fromUserId},user_b.eq.${toUserId}),and(user_a.eq.${toUserId},user_b.eq.${fromUserId})`)
      .single()

    if (existingFriendship) {
      return NextResponse.json({ error: 'Already friends' }, { status: 400 })
    }

    // Create friend request
    const { data: friendRequest, error: createError } = await supabaseAdmin
      .from('friend_requests')
      .insert({
        from_user: fromUserId,
        to_user: toUserId,
        status: 'pending'
      })
      .select(`
        id,
        from_user,
        to_user,
        status,
        created_at,
        from_user:users!friend_requests_from_user_fkey(username, display_name, avatar_url),
        to_user:users!friend_requests_to_user_fkey(username, display_name, avatar_url)
      `)
      .single()

    if (createError) {
      console.error('Friend request creation error:', createError)
      return NextResponse.json({ error: 'Failed to create friend request' }, { status: 500 })
    }

    return NextResponse.json({
      success: true,
      friendRequest: {
        id: friendRequest.id,
        fromUser: {
          id: friendRequest.from_user,
          username: friendRequest.from_user.username,
          displayName: friendRequest.from_user.display_name,
          avatarUrl: friendRequest.from_user.avatar_url
        },
        toUser: {
          id: friendRequest.to_user,
          username: friendRequest.to_user.username,
          displayName: friendRequest.to_user.display_name,
          avatarUrl: friendRequest.to_user.avatar_url
        },
        status: friendRequest.status,
        createdAt: friendRequest.created_at
      }
    })

  } catch (error) {
    console.error('Friend request error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function GET(request: NextRequest) {
  try {
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

    const userId = user.id

    // Get pending friend requests sent to this user
    const { data: pendingRequests, error: fetchError } = await supabaseAdmin
      .from('friend_requests')
      .select(`
        id,
        from_user,
        to_user,
        status,
        created_at,
        from_user:users!friend_requests_from_user_fkey(id, username, display_name, avatar_url, discriminator)
      `)
      .eq('to_user', userId)
      .eq('status', 'pending')
      .order('created_at', { ascending: false })

    if (fetchError) {
      console.error('Fetch friend requests error:', fetchError)
      return NextResponse.json({ error: 'Failed to fetch friend requests' }, { status: 500 })
    }

    return NextResponse.json({
      success: true,
      pendingRequests: pendingRequests?.map(req => ({
        id: req.id,
        fromUser: {
          id: req.from_user.id,
          username: req.from_user.username,
          displayName: req.from_user.display_name,
          avatarUrl: req.from_user.avatar_url,
          discriminator: req.from_user.discriminator
        },
        status: req.status,
        createdAt: req.created_at
      })) || []
    })

  } catch (error) {
    console.error('Get friend requests error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
