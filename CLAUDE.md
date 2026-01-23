# CLAUDE.md

This file provides guidance for Claude Code when working with this repository.

## Project Overview

A personal portfolio website built with Next.js 15, React 19, TypeScript, and Tailwind CSS. Features a blog system powered by MDX and Contentlayer, project showcases, CV page, and interactive components.

## Quick Commands

```bash
npm run dev          # Start dev server on port 6006
npm run build        # Production build with post-build scripts
npm run lint         # ESLint with auto-fix
npm run pretty       # Prettier formatting
npm run test         # Run Vitest unit tests
npm run test:e2e     # Run Playwright E2E tests
npm run test:local   # Unit + Integration tests
```

## Project Structure

```
app/                 # Next.js App Router pages and API routes
  about/            # About page
  contact/          # Contact page
  cv/               # CV/Resume page
  projects/         # Projects showcase
  all-articles/     # Blog listing
  tags/             # Tag-based filtering
  api/              # API endpoints
components/          # Reusable React components
  blog/             # Blog-specific components
  cv/               # CV components
  projects/         # Project card components
  shared/           # Header, Footer, common UI
  icons/            # Icon components
data/                # Content and configuration
  config/           # Site metadata, colors, settings
  projects/         # Project MDX files
  cv/               # CV data
  *.mdx             # Blog posts
layouts/             # Page layout templates
lib/                 # Utilities and shared logic
css/                 # Global styles and Tailwind config
public/              # Static assets (images, favicons)
e2e/                 # Playwright E2E test specs
src/tests/           # Integration and performance tests
```

## Key Conventions

### Code Style
- TypeScript throughout with strict typing
- Two-space indentation, single quotes (enforced by Prettier)
- Tailwind CSS for styling with class sorting
- PascalCase for components, camelCase for utilities, kebab-case for routes

### React Patterns
- React Server Components by default in `app/`
- Client Components marked with `'use client'` directive when needed
- Keep browser-only APIs in Client Components

### Content Management
- Blog posts: MDX files in `data/` with frontmatter (title, date, tags, summary)
- Projects: MDX files in `data/projects/`
- Site config: `data/config/metadata.js` and `data/config/site.settings.js`

### Commits
- Use Conventional Commits: `type(scope): description`
- Examples: `feat(blog): add reading time`, `fix(nav): correct mobile menu`
- Run `npm run lint` and `npm run test:local` before committing

## Testing

- **Unit tests**: Colocated with source files as `*.test.ts(x)` or in `src/tests/`
- **E2E tests**: `e2e/` directory with Playwright
- **Mocks**: `test/mocks/` for shared test fixtures
- Always run relevant tests after changes

## Important Files

- `contentlayer.config.ts` - MDX/content type definitions
- `tailwind.config.js` - Theme and design tokens
- `next.config.js` - Next.js configuration
- `data/config/metadata.js` - Site metadata and social links
- `data/config/colors.js` - Color scheme definitions

## Environment Variables

Copy `.env.example` to `.env.local` for local development. Key variables:
- `NEXT_PUBLIC_GOOGLE_ANALYTICS_ID` - GA4 tracking (optional)

## Common Tasks

### Adding a blog post
Create `data/your-post-slug.mdx` with frontmatter:
```mdx
---
title: "Post Title"
date: "2025-01-23"
tags: ["tag1", "tag2"]
draft: false
summary: "Brief description"
---
```

### Adding a project
Create `data/projects/project-name.mdx` with appropriate frontmatter.

### Modifying theme colors
Edit `data/config/colors.js` and update Tailwind config if needed.
