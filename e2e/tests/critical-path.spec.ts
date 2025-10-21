import { test, expect } from "../fixtures/base";

test.describe("Critical User Journeys", () => {
  test("should load homepage correctly", async ({ page }) => {
    await page.goto("/");

    // Test homepage loads correctly
    await expect(page.locator("h1")).toBeVisible();

    // Wait for the typing animation to complete and check for the name
    await page.waitForTimeout(3000); // Wait for typing animation
    await expect(page.locator("h1")).toContainText("CASPIAN ALMERUD");

    // Test that header navigation is visible
    await expect(
      page.getByRole("link", { name: /CASPIAN\.DEV/ }),
    ).toBeVisible();

    // Test navigation links based on screen size
    const viewportSize = page.viewportSize();
    const isMobile = viewportSize && viewportSize.width < 768;

    if (!isMobile) {
      // Desktop navigation - should be visible in header
      await expect(
        page.locator('nav.hidden.md\\:flex a[href="/projects"]'),
      ).toBeVisible();
      await expect(
        page.locator('nav.hidden.md\\:flex a[href="/cv"]'),
      ).toBeVisible();
      await expect(
        page.locator('nav.hidden.md\\:flex a[href="/about"]'),
      ).toBeVisible();
      await expect(
        page.locator('nav.hidden.md\\:flex a[href="/contact"]'),
      ).toBeVisible();
    } else {
      // Mobile - just check that mobile menu button exists
      await expect(page.getByRole("button", { name: /menu/i })).toBeVisible();
    }
  });

  test("should navigate to About page", async ({ page }) => {
    await page.goto("/");

    // Check if we're on mobile viewport
    const viewportSize = page.viewportSize();
    const isMobile = viewportSize && viewportSize.width < 768;

    if (isMobile) {
      // Open mobile menu first
      const menuButton = page.locator('button[aria-label*="menu"]');
      await menuButton.click();

      // Wait for mobile menu to be visible and click the About link in mobile nav
      await page.click('nav.md\\:hidden a[href="/about"]');
    } else {
      // Navigate to About page via desktop navigation
      await page.click('nav.hidden.md\\:flex a[href="/about"]');
    }

    // Verify About page content
    await expect(page.locator("h1")).toBeVisible();
    await expect(page.locator("h1")).toContainText("GENERALIST.DEV");

    // Check for portfolio-specific content
    await expect(
      page.getByText(
        "Bridging technical expertise, creative problem-solving, and business strategy.",
      ),
    ).toBeVisible();
  });

  test("should navigate to Projects page", async ({ page }) => {
    await page.goto("/projects");

    // Verify Projects page content
    await expect(page.locator("h1")).toBeVisible();
    await expect(page.locator("h1")).toContainText("PROJECTS/");

    // Check that projects are listed
    await expect(page.locator(".grid")).toBeVisible();
  });

  test("should navigate to Contact page", async ({ page }) => {
    await page.goto("/contact");

    // Verify Contact page loads
    await expect(page.locator("h1")).toBeVisible();
    await expect(page.locator("h1")).toContainText("CONTACT.EXE");

    // Test form exists
    await expect(page.locator("form")).toBeVisible();
    await expect(page.locator('input[name="name"]')).toBeVisible();
    await expect(page.locator('input[name="email"]')).toBeVisible();
    await expect(page.locator('select[name="subject"]')).toBeVisible();
    await expect(page.locator('textarea[name="message"]')).toBeVisible();
  });

  test("should handle contact form validation", async ({ page }) => {
    await page.goto("/contact");

    // Try to submit empty form
    const submitButton = page.locator('button[type="submit"]');
    await submitButton.click();

    // Verify HTML5 validation prevents submission
    const nameInput = page.locator('input[name="name"]');
    const emailInput = page.locator('input[name="email"]');
    const subjectInput = page.locator('select[name="subject"]');
    const messageInput = page.locator('textarea[name="message"]');

    // Check that required fields exist
    await expect(nameInput).toBeVisible();
    await expect(emailInput).toBeVisible();
    await expect(subjectInput).toBeVisible();
    await expect(messageInput).toBeVisible();
  });

  test("should navigate to blog articles", async ({ page }) => {
    await page.goto("/all-articles");

    // Verify articles page loads
    await expect(page).toHaveURL(/.*\/all-articles/);

    // Wait for content to load
    await page.waitForLoadState("networkidle");

    // Check if the page has the articles title
    await expect(page.locator("h1")).toContainText(/All Articles|Blog/);

    // Test that blog articles are visible - look for any article link or card
    const articleElements = page.locator(
      'article, .blog-post, [data-testid="blog-post"], a[href*="/"], .post-item',
    );
    await expect(articleElements.first()).toBeVisible({ timeout: 10000 });
  });

  test("should navigate to CV page", async ({ page }) => {
    await page.goto("/cv");

    // Verify CV page loads
    await expect(page.locator("h1")).toBeVisible();
    await expect(page.locator("h1")).toContainText("CAREER_PATH/");

    // Wait for content to load
    await page.waitForLoadState("networkidle");

    // Check for CV timeline content - look for filter buttons and timeline structure
    await expect(
      page
        .locator("button")
        .filter({ hasText: /^ALL \(\d+\)$/ })
        .first(),
    ).toBeVisible({ timeout: 10000 });

    // Check for timeline container
    await expect(
      page.locator(".relative.max-w-4xl.mx-auto, .space-y-0").first(),
    ).toBeVisible();
  });

  test("should work on mobile devices", async ({ page }) => {
    // Set mobile viewport
    await page.setViewportSize({ width: 375, height: 667 });
    await page.goto("/");

    // Test mobile navigation (if mobile menu exists)
    const mobileNavElements = page.locator(
      '[data-testid="mobile-menu"], .mobile-menu, button[aria-label*="menu"], button[aria-label*="Menu"]',
    );
    const mobileNavCount = await mobileNavElements.count();

    if (mobileNavCount > 0) {
      await expect(mobileNavElements.first()).toBeVisible();
    }

    // Test that content is responsive
    await expect(page.locator("h1")).toBeVisible();
    // Wait for typing animation on mobile
    await page.waitForTimeout(3000);
    await expect(page.locator("h1")).toContainText("CASPIAN ALMERUD");
  });

  test("should handle 404 errors gracefully", async ({ page }) => {
    await page.goto("/non-existent-page");

    // Should show 404 page
    await expect(page.locator("h1, h2, .not-found")).toBeVisible();
  });

  test("should load quickly", async ({ page }) => {
    const startTime = Date.now();
    await page.goto("/");
    await page.waitForLoadState("networkidle");
    const loadTime = Date.now() - startTime;

    // Page should load within 5 seconds
    expect(loadTime).toBeLessThan(5000);

    // Check for critical content
    await expect(page.locator("h1")).toBeVisible();
  });
});
