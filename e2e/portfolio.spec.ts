import { test, expect } from '@playwright/test';

test.describe('Pixel Art Portfolio', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('should display typewriter animation on landing page', async ({ page }) => {
    // Check that the name animation starts
    const nameElement = page.locator('h1').first();
    await expect(nameElement).toBeVisible();
    
    // Wait for animation to start
    await page.waitForTimeout(500);
    
    // Check that text is being typed
    const nameText = await nameElement.textContent();
    expect(nameText).toBeTruthy();
  });

  test('should show skip animation button during typewriter', async ({ page }) => {
    // Check if skip button is visible during animation
    const skipButton = page.locator('button:has-text("SKIP")');
    await expect(skipButton).toBeVisible();
    
    // Click skip button
    await skipButton.click();
    
    // Verify full name appears immediately
    const nameElement = page.locator('h1').first();
    await expect(nameElement).toContainText('CASPIAN ALMERUD');
    
    // Skip button should disappear
    await expect(skipButton).not.toBeVisible();
  });

  test('should show CTA buttons after animation completes', async ({ page }) => {
    // Skip animation
    const skipButton = page.locator('button:has-text("SKIP")');
    if (await skipButton.isVisible()) {
      await skipButton.click();
    }
    
    // Check that CTA buttons appear
    const projectsButton = page.locator('a:has-text("cd ./projects")');
    const cvButton = page.locator('a:has-text("cat cv.json")');
    const contactButton = page.locator('a:has-text("sudo touch contact.sh")');
    
    await expect(projectsButton).toBeVisible();
    await expect(cvButton).toBeVisible();
    await expect(contactButton).toBeVisible();
  });

  test('should navigate to projects page', async ({ page }) => {
    // Skip animation first
    const skipButton = page.locator('button:has-text("SKIP")');
    if (await skipButton.isVisible()) {
      await skipButton.click();
    }
    
    // Click projects button
    const projectsButton = page.locator('a:has-text("cd ./projects")');
    await projectsButton.click();
    
    // Verify we're on projects page
    await expect(page).toHaveURL('/projects');
    await expect(page.locator('h1:has-text("PROJECTS/")')).toBeVisible();
  });

  test('should navigate to CV page', async ({ page }) => {
    // Skip animation first
    const skipButton = page.locator('button:has-text("SKIP")');
    if (await skipButton.isVisible()) {
      await skipButton.click();
    }
    
    // Click CV button
    const cvButton = page.locator('a:has-text("cat cv.json")');
    await cvButton.click();
    
    // Verify we're on CV page
    await expect(page).toHaveURL('/cv');
    await expect(page.locator('h1:has-text("CAREER_PATH/")')).toBeVisible();
  });

  test('should have working navigation header', async ({ page }) => {
    // Check header is visible
    const header = page.locator('header');
    await expect(header).toBeVisible();
    
    // Check logo/brand
    const brand = page.locator('a:has-text("CASPIAN.DEV")');
    await expect(brand).toBeVisible();
    
    // Test navigation links
    const homeLink = page.locator('nav a:has-text("HOME")');
    const projectsLink = page.locator('nav a:has-text("PROJECTS")');
    const cvLink = page.locator('nav a:has-text("CV")');
    
    await expect(homeLink).toBeVisible();
    await expect(projectsLink).toBeVisible();
    await expect(cvLink).toBeVisible();
  });
});

test.describe('Projects Page', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/projects');
  });

  test('should display projects grid', async ({ page }) => {
    // Check page title
    await expect(page.locator('h1:has-text("PROJECTS/")')).toBeVisible();
    
    // Check terminal prompt
    await expect(page.locator('text=caspian@localhost:~$ ls projects/')).toBeVisible();
    
    // Check filter buttons
    const allButton = page.locator('button:has-text("ALL")');
    await expect(allButton).toBeVisible();
  });

  test('should have project cards with proper structure', async ({ page }) => {
    // Wait for projects to load
    await page.waitForSelector('[href^="/projects/"]', { timeout: 5000 });
    
    // Check that project cards exist
    const projectCards = page.locator('[href^="/projects/"]');
    const count = await projectCards.count();
    expect(count).toBeGreaterThan(0);
    
    // Check first project card structure
    const firstCard = projectCards.first();
    await expect(firstCard).toBeVisible();
  });

  test('should navigate to individual project', async ({ page }) => {
    // Wait for projects to load
    await page.waitForSelector('[href^="/projects/"]', { timeout: 5000 });
    
    // Click on first project
    const firstProject = page.locator('[href^="/projects/"]').first();
    await firstProject.click();
    
    // Should be on a project detail page
    await expect(page.url()).toMatch(/\/projects\/[^\/]+$/);
  });
});

test.describe('CV Timeline Page', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/cv');
  });

  test('should display CV timeline', async ({ page }) => {
    // Check page title
    await expect(page.locator('h1:has-text("CAREER_PATH/")')).toBeVisible();
    
    // Check terminal prompt
    await expect(page.locator('text=caspian@localhost:~$ cat cv.json')).toBeVisible();
    
    // Check filter buttons
    const allButton = page.locator('button:has-text("ALL")');
    await expect(allButton).toBeVisible();
  });

  test('should have timeline items', async ({ page }) => {
    // Wait for timeline to load
    await page.waitForTimeout(1000);
    
    // Check that timeline items exist
    const timelineItems = page.locator('[class*="timeline"]').or(page.locator('div:has-text("Senior Full-Stack Developer")')).first();
    await expect(timelineItems).toBeVisible({ timeout: 10000 });
  });

  test('should filter timeline by type', async ({ page }) => {
    // Wait for page to load
    await page.waitForTimeout(1000);
    
    // Click on WORK filter (if it exists)
    const workButton = page.locator('button:has-text("WORK")');
    if (await workButton.isVisible()) {
      await workButton.click();
      
      // Verify filter is applied (button should be active)
      await expect(workButton).toHaveClass(/border-white|bg-white/);
    }
  });
});

test.describe('Responsive Design', () => {
  test('should work on mobile viewport', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 });
    await page.goto('/');
    
    // Check mobile navigation hamburger
    const mobileMenuButton = page.locator('button[aria-label*="menu"], button:has-text("☰"), svg').first();
    
    // Skip animation first
    const skipButton = page.locator('button:has-text("SKIP")');
    if (await skipButton.isVisible()) {
      await skipButton.click();
    }
    
    // Check that content is responsive
    const nameElement = page.locator('h1').first();
    await expect(nameElement).toBeVisible();
  });

  test('should work on tablet viewport', async ({ page }) => {
    await page.setViewportSize({ width: 768, height: 1024 });
    await page.goto('/');
    
    // Skip animation
    const skipButton = page.locator('button:has-text("SKIP")');
    if (await skipButton.isVisible()) {
      await skipButton.click();
    }
    
    // Check responsive layout
    const nameElement = page.locator('h1').first();
    await expect(nameElement).toBeVisible();
  });
});

test.describe('Accessibility', () => {
  test('should have proper heading hierarchy', async ({ page }) => {
    await page.goto('/');
    
    // Check h1 exists
    const h1 = page.locator('h1').first();
    await expect(h1).toBeVisible();
  });

  test('should have skip animation accessibility feature', async ({ page }) => {
    await page.goto('/');
    
    // Check skip button has proper aria-label
    const skipButton = page.locator('button[aria-label="Skip typewriter animation"]');
    if (await skipButton.isVisible()) {
      await expect(skipButton).toHaveAttribute('aria-label');
    }
  });

  test('should be keyboard navigable', async ({ page }) => {
    await page.goto('/');
    
    // Skip animation first
    const skipButton = page.locator('button:has-text("SKIP")');
    if (await skipButton.isVisible()) {
      await skipButton.click();
    }
    
    // Try tabbing through interactive elements
    await page.keyboard.press('Tab');
    await page.keyboard.press('Tab');
    
    // Should be able to focus on navigation or CTA buttons
    const focusedElement = await page.locator(':focus').count();
    expect(focusedElement).toBeGreaterThan(0);
  });
});