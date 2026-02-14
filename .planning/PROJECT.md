# WoodSmith AI

## What This Is

A Thai woodworking and construction materials website combining corporate branding with an ecommerce-style product catalog. Instead of a shopping cart, customers submit quotation requests. Includes a full admin CMS for managing products, content, and quotations, plus customer authentication via SMS OTP and LINE Login.

## Core Value

Customers can browse products and submit quotation requests seamlessly — the quotation flow must work flawlessly end-to-end.

## Requirements

### Validated

<!-- Shipped and confirmed valuable. Inferred from existing codebase (46 pages, 202 tests). -->

- ✓ Public storefront with product catalog, blog, gallery, FAQ, branches, manuals — existing
- ✓ Admin CMS with CRUD for all content types (products, blog, banners, gallery, video highlights, manuals, FAQ, about, branches) — existing
- ✓ Admin email/password authentication with role-based access (admin, editor) — existing
- ✓ Customer SMS OTP + LINE Login authentication — existing
- ✓ Quotation request system (customer submits, admin manages) — existing
- ✓ Admin user management (create, edit, delete users) — existing
- ✓ Rich text editing for blog posts and product descriptions (TipTap) — existing
- ✓ Drag-and-drop reordering for banners, gallery, FAQ, manuals, video highlights (dnd-kit) — existing
- ✓ Image upload to Supabase Storage (6 buckets) — existing
- ✓ Input validation (Zod schemas) and sanitization (XSS prevention) — existing
- ✓ Audit logging for admin actions — existing
- ✓ Rate limiting on login attempts — existing
- ✓ Middleware route protection with RLS database policies — existing
- ✓ Responsive design with Tailwind CSS v4 design tokens — existing
- ✓ 202 unit/integration tests (Vitest + Testing Library) — existing

### Active

<!-- Current scope: Bug fix milestone. -->

- [ ] Fix TipTap SSR crash on 5+ admin pages
- [ ] Fix dnd-kit hydration mismatch on 5 sortable list pages
- [ ] Create missing banner create page (`/admin/banner/create`)
- [ ] Fix profile page raw HTML display
- [ ] Fix gallery order off-by-one error
- [ ] Add test coverage for all 5 bug fixes

### Out of Scope

- New features — stabilize existing code first
- Performance optimization — not blocking usage
- SEO improvements — deferred to future milestone
- Mobile app — web-first approach
- Shopping cart / payment system — quotation-based business model

## Context

- **Brownfield project**: 46 pages (12 public + 34 admin), all wired to Supabase
- **Testing**: 202 tests exist (199 pass, 3 pre-existing validation failures)
- **Known bugs**: 5 runtime bugs documented in `docs/TODO.md` Phase 6
- **Codebase map**: `.planning/codebase/` contains 7 analysis documents
- **Thai language**: All UI text is hardcoded in Thai
- **Design system**: Tailwind v4 tokens in `@theme` block — `text-orange`, `bg-beige`, etc.

## Constraints

- **Tech stack**: Next.js 16 App Router, React 19, JavaScript (no TypeScript), Tailwind CSS v4, Supabase
- **Methodology**: Test-Driven Development — write failing tests first, then implement fixes
- **Execution**: Plans executed via Ralph Loop (autonomous AI loop) — plans must be detailed and self-contained
- **Images**: `next/image` disabled; use webpack `asset/resource` imports
- **No tailwind.config.js**: Design tokens live in `@theme` block in `src/app/globals.css`
- **Server Actions only**: No API routes for mutations — all CRUD via `'use server'` actions

## Key Decisions

| Decision | Rationale | Outcome |
|----------|-----------|---------|
| Bug fixes before new features | Stabilize existing code, prevent compounding issues | — Pending |
| TDD methodology | Ensure fixes don't regress, build confidence in codebase | — Pending |
| Ralph Loop for execution | Autonomous implementation after thorough planning | — Pending |
| GSD workflow for planning | Structured approach to organize AI-assisted development | — Pending |

---
*Last updated: 2026-02-15 after initialization*
