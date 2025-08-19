#!/usr/bin/env node

const { spawn } = require('child_process');
const { startNgrok } = require('./ngrok-setup');

async function startDevWithNgrok() {
  console.log('🚀 Starting Fride Discord App with ngrok tunnel...\n');
  
  // Start ngrok tunnel
  const ngrokUrl = await startNgrok();
  
  // Start Next.js development server
  const nextProcess = spawn('npm', ['run', 'dev'], {
    stdio: 'inherit',
    shell: true
  });
  
  // Handle Next.js process events
  nextProcess.on('error', (error) => {
    console.error('❌ Failed to start Next.js server:', error);
  });
  
  nextProcess.on('close', (code) => {
    console.log(`\n🛑 Next.js server stopped with code ${code}`);
    process.exit(code);
  });
  
  // Handle process termination
  process.on('SIGINT', () => {
    console.log('\n🛑 Shutting down development server and ngrok...');
    nextProcess.kill('SIGINT');
  });
  
  process.on('SIGTERM', () => {
    console.log('\n🛑 Shutting down development server and ngrok...');
    nextProcess.kill('SIGTERM');
  });
}

startDevWithNgrok().catch(console.error);
