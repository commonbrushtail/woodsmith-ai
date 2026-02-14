# WoodSmith AI

Thai woodworking and construction materials company website with an admin CMS.

## Tech Stack

- **Framework**: Next.js 16 (App Router) with `--webpack` flag
- **UI**: React 19, JavaScript (JSX, no TypeScript)
- **Styling**: Tailwind CSS v4 — tokens in `@theme` block in `src/app/globals.css`, no `tailwind.config.js`
- **Carousel**: Swiper 12
- **Backend (planned)**: Supabase (PostgreSQL + Auth + Storage)
- **Fonts**: IBM Plex Sans Thai (primary), Circular Std (display) — loaded via `<link>` in root layout

## Project Structure

```
src/
  app/
    layout.jsx              # Root layout: <html>, <head>, <body>, fonts only
    globals.css             # Tailwind + @theme design tokens
    (public)/               # Public site route group
      layout.jsx            # TopBar + Navbar + Footer + LineFAB wrapper
      page.jsx              # Homepage
      about/, blog/, branches/, faq/, highlight/, manual/
      products/, product/   # Product listing and detail pages
    (admin)/                # Admin CMS route group
      layout.jsx            # Metadata only, passes through children
      login/                # Login + forgot-password pages
      admin/
        layout.jsx          # Sidebar + main content wrapper
        dashboard/, products/, banner/, blog/, video-highlight/
        gallery/, manual/, about-us/, branch/, faq/
        quotations/, users/, profile/, account/
  components/
    admin/                  # AdminSidebar, AdminTable, AdminButton, AdminInput, AdminModal, AdminEmptyState, AdminHeader
    *.jsx                   # Public components (TopBar, Navbar, Footer, HeroSection, etc.)
  assets/                   # Images and SVGs (imported as hashed URLs via webpack)
```

## Key Architecture Rules

- **Route groups**: `(public)` has TopBar/Navbar/Footer; `(admin)` does not. Root layout is minimal (html/head/body only). Never add `<html>`, `<head>`, or `<body>` to route group layouts — this causes hydration errors.
- **Images**: `next/image` is disabled. Images use webpack `asset/resource` rule. Import images directly: `import img from '../assets/file.png'` and use `<img src={img} />`.
- **No `tailwind.config.js`**: Tailwind v4 uses `@theme` block in `globals.css`. Design tokens are defined there.

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

- **Frontend**: Complete. 38 pages (12 public + 26 admin) with full UI.
- **Backend**: None. All data is hardcoded mock arrays. No database, no API routes, no auth, no middleware, no `.env` files.
- **Next milestone**: Phase 1 Infrastructure — Supabase setup (DB + Auth + Storage). See `docs/TODO.md`.

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
   git checkout -b ai/<task-name>    # e.g. ai/phase1-supabase-auth
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

- `docs/ARCHITECTURE.md` — full system overview, route map, component inventory
- `docs/ADMIN_PROGRESS.md` — page-by-page CMS status checklist
- `docs/TODO.md` — phased implementation roadmap
- `docs/TDD_PLAN.md` — test-driven implementation plan (Phase 1, step-by-step with test code)
