#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const readline = require('readline');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

function question(prompt) {
  return new Promise((resolve) => {
    rl.question(prompt, resolve);
  });
}

async function setupSupabase() {
  console.log('🚀 Supabase Setup for Fride Discord App\n');
  
  console.log('📋 Prerequisites:');
  console.log('1. Create a Supabase project at https://supabase.com');
  console.log('2. Get your project URL and API keys from Settings > API\n');
  
  const supabaseUrl = await question('Enter your Supabase Project URL: ');
  const supabaseAnonKey = await question('Enter your Supabase Anon Key: ');
  const supabaseServiceKey = await question('Enter your Supabase Service Role Key: ');
  
  const envContent = `# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=${supabaseUrl}
NEXT_PUBLIC_SUPABASE_ANON_KEY=${supabaseAnonKey}
SUPABASE_SERVICE_ROLE_KEY=${supabaseServiceKey}

# Optional: TURN Server for Voice Chat
# NEXT_PUBLIC_TURN_URL=your_turn_server_url
# NEXT_PUBLIC_TURN_USER=your_turn_username
# NEXT_PUBLIC_TURN_PASS=your_turn_password

# Optional: Signaling Server
NEXT_PUBLIC_SIGNALING_SERVER_URL=ws://localhost:3001
`;

  const envPath = path.join(process.cwd(), '.env.local');
  
  try {
    fs.writeFileSync(envPath, envContent);
    console.log('\n✅ Environment variables saved to .env.local');
    
    console.log('\n📝 Next Steps:');
    console.log('1. Run: npm run dev');
    console.log('2. Visit: http://localhost:3000');
    console.log('3. Create an account and test the app');
    console.log('4. Check SUPABASE_SETUP.md for detailed configuration');
    
  } catch (error) {
    console.error('❌ Error saving .env.local:', error.message);
  }
  
  rl.close();
}

setupSupabase().catch(console.error);
