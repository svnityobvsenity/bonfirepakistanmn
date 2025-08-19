const logger = require('./logger');
const config = require('./config');
const WebRTCManager = require('./webrtc');
const SupabaseService = require('./supabase');

/**
 * Real-time signaling server for voice and text chat
 * Handles servers, DMs, voice channels, and live user presence
 */

class ChatSignalingServer {
  constructor(io) {
    this.io = io;
    this.webrtc = new WebRTCManager();
    this.supabase = new SupabaseService();
    
    // Live connected users (authenticated)
    this.connectedUsers = new Map(); // socketId -> userInfo
    this.usersByUserId = new Map(); // userId -> socketId
    
    // Rate limiting per socket
    this.rateLimits = new Map();
    
    this.setupSocketHandlers();
    this.startPresenceHeartbeat();
    this.startCleanupInterval();
  }

  setupSocketHandlers() {
    this.io.on('connection', (socket) => {
      logger.info(`Client connected: ${socket.id}`);
      
      // Initialize rate limiting for this socket
      this.rateLimits.set(socket.id, {
        messageCount: 0,
        windowStart: Date.now()
      });

      // User authentication and presence
      socket.on('authenticate', (data) => this.handleAuthenticate(socket, data));
      socket.on('update-presence', (data) => this.handleUpdatePresence(socket, data));

      // Server-based chat
      socket.on('join-server', (data) => this.handleJoinServer(socket, data));
      socket.on('leave-server', (data) => this.handleLeaveServer(socket, data));
      socket.on('server-message', (data) => this.handleServerMessage(socket, data));
      socket.on('server-typing', (data) => this.handleServerTyping(socket, data));

      // DM chat
      socket.on('join-dm', (data) => this.handleJoinDM(socket, data));
      socket.on('leave-dm', (data) => this.handleLeaveDM(socket, data));
      socket.on('dm-message', (data) => this.handleDMMessage(socket, data));
      socket.on('dm-typing', (data) => this.handleDMTyping(socket, data));

      // Voice chat for servers
      socket.on('join-server-voice', (data) => this.handleJoinServerVoice(socket, data));
      socket.on('leave-server-voice', (data) => this.handleLeaveServerVoice(socket, data));
      
      // Voice chat for DMs
      socket.on('join-dm-voice', (data) => this.handleJoinDMVoice(socket, data));
      socket.on('leave-dm-voice', (data) => this.handleLeaveDMVoice(socket, data));

      // WebRTC signaling (same for both servers and DMs)
      socket.on('webrtc-offer', (data) => this.handleWebRTCOffer(socket, data));
      socket.on('webrtc-answer', (data) => this.handleWebRTCAnswer(socket, data));
      socket.on('webrtc-ice-candidate', (data) => this.handleWebRTCIceCandidate(socket, data));

      // Voice state updates
      socket.on('voice-state-update', (data) => this.handleVoiceStateUpdate(socket, data));

      // Handle disconnection
      socket.on('disconnect', () => this.handleDisconnect(socket));
    });
  }

  /**
   * Validate and sanitize input data
   */
  validateInput(data, requiredFields) {
    if (!data || typeof data !== 'object') {
      return { valid: false, error: 'Invalid data format' };
    }

    for (const field of requiredFields) {
      if (!data[field] || typeof data[field] !== 'string') {
        return { valid: false, error: `Missing or invalid field: ${field}` };
      }
    }

    // Sanitize strings to prevent XSS
    const sanitized = {};
    for (const [key, value] of Object.entries(data)) {
      if (typeof value === 'string') {
        sanitized[key] = value.replace(/[<>]/g, '').trim();
      } else {
        sanitized[key] = value;
      }
    }

    return { valid: true, data: sanitized };
  }

  /**
   * Check rate limiting for messages
   */
  checkRateLimit(socketId) {
    const now = Date.now();
    const limit = this.rateLimits.get(socketId);
    
    if (!limit) return false;

    if (now - limit.windowStart > config.rateLimiting.windowMs) {
      limit.messageCount = 0;
      limit.windowStart = now;
    }

    if (limit.messageCount >= config.rateLimiting.maxRequests) {
      return false;
    }

    limit.messageCount++;
    return true;
  }

  /**
   * Handle user authentication with JWT token
   */
  async handleAuthenticate(socket, data) {
    const validation = this.validateInput(data, ['token']);
    if (!validation.valid) {
      socket.emit('auth-error', { message: validation.error });
      return;
    }

    const { token } = validation.data;

    // For now, use simple JWT verification (you can switch to full Supabase later)
    const jwt = require('jsonwebtoken');
    let user, userProfile;
    
    try {
      const decoded = jwt.verify(token, config.jwt.secret);
      user = { id: decoded.userId, email: decoded.email };
      
      // Create a basic profile (in production, this would come from Supabase)
      userProfile = {
        id: decoded.userId,
        username: decoded.username,
        display_name: decoded.username,
        avatar_url: `https://ui-avatars.com/api/?name=${encodeURIComponent(decoded.username)}&background=random`
      };
    } catch (error) {
      socket.emit('auth-error', { message: 'Invalid or expired token' });
      return;
    }

    // Check if user is already connected from another socket
    const existingSocketId = this.usersByUserId.get(user.id);
    if (existingSocketId && this.connectedUsers.has(existingSocketId)) {
      // Disconnect the old socket
      const oldSocket = this.io.sockets.sockets.get(existingSocketId);
      if (oldSocket) {
        oldSocket.emit('auth-error', { message: 'Logged in from another device' });
        oldSocket.disconnect();
      }
      this.handleDisconnect({ id: existingSocketId });
    }

    const userInfo = {
      socketId: socket.id,
      userId: user.id,
      username: userProfile.username,
      displayName: userProfile.display_name,
      avatarUrl: userProfile.avatar_url,
      status: 'online',
      currentServerId: null,
      currentChannelId: null,
      currentDMId: null,
      voiceChannelId: null,
      voiceState: {
        muted: false,
        deafened: false,
        speaking: false
      },
      connectedAt: new Date().toISOString()
    };

    this.connectedUsers.set(socket.id, userInfo);
    this.usersByUserId.set(user.id, socket.id);

    // Get user's servers and DMs from Supabase
    const userServers = await this.supabase.getUserServers(user.id);
    const userDMs = await this.supabase.getUserDMs(user.id);

    socket.emit('auth-success', {
      user: {
        id: user.id,
        username: userProfile.username,
        displayName: userProfile.display_name,
        avatarUrl: userProfile.avatar_url
      },
      servers: userServers,
      dms: userDMs,
      iceServers: config.ice.iceServers
    });

    // Broadcast user online to everyone
    socket.broadcast.emit('user-online', {
      userId: user.id,
      username: userProfile.username,
      displayName: userProfile.display_name,
      avatarUrl: userProfile.avatar_url,
      status: 'online'
    });

    logger.info(`User ${userProfile.username} (${user.id}) authenticated with socket ${socket.id}`);
  }

  /**
   * Handle joining a server (like "Dev Community", "Gaming", etc.)
   */
  handleJoinServer(socket, data) {
    const validation = this.validateInput(data, ['serverName']);
    if (!validation.valid) {
      socket.emit('error', { message: validation.error });
      return;
    }

    const { serverName } = validation.data;
    const user = this.connectedUsers.get(socket.id);
    
    if (!user) {
      socket.emit('error', { message: 'Not authenticated' });
      return;
    }

    // Create server chat if it doesn't exist
    if (!this.serverChats.has(serverName)) {
      this.serverChats.set(serverName, {
        users: new Set(),
        messages: [],
        voiceUsers: new Set()
      });
    }

    const serverChat = this.serverChats.get(serverName);
    
    // Leave previous server if any
    if (user.currentServer) {
      this.handleLeaveServer(socket, { serverName: user.currentServer });
    }

    // Join new server
    serverChat.users.add(socket.id);
    user.currentServer = serverName;
    socket.join(`server:${serverName}`);

    // Send server state
    socket.emit('server-joined', {
      serverName,
      users: Array.from(serverChat.users).map(sid => {
        const u = this.connectedUsers.get(sid);
        return u ? {
          socketId: u.socketId,
          username: u.username,
          status: u.status,
          voiceState: u.voiceState
        } : null;
      }).filter(Boolean),
      messages: serverChat.messages.slice(-50),
      voiceUsers: Array.from(serverChat.voiceUsers)
    });

    // Notify others in server
    socket.to(`server:${serverName}`).emit('user-joined-server', {
      socketId: socket.id,
      username: user.username,
      serverName
    });

    logger.info(`User ${user.username} joined server ${serverName}`);
  }

  /**
   * Handle leaving a server
   */
  handleLeaveServer(socket, data) {
    const validation = this.validateInput(data, ['serverName']);
    if (!validation.valid) return;

    const { serverName } = validation.data;
    const user = this.connectedUsers.get(socket.id);
    if (!user) return;

    const serverChat = this.serverChats.get(serverName);
    if (!serverChat) return;

    serverChat.users.delete(socket.id);
    serverChat.voiceUsers.delete(socket.id);
    user.currentServer = null;
    socket.leave(`server:${serverName}`);

    // Notify others
    socket.to(`server:${serverName}`).emit('user-left-server', {
      socketId: socket.id,
      username: user.username,
      serverName
    });

    logger.info(`User ${user.username} left server ${serverName}`);
  }

  /**
   * Handle server message
   */
  handleServerMessage(socket, data) {
    if (!this.checkRateLimit(socket.id)) {
      socket.emit('error', { message: 'Rate limit exceeded' });
      return;
    }

    const validation = this.validateInput(data, ['serverName', 'message']);
    if (!validation.valid) {
      socket.emit('error', { message: validation.error });
      return;
    }

    const { serverName, message } = validation.data;
    const user = this.connectedUsers.get(socket.id);
    
    if (!user || user.currentServer !== serverName) {
      socket.emit('error', { message: 'Not in server' });
      return;
    }

    if (message.length > config.maxMessageLength) {
      socket.emit('error', { message: 'Message too long' });
      return;
    }

    const serverChat = this.serverChats.get(serverName);
    if (!serverChat) return;

    const messageData = {
      id: Date.now() + Math.random(),
      username: user.username,
      socketId: socket.id,
      message,
      timestamp: new Date().toISOString(),
      type: 'server'
    };

    // Store message
    serverChat.messages.push(messageData);
    if (serverChat.messages.length > config.maxMessagesPerRoom) {
      serverChat.messages = serverChat.messages.slice(-config.maxMessagesPerRoom);
    }

    // Broadcast to server
    this.io.to(`server:${serverName}`).emit('server-message', messageData);
    
    logger.info(`Server message from ${user.username} in ${serverName}: ${message.substring(0, 50)}...`);
  }

  /**
   * Handle DM join
   */
  handleJoinDM(socket, data) {
    const validation = this.validateInput(data, ['targetUsername']);
    if (!validation.valid) {
      socket.emit('error', { message: validation.error });
      return;
    }

    const { targetUsername } = validation.data;
    const user = this.connectedUsers.get(socket.id);
    
    if (!user) {
      socket.emit('error', { message: 'Not authenticated' });
      return;
    }

    const targetSocketId = this.usersByName.get(targetUsername);
    if (!targetSocketId) {
      socket.emit('error', { message: 'User not found' });
      return;
    }

    // Create DM ID (sorted usernames for consistency)
    const dmId = [user.username, targetUsername].sort().join(':');
    
    // Create DM chat if it doesn't exist
    if (!this.dmChats.has(dmId)) {
      this.dmChats.set(dmId, {
        users: new Set(),
        messages: [],
        voiceUsers: new Set()
      });
    }

    const dmChat = this.dmChats.get(dmId);
    
    // Join DM
    dmChat.users.add(socket.id);
    user.currentDM = dmId;
    socket.join(`dm:${dmId}`);

    // Send DM state
    socket.emit('dm-joined', {
      dmId,
      targetUsername,
      messages: dmChat.messages.slice(-50),
      voiceUsers: Array.from(dmChat.voiceUsers)
    });

    logger.info(`User ${user.username} joined DM with ${targetUsername}`);
  }

  /**
   * Handle DM message
   */
  handleDMMessage(socket, data) {
    if (!this.checkRateLimit(socket.id)) {
      socket.emit('error', { message: 'Rate limit exceeded' });
      return;
    }

    const validation = this.validateInput(data, ['dmId', 'message']);
    if (!validation.valid) {
      socket.emit('error', { message: validation.error });
      return;
    }

    const { dmId, message } = validation.data;
    const user = this.connectedUsers.get(socket.id);
    
    if (!user || user.currentDM !== dmId) {
      socket.emit('error', { message: 'Not in DM' });
      return;
    }

    if (message.length > config.maxMessageLength) {
      socket.emit('error', { message: 'Message too long' });
      return;
    }

    const dmChat = this.dmChats.get(dmId);
    if (!dmChat) return;

    const messageData = {
      id: Date.now() + Math.random(),
      username: user.username,
      socketId: socket.id,
      message,
      timestamp: new Date().toISOString(),
      type: 'dm'
    };

    // Store message
    dmChat.messages.push(messageData);
    if (dmChat.messages.length > config.maxMessagesPerRoom) {
      dmChat.messages = dmChat.messages.slice(-config.maxMessagesPerRoom);
    }

    // Broadcast to DM participants
    this.io.to(`dm:${dmId}`).emit('dm-message', messageData);
    
    logger.info(`DM message from ${user.username} in ${dmId}: ${message.substring(0, 50)}...`);
  }

  /**
   * Handle joining server voice
   */
  handleJoinServerVoice(socket, data) {
    const validation = this.validateInput(data, ['serverName']);
    if (!validation.valid) {
      socket.emit('error', { message: validation.error });
      return;
    }

    const { serverName } = validation.data;
    const user = this.connectedUsers.get(socket.id);
    
    if (!user || user.currentServer !== serverName) {
      socket.emit('error', { message: 'Not in server' });
      return;
    }

    const serverChat = this.serverChats.get(serverName);
    if (!serverChat) return;

    // Add to voice and get existing participants
    const existingVoiceUsers = Array.from(serverChat.voiceUsers);
    serverChat.voiceUsers.add(socket.id);
    user.voiceChannel = `server:${serverName}`;

    // Send existing voice participants to new joiner
    socket.emit('voice-participants', {
      participants: existingVoiceUsers,
      channel: `server:${serverName}`
    });

    // Notify others about new voice user
    socket.to(`server:${serverName}`).emit('user-joined-voice', {
      socketId: socket.id,
      username: user.username,
      channel: `server:${serverName}`
    });

    logger.info(`User ${user.username} joined voice in server ${serverName}`);
  }

  /**
   * Handle joining DM voice
   */
  handleJoinDMVoice(socket, data) {
    const validation = this.validateInput(data, ['dmId']);
    if (!validation.valid) {
      socket.emit('error', { message: validation.error });
      return;
    }

    const { dmId } = validation.data;
    const user = this.connectedUsers.get(socket.id);
    
    if (!user || user.currentDM !== dmId) {
      socket.emit('error', { message: 'Not in DM' });
      return;
    }

    const dmChat = this.dmChats.get(dmId);
    if (!dmChat) return;

    // Add to voice and get existing participants
    const existingVoiceUsers = Array.from(dmChat.voiceUsers);
    dmChat.voiceUsers.add(socket.id);
    user.voiceChannel = `dm:${dmId}`;

    // Send existing voice participants to new joiner
    socket.emit('voice-participants', {
      participants: existingVoiceUsers,
      channel: `dm:${dmId}`
    });

    // Notify others about new voice user
    socket.to(`dm:${dmId}`).emit('user-joined-voice', {
      socketId: socket.id,
      username: user.username,
      channel: `dm:${dmId}`
    });

    logger.info(`User ${user.username} joined voice in DM ${dmId}`);
  }

  /**
   * Handle WebRTC offer
   */
  handleWebRTCOffer(socket, data) {
    const validation = this.validateInput(data, ['to', 'sdp']);
    if (!validation.valid) return;

    const { to, sdp } = data;
    
    socket.to(to).emit('webrtc-offer', {
      from: socket.id,
      sdp: sdp
    });

    logger.debug(`WebRTC offer forwarded from ${socket.id} to ${to}`);
  }

  /**
   * Handle WebRTC answer
   */
  handleWebRTCAnswer(socket, data) {
    const validation = this.validateInput(data, ['to', 'sdp']);
    if (!validation.valid) return;

    const { to, sdp } = data;
    
    socket.to(to).emit('webrtc-answer', {
      from: socket.id,
      sdp: sdp
    });

    logger.debug(`WebRTC answer forwarded from ${socket.id} to ${to}`);
  }

  /**
   * Handle WebRTC ICE candidate
   */
  handleWebRTCIceCandidate(socket, data) {
    const validation = this.validateInput(data, ['to', 'candidate']);
    if (!validation.valid) return;

    const { to, candidate } = data;
    
    socket.to(to).emit('webrtc-ice-candidate', {
      from: socket.id,
      candidate: candidate
    });

    logger.debug(`ICE candidate forwarded from ${socket.id} to ${to}`);
  }

  /**
   * Handle voice state update (mute/deafen/speaking)
   */
  handleVoiceStateUpdate(socket, data) {
    const user = this.connectedUsers.get(socket.id);
    if (!user) return;

    const { muted, deafened, speaking } = data;
    
    if (typeof muted === 'boolean') user.voiceState.muted = muted;
    if (typeof deafened === 'boolean') user.voiceState.deafened = deafened;
    if (typeof speaking === 'boolean') user.voiceState.speaking = speaking;

    // Broadcast voice state update
    if (user.voiceChannel) {
      const channel = user.voiceChannel.startsWith('server:') ? 
        user.voiceChannel : 
        user.voiceChannel.replace('dm:', 'dm:');
      
      socket.to(channel).emit('voice-state-updated', {
        socketId: socket.id,
        username: user.username,
        voiceState: user.voiceState
      });
    }

    logger.debug(`Voice state updated for ${user.username}: ${JSON.stringify(user.voiceState)}`);
  }

  /**
   * Handle client disconnect
   */
  handleDisconnect(socket) {
    const user = this.connectedUsers.get(socket.id);
    if (!user) return;

    logger.info(`User ${user.username} (${socket.id}) disconnected`);

    // Remove from all data structures
    this.connectedUsers.delete(socket.id);
    this.usersByName.delete(user.username);
    this.rateLimits.delete(socket.id);

    // Leave server if in one
    if (user.currentServer) {
      const serverChat = this.serverChats.get(user.currentServer);
      if (serverChat) {
        serverChat.users.delete(socket.id);
        serverChat.voiceUsers.delete(socket.id);
        socket.to(`server:${user.currentServer}`).emit('user-left-server', {
          socketId: socket.id,
          username: user.username,
          serverName: user.currentServer
        });
      }
    }

    // Leave DM if in one
    if (user.currentDM) {
      const dmChat = this.dmChats.get(user.currentDM);
      if (dmChat) {
        dmChat.users.delete(socket.id);
        dmChat.voiceUsers.delete(socket.id);
        socket.to(`dm:${user.currentDM}`).emit('user-left-dm', {
          socketId: socket.id,
          username: user.username,
          dmId: user.currentDM
        });
      }
    }

    // Notify everyone user is offline
    socket.broadcast.emit('user-offline', {
      socketId: socket.id,
      username: user.username
    });
  }

  /**
   * Start presence heartbeat to keep track of online users
   */
  startPresenceHeartbeat() {
    setInterval(() => {
      const onlineUsers = Array.from(this.connectedUsers.values()).map(user => ({
        socketId: user.socketId,
        username: user.username,
        status: user.status,
        currentServer: user.currentServer,
        currentDM: user.currentDM,
        voiceChannel: user.voiceChannel
      }));

      // Broadcast online users list every 30 seconds
      this.io.emit('online-users-update', onlineUsers);
      
      logger.debug(`Online users: ${onlineUsers.length}`);
    }, 30000);
  }

  /**
   * Get server statistics
   */
  getStats() {
    return {
      connectedUsers: this.connectedUsers.size,
      activeServers: this.serverChats.size,
      activeDMs: this.dmChats.size,
      totalVoiceUsers: Array.from(this.connectedUsers.values())
        .filter(user => user.voiceChannel).length,
      serverDetails: Array.from(this.serverChats.entries()).map(([name, chat]) => ({
        serverName: name,
        userCount: chat.users.size,
        voiceUserCount: chat.voiceUsers.size,
        messageCount: chat.messages.length
      }))
    };
  }
}

module.exports = ChatSignalingServer;
