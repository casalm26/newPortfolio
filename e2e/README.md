# E2E Testing Guide

## Running Tests

### Local Development
- `npm run test:e2e` - Run all E2E tests headless
- `npm run test:e2e:headed` - Run with browser visible
- `npm run test:e2e:ui` - Run with Playwright UI
- `npm run test:e2e:debug` - Debug tests step by step
- `npm run test:e2e:report` - View last test results

### Test Categories
- **Critical Path** (`critical-path.spec.ts`): Core user journeys that must always work
- **Accessibility** (`accessibility.spec.ts`): Basic a11y compliance checks  
- **Visual Regression** (`visual.spec.ts`): Screenshot comparisons to catch UI changes

### Writing New Tests
1. Add data-testid attributes to elements you need to test
2. Use the fixtures in `e2e/fixtures/` for common setup
3. Group related tests in describe blocks
4. Test both success and error scenarios

### Best Practices
- Keep tests independent and atomic
- Use meaningful test descriptions
- Test user behavior, not implementation details
- Update visual snapshots when UI changes are intentional

## Visual Regression Testing

### Creating Initial Screenshots
Run this command to create baseline screenshots:
```bash
npm run test:e2e -- --update-snapshots
```

### Updating Screenshots
When you make intentional UI changes:
```bash
npm run test:e2e -- visual.spec.ts --update-snapshots
```

### Screenshot Locations
- Screenshots are stored in `e2e/tests/visual.spec.ts-snapshots/`
- Different browsers/devices create separate screenshot folders
- Screenshots are excluded from git by default

## Accessibility Testing

The accessibility tests check for:
- Proper heading hierarchy (single H1, logical order)
- Image alt text
- Form label associations
- Keyboard navigation
- ARIA labels on interactive elements
- Basic color contrast

## Test Configuration

### Browser Configuration
Tests run on:
- Desktop Chrome, Firefox, Safari
- Mobile Chrome (Pixel 5)
- Mobile Safari (iPhone 12)

### Customizing Test Runs
```bash
# Run specific test file
npm run test:e2e -- critical-path.spec.ts

# Run specific browser
npm run test:e2e -- --project=chromium

# Run with specific viewport
npm run test:e2e -- --config playwright.config.ts
```

## Troubleshooting

### Common Issues
1. **Tests fail on first visual run**: Expected! Run with `--update-snapshots`
2. **Port conflicts**: Make sure dev server uses port 6006 (configured in playwright.config.ts)
3. **Browser not found**: Run `npx playwright install`
4. **Flaky tests**: Add proper waits with `page.waitForLoadState('networkidle')`

### Debug Mode
```bash
npm run test:e2e:debug
```
This opens a browser where you can step through tests interactively.

## CI/CD Integration

For CI environments:
- Tests use headless mode automatically
- Retries are enabled (2x in CI)
- Reports are saved to `test-results/`
- Videos and screenshots saved on failure