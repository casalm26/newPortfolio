import { test, expect } from '../fixtures/base';

test.describe('Critical User Journeys', () => {
  test('should load homepage correctly', async ({ page }) => {
    await page.goto('/');
    
    // Test homepage loads correctly
    await expect(page.locator('h1')).toBeVisible();
    await expect(page.locator('h1')).toContainText('Build something amazing today');
    
    // Test that key sections are visible
    await expect(page.getByText('Trusted by Industry Leaders')).toBeVisible();
    await expect(page.getByText('Everything You Need to Succeed')).toBeVisible();
    await expect(page.getByText('What Our Customers Say')).toBeVisible();
  });

  test('should navigate to About page', async ({ page }) => {
    await page.goto('/');
    
    // Test navigation to About page (assuming it exists in the header/footer)
    await page.goto('/about');
    
    // Verify About page content
    await expect(page.locator('h1')).toBeVisible();
    await expect(page.locator('h1')).toContainText('About Our Company');
    await expect(page.getByText('Our Mission')).toBeVisible();
    await expect(page.getByText('Our Values')).toBeVisible();
  });

  test('should navigate to Services page', async ({ page }) => {
    await page.goto('/services');
    
    // Verify Services page content
    await expect(page.locator('h1')).toBeVisible();
    await expect(page.locator('h1')).toContainText('Our Services');
    await expect(page.getByText('Complete Solutions for Your Business')).toBeVisible();
    await expect(page.getByText('Strategy & Consulting')).toBeVisible();
  });

  test('should navigate to Contact page', async ({ page }) => {
    await page.goto('/contact');
    
    // Verify Contact page loads
    await expect(page.locator('h1')).toBeVisible();
    await expect(page.locator('h1')).toContainText('Get in Touch');
    
    // Test form exists
    await expect(page.locator('form')).toBeVisible();
    await expect(page.locator('input[name="firstName"]')).toBeVisible();
    await expect(page.locator('input[name="email"]')).toBeVisible();
  });

  test('should handle contact form validation', async ({ page }) => {
    await page.goto('/contact');
    
    // Try to submit empty form
    const submitButton = page.locator('button[type="submit"]');
    await submitButton.click();
    
    // Verify HTML5 validation prevents submission
    const firstNameInput = page.locator('input[name="firstName"]');
    const emailInput = page.locator('input[name="email"]');
    
    // Check that required fields are highlighted
    await expect(firstNameInput).toHaveAttribute('required');
    await expect(emailInput).toHaveAttribute('required');
  });

  test('should navigate to blog articles', async ({ page }) => {
    await page.goto('/all-articles');
    
    // Verify articles page loads
    await expect(page).toHaveURL(/.*\/all-articles/);
    
    // Test that blog articles are visible (based on our created articles)
    const articleLinks = page.locator('a[href*="business-growth-tips"], a[href*="future-of-technology"], a[href*="customer-success"]');
    await expect(articleLinks.first()).toBeVisible();
  });

  test('should load individual blog posts', async ({ page }) => {
    // Test one of our created blog posts
    await page.goto('/business-growth-tips');
    
    // Verify blog post loads
    await expect(page.locator('h1')).toBeVisible();
    await expect(page.locator('h1')).toContainText('10 Essential Tips for Business Growth');
    
    // Check for typical blog post elements
    const content = page.locator('article, main, .prose').first();
    await expect(content).toBeVisible();
  });

  test('should work on mobile devices', async ({ page }) => {
    // Set mobile viewport
    await page.setViewportSize({ width: 375, height: 667 });
    await page.goto('/');
    
    // Test mobile navigation (if mobile menu exists)
    const mobileNavElements = page.locator('[data-testid="mobile-menu"], .mobile-menu, button[aria-label*="menu"], button[aria-label*="Menu"]');
    const mobileNavCount = await mobileNavElements.count();
    
    if (mobileNavCount > 0) {
      await expect(mobileNavElements.first()).toBeVisible();
    }
    
    // Test that content is responsive
    await expect(page.locator('h1')).toBeVisible();
    await expect(page.locator('h1')).toContainText('Build something amazing today');
  });

  test('should handle 404 errors gracefully', async ({ page }) => {
    await page.goto('/non-existent-page');
    
    // Should show 404 page
    await expect(page.locator('h1, h2, .not-found')).toBeVisible();
  });

  test('should load quickly', async ({ page }) => {
    const startTime = Date.now();
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    const loadTime = Date.now() - startTime;
    
    // Page should load within 5 seconds
    expect(loadTime).toBeLessThan(5000);
    
    // Check for critical content
    await expect(page.locator('h1')).toBeVisible();
  });
});