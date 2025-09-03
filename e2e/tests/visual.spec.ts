import { test, expect } from '@playwright/test';

test.describe('Visual Regression', () => {
  test('should match homepage screenshot', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    
    // Wait for any animations to complete
    await page.waitForTimeout(1000);
    
    // Hide dynamic content that might change between test runs
    await page.addStyleTag({
      content: `
        /* Hide potentially dynamic content for consistent screenshots */
        [data-testid="timestamp"], 
        .timestamp, 
        .current-time,
        .live-data {
          visibility: hidden !important;
        }
      `
    });
    
    // Take screenshot and compare with baseline
    // Note: This will fail on the first run - that's expected!
    // Run with --update-snapshots to create initial baselines
    await expect(page).toHaveScreenshot('homepage-desktop.png', {
      fullPage: true,
      animations: 'disabled',
    });
  });

  test('should match mobile homepage screenshot', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 }); // iPhone SE size
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(1000);
    
    // Hide dynamic content
    await page.addStyleTag({
      content: `
        [data-testid="timestamp"], 
        .timestamp, 
        .current-time,
        .live-data {
          visibility: hidden !important;
        }
      `
    });
    
    await expect(page).toHaveScreenshot('homepage-mobile.png', {
      fullPage: true,
      animations: 'disabled',
    });
  });

  test('should match tablet homepage screenshot', async ({ page }) => {
    await page.setViewportSize({ width: 768, height: 1024 }); // iPad size
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(1000);
    
    await page.addStyleTag({
      content: `
        [data-testid="timestamp"], 
        .timestamp, 
        .current-time,
        .live-data {
          visibility: hidden !important;
        }
      `
    });
    
    await expect(page).toHaveScreenshot('homepage-tablet.png', {
      fullPage: true,
      animations: 'disabled',
    });
  });

  test('should match about page screenshot', async ({ page }) => {
    await page.goto('/about');
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(1000);
    
    await expect(page).toHaveScreenshot('about-page.png', {
      fullPage: true,
      animations: 'disabled',
    });
  });

  test('should match services page screenshot', async ({ page }) => {
    await page.goto('/services');
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(1000);
    
    await expect(page).toHaveScreenshot('services-page.png', {
      fullPage: true,
      animations: 'disabled',
    });
  });

  test('should match contact form states', async ({ page }) => {
    await page.goto('/contact');
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(1000);
    
    // Normal state
    const formContainer = page.locator('form').first();
    await expect(formContainer).toHaveScreenshot('contact-form-normal.png', {
      animations: 'disabled',
    });
    
    // Focus state on first input
    const firstInput = page.locator('input').first();
    await firstInput.focus();
    await expect(formContainer).toHaveScreenshot('contact-form-focused.png', {
      animations: 'disabled',
    });
    
    // Filled state
    await page.fill('input[name="firstName"]', 'John');
    await page.fill('input[name="lastName"]', 'Doe');
    await page.fill('input[name="email"]', 'john@example.com');
    await page.fill('textarea[name="message"]', 'This is a test message');
    
    await expect(formContainer).toHaveScreenshot('contact-form-filled.png', {
      animations: 'disabled',
    });
  });

  test('should match blog list page', async ({ page }) => {
    await page.goto('/all-articles');
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(1000);
    
    await expect(page).toHaveScreenshot('blog-list-page.png', {
      fullPage: true,
      animations: 'disabled',
    });
  });

  test('should match individual blog post', async ({ page }) => {
    await page.goto('/business-growth-tips');
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(1000);
    
    // Hide any dynamic elements like reading time if they exist
    await page.addStyleTag({
      content: `
        .reading-time, 
        .publish-date,
        [data-testid="reading-time"] {
          visibility: hidden !important;
        }
      `
    });
    
    await expect(page).toHaveScreenshot('blog-post-page.png', {
      fullPage: true,
      animations: 'disabled',
    });
  });

  test('should match dark theme (if implemented)', async ({ page }) => {
    await page.goto('/');
    
    // Try to enable dark mode if theme switcher exists
    const themeToggle = page.locator('[data-testid="theme-toggle"], .theme-toggle, button[aria-label*="theme"], button[aria-label*="Theme"]');
    const toggleCount = await themeToggle.count();
    
    if (toggleCount > 0) {
      await themeToggle.first().click();
      await page.waitForTimeout(1000); // Wait for theme transition
      
      await expect(page).toHaveScreenshot('homepage-dark-theme.png', {
        fullPage: true,
        animations: 'disabled',
      });
    } else {
      // If no theme toggle, manually set dark mode via class or data attribute
      await page.evaluate(() => {
        document.documentElement.classList.add('dark');
        document.documentElement.setAttribute('data-theme', 'dark');
      });
      
      await page.waitForTimeout(1000);
      
      await expect(page).toHaveScreenshot('homepage-dark-theme-manual.png', {
        fullPage: true,
        animations: 'disabled',
      });
    }
  });

  test('should match hero section component', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    
    // Screenshot just the hero section
    const heroSection = page.locator('h1').first().locator('..').locator('..');
    if (await heroSection.count() > 0) {
      await expect(heroSection).toHaveScreenshot('hero-section.png', {
        animations: 'disabled',
      });
    }
  });

  test('should match footer component', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    
    // Screenshot the footer
    const footer = page.locator('footer');
    const footerCount = await footer.count();
    
    if (footerCount > 0) {
      await expect(footer).toHaveScreenshot('footer-component.png', {
        animations: 'disabled',
      });
    }
  });

  test('should handle hover states', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    
    // Find the first button or link to test hover state
    const interactiveElement = page.locator('button, a').first();
    
    if (await interactiveElement.count() > 0) {
      // Normal state
      await expect(interactiveElement).toHaveScreenshot('element-normal.png');
      
      // Hover state
      await interactiveElement.hover();
      await page.waitForTimeout(300); // Wait for hover transition
      await expect(interactiveElement).toHaveScreenshot('element-hover.png');
    }
  });
});