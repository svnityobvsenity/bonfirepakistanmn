const WebSocket = require('ws');
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const winston = require('winston');
const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

// Configure logging
const logger = winston.createLogger({
  level: 'info',
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.errors({ stack: true }),
    winston.format.json()
  ),
  defaultMeta: { service: 'signaling-server' },
  transports: [
    new winston.transports.File({ filename: 'error.log', level: 'error' }),
    new winston.transports.File({ filename: 'combined.log' }),
    new winston.transports.Console({
      format: winston.format.simple()
    })
  ]
});

// Initialize Supabase client
const supabaseUrl = process.env.SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  logger.error('Missing Supabase environment variables');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);

// Initialize Express app
const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(helmet());
app.use(cors());
app.use(express.json());

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Create HTTP server
const server = app.listen(PORT, () => {
  logger.info(`Signaling server running on port ${PORT}`);
});

// Create WebSocket server
const wss = new WebSocket.Server({ server });

// Store active connections
const rooms = new Map(); // roomId -> Set of WebSocket connections
const connections = new Map(); // WebSocket -> { userId, roomId, userInfo }

// Verify JWT token with Supabase
async function verifyToken(token) {
  try {
    const { data: { user }, error } = await supabase.auth.getUser(token);
    if (error || !user) {
      return null;
    }
    return user;
  } catch (error) {
    logger.error('Token verification error:', error);
    return null;
  }
}

// Get user info from database
async function getUserInfo(userId) {
  try {
    const { data, error } = await supabase
      .from('users')
      .select('id, username, display_name, avatar_url, discriminator')
      .eq('id', userId)
      .single();

    if (error || !data) {
      return null;
    }

    return {
      id: data.id,
      username: data.username,
      displayName: data.display_name,
      avatarUrl: data.avatar_url,
      discriminator: data.discriminator
    };
  } catch (error) {
    logger.error('Get user info error:', error);
    return null;
  }
}

// Broadcast message to all connections in a room except sender
function broadcastToRoom(roomId, message, excludeWs = null) {
  const room = rooms.get(roomId);
  if (!room) return;

  room.forEach(ws => {
    if (ws !== excludeWs && ws.readyState === WebSocket.OPEN) {
      ws.send(JSON.stringify(message));
    }
  });
}

// Handle WebSocket connections
wss.on('connection', async (ws, req) => {
  const url = new URL(req.url, `http://${req.headers.host}`);
  const roomId = url.searchParams.get('room');
  const token = url.searchParams.get('token');

  if (!roomId || !token) {
    logger.warn('Missing room or token parameters');
    ws.close(1008, 'Missing parameters');
    return;
  }

  // Verify token
  const user = await verifyToken(token);
  if (!user) {
    logger.warn('Invalid token');
    ws.close(1008, 'Invalid token');
    return;
  }

  // Get user info
  const userInfo = await getUserInfo(user.id);
  if (!userInfo) {
    logger.warn('User not found in database');
    ws.close(1008, 'User not found');
    return;
  }

  // Store connection info
  connections.set(ws, {
    userId: user.id,
    roomId: roomId,
    userInfo: userInfo
  });

  // Add to room
  if (!rooms.has(roomId)) {
    rooms.set(roomId, new Set());
  }
  rooms.get(roomId).add(ws);

  logger.info(`User ${userInfo.username} joined room ${roomId}`);

  // Notify other users in the room
  broadcastToRoom(roomId, {
    type: 'user-joined',
    userId: user.id,
    userInfo: userInfo
  }, ws);

  // Send current room state to new user
  const room = rooms.get(roomId);
  const otherUsers = Array.from(room)
    .filter(conn => conn !== ws)
    .map(conn => connections.get(conn))
    .filter(conn => conn);

  otherUsers.forEach(conn => {
    ws.send(JSON.stringify({
      type: 'user-joined',
      userId: conn.userId,
      userInfo: conn.userInfo
    }));
  });

  // Handle incoming messages
  ws.on('message', (data) => {
    try {
      const message = JSON.parse(data);
      const connection = connections.get(ws);

      if (!connection) {
        logger.warn('Message from unknown connection');
        return;
      }

      logger.debug(`Message from ${connection.userInfo.username}:`, message.type);

      switch (message.type) {
        case 'offer':
          // Forward offer to target user
          const targetWs = Array.from(rooms.get(roomId) || [])
            .find(conn => connections.get(conn)?.userId === message.targetUserId);
          
          if (targetWs && targetWs.readyState === WebSocket.OPEN) {
            targetWs.send(JSON.stringify({
              type: 'offer',
              userId: connection.userId,
              offer: message.offer
            }));
          }
          break;

        case 'answer':
          // Forward answer to target user
          const answerTargetWs = Array.from(rooms.get(roomId) || [])
            .find(conn => connections.get(conn)?.userId === message.targetUserId);
          
          if (answerTargetWs && answerTargetWs.readyState === WebSocket.OPEN) {
            answerTargetWs.send(JSON.stringify({
              type: 'answer',
              userId: connection.userId,
              answer: message.answer
            }));
          }
          break;

        case 'ice-candidate':
          // Forward ICE candidate to target user
          const iceTargetWs = Array.from(rooms.get(roomId) || [])
            .find(conn => connections.get(conn)?.userId === message.targetUserId);
          
          if (iceTargetWs && iceTargetWs.readyState === WebSocket.OPEN) {
            iceTargetWs.send(JSON.stringify({
              type: 'ice-candidate',
              userId: connection.userId,
              candidate: message.candidate
            }));
          }
          break;

        case 'mute':
        case 'deafen':
        case 'speaking':
          // Broadcast user state changes
          broadcastToRoom(roomId, {
            type: 'user-update',
            userId: connection.userId,
            updates: {
              [message.type === 'mute' ? 'isMuted' : 
               message.type === 'deafen' ? 'isDeafened' : 
               'isSpeaking']: message[message.type === 'mute' ? 'muted' : 
                                      message.type === 'deafen' ? 'deafened' : 
                                      'speaking']
            }
          });
          break;

        default:
          logger.warn(`Unknown message type: ${message.type}`);
      }
    } catch (error) {
      logger.error('Error processing message:', error);
    }
  });

  // Handle connection close
  ws.on('close', () => {
    const connection = connections.get(ws);
    if (!connection) return;

    const { userId, roomId, userInfo } = connection;

    // Remove from room
    const room = rooms.get(roomId);
    if (room) {
      room.delete(ws);
      if (room.size === 0) {
        rooms.delete(roomId);
      }
    }

    // Remove connection
    connections.delete(ws);

    // Notify other users
    broadcastToRoom(roomId, {
      type: 'user-left',
      userId: userId
    });

    logger.info(`User ${userInfo.username} left room ${roomId}`);
  });

  // Handle errors
  ws.on('error', (error) => {
    logger.error('WebSocket error:', error);
  });
});

// Graceful shutdown
process.on('SIGTERM', () => {
  logger.info('SIGTERM received, shutting down gracefully');
  
  // Close all WebSocket connections
  wss.clients.forEach(client => {
    client.close();
  });
  
  // Close server
  server.close(() => {
    logger.info('Server closed');
    process.exit(0);
  });
});

process.on('SIGINT', () => {
  logger.info('SIGINT received, shutting down gracefully');
  
  // Close all WebSocket connections
  wss.clients.forEach(client => {
    client.close();
  });
  
  // Close server
  server.close(() => {
    logger.info('Server closed');
    process.exit(0);
  });
});

// Handle uncaught exceptions
process.on('uncaughtException', (error) => {
  logger.error('Uncaught exception:', error);
  process.exit(1);
});

process.on('unhandledRejection', (reason, promise) => {
  logger.error('Unhandled rejection at:', promise, 'reason:', reason);
  process.exit(1);
});
