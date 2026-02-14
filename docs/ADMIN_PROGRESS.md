# Admin CMS Progress

This document tracks the implementation status of the WoodSmith AI admin CMS.
All admin routes live under `src/app/(admin)/`. The project uses Next.js 16 App Router
with React 19 and Tailwind CSS 4.

**Current state:** All admin pages have full UI. Backend infrastructure is implemented:
Supabase integration (auth, DB, storage), server actions with Zod validation for all
content types, middleware route protection, rate limiting, audit logging, input
sanitization, rich text editing (TipTap), drag-and-drop reordering (@dnd-kit), error
boundaries, loading skeletons, and 40 test files (unit + E2E). No traditional API routes
— all mutations use Next.js server actions.

> **Runtime audit (2026-02-15):** Chrome DevTools inspection found 5 bugs:
> 1. **TipTap SSR crash (Critical)** — `RichTextEditor` missing `immediatelyRender: false`, crashes all pages that use it (about-us, blog create/edit, products create/edit). ErrorBoundary shows fallback.
> 2. **dnd-kit hydration error (Medium)** — `SortableList` renders `<div>` inside `<table>`, causing hydration mismatch on 5 list pages (banner, video-highlight, gallery, FAQ, manual).
> 3. **Banner create page missing (Medium)** — `/admin/banner/create` returns 404; "Create new entry" link on list page is broken.
> 4. **Profile raw HTML display (Low)** — Company name field shows `<p>` tags in text input instead of plain text.
> 5. **Gallery order off-by-one (Low)** — First item displays order "0" instead of "1".

---

## Shared Components

| Component | File | Status | Notes |
|-----------|------|--------|-------|
| AdminSidebar | `src/components/admin/AdminSidebar.jsx` | Done | Three icon sections (Content, Quotation, Users) with submenu panel. Uses `usePathname()` to highlight active route. |
| AdminTable | `src/components/admin/AdminTable.jsx` | Done | Reusable table with pagination, row selection checkboxes. Props: `columns`, `data`, `onPageChange`, `itemsPerPage`. |
| AdminButton | `src/components/admin/AdminButton.jsx` | Done | Variants: `primary`, `secondary`, `danger`. |
| AdminInput | `src/components/admin/AdminInput.jsx` | Done | Supports types: `text`, `textarea`, `select`, `file`. Has `error` prop for inline Zod validation messages (red border + error text). |
| AdminFileInput | `src/components/admin/AdminFileInput.jsx` | Done | File upload with image preview, client-side type/size validation (`upload-validation.js`), human-readable size display, remove/replace button. |
| AdminModal | `src/components/admin/AdminModal.jsx` | Done | Confirmation dialog with backdrop. |
| AdminEmptyState | `src/components/admin/AdminEmptyState.jsx` | Done | Icon, title, description, and optional action button. |
| AdminHeader | `src/components/admin/AdminHeader.jsx` | Done | Displays page title from pathname lookup. Language selector is non-functional (no i18n). |
| AdminSkeleton | `src/components/admin/AdminSkeleton.jsx` | Done | `TableSkeleton` and `FormSkeleton` for loading states. Used in 7 admin `loading.jsx` files. |
| RichTextEditor | `src/components/admin/RichTextEditor.jsx` | **BUG** | TipTap with StarterKit, Image, Link extensions. **Crashes at runtime** — missing `immediatelyRender: false` causes SSR hydration error. ErrorBoundary catches it, showing fallback UI. |
| SortableList | `src/components/admin/SortableList.jsx` | **BUG** | `@dnd-kit` wrapper with drag handles, keyboard accessible. **Hydration error** — renders hidden `<div>` inside `<table>`, invalid HTML. Functional but console errors on all 5 list pages. |
| ErrorBoundary | `src/components/ErrorBoundary.jsx` | Done | Class component with fallback UI and retry button. Wraps children in admin and public layouts. |

### List Client Components

These handle client-side interactivity (search, delete modals, drag-and-drop) for admin list pages:

| Component | File |
|-----------|------|
| BannersListClient | `src/components/admin/BannersListClient.jsx` |
| BlogListClient | `src/components/admin/BlogListClient.jsx` |
| BranchListClient | `src/components/admin/BranchListClient.jsx` |
| FaqListClient | `src/components/admin/FaqListClient.jsx` |
| GalleryListClient | `src/components/admin/GalleryListClient.jsx` |
| ManualsListClient | `src/components/admin/ManualsListClient.jsx` |
| ProductsListClient | `src/components/admin/ProductsListClient.jsx` |
| QuotationListClient | `src/components/admin/QuotationListClient.jsx` |
| UserListClient | `src/components/admin/UserListClient.jsx` |
| VideoHighlightsListClient | `src/components/admin/VideoHighlightsListClient.jsx` |

---

## Page-by-Page Status

### Login

Pages: `/login`, `/login/forgot-password`, `/login/forgot-password/sent`

| Requirement | Status | Notes |
|------------|--------|-------|
| Frontend UI | [x] Done | Login form with email, password, show/hide toggle, remember-me checkbox. Forgot-password flow has two sub-pages. |
| Authentication logic | [x] Done | `admin-login.js` server action validates credentials via Supabase Auth. |
| Form validation | [x] Done | Zod validation on email/password fields. |
| Error handling | [x] Done | Error messages displayed on failed login. |
| Rate limiting | [x] Done | 5 attempts per minute per IP via `rate-limit.js`. |
| Audit logging | [x] Done | Login attempts logged via `audit.js`. |
| Password reset flow | [x] Done | `requestPasswordReset()` in `auth.js`, wired to forgot-password pages. Reset callback at `src/app/auth/reset-password/route.js`. |

### Dashboard

Page: `/admin/dashboard`

| Requirement | Status | Notes |
|------------|--------|-------|
| Frontend UI | [~] Partial | Renders AdminHeader and placeholder content. |
| Server action | [x] Done | `dashboard.js` action exists. |
| Loading state | [x] Done | `loading.jsx` with skeleton. |
| Statistics / charts | [ ] Not started | No charts or analytics widgets. |

### Products

Pages: `/admin/products` (list), `/admin/products/create`, `/admin/products/edit/[id]`

| Requirement | Status | Notes |
|------------|--------|-------|
| Frontend UI | [x] Done | List page with table, search, pagination. Create page with tabbed form. |
| Server actions | [x] Done | `products.js` — full CRUD (create, read, update, delete). |
| Zod validation | [x] Done | `validations/products.js` — `productCreateSchema`, `productUpdateSchema`. |
| Form validation UX | [x] Done | `useFormErrors` hook wired, inline error messages on AdminInput fields. |
| Error handling | [x] Done | ErrorBoundary wrapper + server action error returns. |
| File uploads | [x] Done | `AdminFileInput` with client-side validation. Storage via `storage.js`. |
| Edit page | [x] Done | `/admin/products/edit/[id]` with `ProductEditClient.jsx`. |
| Rich text editor | [!] **BUG** | TipTap `RichTextEditor` crashes on create/edit — SSR hydration error. ErrorBoundary shows fallback. |
| Loading state | [x] Done | `loading.jsx` with `TableSkeleton`. |

### Banner

Pages: `/admin/banner` (list), `/admin/banner/edit/[id]`

**Note:** Create page (`/admin/banner/create`) does **not exist** — the "Create new entry" link on the list page returns 404.

| Requirement | Status | Notes |
|------------|--------|-------|
| Frontend UI | [~] Partial | List page with table. Edit page exists. **Create page missing (404).** |
| Server actions | [x] Done | `banners.js` — full CRUD + reorder. |
| Drag-and-drop | [~] Hydration bug | `SortableList` wired in `BannersListClient.jsx`. Hydration error: `<div>` inside `<table>`. |
| Form validation UX | [x] Done | `useFormErrors` wired in edit page. |
| File uploads | [x] Done | `AdminFileInput` for banner images. |
| Loading state | [x] Done | `loading.jsx` with skeleton. |

### Blog

Pages: `/admin/blog` (list), `/admin/blog/create`, `/admin/blog/edit/[id]`

| Requirement | Status | Notes |
|------------|--------|-------|
| Frontend UI | [x] Done | List page with sorting, action dropdown. Create and edit pages. |
| Server actions | [x] Done | `blog.js` — full CRUD (get, create, update, delete). |
| Zod validation | [x] Done | `validations/blog.js` — `blogCreateSchema`. |
| Form validation UX | [x] Done | `useFormErrors` wired in create/edit pages. |
| Rich text editor | [!] **BUG** | TipTap `RichTextEditor` crashes on create/edit — SSR hydration error. ErrorBoundary shows fallback. |
| Edit page | [x] Done | `/admin/blog/edit/[id]` with `BlogEditClient.jsx`. |
| Loading state | [x] Done | `loading.jsx` with skeleton. |

### Video Highlight

Pages: `/admin/video-highlight` (list), `/admin/video-highlight/create`, `/admin/video-highlight/edit/[id]`

| Requirement | Status | Notes |
|------------|--------|-------|
| Frontend UI | [x] Done | List, create, and edit pages exist. |
| Server actions | [x] Done | `video-highlights.js` — full CRUD + reorder. |
| Drag-and-drop | [~] Hydration bug | `SortableList` wired in `VideoHighlightsListClient.jsx`. Hydration error: `<div>` inside `<table>`. |

### Gallery

Pages: `/admin/gallery` (list), `/admin/gallery/create`, `/admin/gallery/edit/[id]`

| Requirement | Status | Notes |
|------------|--------|-------|
| Frontend UI | [x] Done | List, create, and edit pages exist. |
| Server actions | [x] Done | `gallery.js` — full CRUD + reorder. |
| Drag-and-drop | [~] Hydration bug | `SortableList` wired in `GalleryListClient.jsx`. Hydration error: `<div>` inside `<table>`. Sort order display off-by-one (starts at 0). |
| File uploads | [x] Done | `AdminFileInput` for gallery images. |
| Loading state | [x] Done | `loading.jsx` with skeleton. |

### Manual

Pages: `/admin/manual` (list), `/admin/manual/create`, `/admin/manual/edit/[id]`

| Requirement | Status | Notes |
|------------|--------|-------|
| Frontend UI | [x] Done | List, create, and edit pages exist. |
| Server actions | [x] Done | `manuals.js` — full CRUD + reorder. |
| Drag-and-drop | [~] Hydration bug | `SortableList` wired in `ManualsListClient.jsx`. Hydration error: `<div>` inside `<table>`. |
| File uploads | [x] Done | `AdminFileInput` for document uploads. |

### About Us

Page: `/admin/about-us` (single-page editor)

| Requirement | Status | Notes |
|------------|--------|-------|
| Frontend UI | [!] **BUG** | Page crashes at runtime — TipTap SSR error. ErrorBoundary shows fallback UI. |
| Server actions | [x] Done | `about-us.js` — read and update. |
| Rich text editor | [!] **BUG** | TipTap `RichTextEditor` crashes — SSR hydration error. |

### Branch

Pages: `/admin/branch` (list), `/admin/branch/create`, `/admin/branch/edit/[id]`

| Requirement | Status | Notes |
|------------|--------|-------|
| Frontend UI | [x] Done | List, create, and edit pages exist. |
| Server actions | [x] Done | `branches.js` — full CRUD. |
| Form validation UX | [x] Done | `useFormErrors` wired in create page. |

### FAQ

Pages: `/admin/faq` (list), `/admin/faq/create`, `/admin/faq/edit/[id]`

| Requirement | Status | Notes |
|------------|--------|-------|
| Frontend UI | [x] Done | List, create, and edit pages exist. |
| Server actions | [x] Done | `faqs.js` — full CRUD + reorder. |
| Drag-and-drop | [~] Hydration bug | `SortableList` wired in `FaqListClient.jsx`. Hydration error: `<div>` inside `<table>`. |
| Form validation UX | [x] Done | `useFormErrors` wired in create page. |

### Quotations

Pages: `/admin/quotations` (list), `/admin/quotations/[id]` (detail view)

| Requirement | Status | Notes |
|------------|--------|-------|
| Frontend UI | [x] Done | List page and detail page with status dropdown. |
| Server actions | [x] Done | `quotations.js` — getQuotations, getQuotation, updateQuotationStatus. |
| Zod validation | [x] Done | `validations/quotations.js` — `quotationStatusSchema`. |
| Loading state | [x] Done | `loading.jsx` with skeleton. |

### Users

Page: `/admin/users`

| Requirement | Status | Notes |
|------------|--------|-------|
| Frontend UI | [x] Done | Sub-navigation with "Roles" and "Users" tabs. |
| Server actions | [x] Done | `users.js` — user listing and management. |
| Loading state | [x] Done | `loading.jsx` with skeleton. |
| Role management | [~] Partial | Role UI exists; enforcement via middleware (admin/editor roles). |
| User invitation | [~] Partial | Server action exists; needs email delivery verification. |

### Profile

Page: `/admin/profile`

| Requirement | Status | Notes |
|------------|--------|-------|
| Frontend UI | [~] Bug | Profile page with form fields. **Company name field shows raw HTML** (`<p>` tags visible in text input). |
| Server actions | [x] Done | `profile.js` — read and update profile. |

### Account

Page: `/admin/account`

| Requirement | Status | Notes |
|------------|--------|-------|
| Frontend UI | [x] Done | Account settings page with form fields. |
| Server actions | [x] Done | `account.js` — account operations. |
| Password change | [x] Done | `auth.js` — `updatePassword()` function. |

---

## Cross-Cutting Concerns

| Concern | Status | Notes |
|---------|--------|-------|
| Admin auth (email + password) | [x] Done | `admin-login.js` server action + Supabase Auth. Rate-limited (5/min) with audit logging. |
| Customer auth (SMS OTP) | [x] Done | Supabase Auth phone provider wired. E2E test: `e2e/auth/customer-otp.spec.js`. |
| Customer auth (LINE Login) | [x] Done | `line-config.js` URL builder + callback validator. `LoginModal.jsx` wired to `signInWithOAuth`. Auth callback route handles LINE provider. |
| Authorization / RBAC | [x] Done | `middleware.js` enforces admin/editor roles for `/admin/*`. `route-rules.js` pure function with role-based routing. |
| Session management | [x] Done | Supabase SSR session refresh in middleware. Server/client cookie-based auth. |
| Database | [x] Done | Supabase (PostgreSQL). `@supabase/supabase-js` v2.95.3 + `@supabase/ssr` v0.8.0. Three client modules: `client.js` (browser), `server.js` (SSR), `admin.js` (service role). |
| Server actions | [x] Done | 18 action files in `src/lib/actions/` covering all content types. No API routes needed. |
| Middleware | [x] Done | `middleware.js` at project root. Protects `/admin/*` (admin/editor), `/account/*` (any auth), redirects authenticated users from `/login`. |
| File storage | [x] Done | `src/lib/storage.js` — `uploadFile()`, `deleteFile()`, `getPublicUrl()` via Supabase Storage. `AdminFileInput` component for upload UX. |
| Zod validation | [x] Done | Schemas for products, blog, quotations in `src/lib/validations/`. Zod v4.3.6. |
| Input sanitization | [x] Done | `src/lib/sanitize.js` — `sanitizeInput()`, `sanitizeObject()`. Strips null bytes, control chars. Wired into server actions. |
| Rate limiting | [x] Done | `src/lib/rate-limit.js` — `createRateLimiter()`. Login: 5/min. Password reset: 3/15min. In-memory sliding window. |
| Audit logging | [x] Done | `src/lib/audit.js` — `buildAuditEntry()`, `logAudit()`. Wired into login, critical actions. |
| Error helpers | [x] Done | `src/lib/errors.js` — `AppError`, `notFound()`, `unauthorized()`, `forbidden()`, `badRequest()`. |
| Error boundaries | [x] Done | `src/components/ErrorBoundary.jsx` in admin and public layouts. |
| Loading states | [x] Done | 7 admin `loading.jsx` files (products, blog, banner, gallery, quotations, users, dashboard) + 2 public (products, blog). |
| Rich text editing | [!] **BUG** | TipTap `RichTextEditor` **crashes at runtime** on all pages (products create/edit, blog create/edit, about-us). Missing `immediatelyRender: false` — SSR hydration error. |
| HTML sanitization | [x] Done | `src/lib/sanitize-html.js` — allowlist-based sanitizer. `SafeHtmlContent` component for public pages. |
| Drag-and-drop | [~] Hydration bug | `@dnd-kit` (core, sortable, utilities). `SortableList` renders hidden `<div>` inside `<table>` — hydration error on all 5 list pages (banner, gallery, FAQ, manual, video-highlight). Functional but console errors. |
| Form validation UX | [x] Done | `useFormErrors` hook + `AdminInput` error prop. Inline field-level error display with red border. |
| Reorder utility | [x] Done | `src/lib/reorder.js` — `reorderItems()`, `buildSortOrderUpdates()`. |
| Upload validation | [x] Done | `src/lib/upload-validation.js` — client-side file type/size validation. |
| Public data layer | [x] Done | `src/lib/data/public.js` — `getPublishedProducts()`, `getPublishedBlogPosts()`, etc. RLS-filtered queries. |
| Environment config | [x] Done | `.env.local` (gitignored) + `.env.example`. Supabase, LINE Login, app vars. |
| Customer quotation flow | [x] Done | `QuotationModal` component + `customer.js` actions + `validations/quotations.js` schema. |
| Customer account pages | [x] Done | `/account` layout + profile page + `/account/quotations` page for viewing quotation history. |
| i18n | [ ] Not started | All Thai text hardcoded as string literals. Language selector non-functional. |

---

## Auth Routes

| Route | File | Purpose |
|-------|------|---------|
| `/auth/callback` | `src/app/auth/callback/route.js` | OAuth callback handler (LINE, etc.) |
| `/auth/reset-password` | `src/app/auth/reset-password/route.js` | Password reset callback, redirects to set-new-password |

---

## Testing

**36 unit/integration tests** in `tests/`:

| Category | Files | Coverage |
|----------|-------|----------|
| Supabase clients | `tests/lib/supabase/client.test.js`, `server.test.js` | Client creation, env vars |
| Database | `tests/lib/db.test.js` | Table existence verification |
| RLS policies | `tests/lib/rls.test.js` | Anon vs admin access |
| Storage | `tests/lib/storage.test.js` | Upload, delete, public URL |
| Error helpers | `tests/lib/errors.test.js` | AppError, factory functions |
| Validations | `tests/lib/validations/products.test.js`, `blog.test.js`, `quotations.test.js` | Schema acceptance/rejection |
| Upload validation | `tests/lib/upload-validation.test.js` | File type/size validation |
| Sanitize HTML | `tests/lib/sanitize-html.test.js` | XSS prevention |
| Input sanitize | `tests/lib/sanitize.test.js` | Null bytes, whitespace, Thai chars |
| Rate limit | `tests/lib/rate-limit.test.js` | Window expiry, per-key tracking |
| Audit | `tests/lib/audit.test.js` | Entry building, IP inclusion |
| Reorder | `tests/lib/reorder.test.js` | Array reorder, sort order updates |
| Middleware | `tests/middleware.test.js` | Route protection rules |
| Server actions | `tests/lib/actions/auth.test.js`, `products.test.js`, `blog.test.js`, `quotations.test.js`, `customer.test.js`, `account.test.js`, `search.test.js` | Validation paths, mock Supabase |
| Public data | `tests/lib/data/public.test.js` | Query building, error handling |
| Components | `admin-input.test.jsx`, `admin-file-input.test.jsx`, `admin-skeleton.test.jsx`, `rich-text-editor.test.jsx`, `safe-html-content.test.jsx`, `sortable-list.test.jsx`, `error-boundary.test.jsx`, `Toast.test.js`, `SearchOverlay.test.js` | Rendering, props, interactions |
| Hooks | `tests/hooks/use-form-errors.test.js` | State management, clear/set |
| Seed | `tests/seed.test.js` | Seed data verification |
| LINE auth | `tests/lib/auth/line-config.test.js` | URL generation, callback validation |

**4 E2E tests** in `e2e/`:

| File | Coverage |
|------|----------|
| `e2e/auth/admin-login.spec.js` | Login form, invalid credentials, redirect behavior |
| `e2e/auth/admin-logout.spec.js` | Logout + session verification |
| `e2e/auth/customer-otp.spec.js` | SMS OTP flow |
| `e2e/auth/customer-line.spec.js` | LINE Login button + redirect |

---

## Summary

- **Total admin pages:** 33 (login flow + dashboard + 13 content sections with list/create/edit)
- **Pages with UI complete:** 32 of 33 (dashboard statistics pending)
- **Pages with server actions:** 32 of 33
- **Pages with runtime bugs:** 10 (5 TipTap crashes + 5 dnd-kit hydration errors)
- **Missing pages:** 1 (banner/create — 404)
- **Edit pages:** 8 of 8 (all content types)
- **Server action files:** 18
- **Validation schemas:** 3 (products, blog, quotations)
- **Test files:** 40 (36 unit/integration + 4 E2E)
- **Authentication:** Done (admin email + customer OTP + LINE Login)
- **Middleware:** Done (role-based route protection)
- **Security:** Done (rate limiting, sanitization, audit logging)

### Active Bugs (from runtime audit)

| # | Bug | Severity | Affected Pages | Fix |
|---|-----|----------|----------------|-----|
| 1 | TipTap SSR crash | **Critical** | about-us, blog create/edit, products create/edit | Add `immediatelyRender: false` to `useEditor()` in `RichTextEditor.jsx` |
| 2 | dnd-kit `<div>` inside `<table>` | Medium | banner, video-highlight, gallery, FAQ, manual (list pages) | Move `DndContext`/`SortableContext` outside `<table>`, or use `<tbody>` as sortable container |
| 3 | Banner create page missing | Medium | `/admin/banner/create` returns 404 | Create `src/app/(admin)/admin/banner/create/page.jsx` |
| 4 | Profile raw HTML in text input | Low | `/admin/profile` | Strip HTML tags before displaying in plain text input, or use RichTextEditor |
| 5 | Gallery order off-by-one | Low | `/admin/gallery` | Fix sort_order indexing (0-based → 1-based display) |

### Remaining Work

| Item | Notes |
|------|-------|
| **Fix TipTap SSR crash** | Add `immediatelyRender: false` to `useEditor()` — blocks 5+ admin pages |
| **Fix dnd-kit hydration error** | Restructure `SortableList` to avoid `<div>` inside `<table>` |
| **Create banner/create page** | Route missing, "Create new entry" link broken |
| **Fix profile HTML display** | Strip `<p>` tags from company name field |
| **Fix gallery order display** | Off-by-one in sort order numbering |
| Dashboard statistics/charts | Placeholder content only |
| i18n | All Thai text hardcoded; language selector non-functional |
| Real-time features | No WebSocket or Supabase Realtime subscriptions |
| Email delivery | Password reset and user invitation need email provider verification |
