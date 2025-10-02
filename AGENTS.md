# Repository Guidelines

## Project Structure & Module Organization
The Next.js app lives in `app/`, organized by route segments with matching `page.tsx` and layout files. Shared UI and forms sit in `components/` and `layouts/`, while domain helpers, API clients, and hooks live under `lib/`. Structured content (blog posts, resumes, data tables) is sourced from `data/`, `contentlayer.config.ts`, and `public/` assets. Automated tests are split into `src/tests/integration`, `src/tests/performance`, `e2e/`, and route-level specs in `app/*.test.tsx`. Keep static media in `public/` and Tailwind styles in `css/`.

## Build, Test, and Development Commands
Use `npm run dev` to start Next.js locally on port 6006 after generating app metadata. `npm run build` produces the production bundle and post-build metadata; follow with `npm run serve` to preview. Lint via `npm run lint` or run `npm run pretty` for a full Prettier pass. Run unit and integration suites with `npm run test:local`, end-to-end coverage with `npm run test:e2e`, and `npm run test:docker:all` inside CI or when you need the containerized database stubs.

## Coding Style & Naming Conventions
The project is TypeScript-first with ESLint (`next/core-web-vitals`) and Prettier (Tailwind plugin) enforcing 2-space indentation, semicolons, and double quotes. Use PascalCase for components, camelCase for helpers, SCREAMING_SNAKE_CASE for env vars, and kebab-case for route folders and MD/JSON content files. Tailwind classes follow utility-first patterns; extract shared variants into `components/shared/` or `lib/utils.ts`.

## Testing Guidelines
Vitest drives fast unit and integration tests; colocate specs as `*.test.ts[x]` mirroring the file under test. Use `test-setup.ts` for shared mocks. Playwright powers `e2e/` scenarios; tag slow flows there and record artifacts via `npm run test:e2e:report`. Maintain coverage by running `npm run test:coverage` before submitting and ensure new routes include smoke coverage in either Vitest or Playwright.

## Commit & Pull Request Guidelines
Commitlint enforces Conventional Commit types (`feat`, `fix`, `docs`, `style`, `refactor`, `test`, `chore`, `perf`, `ci`, `build`) with subjects under 100 characters. Scope commits by module (e.g. `feat(app/contact)`), rebasing before opening a PR. Pull requests should link issues, describe user-facing changes, list manual test results, and attach screenshots for UI updates. Request review once CI is green and Playwright reports are attached when applicable.
