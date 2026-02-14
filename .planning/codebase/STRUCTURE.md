# Codebase Structure

**Analysis Date:** 2026-02-15

## Directory Layout

```
woodsmith-ai/
├── src/
│   ├── app/                       # Next.js App Router
│   │   ├── layout.jsx             # Root layout (html/head/body/fonts)
│   │   ├── globals.css            # Tailwind v4 + @theme design tokens
│   │   ├── (public)/              # Public site route group (12 pages)
│   │   │   ├── layout.jsx         # TopBar + Navbar + Footer + LineFAB
│   │   │   ├── page.jsx           # Homepage
│   │   │   ├── about/
│   │   │   ├── blog/              # Blog list (BlogPageClient)
│   │   │   ├── blog/[id]/         # Blog post detail
│   │   │   ├── branches/
│   │   │   ├── faq/
│   │   │   ├── highlight/
│   │   │   ├── manual/
│   │   │   ├── products/          # Product grid
│   │   │   ├── product/[id]/      # Product detail
│   │   │   ├── account/           # Customer auth-only pages
│   │   │   └── account/quotations/
│   │   ├── (admin)/               # Admin CMS route group (34 pages)
│   │   │   ├── layout.jsx         # Metadata only (no layout, child AdminLayout applies)
│   │   │   ├── login/             # Admin login, forgot-password, reset
│   │   │   └── admin/             # Protected routes, requires admin role
│   │   │       ├── layout.jsx     # Sidebar + main wrapper
│   │   │       ├── dashboard/
│   │   │       ├── products/      # List, create, edit/[id]
│   │   │       ├── banner/
│   │   │       ├── blog/
│   │   │       ├── video-highlight/
│   │   │       ├── gallery/
│   │   │       ├── manual/
│   │   │       ├── about-us/
│   │   │       ├── branch/
│   │   │       ├── faq/
│   │   │       ├── quotations/    # View + detail pages
│   │   │       ├── users/
│   │   │       ├── profile/
│   │   │       └── account/
│   │   ├── auth/                  # OAuth callbacks
│   │   │   ├── callback/route.js  # Supabase auth callback
│   │   │   ├── callback/line/route.js
│   │   │   └── reset-password/route.js
│   │   └── api/                   # (currently empty)
│   ├── components/
│   │   ├── *.jsx                  # Public components (19 files)
│   │   │   ├── Navbar.jsx
│   │   │   ├── Footer.jsx
│   │   │   ├── HeroSection.jsx
│   │   │   ├── ProductsSection.jsx
│   │   │   ├── BlogSection.jsx
│   │   │   ├── GallerySection.jsx
│   │   │   ├── LoginModal.jsx
│   │   │   ├── QuotationModal.jsx
│   │   │   └── ... (14 more)
│   │   └── admin/                 # Admin CMS components (21 files)
│   │       ├── *ListClient.jsx    # 8 paginated list components (ProductsListClient, BlogListClient, etc.)
│   │       ├── RichTextEditor.jsx # TipTap integration
│   │       ├── AdminFileInput.jsx # File upload with validation
│   │       ├── AdminInput.jsx     # Styled form inputs
│   │       ├── AdminButton.jsx
│   │       ├── AdminTable.jsx     # Reusable table display
│   │       ├── AdminSidebar.jsx   # Navigation menu
│   │       ├── SortableList.jsx   # dnd-kit drag-drop wrapper
│   │       └── ... (7 more utilities)
│   ├── lib/
│   │   ├── supabase/
│   │   │   ├── client.js          # Browser client (anon auth)
│   │   │   ├── server.js          # Server client (session-aware)
│   │   │   └── admin.js           # Service role client (unrestricted)
│   │   ├── actions/               # Server Actions (18 files)
│   │   │   ├── products.js        # 6 mutations: get/create/update/delete/reorder/toggles
│   │   │   ├── blog.js
│   │   │   ├── banners.js
│   │   │   ├── users.js
│   │   │   ├── quotations.js
│   │   │   ├── customer.js        # Customer auth actions
│   │   │   ├── admin-login.js
│   │   │   └── ... (11 more: branches, gallery, faqs, manuals, etc.)
│   │   ├── data/
│   │   │   └── public.js          # 13 public data-fetching functions (RLS-filtered)
│   │   ├── validations/           # Zod schemas
│   │   │   ├── products.js
│   │   │   ├── blog.js
│   │   │   └── quotations.js
│   │   ├── auth/
│   │   │   ├── route-rules.js     # Pure function getRouteAction() for testing
│   │   │   └── line-config.js     # LINE Login configuration
│   │   ├── hooks/
│   │   │   └── use-form-errors.js # Form error handling
│   │   ├── *.js                   # Utilities
│   │   │   ├── storage.js         # Upload/delete/getPublicUrl wrappers
│   │   │   ├── audit.js           # Audit logging
│   │   │   ├── sanitize.js        # XSS prevention
│   │   │   ├── sanitize-html.js   # TipTap HTML sanitization
│   │   │   ├── upload-validation.js
│   │   │   ├── rate-limit.js      # In-memory rate limiter
│   │   │   ├── reorder.js         # Drag-drop reorder utility
│   │   │   ├── errors.js          # AppError class
│   │   │   └── toast-context.jsx  # Toast notification provider
│   └── assets/                    # Images and SVGs (webpack hashed filenames)
│       └── [hash].{png,svg}       # 300+ asset files
├── middleware.js                  # Session refresh + route guard
├── supabase/
│   └── migrations/                # 4 SQL migrations (schema, RLS, columns, audit)
├── tests/                         # 34 test files, 202 tests
│   ├── middleware.test.js
│   ├── components/                # Component tests
│   ├── lib/                       # Utility tests
│   └── hooks/
├── e2e/                           # Playwright E2E tests
├── docs/
│   ├── TODO.md                    # Phase roadmap + bug tracker
│   └── ADMIN_PROGRESS.md          # Page checklist
├── .planning/
│   └── codebase/                  # GSD mapping documents
├── next.config.mjs                # Next.js config (webpack flag)
├── jsconfig.json                  # JS path aliases
├── tailwind.config.js             # (Not used; config in @theme block)
├── eslint.config.js               # Linting rules
├── playwright.config.js           # E2E test config
├── vitest.config.js               # Unit test config (if exists)
├── package.json
└── package-lock.json
```

## Directory Purposes

**`src/app/(public)/`**
- Purpose: Customer-facing storefront pages
- Contains: 12 route folders (about, blog, products, account, etc.) with Server Components
- Key files: `page.jsx` per route, data fetched from `src/lib/data/public.js`
- Layout: Root `(public)/layout.jsx` provides TopBar, Navbar, Footer, LineFAB wrapper

**`src/app/(admin)/admin/`**
- Purpose: Admin CMS management interface
- Contains: 13 section folders (products, blog, users, quotations, etc.) with list/create/edit pages
- Key files: `page.jsx` for list views, `page.jsx` for create/edit with `*Client.jsx` wrappers
- Layout: `layout.jsx` provides Sidebar + main content wrapper
- Note: `/login` route is at `(admin)/login/`, not under `/admin/`

**`src/components/`**
- Purpose: Reusable React components
- Contains: 19 public components (section layouts, modals, navigation) + 21 admin CMS components
- Pattern: One component per file; admin components in `admin/` subdirectory
- Exports: Default export per file; `'use client'` for interactive components

**`src/lib/actions/`**
- Purpose: Server-side CRUD operations
- Contains: 18 action files (one per entity: products, blog, users, etc.)
- Pattern: `'use server'` at top of file; async functions; return `{ data, error }`
- Clients: Service role (admin.js) for mutations, server client for reads
- Called from: Client Components via `startTransition()`, Server Components

**`src/lib/data/public.js`**
- Purpose: Read-only data access for public pages
- Contains: 13 exported functions (products, blog, FAQs, branches, gallery, etc.)
- Auth: Server client (anon level); RLS policies filter published content
- Called from: Server Components in `(public)` route group

**`src/lib/supabase/`**
- Purpose: Supabase client abstraction
- Contains: 3 clients (browser anon, server session-aware, service role)
- Usage:
  - `client.js`: In Client Components with `useEffect()`, browser context
  - `server.js`: In Server Components, Server Actions, middleware
  - `admin.js`: In Server Actions for unrestricted mutations

**`src/lib/validations/`**
- Purpose: Input schema validation
- Contains: Zod schemas for products, blog posts, quotations
- Usage: In Server Actions before database mutations
- Pattern: `export const [entity]Schema = z.object({ ... })`

**`src/assets/`**
- Purpose: Static images and SVGs
- Contains: ~300 files with hashed names (webpack asset/resource rule)
- Import: `import img from '@/assets/file.png'` → `<img src={img} />`
- Note: `next/image` is disabled; images use standard `<img>` tags

**`supabase/migrations/`**
- Purpose: Database schema and RLS policies
- Contains: 4 SQL migration files ordered by creation date
- Applied: Via Supabase CLI (`supabase db push`)

**`tests/`**
- Purpose: Unit and integration tests
- Framework: Vitest + Testing Library + jsdom
- Pattern: `*.test.js` files in same directory structure as source
- Coverage: 202 tests (199 pass, 3 pre-existing validation failures)

**`e2e/`**
- Purpose: Browser E2E tests
- Framework: Playwright
- Files: Feature-based test suites

**`docs/`**
- Purpose: Project documentation
- Contains:
  - `TODO.md`: Phased roadmap and bug tracker
  - `ADMIN_PROGRESS.md`: Page-by-page CMS completion checklist

## Key File Locations

**Entry Points:**
- `src/app/layout.jsx`: Root layout (html/head/body/fonts)
- `src/app/(public)/layout.jsx`: Public site wrapper (navigation + footer)
- `src/app/(admin)/admin/layout.jsx`: Admin CMS wrapper (sidebar + main)
- `middleware.js`: Session refresh + route guard

**Configuration:**
- `src/app/globals.css`: Tailwind v4 + @theme tokens
- `next.config.mjs`: Webpack flag, image/font config
- `jsconfig.json`: Path aliases (`@/` = `src/`)
- `supabase/migrations/`: Database schema and RLS

**Core Logic:**
- `src/lib/actions/`: All mutations (products, blog, users, etc.)
- `src/lib/data/public.js`: All public reads (products, blog, galleries, etc.)
- `src/lib/auth/route-rules.js`: Route authorization logic
- `middleware.js`: Session management and route guarding

**Authentication:**
- `src/lib/supabase/client.js`: Browser client
- `src/lib/supabase/server.js`: Server client
- `src/lib/supabase/admin.js`: Service role client
- `src/app/(admin)/login/page.jsx`: Admin login form
- `src/components/LoginModal.jsx`: Customer login modal

**Error Handling:**
- `src/lib/errors.js`: AppError class and helpers
- `src/components/ErrorBoundary.jsx`: React error boundary wrapper
- `src/lib/toast-context.jsx`: Toast notification provider

**Storage:**
- `src/lib/storage.js`: Upload/delete/getPublicUrl wrappers
- 6 Supabase buckets: products, banners, blog, gallery, manuals, video-highlights

## Naming Conventions

**Files:**
- Pages: `page.jsx` (Next.js convention)
- Layouts: `layout.jsx`
- Client Components: `*Client.jsx` (e.g., `ProductEditClient.jsx`)
- List components: `*ListClient.jsx` (e.g., `ProductsListClient.jsx`)
- Server Actions: `[entity].js` (e.g., `products.js`, `blog.js`)
- Sections: `*Section.jsx` (e.g., `HeroSection.jsx`, `ProductsSection.jsx`)
- Modals: `*Modal.jsx` (e.g., `LoginModal.jsx`, `QuotationModal.jsx`)
- Utilities: `[purpose].js` (e.g., `storage.js`, `audit.js`)
- Tests: `*.test.js` (Vitest convention)

**Directories:**
- Route groups: `(name)` (Next.js convention)
- Entity folders: Plural `products/`, `branches/`, `users/`
- Create/edit nesting: `products/create/`, `products/edit/[id]/`
- Shared components: `admin/`, `lib/`, `assets/`

**Variables:**
- camelCase: `productId`, `isPublished`, `handleSubmit`
- Constants: UPPER_SNAKE_CASE: `ADMIN_ROLES`, `SKIP_PATTERNS`
- React Hooks: `use*` prefix: `useTransition`, `useRouter`, `useToast`

**Types & Classes:**
- PascalCase: `AppError`, `ToastProvider`, `ProductsListClient`
- Zod schemas: `[entity]Schema` (e.g., `productSchema`)

## Where to Add New Code

**New Feature/Entity (e.g., "Suppliers"):**

1. **Database:** Create schema in `supabase/migrations/[timestamp]-add-suppliers.sql`
2. **Actions:** Create `src/lib/actions/suppliers.js` with mutations (create, update, delete, reorder)
3. **Public Data:** Add function to `src/lib/data/public.js` if customer-facing
4. **Validation:** Create `src/lib/validations/suppliers.js` with Zod schema
5. **Admin Pages:** Create route tree:
   ```
   src/app/(admin)/admin/suppliers/
   ├── page.jsx                    # List page
   ├── create/
   │   └── page.jsx
   └── edit/[id]/
       ├── page.jsx
       └── SupplierEditClient.jsx
   ```
6. **Components:** Create `src/components/admin/SuppliersListClient.jsx` (list UI)
7. **Tests:** Create `tests/lib/actions.suppliers.test.js` with action tests

**New Section Component (e.g., "TestimonialsSection"):**

1. Create `src/components/TestimonialsSection.jsx` (Server Component)
2. Import and use in page: `src/app/(public)/page.jsx` or custom route
3. Add data fetching function to `src/lib/data/public.js` if needed
4. Fetch in page Server Component, pass to section as props
5. Add test: `tests/components/TestimonialsSection.test.js`

**New Admin Page (for existing entity):**

1. Create folder: `src/app/(admin)/admin/[entity]/[view]/`
2. Create `page.jsx` Server Component that fetches initial data
3. Create `[Entity][View]Client.jsx` with form state and Server Action calls
4. Add UI components from `src/components/admin/` (AdminInput, AdminButton, etc.)
5. Export Server Action from `src/lib/actions/[entity].js`
6. Add test for action logic

**New Utility Function:**

1. **Core logic (no DB):** Add to `src/lib/[purpose].js` (e.g., `src/lib/image-processor.js`)
2. **DB-dependent:** Add to `src/lib/actions/` or `src/lib/data/` depending on context
3. **Shared between client/server:** Put in `src/lib/`, export for both
4. **Client-only:** Put in hook: `src/lib/hooks/use[Feature].js`

**New Route:**

1. Create folder in `(public)/` or `(admin)/` group
2. Add `page.jsx` Server Component
3. Optionally add `layout.jsx` for custom wrapper (rare)
4. Data fetching: Call functions from `src/lib/data/public.js` or Server Actions
5. Update middleware if route needs auth: Edit `src/lib/auth/route-rules.js`

## Special Directories

**`src/app/(admin)/login/`**
- Purpose: Admin authentication (not under `/admin/` to avoid infinite redirects)
- Routes: `/login`, `/forgot-password`, `/set-new-password`
- Note: Middleware allows unauthenticated access to `/login`

**`src/app/auth/`**
- Purpose: OAuth callbacks
- Routes: `/auth/callback`, `/auth/callback/line`, `/auth/reset-password`
- Note: Handled by `route.js` files (App Router API routes)

**`.next/`**
- Purpose: Build artifacts (generated, do not commit)
- Note: Ignored in `.gitignore`

**`public/`**
- Purpose: Static files served at root (favicon, etc.)
- Note: Different from webpack assets in `src/assets/`

**`.planning/codebase/`**
- Purpose: GSD mapping documents
- Generated: By `/gsd:map-codebase` command
- Consumed: By `/gsd:plan-phase` and `/gsd:execute-phase`

---

*Structure analysis: 2026-02-15*
