# Repository Cleanup Analysis

**Generated:** 2025-01-21  
**Objective:** Identify unnecessary files and folders to significantly reduce repository size and complexity

## Executive Summary

This repository is currently bloated with business boilerplate content and excessive testing infrastructure that's inappropriate for a personal portfolio website. The analysis reveals **50-80 files** that can be safely removed, potentially reducing repository size by **60-70%**.

## 🚨 HIGH PRIORITY - Business Boilerplate Pages (Remove Immediately)

These pages contain content for "Tree Partner Solutions" - a business completely unrelated to your personal portfolio:

### App Routes to Delete

- `app/careers/` - Contains Tree Partner hiring content
- `app/team/` - Business team page content
- `app/news/` - Tree Partner news updates
- `app/reports/` - Business reports page
- `app/calendar/` - Business calendar functionality
- `app/faq/` - Generic business FAQ
- `app/gdpr/` - GDPR compliance page
- `app/cookies/` - Cookie policy page
- `app/share-information/` - Information sharing page

**Impact:** Removes 9 irrelevant business pages

### Business Config Files

- `data/config/colors.js` - Contains Tree Partner branding colors

## 🧪 Excessive Testing Infrastructure (Remove/Simplify)

The repository has multiple testing frameworks that are overkill for a portfolio:

### Docker Testing Setup (Remove)

- `Dockerfile.test` - Docker testing container
- `docker-compose.test.yml` - Multi-service test environment
- `database/` folder entirely:
  - `mongo-init.js`
  - `test-data.sql`
  - `test-schema.sql`
- `healthcheck.js` - Docker health check script

**Impact:** Removes Docker testing complexity unnecessary for a portfolio

### Excessive Test Configuration

- `src/tests/integration/` - Complex integration tests
- `src/tests/performance/` - Performance testing suite
- `test/mocks/` - Mock data that's not needed
- `test-setup.ts` - Can be simplified significantly

### Testing Dependencies to Remove from package.json

```json
{
  "devDependencies": {
    "@testcontainers/postgresql": "REMOVE",
    "@testcontainers/redis": "REMOVE",
    "testcontainers": "REMOVE",
    "supertest": "REMOVE",
    "express": "REMOVE",
    "@types/express": "REMOVE",
    "msw": "REMOVE - Mock Service Worker",
    "c8": "REMOVE - vitest has built-in coverage"
  }
}
```

**Impact:** Reduces `node_modules` size and eliminates unused testing complexity

## 📝 Documentation & Planning Files (Remove)

### Temporary Files

- `cleanup-unused.md` - Previous analysis document (temporary)
- `todo.txt` - Development todo list (temporary)
- `prd.txt` - Product requirements document (temporary)
- `Portfolio project.txt` - Old planning document
- `typescriptErrors.txt` - Captured errors log
- `experiences.json` - Unused JSON file
- `frontmatter.json` - VS Code extension config (optional)

**Impact:** Removes 7 temporary/planning files from repository

## 🚀 Deployment Infrastructure (Excessive)

### Server Deployment Scripts (Remove if using Vercel/Netlify)

- `deploy/` folder entirely:
  - `deploy.sh`
  - `setup-server.sh`
  - `SERVER_SETUP_INSTRUCTIONS.md`
  - `SERVER_SETUP_INSTRUCTIONS_SHARED.md`
  - `git-hooks/`
  - `.env.example` (duplicate)

**Impact:** Removes server deployment scripts if using cloud deployment

## 🎨 Unused UI Components (Remove)

### Icon Components (Remove Unused)

- `components/icons/ThreadsIcon.tsx` - Not imported anywhere
- `components/icons/TiktokIcon.tsx` - Not imported anywhere
- `components/icons/PricingCheckIcon.tsx` - Business-focused
- `components/icons/XIcon.tsx` - Likely unused

### Shared Components (Review)

- `components/shared/ActiveLink.tsx` - May be superseded
- `components/shared/FooterSupportButton.tsx` - Business-focused
- `components/shared/PageLoading.tsx` - May be unused
- `components/shared/PixelLoading.tsx` - May be duplicate
- `components/shared/MobileNav.tsx` - May be superseded

**Impact:** Reduces component bloat and bundle size

## 📦 Package Dependencies Cleanup

### Remove from dependencies

```json
{
  "dependencies": {
    "@vercel/og": "If not using Open Graph images",
    "recharts": "If not using charts",
    "contentlayer2": "If using simpler content approach",
    "next-contentlayer2": "If using simpler content approach",
    "rehype-citation": "If not using citations",
    "rehype-katex": "If not using math equations",
    "rehype-katex-notranslate": "If not using math equations"
  }
}
```

### Remove from devDependencies

```json
{
  "devDependencies": {
    "@testcontainers/postgresql": "Testing infrastructure",
    "@testcontainers/redis": "Testing infrastructure",
    "testcontainers": "Testing infrastructure",
    "supertest": "Testing infrastructure",
    "express": "Testing infrastructure",
    "@types/express": "Testing infrastructure",
    "msw": "Testing infrastructure",
    "c8": "Redundant coverage tool",
    "cross-env": "If not needed for deployment"
  }
}
```

**Impact:** Significantly reduces `node_modules` size and installation time

## ⚙️ Configuration Files (Simplify)

### Reduce Testing Scripts in package.json

Remove these overly complex testing scripts:

- `test:docker*` scripts (all of them)
- `test:ci`
- `test:performance`
- `test:integration`
- `test:hooks`
- `dev:test`

Keep only:

- `test` (basic unit tests)
- `test:watch`
- `test:e2e` (if needed)

### Git Hooks (Simplify)

- Review `.husky/` folder and remove excessive pre-commit hooks
- `commitlint.config.js` might be overkill for a personal project

**Impact:** Simplifies development workflow and reduces complexity

## 📊 Cleanup Impact Summary

### Files/Folders to Remove: ~50-80 items

#### Immediate Deletions (High Impact)

- **9** business boilerplate app routes
- **4** database/Docker files
- **6** deployment scripts
- **7** planning documents
- **15+** testing infrastructure files

#### Package.json Cleanup

- **~10** unnecessary dependencies
- **~15** testing-related scripts

#### Component Cleanup

- **~10-15** unused icon/UI components
- **~20+** potentially unused landing page components

### Estimated Size Reduction: 60-70%

## 🎯 Recommended Action Plan

### Phase 1: Critical Business Content Removal

1. Delete all Tree Partner related pages (`app/careers/`, `app/team/`, etc.)
2. Remove business configuration (`data/config/colors.js`)
3. Verify no business content remains in components

### Phase 2: Infrastructure Simplification

1. Remove Docker/database testing infrastructure
2. Delete server deployment scripts (if using cloud deployment)
3. Simplify testing configuration

### Phase 3: Dependencies & Scripts Cleanup

1. Remove unused dependencies from `package.json`
2. Simplify npm scripts
3. Clean up development tools

### Phase 4: Component Audit

1. Remove unused icon components
2. Audit landing page components
3. Remove business-focused UI elements

### Phase 5: Documentation Cleanup

1. Remove temporary planning documents
2. Keep only essential documentation (`README.md`)
3. Update remaining docs to reflect portfolio focus

## ✅ Benefits After Cleanup

- **Faster Development:** Reduced build times and simpler codebase
- **Better Maintainability:** Fewer files to manage and understand
- **Improved Performance:** Smaller bundle sizes and faster installs
- **Clearer Purpose:** Repository clearly focused on portfolio goals
- **Easier Onboarding:** Less cognitive overhead for future development

## ⚠️ Before You Start

1. **Backup:** Ensure you have a complete backup or the repository is safely committed
2. **Audit First:** Review each component/page before deletion to confirm it's unused
3. **Test After:** Run tests after each cleanup phase to ensure nothing breaks
4. **Gradual Approach:** Consider removing sections incrementally rather than all at once

---

**Note:** This analysis is based on static code inspection. Always verify that components/pages are truly unused before deletion by checking for dynamic imports or references that might not be immediately apparent.
