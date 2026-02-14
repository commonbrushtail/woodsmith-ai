# External Integrations

**Analysis Date:** 2026-02-15

## APIs & External Services

**Customer Authentication (OIDC):**
- LINE Login - Customer identity provider
  - SDK/Client: Built via OAuth2 integration (no SDK, direct HTTP calls)
  - Auth endpoints:
    - Authorization: `https://access.line.me/oauth2/v2.1/authorize`
    - Token: `https://api.line.me/oauth2/v2.1/token`
    - Profile: `https://api.line.me/v2/profile`
  - Env vars: `LINE_LOGIN_CHANNEL_ID`, `LINE_LOGIN_CHANNEL_SECRET`
  - Callback: `/auth/callback/line` route (`src/app/auth/callback/line/route.js`)
  - Config: `src/lib/auth/line-config.js`

**SMS OTP Provider:**
- Supabase-managed (Twilio, MessageBird, or Vonage backend)
  - Configured directly in Supabase Dashboard > Authentication > Phone
  - No separate SDK needed
  - Used for customer phone-based authentication

## Data Storage

**Databases:**
- Supabase PostgreSQL 14
  - Connection: `NEXT_PUBLIC_SUPABASE_URL`, `SUPABASE_SERVICE_ROLE_KEY`
  - Client library: `@supabase/supabase-js`, `@supabase/ssr`
  - ORM: None - Direct Supabase client queries
  - Tables: 14 tables (products, blog_posts, banners, quotations, user_profiles, branches, faqs, video_highlights, manuals, gallery_items, about_us, company_profile, audit_logs, product_images, product_options)
  - Schema: `supabase/migrations/001_initial_schema.sql` (enums, tables, triggers)
  - RLS: `supabase/migrations/002_rls_policies.sql` (public vs admin access)
  - Audit: `supabase/migrations/004_audit_logs.sql` (admin action logging)

**File Storage:**
- Supabase Storage (S3-compatible)
  - 6 buckets used:
    - `blog` - Blog post cover images
    - `products` - Product images
    - `banners` - Banner images
    - `manuals` - Manual PDFs and cover images
    - `gallery` - Gallery item images
  - Client functions: `src/lib/storage.js` (uploadFile, deleteFile, getPublicUrl)
  - Used by server actions: `src/lib/actions/blog.js`, `products.js`, `banners.js`, `manuals.js`, `gallery.js`
  - Service role key required for uploads (security)

**Caching:**
- None detected - No Redis or caching service

## Authentication & Identity

**Admin Auth:**
- Email + password via Supabase Auth
- Route protection: Middleware + route rules in `src/lib/auth/route-rules.js`
- Session management: `@supabase/ssr` handles cookie refresh

**Customer Auth:**
- SMS OTP (phone-based)
- LINE Login (OIDC via OAuth2)
- Both managed by Supabase Auth
- Session refresh middleware: `src/middleware.js`

**Auth Flow:**
1. Customer initiates LINE Login or SMS OTP
2. OAuth callback/SMS verification → Supabase Auth session
3. Middleware refreshes session on each request
4. User metadata stored in `user_profiles` table with `auth_provider` field

## Monitoring & Observability

**Error Tracking:**
- None detected - No Sentry, Rollbar, or error tracking service

**Logs:**
- Audit logs (admin actions only)
  - Table: `audit_logs` (user_id, action, table_name, record_id, changes, timestamp)
  - Logged by: `src/lib/audit.js` (createAuditLog function)
  - Used in server actions for admin mutations (products, blog, banners, etc.)
- Console logs in development
- Server logs (Next.js runtime logs only)

**Performance Monitoring:**
- None detected - No analytics or performance monitoring service

## CI/CD & Deployment

**Hosting:**
- Not deployed yet - Development only
- Recommended: Vercel (Next.js-native), Netlify, or self-hosted Node.js server

**CI Pipeline:**
- None detected - No GitHub Actions, GitLab CI, or other CI service configured

**Build System:**
- Next.js build: `npm run build`
- Test: `npm test` (Vitest)
- E2E: `npm run test:e2e` (Playwright)
- No automated deployment

## Environment Configuration

**Required Env Vars:**
- `NEXT_PUBLIC_SUPABASE_URL` - Supabase project URL
- `NEXT_PUBLIC_SUPABASE_ANON_KEY` - Supabase anonymous key (browser client)
- `SUPABASE_SERVICE_ROLE_KEY` - Supabase service role key (server actions, uploads)
- `LINE_LOGIN_CHANNEL_ID` - LINE Login Channel ID
- `LINE_LOGIN_CHANNEL_SECRET` - LINE Login Channel Secret
- `NEXT_PUBLIC_SITE_URL` - Site URL for OAuth redirects (e.g., `http://localhost:3000`)

**Secrets Location:**
- `.env.local` - Local development (gitignored via `*.local`)
- Production: Vercel/hosting platform secrets
- Never commit `.env.local`

**Database Initialization:**
- Supabase CLI: `supabase db push` (applies migrations)
- Or manual SQL execution in Supabase dashboard

## Webhooks & Callbacks

**Incoming (Webhooks):**
- Supabase Auth webhooks: Not detected
- LINE Login callback: `/auth/callback/line` - Handles OAuth code exchange
- SMS OTP callback: `/auth/reset-password` - Password reset links
- Configuration: `src/app/auth/callback/` and `src/app/auth/reset-password/route.js`

**Outgoing (To External APIs):**
- None detected - App does not call external APIs (other than auth providers)

## Security Integrations

**Row-Level Security (RLS):**
- Enabled on all tables via `supabase/migrations/002_rls_policies.sql`
- Public customers: Can read public products, submit quotations
- Admin users: Full CRUD on all tables
- Enforced by Supabase server client (`SUPABASE_SERVICE_ROLE_KEY`)

**HTML Sanitization:**
- TipTap HTML output sanitized via `src/lib/sanitize-html.js`
- Prevents XSS in blog posts, product descriptions

**Input Sanitization:**
- `src/lib/sanitize.js` - General XSS prevention for form inputs

**Rate Limiting:**
- `src/lib/rate-limit.js` - Login attempt rate limiting
- Used in admin login endpoint

**File Upload Validation:**
- `src/lib/upload-validation.js` - File type and size checks before upload

## Data Flow Summary

1. **Public Customers:**
   - Browse products/blog (read-only via RLS)
   - Authenticate via SMS OTP or LINE Login
   - Submit quotation requests (write to `quotations` table)
   - View personal quotations

2. **Admin Users:**
   - Email/password login
   - CRUD operations on all content (products, blog, banners, etc.)
   - Upload images/files to Supabase Storage
   - View audit logs of all actions

3. **Server Actions:**
   - Mutations use server actions (`'use server'`) in `src/lib/actions/`
   - Service role key used for elevated permissions
   - Audit logging on all admin mutations
   - No REST API routes for mutations

---

*Integration audit: 2026-02-15*
