import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabaseClient'

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { action } = await request.json() // 'accept' or 'reject'
    const requestId = params.id

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

    // Get the friend request
    const { data: friendRequest, error: fetchError } = await supabaseAdmin
      .from('friend_requests')
      .select(`
        id,
        from_user,
        to_user,
        status,
        created_at,
        from_user:users!friend_requests_from_user_fkey(id, username, display_name, avatar_url, discriminator),
        to_user:users!friend_requests_to_user_fkey(id, username, display_name, avatar_url, discriminator)
      `)
      .eq('id', requestId)
      .eq('to_user', userId) // Only the recipient can accept/reject
      .eq('status', 'pending')
      .single()

    if (fetchError || !friendRequest) {
      return NextResponse.json({ error: 'Friend request not found' }, { status: 404 })
    }

    if (action === 'accept') {
      // Accept the friend request
      const { error: updateError } = await supabaseAdmin
        .from('friend_requests')
        .update({ 
          status: 'accepted',
          updated_at: new Date().toISOString()
        })
        .eq('id', requestId)

      if (updateError) {
        console.error('Accept friend request error:', updateError)
        return NextResponse.json({ error: 'Failed to accept friend request' }, { status: 500 })
      }

      // Create mutual friendship (ensure proper ordering)
      const userA = friendRequest.from_user.id < friendRequest.to_user.id 
        ? friendRequest.from_user.id 
        : friendRequest.to_user.id
      const userB = friendRequest.from_user.id < friendRequest.to_user.id 
        ? friendRequest.to_user.id 
        : friendRequest.from_user.id

      const { error: friendshipError } = await supabaseAdmin
        .from('friends')
        .insert({
          user_a: userA,
          user_b: userB
        })

      if (friendshipError) {
        console.error('Create friendship error:', friendshipError)
        // Don't fail the request if friendship creation fails
      }

      return NextResponse.json({
        success: true,
        message: 'Friend request accepted',
        friendship: {
          userA: {
            id: userA,
            username: userA === friendRequest.from_user.id 
              ? friendRequest.from_user.username 
              : friendRequest.to_user.username,
            displayName: userA === friendRequest.from_user.id 
              ? friendRequest.from_user.display_name 
              : friendRequest.to_user.display_name,
            avatarUrl: userA === friendRequest.from_user.id 
              ? friendRequest.from_user.avatar_url 
              : friendRequest.to_user.avatar_url
          },
          userB: {
            id: userB,
            username: userB === friendRequest.from_user.id 
              ? friendRequest.from_user.username 
              : friendRequest.to_user.username,
            displayName: userB === friendRequest.from_user.id 
              ? friendRequest.from_user.display_name 
              : friendRequest.to_user.display_name,
            avatarUrl: userB === friendRequest.from_user.id 
              ? friendRequest.from_user.avatar_url 
              : friendRequest.to_user.avatar_url
          }
        }
      })

    } else if (action === 'reject') {
      // Reject the friend request
      const { error: updateError } = await supabaseAdmin
        .from('friend_requests')
        .update({ 
          status: 'rejected',
          updated_at: new Date().toISOString()
        })
        .eq('id', requestId)

      if (updateError) {
        console.error('Reject friend request error:', updateError)
        return NextResponse.json({ error: 'Failed to reject friend request' }, { status: 500 })
      }

      return NextResponse.json({
        success: true,
        message: 'Friend request rejected'
      })

    } else {
      return NextResponse.json({ error: 'Invalid action' }, { status: 400 })
    }

  } catch (error) {
    console.error('Friend request action error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
