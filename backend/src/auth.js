const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const { v4: uuidv4 } = require('uuid');
const config = require('./config');
const logger = require('./logger');
const SupabaseService = require('./supabase');

/**
 * Authentication service using Supabase
 */

class AuthService {
  constructor() {
    this.supabase = new SupabaseService();
    // Fallback demo users for testing
    this.users = new Map();
    this.initDemoUsers();
  }

  async initDemoUsers() {
    // Create demo users for testing
    const demoUsers = [
      {
        email: 'demo1@example.com',
        password: 'demo123',
        username: 'CoolGamer123',
        displayName: 'Cool Gamer'
      },
      {
        email: 'demo2@example.com',
        password: 'demo123',
        username: 'DevPro456',
        displayName: 'Dev Pro'
      },
      {
        email: 'demo3@example.com',
        password: 'demo123',
        username: 'CreativeArt789',
        displayName: 'Creative Artist'
      }
    ];

    for (const userData of demoUsers) {
      const hashedPassword = await bcrypt.hash(userData.password, 10);
      const userId = uuidv4();
      
      this.users.set(userData.email, {
        id: userId,
        email: userData.email,
        password: hashedPassword,
        username: userData.username,
        displayName: userData.displayName,
        avatarUrl: `https://ui-avatars.com/api/?name=${encodeURIComponent(userData.displayName)}&background=random`,
        createdAt: new Date().toISOString()
      });
    }

    logger.info(`Initialized ${demoUsers.length} demo users`);
  }

  async signUp(email, password, username, displayName) {
    try {
      // Check if user already exists
      if (this.users.has(email)) {
        return { success: false, error: 'Email already registered' };
      }

      // Check if username is taken
      for (const user of this.users.values()) {
        if (user.username === username) {
          return { success: false, error: 'Username already taken' };
        }
      }

      // Create new user
      const hashedPassword = await bcrypt.hash(password, 10);
      const userId = uuidv4();
      
      const newUser = {
        id: userId,
        email,
        password: hashedPassword,
        username,
        displayName: displayName || username,
        avatarUrl: `https://ui-avatars.com/api/?name=${encodeURIComponent(displayName || username)}&background=random`,
        createdAt: new Date().toISOString()
      };

      this.users.set(email, newUser);

      // Generate JWT token
      const token = jwt.sign(
        { 
          userId: newUser.id,
          email: newUser.email,
          username: newUser.username
        },
        config.jwt.secret,
        { expiresIn: '7d' }
      );

      return {
        success: true,
        token,
        user: {
          id: newUser.id,
          email: newUser.email,
          username: newUser.username,
          displayName: newUser.displayName,
          avatarUrl: newUser.avatarUrl
        }
      };
    } catch (error) {
      logger.error('Sign up error:', error);
      return { success: false, error: 'Registration failed' };
    }
  }

  async signIn(email, password) {
    try {
      // Try Supabase first
      const supabaseResult = await this.supabase.signIn(email, password);
      if (supabaseResult.success) {
        return supabaseResult;
      }

      // Fallback to demo users
      const user = this.users.get(email);
      if (!user) {
        return { success: false, error: 'Invalid email or password' };
      }

      const passwordMatch = await bcrypt.compare(password, user.password);
      if (!passwordMatch) {
        return { success: false, error: 'Invalid email or password' };
      }

      // Generate JWT token
      const token = jwt.sign(
        { 
          userId: user.id,
          email: user.email,
          username: user.username
        },
        config.jwt.secret,
        { expiresIn: '7d' }
      );

      return {
        success: true,
        token,
        user: {
          id: user.id,
          email: user.email,
          username: user.username,
          displayName: user.displayName,
          avatarUrl: user.avatarUrl
        }
      };
    } catch (error) {
      logger.error('Sign in error:', error);
      return { success: false, error: 'Login failed' };
    }
  }

  verifyToken(token) {
    try {
      const decoded = jwt.verify(token, config.jwt.secret);
      const user = Array.from(this.users.values()).find(u => u.id === decoded.userId);
      
      if (!user) {
        return null;
      }

      return {
        id: user.id,
        email: user.email,
        username: user.username,
        displayName: user.displayName,
        avatarUrl: user.avatarUrl
      };
    } catch (error) {
      logger.warn('Token verification failed:', error.message);
      return null;
    }
  }

  getUserById(userId) {
    const user = Array.from(this.users.values()).find(u => u.id === userId);
    if (!user) return null;

    return {
      id: user.id,
      email: user.email,
      username: user.username,
      displayName: user.displayName,
      avatarUrl: user.avatarUrl
    };
  }

  getAllUsers() {
    return Array.from(this.users.values()).map(user => ({
      id: user.id,
      username: user.username,
      displayName: user.displayName,
      avatarUrl: user.avatarUrl,
      status: 'offline' // Default status
    }));
  }
}

module.exports = AuthService;
