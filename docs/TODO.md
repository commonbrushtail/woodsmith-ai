# WoodSmith AI — Project Roadmap

Full-stack Thai woodworking website with admin CMS, customer auth, and
public storefront. All pages wired to Supabase.

---

## Phase 1 — Infrastructure ✅ COMPLETE

**Branch:** `ai/phase1-tdd` (11 commits, 57 tests passing)

- [x] Supabase project (PostgreSQL, 14 tables, 5 enums)
- [x] `.env.local` / `.env.example`
- [x] Migrations: `001_initial_schema.sql`, `002_rls_policies.sql`
- [x] RLS policies (anon reads published, customers CRUD own quotations)
- [x] Seed script (`scripts/seed.js`)
- [x] Supabase clients: browser, server (cookies), admin (service role)
- [x] Auth: admin email/password login, customer OTP, logout
- [x] Middleware + route protection (`getRouteAction`)
- [x] 6 storage buckets + `src/lib/storage.js`
- [x] Vitest + Playwright, Zod schemas, AppError, 57 tests

---

## Phase 2+3 — Admin CMS Wiring ✅ COMPLETE

All 26 admin pages wired to Supabase with Server Actions.

### Session 1 ✅ — Products, Banners, Blog, Dashboard

**Branch:** `ai/phase2-session1`

- [x] `src/lib/actions/products.js` — CRUD, togglePublish, toggleRecommended, reorder, product_images, product_options
- [x] `src/lib/actions/banners.js` — CRUD, toggleStatus, reorder, image upload
- [x] `src/lib/actions/blog.js` — CRUD, togglePublish, toggleRecommended, cover image upload
- [x] `src/lib/actions/dashboard.js` — aggregate stats (products, quotations, blog, users)
- [x] Edit pages created for products, banners, blog

### Session 2 ✅ — Video, Gallery, Manual, About Us, Branch, FAQ

**Branch:** `ai/phase2-session2`

- [x] `src/lib/actions/videos.js` — CRUD, togglePublish, reorder
- [x] `src/lib/actions/gallery.js` — CRUD, togglePublish, reorder, image upload
- [x] `src/lib/actions/manuals.js` — CRUD, togglePublish, reorder, PDF upload
- [x] `src/lib/actions/about.js` — get/update singleton
- [x] `src/lib/actions/branches.js` — CRUD, togglePublish, reorder
- [x] `src/lib/actions/faqs.js` — CRUD, togglePublish, reorder
- [x] Edit pages created for all sections

### Session 3 ✅ — Users, Quotations, Profile, Account

**Branch:** `ai/phase2-session3`

- [x] `src/lib/actions/users.js` — list, invite (admin API), updateRole, deactivate
- [x] `src/lib/actions/quotations.js` — list, getById, updateStatus, addNotes, delete
- [x] `src/lib/actions/profile.js` — getProfile, updateProfile, avatar upload
- [x] `src/lib/actions/account.js` — updatePassword, updateEmail (session-based)
- [x] All admin pages use real DB data (zero mock arrays)

---

## Phase 3B — Customer-Facing Features ✅ COMPLETE

### Session 1 ✅ — Public Data Wiring

**Branch:** `ai/phase3b-session1`

- [x] `supabase/migrations/003_public_columns.sql` — added category, region, hours, group_title, etc.
- [x] `src/lib/data/public.js` — 13 public data-fetching functions (RLS-filtered)
- [x] All 12 public pages wired to Supabase (Homepage, Products, Blog, Branches, FAQ, Highlight, Manual, About, Gallery)
- [x] Homepage section components accept data as props
- [x] Product category filter + search working
- [x] Blog category filter working
- [x] Branch region tabs working

### Session 2 ✅ — Auth Flow + Customer Features

**Branch:** `ai/phase3b-session2`

- [x] `src/app/auth/callback/route.js` — OAuth callback handler
- [x] Navbar auth state (session check, onAuthStateChange, user dropdown)
- [x] LoginModal registration wiring (updateUser + createCustomerProfile)
- [x] QuotationModal full form (pre-fill from session, auth gate)
- [x] `src/lib/actions/customer.js` — createProfile, getProfile, updateProfile, submitQuotation, getMyQuotations
- [x] Customer account layout + profile page + quotations list page
- [x] `/account/*` route protection via middleware

---

## Phase 4 — Polish ✅ COMPLETE

### Session 0 ✅ — Toast, Validation, Search

**Branch:** `ai/phase4-polish`

- [x] Toast notification system (`src/components/Toast.jsx` + `src/lib/toast-context.jsx`)
- [x] ToastProvider in admin layout
- [x] All `alert()` calls replaced with `toast.success()` / `toast.error()` across all admin pages
- [x] Zod validation wired into server actions (products, blog, quotations, customer)
- [x] Structured `fieldErrors` returned from server actions
- [x] Admin account page fixed (session-based auth, no client-passed userId)
- [x] SearchOverlay wired to real Supabase data (search, popular categories, recent searches in localStorage)
- [x] `npm run build` passes cleanly

### Session 1 ✅ — Inline Validation UX + Error Boundaries

**Branch:** `ai/phase4-s1-validation-ux` (4 commits)

- [x] `src/lib/hooks/use-form-errors.js` — useFormErrors hook with TDD
- [x] `src/components/admin/AdminInput.jsx` — error prop support with TDD
- [x] Wired useFormErrors into admin product and blog forms
- [x] `src/components/ErrorBoundary.jsx` — error boundary component with TDD

### Session 2 ✅ — Loading States + Upload Validation

**Branch:** `ai/phase4-s2-loading-uploads` (5 commits)

- [x] `src/components/admin/AdminSkeleton.jsx` — TableSkeleton, FormSkeleton, CardSkeleton with TDD
- [x] `loading.jsx` skeletons for 7 admin pages and 2 public pages
- [x] `src/lib/upload-validation.js` — validateFile, formatFileSize with TDD
- [x] `src/components/admin/AdminFileInput.jsx` — file input with validation, wired into 8 admin upload pages

### Remaining (nice-to-have)

- [ ] Image preview before upload
- [ ] Upload progress indicators

---

## Phase 5 — Enhancements ✅ CORE COMPLETE

### Session 3 ✅ — Rich Text Editing (TipTap)

**Branch:** `ai/phase5-s3-tiptap` (5 commits)

- [x] `src/components/admin/RichTextEditor.jsx` — TipTap editor component with TDD (6 tests)
- [x] `src/lib/sanitize-html.js` — HTML sanitizer utility with TDD (15 tests)
- [x] `src/components/SafeHtmlContent.jsx` — XSS-safe rendering component with TDD
- [x] Wired RichTextEditor into 5 admin pages (products create/edit, blog create/edit, about-us)
- [x] SafeHtmlContent used on public blog + product detail pages

### Session 4 ✅ — Drag-and-Drop Reordering

**Branch:** `ai/phase5-s4-drag-drop` (5 commits)

- [x] `src/lib/utils/reorder.js` — reorder utility with TDD (9 tests)
- [x] `src/components/admin/SortableList.jsx` — dnd-kit sortable component with TDD (5 tests)
- [x] Drag-and-drop wired into 5 admin list pages (banners, gallery, videos, manuals, FAQ)

### Session 5 ✅ — Authentication Gaps

**Branch:** `ai/phase5-s5-auth` (4 commits)

- [x] `src/lib/actions/auth.js` — forgotPassword + updatePassword server actions with TDD (8 tests)
- [x] Forgot-password flow: form page, sent confirmation, reset callback route, set-new-password page
- [x] `src/lib/auth/line-config.js` — LINE Login OIDC config with TDD (12 tests)
- [x] LINE Login wired into LoginModal + LINE callback route (`/auth/callback/line`)

### Session 6 ✅ — Security Hardening

**Branch:** `ai/phase5-s6-security` (4 commits)

- [x] `src/lib/rate-limit.js` — rate limiter with TDD (9 tests), wired into admin login
- [x] `src/lib/sanitize.js` — input sanitization with TDD (12 tests), wired into server actions
- [x] `src/lib/audit.js` — audit logger with TDD (8 tests), wired into critical actions
- [x] `supabase/migrations/004_audit_logs.sql` — audit_logs table migration

### Session 7 ✅ — Test Coverage Expansion

**Branch:** `ai/phase5-s7-tests` (5 commits, 199 tests passing)

- [x] Server action tests — products (20), blog (13), quotations (13), customer (13), account (12), search (10) = **81 tests**
- [x] Public data layer tests — all 12 public data functions = **26 tests**
- [x] Component tests — Toast (7), SearchOverlay (10) = **17 tests**
- [x] Expanded middleware route protection tests — 14 → **35 tests**
- [x] Vitest config updated: `@vitejs/plugin-react` for JSX component testing
- [x] Renamed `toast-context.js` → `toast-context.jsx` (contains JSX)
- [x] Total suite: 202 tests (199 pass, 3 pre-existing validation failures)

---

## Phase 6 — Bug Fixes (from runtime audit 2026-02-15)

Discovered via Chrome DevTools inspection of all admin pages at runtime.

### Critical

- [ ] **Fix TipTap SSR crash** — `RichTextEditor.jsx` missing `immediatelyRender: false` in `useEditor()`. Crashes 5+ admin pages (about-us, blog create/edit, products create/edit). ErrorBoundary catches it but page is unusable.

### Medium

- [ ] **Fix dnd-kit hydration error** — `SortableList.jsx` renders `<div>` (dnd-kit accessibility text) inside `<table>`, causing hydration mismatch on 5 list pages (banner, video-highlight, gallery, FAQ, manual). Functional but console errors. Fix: move `DndContext`/`SortableContext` outside `<table>`, or restructure sortable rows.
- [ ] **Create banner create page** — `/admin/banner/create` returns 404. The "Create new entry" link on the banner list page is broken. Need to create `src/app/(admin)/admin/banner/create/page.jsx`.

### Low

- [ ] **Fix profile raw HTML display** — `/admin/profile` company name field shows `<p>` tags in plain text input. Strip HTML tags before displaying, or switch to RichTextEditor.
- [ ] **Fix gallery order off-by-one** — `/admin/gallery` first item shows order "0" instead of "1". Fix sort_order display indexing.

---

## Future Enhancements

### Authentication

- [ ] Admin user invite email flow

### Search & Filtering

- [ ] Full-text search (PostgreSQL `tsvector`) for products + blog
- [ ] Persist filter state in URL query parameters
- [ ] Wire rows-per-page selector to actual query limit

### Internationalization (i18n)

- [ ] Extract hardcoded Thai strings into translation file
- [ ] Wire language selector in AdminHeader

### Security

- [ ] CSRF protection on mutation endpoints
- [ ] CORS review

### Testing

- [ ] Integration tests with real Supabase (Vitest + env)
- [ ] E2E tests for key user flows (Playwright)

---

## Branch Summary

| Branch | Commits | Status |
|--------|---------|--------|
| `ai/phase1-tdd` | 11 | Merged — infrastructure, auth, middleware |
| `ai/phase2-session1` | 4 | Merged — Products, Banners, Blog, Dashboard |
| `ai/phase2-session2` | 6 | Merged — Video, Gallery, Manual, About, Branch, FAQ |
| `ai/phase2-session3` | 4 | Merged — Users, Quotations, Profile, Account |
| `ai/phase3b-session1` | 3 | Merged — Public pages wired |
| `ai/phase3b-session2` | 2 | Merged — Auth + customer features |
| `ai/phase4-polish` | 2 | Toast, Zod, account fix, search |
| `ai/phase4-s1-validation-ux` | 4 | Inline validation, useFormErrors, ErrorBoundary |
| `ai/phase4-s2-loading-uploads` | 5 | Loading skeletons, file upload validation |
| `ai/phase5-s3-tiptap` | 5 | TipTap RichTextEditor, SafeHtmlContent |
| `ai/phase5-s4-drag-drop` | 5 | Drag-and-drop reordering (dnd-kit) |
| `ai/phase5-s5-auth` | 4 | LINE Login, forgot-password flow |
| `ai/phase5-s6-security` | 4 | Rate limiter, sanitization, audit logger |
| `ai/phase5-s7-tests` | 5 | Test coverage expansion (159 new tests) |

---

## Key Files Reference

| File | Purpose |
|------|---------|
| `src/lib/supabase/server.js` | Server client (respects RLS) |
| `src/lib/supabase/admin.js` | Service client (bypasses RLS) |
| `src/lib/supabase/client.js` | Browser client (auth) |
| `src/lib/storage.js` | Upload/delete/getPublicUrl |
| `src/lib/data/public.js` | Public data-fetching (13 functions) |
| `src/lib/actions/*.js` | Server Actions (18 action files) |
| `src/lib/validations/*.js` | Zod schemas |
| `src/lib/auth/route-rules.js` | Route protection logic |
| `src/lib/auth/line-config.js` | LINE Login OIDC config |
| `src/lib/toast-context.jsx` | Toast notification context |
| `src/lib/hooks/use-form-errors.js` | Form error handling hook |
| `src/lib/upload-validation.js` | File type/size validation |
| `src/lib/sanitize-html.js` | HTML sanitizer (TipTap output) |
| `src/lib/sanitize.js` | Input sanitization (XSS) |
| `src/lib/rate-limit.js` | Rate limiter (login attempts) |
| `src/lib/audit.js` | Audit logger (admin actions) |
| `src/lib/utils/reorder.js` | Drag-and-drop reorder utility |
| `src/components/admin/RichTextEditor.jsx` | TipTap rich text editor |
| `src/components/admin/SortableList.jsx` | dnd-kit sortable list |
| `src/components/admin/AdminSkeleton.jsx` | Loading skeleton components |
| `src/components/admin/AdminFileInput.jsx` | File input with validation |
| `src/components/SafeHtmlContent.jsx` | XSS-safe HTML rendering |
| `src/components/ErrorBoundary.jsx` | React error boundary |
| `middleware.js` | Supabase session refresh + route guard |
