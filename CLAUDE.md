# CLAUDE.md

This file provides guidance for Claude Code when working with this repository.

## Project Overview

A personal portfolio website built with Next.js 15, React 19, TypeScript, and Tailwind CSS. Features project showcases, blog posts, video content, CV timeline, contact page, and interactive pixel-art components. Dark theme only with a terminal/retro aesthetic. Content is managed via a MongoDB-backed CMS with API key-authenticated CRUD endpoints.

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
  blog/             # Blog listing + [slug] detail
  contact/          # Contact page
  cv/               # CV/Resume page
  projects/         # Projects showcase + [slug] detail
  videos/           # Video listing + [slug] detail
  api/cms/          # CMS API routes (CRUD + revalidation)
components/          # Reusable React components
  cv/               # CV components
  projects/         # Project card components
  shared/           # Header, Footer, common UI
  icons/            # Pixel art icon components
data/                # Legacy content and configuration
  config/           # Site metadata, colors, settings
  projects/         # Project MDX files (migrated to MongoDB)
  cv/               # CV timeline data (JSON, migrated to MongoDB)
lib/                 # Utilities and shared logic
  cms/              # CMS auth, queries, types
  db/               # MongoDB connection
  models/           # Mongoose schemas (BlogPost, Project, Video, TimelineEntry)
css/                 # Global styles and Tailwind config
public/              # Static assets (images, favicons)
scripts/             # Migration and seed scripts
e2e/                 # Playwright E2E test specs
src/tests/           # Integration and performance tests
```

## Pages

- `/` - Landing page with pixel art name, highlights, quick access cards
- `/projects` - Project listing with search/filter
- `/projects/[slug]` - Individual project detail (MDX content)
- `/blog` - Blog post listing with tag/category filters
- `/blog/[slug]` - Individual blog post (MDX content)
- `/videos` - Video listing with tag filters
- `/videos/[slug]` - Video detail with YouTube embed
- `/cv` - Career timeline
- `/contact` - Contact info and social links

## CMS Architecture

Content is stored in MongoDB Atlas with Mongoose models:

- **BlogPost** - Blog articles with MDX content, tags, categories, SEO fields
- **Project** - Project showcases with skills, tools, links, MDX content
- **Video** - YouTube video entries with related content linking
- **TimelineEntry** - CV timeline entries (work, education, skills, etc.)

### API Routes (`/api/cms/*`)

All routes require `x-api-key` header matching `CMS_API_KEY` env var.

- `GET/POST /api/cms/posts` - List/create blog posts
- `GET/PUT/DELETE /api/cms/posts/[slug]` - Single post CRUD
- `GET/POST /api/cms/projects` - List/create projects
- `GET/PUT/DELETE /api/cms/projects/[slug]` - Single project CRUD
- `GET/POST /api/cms/videos` - List/create videos
- `GET/PUT/DELETE /api/cms/videos/[slug]` - Single video CRUD
- `GET/POST /api/cms/timeline` - List/create timeline entries
- `GET/PUT/DELETE /api/cms/timeline/[id]` - Single timeline entry CRUD
- `POST /api/cms/revalidate` - On-demand ISR revalidation

### Data Fetching

Server components use helpers from `lib/cms/queries.ts`:

- `getAllProjects()`, `getProjectBySlug(slug)`
- `getAllPosts()`, `getPostBySlug(slug)`
- `getAllVideos()`, `getVideoBySlug(slug)`
- `getTimelineEntries()`

MDX content is compiled at request time using `next-mdx-remote`.

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
- Listing pages use server wrapper + client component pattern for interactivity

### Commits

- Use Conventional Commits: `type(scope): description`
- Examples: `feat(projects): add filter by tech`, `fix(nav): correct mobile menu`
- Run `npm run lint` before committing

## Testing

- **Unit tests**: Colocated with source files as `*.test.ts(x)` or in `src/tests/`
- **E2E tests**: `e2e/` directory with Playwright
- **Mocks**: `test/mocks/` for shared test fixtures

## Important Files

- `lib/models/` - Mongoose schema definitions for all content types
- `lib/cms/queries.ts` - Data-fetching helpers for server components
- `lib/cms/auth.ts` - API key authentication middleware
- `lib/db/connection.ts` - MongoDB connection singleton
- `tailwind.config.js` - Theme and design tokens
- `next.config.js` - Next.js configuration
- `data/config/metadata.js` - Site metadata and social links
- `data/config/colors.js` - Color scheme definitions

## Environment Variables

Copy `.env.example` to `.env.local` for local development. Key variables:

- `MONGODB_URI` - MongoDB Atlas connection string (required)
- `CMS_API_KEY` - Secret key for CMS API authentication (required)
- `NEXT_PUBLIC_GOOGLE_ANALYTICS_ID` - GA4 tracking (optional)

## Seeding the Database

To migrate existing MDX projects and CV timeline data into MongoDB:

```bash
MONGODB_URI=mongodb+srv://... node scripts/seed-db.mjs
MONGODB_URI=mongodb+srv://... node scripts/seed-db.mjs --clear  # wipe first
```

## Deployment

Target: Vercel with MongoDB Atlas backend.
