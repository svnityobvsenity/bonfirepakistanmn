/**
 * Optional Test Data Seeder for Bonfire
 * 
 * This script creates test users, channels, and sample messages for development/testing.
 * DO NOT run this in production!
 * 
 * Usage:
 * 1. Set up your Supabase environment variables
 * 2. Run: npx tsx scripts/seed-test-data.ts
 */

import { createClient } from '@supabase/supabase-js'
import { config } from 'dotenv'

// Load environment variables
config()

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('Missing required environment variables:')
  console.error('- NEXT_PUBLIC_SUPABASE_URL')
  console.error('- SUPABASE_SERVICE_ROLE_KEY')
  process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseServiceKey)

async function seedTestData() {
  console.log('🌱 Starting test data seeding...')

  try {
    // Create test users
    console.log('👥 Creating test users...')
    
    const testUsers = [
      {
        email: 'alice@test.local',
        password: 'test123456',
        username: 'alice',
        display_name: 'Alice Johnson',
        discriminator: '0001'
      },
      {
        email: 'bob@test.local',
        password: 'test123456',
        username: 'bob',
        display_name: 'Bob Smith',
        discriminator: '0001'
      },
      {
        email: 'charlie@test.local',
        password: 'test123456',
        username: 'charlie',
        display_name: 'Charlie Brown',
        discriminator: '0001'
      }
    ]

    const createdUsers = []

    for (const userData of testUsers) {
      // Create auth user
      const { data: authUser, error: authError } = await supabase.auth.admin.createUser({
        email: userData.email,
        password: userData.password,
        email_confirm: true
      })

      if (authError) {
        console.error(`Failed to create auth user ${userData.email}:`, authError)
        continue
      }

      // Create profile
      const { data: profile, error: profileError } = await supabase
        .from('users')
        .insert({
          id: authUser.user.id,
          username: userData.username,
          discriminator: userData.discriminator,
          display_name: userData.display_name,
          status: 'online'
        })
        .select()
        .single()

      if (profileError) {
        console.error(`Failed to create profile for ${userData.email}:`, profileError)
        continue
      }

      // Create presence
      await supabase
        .from('presence')
        .insert({
          user_id: authUser.user.id,
          status: 'online'
        })

      createdUsers.push({ ...authUser.user, profile })
      console.log(`✅ Created user: ${userData.display_name} (${userData.email})`)
    }

    // Create sample channels (if they don't exist)
    console.log('📺 Ensuring sample channels exist...')
    
    const sampleChannels = [
      { name: 'general', type: 'text', description: 'General discussion' },
      { name: 'random', type: 'text', description: 'Random chat' },
      { name: 'announcements', type: 'text', description: 'Important announcements' },
      { name: 'General Voice', type: 'voice', description: 'General voice channel' }
    ]

    for (const channelData of sampleChannels) {
      const { data: existingChannel } = await supabase
        .from('channels')
        .select('id')
        .eq('name', channelData.name)
        .single()

      if (!existingChannel) {
        const { error } = await supabase
          .from('channels')
          .insert(channelData)

        if (error) {
          console.error(`Failed to create channel ${channelData.name}:`, error)
        } else {
          console.log(`✅ Created channel: ${channelData.name}`)
        }
      }
    }

    // Create sample messages
    if (createdUsers.length >= 2) {
      console.log('💬 Creating sample messages...')

      const { data: generalChannel } = await supabase
        .from('channels')
        .select('id')
        .eq('name', 'general')
        .single()

      if (generalChannel) {
        const sampleMessages = [
          {
            channel_id: generalChannel.id,
            user_id: createdUsers[0].id,
            content: 'Welcome to Bonfire! 🔥'
          },
          {
            channel_id: generalChannel.id,
            user_id: createdUsers[1].id,
            content: 'Thanks! This looks awesome 😎'
          },
          {
            channel_id: generalChannel.id,
            user_id: createdUsers[0].id,
            content: 'Feel free to test out all the features - messaging, voice chat, friend requests, and more!'
          }
        ]

        for (const message of sampleMessages) {
          const { error } = await supabase
            .from('messages')
            .insert(message)

          if (error) {
            console.error('Failed to create sample message:', error)
          }
        }

        console.log(`✅ Created ${sampleMessages.length} sample messages`)
      }

      // Create a sample friend request
      console.log('👋 Creating sample friend request...')
      
      if (createdUsers.length >= 3) {
        const { error } = await supabase
          .from('friend_requests')
          .insert({
            from_user: createdUsers[2].id,
            to_user: createdUsers[0].id,
            status: 'pending'
          })

        if (error) {
          console.error('Failed to create sample friend request:', error)
        } else {
          console.log('✅ Created sample friend request')
        }
      }
    }

    console.log('\n🎉 Test data seeding completed successfully!')
    console.log('\nTest accounts created:')
    testUsers.forEach(user => {
      console.log(`  📧 ${user.email} / ${user.password}`)
    })
    
    console.log('\n⚠️  Remember to delete this test data before going to production!')
    console.log('   You can delete users from the Supabase Auth dashboard.')

  } catch (error) {
    console.error('❌ Seeding failed:', error)
    process.exit(1)
  }
}

async function cleanupTestData() {
  console.log('🧹 Cleaning up test data...')

  try {
    // Delete test users
    const testEmails = [
      'alice@test.local',
      'bob@test.local', 
      'charlie@test.local'
    ]

    for (const email of testEmails) {
      const { data: users } = await supabase.auth.admin.listUsers()
      const user = users.users.find(u => u.email === email)
      
      if (user) {
        const { error } = await supabase.auth.admin.deleteUser(user.id)
        if (error) {
          console.error(`Failed to delete user ${email}:`, error)
        } else {
          console.log(`✅ Deleted user: ${email}`)
        }
      }
    }

    console.log('🎉 Test data cleanup completed!')

  } catch (error) {
    console.error('❌ Cleanup failed:', error)
    process.exit(1)
  }
}

// Run based on command line argument
const command = process.argv[2]

if (command === 'cleanup') {
  cleanupTestData()
} else {
  seedTestData()
}

export { seedTestData, cleanupTestData }
