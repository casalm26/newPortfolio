# CLAUDE.md

This file provides guidance for Claude Code when working with this repository.

## Project Overview

A personal portfolio website built with Next.js 15, React 19, TypeScript, and Tailwind CSS. Features project showcases (MDX via Contentlayer), CV timeline, contact page, and interactive pixel-art components. Dark theme only with a terminal/retro aesthetic.

## Quick Commands

```bash
npm run dev          # Start dev server on port 6006
npm run build        # Production build
npm run lint         # ESLint with auto-fix
npm run pretty       # Prettier formatting
npm run test         # Run Vitest unit tests
npm run test:e2e     # Run Playwright E2E tests
```

## Project Structure

```
app/                 # Next.js App Router pages
  contact/          # Contact page
  cv/               # CV/Resume page
  projects/         # Projects showcase + [slug] detail
components/          # Reusable React components
  cv/               # CV components
  projects/         # Project card components
  shared/           # Header, Footer, common UI
  icons/            # Pixel art icon components
data/                # Content and configuration
  config/           # Site metadata, colors, settings
  projects/         # Project MDX files
  cv/               # CV timeline data (JSON)
lib/                 # Utilities and shared logic
css/                 # Global styles and Tailwind config
public/              # Static assets (images, favicons)
e2e/                 # Playwright E2E test specs
src/tests/           # Integration and performance tests
```

## Pages

- `/` - Landing page with pixel art name, highlights, quick access cards
- `/projects` - Project listing with search/filter
- `/projects/[slug]` - Individual project detail (MDX content)
- `/cv` - Career timeline
- `/contact` - Contact info and social links

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

- Projects: MDX files in `data/projects/` with frontmatter (title, date, projectType, skills, tools, links)
- CV data: `data/cv/timeline.json`
- Site config: `data/config/metadata.js` and `data/config/site.settings.js`

### Commits

- Use Conventional Commits: `type(scope): description`
- Examples: `feat(projects): add filter by tech`, `fix(nav): correct mobile menu`
- Run `npm run lint` before committing

## Testing

- **Unit tests**: Colocated with source files as `*.test.ts(x)` or in `src/tests/`
- **E2E tests**: `e2e/` directory with Playwright
- **Mocks**: `test/mocks/` for shared test fixtures

## Important Files

- `contentlayer.config.ts` - Project + Timeline content type definitions
- `tailwind.config.js` - Theme and design tokens
- `next.config.js` - Next.js configuration
- `data/config/metadata.js` - Site metadata and social links
- `data/config/colors.js` - Color scheme definitions

## Environment Variables

Copy `.env.example` to `.env.local` for local development. Key variables:

- `NEXT_PUBLIC_GOOGLE_ANALYTICS_ID` - GA4 tracking (optional)

## Adding a project

Create `data/projects/project-name.mdx` with frontmatter:

```mdx
---
title: "Project Name"
date: "2025-01-23"
projectType: "Technical"
category: "Web Development"
summary: "Brief description"
skills: ["React", "TypeScript"]
tools: ["Next.js", "Tailwind"]
links: { "github": "https://github.com/...", "live": "https://..." }
draft: false
---
```

## Deployment

Target: Vercel (static site). Long-term goal: Vercel + custom CMS.
