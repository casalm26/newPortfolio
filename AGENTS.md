# Repository Guidelines

## Project Structure & Module Organization

Core application routes and server components live in `app/`, while reusable UI pieces reside in `components/` and shared layouts in `layouts/`. Domain logic and utilities are grouped under `lib/`, with typed content sourced through `data/` and `contentlayer.config.ts`. Styling is handled via Tailwind and PostCSS in `css/`, and public assets belong in `public/`. Test assets sit in `src/tests/` (integration and performance suites), `e2e/` (Playwright specs), and `test/mocks/` for shared fixtures. Database helpers and seed files are kept in `database/`, and automation scripts live in `scripts/`.

## Build, Test, and Development Commands

- `npm run dev` – starts Next.js locally on port 6006 after regenerating app metadata.
- `npm run build` – produces the production bundle and runs the post-build script for static assets.
- `npm run serve` – serves the built site; use after `npm run build`.
- `npm run lint` / `npm run pretty` – applies ESLint (with auto-fix) and Prettier + Tailwind plugin formatting.
- `npm run test` – runs the Vitest suite; `npm run test:e2e` executes Playwright; `npm run test:coverage` reports coverage; `npm run test:local` chains unit and integration runs.

## Coding Style & Naming Conventions

TypeScript with Next.js 15 and React 19 is the default. Prettier enforces two-space indentation, single quotes, and Tailwind class sorting—commit formatted files. Follow PascalCase for components (`components/HeroSection.tsx`), camelCase for utilities (`lib/fetchBlogPosts.ts`), and kebab-case for route segments within `app/`. Keep React Server Components free of browser-only APIs; move interactive logic into Client Components. Favor descriptive file names that match exported symbols.

## Testing Guidelines

Vitest covers unit and integration specs placed alongside code (`*.test.ts(x)`) or within `src/tests/`. Performance checks belong in `src/tests/performance/`, and shared mocks should extend `test/mocks/`. Playwright e2e scenarios live in `e2e/`; run them with `npm run test:e2e` or inspect results via `npm run test:e2e:report`. Aim to update or add tests with every feature; ensure coverage thresholds are met before opening PRs.

## Commit & Pull Request Guidelines

The repo runs commitlint with the Conventional Commits preset. Use `type(optional-scope): short imperative summary`—e.g., `feat(home): add hero animation`. Group related changes per commit and avoid “n/a” messages. Before opening a PR, run `npm run lint` and `npm run test:local`; include a concise description, screenshots for UI changes, and link related issues. Highlight any new environment variables or migrations in the PR checklist.
