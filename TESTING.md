# Testing Guide

This document provides comprehensive information about the testing setup and practices for the Bonfire Discord clone.

## Overview

The project uses a multi-layered testing approach:

- **Unit Tests**: Test individual functions and components in isolation
- **Integration Tests**: Test API routes and component interactions
- **E2E Tests**: Test complete user workflows using Playwright
- **Component Tests**: Test React components with user interactions

## Test Structure

```
__tests__/
├── lib/                    # Unit tests for library functions
│   ├── auth.test.ts       # Authentication library tests
│   ├── messages.test.ts   # Messages library tests
│   └── channels.test.ts   # Channels library tests
├── api/                   # Integration tests for API routes
│   └── messages.test.ts   # Messages API tests
├── components/            # Component tests
│   └── MessageList.test.tsx
├── e2e/                   # End-to-end tests
│   └── chat-flow.test.ts
├── utils/                 # Test utilities
│   └── test-utils.tsx
└── fixtures/              # Test data and files
    └── avatar.jpg
```

## Running Tests

### Unit and Integration Tests (Jest)

```bash
# Run all tests
npm test

# Run tests in watch mode
npm run test:watch

# Run tests with coverage
npm run test:coverage

# Run specific test file
npm test -- MessageList.test.tsx

# Run tests matching a pattern
npm test -- --testNamePattern="should send message"
```

### E2E Tests (Playwright)

```bash
# Run all E2E tests
npm run test:e2e

# Run E2E tests with UI
npm run test:e2e:ui

# Run E2E tests in debug mode
npm run test:e2e:debug

# Run specific E2E test
npx playwright test chat-flow.test.ts

# Run tests in specific browser
npx playwright test --project=chromium
```

### All Tests

```bash
# Run both unit and E2E tests
npm run test:all
```

## Test Configuration

### Jest Configuration (`jest.config.js`)

- Uses Next.js Jest preset
- Configures module path mapping
- Sets up coverage thresholds (80%)
- Configures test environment (jsdom)

### Playwright Configuration (`playwright.config.ts`)

- Tests multiple browsers (Chrome, Firefox, Safari)
- Includes mobile device testing
- Configures screenshots and video recording
- Sets up web server for testing

## Writing Tests

### Unit Tests

Unit tests focus on testing individual functions in isolation:

```typescript
import { sendChannelMessage } from '@/lib/messages'

describe('sendChannelMessage', () => {
  it('should send a message successfully', async () => {
    const result = await sendChannelMessage('channel-1', {
      content: 'Test message'
    })
    
    expect(result.success).toBe(true)
    expect(result.message?.content).toBe('Test message')
  })
})
```

### Component Tests

Component tests use React Testing Library:

```typescript
import { render, screen, fireEvent } from '@testing-library/react'
import MessageList from '@/components/MessageList'

describe('MessageList', () => {
  it('should render messages', () => {
    render(<MessageList channelId="test" />)
    
    expect(screen.getByText('Hello world!')).toBeInTheDocument()
  })
})
```

### E2E Tests

E2E tests simulate real user interactions:

```typescript
import { test, expect } from '@playwright/test'

test('should send a message', async ({ page }) => {
  await page.goto('http://localhost:3000')
  await page.fill('input[name="email"]', 'test@example.com')
  await page.fill('input[name="password"]', 'password123')
  await page.click('button[type="submit"]')
  
  const messageInput = page.locator('input[placeholder*="Message"]')
  await messageInput.fill('Hello world!')
  await messageInput.press('Enter')
  
  await expect(page.locator('text=Hello world!')).toBeVisible()
})
```

## Test Utilities

### Mock Data Factories

Use the test utilities to create consistent mock data:

```typescript
import { createMockUser, createMockMessage } from '@/__tests__/utils/test-utils'

const user = createMockUser({ username: 'testuser' })
const message = createMockMessage({ content: 'Test message' })
```

### Custom Render Function

Use the custom render function for components that need providers:

```typescript
import { render } from '@/__tests__/utils/test-utils'

render(<Component />) // Automatically includes AuthProvider
```

## Mocking

### Supabase Client

The Supabase client is mocked globally in `jest.setup.js`:

```typescript
jest.mock('@/lib/supabaseClient', () => ({
  supabase: {
    auth: { /* mocked auth methods */ },
    from: jest.fn(),
    storage: { /* mocked storage methods */ }
  }
}))
```

### Next.js Router

The Next.js router is mocked for testing:

```typescript
jest.mock('next/navigation', () => ({
  useRouter: () => ({
    push: jest.fn(),
    replace: jest.fn(),
    // ... other router methods
  })
}))
```

## Coverage Requirements

The project maintains 80% code coverage across:

- **Branches**: 80%
- **Functions**: 80%
- **Lines**: 80%
- **Statements**: 80%

## Best Practices

### Test Organization

1. **Arrange-Act-Assert**: Structure tests with clear sections
2. **Descriptive Names**: Use clear, descriptive test names
3. **Single Responsibility**: Each test should test one thing
4. **Isolation**: Tests should not depend on each other

### Test Data

1. **Use Factories**: Create test data using factory functions
2. **Avoid Hardcoded Data**: Use variables for test data
3. **Clean Up**: Clean up test data after each test

### Async Testing

1. **Use async/await**: Prefer async/await over callbacks
2. **Wait for Elements**: Use `waitFor` for async operations
3. **Handle Loading States**: Test loading and error states

### Accessibility Testing

1. **Test with Screen Readers**: Use accessibility queries
2. **Keyboard Navigation**: Test keyboard-only navigation
3. **Focus Management**: Ensure proper focus handling

## Debugging Tests

### Jest Debugging

```bash
# Run tests with debugging
node --inspect-brk node_modules/.bin/jest --runInBand

# Debug specific test
npm test -- --testNamePattern="should send message" --verbose
```

### Playwright Debugging

```bash
# Run tests in debug mode
npm run test:e2e:debug

# Open Playwright Inspector
npx playwright test --debug

# Show test traces
npx playwright show-trace trace.zip
```

## CI/CD Integration

### GitHub Actions

Tests are automatically run on:

- Pull requests
- Push to main branch
- Scheduled runs

### Coverage Reports

Coverage reports are generated and uploaded to:

- Codecov (if configured)
- GitHub Actions artifacts

## Troubleshooting

### Common Issues

1. **Test Environment**: Ensure `jsdom` is properly configured
2. **Module Resolution**: Check path mappings in Jest config
3. **Async Operations**: Use proper async/await patterns
4. **Mocking**: Ensure mocks are properly set up

### Performance

1. **Parallel Execution**: Run tests in parallel when possible
2. **Test Isolation**: Avoid shared state between tests
3. **Mock Heavy Operations**: Mock external API calls and file operations

## Resources

- [Jest Documentation](https://jestjs.io/docs/getting-started)
- [React Testing Library](https://testing-library.com/docs/react-testing-library/intro/)
- [Playwright Documentation](https://playwright.dev/docs/intro)
- [Testing Best Practices](https://kentcdodds.com/blog/common-mistakes-with-react-testing-library)
