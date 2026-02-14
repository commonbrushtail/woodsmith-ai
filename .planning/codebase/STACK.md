# Technology Stack

**Analysis Date:** 2026-02-15

## Languages

**Primary:**
- JavaScript (JSX) - All source code, no TypeScript
- Used in `src/app/`, `src/components/`, `src/lib/`

## Runtime

**Environment:**
- Node.js (version not pinned, inferred from Next.js 16 requirements)

**Package Manager:**
- npm
- Lockfile: `package-lock.json` present

## Frameworks

**Core:**
- Next.js 16.1.6 (App Router) - Server-side rendering, static generation, API routes
  - Build flag: `--webpack` (custom webpack build, not Turbopack)
  - Config: `next.config.mjs` - Disables `next/image`, webpack `asset/resource` rule for images

**UI:**
- React 19.2.0 - Component library, hooks
- React DOM 19.2.0 - DOM rendering

**Styling:**
- Tailwind CSS 4.1.18 - Utility-first CSS framework
  - No `tailwind.config.js` file
  - Design tokens defined in `@theme` block in `src/app/globals.css`
  - PostCSS integration via `@tailwindcss/postcss` 4.1.18

**Rich Text Editor:**
- TipTap 3.19.0 (free core)
  - `@tiptap/react` 3.19.0 - React integration
  - `@tiptap/starter-kit` 3.19.0 - Core plugins (bold, italic, etc.)
  - `@tiptap/extension-image` 3.19.0 - Image embedding
  - `@tiptap/extension-link` 3.19.0 - Link support
  - `@tiptap/pm` 3.19.0 - ProseMirror integration

**Drag & Drop:**
- dnd-kit (for re-ordering in admin CMS)
  - `@dnd-kit/core` 6.3.1 - Core drag/drop functionality
  - `@dnd-kit/sortable` 10.0.0 - Sortable list support
  - `@dnd-kit/utilities` 3.2.2 - Helper utilities

**Carousel:**
- Swiper 12.1.0 - Touch-enabled carousel for product galleries

## Testing

**Unit/Integration:**
- Vitest 4.0.18 - Test runner (same speed as Jest, Vite-native)
  - Config: `vitest.config.js`
  - Environment: jsdom
  - Setup: `tests/setup.js`
  - Run: `npm test` (once), `npm run test:watch` (watch mode)

**Testing Utilities:**
- @testing-library/react 16.3.2 - React component testing
- @testing-library/jest-dom 6.9.1 - DOM matchers
- jsdom 28.0.0 - DOM simulation for unit tests
- globals 16.5.0 - Global test functions

**E2E:**
- Playwright 1.58.2 - Browser automation testing
  - `@playwright/test` 1.58.2 - Test runner
  - Config: `playwright.config.js`
  - Test directory: `e2e/`
  - Run: `npm run test:e2e` (headless), `npm run test:e2e:ui` (debug UI)

## Key Dependencies

**Critical:**
- @supabase/supabase-js 2.95.3 - Supabase client (PostgreSQL + Auth + Storage)
- @supabase/ssr 0.8.0 - Server-side Supabase integration (cookie management, session refresh)

**Validation:**
- zod 4.3.6 - Schema validation for forms, server actions, API responses

**Type Hints (Optional):**
- @types/react 19.2.7 - React types (dev only, not used in code)
- @types/react-dom 19.2.3 - React DOM types (dev only)

**Utilities:**
- prop-types 15.8.1 - Runtime type checking for components

## Build & Development

**Linting:**
- ESLint 9.39.1 - Code linting
  - `@eslint/js` 9.39.1 - Core ESLint rules
  - `eslint-plugin-react-hooks` 7.0.1 - React hooks rules
  - `eslint-plugin-react-refresh` - Vite-specific rules (legacy, from template)
  - Config: `eslint.config.js` (flat config format)

**PostCSS:**
- PostCSS 8+ (implicit via Tailwind)
  - Config: `postcss.config.mjs`
  - Plugin: `@tailwindcss/postcss` 4.1.18

**Vite Plugin (for tests):**
- @vitejs/plugin-react 5.1.4 - JSX/React transpilation

## Configuration Files

- `next.config.mjs` - Next.js config (webpack rules, image handling)
- `vitest.config.js` - Vitest config (environment, aliases, setup)
- `playwright.config.js` - Playwright config (test directory, dev server, base URL)
- `postcss.config.mjs` - PostCSS config (Tailwind plugin)
- `eslint.config.js` - ESLint config (flat format, React rules)
- `tsconfig.json` - TypeScript config (used only for IDE hints, JavaScript is compiled as-is)

## Environment Configuration

**Required Env Vars:**
- `NEXT_PUBLIC_SUPABASE_URL` - Supabase project URL (public)
- `NEXT_PUBLIC_SUPABASE_ANON_KEY` - Supabase anonymous key (public)
- `SUPABASE_SERVICE_ROLE_KEY` - Supabase service role key (secret, server-only)
- `LINE_LOGIN_CHANNEL_ID` - LINE Login Channel ID (secret)
- `LINE_LOGIN_CHANNEL_SECRET` - LINE Login Channel Secret (secret)
- `NEXT_PUBLIC_SITE_URL` - Site base URL for OAuth callbacks (public)

**Secrets Location:**
- `.env.local` - Local development secrets (gitignored via `*.local` pattern)
- `.env.example` - Template with all required variables (committed)
- CI/CD: Environment variables set in deployment platform

**Database:**
- Supabase PostgreSQL 14 (5 migrations in `supabase/migrations/`)
- Local dev: Supabase CLI for local emulation

## Platform Requirements

**Development:**
- Node.js (compatible with Next.js 16)
- npm or yarn
- Supabase CLI (optional, for local database emulation)

**Production:**
- Deployment: Next.js-compatible platform (Vercel recommended)
- Database: Supabase PostgreSQL (cloud)
- Storage: Supabase Storage (S3-compatible)

---

*Stack analysis: 2026-02-15*
