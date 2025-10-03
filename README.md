# Next.js Business Website Boilerplate

A modern, professional business website boilerplate built with Next.js 15, React 19, TypeScript, and Tailwind CSS. Perfect for startups, agencies, and businesses looking to establish a strong online presence.

## Features

- ⚡ **Next.js 15** with App Router
- 🔷 **TypeScript** for type safety
- 🎨 **Tailwind CSS** with shadcn/ui components
- 📝 **Blog system** with MDX and Contentlayer
- 🔍 **Search functionality**
- 📱 **Responsive design**
- 🌙 **Dark/light theme**
- 📊 **Analytics ready** (Vercel, Google Analytics, etc.)
- 🚀 **Performance optimized**
- 📈 **SEO friendly**
- 🧪 **Full-Stack Testing** with Unit, Integration, E2E, and Performance tests
- 🐳 **Docker** testing environment with PostgreSQL, Redis, and MongoDB
- 🔄 **CI/CD** ready with GitHub Actions

## Table of Contents

- [Installation](#installation)
- [Development](#development)
- [Testing](#testing)
- [Docker Testing](#docker-testing)
- [Build](#build)
- [Deploy](#deploy)
- [Customization](#customization)
- [Blog Posts](#blog-posts)
- [FAQ](#frequently-asked-questions)

## Installation

```bash
npm i
```

## Development

First, run the development server:

```bash
npm run dev
```

## Testing

This boilerplate includes comprehensive testing setup with multiple test types:

### Unit Tests

Test individual components and utilities:

```bash
npm run test:unit        # Run unit tests
npm run test:watch       # Watch mode
npm run test:ui          # Visual test UI
npm run test:coverage    # Coverage report
```

### Integration Tests

Test API endpoints and business logic:

```bash
npm run test:integration  # Run integration tests
```

### E2E Tests

Test complete user workflows with Playwright:

```bash
npm run test:e2e         # Run all E2E tests
npm run test:e2e:ui      # Interactive UI mode
npm run test:e2e:headed  # Run with browser visible
npm run test:e2e:debug   # Debug mode
```

### Performance Tests

Load and performance testing:

```bash
npm run test:performance  # Run performance tests
```

### Combined Test Suites

```bash
npm run test:local       # Unit + Integration
npm run test:full        # Local + E2E
npm run test:all         # Unit + E2E (legacy)
```

### Verify Setup

```bash
npm run test:hooks       # Verify testing setup
```

## Docker Testing

For full-stack testing with real databases and services:

### Prerequisites

- Docker and Docker Compose installed

### Docker Test Commands

```bash
# Run full Docker test suite
npm run test:docker:all

# Run specific test layers
npm run test:docker      # Integration tests only
npm run test:docker:e2e  # E2E tests only

# Development with test environment
npm run dev:test         # Start test environment

# Clean up Docker resources
npm run test:docker:clean
```

### Docker Test Environment

The Docker setup includes:

- **PostgreSQL** - Test database
- **Redis** - Caching and sessions
- **MongoDB** - Document database (optional)
- **Application** - Your app in test mode

## Build

To build the site for production, run the following command:

```bash
npm run build
```

## Deploy

**Vercel**

This codebase can be deployed to [Vercel](https://vercel.com) with 1 click.

**Netlify**

This codebase can be deployed to [Netlify](https://www.netlify.com/) with 1 click.

**Static hosting services / GitHub Pages / S3 / Firebase etc.**

This is a standard Next.js application that can be deployed to any hosting service that supports Node.js applications.

## Customization

### Configuration

Update your business information in:

- `data/config/metadata.js` - Site metadata, social links, and business info
- `data/config/site.settings.js` - Site configuration and analytics

### Google Analytics 4 Setup

To enable Google Analytics tracking:

1. **Create a GA4 Property:**
   - Go to [Google Analytics](https://analytics.google.com/)
   - Create a new GA4 property for your website
   - Copy your Measurement ID (format: `G-XXXXXXXXX`)

2. **Configure Environment Variables:**
   - Copy `.env.example` to `.env.local`
   - Replace `G-XXXXXXXXXX` with your actual GA4 Measurement ID
   ```bash
   NEXT_PUBLIC_GOOGLE_ANALYTICS_ID=G-YOUR-ACTUAL-ID
   ```

3. **Privacy Compliance:**
   - The analytics implementation respects user privacy
   - Update your privacy policy to mention Google Analytics usage
   - Consider implementing cookie consent if required by your jurisdiction

4. **Alternative Analytics:**
   - The boilerplate also supports Umami, Plausible, PostHog, and Simple Analytics
   - Uncomment the relevant configuration in `data/config/site.settings.js`
   - Vercel Analytics is enabled by default

### Branding

- Replace logo in `public/static/images/logo.png`
- Update favicons in `public/static/favicons/`
- Modify colors in `data/config/colors.js`

### Content

- Homepage content in `app/page.tsx`
- Footer and header in `components/shared/`
- Hero animation lives in `components/PixelArtName.tsx`

## Blog Posts

Create blog posts as MDX files in the `data/` directory. Each post should include frontmatter with title, date, tags, and summary.

Example:

```mdx
---
title: "My First Post"
date: "2024-01-01"
tags: ["web-development", "nextjs"]
draft: false
summary: "A brief description of your post"
---

Your content here...
```

Content is powered by [Contentlayer](https://www.contentlayer.dev/) for type-safe content management.

## Frequently Asked Questions

### How can I add a custom MDX component?

You need to include the component under `components/MDXComponents.tsx`.

### How can I add a blog layout?

Create new layout components in the `layouts/` directory and reference them in your MDX frontmatter.

### How to add meta tags?

There's a utility function, `getPageMetadata` that makes it easy to add meta tags to your pages.

### How do I customize the color scheme?

Edit the color definitions in `data/config/colors.js` and update your Tailwind configuration.

### Can I add more pages?

Yes! Create new page components in the `app/` directory following Next.js 15 App Router conventions.
