const express = require('express');
const { createServer } = require('http');
const { Server } = require('socket.io');
const cors = require('cors');
const helmet = require('helmet');
const path = require('path');

const config = require('./config');
const logger = require('./logger');
const ChatSignalingServer = require('./discord-signaling');
const AuthService = require('./auth');

/**
 * Main server entry point
 * Sets up Express server with Socket.IO for real-time communication
 * Serves static frontend files and handles WebRTC signaling
 */

class VoiceChatServer {
  constructor() {
    this.app = express();
    this.server = createServer(this.app);
    this.io = new Server(this.server, {
      cors: {
        origin: config.nodeEnv === 'development' ? '*' : false,
        methods: ['GET', 'POST']
      }
    });
    
    this.auth = new AuthService();
    
    this.setupMiddleware();
    this.setupRoutes();
    this.setupSignaling();
  }

  setupMiddleware() {
    // Security middleware
    this.app.use(helmet({
      contentSecurityPolicy: false // Disable CSP for WebRTC
    }));
    
    // CORS configuration
    this.app.use(cors({
      origin: config.nodeEnv === 'development' ? '*' : false
    }));
    
    // Parse JSON bodies
    this.app.use(express.json({ limit: '1mb' }));
    
    // Parse URL-encoded bodies
    this.app.use(express.urlencoded({ extended: true, limit: '1mb' }));
    
    // Serve static files from the main project directory (where your Discord clone is)
    const frontendPath = path.join(__dirname, '../../');
    this.app.use(express.static(frontendPath));
    
    logger.info(`Serving static files from: ${frontendPath}`);
  }

  setupRoutes() {
    // Health check endpoint
    this.app.get('/api/health', (req, res) => {
      res.json({
        status: 'ok',
        timestamp: new Date().toISOString(),
        uptime: process.uptime(),
        version: require('../package.json').version
      });
    });

    // Server statistics endpoint (for monitoring)
    this.app.get('/api/stats', (req, res) => {
      if (this.signaling) {
        res.json(this.signaling.getStats());
      } else {
        res.status(503).json({ error: 'Signaling server not ready' });
      }
    });

    // Authentication endpoints
    this.app.post('/api/auth/signin', async (req, res) => {
      try {
        const { email, password } = req.body;
        const result = await this.auth.signIn(email, password);
        
        if (result.success) {
          res.json(result);
        } else {
          res.status(400).json({ message: result.error });
        }
      } catch (error) {
        logger.error('Sign in endpoint error:', error);
        res.status(500).json({ message: 'Internal server error' });
      }
    });

    this.app.post('/api/auth/signup', async (req, res) => {
      try {
        const { email, password, username, displayName } = req.body;
        const result = await this.auth.signUp(email, password, username, displayName);
        
        if (result.success) {
          res.json(result);
        } else {
          res.status(400).json({ message: result.error });
        }
      } catch (error) {
        logger.error('Sign up endpoint error:', error);
        res.status(500).json({ message: 'Internal server error' });
      }
    });

    this.app.get('/api/auth/verify', (req, res) => {
      try {
        const token = req.headers.authorization?.replace('Bearer ', '');
        if (!token) {
          return res.status(401).json({ message: 'No token provided' });
        }

        const user = this.auth.verifyToken(token);
        if (!user) {
          return res.status(401).json({ message: 'Invalid token' });
        }

        res.json({ user });
      } catch (error) {
        logger.error('Token verification error:', error);
        res.status(500).json({ message: 'Internal server error' });
      }
    });

    // ICE servers configuration endpoint
    this.app.get('/api/ice-servers', (req, res) => {
      res.json({
        iceServers: config.ice.iceServers
      });
    });

    // Get all users endpoint (for testing)
    this.app.get('/api/users', (req, res) => {
      res.json({
        users: this.auth.getAllUsers()
      });
    });

    // Catch-all route to serve your main page.tsx (Chat app)
    this.app.get('*', (req, res) => {
      res.sendFile(path.join(__dirname, '../../app/page.tsx'));
    });

    // Error handling middleware
    this.app.use((err, req, res, next) => {
      logger.error('Express error:', err);
      res.status(500).json({ error: 'Internal server error' });
    });
  }

  setupSignaling() {
    // Initialize real-time signaling server
    this.signaling = new ChatSignalingServer(this.io);
    logger.info('Chat signaling server initialized');
  }

  start() {
    this.server.listen(config.port, () => {
      logger.info(`🚀 Voice chat server running on port ${config.port}`);
      logger.info(`📁 Frontend served from: http://localhost:${config.port}`);
      logger.info(`🔧 Environment: ${config.nodeEnv}`);
      logger.info(`🌐 ICE servers configured: ${config.ice.iceServers.length}`);
      
      if (config.nodeEnv === 'development') {
        logger.info('🔧 Development mode - CORS enabled for all origins');
        logger.info(`📊 Stats available at: http://localhost:${config.port}/api/stats`);
        logger.info(`❤️  Health check at: http://localhost:${config.port}/api/health`);
      }
    });

    // Graceful shutdown handling
    process.on('SIGTERM', () => {
      logger.info('SIGTERM received, shutting down gracefully');
      this.server.close(() => {
        logger.info('Server closed');
        process.exit(0);
      });
    });

    process.on('SIGINT', () => {
      logger.info('SIGINT received, shutting down gracefully');
      this.server.close(() => {
        logger.info('Server closed');
        process.exit(0);
      });
    });

    // Handle unhandled promise rejections
    process.on('unhandledRejection', (reason, promise) => {
      logger.error('Unhandled Rejection at:', promise, 'reason:', reason);
    });

    // Handle uncaught exceptions
    process.on('uncaughtException', (err) => {
      logger.error('Uncaught Exception:', err);
      process.exit(1);
    });
  }
}

// Start the server
const server = new VoiceChatServer();
server.start();
