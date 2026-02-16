---
phase: quick-16
plan: 01
type: execute
wave: 1
depends_on: []
files_modified:
  - "src/app/(admin)/admin/login/page.jsx"
  - "src/app/(admin)/admin/login/forgot-password/page.jsx"
  - "src/app/(admin)/admin/login/forgot-password/sent/page.jsx"
  - "src/app/(admin)/admin/login/set-new-password/page.jsx"
  - src/lib/auth/route-rules.js
  - src/lib/auth/require-admin.js
  - src/components/admin/AdminSidebar.jsx
  - src/app/auth/reset-password/route.js
  - tests/middleware.test.js
  - e2e/auth/admin-login.spec.js
  - e2e/auth/admin-logout.spec.js
autonomous: true

must_haves:
  truths:
    - "Navigating to /admin/login shows the admin login page"
    - "Unauthenticated users accessing /admin/* are redirected to /admin/login"
    - "Authenticated admins accessing /admin/login are redirected to /admin/dashboard"
    - "Forgot-password and set-new-password flows work under /admin/login/*"
    - "Logout redirects to /admin/login"
    - "Old /login path no longer serves the admin login page"
    - "All unit tests pass with updated route expectations"
  artifacts:
    - path: "src/app/(admin)/admin/login/page.jsx"
      provides: "Admin login page at new /admin/login route"
    - path: "src/lib/auth/route-rules.js"
      provides: "Updated route rules handling /admin/login before /admin/* protection"
      exports: ["getRouteAction"]
  key_links:
    - from: "src/lib/auth/route-rules.js"
      to: "middleware.js"
      via: "getRouteAction import"
      pattern: "getRouteAction.*'/admin/login'"
    - from: "src/lib/auth/require-admin.js"
      to: "src/app/(admin)/admin/login/page.jsx"
      via: "redirect('/admin/login')"
      pattern: "redirect\\('/admin/login'\\)"
---

<objective>
Move admin login from /login to /admin/login to cleanly separate admin and customer authentication flows.

Purpose: The /login route currently serves the admin email/password login, but customers use SMS OTP + LINE Login via a modal on the public site. Having both share /login creates confusion. Moving admin login under /admin/login makes the URL semantics match the actual authentication boundary.

Output: Admin login and its sub-pages (forgot-password, set-new-password) live under /admin/login, all redirects and middleware rules updated, all tests passing.
</objective>

<execution_context>
@C:/Users/commo/.claude/get-shit-done/workflows/execute-plan.md
@C:/Users/commo/.claude/get-shit-done/templates/summary.md
</execution_context>

<context>
@src/lib/auth/route-rules.js
@src/lib/auth/require-admin.js
@middleware.js
@src/app/(admin)/login/page.jsx
@src/components/admin/AdminSidebar.jsx
@tests/middleware.test.js
</context>

<tasks>

<task type="auto">
  <name>Task 1: Move login pages and update all internal links</name>
  <files>
    src/app/(admin)/admin/login/page.jsx
    src/app/(admin)/admin/login/forgot-password/page.jsx
    src/app/(admin)/admin/login/forgot-password/sent/page.jsx
    src/app/(admin)/admin/login/set-new-password/page.jsx
    src/app/auth/reset-password/route.js
    src/components/admin/AdminSidebar.jsx
    src/lib/auth/require-admin.js
  </files>
  <action>
    1. Move the entire login directory tree from `src/app/(admin)/login/` to `src/app/(admin)/admin/login/`:
       - `git mv src/app/(admin)/login src/app/(admin)/admin/login`
       - This moves page.jsx, forgot-password/page.jsx, forgot-password/sent/page.jsx, set-new-password/page.jsx

    2. Update all internal `/login` references in the MOVED files to `/admin/login`:
       - `src/app/(admin)/admin/login/page.jsx` line 140: `href="/login/forgot-password"` -> `href="/admin/login/forgot-password"`
       - `src/app/(admin)/admin/login/forgot-password/page.jsx` line 27: `router.push('/login/forgot-password/sent?...')` -> `router.push('/admin/login/forgot-password/sent?...')`
       - `src/app/(admin)/admin/login/forgot-password/page.jsx` line 78: `href="/login"` -> `href="/admin/login"`
       - `src/app/(admin)/admin/login/forgot-password/sent/page.jsx` line 42: `href="/login"` -> `href="/admin/login"`
       - `src/app/(admin)/admin/login/set-new-password/page.jsx` line 32: `router.push('/login?reset=success')` -> `router.push('/admin/login?reset=success')`

    3. Update `src/app/auth/reset-password/route.js`:
       - Line 35: `${origin}/login/set-new-password` -> `${origin}/admin/login/set-new-password`
       - Line 40: `${origin}/login/forgot-password?error=invalid_link` -> `${origin}/admin/login/forgot-password?error=invalid_link`

    4. Update `src/components/admin/AdminSidebar.jsx`:
       - Line 127: `router.push('/login')` -> `router.push('/admin/login')`

    5. Update `src/lib/auth/require-admin.js`:
       - Line 30 comment: update "Redirects to /login" -> "Redirects to /admin/login"
       - Line 39: `redirect('/login')` -> `redirect('/admin/login')`
       - Line 44: `redirect('/login')` -> `redirect('/admin/login')`

    6. Delete the old directory if `git mv` didn't handle cleanup:
       - Verify `src/app/(admin)/login/` no longer exists (it should be gone after git mv)
  </action>
  <verify>
    - Confirm new files exist: `ls src/app/(admin)/admin/login/page.jsx`
    - Confirm old directory removed: `ls src/app/(admin)/login/` should fail or show empty
    - Grep for any remaining `/login` references that should be `/admin/login`: `grep -rn "'/login'" src/app/(admin)/admin/login/ src/lib/auth/require-admin.js src/components/admin/AdminSidebar.jsx src/app/auth/reset-password/route.js` should return zero matches (all should now be `/admin/login`)
  </verify>
  <done>All login page files live under src/app/(admin)/admin/login/, all internal links and redirects point to /admin/login/*, old /login directory is gone.</done>
</task>

<task type="auto">
  <name>Task 2: Update middleware route rules and all tests</name>
  <files>
    src/lib/auth/route-rules.js
    tests/middleware.test.js
    e2e/auth/admin-login.spec.js
    e2e/auth/admin-logout.spec.js
  </files>
  <action>
    1. Update `src/lib/auth/route-rules.js` — CRITICAL: The `/admin/login` check MUST come BEFORE the general `/admin` check to avoid redirect loops (unauthenticated user hitting /admin/login would otherwise be redirected to /admin/login infinitely).

       Replace the login and admin route blocks (lines 37-54) with:

       ```javascript
       // Admin login page: redirect authenticated admins to dashboard
       if (pathname === '/admin/login' || pathname.startsWith('/admin/login/')) {
         if (user && ADMIN_ROLES.includes(user.role)) {
           return { redirect: '/admin/dashboard' }
         }
         return 'allow'
       }

       // Admin routes: require admin/editor role
       if (pathname.startsWith('/admin')) {
         if (!user) {
           return { redirect: '/admin/login' }
         }
         if (!ADMIN_ROLES.includes(user.role)) {
           return { redirect: '/' }
         }
         return 'allow'
       }
       ```

       Key changes:
       - Login check is now `pathname === '/admin/login' || pathname.startsWith('/admin/login/')` (covers /admin/login, /admin/login/forgot-password, /admin/login/set-new-password, etc.)
       - This block MUST appear BEFORE the `pathname.startsWith('/admin')` block
       - Admin redirect for unauthenticated users now goes to `/admin/login` instead of `/login`
       - Remove the old `if (pathname === '/login')` block entirely

    2. Update `tests/middleware.test.js` — change all `/login` expectations to `/admin/login`:
       - Line 26: `{ redirect: '/login' }` -> `{ redirect: '/admin/login' }`
       - Line 31: `{ redirect: '/login' }` -> `{ redirect: '/admin/login' }`
       - Line 54: `getRouteAction('/login', user)` -> `getRouteAction('/admin/login', user)`
       - Line 59: `getRouteAction('/login', null)` -> `getRouteAction('/admin/login', null)`
       - Line 87: `{ redirect: '/login' }` -> `{ redirect: '/admin/login' }`
       - Line 92: `{ redirect: '/login' }` -> `{ redirect: '/admin/login' }`
       - Line 97: `{ redirect: '/login' }` -> `{ redirect: '/admin/login' }`
       - Line 151: `getRouteAction('/login', user)` -> `getRouteAction('/admin/login', user)` (customer test)
       - Line 152: update expectation — customer accessing /admin/login should now be ALLOWED (it's a login page, not a protected admin page). Change `expect(action).toBe('allow')` stays the same.
       - Line 157: `getRouteAction('/login', user)` -> `getRouteAction('/admin/login', user)` (editor test)
       - Update test descriptions to reference `/admin/login` instead of `/login`

       Add a NEW test to verify the old `/login` path is no longer special:
       ```javascript
       it('treats old /login path as a regular route (fallback allow)', () => {
         const action = getRouteAction('/login', null)
         expect(action).toBe('allow')
       })
       ```

       Add a test for forgot-password sub-route:
       ```javascript
       it('allows /admin/login/forgot-password without auth', () => {
         const action = getRouteAction('/admin/login/forgot-password', null)
         expect(action).toBe('allow')
       })
       ```

    3. Update `e2e/auth/admin-login.spec.js` — change all `/login` URLs to `/admin/login`:
       - Line 5: `page.goto('/login')` -> `page.goto('/admin/login')`
       - Line 12: `page.goto('/login')` -> `page.goto('/admin/login')`
       - Line 18: `toHaveURL('/login')` -> `toHaveURL('/admin/login')`
       - Line 22: `page.goto('/login')` -> `page.goto('/admin/login')`
       - Line 31: `toHaveURL('/login', ...)` -> `toHaveURL('/admin/login', ...)`

    4. Update `e2e/auth/admin-logout.spec.js` — change all `/login` URLs to `/admin/login`:
       - Line 6: `page.goto('/login')` -> `page.goto('/admin/login')`
       - Line 14: `toHaveURL('/login', ...)` -> `toHaveURL('/admin/login', ...)`
       - Line 18: `toHaveURL('/login', ...)` -> `toHaveURL('/admin/login', ...)`
  </action>
  <verify>
    Run `npm test -- tests/middleware.test.js` — all tests must pass.
    Run `grep -rn "'/login'" src/lib/auth/route-rules.js` — should return zero matches (all references now use /admin/login).
    Run `grep -c "admin/login" tests/middleware.test.js` — should show multiple matches confirming updates.
  </verify>
  <done>Route rules correctly handle /admin/login before /admin/* protection (no redirect loops). All unit tests pass with updated expectations. E2E test files updated. The old /login path falls through to the default "allow" behavior.</done>
</task>

</tasks>

<verification>
1. `npm test -- tests/middleware.test.js` — all route rule tests pass
2. `npm run build` — production build succeeds (confirms no broken imports from file moves)
3. Grep audit: `grep -rn "'/login'" src/ middleware.js` should only return the account route comment (line 57 in route-rules.js mentions "not /login" in a comment which is fine to leave as historical context, OR update it). All functional references should be /admin/login.
4. No file at `src/app/(admin)/login/page.jsx` (old location gone)
5. File exists at `src/app/(admin)/admin/login/page.jsx` (new location)
</verification>

<success_criteria>
- Admin login page renders at /admin/login
- Unauthenticated access to any /admin/* route redirects to /admin/login
- Authenticated admin accessing /admin/login redirects to /admin/dashboard
- Forgot-password flow works at /admin/login/forgot-password
- Set-new-password flow works at /admin/login/set-new-password
- Admin logout redirects to /admin/login
- All middleware unit tests pass
- Production build succeeds
</success_criteria>

<output>
After completion, create `.planning/quick/16-move-admin-login-from-login-to-admin-log/16-SUMMARY.md`
</output>
