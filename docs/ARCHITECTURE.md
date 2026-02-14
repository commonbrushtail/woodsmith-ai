# WoodSmith AI -- Architecture Document

Last updated: 2026-02-14

---

## 1. Tech Stack

| Layer        | Technology                       | Version   | Notes                                                    |
|--------------|----------------------------------|-----------|----------------------------------------------------------|
| Framework    | Next.js (App Router)             | ^16.1.6   | Using `--webpack` flag (not Turbopack) for dev and build |
| UI Library   | React                            | ^19.2.0   |                                                          |
| Styling      | Tailwind CSS v4                  | ^4.1.18   | `@theme` block in `globals.css`, no `tailwind.config.js` |
| PostCSS      | @tailwindcss/postcss             | ^4.1.18   |                                                          |
| Carousel     | Swiper                           | ^12.1.0   | Used in hero, gallery, product detail image viewer       |
| Prop Types   | prop-types                       | ^15.8.1   | Runtime prop validation                                  |
| Rich Text    | TipTap (free core)               | --        | `@tiptap/react`, `@tiptap/starter-kit`, `@tiptap/extension-image`, `@tiptap/extension-link`. For blog/product editors. |
| Linting      | ESLint 9 + eslint-plugin-react-hooks | ^9.39.1 |                                                        |
| Language     | JavaScript (JSX)                 | --        | No TypeScript source files; TS types installed as devDeps|
| Node runtime | Next.js built-in                 | --        | `next dev`, `next build`, `next start`                   |

### Notable Configuration

- **`next.config.mjs`**: Disables Next.js static image imports (`disableStaticImages: true`). Images are handled via a custom webpack `asset/resource` rule for `png|jpg|gif|svg|webp|avif|ico` files. This means images are imported as hashed URLs (e.g., `import img from '../assets/file.png'`), not through `next/image`.
- **Fonts**: IBM Plex Sans Thai (Google Fonts) and Circular Std (cdnfonts.com), loaded via `<link>` tags in the root layout `<head>`.

---

## 2. Project Structure

```
woodsmith-ai/
|-- docs/
|   |-- ARCHITECTURE.md              <-- this file
|-- public/
|   |-- favicon.png
|-- src/
|   |-- app/
|   |   |-- globals.css              # Tailwind import + @theme design tokens
|   |   |-- layout.jsx               # Root layout (html, head, body)
|   |   |-- (public)/
|   |   |   |-- layout.jsx           # Public shell: TopBar + Navbar + Footer + LineFAB
|   |   |   |-- page.jsx             # Homepage
|   |   |   |-- about/page.jsx
|   |   |   |-- blog/page.jsx
|   |   |   |-- blog/[id]/page.jsx
|   |   |   |-- branches/page.jsx
|   |   |   |-- faq/page.jsx
|   |   |   |-- highlight/page.jsx
|   |   |   |-- manual/page.jsx
|   |   |   |-- products/page.jsx
|   |   |   |-- products/[category]/page.jsx
|   |   |   |-- products/[category]/[subcategory]/page.jsx
|   |   |   |-- product/[id]/page.jsx
|   |   |-- (admin)/
|   |   |   |-- layout.jsx           # Admin group layout (metadata only)
|   |   |   |-- login/page.jsx
|   |   |   |-- login/forgot-password/page.jsx
|   |   |   |-- login/forgot-password/sent/page.jsx
|   |   |   |-- admin/
|   |   |       |-- layout.jsx       # Dashboard shell: AdminSidebar + main content
|   |   |       |-- dashboard/page.jsx
|   |   |       |-- banner/page.jsx
|   |   |       |-- banner/edit/[id]/page.jsx
|   |   |       |-- products/page.jsx
|   |   |       |-- products/create/page.jsx
|   |   |       |-- blog/page.jsx
|   |   |       |-- blog/create/page.jsx
|   |   |       |-- video-highlight/page.jsx
|   |   |       |-- video-highlight/create/page.jsx
|   |   |       |-- gallery/page.jsx
|   |   |       |-- gallery/create/page.jsx
|   |   |       |-- manual/page.jsx
|   |   |       |-- manual/create/page.jsx
|   |   |       |-- about-us/page.jsx
|   |   |       |-- branch/page.jsx
|   |   |       |-- branch/create/page.jsx
|   |   |       |-- faq/page.jsx
|   |   |       |-- faq/create/page.jsx
|   |   |       |-- quotations/page.jsx
|   |   |       |-- quotations/[id]/page.jsx
|   |   |       |-- users/page.jsx
|   |   |       |-- profile/page.jsx
|   |   |       |-- account/page.jsx
|   |-- components/
|   |   |-- ArrowRight.jsx
|   |   |-- TopBar.jsx
|   |   |-- Navbar.jsx                # Includes mobile menu
|   |   |-- HeroSection.jsx
|   |   |-- AboutSection.jsx
|   |   |-- BlogSection.jsx           # Includes CardBlogLandscape
|   |   |-- HighlightSection.jsx       # Includes YoutubeCard
|   |   |-- ProductsSection.jsx        # Includes CardProduct
|   |   |-- GallerySection.jsx
|   |   |-- Footer.jsx
|   |   |-- LineFAB.jsx
|   |   |-- admin/
|   |       |-- AdminSidebar.jsx
|   |       |-- AdminHeader.jsx
|   |       |-- AdminTable.jsx
|   |       |-- AdminButton.jsx
|   |       |-- AdminInput.jsx
|   |       |-- AdminModal.jsx
|   |       |-- AdminEmptyState.jsx
|   |-- assets/                        # Images and SVGs with hashed filenames
|-- next.config.mjs
|-- package.json
|-- postcss.config.mjs
|-- eslint.config.mjs
```

---

## 3. Route Map

### Public Routes (layout: TopBar + Navbar + Footer + LineFAB)

| URL Path                                    | File                                                        | Description                                                       |
|---------------------------------------------|-------------------------------------------------------------|-------------------------------------------------------------------|
| `/`                                         | `src/app/(public)/page.jsx`                                 | Homepage: hero carousel, about, blog, highlights, products, gallery |
| `/about`                                    | `src/app/(public)/about/page.jsx`                           | About WoodSmith page with company info and gallery                |
| `/blog`                                     | `src/app/(public)/blog/page.jsx`                            | Blog listing with category tabs and pagination                    |
| `/blog/:id`                                 | `src/app/(public)/blog/[id]/page.jsx`                       | Blog article detail page                                          |
| `/branches`                                 | `src/app/(public)/branches/page.jsx`                        | Branch/store locator with region filtering                        |
| `/faq`                                      | `src/app/(public)/faq/page.jsx`                             | FAQ page with accordion categories                                |
| `/highlight`                                | `src/app/(public)/highlight/page.jsx`                       | Video highlight gallery with YouTube embeds                       |
| `/manual`                                   | `src/app/(public)/manual/page.jsx`                          | Product installation manuals with PDF/YouTube links               |
| `/products`                                 | `src/app/(public)/products/page.jsx`                        | Product listing with filters, search, pagination                  |
| `/products/:category`                       | `src/app/(public)/products/[category]/page.jsx`             | Product category page with subcategory cards and product grid     |
| `/products/:category/:subcategory`          | `src/app/(public)/products/[category]/[subcategory]/page.jsx` | Product subcategory page with 5-column grid                     |
| `/product/:id`                              | `src/app/(public)/product/[id]/page.jsx`                    | Product detail: image gallery, color/surface/size selectors, specs |

### Admin Routes

| URL Path                        | File                                                          | Layout       | Description                              |
|---------------------------------|---------------------------------------------------------------|--------------|------------------------------------------|
| `/login`                        | `src/app/(admin)/login/page.jsx`                              | None (standalone) | Admin login form                    |
| `/login/forgot-password`        | `src/app/(admin)/login/forgot-password/page.jsx`              | None         | Forgot password form                     |
| `/login/forgot-password/sent`   | `src/app/(admin)/login/forgot-password/sent/page.jsx`         | None         | Password reset email sent confirmation   |
| `/admin/dashboard`              | `src/app/(admin)/admin/dashboard/page.jsx`                    | Sidebar      | CMS dashboard (placeholder)              |
| `/admin/banner`                 | `src/app/(admin)/admin/banner/page.jsx`                       | Sidebar      | Banner management table                  |
| `/admin/banner/edit/:id`        | `src/app/(admin)/admin/banner/edit/[id]/page.jsx`             | Sidebar      | Edit banner form                         |
| `/admin/products`               | `src/app/(admin)/admin/products/page.jsx`                     | Sidebar      | Product management table                 |
| `/admin/products/create`        | `src/app/(admin)/admin/products/create/page.jsx`              | Sidebar      | Create new product form                  |
| `/admin/blog`                   | `src/app/(admin)/admin/blog/page.jsx`                         | Sidebar      | Blog post management table               |
| `/admin/blog/create`            | `src/app/(admin)/admin/blog/create/page.jsx`                  | Sidebar      | Create blog post form                    |
| `/admin/video-highlight`        | `src/app/(admin)/admin/video-highlight/page.jsx`              | Sidebar      | Video highlight management               |
| `/admin/video-highlight/create` | `src/app/(admin)/admin/video-highlight/create/page.jsx`       | Sidebar      | Create video highlight form              |
| `/admin/gallery`                | `src/app/(admin)/admin/gallery/page.jsx`                      | Sidebar      | Gallery image management                 |
| `/admin/gallery/create`         | `src/app/(admin)/admin/gallery/create/page.jsx`               | Sidebar      | Upload gallery image form                |
| `/admin/manual`                 | `src/app/(admin)/admin/manual/page.jsx`                       | Sidebar      | Manual/guide management                  |
| `/admin/manual/create`          | `src/app/(admin)/admin/manual/create/page.jsx`                | Sidebar      | Create manual entry form                 |
| `/admin/about-us`               | `src/app/(admin)/admin/about-us/page.jsx`                     | Sidebar      | About Us content editor                  |
| `/admin/branch`                 | `src/app/(admin)/admin/branch/page.jsx`                       | Sidebar      | Branch/store management                  |
| `/admin/branch/create`          | `src/app/(admin)/admin/branch/create/page.jsx`                | Sidebar      | Create branch entry form                 |
| `/admin/faq`                    | `src/app/(admin)/admin/faq/page.jsx`                          | Sidebar      | FAQ management                           |
| `/admin/faq/create`             | `src/app/(admin)/admin/faq/create/page.jsx`                   | Sidebar      | Create FAQ entry form                    |
| `/admin/quotations`             | `src/app/(admin)/admin/quotations/page.jsx`                   | Sidebar      | Quotation request management             |
| `/admin/quotations/:id`         | `src/app/(admin)/admin/quotations/[id]/page.jsx`              | Sidebar      | Quotation detail view                    |
| `/admin/users`                  | `src/app/(admin)/admin/users/page.jsx`                        | Sidebar      | User management                          |
| `/admin/profile`                | `src/app/(admin)/admin/profile/page.jsx`                      | Sidebar      | Company profile editor                   |
| `/admin/account`                | `src/app/(admin)/admin/account/page.jsx`                      | Sidebar      | Current user account settings            |

---

## 4. Component Inventory

### Public Components (`src/components/`)

| Component          | File                        | Purpose                                                         |
|--------------------|-----------------------------|-----------------------------------------------------------------|
| ArrowRight         | `ArrowRight.jsx`            | Small SVG arrow icon used in "view details" links               |
| TopBar             | `TopBar.jsx`                | Top utility bar (social links, contact info)                    |
| Navbar             | `Navbar.jsx`                | Main navigation bar with logo, links, mobile hamburger menu     |
| HeroSection        | `HeroSection.jsx`           | Full-width Swiper carousel for homepage hero banners            |
| AboutSection       | `AboutSection.jsx`          | Company introduction section on homepage                        |
| BlogSection        | `BlogSection.jsx`           | Blog preview cards on homepage (includes CardBlogLandscape)     |
| HighlightSection   | `HighlightSection.jsx`      | YouTube video highlights section on homepage                    |
| ProductsSection    | `ProductsSection.jsx`       | Tabbed product showcase on homepage (construction/finished)     |
| GallerySection     | `GallerySection.jsx`        | Image gallery carousel section on homepage                      |
| Footer             | `Footer.jsx`                | Site footer with contact, links, QR code, social icons          |
| LineFAB            | `LineFAB.jsx`               | Fixed floating action button linking to LINE chat               |

### Admin Components (`src/components/admin/`)

| Component          | File                        | Purpose                                                         |
|--------------------|-----------------------------|-----------------------------------------------------------------|
| AdminSidebar       | `AdminSidebar.jsx`          | Two-panel sidebar: icon rail (78px) + submenu panel (241px). Three sections: Content, Quotation, Users. Active section determined by current pathname. |
| AdminHeader        | `AdminHeader.jsx`           | Page header with title, language selector, and settings icon. Auto-resolves title from pathname-to-title map. |
| AdminTable         | `AdminTable.jsx`            | Reusable data table with checkbox selection, column rendering, and pagination. Accepts `columns`, `data`, `itemsPerPage` props. |
| AdminButton        | `AdminButton.jsx`           | Button component with `primary` (orange), `secondary` (outlined), and `danger` (red) variants. |
| AdminInput         | `AdminInput.jsx`            | Form input component supporting text, textarea, select, and file upload types with label and required indicator. |
| AdminModal         | `AdminModal.jsx`            | Confirmation dialog with backdrop overlay, title, message, confirm/cancel buttons. |
| AdminEmptyState    | `AdminEmptyState.jsx`       | Empty state placeholder with icon, title, description, and optional action button. |

---

## 5. Design System

### Color Tokens (defined in `src/app/globals.css` `@theme` block)

| Token                    | Value                       | Tailwind Class      | Usage                          |
|--------------------------|-----------------------------|---------------------|--------------------------------|
| `--color-orange`         | `#ff7e1b`                   | `text-orange`, `bg-orange` | Brand primary, CTAs, active states |
| `--color-black`          | `#35383b`                   | `text-black`, `bg-black`   | Body text, headings            |
| `--color-grey`           | `#bfbfbf`                   | `text-grey`, `bg-grey`     | Secondary text, muted elements |
| `--color-brown`          | `#915e36`                   | `text-brown`, `bg-brown`   | Accent color                   |
| `--color-dark-brown`     | `#3e261f`                   | `text-dark-brown`          | Deep accent, selected borders  |
| `--color-white`          | `#ffffff`                   | `text-white`, `bg-white`   | Backgrounds                    |
| `--color-beige`          | `#f8f3ea`                   | `text-beige`, `bg-beige`   | Section backgrounds            |
| `--color-dark`           | `#494c4f`                   | `text-dark`, `bg-dark`     | Footer background              |
| `--color-highlight-bg`   | `rgba(62, 38, 31, 0.9)`    | `bg-highlight-bg`          | Overlay backgrounds            |

### Common Hard-Coded Colors (not in @theme)

These appear directly in utility classes throughout the codebase:

| Value          | Usage                                          |
|----------------|-------------------------------------------------|
| `#e5e7eb`      | Standard borders (Tailwind gray-200 equivalent) |
| `#e8e3da`      | Image placeholder backgrounds                  |
| `#d9d9d9`      | Calculator/placeholder backgrounds              |
| `#f9fafb`      | Table row hover, admin backgrounds              |
| `#6b7280`      | Secondary text in admin UI                      |
| `#374151`      | Primary text in admin UI                        |
| `#1f2937`      | Heading text in admin UI                        |
| `#9ca3af`      | Placeholder/disabled text in admin UI           |

### Typography

| Font Family               | Weight(s)        | Usage                                   |
|---------------------------|------------------|-----------------------------------------|
| IBM Plex Sans Thai        | 400, 500, 600, 700 | Primary font for all text             |
| IBM Plex Sans Thai Looped | 700              | Loaded but usage is limited             |
| Circular Std              | Various          | Display font for product English names  |

### Layout

- Max content width: `max-w-[1212px]` with `mx-auto`
- Responsive approach: mobile-first with `lg:` breakpoint (1024px)
- Horizontal padding: `px-[16px]` on mobile
- Admin sidebar: 78px icon rail + 241px submenu panel = 319px total

---

## 6. Data Flow

### Current State: 100% Static Mock Data

The entire application currently renders from hardcoded data. There are no API calls, no database connections, no server-side data fetching, and no external data sources.

| Data Domain      | Location                            | Pattern                                                     |
|------------------|-------------------------------------|-------------------------------------------------------------|
| Products         | Inline `const` arrays in page files | `const allProducts = [...]` and `const categoryData = {...}` defined at the top of each product page file |
| Product Detail   | Inline `const` object in page file  | `const productData = {...}` with images, colors, surfaces, sizes, specs, related products |
| Blog             | Inline `const` arrays in page files | Mock blog cards with static images and text                 |
| Banners          | Inline `const` arrays in page files | `const mockBanners = [...]` in admin banner page            |
| Admin Products   | Inline `const` arrays in page files | `const MOCK_PRODUCTS = [...]` with 10 hardcoded entries     |
| Branches         | Inline `const` arrays in page files | Region tabs and branch data in branches page                |
| FAQ              | Inline `const` arrays in page files | FAQ categories and Q&A pairs                                |
| Manuals          | Inline `const` arrays in page files | Manual cards with PDF/YouTube links                         |
| Gallery          | Inline `const` arrays in page files | Gallery image references                                    |
| Navigation       | Inline `const` arrays in components | Sidebar menu items, navbar links defined in component files |

### Data Duplication Concerns

- Product data is duplicated across multiple page files (`products/page.jsx`, `products/[category]/page.jsx`, `product/[id]/page.jsx`, `ProductsSection.jsx`). Each file maintains its own independent copy of product arrays.
- Image imports are repeated across many files (the same asset hashes appear in 5+ files).
- No shared data layer, context, or store exists.

### Form Handling

- Login form (`/login`): `handleSubmit` calls `e.preventDefault()` with no further action.
- Admin create/edit forms: UI is rendered but form submissions are no-ops.
- Product detail CTA ("Request Quote" button): No action attached.
- Search inputs: State is managed with `useState` but no actual filtering/search logic is connected.

---

## 7. Infrastructure Status

### What Exists

| Component             | Status | Details                                                         |
|-----------------------|--------|-----------------------------------------------------------------|
| Next.js App Router    | Done   | Fully structured with route groups `(public)` and `(admin)`    |
| Layout system         | Done   | Root, public (TopBar/Navbar/Footer), admin (Sidebar) layouts   |
| Page UI               | Done   | 38 pages rendered with complete visual fidelity                 |
| Component library     | Done   | 18 components (11 public, 7 admin) with consistent styling     |
| Design tokens         | Done   | Colors defined in `@theme` block, consumed via Tailwind classes |
| ESLint configuration  | Done   | ESLint 9 with React Hooks plugin                                |
| Responsive design     | Done   | Mobile-first with `lg:` breakpoint across all pages             |

### What Is Missing

| Component             | Status    | Impact                                                       |
|-----------------------|-----------|--------------------------------------------------------------|
| Database              | Missing   | No Prisma, Drizzle, Supabase, or any ORM/DB configuration   |
| API Routes            | Missing   | No `src/app/api/` directory; no server endpoints exist       |
| Authentication        | Missing   | Login page exists as UI only; no auth provider, session management, or token handling |
| Middleware             | Missing   | No `middleware.ts/js` for route protection or redirects      |
| Environment Variables | Missing   | No `.env`, `.env.local`, or `.env.example` files             |
| `src/lib/`            | Missing   | No utility library, database client, or shared helper functions |
| Image Optimization    | Disabled  | `next/image` static imports disabled; using raw `<img>` tags with webpack asset URLs |
| Server Components     | Unused    | Most pages use `'use client'` directive; no server-side data fetching patterns |
| State Management      | Missing   | No global state (Context, Zustand, Redux); all state is local `useState` |
| Form Validation       | Missing   | No form validation library (Zod, Yup, react-hook-form)      |
| Error Handling        | Missing   | No `error.jsx`, `not-found.jsx`, or `loading.jsx` files      |
| Testing               | Missing   | No test framework, test files, or test configuration         |
| CI/CD                 | Missing   | No GitHub Actions, deployment configuration, or build pipeline |
| Content Management    | Missing   | Admin CMS pages exist as UI shells but have no backend integration |
| File Upload           | Missing   | AdminInput has file upload UI but no actual upload handler    |
| Search                | Missing   | Search inputs exist in UI but perform no filtering or querying |
| Internationalization  | Partial   | Language selector UI exists in admin but no i18n framework is configured; site content is hardcoded in Thai |

### Architecture Gaps for Production Readiness

1. **No data persistence layer**: Every page renders from inline constants. A database (e.g., PostgreSQL via Supabase) and API routes are needed to make the CMS functional.

2. **No authentication/authorization**: The admin section is completely unprotected. See "User Model" section below for the dual-user architecture. Middleware is needed to protect `/admin/*` routes.

3. **No server-side rendering**: Despite using Next.js App Router, all pages are client components with `'use client'`. Public pages would benefit from Server Components for SEO and performance.

4. **No data abstraction**: Product/content data is duplicated across files. A shared data access layer (`src/lib/`) with fetch utilities, database queries, or API client functions should centralize data access.

5. **No error boundaries or loading states**: The app has no `error.jsx`, `loading.jsx`, or `not-found.jsx` files at any route level.

---

## 8. User Model

The application has two distinct user types with different authentication methods and access levels.

### Admin Users

| Attribute | Details |
|-----------|---------|
| Purpose | Manage website content via the CMS (`/admin/*` routes) |
| Auth method | Email + password (Supabase Auth email provider) |
| Password reset | Email-based reset flow (UI exists at `/login/forgot-password`) |
| Access | Full CMS access; role-based permissions (e.g., super admin vs editor) |
| Management | Created/invited by other admins via `/admin/users` |

### Regular Users (Customers)

| Attribute | Details |
|-----------|---------|
| Purpose | Browse products, request quotations on the public site |
| Auth methods | SMS OTP and LINE Login |
| SMS OTP | Supabase Auth phone provider (requires Twilio/MessageBird/Vonage) |
| LINE Login | Custom OIDC provider via Supabase Auth (LINE supports OpenID Connect) |
| Access | Public site only; can submit quotation requests, view order history |
| No CMS access | Regular users cannot access `/admin/*` routes |

### Auth Architecture (Planned)

```
Supabase Auth
|
|-- Email provider (admin users)
|   |-- Email + password login at /login
|   |-- Password reset via email
|
|-- Phone provider (regular users)
|   |-- SMS OTP login on public site
|
|-- Custom OIDC provider (regular users)
|   |-- LINE Login on public site
|
Middleware (middleware.js)
|-- /admin/* -> require admin role, redirect to /login if unauthenticated
|-- /account/* -> require any authenticated user (future customer account pages)
|-- Public routes -> no auth required

Database: users table
|-- role: 'admin' | 'editor' | 'customer'
|-- auth_provider: 'email' | 'phone' | 'line'
```

### Quotation Flow (Regular Users)

1. Customer browses products on public site (no login required)
2. Customer clicks "Request Quote" on a product detail page
3. Customer authenticates via SMS OTP or LINE Login (if not already logged in)
4. Customer fills out quotation form (product, quantity, contact details)
5. Quotation appears in admin CMS at `/admin/quotations`
6. Admin reviews and updates status (pending -> approved/rejected)
7. Customer can view their quotation status (future: customer account page)
