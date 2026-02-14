# Admin CMS Roadmap

Prioritized implementation plan for converting the WoodSmith AI admin CMS from
static mock pages to a fully functional system. The project currently has 26
admin pages with UI built but zero backend infrastructure.

---

## Phase 1 -- Infrastructure ✅ COMPLETE

Goal: establish the foundational layers that every feature depends on.

**Branch:** `ai/phase1-tdd` (11 commits, 57 tests passing)

### 1.1 Database Setup

- [x] Create Supabase project (PostgreSQL).
- [x] Create `.env.local` with `NEXT_PUBLIC_SUPABASE_URL`,
      `NEXT_PUBLIC_SUPABASE_ANON_KEY`, and `SUPABASE_SERVICE_ROLE_KEY`.
- [x] Create `.env.example` file.
- [x] Design and deploy database schema (14 tables, 5 enums).
      Migrations: `001_initial_schema.sql`, `002_rls_policies.sql`.
- [x] Set up Row Level Security (RLS) policies.
- [x] Run initial migration to create all tables.
- [x] Write seed script (`scripts/seed.js`) with sample data.

### 1.2 Authentication System

- [x] Install `@supabase/supabase-js` and `@supabase/ssr`.
- [x] Create `src/lib/supabase/client.js` (browser client).
- [x] Create `src/lib/supabase/server.js` (server client with cookies).
- [x] Create `src/lib/supabase/admin.js` (service role client).
- [x] Wire login page to `supabase.auth.signInWithPassword()`.
- [x] Wire logout action to `supabase.auth.signOut()`.
- [x] Wire customer OTP flow in LoginModal.
- [ ] LINE Login integration (credentials in `.env.local`, needs OIDC wiring).
- [ ] Forgot-password flow wiring.
- [ ] Admin user invite flow.

### 1.3 Middleware and Route Protection

- [x] Create `middleware.js` with Supabase session refresh.
- [x] Create `src/lib/auth/route-rules.js` (pure function `getRouteAction`).
- [x] Route protection: admin, public, account, login redirect.

### 1.4 File Storage

- [x] Create 6 storage buckets (banners, products, blog, gallery, manuals, avatars).
- [x] Create `src/lib/storage.js` with upload/delete/getPublicUrl.

### 1.5 Testing & Validation

- [x] Vitest + Playwright test infrastructure.
- [x] `src/lib/errors.js` — AppError class + factory functions.
- [x] `src/lib/validations/` — Zod schemas (products, blog, quotations).
- [x] 57 unit/integration tests passing across 11 test files.
- [x] 4 E2E test specs (admin login/logout, customer OTP/LINE).

---

## Phase 2+3 -- API Layer + Connect UI to Real Data

Goal: build Server Actions and wire every admin page to real database data.
Phase 2 (API) and Phase 3 (UI wiring) are combined — build each section's
server actions and immediately connect them to the existing pages.

### Implementation Sessions

Split into 3 ralph-loop sessions to manage scope:

---

### Session 1 — Products, Banners, Blog, Dashboard

Branch: `ai/phase2-session1` (from `ai/phase1-tdd`)

#### S1.1 Products (`/admin/products`)
- [ ] Create `src/lib/actions/products.js` — Server Actions:
      list (paginated, searchable, filterable by type/category), getById,
      create, update, delete, togglePublish, toggleRecommended, reorder.
- [ ] Create `src/lib/validations/products.js` — extend existing Zod schemas
      if needed (update schema, filter params).
- [ ] Wire list page: replace `MOCK_PRODUCTS` with real DB fetch, add
      pagination/search/filter.
- [ ] Wire create page: form submit → server action, image upload to
      `products` bucket.
- [ ] Create edit page: `/admin/products/edit/[id]/page.jsx`.
- [ ] Wire delete in list page action menu.
- [ ] Handle `product_images` sub-table (upload, reorder, set primary, delete).
- [ ] Handle `product_options` sub-table (colors, sizes CRUD).

#### S1.2 Banners (`/admin/banner`)
- [ ] Create `src/lib/actions/banners.js` — Server Actions:
      list, getById, create, update, delete, toggleStatus, reorder.
- [ ] Create `src/lib/validations/banners.js` — Zod schemas.
- [ ] Wire list page: replace mock data.
- [ ] Wire create page with image upload to `banners` bucket.
- [ ] Wire edit page (`/admin/banner/edit/[id]`): load and save real data.
- [ ] Wire delete in list page action menu.

#### S1.3 Blog (`/admin/blog`)
- [ ] Create `src/lib/actions/blog.js` — Server Actions:
      list (paginated, searchable), getById, create, update, delete,
      togglePublish, toggleRecommended.
- [ ] Extend `src/lib/validations/blog.js` if needed.
- [ ] Wire list page: replace `MOCK_BLOGS` with real pagination/search.
- [ ] Wire create page with cover image upload to `blog` bucket.
- [ ] Create edit page: `/admin/blog/edit/[id]/page.jsx`.
- [ ] Wire delete in list page action menu.

#### S1.4 Dashboard (`/admin/dashboard`)
- [ ] Fetch aggregate stats from DB: total products, total published,
      pending quotations count, recent blog posts, etc.
- [ ] Replace placeholder numbers with real counts.

#### S1 Completion
- [ ] `npm run build` passes.
- [ ] All existing tests still pass.
- [ ] Committed with small, frequent commits.

---

### Session 2 — Video, Gallery, Manual, About Us, Branch, FAQ

Branch: `ai/phase2-session2` (from session 1 branch)

#### S2.1 Video Highlights (`/admin/video-highlight`)
- [ ] Create `src/lib/actions/videos.js` — list, getById, create, update,
      delete, togglePublish, reorder.
- [ ] Wire list page, create page.
- [ ] Create edit page: `/admin/video-highlight/edit/[id]/page.jsx`.

#### S2.2 Gallery (`/admin/gallery`)
- [ ] Create `src/lib/actions/gallery.js` — list, getById, create, update,
      delete, togglePublish, reorder.
- [ ] Wire list page, create page with image upload to `gallery` bucket.
- [ ] Create edit page: `/admin/gallery/edit/[id]/page.jsx`.

#### S2.3 Manuals (`/admin/manual`)
- [ ] Create `src/lib/actions/manuals.js` — list, getById, create, update,
      delete, togglePublish, reorder.
- [ ] Wire list page, create page with PDF upload to `manuals` bucket.
- [ ] Create edit page: `/admin/manual/edit/[id]/page.jsx`.

#### S2.4 About Us (`/admin/about-us`)
- [ ] Create `src/lib/actions/about.js` — get, update (singleton).
- [ ] Wire page: load real content, save on submit.

#### S2.5 Branches (`/admin/branch`)
- [ ] Create `src/lib/actions/branches.js` — list, getById, create, update,
      delete, togglePublish, reorder.
- [ ] Wire list page, create page.
- [ ] Create edit page: `/admin/branch/edit/[id]/page.jsx`.

#### S2.6 FAQs (`/admin/faq`)
- [ ] Create `src/lib/actions/faqs.js` — list, getById, create, update,
      delete, togglePublish, reorder.
- [ ] Wire list page, create page.
- [ ] Create edit page: `/admin/faq/edit/[id]/page.jsx`.

#### S2 Completion
- [ ] `npm run build` passes.
- [ ] All existing tests still pass.

---

### Session 3 — Users, Quotations, Profile, Account

Branch: `ai/phase2-session3` (from session 2 branch)

#### S3.1 Users (`/admin/users`)
- [ ] Create `src/lib/actions/users.js` — list, getById, invite (create
      user with email + role), updateRole, delete/deactivate.
- [ ] Wire list page: fetch from `user_profiles` + auth.users.
- [ ] Wire invite flow (create user via admin API).

#### S3.2 Quotations (`/admin/quotations`)
- [ ] Create `src/lib/actions/quotations.js` — list (paginated, filterable
      by status), getById, updateStatus, delete.
- [ ] Create `src/lib/validations/quotations.js` — extend if needed.
- [ ] Wire list page with status filtering.
- [ ] Wire detail page (`/admin/quotations/[id]`): load real data,
      wire status change buttons.

#### S3.3 Profile (`/admin/profile`)
- [ ] Create `src/lib/actions/profile.js` — getProfile, updateProfile.
- [ ] Wire profile page: load and save current user data.

#### S3.4 Account (`/admin/account`)
- [ ] Create `src/lib/actions/account.js` — updatePassword, updateEmail.
- [ ] Wire account page: password change and email update forms.

#### S3 Completion
- [ ] `npm run build` passes.
- [ ] All existing tests still pass.
- [ ] All admin pages use real DB data (no mock arrays remain).

---

## Phase 3B -- Customer-Facing Features

Goal: enable regular users (customers) to authenticate and interact with the site.

### 3B.1 Customer Authentication UI

- [ ] Create public login/signup page or modal with two options:
      SMS OTP and LINE Login.
- [ ] Build phone number input with country code selector (+66 default).
- [ ] Build OTP verification step (6-digit code input).
- [ ] Add LINE Login button with LINE branding.
- [ ] Create auth callback handler for LINE OIDC redirect.
- [ ] Show logged-in state in public site header (avatar, name, logout).

### 3B.2 Quotation Request Flow

- [ ] Add auth gate to "Request Quote" button on product detail page:
      prompt login if not authenticated, proceed if logged in.
- [ ] Create quotation request form (pre-filled with selected product,
      color, size; customer fills contact details and notes).
- [ ] Submit quotation to database via server action.
- [ ] Send confirmation to customer (in-app notification or SMS).

### 3B.3 Customer Account Pages

- [ ] Create `src/app/(public)/account/page.jsx` -- customer dashboard.
- [ ] Create `src/app/(public)/account/quotations/page.jsx` -- list of
      customer's quotation requests with status.
- [ ] Create `src/app/(public)/account/profile/page.jsx` -- edit name,
      phone, email.
- [ ] Protect `/account/*` routes via middleware (require authenticated user).

---

## Phase 4 -- Polish

Goal: production readiness with validation, error handling, and UX
improvements.

### 4.1 Form Validation

- [ ] Add Zod schema validation on all create/edit forms (client-side
      and server-side).
- [ ] Display inline field-level error messages.
- [ ] Validate file types and sizes before upload.
- [ ] Add required field indicators that respond to validation state.

### 4.2 Error Handling

- [ ] Add toast/notification system for success and error feedback.
- [ ] Handle API errors gracefully in all forms (network errors, validation
      errors, server errors).
- [ ] Add error boundaries for admin pages.
- [ ] Add loading states (skeletons or spinners) for all data-fetching
      pages.

### 4.3 File Uploads

- [ ] Integrate AdminInput file type with real upload logic.
- [ ] Add image preview before upload.
- [ ] Add progress indicators for uploads.
- [ ] Implement image cropping/resizing where needed (banner images,
      product images).
- [ ] Validate file types (images: jpg/png/webp; documents: pdf).
- [ ] Set and enforce file size limits.

### 4.4 Rich Text Editing (TipTap)

- [ ] Install `@tiptap/react`, `@tiptap/starter-kit`, `@tiptap/extension-image`,
      `@tiptap/extension-link` (all MIT, free core).
- [ ] Create a reusable `RichTextEditor` component wrapping TipTap with a
      toolbar (bold, italic, headings, lists, links, images).
- [ ] Replace the static `RichTextEditor` placeholder in the product create
      page and blog create page.
- [ ] Support image embedding within rich text content (via Supabase Storage upload).
- [ ] Store rich text as HTML in the database (TipTap outputs HTML by default).

### 4.5 Search and Filtering

- [ ] Implement server-side full-text search for products, blog posts,
      and quotations.
- [ ] Wire filter buttons to real filter parameters (status, category,
      date range, recommended).
- [ ] Persist search/filter state in URL query parameters for
      bookmarkability and back-button support.

### 4.6 Pagination

- [ ] Replace all hardcoded pagination totals with real counts from DB.
- [ ] Implement cursor-based or offset-based pagination in API layer.
- [ ] Wire rows-per-page selector to actual query limit.

### 4.7 Sorting and Ordering

- [ ] Implement drag-and-drop reordering for banners, gallery items,
      FAQ items, and other ordered content.
- [ ] Persist sort order changes to the database.
- [ ] Support column-based sorting on list pages (server-side).

### 4.8 Internationalization (i18n)

- [ ] Extract all hardcoded Thai strings into a translation file or i18n
      library.
- [ ] Wire the language selector in AdminHeader to switch locale.
- [ ] Support content entry in multiple languages if required.

### 4.9 Security Hardening

- [ ] Add CSRF protection to all mutation endpoints.
- [ ] Rate-limit login attempts.
- [ ] Sanitize all user inputs (especially rich text content).
- [ ] Add audit logging for admin actions (who changed what, when).
- [ ] Review and restrict CORS settings.

### 4.10 Testing

- [ ] Write unit tests for validation schemas and utility functions.
- [ ] Write integration tests for critical API routes (auth, CRUD).
- [ ] Write end-to-end tests for key user flows (login, create product,
      manage quotation).

---

## Testing Strategy

See `docs/TDD_PLAN.md` for the full test-driven implementation plan.

| Layer | Tool | Scope |
|-------|------|-------|
| Unit | Vitest | Validation schemas, error helpers, route rules, Supabase clients |
| Integration | Vitest | Database tables, RLS policies, storage operations, seed data |
| E2E | Playwright | Admin login/logout, customer OTP/LINE, route protection |

---

## Dependency Summary

```
Phase 1 (Infrastructure)     ✅ COMPLETE
  |
  v
Phase 2+3 (API + UI Wiring)  ← YOU ARE HERE
  |  Session 1: Products, Banners, Blog, Dashboard
  |  Session 2: Video, Gallery, Manual, About Us, Branch, FAQ
  |  Session 3: Users, Quotations, Profile, Account
  |
  +--> Phase 3B (Customer Features)  -- can run parallel
  |
  v
Phase 4 (Polish)
```

---

## Ralph-Loop Prompts

Copy-paste these prompts to run each session via `/ralph-loop`.

### Session 1 Prompt

```
You are implementing Phase 2+3 of the WoodSmith AI admin CMS — building Server Actions and wiring them to the existing admin pages.

## Context
- Phase 1 is complete: Supabase DB (14 tables), Auth, RLS, Storage, Middleware all working.
- All admin pages exist with hardcoded mock data arrays. Your job is to replace mocks with real DB queries.
- Branch: create `ai/phase2-session1` from `ai/phase1-tdd`.
- Commit after each completed section. Never batch.

## Pattern for Each Section

1. Create `src/lib/actions/<section>.js` with Server Actions using `'use server'`
2. Use `createClient` from `@/lib/supabase/server` for authenticated queries
3. Use `createServiceClient` from `@/lib/supabase/admin` only when bypassing RLS is needed
4. Wire the admin list page: replace mock array with real DB fetch (server component)
5. Wire the create form: replace console.log/alert with server action call
6. Create edit page if missing (`/admin/<section>/edit/[id]/page.jsx`)
7. Wire delete action in list page action menu
8. Add reorder/toggle-publish where applicable

## Sections to Implement (in order)

### 1. Products (`/admin/products`)
- Server Actions: list (paginated, searchable, filterable by type/category), getById, create, update, delete, togglePublish, toggleRecommended, reorder
- Wire list page: replace MOCK_PRODUCTS, add real pagination/search/filter
- Wire create page: form submit → server action, handle image upload to 'products' bucket
- Create edit page: `/admin/products/edit/[id]/page.jsx`
- Handle product_images and product_options sub-tables

### 2. Banners (`/admin/banner`)
- Server Actions: list, getById, create, update, delete, toggleStatus, reorder
- Wire list page, create page, edit page
- Handle image upload to 'banners' bucket

### 3. Blog (`/admin/blog`)
- Server Actions: list (paginated, searchable), getById, create, update, delete, togglePublish, toggleRecommended
- Wire list page: replace MOCK_BLOGS with real pagination/search
- Wire create page with cover image upload to 'blog' bucket
- Create edit page: `/admin/blog/edit/[id]/page.jsx`

### 4. Dashboard (`/admin/dashboard`)
- Fetch aggregate stats: total products, total published, pending quotations, recent blog posts, etc.
- Replace placeholder numbers with real counts

## Rules
- Use `revalidatePath()` after mutations to refresh the page
- Return `{ success, data?, error? }` from all server actions
- Use existing Zod schemas from `src/lib/validations/` for input validation
- Add new Zod schemas in the same directory as needed
- Keep Thai language for all UI text
- Do NOT modify the existing component styles/layout — only replace data sources and wire up form handlers
- Read each existing page BEFORE modifying it to understand the current mock data structure
- Ensure `npm run build` passes after each section

## Completion
When all 4 sections are wired with real data and build passes, output:
<promise>PHASE 2 SESSION 1 COMPLETE</promise>
```

### Session 2 Prompt

```
You are continuing Phase 2+3 of WoodSmith AI — Session 2: remaining content sections.

## Context
- Phase 1 is complete. Session 1 (Products, Banners, Blog, Dashboard) is complete.
- Branch: create `ai/phase2-session2` from the session 1 branch.
- Follow the same pattern as Session 1 (Server Actions in `src/lib/actions/`, wire pages, create edit pages).
- Commit after each completed section.

## Sections to Implement (in order)

### 1. Video Highlights (`/admin/video-highlight`)
- Server Actions: list, getById, create, update, delete, togglePublish, reorder
- Wire list page, create page
- Create edit page: `/admin/video-highlight/edit/[id]/page.jsx`

### 2. Gallery (`/admin/gallery`)
- Server Actions: list, getById, create, update, delete, togglePublish, reorder
- Wire list page, create page with image upload to 'gallery' bucket
- Create edit page: `/admin/gallery/edit/[id]/page.jsx`

### 3. Manuals (`/admin/manual`)
- Server Actions: list, getById, create, update, delete, togglePublish, reorder
- Wire list page, create page with PDF upload to 'manuals' bucket
- Create edit page: `/admin/manual/edit/[id]/page.jsx`

### 4. About Us (`/admin/about-us`)
- Server Actions: get, update (singleton record)
- Wire page: load real content, save on submit

### 5. Branches (`/admin/branch`)
- Server Actions: list, getById, create, update, delete, togglePublish, reorder
- Wire list page, create page
- Create edit page: `/admin/branch/edit/[id]/page.jsx`

### 6. FAQs (`/admin/faq`)
- Server Actions: list, getById, create, update, delete, togglePublish, reorder
- Wire list page, create page
- Create edit page: `/admin/faq/edit/[id]/page.jsx`

## Rules
- Same pattern as Session 1: `'use server'` actions, `revalidatePath()`, `{ success, data?, error? }` return shape
- Read each existing page BEFORE modifying it
- Do NOT change styles/layout — only replace data sources
- `npm run build` must pass after each section

## Completion
When all 6 sections are wired and build passes, output:
<promise>PHASE 2 SESSION 2 COMPLETE</promise>
```

### Session 3 Prompt

```
You are continuing Phase 2+3 of WoodSmith AI — Session 3: user management and account.

## Context
- Phase 1 is complete. Sessions 1+2 (all content sections) are complete.
- Branch: create `ai/phase2-session3` from the session 2 branch.
- Commit after each completed section.

## Sections to Implement (in order)

### 1. Users (`/admin/users`)
- Server Actions in `src/lib/actions/users.js`:
  list (from user_profiles + auth.users), getById, invite (create user via admin API with email + role), updateRole, delete/deactivate
- Wire list page: fetch real user data
- Wire invite flow: create user with `supabase.auth.admin.createUser()` and insert user_profiles row

### 2. Quotations (`/admin/quotations`)
- Server Actions in `src/lib/actions/quotations.js`:
  list (paginated, filterable by status), getById, updateStatus (pending/approved/rejected), addAdminNotes, delete
- Wire list page with status filter tabs
- Wire detail page (`/admin/quotations/[id]`): load real data, wire status change and notes

### 3. Profile (`/admin/profile`)
- Server Actions in `src/lib/actions/profile.js`:
  getProfile, updateProfile (display_name, avatar_url, phone)
- Wire profile page: load and save current user data
- Handle avatar upload to 'avatars' bucket

### 4. Account (`/admin/account`)
- Server Actions in `src/lib/actions/account.js`:
  updatePassword (via supabase.auth.updateUser), updateEmail
- Wire account page: password change and email update forms

## Rules
- Same pattern as Sessions 1+2
- For user management, use `createServiceClient` (admin API) since it requires admin.auth access
- Read each existing page BEFORE modifying it
- `npm run build` must pass after each section

## Completion
When all 4 sections are wired, build passes, and NO mock data arrays remain in any admin page, output:
<promise>PHASE 2 SESSION 3 COMPLETE</promise>
```
