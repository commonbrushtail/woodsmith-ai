# Architecture

**Analysis Date:** 2026-02-15

## Pattern Overview

**Overall:** Next.js 16 App Router with server-client hybrid pattern and strict separation of public/admin route groups.

**Key Characteristics:**
- Route groups (`(public)` and `(admin)`) with different layout wrappers
- Server Components for data-fetching, Client Components (`'use client'`) for interactivity
- Supabase server client in Server Actions, browser client in Client Components
- Middleware enforces auth via route rules; RLS policies provide database-level authorization
- No API routes — all mutations go through Server Actions (`'use server'`)
- Tailwind CSS v4 with `@theme` design tokens in `globals.css`

## Layers

**Middleware & Auth:**
- Purpose: Session refresh, route protection, role-based redirects
- Location: `middleware.js`, `src/lib/auth/route-rules.js`
- Contains: Pure function `getRouteAction()` for testable route logic
- Depends on: Supabase session, user metadata
- Used by: Next.js request pipeline

**Server Actions & Data Mutations:**
- Purpose: Server-side CRUD operations with Supabase service role
- Location: `src/lib/actions/*.js` (18 files: products, blog, banners, users, etc.)
- Contains: Exported async functions with `'use server'` directive
- Depends on: Service client (`admin.js`), Zod schemas, audit logging
- Used by: Client Components via `useTransition()`, Server Components for initial data

**Public Data Access:**
- Purpose: RLS-filtered read operations for public pages
- Location: `src/lib/data/public.js`
- Contains: 13 functions for products, blog, banners, gallery, FAQ, branches
- Depends on: Server client with RLS policies
- Used by: Server Components in `(public)` route group

**Page Layer:**
- Purpose: Server Components that compose sections and pass props
- Location: `src/app/(public)/*.jsx`, `src/app/(admin)/admin/*/page.jsx` (48 total)
- Contains: Default exports, metadata, data fetching via Server Actions
- Depends on: Section components, data fetching functions
- Used by: Next.js App Router

**Component Layer:**
- Purpose: Reusable UI sections and CMS components
- Location: `src/components/*.jsx` (19 public), `src/components/admin/*.jsx` (21 admin)
- Contains: Both Server Components (section layouts) and Client Components (interactive)
- Depends on: Tailwind tokens, hooks, form state management
- Used by: Pages, other components

**Utility Layer:**
- Purpose: Cross-cutting concerns (storage, validation, sanitization, logging)
- Location: `src/lib/*.js` (storage, sanitize, audit, rate-limit, etc.)
- Contains: Pure functions and helpers
- Depends on: Supabase clients, third-party validation (Zod)
- Used by: Server Actions, Client Components, middleware

## Data Flow

**Public Page Load (Homepage Example):**

1. Browser requests `GET /`
2. Middleware checks session (calls `getUser()`), routes to public layout
3. Server Component `HomePage` executes:
   - Calls `getPublishedProducts()` (RLS-filtered via anon client)
   - Calls `getPublishedBlogPosts()`, `getActiveBanners()`, etc. in parallel
   - Passes data as props to Section Components
4. Section Components render with data, emit HTML to browser
5. Client-side hydration: Navbar/Footer/LineFAB initialize with `'use client'` interactivity

**Admin CRUD Flow (Edit Product Example):**

1. Browser requests `GET /admin/products/[id]`
2. Middleware validates: checks `getUser()`, confirms admin role via `getRouteAction()`
3. If not admin, redirect to `/login`
4. Server Component `ProductEditPage` calls `getProduct(id)` via Server Action
5. Server Action uses service client (admin privileges) to fetch all related data
6. Server returns `ProductEditClient` component with initial product data
7. `ProductEditClient` (`'use client'`) manages form state with `useTransition()`
8. On form submit: calls Server Action `updateProduct()`
9. Server Action validates (Zod), sanitizes input, updates database, logs audit
10. Server returns updated product or error
11. Client: `useTransition()` updates UI, calls `revalidatePath()` to refresh data

**Customer Authentication (Quotation Request):**

1. Customer browses public site, clicks "Request Quotation"
2. `QuotationModal` (`'use client'`) opens
3. Customer fills form (phone, name, product selection)
4. On submit: calls Server Action `createQuotation()`
5. Server Action:
   - Sanitizes input
   - Validates via Zod
   - Creates record in `quotations` table
   - Logs audit event via `logAudit()`
6. Toast notification confirms submission

**State Management:**

- **Server State**: Supabase database, managed via Service Role in Server Actions
- **Request State**: `FormData` passed to Server Actions
- **Component State**: `useState()` for local UI (filters, modals, pagination)
- **Global State**: `ToastProvider` context for notifications
- **Async State**: `useTransition()` for loading/error states during Server Action calls

## Key Abstractions

**Supabase Clients (3 variants):**
- `src/lib/supabase/client.js`: Browser client (anon auth, session-aware)
- `src/lib/supabase/server.js`: Server client in Server Components/Actions (session refresh)
- `src/lib/supabase/admin.js`: Service role client (unrestricted write, admin operations)
- Purpose: Consistent abstraction; context-appropriate auth levels

**Server Action Pattern:**
- Every CRUD operation: `export async function action(formData) { 'use server' ... }`
- Input: FormData (form-encoded) or direct args
- Output: `{ data: T, error: string | null }`
- Example: `src/lib/actions/products.js` exports 6 actions (get, create, update, delete, reorder, toggle)

**ListClient Components (Admin CMS):**
- `src/components/admin/ProductsListClient.jsx` and 6 others (`*ListClient.jsx`)
- Purpose: Searchable, paginated tables with CRUD buttons
- State: pagination, search filters, loading states
- Calls: Server Actions for mutations
- Pattern: stateful wrapper around `AdminTable` display component

**Error Handling:**
- `AppError` class with statusCode and details: `src/lib/errors.js`
- Helper functions: `notFound(msg)`, `unauthorized()`, `forbidden()`, `badRequest(details)`
- Server Actions catch and return `{ error: string }` to client
- Client: Toast notification with error message

**Input Validation & Sanitization:**
- Zod schemas in `src/lib/validations/`: products, blog, quotations
- Sanitize HTML: `sanitize-html.js` for TipTap rich text output
- Sanitize input: `sanitize.js` for XSS prevention (removes script tags, etc.)
- Rate limiting: `rate-limit.js` for login attempts

## Entry Points

**Root Layout:**
- Location: `src/app/layout.jsx`
- Triggers: Every request
- Responsibilities: Render `<html>`, `<head>`, `<body>` once globally; load fonts; wrap with `Providers` (ToastProvider)

**Public Route Group:**
- Location: `src/app/(public)/layout.jsx`
- Triggers: All requests matching `(public)` routes
- Responsibilities: Inject TopBar, Navbar, Footer, LineFAB, CookieConsent wrapper; add ErrorBoundary

**Admin Route Group:**
- Location: `src/app/(admin)/admin/layout.jsx`
- Triggers: All requests matching `/admin/*`
- Responsibilities: Inject sidebar, main content wrapper; admin metadata

**Homepage:**
- Location: `src/app/(public)/page.jsx`
- Triggers: `GET /`
- Responsibilities: Fetch all public content (banners, products, blog, gallery, highlights), compose hero/section layout

**Admin Login:**
- Location: `src/app/(admin)/login/page.jsx`
- Triggers: Middleware redirects unauthenticated admin access here
- Responsibilities: Email/password form, calls `adminLogin()` Server Action

**Middleware:**
- Location: `middleware.js`
- Triggers: Every request (except static assets, API routes)
- Responsibilities: Refresh session, check auth status, apply route rules (redirect unauthenticated to /login)

## Error Handling

**Strategy:** Centralized error objects passed back to client; Toast notifications for user feedback.

**Patterns:**

1. **Server Action Errors:**
```javascript
// In Server Action (src/lib/actions/products.js)
const { error: validationError } = productSchema.safeParse(productData)
if (validationError) {
  return { data: null, error: 'Invalid product data' }
}
const { error } = await supabase.from('products').insert(productData)
if (error) {
  return { data: null, error: error.message }
}
return { data: newProduct, error: null }
```

2. **Client-Side Error Display:**
```javascript
// In Client Component (ProductsListClient.jsx)
const [isPending, startTransition] = useTransition()
const { showToast } = useToast()
const handleDelete = (id) => {
  startTransition(async () => {
    const result = await deleteProduct(id)
    if (result.error) {
      showToast(result.error, 'error')
    }
  })
}
```

3. **Form Validation:**
```javascript
// Zod schema in src/lib/validations/products.js
export const productCreateSchema = z.object({
  name: z.string().min(1, 'Name required'),
  code: z.string().regex(/^[A-Z0-9]+$/, 'Code must be alphanumeric'),
  // ...
})
```

4. **Middleware Route Errors:**
```javascript
// middleware.js: Redirect unauthenticated admin access
if (pathname.startsWith('/admin') && !user) {
  return { redirect: '/login' }
}
```

## Cross-Cutting Concerns

**Logging:**
- Audit logging for admin actions: `src/lib/audit.js`
- Function: `logAudit(userId, action, entity, details)`
- Example: Creates `audit_logs` entry when product is updated
- Called from: Server Actions after mutations

**Validation:**
- Input: Zod schemas in `src/lib/validations/`
- Flow: FormData → Server Action → validate → sanitize → Supabase
- Errors returned to client as toast messages

**Authentication:**
- Admin: Email/password via Supabase Auth (role: 'admin' or 'editor')
- Customer: SMS OTP + LINE Login via Supabase Auth (role: 'customer')
- Middleware: Refreshes session on every request
- RLS: Database policies further restrict what role can read/write

**Storage:**
- 6 Supabase storage buckets (products, banners, blog, gallery, manuals, video-highlights)
- Upload: `uploadFile(bucket, file, path)` → returns public URL
- Delete: `deleteFile(bucket, path)` → removes from storage
- Called from: Server Actions for image uploads

**Rate Limiting:**
- `src/lib/rate-limit.js`: In-memory counter per IP
- Applied to: Login attempts (5 per 15 min)
- Returns: `{ success: true/false, remaining: number }`

---

*Architecture analysis: 2026-02-15*
