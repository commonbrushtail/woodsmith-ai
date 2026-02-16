---
phase: quick-13
plan: 01
type: execute
wave: 1
depends_on: []
files_modified:
  - src/lib/auth/require-admin.js
  - src/app/(admin)/admin/layout.jsx
  - src/lib/actions/banners.js
  - src/lib/actions/blog.js
  - src/lib/actions/blog-categories.js
  - src/lib/actions/branches.js
  - src/lib/actions/categories.js
  - src/lib/actions/dashboard.js
  - src/lib/actions/faqs.js
  - src/lib/actions/faq-groups.js
  - src/lib/actions/gallery.js
  - src/lib/actions/manuals.js
  - src/lib/actions/products.js
  - src/lib/actions/profile.js
  - src/lib/actions/quotations.js
  - src/lib/actions/users.js
  - src/lib/actions/variations.js
  - src/lib/actions/video-highlights.js
  - src/lib/actions/about-us.js
  - src/lib/actions/site-settings.js
autonomous: true
must_haves:
  truths:
    - "Unauthenticated users cannot access any /admin/* page"
    - "Unauthenticated users cannot call admin server actions"
    - "Non-admin users (customers) cannot access /admin/* pages"
    - "Non-admin users cannot call admin server actions"
    - "Admin/editor users can access admin pages and call admin actions normally"
  artifacts:
    - path: "src/lib/auth/require-admin.js"
      provides: "Reusable requireAdmin() utility"
      exports: ["requireAdmin"]
    - path: "src/app/(admin)/admin/layout.jsx"
      provides: "Server-side auth guard for all admin pages"
      contains: "requireAdmin"
  key_links:
    - from: "src/app/(admin)/admin/layout.jsx"
      to: "src/lib/auth/require-admin.js"
      via: "import and call"
      pattern: "requireAdmin"
    - from: "src/lib/actions/*.js"
      to: "src/lib/auth/require-admin.js"
      via: "import and call in mutation functions"
      pattern: "requireAdmin"
---

<objective>
Add defense-in-depth authentication enforcement for the admin CMS.

The middleware already redirects unauthenticated/non-admin users away from /admin/* routes, but:
1. The admin layout has NO server-side auth check -- if middleware fails silently, admin is wide open
2. Admin server actions (banners, gallery, manuals, blog, products, etc.) use createServiceClient() which bypasses RLS, and most do NOT verify the caller is an admin -- any authenticated user (even a customer) could call these directly

This plan adds a `requireAdmin()` utility, wires it into the admin layout (server-side guard), and adds it to all admin mutation server actions.

Purpose: Ensure no admin page or admin action is accessible without a verified admin/editor session, even if middleware is bypassed.
Output: Protected admin pages and server actions with role verification.
</objective>

<execution_context>
@C:/Users/commo/.claude/get-shit-done/workflows/execute-plan.md
@C:/Users/commo/.claude/get-shit-done/templates/summary.md
</execution_context>

<context>
@src/lib/auth/route-rules.js
@src/app/(admin)/admin/layout.jsx
@src/lib/supabase/server.js
@middleware.js
@src/lib/actions/banners.js
@src/lib/actions/blog.js
@src/lib/actions/products.js
</context>

<tasks>

<task type="auto">
  <name>Task 1: Create requireAdmin utility and add server-side auth guard to admin layout</name>
  <files>
    src/lib/auth/require-admin.js
    src/app/(admin)/admin/layout.jsx
  </files>
  <action>
Create `src/lib/auth/require-admin.js` with a `requireAdmin()` async function that:
1. Creates a Supabase server client via `createClient()` from `@/lib/supabase/server`
2. Calls `supabase.auth.getUser()` to get the current user
3. If no user, throws or returns an error object (for server actions: `{ error: 'ไม่ได้เข้าสู่ระบบ' }`)
4. Checks `user.user_metadata?.role` is in `['admin', 'editor']`
5. If not admin/editor, throws or returns error (for server actions: `{ error: 'ไม่มีสิทธิ์เข้าถึง' }`)
6. Returns the user object on success

Export TWO functions:
- `requireAdmin()` -- for use in server actions. Returns `{ user, error }`. Does NOT throw. Callers check `if (error) return { data: null, error }`.
- `requireAdminOrRedirect()` -- for use in server components (layout/pages). Calls `redirect('/login')` from `next/navigation` if user is not admin. This ensures the layout blocks rendering entirely.

Update `src/app/(admin)/admin/layout.jsx` to:
1. Make it an async server component
2. Call `await requireAdminOrRedirect()` at the top before rendering
3. Keep the existing AdminSidebar + ErrorBoundary + ClientOnly structure unchanged

IMPORTANT: The layout is a Server Component. `redirect()` from `next/navigation` works in Server Components. Do NOT use `useRouter` or client-side redirects.
  </action>
  <verify>
Run `npm run build` and verify no build errors. Verify the admin layout imports and calls requireAdminOrRedirect.
  </verify>
  <done>
`requireAdmin()` and `requireAdminOrRedirect()` exist. Admin layout calls `requireAdminOrRedirect()` before rendering. Unauthenticated or non-admin users are redirected to /login at the layout level.
  </done>
</task>

<task type="auto">
  <name>Task 2: Add requireAdmin() to all admin mutation server actions</name>
  <files>
    src/lib/actions/banners.js
    src/lib/actions/blog.js
    src/lib/actions/blog-categories.js
    src/lib/actions/branches.js
    src/lib/actions/categories.js
    src/lib/actions/dashboard.js
    src/lib/actions/faqs.js
    src/lib/actions/faq-groups.js
    src/lib/actions/gallery.js
    src/lib/actions/manuals.js
    src/lib/actions/products.js
    src/lib/actions/profile.js
    src/lib/actions/quotations.js
    src/lib/actions/users.js
    src/lib/actions/variations.js
    src/lib/actions/video-highlights.js
    src/lib/actions/about-us.js
    src/lib/actions/site-settings.js
  </files>
  <action>
Add `requireAdmin()` check to all MUTATION functions (create, update, delete, reorder) in admin server action files. Read-only getters used by public pages (e.g., `getBanners` used only by admin) can also get the check since they use `createServiceClient`. But do NOT add requireAdmin to:
- `src/lib/actions/admin-login.js` (this IS the login action)
- `src/lib/actions/auth.js` (auth utilities)
- `src/lib/actions/customer.js` (customer actions, not admin)
- `src/lib/actions/account.js` (customer account actions)
- `src/lib/actions/search.js` (public search)
- Any function in `src/lib/data/public.js` (public data fetching)

For each admin action file:
1. Add `import { requireAdmin } from '@/lib/auth/require-admin'` at the top
2. At the start of each mutation function, add:
   ```js
   const { user, error: authError } = await requireAdmin()
   if (authError) return { data: null, error: authError }
   ```
3. For functions that already call `authClient.auth.getUser()` to get the user for audit logging (e.g., blog.js createBlogPost, products.js), REPLACE that getUser call with the requireAdmin() call and use the returned `user` object. This avoids double-fetching.
4. For read-only admin functions (get* functions that use createServiceClient), add the same check at the top. These are admin-only data fetchers -- they use service role and should not be callable by non-admins.

Return format when auth fails: `{ data: null, error: authError }` for functions that return `{ data, error }`, or `{ error: authError }` for functions that return `{ error }`. Match the existing return shape of each function.

For `quotations.js`: The `createQuotation` action is called by customers (public site), so do NOT add requireAdmin to it. Only add it to admin-specific quotation actions like `getQuotations` (admin list), `updateQuotationStatus`, `deleteQuotation`.

For `profile.js`: Check if it serves admin profile or customer profile. If admin-only, add the guard.

For `dashboard.js`: `getDashboardStats` is admin-only -- add the guard.
  </action>
  <verify>
Run `npm run build` to verify no import or syntax errors. Run `npm test` to verify existing tests still pass (tests may need adjustment if they call admin actions without mocking auth -- if tests fail, check if the test file mocks the Supabase client and add requireAdmin mock as needed).
  </verify>
  <done>
All admin mutation and admin-only read server actions verify the caller is an authenticated admin/editor before proceeding. Non-admin callers receive an error response. Customer-facing actions (account, customer, quotation creation, search) remain unaffected.
  </done>
</task>

</tasks>

<verification>
1. `npm run build` succeeds with no errors
2. `npm test` passes (or test failures are limited to auth mocking that needs updating)
3. Visiting /admin/dashboard without being logged in redirects to /login (server-side, not just middleware)
4. All admin server action files import and call requireAdmin() at the top of mutations
</verification>

<success_criteria>
- requireAdmin() utility exists at src/lib/auth/require-admin.js
- Admin layout (src/app/(admin)/admin/layout.jsx) calls requireAdminOrRedirect() server-side
- All admin mutation server actions (18 files) check admin role via requireAdmin()
- Customer-facing actions (account, customer, search, public quotation creation) are NOT affected
- Build passes, tests pass
</success_criteria>

<output>
After completion, create `.planning/quick/13-currently-there-no-authentication-for-ad/13-SUMMARY.md`
</output>
