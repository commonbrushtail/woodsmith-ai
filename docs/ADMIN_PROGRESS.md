# Admin CMS Progress

This document tracks the implementation status of the WoodSmith AI admin CMS.
All admin routes live under `src/app/(admin)/`. The project uses Next.js 16 App Router
with React 19 and Tailwind CSS 4.

**Current state:** Every admin page renders static, hardcoded mock data. There is no
database, no API layer, no authentication, no middleware, and no environment
configuration.

---

## Shared Components

| Component | File | Status | Notes |
|-----------|------|--------|-------|
| AdminSidebar | `src/components/admin/AdminSidebar.jsx` | Done | Purely presentational. Three icon sections (Content, Quotation, Users) with submenu panel. Uses `usePathname()` to highlight active route. No auth/role gating. |
| AdminTable | `src/components/admin/AdminTable.jsx` | Done | Reusable table with client-side pagination (slices data array), row selection checkboxes. Props: `columns`, `data`, `onPageChange`, `itemsPerPage`. Pagination is local only -- no server-side support. |
| AdminButton | `src/components/admin/AdminButton.jsx` | Done | Purely presentational. Variants: `primary`, `secondary`, `danger`. Props: `variant`, `children`, `onClick`, `disabled`, `className`. |
| AdminInput | `src/components/admin/AdminInput.jsx` | Done | Purely presentational. Supports types: `text`, `textarea`, `select`, `file`. File input renders a dashed upload area but has no actual upload logic -- the hidden `<input type="file">` is not wired to any handler. |
| AdminModal | `src/components/admin/AdminModal.jsx` | Done | Confirmation dialog with backdrop. Props: `isOpen`, `title`, `message`, `onConfirm`, `onCancel`, `confirmText`, `cancelText`. No async operation support. |
| AdminEmptyState | `src/components/admin/AdminEmptyState.jsx` | Done | Purely presentational. Shows icon, title, description, and optional action button. |
| AdminHeader | `src/components/admin/AdminHeader.jsx` | Done | Displays page title from a static lookup map keyed by pathname. Includes a non-functional language selector ("Thai (th)") and settings icon button. No real i18n or settings behavior. |

---

## Page-by-Page Status

### Login

Pages: `/login`, `/login/forgot-password`, `/login/forgot-password/sent`

| Requirement | Status | Notes |
|------------|--------|-------|
| Frontend UI | [x] Done | Login form with email, password, show/hide toggle, remember-me checkbox. Forgot-password flow has two sub-pages. |
| Real data connection | [ ] Not started | `handleSubmit` calls `e.preventDefault()` and does nothing else. |
| API routes | [ ] Not started | No `/api/auth` routes exist. |
| Authentication logic | [ ] Not started | No credential validation, no session creation. |
| Form validation | [ ] Not started | No client-side validation beyond HTML `type="email"`. |
| Error handling | [ ] Not started | No error messages displayed on failed login. |
| Password reset flow | [ ] Not started | Forgot-password pages are UI only. |

### Dashboard

Page: `/admin/dashboard`

| Requirement | Status | Notes |
|------------|--------|-------|
| Frontend UI | [~] Partial | Renders AdminHeader and a grey placeholder box with text "Dashboard content will be added here". |
| Real data connection | [ ] Not started | No data displayed. |
| API routes | [ ] Not started | |
| Statistics / charts | [ ] Not started | |

### Products

Pages: `/admin/products` (list), `/admin/products/create` (create form)

| Requirement | Status | Notes |
|------------|--------|-------|
| Frontend UI | [x] Done | List page with 10-item hardcoded `MOCK_PRODUCTS` array. Custom table with checkboxes, search bar, filter button, pagination controls. Create page has tabbed form (general, options, details, characteristics, specifications) with rich-text editor toolbar (non-functional), image upload placeholders, color/size chip selectors. |
| Real data connection | [ ] Not started | `MOCK_PRODUCTS` is a `const` array defined inline. |
| API routes | [ ] Not started | No `/api/products` routes. |
| CRUD operations | [ ] Not started | No create, read, update, or delete logic. "Save" button has no handler. |
| Form validation | [ ] Not started | Required markers shown in UI but no validation logic. |
| Error handling | [ ] Not started | |
| File uploads | [ ] Not started | Image upload buttons exist in create form but are not wired. |
| Edit page | [ ] Not started | No `/admin/products/edit/[id]` route exists. |
| Search / filter | [ ] Not started | Search input updates local state but does not filter `MOCK_PRODUCTS`. Filter button is non-functional. |
| Pagination | [ ] Not started | Pagination controls are hardcoded (`totalEntries = 2000`, `totalPages = 10`), not derived from data. |

### Banner

Pages: `/admin/banner` (list), `/admin/banner/edit/[id]` (edit)

| Requirement | Status | Notes |
|------------|--------|-------|
| Frontend UI | [x] Done | List page with 3-item `mockBanners` array. Table with order, date, status columns. Edit route exists. |
| Real data connection | [ ] Not started | Static mock data. |
| API routes | [ ] Not started | |
| CRUD operations | [ ] Not started | |
| Form validation | [ ] Not started | |
| Error handling | [ ] Not started | |
| File uploads | [ ] Not started | Banner images are placeholders. |

### Blog

Pages: `/admin/blog` (list), `/admin/blog/create` (create form)

| Requirement | Status | Notes |
|------------|--------|-------|
| Frontend UI | [x] Done | List page with 10-item `MOCK_BLOGS` array. Full table with sorting (order column toggles asc/desc on the mock array), action dropdown menu (edit link, delete button). Create page exists. |
| Real data connection | [ ] Not started | Static mock data. |
| API routes | [ ] Not started | |
| CRUD operations | [ ] Not started | Delete button in action menu calls `setOpenMenuId(null)` only. |
| Form validation | [ ] Not started | |
| Error handling | [ ] Not started | |
| File uploads | [ ] Not started | |
| Edit page | [ ] Not started | Links to `/admin/blog/edit/${id}` but that route does not exist yet. |

### Video Highlight

Pages: `/admin/video-highlight` (list), `/admin/video-highlight/create` (create form)

| Requirement | Status | Notes |
|------------|--------|-------|
| Frontend UI | [x] Done | List and create pages exist. |
| Real data connection | [ ] Not started | Static mock data. |
| API routes | [ ] Not started | |
| CRUD operations | [ ] Not started | |
| Form validation | [ ] Not started | |
| Error handling | [ ] Not started | |

### Gallery

Pages: `/admin/gallery` (list), `/admin/gallery/create` (create form)

| Requirement | Status | Notes |
|------------|--------|-------|
| Frontend UI | [x] Done | List and create pages exist. |
| Real data connection | [ ] Not started | Static mock data. |
| API routes | [ ] Not started | |
| CRUD operations | [ ] Not started | |
| Form validation | [ ] Not started | |
| Error handling | [ ] Not started | |
| File uploads | [ ] Not started | Gallery is image-heavy; upload handling is critical. |

### Manual

Pages: `/admin/manual` (list), `/admin/manual/create` (create form)

| Requirement | Status | Notes |
|------------|--------|-------|
| Frontend UI | [x] Done | List and create pages exist. |
| Real data connection | [ ] Not started | Static mock data. |
| API routes | [ ] Not started | |
| CRUD operations | [ ] Not started | |
| Form validation | [ ] Not started | |
| Error handling | [ ] Not started | |
| File uploads | [ ] Not started | Manuals likely require PDF or document uploads. |

### About Us

Page: `/admin/about-us` (single-page editor)

| Requirement | Status | Notes |
|------------|--------|-------|
| Frontend UI | [x] Done | Single editor page exists. |
| Real data connection | [ ] Not started | Static mock data. |
| API routes | [ ] Not started | |
| CRUD operations | [ ] Not started | |
| Form validation | [ ] Not started | |
| Error handling | [ ] Not started | |
| File uploads | [ ] Not started | |

### Branch

Pages: `/admin/branch` (list), `/admin/branch/create` (create form)

| Requirement | Status | Notes |
|------------|--------|-------|
| Frontend UI | [x] Done | List and create pages exist. |
| Real data connection | [ ] Not started | Static mock data. |
| API routes | [ ] Not started | |
| CRUD operations | [ ] Not started | |
| Form validation | [ ] Not started | |
| Error handling | [ ] Not started | |

### FAQ

Pages: `/admin/faq` (list), `/admin/faq/create` (create form)

| Requirement | Status | Notes |
|------------|--------|-------|
| Frontend UI | [x] Done | List and create pages exist. |
| Real data connection | [ ] Not started | Static mock data. |
| API routes | [ ] Not started | |
| CRUD operations | [ ] Not started | |
| Form validation | [ ] Not started | |
| Error handling | [ ] Not started | |

### Quotations

Pages: `/admin/quotations` (list), `/admin/quotations/[id]` (detail view)

| Requirement | Status | Notes |
|------------|--------|-------|
| Frontend UI | [x] Done | List page and detail page with `MOCK_QUOTATION` object. Detail view has status dropdown (pending/approved/rejected) that updates local state only. Publish and Save buttons have no handlers. |
| Real data connection | [ ] Not started | `MOCK_QUOTATION` is a `const` object defined inline. Dynamic `[id]` param is read via `use(params)` but not used to fetch data. |
| API routes | [ ] Not started | |
| CRUD operations | [ ] Not started | Status change is local state only. |
| Form validation | [ ] Not started | |
| Error handling | [ ] Not started | |

### Users

Page: `/admin/users`

| Requirement | Status | Notes |
|------------|--------|-------|
| Frontend UI | [x] Done | Has sub-navigation with "Roles" and "Users" tabs. |
| Real data connection | [ ] Not started | Static mock data. |
| API routes | [ ] Not started | |
| CRUD operations | [ ] Not started | |
| Role management | [ ] Not started | |
| User invitation | [ ] Not started | |

### Profile

Page: `/admin/profile`

| Requirement | Status | Notes |
|------------|--------|-------|
| Frontend UI | [x] Done | Page exists. |
| Real data connection | [ ] Not started | Static mock data. |
| API routes | [ ] Not started | |
| CRUD operations | [ ] Not started | |
| Form validation | [ ] Not started | |
| Error handling | [ ] Not started | |

### Account

Page: `/admin/account`

| Requirement | Status | Notes |
|------------|--------|-------|
| Frontend UI | [x] Done | Account settings page with form fields and custom select dropdown. |
| Real data connection | [ ] Not started | Static mock data. |
| API routes | [ ] Not started | |
| CRUD operations | [ ] Not started | |
| Form validation | [ ] Not started | |
| Error handling | [ ] Not started | |
| Password change | [ ] Not started | |

---

## Cross-Cutting Concerns

| Concern | Status | Notes |
|---------|--------|-------|
| Admin auth (email + password) | [ ] Not started | Login form submit handler is empty (`e.preventDefault()` only). No session tokens, no cookies, no JWT. Planned: Supabase Auth email provider. |
| Customer auth (SMS OTP) | [ ] Not started | No public-facing login exists. Planned: Supabase Auth phone provider (Twilio/MessageBird/Vonage). Customers authenticate to submit quotations. |
| Customer auth (LINE Login) | [ ] Not started | No LINE integration. Planned: Supabase Auth custom OIDC provider (LINE supports OpenID Connect). |
| Authorization / RBAC | [ ] Not started | No role checks anywhere. AdminSidebar renders all menu items unconditionally. Users page has role UI but no enforcement. Planned roles: `admin`, `editor`, `customer`. |
| Session management | [ ] Not started | No session handling. No middleware to check auth state. |
| Database | [ ] Not started | No database configured. No ORM installed (no Prisma, Drizzle, or Supabase in `package.json`). No `.env` files. No `src/lib/` directory. Planned: Supabase (PostgreSQL). |
| API routes | [ ] Not started | `src/app/api/` directory does not exist. Zero API endpoints. |
| Middleware | [ ] Not started | No `middleware.ts` or `middleware.js` in the project root. Needed to protect `/admin/*` routes (admin role required) and future `/account/*` routes (any authenticated user). |
| File storage | [ ] Not started | No upload handling. `AdminInput` type="file" renders a UI but the hidden file input is not connected to any storage service. Planned: Supabase Storage. |
| Pagination (real) | [ ] Not started | All pagination is client-side against hardcoded arrays with fake totals (e.g., `totalEntries = 2000`). |
| Search / filter (real) | [ ] Not started | Search inputs update local state but do not filter data. Filter buttons are non-functional. |
| Sorting (real) | [ ] Not started | Blog page sorts its mock array in memory. No server-side sort support. |
| i18n | [ ] Not started | All Thai text is hardcoded as string literals. Language selector dropdown ("Thai (th)") in AdminHeader is non-functional. |
| Rich text editing | [ ] Not started | Product create page has a `RichTextEditor` component with toolbar buttons but no actual editing capability. Content is rendered as a static `<div>`, not a `contenteditable` or editor library integration. |
| Environment config | [ ] Not started | No `.env`, `.env.local`, or `.env.example` files exist. |
| Customer quotation flow | [ ] Not started | Quotation request form on public site needs auth gate (SMS/LINE login before submission). Submitted quotations appear in admin CMS. |
| Customer account pages | [ ] Not started | No public `/account/*` routes exist. Customers will need pages to view their quotation history and status. |

---

## Missing Pages / Routes

The following routes are referenced in navigation or links but do not have corresponding page files:

| Expected Route | Referenced From | Notes |
|---------------|----------------|-------|
| `/admin/products/edit/[id]` | (implied by list pattern) | No edit page for products. |
| `/admin/blog/edit/[id]` | Blog list page action menu links to this path. | Route does not exist. |
| `/admin/video-highlight/edit/[id]` | (implied by list pattern) | Not created. |
| `/admin/gallery/edit/[id]` | (implied by list pattern) | Not created. |
| `/admin/manual/edit/[id]` | (implied by list pattern) | Not created. |
| `/admin/branch/edit/[id]` | (implied by list pattern) | Not created. |
| `/admin/faq/edit/[id]` | (implied by list pattern) | Not created. |

---

## Summary

- **Total admin pages:** 26 (across login, dashboard, and 13 content sections)
- **Pages with UI complete:** 25 of 26 (dashboard is a placeholder)
- **Pages with real data:** 0 of 26
- **API routes:** 0
- **Database tables:** 0
- **Authentication:** None
