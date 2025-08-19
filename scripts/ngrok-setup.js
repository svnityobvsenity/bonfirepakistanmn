#!/usr/bin/env node

const ngrok = require('ngrok');
const fs = require('fs');
const path = require('path');

// Load environment variables
require('dotenv').config({ path: '.env.local' });

async function startNgrok() {
  const authToken = process.env.NGROK_AUTHTOKEN;
  
  if (!authToken) {
    console.log('⚠️  NGROK_AUTHTOKEN not found in .env.local');
    console.log('📝 Add NGROK_AUTHTOKEN=your_token to .env.local to enable ngrok');
    console.log('🔗 Get your token from: https://dashboard.ngrok.com/get-started/your-authtoken');
    return null;
  }

  try {
    // Set the auth token
    await ngrok.authtoken(authToken);
    
    // Start ngrok tunnel on port 3000
    const url = await ngrok.connect({
      addr: 3000,
      region: 'us' // You can change this to 'eu', 'au', 'ap', 'sa', 'jp', 'in'
    });
    
    console.log('\n🚀 Ngrok tunnel started successfully!');
    console.log('🌐 Public URL:', url);
    console.log('📤 Share this URL with your friends to test the app');
    console.log('🔒 Tunnel will stay active as long as the server is running\n');
    
    return url;
  } catch (error) {
    console.error('❌ Failed to start ngrok:', error.message);
    console.log('💡 Make sure your NGROK_AUTHTOKEN is valid');
    return null;
  }
}

// Handle process termination to close ngrok
process.on('SIGINT', async () => {
  console.log('\n🛑 Shutting down ngrok tunnel...');
  await ngrok.kill();
  process.exit(0);
});

process.on('SIGTERM', async () => {
  console.log('\n🛑 Shutting down ngrok tunnel...');
  await ngrok.kill();
  process.exit(0);
});

// Export for use in other scripts
module.exports = { startNgrok };

// If this script is run directly
if (require.main === module) {
  startNgrok();
}
