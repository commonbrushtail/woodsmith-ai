# WoodSmith AI

Thai woodworking and construction materials website with admin CMS, customer auth, and public storefront. All pages wired to Supabase.

## Tech Stack

- **Framework**: Next.js 16 (App Router) with `--webpack` flag
- **UI**: React 19, JavaScript (JSX, no TypeScript)
- **Styling**: Tailwind CSS v4 — tokens in `@theme` block in `src/app/globals.css`, no `tailwind.config.js`
- **Backend**: Supabase (PostgreSQL 14 tables + Auth + Storage 6 buckets)
- **Rich Text**: TipTap 3 (`@tiptap/react`, `@tiptap/starter-kit`, image + link extensions)
- **Drag & Drop**: dnd-kit (`@dnd-kit/core`, `@dnd-kit/sortable`)
- **Carousel**: Swiper 12
- **Validation**: Zod 4
- **Testing**: Vitest 4 + Testing Library + jsdom (202 tests), Playwright (E2E)
- **Fonts**: IBM Plex Sans Thai (primary), Circular Std (display) — loaded via `<link>` in root layout

## Project Structure

```
src/
  app/
    layout.jsx                # Root layout: <html>, <head>, <body>, fonts only
    globals.css               # Tailwind + @theme design tokens
    (public)/                 # Public site route group (12 pages)
      layout.jsx              # TopBar + Navbar + Footer + LineFAB
      page.jsx                # Homepage
      about/, blog/, blog/[id]/, branches/, faq/, highlight/, manual/
      products/, product/[id]/
      account/, account/quotations/
    (admin)/                  # Admin CMS route group (34 pages)
      layout.jsx              # Metadata only
      login/                  # Login, forgot-password, set-new-password
      admin/
        layout.jsx            # Sidebar + main content wrapper
        dashboard/, products/, banner/, blog/, video-highlight/
        gallery/, manual/, about-us/, branch/, faq/
        quotations/, users/, profile/, account/
        # Each section has list + create + edit/[id] pages
    auth/
      callback/route.js       # OAuth callback
      callback/line/route.js  # LINE Login callback
      reset-password/route.js # Password reset callback
  components/
    admin/                    # Admin shared + ListClient components (21 files)
    *.jsx                     # Public components (19 files)
  assets/                     # Images and SVGs (webpack asset/resource)
  lib/
    supabase/                 # client.js, server.js, admin.js
    actions/                  # 18 Server Action files (CRUD for all entities)
    data/public.js            # 13 public data-fetching functions (RLS-filtered)
    validations/              # Zod schemas (products, blog, quotations)
    auth/                     # route-rules.js, line-config.js
    hooks/                    # use-form-errors.js
    storage.js                # Upload/delete/getPublicUrl (6 buckets)
    toast-context.jsx         # Toast notification context
    upload-validation.js      # File type/size validation
    sanitize-html.js          # HTML sanitizer (TipTap output)
    sanitize.js               # Input sanitization (XSS prevention)
    rate-limit.js             # Rate limiter (login attempts)
    audit.js                  # Audit logger (admin actions)
    reorder.js                # Drag-and-drop reorder utility
    errors.js                 # AppError class
middleware.js                 # Supabase session refresh + route guard
supabase/migrations/          # 4 SQL migrations (schema, RLS, columns, audit)
tests/                        # 34 test files, 202 tests
docs/                         # TODO.md, ADMIN_PROGRESS.md
```

## Key Architecture Rules

- **Route groups**: `(public)` has TopBar/Navbar/Footer; `(admin)` does not. Root layout is minimal (html/head/body only). Never add `<html>`, `<head>`, or `<body>` to route group layouts — this causes hydration errors.
- **Images**: `next/image` is disabled. Images use webpack `asset/resource` rule. Import images directly: `import img from '../assets/file.png'` and use `<img src={img} />`.
- **No `tailwind.config.js`**: Tailwind v4 uses `@theme` block in `globals.css`. Design tokens are defined there.
- **Server Actions**: All mutations use `'use server'` actions in `src/lib/actions/`. No API routes for data mutation.
- **Data fetching**: Public pages use `src/lib/data/public.js` (server-side, RLS-filtered). Admin pages fetch directly via Supabase server client.
- **Auth flow**: Admin uses email/password. Customers use SMS OTP + LINE Login. Middleware protects `/admin/*` and `/account/*` routes.

## Design System

Use Tailwind token classes — never hardcode hex values in new code.

| Token | Class | Usage |
|-------|-------|-------|
| `--color-orange` `#ff7e1b` | `text-orange`, `bg-orange` | Brand primary, CTAs |
| `--color-black` `#35383b` | `text-black`, `bg-black` | Body text, headings |
| `--color-grey` `#bfbfbf` | `text-grey`, `bg-grey` | Secondary, muted |
| `--color-brown` `#915e36` | `text-brown`, `bg-brown` | Accent |
| `--color-dark-brown` `#3e261f` | `text-dark-brown` | Deep accent |
| `--color-beige` `#f8f3ea` | `bg-beige` | Section backgrounds |
| `--color-dark` `#494c4f` | `bg-dark` | Footer background |

Layout: `max-w-[1212px]` containers, mobile-first with `lg:` breakpoint.

## Current State

- **Frontend + Backend**: 46 pages (12 public + 34 admin), all wired to Supabase
- **Auth**: Admin email/password login, customer SMS OTP + LINE Login, forgot-password flow
- **Testing**: 202 tests (199 pass, 3 pre-existing validation failures)
- **Known bugs**: 5 runtime bugs tracked in `.planning/PROJECT.md` (TipTap SSR crash, dnd-kit hydration, missing banner create page, profile HTML display, gallery order off-by-one)
- **Next milestone**: Bug Fixes. See `.planning/ROADMAP.md`.

## User Model

Two user types:
- **Admin** (`/admin/*`): email + password login via Supabase Auth. Roles: `admin`, `editor`.
- **Customer** (public site): SMS OTP + LINE Login via Supabase Auth. Can browse products and submit quotation requests.

## Commands

```bash
npm run dev          # Start dev server (uses --webpack flag)
npm run build        # Production build
npm run start        # Start production server
npm run lint         # ESLint
npm test             # Vitest (run once)
npm run test:watch   # Vitest (watch mode)
npm run test:e2e     # Playwright E2E tests
```

## MCP Servers

Both are configured as Claude Code plugins (enabled in `~/.claude/settings.json`).

### Figma MCP

- **Plugin**: `figma@claude-plugins-official`
- **Remote**: `https://mcp.figma.com/mcp` (cloud API)
- **Local**: `http://127.0.0.1:3845/mcp` (Figma desktop app)
- **Tools**: `get_design_context` (code gen), `get_screenshot`, `get_metadata`, `get_variable_defs`
- **Usage**: Pass Figma URLs with `?node-id=` to extract designs. Use `get_design_context` for code generation, `get_screenshot` for visual reference.

### Chrome DevTools MCP

- **Plugin**: `chrome-devtools-mcp@chrome-devtools-plugins`
- **Command**: `npx chrome-devtools-mcp@latest`
- **Tools**: `navigate_page`, `take_snapshot`, `take_screenshot`, `list_console_messages`, `click`, `fill`, `evaluate_script`, `performance_start_trace`
- **Usage**: Debug hydration errors, check console messages, automate browser interactions. Run `npm run dev` first, then navigate to `http://localhost:3000`.

## Git Workflow for Autonomous Loop Sessions

When running in an autonomous loop (e.g. ralph-loop), follow this workflow:

1. **Always create a feature branch before starting work:**
   ```bash
   git checkout -b ai/<task-name>    # e.g. ai/phase6-bugfixes
   ```

2. **Commit after each completed sub-task** — small, frequent commits. Never batch everything into one commit at the end.

3. **Never force push, amend commits, or run destructive git commands** during a loop.

4. **Never commit `.env.local` or credentials.**

5. **If a build fails, fix it before moving on** — don't accumulate broken commits.

6. **When the loop finishes**, the user will review the full diff against main:
   ```bash
   git diff main...HEAD
   git log --oneline main..HEAD
   ```
   Then decide to merge or discard the branch.

## Conventions

- One component per file in `src/components/`
- Admin shared components in `src/components/admin/`
- `'use client'` on interactive pages; prefer Server Components for data-fetching pages
- Thai is the primary language; all UI text is currently hardcoded in Thai
- Border color: `border-[#e5e7eb]` (Tailwind gray-200)
- Placeholder backgrounds: `bg-[#e8e3da]` or `bg-[#d9d9d9]`

## Documentation

- `.planning/PROJECT.md` — project context and requirements
- `.planning/ROADMAP.md` — phased implementation roadmap
- `.planning/codebase/` — 7 codebase analysis documents
