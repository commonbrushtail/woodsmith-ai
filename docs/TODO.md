# Admin CMS Roadmap

Prioritized implementation plan for converting the WoodSmith AI admin CMS from
static mock pages to a fully functional system. The project currently has 26
admin pages with UI built but zero backend infrastructure.

---

## Phase 1 -- Infrastructure

Goal: establish the foundational layers that every feature depends on.

### 1.1 Database Setup

- [ ] Create Supabase project (PostgreSQL).
- [ ] Create `.env.local` with `NEXT_PUBLIC_SUPABASE_URL`,
      `NEXT_PUBLIC_SUPABASE_ANON_KEY`, and `SUPABASE_SERVICE_ROLE_KEY`.
      Add `.env.local` to `.gitignore`.
- [ ] Create an `.env.example` file documenting all required environment
      variables (without values).
- [ ] Design the database schema covering all content types:
  - `users` -- managed by Supabase Auth (`auth.users`), extended with:
  - `user_profiles` (id, user_id FK->auth.users, display_name, phone, role enum['admin','editor','customer'], auth_provider enum['email','phone','line'], avatar_url, created_at, updated_at)
  - `products` (id, code, sku, name, type, category, description, characteristics, specifications, recommended, published, publish_start, publish_end, sort_order, created_at, updated_at)
  - `product_images` (id, product_id, url, is_primary, sort_order)
  - `product_options` (id, product_id, option_type, label, sort_order)
  - `banners` (id, image_url, link_url, status, sort_order, created_at, updated_at)
  - `blog_posts` (id, title, slug, content, cover_image_url, author_id, recommended, published, publish_date, sort_order, created_at, updated_at)
  - `video_highlights` (id, title, youtube_url, thumbnail_url, published, sort_order, created_at, updated_at)
  - `gallery_items` (id, image_url, caption, published, sort_order, created_at, updated_at)
  - `manuals` (id, title, file_url, cover_image_url, published, sort_order, created_at, updated_at)
  - `about_us` (id, content, updated_at) -- singleton record
  - `branches` (id, name, address, phone, map_url, published, sort_order, created_at, updated_at)
  - `faqs` (id, question, answer, published, sort_order, created_at, updated_at)
  - `quotations` (id, quotation_number, customer_id FK->auth.users, requester_name, requester_phone, requester_email, requester_address, product_id, selected_color, selected_size, status enum['pending','approved','rejected'], admin_notes, created_at, updated_at)
  - `company_profile` (id, content, social_links, updated_at) -- singleton record
- [ ] Set up Row Level Security (RLS) policies:
  - Admin/editor roles: full access to all CMS tables.
  - Customer role: read-only on published content, read/write own quotations.
  - Public (unauthenticated): read-only on published content.
- [ ] Run initial migration to create all tables.
- [ ] Write a seed script with sample data matching the current mock data
      so the transition is seamless.

### 1.2 Authentication System

The application has two user types with different auth methods:
- **Admin users**: email + password (CMS access)
- **Regular users (customers)**: SMS OTP + LINE Login (browse products, request quotations)

#### 1.2.1 Supabase Auth Setup

- [ ] Install `@supabase/supabase-js` and `@supabase/ssr`.
- [ ] Create Supabase project and add credentials to `.env.local`
      (`NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`).
- [ ] Create `src/lib/supabase/client.js` (browser client) and
      `src/lib/supabase/server.js` (server client with cookies).

#### 1.2.2 Admin Auth (Email + Password)

- [ ] Enable Supabase Auth email provider in dashboard.
- [ ] Wire the login page (`/login`) to `supabase.auth.signInWithPassword()`,
      redirect to `/admin/dashboard` on success.
- [ ] Wire the logout action to `supabase.auth.signOut()`.
- [ ] Implement forgot-password flow: `supabase.auth.resetPasswordForEmail()`
      wired to `/login/forgot-password` UI.
- [ ] Add role metadata to admin users (`user_metadata.role = 'admin' | 'editor'`).
- [ ] Create admin user invite flow in `/admin/users` (create user with email + assigned role).

#### 1.2.3 Customer Auth (SMS OTP)

- [ ] Enable Supabase Auth phone provider in dashboard.
- [ ] Configure SMS provider (Twilio, MessageBird, or Vonage) in Supabase.
- [ ] Create public login/signup component with phone number input.
- [ ] Wire to `supabase.auth.signInWithOtp({ phone })` and OTP verification.
- [ ] Set `user_metadata.role = 'customer'` on signup.

#### 1.2.4 Customer Auth (LINE Login)

- [ ] Register LINE Login channel at LINE Developers Console.
- [ ] Configure LINE as custom OIDC provider in Supabase Auth settings
      (LINE Login supports OpenID Connect).
- [ ] Create LINE Login button on public site.
- [ ] Wire to `supabase.auth.signInWithOAuth({ provider: 'line' })` (custom OIDC).
- [ ] Handle callback and set `user_metadata.role = 'customer'` on first login.

### 1.3 Middleware and Route Protection

- [ ] Create `middleware.js` in the project root.
- [ ] Redirect unauthenticated users from `/admin/*` routes to `/login`.
- [ ] Redirect authenticated users from `/login` to `/admin/dashboard`.
- [ ] Add role-based access checks: only `admin`/`editor` roles can
      access `/admin/*` routes; `customer` role is blocked from CMS.
- [ ] Protect future `/account/*` routes (customer account pages):
      require any authenticated user.
- [ ] Allow public routes (`/`, `/products`, `/blog`, etc.) without auth.

### 1.4 File Storage

- [ ] Use Supabase Storage (included with Supabase project).
- [ ] Create storage buckets: `banners`, `products`, `blog`, `gallery`,
      `manuals`, `avatars`.
- [ ] Create `src/lib/storage.js` with upload/delete/get-public-url utilities.
- [ ] Configure bucket policies (public read for content images,
      authenticated upload for admin).

---

## Phase 2 -- API Layer

Goal: create server-side data access for every content section.

### 2.1 Shared Utilities

- [ ] Create `src/lib/db.ts` -- database client singleton.
- [ ] Create `src/lib/validations/` -- Zod schemas for each entity
      (products, blogs, banners, etc.).
- [ ] Create `src/lib/errors.ts` -- standardized error response helpers.

### 2.2 Server Actions or API Routes per Section

For each section, implement the following (using Next.js Server Actions
or API route handlers):

- [ ] **Products**: list (with pagination, search, filter), get by ID,
      create, update, delete, reorder, toggle publish, toggle recommended,
      manage images (upload, reorder, set primary, delete), manage options
      (colors, sizes).
- [ ] **Banners**: list, get by ID, create, update, delete, reorder,
      toggle status, image upload.
- [ ] **Blog**: list (with pagination, search, sort), get by ID, create,
      update, delete, reorder, toggle publish, toggle recommended, cover
      image upload.
- [ ] **Video Highlight**: list, get by ID, create, update, delete,
      reorder, toggle publish.
- [ ] **Gallery**: list, get by ID, create, update, delete, reorder,
      toggle publish, image upload.
- [ ] **Manual**: list, get by ID, create, update, delete, reorder,
      toggle publish, file upload (PDF).
- [ ] **About Us**: get content, update content, image upload within
      content.
- [ ] **Branch**: list, get by ID, create, update, delete, reorder,
      toggle publish.
- [ ] **FAQ**: list, get by ID, create, update, delete, reorder,
      toggle publish.
- [ ] **Quotations**: list (with pagination, search, filter by status),
      get by ID, update status (pending/approved/rejected), delete.
- [ ] **Users**: list, get by ID, create (invite), update role, delete,
      deactivate.
- [ ] **Profile**: get current user profile, update profile fields.
- [ ] **Account**: get account settings, update password, update email.

---

## Phase 3 -- Connect UI to Real Data

Goal: replace all mock data with real database queries and wire up forms.

### 3.1 List Pages

- [ ] **Products list**: fetch products from DB with server-side
      pagination, search, and filtering. Replace `MOCK_PRODUCTS`.
- [ ] **Banner list**: fetch banners from DB. Replace `mockBanners`.
- [ ] **Blog list**: fetch blog posts from DB with server-side pagination
      and sorting. Replace `MOCK_BLOGS`.
- [ ] **Video Highlight list**: fetch from DB.
- [ ] **Gallery list**: fetch from DB.
- [ ] **Manual list**: fetch from DB.
- [ ] **Branch list**: fetch from DB.
- [ ] **FAQ list**: fetch from DB.
- [ ] **Quotations list**: fetch from DB with status filtering.
- [ ] **Users list**: fetch from DB.

### 3.2 Create / Edit Forms

- [ ] **Product create**: wire form submit to server action, handle image
      uploads, validate required fields, redirect to list on success.
- [ ] **Product edit** (new page): create `/admin/products/edit/[id]`,
      pre-populate form from DB, handle update.
- [ ] **Banner edit**: wire `/admin/banner/edit/[id]` to load and save
      real data.
- [ ] **Blog create**: wire form submit, handle cover image upload.
- [ ] **Blog edit** (new page): create `/admin/blog/edit/[id]`.
- [ ] **Video Highlight create / edit**: wire forms.
- [ ] **Gallery create / edit**: wire forms with image upload.
- [ ] **Manual create / edit**: wire forms with file upload.
- [ ] **About Us editor**: wire to load and save singleton content.
- [ ] **Branch create / edit**: wire forms.
- [ ] **FAQ create / edit**: wire forms.

### 3.3 Detail / Action Pages

- [ ] **Quotation detail**: load real quotation data by ID, wire status
      change to update DB, wire publish/save buttons.
- [ ] **Account page**: load current user data, wire password change
      and email update forms.
- [ ] **Profile page**: load and save profile data.

### 3.4 Dashboard

- [ ] Design dashboard with meaningful statistics (total products,
      pending quotations, recent blog posts, etc.).
- [ ] Fetch aggregate data from DB.

### 3.5 Delete Operations

- [ ] Wire delete buttons in all list page action menus to call delete
      server actions with confirmation modal.
- [ ] Implement soft delete or hard delete per business requirements.

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

### 4.4 Rich Text Editing

- [ ] Integrate a real rich text editor library (TipTap, Lexical, or
      similar) to replace the static `RichTextEditor` component in the
      product create page and blog create page.
- [ ] Support image embedding within rich text content.
- [ ] Store rich text as HTML or JSON in the database.

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

## Dependency Summary

```
Phase 1 (Infrastructure)
  |
  v
Phase 2 (API Layer)        -- depends on DB and auth from Phase 1
  |
  +--> Phase 3 (Connect Admin UI)   -- depends on API from Phase 2
  |
  +--> Phase 3B (Customer Features)  -- depends on auth from Phase 1, can run parallel with Phase 3
  |
  v
Phase 4 (Polish)           -- can partially overlap with Phase 3/3B
```

- Phase 3 and Phase 3B can run in parallel once Phase 2 is complete.
- Phase 3B.1 (customer auth UI) can start as soon as Phase 1.2 (auth setup) is done.
- Phase 4 items like form validation (4.1) and error handling (4.2) should
  begin as soon as the first forms are connected in Phase 3.
- File uploads (4.3) and rich text editing (4.4) may be started in
  parallel with Phase 3 work.
