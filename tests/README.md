# Comprehensive Playwright Test Suite

A complete end-to-end testing solution for Ojea, covering all major user flows and features.

## 📁 Test Organization

```
tests/
├── helpers/                          # Shared test utilities
│   ├── auth-helpers.ts              # Authentication functions
│   ├── api-helpers.ts               # API mocking and data seeding
│   └── test-data.ts                 # Test fixtures and sample data
├── comprehensive/                    # Comprehensive test suites
│   ├── 01-auth-flows.spec.ts        # Authentication (15 tests)
│   ├── 02-social-features.spec.ts   # Social features (16 tests)
│   ├── 03-messaging.spec.ts         # Messaging (14 tests)
│   ├── 04-media-content.spec.ts     # Media & uploads (17 tests)
│   ├── 05-ai-features.spec.ts       # AI Studio & Colony (14 tests)
│   ├── 06-payments.spec.ts          # Payments & monetization (16 tests)
│   ├── 07-navigation.spec.ts        # Navigation & UX (18 tests)
│   └── 08-accessibility.spec.ts     # Accessibility (19 tests)
├── vital-signs/
│   └── vital-signs.spec.ts          # Basic health checks (5 tests)
└── emergency-recovery.spec.ts        # Emergency recovery (2 tests)
```

**Total:** ~131 tests across all suites

## 🚀 Running Tests

### Prerequisites

1. **Start the development server:**
   ```bash
   npm run dev
   ```
   The server must be running on `http://localhost:5000`

2. **In a new terminal, run tests:**

### Run All Tests
```bash
# Run everything (vital signs + emergency + comprehensive)
npm run test:e2e

# Run only comprehensive suite
npm run test:comprehensive
```

### Run Individual Test Suites
```bash
# Authentication flows
npm run test:auth

# Social features (feed, likes, profiles)
npm run test:social

# Messaging system
npm run test:messaging

# Media and content
npm run test:media

# AI features (AI Studio, Colony OS, Bee)
npm run test:ai

# Payments (Stripe, gifts, revenue)
npm run test:payments

# Navigation and UX
npm run test:navigation

# Accessibility (WCAG compliance)
npm run test:accessibility

# Quick vital signs check
npm run test:vitals
```

### Interactive Mode
```bash
# Run tests with UI (great for debugging)
npm run test:e2e:ui
```

### View Test Reports
```bash
# After running tests, view HTML report
npm run test:report
```

## 📊 Test Coverage

### 🔐 Authentication (01-auth-flows.spec.ts)
- Guest mode entry and navigation
- User signup with validation
- Login flows (email/password, OAuth)
- Session persistence
- Logout functionality
- Password reset
- Protected route access
- Admin privilege checks

### 👥 Social Features (02-social-features.spec.ts)
- Feed loading and infinite scroll
- Post viewing and interaction
- Like/unlike functionality
- Profile pages
- Follow/unfollow
- Search and discovery
- Hashtag navigation
- LaOjea video player
- Notifications

### 💬 Messaging (03-messaging.spec.ts)
- Conversation list
- Message threads
- Real-time message delivery
- Typing indicators
- Unread badges
- Message sending
- Responsive layout

### 📹 Media & Content (04-media-content.spec.ts)
- Video player controls
- Upload interface
- LaOjea swipe navigation
- Image display
- Video metadata
- Error handling for broken media
- Studio/creator tools

### 🤖 AI Features (05-ai-features.spec.ts)
- AI Studio interface
- Image generation with prompts
- Task monitoring
- Bee chat assistant
- Colony OS integration
- Content publishing
- Error handling

### 💳 Payments (06-payments.spec.ts)
- Premium pricing page
- Stripe checkout integration
- Virtual gifts catalog
- Gift purchasing
- Creator revenue dashboard
- Transaction history
- Payment error handling

### 🧭 Navigation & UX (07-navigation.spec.ts)
- Bottom navigation bar
- Page routing and deep links
- Responsive design (mobile/tablet/desktop)
- Loading states
- Error boundaries
- 404 handling
- Performance metrics

### ♿ Accessibility (08-accessibility.spec.ts)
- Keyboard navigation (Tab, Enter, Escape, Arrows)
- ARIA labels and roles
- Focus management
- Color contrast
- Screen reader compatibility
- Form labels
- Heading hierarchy
- Language attributes

## 🛠️ Helper Utilities

### `auth-helpers.ts`
```typescript
loginAsGuest(page)           // Quick guest mode entry
loginAsUser(page, email, pw) // User login
createTestUser(page, ...)    // Create test account
clearAuth(page)              // Clear auth state
isAuthenticated(page)        // Check auth status
```

### `api-helpers.ts`
```typescript
waitForApi(page, endpoint)      // Wait for API response
mockStripePayment(page)         // Mock payment success
mockWebSocketConnection(page)   // Mock real-time features
waitForFeedToLoad(page)         // Wait for feed posts
mockAIGeneration(page)          // Mock AI responses
```

### `test-data.ts`
```typescript
testUsers                    // Sample user credentials
testPosts                    // Sample post content
testMessages                 // Sample messages
stripeTestCards              // Stripe test cards
testAIPrompts                // AI generation prompts
viewports                    // Device viewports
```

## 📝 Test Writing Guidelines

### 1. Use Helper Functions
```typescript
import { loginAsGuest } from '../helpers/auth-helpers';

test('My test', async ({ page }) => {
  await loginAsGuest(page);
  // Test code here
});
```

### 2. Handle Dynamic Content
```typescript
// Check if element exists before interacting
if (await button.count() > 0) {
  await button.click();
}
```

### 3. Add Appropriate Waits
```typescript
await page.waitForLoadState('networkidle');
await page.waitForTimeout(1000); // For animations
```

### 4. Use Descriptive Test Names
```typescript
test('User can like post and see count increment', ...)
```

### 5. Clean Up After Tests
```typescript
test.beforeEach(async ({ page }) => {
  await clearAuth(page);
});
```

## 🐛 Debugging Failed Tests

### 1. Run in UI Mode
```bash
npm run test:e2e:ui
```

### 2. View Screenshots
Failed tests automatically capture screenshots:
```
test-results/[test-name]/test-failed-1.png
```

### 3. View Videos
Failed tests record video:
```
test-results/[test-name]/video.webm
```

### 4. View Traces
```bash
npx playwright show-trace test-results/[test-name]/trace.zip
```

### 5. Add Debug Logging
```typescript
console.log('Current URL:', page.url());
await page.screenshot({ path: 'debug.png' });
```

## 🚨 Common Issues

### Issue: Dev server not running
**Solution:** Start dev server first
```bash
npm run dev
```

### Issue: Tests timing out
**Solution:** Increase timeout in test
```typescript
test('slow test', async ({ page }) => {
  test.setTimeout(60000); // 60 seconds
  // ...
});
```

### Issue: Element not found
**Solution:** Add waits and check for element existence
```typescript
await page.waitForSelector('[data-testid="element"]');
if (await element.count() > 0) { ... }
```

### Issue: Flaky tests
**Solution:** Add proper waits and avoid hard-coded timeouts
```typescript
// ❌ Bad
await page.waitForTimeout(5000);

// ✅ Good
await page.waitForLoadState('networkidle');
await element.waitFor({ state: 'visible' });
```

## 📈 CI/CD Integration

### Add to GitHub Actions
```yaml
- name: Install Playwright
  run: npx playwright install --with-deps

- name: Run E2E Tests
  run: npm run test:e2e

- name: Upload Test Report
  if: always()
  uses: actions/upload-artifact@v3
  with:
    name: playwright-report
    path: playwright-report/
```

## 🎯 Best Practices

1. **Keep tests independent** - Each test should run standalone
2. **Use test data factories** - Generate unique data for each test
3. **Avoid hard-coded waits** - Use `waitForLoadState`, `waitForSelector`
4. **Handle flaky selectors** - Use data-testid attributes
5. **Test user flows, not implementation** - Test what users do
6. **Keep tests readable** - Use descriptive names and comments
7. **Run tests locally** - Before pushing to CI

## 📚 Additional Resources

- [Playwright Documentation](https://playwright.dev)
- [Best Practices](https://playwright.dev/docs/best-practices)
- [Debugging Tests](https://playwright.dev/docs/debug)
- [Test Generators](https://playwright.dev/docs/codegen)

## 🤝 Contributing

When adding new tests:

1. Add to appropriate test suite file
2. Use existing helpers when possible
3. Add new helpers if needed
4. Update this README if adding new patterns
5. Ensure tests pass locally before committing

## 📞 Support

For questions or issues with tests:
1. Check this README
2. Review existing tests for examples
3. Check Playwright documentation
4. Open an issue in the repository
