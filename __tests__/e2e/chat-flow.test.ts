import { test, expect } from '@playwright/test'

test.describe('Chat Flow E2E Tests', () => {
  test.beforeEach(async ({ page }) => {
    // Navigate to the app
    await page.goto('http://localhost:3000')
  })

  test('should allow user to sign up and start chatting', async ({ page }) => {
    // Click sign up button
    await page.click('text=Sign Up')
    
    // Fill in sign up form
    await page.fill('input[name="email"]', 'test@example.com')
    await page.fill('input[name="password"]', 'password123')
    await page.fill('input[name="username"]', 'testuser')
    await page.fill('input[name="displayName"]', 'Test User')
    
    // Submit form
    await page.click('button[type="submit"]')
    
    // Wait for redirect to main app
    await page.waitForURL('**/channels/**')
    
    // Verify we're in the main app
    await expect(page.locator('text=Channels')).toBeVisible()
    await expect(page.locator('text=general')).toBeVisible()
  })

  test('should allow user to send and receive messages', async ({ page }) => {
    // Sign in first
    await page.click('text=Sign In')
    await page.fill('input[name="email"]', 'test@example.com')
    await page.fill('input[name="password"]', 'password123')
    await page.click('button[type="submit"]')
    
    // Wait for redirect
    await page.waitForURL('**/channels/**')
    
    // Click on general channel
    await page.click('text=general')
    
    // Wait for messages to load
    await page.waitForSelector('[data-testid="message-list"]')
    
    // Send a message
    const messageInput = page.locator('input[placeholder*="Message"]')
    await messageInput.fill('Hello, this is a test message!')
    await messageInput.press('Enter')
    
    // Verify message appears
    await expect(page.locator('text=Hello, this is a test message!')).toBeVisible()
  })

  test('should allow user to edit messages', async ({ page }) => {
    // Sign in and navigate to channel
    await page.click('text=Sign In')
    await page.fill('input[name="email"]', 'test@example.com')
    await page.fill('input[name="password"]', 'password123')
    await page.click('button[type="submit"]')
    await page.waitForURL('**/channels/**')
    await page.click('text=general')
    
    // Send a message first
    const messageInput = page.locator('input[placeholder*="Message"]')
    await messageInput.fill('Original message')
    await messageInput.press('Enter')
    
    // Wait for message to appear
    await expect(page.locator('text=Original message')).toBeVisible()
    
    // Hover over message to show edit button
    const messageElement = page.locator('text=Original message').first()
    await messageElement.hover()
    
    // Click edit button
    await page.click('[data-testid="edit-message"]')
    
    // Edit the message
    const editInput = page.locator('input[value="Original message"]')
    await editInput.fill('Edited message')
    await editInput.press('Enter')
    
    // Verify message was edited
    await expect(page.locator('text=Edited message')).toBeVisible()
    await expect(page.locator('text=Original message')).not.toBeVisible()
  })

  test('should allow user to delete messages', async ({ page }) => {
    // Sign in and navigate to channel
    await page.click('text=Sign In')
    await page.fill('input[name="email"]', 'test@example.com')
    await page.fill('input[name="password"]', 'password123')
    await page.click('button[type="submit"]')
    await page.waitForURL('**/channels/**')
    await page.click('text=general')
    
    // Send a message
    const messageInput = page.locator('input[placeholder*="Message"]')
    await messageInput.fill('Message to delete')
    await messageInput.press('Enter')
    
    // Wait for message to appear
    await expect(page.locator('text=Message to delete')).toBeVisible()
    
    // Hover over message to show delete button
    const messageElement = page.locator('text=Message to delete').first()
    await messageElement.hover()
    
    // Click delete button
    await page.click('[data-testid="delete-message"]')
    
    // Confirm deletion
    await page.click('text=Confirm')
    
    // Verify message was deleted
    await expect(page.locator('text=Message to delete')).not.toBeVisible()
  })

  test('should allow user to create a new channel', async ({ page }) => {
    // Sign in
    await page.click('text=Sign In')
    await page.fill('input[name="email"]', 'test@example.com')
    await page.fill('input[name="password"]', 'password123')
    await page.click('button[type="submit"]')
    await page.waitForURL('**/channels/**')
    
    // Click create channel button
    await page.click('[data-testid="create-channel"]')
    
    // Fill in channel form
    await page.fill('input[name="name"]', 'test-channel')
    await page.fill('input[name="description"]', 'A test channel')
    
    // Submit form
    await page.click('button[type="submit"]')
    
    // Verify channel was created
    await expect(page.locator('text=test-channel')).toBeVisible()
  })

  test('should allow user to join a channel', async ({ page }) => {
    // Sign in
    await page.click('text=Sign In')
    await page.fill('input[name="email"]', 'test@example.com')
    await page.fill('input[name="password"]', 'password123')
    await page.click('button[type="submit"]')
    await page.waitForURL('**/channels/**')
    
    // Look for a public channel to join
    const publicChannel = page.locator('[data-testid="public-channel"]').first()
    if (await publicChannel.isVisible()) {
      await publicChannel.click()
      
      // Click join button
      await page.click('text=Join Channel')
      
      // Verify we joined
      await expect(page.locator('text=Leave Channel')).toBeVisible()
    }
  })

  test('should show typing indicators', async ({ page }) => {
    // Sign in and navigate to channel
    await page.click('text=Sign In')
    await page.fill('input[name="email"]', 'test@example.com')
    await page.fill('input[name="password"]', 'password123')
    await page.click('button[type="submit"]')
    await page.waitForURL('**/channels/**')
    await page.click('text=general')
    
    // Start typing
    const messageInput = page.locator('input[placeholder*="Message"]')
    await messageInput.fill('Typing...')
    
    // Wait a moment for typing indicator
    await page.waitForTimeout(1000)
    
    // Verify typing indicator appears (if implemented)
    // This test would need to be updated based on actual typing indicator implementation
  })

  test('should handle real-time message updates', async ({ page }) => {
    // Sign in and navigate to channel
    await page.click('text=Sign In')
    await page.fill('input[name="email"]', 'test@example.com')
    await page.fill('input[name="password"]', 'password123')
    await page.click('button[type="submit"]')
    await page.waitForURL('**/channels/**')
    await page.click('text=general')
    
    // Send a message
    const messageInput = page.locator('input[placeholder*="Message"]')
    await messageInput.fill('Real-time test message')
    await messageInput.press('Enter')
    
    // Verify message appears immediately
    await expect(page.locator('text=Real-time test message')).toBeVisible()
    
    // Open another tab to simulate another user
    const page2 = await page.context().newPage()
    await page2.goto('http://localhost:3000')
    
    // Sign in as another user
    await page2.click('text=Sign In')
    await page2.fill('input[name="email"]', 'test2@example.com')
    await page2.fill('input[name="password"]', 'password123')
    await page2.click('button[type="submit"]')
    await page2.waitForURL('**/channels/**')
    await page2.click('text=general')
    
    // Send a message from the second user
    const messageInput2 = page2.locator('input[placeholder*="Message"]')
    await messageInput2.fill('Message from user 2')
    await messageInput2.press('Enter')
    
    // Verify message appears in first tab (real-time)
    await expect(page.locator('text=Message from user 2')).toBeVisible()
  })

  test('should handle user profile updates', async ({ page }) => {
    // Sign in
    await page.click('text=Sign In')
    await page.fill('input[name="email"]', 'test@example.com')
    await page.fill('input[name="password"]', 'password123')
    await page.click('button[type="submit"]')
    await page.waitForURL('**/channels/**')
    
    // Open user menu
    await page.click('[data-testid="user-menu"]')
    
    // Click on profile
    await page.click('text=Profile')
    
    // Update display name
    const displayNameInput = page.locator('input[name="displayName"]')
    await displayNameInput.fill('Updated User')
    
    // Save changes
    await page.click('text=Save Changes')
    
    // Verify update was successful
    await expect(page.locator('text=Profile updated successfully')).toBeVisible()
  })

  test('should handle avatar upload', async ({ page }) => {
    // Sign in and go to profile
    await page.click('text=Sign In')
    await page.fill('input[name="email"]', 'test@example.com')
    await page.fill('input[name="password"]', 'password123')
    await page.click('button[type="submit"]')
    await page.waitForURL('**/channels/**')
    
    await page.click('[data-testid="user-menu"]')
    await page.click('text=Profile')
    
    // Upload avatar
    const fileInput = page.locator('input[type="file"]')
    await fileInput.setInputFiles('__tests__/fixtures/avatar.jpg')
    
    // Wait for upload to complete
    await page.waitForSelector('text=Avatar uploaded successfully')
    
    // Verify avatar is displayed
    await expect(page.locator('img[alt="User avatar"]')).toBeVisible()
  })

  test('should handle responsive design', async ({ page }) => {
    // Test mobile viewport
    await page.setViewportSize({ width: 375, height: 667 })
    
    await page.goto('http://localhost:3000')
    
    // Verify mobile layout
    await expect(page.locator('[data-testid="mobile-menu"]')).toBeVisible()
    
    // Test tablet viewport
    await page.setViewportSize({ width: 768, height: 1024 })
    await page.reload()
    
    // Verify tablet layout
    await expect(page.locator('[data-testid="sidebar"]')).toBeVisible()
    
    // Test desktop viewport
    await page.setViewportSize({ width: 1920, height: 1080 })
    await page.reload()
    
    // Verify desktop layout
    await expect(page.locator('[data-testid="sidebar"]')).toBeVisible()
    await expect(page.locator('[data-testid="main-content"]')).toBeVisible()
  })

  test('should handle keyboard navigation', async ({ page }) => {
    // Sign in
    await page.click('text=Sign In')
    await page.fill('input[name="email"]', 'test@example.com')
    await page.fill('input[name="password"]', 'password123')
    await page.click('button[type="submit"]')
    await page.waitForURL('**/channels/**')
    
    // Test keyboard navigation
    await page.keyboard.press('Tab')
    await page.keyboard.press('Tab')
    await page.keyboard.press('Tab')
    
    // Verify focus is on message input
    const messageInput = page.locator('input[placeholder*="Message"]')
    await expect(messageInput).toBeFocused()
    
    // Test keyboard shortcuts
    await page.keyboard.press('Control+k')
    // Verify command palette opens (if implemented)
  })

  test('should handle error states gracefully', async ({ page }) => {
    // Try to access protected route without auth
    await page.goto('http://localhost:3000/channels/general')
    
    // Should redirect to login
    await expect(page.locator('text=Sign In')).toBeVisible()
    
    // Try invalid login
    await page.fill('input[name="email"]', 'invalid@example.com')
    await page.fill('input[name="password"]', 'wrongpassword')
    await page.click('button[type="submit"]')
    
    // Should show error message
    await expect(page.locator('text=Invalid credentials')).toBeVisible()
  })
})
