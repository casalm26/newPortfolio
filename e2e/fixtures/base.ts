import { test as base, Page } from '@playwright/test';

// Define fixture types
type TestFixtures = {
  authenticatedPage: Page;
  loadedPage: Page;
};

// Extend base test with custom fixtures
export const test = base.extend<TestFixtures>({
  // Add custom fixtures here
  authenticatedPage: async ({ page }, use) => {
    // Example: automatically log in for tests that need auth
    // This is a placeholder - adapt based on your authentication system
    await page.goto('/');
    // await page.fill('[data-testid="email"]', 'test@example.com');
    // await page.fill('[data-testid="password"]', 'password123');
    // await page.click('[data-testid="login-button"]');
    // await page.waitForURL('/dashboard');
    await use(page);
  },

  // Fixture for pages that need to wait for content to load
  loadedPage: async ({ page }, use) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    await use(page);
  },
});

export { expect } from '@playwright/test';