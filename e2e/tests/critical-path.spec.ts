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
        page.locator('nav.hidden.md\\:flex a[href="/contact"]'),
      ).toBeVisible();
    } else {
      // Mobile - just check that mobile menu button exists
      await expect(page.getByRole("button", { name: /menu/i })).toBeVisible();
    }
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
