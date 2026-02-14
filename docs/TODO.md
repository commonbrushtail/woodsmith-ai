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

## Phase 4 — Polish ✅ CORE COMPLETE

**Branch:** `ai/phase4-polish`

### Done

- [x] Toast notification system (`src/components/Toast.jsx` + `src/lib/toast-context.js`)
- [x] ToastProvider in admin layout
- [x] All `alert()` calls replaced with `toast.success()` / `toast.error()` across all admin pages
- [x] Zod validation wired into server actions (products, blog, quotations, customer)
- [x] Structured `fieldErrors` returned from server actions
- [x] Admin account page fixed (session-based auth, no client-passed userId)
- [x] SearchOverlay wired to real Supabase data (search, popular categories, recent searches in localStorage)
- [x] `npm run build` passes cleanly

### Session 1 ✅ — Validation UX + Error Boundaries

**Branch:** `ai/phase4-s1-validation-ux`

- [x] AdminInput error prop (red border + error text)
- [x] useFormErrors hook (`src/lib/hooks/use-form-errors.js`)
- [x] Inline field-level validation in products + blog create/edit forms
- [x] ErrorBoundary component (`src/components/ErrorBoundary.jsx`)
- [x] ErrorBoundary in admin + public layouts

### Session 2 ✅ — Loading States + File Upload Improvements

**Branch:** `ai/phase4-s2-loading-uploads`

- [x] AdminSkeleton components (TableSkeleton, FormSkeleton, CardSkeleton)
- [x] loading.jsx for 7 admin pages + 2 public pages
- [x] File upload validation utility (`src/lib/upload-validation.js`)
- [x] AdminFileInput component with preview, error, remove
- [x] validateFile wired into 8 admin upload pages

### Remaining (nice-to-have)

- [x] Display inline field-level validation errors in admin forms
- [x] Error boundaries for admin pages
- [x] Loading states (skeletons/spinners) for data-fetching pages
- [x] Image preview before upload
- [ ] Upload progress indicators
- [x] File type/size validation on upload
- [ ] Drag-and-drop reordering (banners, gallery, FAQ, etc.)
- [ ] Persist sort order changes to DB

---

## Phase 5 — Future Enhancements

### Rich Text Editing (TipTap)

- [ ] Install `@tiptap/react`, `@tiptap/starter-kit`, `@tiptap/extension-image`, `@tiptap/extension-link`
- [ ] Create reusable `RichTextEditor` component
- [ ] Replace placeholder editor in product/blog create/edit pages
- [ ] Image embedding via Supabase Storage

### Authentication Gaps

- [ ] LINE Login OIDC integration (needs LINE credentials)
- [ ] Forgot-password flow wiring
- [ ] Admin user invite email flow

### Search & Filtering

- [ ] Full-text search (PostgreSQL `tsvector`) for products + blog
- [ ] Persist filter state in URL query parameters
- [ ] Wire rows-per-page selector to actual query limit

### Internationalization (i18n)

- [ ] Extract hardcoded Thai strings into translation file
- [ ] Wire language selector in AdminHeader

### Security Hardening

- [ ] CSRF protection on mutation endpoints
- [ ] Rate-limit login attempts
- [ ] Sanitize rich text content (XSS)
- [ ] Audit logging for admin actions
- [ ] CORS review

### Testing

- [ ] Unit tests for validation schemas and utilities
- [ ] Integration tests for CRUD server actions
- [ ] E2E tests for key user flows (login, product CRUD, quotation)

---

## Branch Summary

| Branch | Commits | Status |
|--------|---------|--------|
| `ai/phase1-tdd` | 11 | Merged into session branches |
| `ai/phase2-session1` | 4 | Products, Banners, Blog, Dashboard |
| `ai/phase2-session2` | 6 | Video, Gallery, Manual, About, Branch, FAQ |
| `ai/phase2-session3` | 4 | Users, Quotations, Profile, Account |
| `ai/phase3b-session1` | 3 | Public pages wired |
| `ai/phase3b-session2` | 2 | Auth + customer features |
| `ai/phase4-polish` | 2 | Toast, Zod, account fix, search |
| `ai/phase4-s1-validation-ux` | 5 | AdminInput error, useFormErrors, ErrorBoundary |
| `ai/phase4-s2-loading-uploads` | 5 | Skeletons, loading.jsx, upload validation |

---

## Key Files Reference

| File | Purpose |
|------|---------|
| `src/lib/supabase/server.js` | Server client (respects RLS) |
| `src/lib/supabase/admin.js` | Service client (bypasses RLS) |
| `src/lib/supabase/client.js` | Browser client (auth) |
| `src/lib/storage.js` | Upload/delete/getPublicUrl |
| `src/lib/data/public.js` | Public data-fetching (13 functions) |
| `src/lib/actions/*.js` | Server Actions (12 action files) |
| `src/lib/validations/*.js` | Zod schemas |
| `src/lib/auth/route-rules.js` | Route protection logic |
| `src/lib/toast-context.js` | Toast notification context |
| `middleware.js` | Supabase session refresh + route guard |
| `src/lib/upload-validation.js` | File type/size validation utility |
| `src/lib/hooks/use-form-errors.js` | Form field error management hook |
| `src/components/admin/AdminSkeleton.jsx` | Table, Form, Card skeleton loaders |
| `src/components/admin/AdminFileInput.jsx` | Enhanced file input with preview/validation |
| `src/components/ErrorBoundary.jsx` | React error boundary with retry |
