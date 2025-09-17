# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a Next.js 15 business website boilerplate built with TypeScript, React 19, and Tailwind CSS. It provides a professional foundation for businesses with modern UI components, blog system, and comprehensive landing page sections. Perfect for startups, agencies, and companies looking to establish a strong online presence.

## Key Commands

### Development

- `npm run dev` - Start development server on port 6006
- `npm run build` - Build for production (includes app info generation and postbuild script)
- `npm run serve` - Start production server
- `npm run analyze` - Build with bundle analysis enabled

### Code Quality

- `npm run lint` - Run ESLint with auto-fix on pages, app, components, lib, layouts, and scripts
- `npm run pretty` - Format all files with Prettier
- `npm run appinfo` - Generate application info (runs automatically before dev/build)

### Testing

#### Unit Tests

- `npm run test` - Run all unit tests with Vitest
- `npm run test:watch` - Run tests in watch mode
- `npm run test:ui` - Open Vitest UI for interactive testing
- `npm run test:coverage` - Generate test coverage report
- `npm run test:unit` - Run specific unit tests for lib and components

#### Integration Tests

- `npm run test:integration` - Run integration tests

#### Performance Tests

- `npm run test:performance` - Run performance and load tests

#### End-to-End Tests

- `npm run test:e2e` - Run all E2E tests with Playwright
- `npm run test:e2e:ui` - Interactive E2E test UI
- `npm run test:e2e:headed` - Run E2E tests with visible browser
- `npm run test:e2e:debug` - Debug E2E tests
- `npm run test:e2e:report` - Show Playwright test report

#### Combined Test Suites

- `npm run test:local` - Run unit and integration tests
- `npm run test:full` - Run local and E2E tests
- `npm run test:all` - Run unit and E2E tests (legacy command)

#### Docker Testing

- `npm run test:docker` - Run unit tests in Docker container
- `npm run test:docker:e2e` - Run E2E tests in Docker environment
- `npm run test:docker:all` - Run all tests in Docker with services (PostgreSQL, Redis)
- `npm run test:docker:clean` - Clean Docker containers and volumes
- `npm run dev:test` - Start Docker test environment for development

#### Test Utilities

- `npm run test:hooks` - Verify testing setup and hooks
- `npm run test:ci` - Run full CI test suite with Docker

## Architecture

### Core Structure

- **App Router**: Uses Next.js 15 app directory structure
- **Content Management**: Contentlayer for MDX blog posts and author profiles
- **Styling**: Tailwind CSS with custom design system and shadcn/ui components
- **State Management**: React Context for theme and search functionality
- **TypeScript**: Configured with path aliases and strict null checks

### Key Directories

- `app/` - Next.js app router pages and layouts
- `components/` - React components organized by feature (shared, landing, blog, icons, ui)
- `layouts/` - Blog post and author page layouts
- `data/` - Content files (MDX posts, authors, configuration)
- `lib/` - Utilities and helper functions
- `public/` - Static assets

### Content System

- Blog posts stored as MDX in `data/` directory
- Contentlayer processes content and generates type-safe objects
- Supports frontmatter, reading time calculation, TOC generation
- Search index automatically generated from posts

### UI Components

- Built with Radix UI primitives and shadcn/ui
- Custom components in `components/shared/ui/`
- Landing page components in `components/landing/`
- Theme switching with next-themes

### Configuration

- Site settings in `data/config/site.settings.js`
- TypeScript path aliases configured for all major directories
- ESLint configured for Next.js with custom rules
- Content Security Policy configured in `next.config.js`

### Testing Architecture

- **Test Framework**: Vitest for unit and integration tests
- **E2E Testing**: Playwright with full browser automation
- **Test Environment**: jsdom for DOM testing
- **Coverage**: V8 provider with HTML, JSON, and text reports
- **Docker Testing**: Full-stack testing with PostgreSQL, Redis, and MongoDB
- **Test Setup**: Global test setup in `test-setup.ts`
- **Mock Service Worker**: MSW for API mocking
- **Test Containers**: @testcontainers for database testing

## Development Notes

### TypeScript Paths

The project uses path aliases:

- `@/components/*` → `components/*`
- `@/data/*` → `data/*`
- `@/layouts/*` → `layouts/*`
- `@/css/*` → `css/*`
- `@/lib/*` → `lib/*`
- `@/app/*` → `app/*`

### Content Management

- Create new blog posts in `data/` directory as `.mdx` files
- Author profiles in `data/authors/` as `.md` files
- Contentlayer automatically processes on build/dev
- Search functionality requires `search: true` in site config

### Styling

- Global styles in `css/globals.css`
- Color system defined in `data/config/colors.js`
- Component variants use class-variance-authority
- Responsive design with mobile-first approach

### Build Process

- Pre-build: App info generation
- Build: Next.js build with Contentlayer processing
- Post-build: Custom script for additional processing
- Bundle analysis available with `ANALYZE=true`

### Development Workflow

- **Git Hooks**: Husky for pre-commit hooks
- **Commit Linting**: Commitlint with conventional commits
- **Lint Staged**: Automatic linting and formatting on commit
- **Docker Support**: Development and testing with Docker Compose
- **CI/CD Ready**: GitHub Actions configuration included

## Getting Started with This Boilerplate

### Initial Setup

1. Update business information in `data/config/metadata.js`
2. Replace logo in `public/static/images/logo.png`
3. Update favicon files in `public/static/favicons/`
4. Modify homepage content in `app/page.tsx`
5. Create your own blog posts in `data/` directory
6. Update author information in `data/authors/default.md`

### Customization Points

- **Branding**: Update metadata, colors, fonts, and logo
- **Content**: Replace homepage sections, team members, testimonials
- **Navigation**: Modify header/footer links in components
- **Analytics**: Configure tracking in `data/config/site.settings.js`
- **SEO**: Update meta tags and structured data

### Included Pages

- Homepage with comprehensive landing sections
- About page with team and values
- Services page with feature grid
- Contact page with form and information
- Blog system with example articles
- Team page
- Standard legal pages (Privacy, Terms, etc.)

### Landing Page Components

The boilerplate includes extensive landing page components:

- Hero sections with CTAs
- Feature grids and showcases
- Testimonials and social proof
- Statistics and metrics
- Team sections
- FAQ components
- Newsletter signup
- Pricing tables

### Content Management

- Blog posts as MDX files with frontmatter
- Author profiles and avatars
- Automatic search index generation
- Tag-based categorization
- Reading time calculation
- Table of contents generation

## Testing Requirements

**ALWAYS follow these rules for every file you create or modify:**

1. **Unit Test Requirement**: For every `.ts`, `.js`, `.tsx`, or `.jsx` file you create or significantly modify, immediately create/update a corresponding `.test.ts` file in the same directory
2. **Test Coverage**: Each test file must include at least:
   - **Happy path test**: Normal expected usage
   - **Edge case test**: Boundary conditions, empty inputs, null/undefined
   - **Error case test**: Invalid inputs, expected exceptions
3. **Test Structure**: Use describe/it blocks with descriptive names that explain what is being tested
4. **Export for Testing**: Ensure functions are properly exported so they can be imported in test files
5. **Test File Naming**: Test files should be named `[filename].test.ts` and placed in the same directory as the source file

### Test Types and Locations

- **Unit Tests**: `components/**/*.test.tsx`, `lib/**/*.test.ts`
- **Integration Tests**: `src/tests/integration/`
- **E2E Tests**: `e2e/` directory with Playwright
- **Performance Tests**: `src/tests/performance/`
- **Test Setup**: Global setup in `test-setup.ts`

### Running Specific Tests

```bash
# Run tests for a specific file
npx vitest run lib/utils.test.ts

# Run E2E tests for specific spec
npx playwright test auth.spec.ts

# Run tests with specific pattern
npx vitest run --reporter=verbose components/ui/
```

## Test Template

For every new file, use this pattern:

```typescript
// src/example.test.ts (same directory as src/example.ts)
import { describe, it, expect } from "vitest";
import { functionName } from "./example";

describe("Example Module", () => {
  describe("functionName", () => {
    it("should handle normal input correctly", () => {
      expect(functionName("normal")).toBe("expected");
    });

    it("should handle edge cases", () => {
      expect(functionName("")).toBe("expected");
      expect(functionName(null)).toBe("expected");
    });

    it("should handle error conditions", () => {
      expect(() => functionName("invalid")).toThrow("Expected error message");
    });
  });
});
```

## Testing Level Commands

When I say one of these commands, implement the corresponding testing level:

- **"Basic testing"** → Apply Basic Testing Template
- **"Web app testing"** → Apply Web App Testing Template
- **"Full-stack testing"** → Apply Full-Stack Testing Template

Each template includes all previous levels plus additional testing capabilities.
