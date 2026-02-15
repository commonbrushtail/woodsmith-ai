# WoodSmith AI

## What This Is

A Thai woodworking and construction materials website combining corporate branding with an ecommerce-style product catalog. Instead of a shopping cart, customers submit quotation requests. Includes a full admin CMS for managing products, content, and quotations, plus customer authentication via SMS OTP and LINE Login. All runtime bugs from initial development have been resolved with comprehensive test coverage.

## Core Value

Customers can browse products and submit quotation requests seamlessly — the quotation flow must work flawlessly end-to-end.

## Requirements

### Validated

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
- ✓ TipTap SSR-safe rendering on all admin pages — v1.0
- ✓ Banner create page with file upload — v1.0
- ✓ dnd-kit hydration-safe sortable lists (DndContext outside table) — v1.0
- ✓ Admin profile displays clean plain text (HTML stripping) — v1.0
- ✓ Gallery 1-based sort order display — v1.0
- ✓ 396 unit/integration tests with TDD methodology — v1.0

### Active

#### Current Milestone: v1.1 Variations Management

**Goal:** Reusable product variation groups managed centrally, linked to products with per-product entry selection.

- [ ] Admin can create/edit/delete variation groups (e.g., สี, ขนาด, พื้นผิว) with entries (label + optional image)
- [ ] Admin can link variation groups to products with per-product entry selection
- [ ] Admin can add custom variation entries on-the-fly in product create/edit
- [ ] Variation group changes sync to all linked products
- [ ] Dedicated admin pages: variation list, create, edit

### Out of Scope

- Performance optimization — not blocking usage
- SEO improvements — deferred to future milestone
- Mobile app — web-first approach
- Shopping cart / payment system — quotation-based business model
- TypeScript migration — working codebase in JS, not worth the disruption now
- i18n / English translation — Thai-only for now

## Context

- **Brownfield project**: 46 pages (12 public + 34 admin), all wired to Supabase
- **Testing**: 396 tests (393 pass, 3 pre-existing validation failures in quotations.test.js)
- **v1.0 shipped**: 5 runtime bugs fixed with TDD, test suite nearly doubled
- **Codebase map**: `.planning/codebase/` contains 7 analysis documents
- **Thai language**: All UI text is hardcoded in Thai
- **Design system**: Tailwind v4 tokens in `@theme` block — `text-orange`, `bg-beige`, etc.

## Constraints

- **Tech stack**: Next.js 16 App Router, React 19, JavaScript (no TypeScript), Tailwind CSS v4, Supabase
- **Images**: `next/image` disabled; use webpack `asset/resource` imports
- **No tailwind.config.js**: Design tokens live in `@theme` block in `src/app/globals.css`
- **Server Actions only**: No API routes for mutations — all CRUD via `'use server'` actions

## Key Decisions

| Decision | Rationale | Outcome |
|----------|-----------|---------|
| Bug fixes before new features | Stabilize existing code, prevent compounding issues | ✓ Good — all 5 bugs fixed, codebase stable |
| TDD methodology | Ensure fixes don't regress, build confidence in codebase | ✓ Good — 194 new tests, caught edge cases early |
| Ralph Loop for execution | Autonomous implementation after thorough planning | ✓ Good — 5 plans executed autonomously |
| GSD workflow for planning | Structured approach to organize AI-assisted development | ✓ Good — clear phases, verifiable milestones |
| `immediatelyRender: false` for TipTap | SSR-safe config, official TipTap recommendation | ✓ Good — zero SSR crashes |
| DndContext outside table boundary | HTML5 spec compliance, eliminates hydration warnings | ✓ Good — zero console warnings |
| DOMParser + regex fallback for HTML stripping | Robust entity handling client-side, works server-side too | ✓ Good — handles all edge cases |
| Display-layer sort_order + 1 | No database migration needed, simple and safe | ✓ Good — user-friendly numbering |

| Linked variation groups with per-product entry selection | Flexible: shared groups reduce repetitive data entry, per-product picks allow product-specific customization | — Pending |
| Start fresh for variations (keep existing product_options) | Avoids risky data migration, existing products unaffected | — Pending |

---
*Last updated: 2026-02-15 after v1.1 milestone start*
