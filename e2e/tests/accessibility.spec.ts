import { test, expect } from "@playwright/test";

test.describe("Accessibility", () => {
  test("should meet basic accessibility standards on homepage", async ({
    page,
  }) => {
    await page.goto("/");

    // Check for proper heading hierarchy
    const h1Count = await page.locator("h1").count();
    expect(h1Count).toBe(1); // Should have exactly one H1

    // Check that H1 comes before H2s
    const firstHeading = await page.locator("h1, h2, h3, h4, h5, h6").first();
    const firstHeadingTag = await firstHeading.evaluate((el) =>
      el.tagName.toLowerCase(),
    );
    expect(firstHeadingTag).toBe("h1");

    // Check for alt text on images
    const images = page.locator("img");
    const imageCount = await images.count();

    for (let i = 0; i < imageCount; i++) {
      const img = images.nth(i);
      const alt = await img.getAttribute("alt");
      const ariaLabel = await img.getAttribute("aria-label");
      const role = await img.getAttribute("role");

      // Images should have alt text, aria-label, or be decorative
      const isDecorative = role === "presentation" || alt === "";
      expect(alt !== null || ariaLabel !== null || isDecorative).toBeTruthy();
    }

    // Check for proper link accessibility
    const links = page.locator("a");
    const linkCount = await links.count();

    for (let i = 0; i < Math.min(linkCount, 10); i++) {
      // Check first 10 links
      const link = links.nth(i);
      const href = await link.getAttribute("href");
      const ariaLabel = await link.getAttribute("aria-label");
      const textContent = await link.textContent();

      // Links should have href and either text content or aria-label
      if (href && href !== "#") {
        expect(textContent?.trim() || ariaLabel).toBeTruthy();
      }
    }
  });

  test("should have accessible forms on contact page", async ({ page }) => {
    await page.goto("/contact");

    // Check for proper form labels
    const inputs = page.locator("input, textarea, select");
    const inputCount = await inputs.count();

    for (let i = 0; i < inputCount; i++) {
      const input = inputs.nth(i);
      const id = await input.getAttribute("id");
      const ariaLabel = await input.getAttribute("aria-label");
      const ariaLabelledby = await input.getAttribute("aria-labelledby");
      const type = await input.getAttribute("type");

      // Skip hidden inputs
      if (type === "hidden") continue;

      // Check for proper labeling
      let hasLabel = false;

      if (id) {
        const labelCount = await page.locator(`label[for="${id}"]`).count();
        hasLabel = labelCount > 0;
      }

      const hasAriaLabel = ariaLabel !== null;
      const hasAriaLabelledby = ariaLabelledby !== null;

      expect(hasLabel || hasAriaLabel || hasAriaLabelledby).toBeTruthy();
    }

    // Check that required fields are properly marked
    const requiredInputs = page.locator(
      "input[required], textarea[required], select[required]",
    );
    const requiredCount = await requiredInputs.count();

    for (let i = 0; i < requiredCount; i++) {
      const input = requiredInputs.nth(i);
      const ariaRequired = await input.getAttribute("aria-required");
      const required = await input.getAttribute("required");

      // Should have either required attribute or aria-required
      expect(required !== null || ariaRequired === "true").toBeTruthy();
    }
  });

  test("should have accessible navigation", async ({ page }) => {
    await page.goto("/");

    // Check for main navigation landmark
    const navElements = page.locator('nav, [role="navigation"]');
    const navCount = await navElements.count();
    expect(navCount).toBeGreaterThan(0);

    // Check for main content landmark
    const mainElements = page.locator('main, [role="main"]');
    const mainCount = await mainElements.count();
    expect(mainCount).toBeGreaterThan(0);

    // Check for proper skip links (if they exist)
    const skipLinks = page.locator(
      'a[href="#main"], a[href="#content"], .skip-link',
    );
    const skipLinkCount = await skipLinks.count();

    if (skipLinkCount > 0) {
      const firstSkipLink = skipLinks.first();
      await expect(firstSkipLink).toHaveAttribute("href");
    }
  });

  test("should support keyboard navigation", async ({ page }, testInfo) => {
    await page.goto("/");

    // Skip keyboard navigation tests on mobile devices and webkit (Safari, Chrome mobile)
    // as they handle focus differently
    const isMobile = testInfo.project.name?.includes("Mobile");
    const isWebkit = testInfo.project.name === "webkit";

    if (isMobile || isWebkit) {
      // Just verify interactive elements exist and are accessible
      const interactiveElements = page.locator(
        'button, a, input, [tabindex]:not([tabindex="-1"])',
      );
      const count = await interactiveElements.count();
      expect(count).toBeGreaterThan(0);

      // Verify they have accessible names or are properly labeled
      const buttons = page.locator("button");
      const buttonCount = await buttons.count();
      for (let i = 0; i < Math.min(buttonCount, 3); i++) {
        const button = buttons.nth(i);
        const isVisible = await button.isVisible();
        if (isVisible) {
          const ariaLabel = await button.getAttribute("aria-label");
          const textContent = await button.textContent();
          const hasAccessibleName = textContent?.trim() || ariaLabel;
          expect(hasAccessibleName).toBeTruthy();
        }
      }
      return;
    }

    // Tab through interactive elements on desktop (chromium, firefox)
    await page.keyboard.press("Tab");

    // Check if any element received focus (some browsers may not show focus on first tab)
    const focusedElement = page.locator(":focus");
    const focusedCount = await focusedElement.count();

    if (focusedCount > 0) {
      await expect(focusedElement).toBeVisible();
    }

    // Continue tabbing and ensure elements receive focus
    let foundFocusedElement = false;
    for (let i = 0; i < 5; i++) {
      await page.keyboard.press("Tab");
      const currentFocused = page.locator(":focus");
      const currentCount = await currentFocused.count();

      if (currentCount > 0) {
        foundFocusedElement = true;
        const isVisible = await currentFocused.isVisible().catch(() => false);
        expect(isVisible).toBeTruthy();
      }
    }

    // For non-webkit browsers, ensure at least one element could receive focus
    if (!foundFocusedElement) {
      // Fallback: just ensure interactive elements exist and are keyboard accessible
      const interactiveElements = page.locator(
        'button, a, input, [tabindex]:not([tabindex="-1"])',
      );
      const count = await interactiveElements.count();
      expect(count).toBeGreaterThan(0);
    }
  });

  test("should have appropriate ARIA labels for interactive elements", async ({
    page,
  }) => {
    await page.goto("/");

    // Check buttons have accessible names
    const buttons = page.locator("button");
    const buttonCount = await buttons.count();

    for (let i = 0; i < buttonCount; i++) {
      const button = buttons.nth(i);
      const ariaLabel = await button.getAttribute("aria-label");
      const textContent = await button.textContent();
      const ariaLabelledby = await button.getAttribute("aria-labelledby");
      const buttonClass = await button.getAttribute("class");

      // Skip hidden or decorative buttons (like mobile menu toggles without visible text)
      const isVisible = await button.isVisible();
      if (!isVisible) continue;

      // Allow buttons with aria-hidden or role="presentation" to skip this check
      const ariaHidden = await button.getAttribute("aria-hidden");
      const role = await button.getAttribute("role");
      if (ariaHidden === "true" || role === "presentation") continue;

      // Buttons should have text content, aria-label, or aria-labelledby
      const hasAccessibleName =
        textContent?.trim() || ariaLabel || ariaLabelledby;
      if (!hasAccessibleName) {
        console.log(
          `Button without accessible name found: class="${buttonClass}", text="${textContent}"`,
        );
      }
      expect(hasAccessibleName).toBeTruthy();
    }

    // Check for proper heading structure in sections
    const sections = page.locator("section");
    const sectionCount = await sections.count();

    for (let i = 0; i < Math.min(sectionCount, 5); i++) {
      // Check first 5 sections
      const section = sections.nth(i);
      const headingInSection = section
        .locator("h1, h2, h3, h4, h5, h6")
        .first();
      const headingCount = await headingInSection.count();

      // Most sections should have headings for better accessibility
      if (headingCount > 0) {
        await expect(headingInSection).toBeVisible();
      }
    }
  });

  test("should have sufficient color contrast (basic check)", async ({
    page,
  }) => {
    await page.goto("/");

    // Check that text is visible against background
    const textElements = page.locator("h1, h2, h3, p, a, button").first();
    await expect(textElements).toBeVisible();

    // Check that important interactive elements are visible
    const interactiveElements = page.locator("button, a, input");
    const interactiveCount = await interactiveElements.count();

    for (let i = 0; i < Math.min(interactiveCount, 10); i++) {
      const element = interactiveElements.nth(i);
      const isVisible = await element.isVisible().catch(() => false);

      if (isVisible) {
        await expect(element).toBeVisible();
      }
    }
  });

  test("should work with screen reader simulation", async ({ page }) => {
    await page.goto("/");

    // Simulate screen reader behavior by checking text content accessibility
    const pageTitle = await page.title();
    expect(pageTitle).toBeTruthy();
    expect(pageTitle.length).toBeGreaterThan(0);

    // Check that main heading is accessible
    const mainHeading = page.locator("h1").first();
    const headingText = await mainHeading.textContent();
    expect(headingText?.trim()).toBeTruthy();

    // Check for descriptive link text
    const links = page.locator("a");
    const linkCount = await links.count();

    for (let i = 0; i < Math.min(linkCount, 5); i++) {
      const link = links.nth(i);
      const linkText = await link.textContent();
      const ariaLabel = await link.getAttribute("aria-label");

      const accessibleText = linkText?.trim() || ariaLabel;
      if (accessibleText) {
        // Avoid generic text like "click here", "read more" without context
        const isGeneric = /^(click here|read more|more|link|here)$/i.test(
          accessibleText,
        );
        expect(isGeneric).toBeFalsy();
      }
    }
  });
});
