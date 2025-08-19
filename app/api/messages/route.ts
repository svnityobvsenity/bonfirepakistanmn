import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabaseClient'
import { RateLimiter } from '@/lib/rateLimit'

// Rate limiter: 5 messages per 5 seconds per user
const messageLimiter = new RateLimiter({
  windowMs: 5000, // 5 seconds
  maxRequests: 5,
  keyGenerator: (req: NextRequest) => {
    const authHeader = req.headers.get('authorization')
    return authHeader || req.ip || 'unknown'
  }
})

export async function POST(request: NextRequest) {
  try {
    // Apply rate limiting
    const rateLimitResult = await messageLimiter.isAllowed(request)
    if (!rateLimitResult.allowed) {
      return NextResponse.json(
        { 
          error: 'Rate limit exceeded', 
          retryAfter: Math.ceil(rateLimitResult.retryAfter / 1000) 
        }, 
        { 
          status: 429,
          headers: {
            'Retry-After': Math.ceil(rateLimitResult.retryAfter / 1000).toString(),
            'X-RateLimit-Limit': rateLimitResult.limit.toString(),
            'X-RateLimit-Remaining': rateLimitResult.remaining.toString(),
            'X-RateLimit-Reset': new Date(rateLimitResult.resetTime).toISOString()
          }
        }
      )
    }

    const { channelId, content } = await request.json()

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

    // Validate content
    if (!content || !content.trim()) {
      return NextResponse.json({ error: 'Message content is required' }, { status: 400 })
    }

    if (content.trim().length > 2000) {
      return NextResponse.json({ error: 'Message content too long (max 2000 characters)' }, { status: 400 })
    }

    // Check if channel exists
    const { data: channel, error: channelError } = await supabaseAdmin
      .from('channels')
      .select('id, name')
      .eq('id', channelId)
      .single()

    if (channelError || !channel) {
      return NextResponse.json({ error: 'Channel not found' }, { status: 404 })
    }

    // Create message
    const { data: message, error: createError } = await supabaseAdmin
      .from('messages')
      .insert({
        channel_id: channelId,
        user_id: user.id,
        content: content.trim()
      })
      .select(`
        *,
        user:users(id, username, display_name, avatar_url, discriminator)
      `)
      .single()

    if (createError) {
      console.error('Message creation error:', createError)
      return NextResponse.json({ error: 'Failed to create message' }, { status: 500 })
    }

    return NextResponse.json({
      success: true,
      message: {
        id: message.id,
        channelId: message.channel_id,
        userId: message.user_id,
        content: message.content,
        createdAt: message.created_at,
        editedAt: message.edited_at,
        user: {
          id: message.user.id,
          username: message.user.username,
          displayName: message.user.display_name,
          avatarUrl: message.user.avatar_url,
          discriminator: message.user.discriminator
        }
      }
    })

  } catch (error) {
    console.error('Send message error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function PUT(request: NextRequest) {
  try {
    const { messageId, content } = await request.json()

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

    // Validate content
    if (!content || !content.trim()) {
      return NextResponse.json({ error: 'Message content is required' }, { status: 400 })
    }

    if (content.trim().length > 2000) {
      return NextResponse.json({ error: 'Message content too long (max 2000 characters)' }, { status: 400 })
    }

    // Check if message exists and user owns it
    const { data: existingMessage, error: fetchError } = await supabaseAdmin
      .from('messages')
      .select('id, user_id, channel_id')
      .eq('id', messageId)
      .single()

    if (fetchError || !existingMessage) {
      return NextResponse.json({ error: 'Message not found' }, { status: 404 })
    }

    if (existingMessage.user_id !== user.id) {
      return NextResponse.json({ error: 'Not authorized to edit this message' }, { status: 403 })
    }

    // Update message
    const { data: message, error: updateError } = await supabaseAdmin
      .from('messages')
      .update({
        content: content.trim(),
        edited_at: new Date().toISOString()
      })
      .eq('id', messageId)
      .select(`
        *,
        user:users(id, username, display_name, avatar_url, discriminator)
      `)
      .single()

    if (updateError) {
      console.error('Message update error:', updateError)
      return NextResponse.json({ error: 'Failed to update message' }, { status: 500 })
    }

    return NextResponse.json({
      success: true,
      message: {
        id: message.id,
        channelId: message.channel_id,
        userId: message.user_id,
        content: message.content,
        createdAt: message.created_at,
        editedAt: message.edited_at,
        user: {
          id: message.user.id,
          username: message.user.username,
          displayName: message.user.display_name,
          avatarUrl: message.user.avatar_url,
          discriminator: message.user.discriminator
        }
      }
    })

  } catch (error) {
    console.error('Edit message error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const url = new URL(request.url)
    const messageId = url.searchParams.get('messageId')

    if (!messageId) {
      return NextResponse.json({ error: 'Message ID is required' }, { status: 400 })
    }

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

    // Check if message exists and user owns it
    const { data: existingMessage, error: fetchError } = await supabaseAdmin
      .from('messages')
      .select('id, user_id, channel_id')
      .eq('id', messageId)
      .single()

    if (fetchError || !existingMessage) {
      return NextResponse.json({ error: 'Message not found' }, { status: 404 })
    }

    if (existingMessage.user_id !== user.id) {
      return NextResponse.json({ error: 'Not authorized to delete this message' }, { status: 403 })
    }

    // Delete message
    const { error: deleteError } = await supabaseAdmin
      .from('messages')
      .delete()
      .eq('id', messageId)

    if (deleteError) {
      console.error('Message delete error:', deleteError)
      return NextResponse.json({ error: 'Failed to delete message' }, { status: 500 })
    }

    return NextResponse.json({
      success: true,
      message: 'Message deleted successfully'
    })

  } catch (error) {
    console.error('Delete message error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function GET(request: NextRequest) {
  try {
    const url = new URL(request.url)
    const channelId = url.searchParams.get('channelId')
    const cursor = url.searchParams.get('cursor')
    const limit = parseInt(url.searchParams.get('limit') || '50')

    if (!channelId) {
      return NextResponse.json({ error: 'Channel ID is required' }, { status: 400 })
    }

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

    // Check if channel exists
    const { data: channel, error: channelError } = await supabaseAdmin
      .from('channels')
      .select('id, name')
      .eq('id', channelId)
      .single()

    if (channelError || !channel) {
      return NextResponse.json({ error: 'Channel not found' }, { status: 404 })
    }

    // Build query
    let query = supabaseAdmin
      .from('messages')
      .select(`
        *,
        user:users(id, username, display_name, avatar_url, discriminator)
      `)
      .eq('channel_id', channelId)
      .order('created_at', { ascending: false })
      .limit(Math.min(limit, 100)) // Cap at 100

    if (cursor) {
      query = query.lt('created_at', cursor)
    }

    const { data: messages, error: fetchError } = await query

    if (fetchError) {
      console.error('Fetch messages error:', fetchError)
      return NextResponse.json({ error: 'Failed to fetch messages' }, { status: 500 })
    }

    const hasMore = messages?.length === Math.min(limit, 100)

    return NextResponse.json({
      success: true,
      messages: (messages || []).reverse().map(msg => ({
        id: msg.id,
        channelId: msg.channel_id,
        userId: msg.user_id,
        content: msg.content,
        createdAt: msg.created_at,
        editedAt: msg.edited_at,
        user: {
          id: msg.user.id,
          username: msg.user.username,
          displayName: msg.user.display_name,
          avatarUrl: msg.user.avatar_url,
          discriminator: msg.user.discriminator
        }
      })),
      hasMore,
      channel: {
        id: channel.id,
        name: channel.name
      }
    })

  } catch (error) {
    console.error('Get messages error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
