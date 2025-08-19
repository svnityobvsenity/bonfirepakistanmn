const { createClient } = require('@supabase/supabase-js');
const config = require('./config');
const logger = require('./logger');

/**
 * Supabase client for database operations
 * Handles user authentication, real-time subscriptions, and data persistence
 */

class SupabaseService {
  constructor() {
    this.supabase = createClient(
      config.supabase.url,
      config.supabase.serviceRoleKey,
      {
        auth: {
          autoRefreshToken: false,
          persistSession: false
        }
      }
    );
    
    this.publicClient = createClient(
      config.supabase.url,
      config.supabase.anonKey
    );
    
    logger.info('Supabase service initialized');
  }

  /**
   * Verify user JWT token
   */
  async verifyUser(token) {
    try {
      const { data: { user }, error } = await this.publicClient.auth.getUser(token);
      
      if (error) {
        logger.warn('Token verification failed:', error.message);
        return null;
      }
      
      return user;
    } catch (error) {
      logger.error('Error verifying user token:', error);
      return null;
    }
  }

  /**
   * Get user profile by ID
   */
  async getUserProfile(userId) {
    try {
      const { data, error } = await this.supabase
        .from('users')
        .select('*')
        .eq('id', userId)
        .single();

      if (error) {
        logger.error('Error fetching user profile:', error);
        return null;
      }

      return data;
    } catch (error) {
      logger.error('Error in getUserProfile:', error);
      return null;
    }
  }

  /**
   * Update user profile
   */
  async updateUserProfile(userId, updates) {
    try {
      const { data, error } = await this.supabase
        .from('users')
        .update({
          ...updates,
          updated_at: new Date().toISOString()
        })
        .eq('id', userId)
        .select()
        .single();

      if (error) {
        logger.error('Error updating user profile:', error);
        return null;
      }

      return data;
    } catch (error) {
      logger.error('Error in updateUserProfile:', error);
      return null;
    }
  }

  /**
   * Update user presence
   */
  async updateUserPresence(userId, presenceData) {
    try {
      const { data, error } = await this.supabase
        .from('user_presence')
        .upsert({
          user_id: userId,
          ...presenceData,
          updated_at: new Date().toISOString()
        })
        .select()
        .single();

      if (error) {
        logger.error('Error updating user presence:', error);
        return null;
      }

      return data;
    } catch (error) {
      logger.error('Error in updateUserPresence:', error);
      return null;
    }
  }

  /**
   * Get servers user is a member of
   */
  async getUserServers(userId) {
    try {
      const { data, error } = await this.supabase
        .from('server_members')
        .select(`
          *,
          servers (
            id,
            name,
            description,
            icon_url,
            is_public
          )
        `)
        .eq('user_id', userId);

      if (error) {
        logger.error('Error fetching user servers:', error);
        return [];
      }

      return data.map(member => ({
        ...member.servers,
        role: member.role,
        nickname: member.nickname,
        joined_at: member.joined_at
      }));
    } catch (error) {
      logger.error('Error in getUserServers:', error);
      return [];
    }
  }

  /**
   * Get server members
   */
  async getServerMembers(serverId) {
    try {
      const { data, error } = await this.supabase
        .from('server_members')
        .select(`
          *,
          users (
            id,
            username,
            display_name,
            avatar_url,
            status
          ),
          user_presence (
            status,
            last_seen
          )
        `)
        .eq('server_id', serverId);

      if (error) {
        logger.error('Error fetching server members:', error);
        return [];
      }

      return data.map(member => ({
        id: member.users.id,
        username: member.users.username,
        display_name: member.users.display_name,
        avatar_url: member.users.avatar_url,
        role: member.role,
        nickname: member.nickname,
        status: member.user_presence?.status || member.users.status || 'offline',
        last_seen: member.user_presence?.last_seen,
        joined_at: member.joined_at
      }));
    } catch (error) {
      logger.error('Error in getServerMembers:', error);
      return [];
    }
  }

  /**
   * Get server channels
   */
  async getServerChannels(serverId) {
    try {
      const { data, error } = await this.supabase
        .from('channels')
        .select('*')
        .eq('server_id', serverId)
        .order('position');

      if (error) {
        logger.error('Error fetching server channels:', error);
        return [];
      }

      return data;
    } catch (error) {
      logger.error('Error in getServerChannels:', error);
      return [];
    }
  }

  /**
   * Get recent messages from a channel
   */
  async getChannelMessages(channelId, limit = 50) {
    try {
      const { data, error } = await this.supabase
        .from('messages')
        .select(`
          *,
          users (
            id,
            username,
            display_name,
            avatar_url
          )
        `)
        .eq('channel_id', channelId)
        .order('created_at', { ascending: false })
        .limit(limit);

      if (error) {
        logger.error('Error fetching channel messages:', error);
        return [];
      }

      return data.reverse().map(msg => ({
        id: msg.id,
        content: msg.content,
        author: {
          id: msg.users.id,
          username: msg.users.username,
          display_name: msg.users.display_name,
          avatar_url: msg.users.avatar_url
        },
        created_at: msg.created_at,
        edited_at: msg.edited_at,
        message_type: msg.message_type,
        reply_to_id: msg.reply_to_id
      }));
    } catch (error) {
      logger.error('Error in getChannelMessages:', error);
      return [];
    }
  }

  /**
   * Save a message to a channel
   */
  async saveMessage(channelId, serverId, authorId, content, messageType = 'text') {
    try {
      const { data, error } = await this.supabase
        .from('messages')
        .insert({
          channel_id: channelId,
          server_id: serverId,
          author_id: authorId,
          content,
          message_type: messageType
        })
        .select(`
          *,
          users (
            id,
            username,
            display_name,
            avatar_url
          )
        `)
        .single();

      if (error) {
        logger.error('Error saving message:', error);
        return null;
      }

      return {
        id: data.id,
        content: data.content,
        author: {
          id: data.users.id,
          username: data.users.username,
          display_name: data.users.display_name,
          avatar_url: data.users.avatar_url
        },
        created_at: data.created_at,
        message_type: data.message_type
      };
    } catch (error) {
      logger.error('Error in saveMessage:', error);
      return null;
    }
  }

  /**
   * Get DM conversations for a user
   */
  async getUserDMConversations(userId) {
    try {
      const { data, error } = await this.supabase
        .from('dm_participants')
        .select(`
          conversation_id,
          dm_conversations (
            id,
            updated_at
          ),
          users!dm_participants_user_id_fkey (
            id,
            username,
            display_name,
            avatar_url,
            status
          )
        `)
        .eq('user_id', userId);

      if (error) {
        logger.error('Error fetching DM conversations:', error);
        return [];
      }

      // Get the other participant for each conversation
      const conversations = [];
      for (const participant of data) {
        const { data: otherParticipants, error: otherError } = await this.supabase
          .from('dm_participants')
          .select(`
            users (
              id,
              username,
              display_name,
              avatar_url,
              status
            )
          `)
          .eq('conversation_id', participant.conversation_id)
          .neq('user_id', userId);

        if (!otherError && otherParticipants.length > 0) {
          conversations.push({
            id: participant.conversation_id,
            other_user: otherParticipants[0].users,
            updated_at: participant.dm_conversations.updated_at
          });
        }
      }

      return conversations;
    } catch (error) {
      logger.error('Error in getUserDMConversations:', error);
      return [];
    }
  }

  /**
   * Get DM messages
   */
  async getDMMessages(conversationId, limit = 50) {
    try {
      const { data, error } = await this.supabase
        .from('dm_messages')
        .select(`
          *,
          users (
            id,
            username,
            display_name,
            avatar_url
          )
        `)
        .eq('conversation_id', conversationId)
        .order('created_at', { ascending: false })
        .limit(limit);

      if (error) {
        logger.error('Error fetching DM messages:', error);
        return [];
      }

      return data.reverse().map(msg => ({
        id: msg.id,
        content: msg.content,
        author: {
          id: msg.users.id,
          username: msg.users.username,
          display_name: msg.users.display_name,
          avatar_url: msg.users.avatar_url
        },
        created_at: msg.created_at,
        edited_at: msg.edited_at,
        message_type: msg.message_type
      }));
    } catch (error) {
      logger.error('Error in getDMMessages:', error);
      return [];
    }
  }

  /**
   * Save DM message
   */
  async saveDMMessage(conversationId, authorId, content) {
    try {
      const { data, error } = await this.supabase
        .from('dm_messages')
        .insert({
          conversation_id: conversationId,
          author_id: authorId,
          content
        })
        .select(`
          *,
          users (
            id,
            username,
            display_name,
            avatar_url
          )
        `)
        .single();

      if (error) {
        logger.error('Error saving DM message:', error);
        return null;
      }

      // Update conversation timestamp
      await this.supabase
        .from('dm_conversations')
        .update({ updated_at: new Date().toISOString() })
        .eq('id', conversationId);

      return {
        id: data.id,
        content: data.content,
        author: {
          id: data.users.id,
          username: data.users.username,
          display_name: data.users.display_name,
          avatar_url: data.users.avatar_url
        },
        created_at: data.created_at,
        message_type: data.message_type
      };
    } catch (error) {
      logger.error('Error in saveDMMessage:', error);
      return null;
    }
  }

  /**
   * Join voice session
   */
  async joinVoiceSession(userId, channelId, serverId, conversationId = null) {
    try {
      // First, leave any existing voice session
      await this.leaveVoiceSession(userId);

      const { data, error } = await this.supabase
        .from('voice_sessions')
        .insert({
          user_id: userId,
          channel_id: channelId,
          server_id: serverId,
          conversation_id: conversationId
        })
        .select()
        .single();

      if (error) {
        logger.error('Error joining voice session:', error);
        return null;
      }

      return data;
    } catch (error) {
      logger.error('Error in joinVoiceSession:', error);
      return null;
    }
  }

  /**
   * Leave voice session
   */
  async leaveVoiceSession(userId) {
    try {
      const { error } = await this.supabase
        .from('voice_sessions')
        .delete()
        .eq('user_id', userId);

      if (error) {
        logger.error('Error leaving voice session:', error);
        return false;
      }

      return true;
    } catch (error) {
      logger.error('Error in leaveVoiceSession:', error);
      return false;
    }
  }

  /**
   * Update voice session state
   */
  async updateVoiceSession(userId, updates) {
    try {
      const { data, error } = await this.supabase
        .from('voice_sessions')
        .update(updates)
        .eq('user_id', userId)
        .select()
        .single();

      if (error) {
        logger.error('Error updating voice session:', error);
        return null;
      }

      return data;
    } catch (error) {
      logger.error('Error in updateVoiceSession:', error);
      return null;
    }
  }

  /**
   * Get voice sessions for a channel
   */
  async getVoiceSessions(channelId, conversationId = null) {
    try {
      let query = this.supabase
        .from('voice_sessions')
        .select(`
          *,
          users (
            id,
            username,
            display_name,
            avatar_url
          )
        `);

      if (channelId) {
        query = query.eq('channel_id', channelId);
      } else if (conversationId) {
        query = query.eq('conversation_id', conversationId);
      }

      const { data, error } = await query;

      if (error) {
        logger.error('Error fetching voice sessions:', error);
        return [];
      }

      return data.map(session => ({
        id: session.id,
        user: {
          id: session.users.id,
          username: session.users.username,
          display_name: session.users.display_name,
          avatar_url: session.users.avatar_url
        },
        is_muted: session.is_muted,
        is_deafened: session.is_deafened,
        is_speaking: session.is_speaking,
        joined_at: session.joined_at
      }));
    } catch (error) {
      logger.error('Error in getVoiceSessions:', error);
      return [];
    }
  }

  /**
   * Get online users
   */
  async getOnlineUsers() {
    try {
      const { data, error } = await this.supabase
        .from('user_presence')
        .select(`
          *,
          users (
            id,
            username,
            display_name,
            avatar_url
          )
        `)
        .neq('status', 'offline')
        .gte('last_seen', new Date(Date.now() - 5 * 60 * 1000).toISOString()); // Active in last 5 minutes

      if (error) {
        logger.error('Error fetching online users:', error);
        return [];
      }

      return data.map(presence => ({
        id: presence.users.id,
        username: presence.users.username,
        display_name: presence.users.display_name,
        avatar_url: presence.users.avatar_url,
        status: presence.status,
        current_server_id: presence.current_server_id,
        current_channel_id: presence.current_channel_id,
        socket_id: presence.socket_id,
        last_seen: presence.last_seen
      }));
    } catch (error) {
      logger.error('Error in getOnlineUsers:', error);
      return [];
    }
  }

  /**
   * Clean up offline users (call periodically)
   */
  async cleanupOfflineUsers() {
    try {
      const fiveMinutesAgo = new Date(Date.now() - 5 * 60 * 1000).toISOString();
      
      const { error } = await this.supabase
        .from('user_presence')
        .update({ status: 'offline', socket_id: null })
        .lt('last_seen', fiveMinutesAgo)
        .neq('status', 'offline');

      if (error) {
        logger.error('Error cleaning up offline users:', error);
      }
    } catch (error) {
      logger.error('Error in cleanupOfflineUsers:', error);
    }
  }
}

module.exports = SupabaseService;
