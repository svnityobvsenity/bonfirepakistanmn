require('dotenv').config();

const config = {
  // Server configuration
  port: process.env.PORT || 3000,
  nodeEnv: process.env.NODE_ENV || 'development',
  
  // Supabase configuration
  supabase: {
    url: process.env.SUPABASE_URL,
    anonKey: process.env.SUPABASE_ANON_KEY,
    serviceRoleKey: process.env.SUPABASE_SERVICE_ROLE_KEY
  },
  
  // JWT configuration
  jwt: {
    secret: process.env.JWT_SECRET || 'your-secret-key-change-in-production'
  },
  
  // WebRTC ICE configuration
  ice: {
    iceServers: []
  },
  
  // Rate limiting configuration
  rateLimiting: {
    windowMs: parseInt(process.env.CHAT_RATE_LIMIT_WINDOW_MS) || 5000, // 5 seconds
    maxRequests: parseInt(process.env.CHAT_RATE_LIMIT_MAX_REQUESTS) || 5 // 5 messages per window
  },
  
  // Logging configuration
  logLevel: process.env.LOG_LEVEL || 'info',
  
  // Message configuration
  maxMessagesPerChannel: 50,
  maxUsernameLength: 30,
  maxMessageLength: 500,
  maxServerNameLength: 100
};

// Configure STUN servers
if (process.env.STUN_SERVERS) {
  const stunServers = process.env.STUN_SERVERS.split(',').map(url => ({ urls: url.trim() }));
  config.ice.iceServers.push(...stunServers);
} else {
  // Default public STUN servers
  config.ice.iceServers.push(
    { urls: 'stun:stun.l.google.com:19302' },
    { urls: 'stun:stun1.l.google.com:19302' }
  );
}

// Configure TURN servers if provided
if (process.env.TURN_URL && process.env.TURN_USERNAME && process.env.TURN_CREDENTIAL) {
  config.ice.iceServers.push({
    urls: process.env.TURN_URL,
    username: process.env.TURN_USERNAME,
    credential: process.env.TURN_CREDENTIAL
  });
}

module.exports = config;
