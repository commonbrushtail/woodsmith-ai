---
phase: quick-17
plan: 01
type: execute
wave: 1
depends_on: []
files_modified:
  - src/app/(admin)/admin/(auth)/layout.jsx
  - src/app/(admin)/admin/(auth)/login/page.jsx
  - src/app/(admin)/admin/(auth)/login/forgot-password/page.jsx
  - src/app/(admin)/admin/(auth)/login/forgot-password/sent/page.jsx
  - src/app/(admin)/admin/(auth)/login/set-new-password/page.jsx
autonomous: true
must_haves:
  truths:
    - "Unauthenticated user can visit /admin/login without redirect loop"
    - "Unauthenticated user can visit /admin/login/forgot-password without redirect loop"
    - "Unauthenticated user can visit /admin/login/set-new-password without redirect loop"
    - "Authenticated admin visiting /admin/dashboard still sees sidebar layout"
    - "All login page content and functionality remains identical"
  artifacts:
    - path: "src/app/(admin)/admin/(auth)/layout.jsx"
      provides: "Auth route group layout that does NOT call requireAdminOrRedirect"
    - path: "src/app/(admin)/admin/(auth)/login/page.jsx"
      provides: "Admin login page (moved from admin/login/)"
  key_links:
    - from: "src/app/(admin)/admin/(auth)/login/page.jsx"
      to: "src/app/(admin)/admin/(auth)/layout.jsx"
      via: "Next.js route group nesting"
      pattern: "Login pages inherit (auth) layout, NOT the admin dashboard layout"
---

<objective>
Fix ERR_TOO_MANY_REDIRECTS on /admin/login by moving auth pages into an (auth) route group.

Purpose: Quick task 16 moved login pages under src/app/(admin)/admin/login/ which inherits the admin dashboard layout at src/app/(admin)/admin/layout.jsx. That layout calls requireAdminOrRedirect() on every render, causing an infinite redirect loop for unauthenticated users trying to reach the login page.

Output: Login pages moved into an (auth) route group with its own minimal layout that skips the auth guard. URLs remain unchanged.
</objective>

<execution_context>
@C:/Users/commo/.claude/get-shit-done/workflows/execute-plan.md
@C:/Users/commo/.claude/get-shit-done/templates/summary.md
</execution_context>

<context>
@src/app/(admin)/admin/layout.jsx
@src/app/(admin)/admin/login/page.jsx
@src/app/(admin)/admin/login/forgot-password/page.jsx
@src/app/(admin)/admin/login/forgot-password/sent/page.jsx
@src/app/(admin)/admin/login/set-new-password/page.jsx
@src/app/(admin)/layout.jsx
@src/lib/auth/require-admin.js
@src/lib/auth/route-rules.js
</context>

<tasks>

<task type="auto">
  <name>Task 1: Create (auth) route group and move login pages</name>
  <files>
    src/app/(admin)/admin/(auth)/layout.jsx
    src/app/(admin)/admin/(auth)/login/page.jsx
    src/app/(admin)/admin/(auth)/login/forgot-password/page.jsx
    src/app/(admin)/admin/(auth)/login/forgot-password/sent/page.jsx
    src/app/(admin)/admin/(auth)/login/set-new-password/page.jsx
  </files>
  <action>
    The problem: src/app/(admin)/admin/layout.jsx calls requireAdminOrRedirect() which redirects unauthenticated users to /admin/login. But /admin/login is a child of that same layout, creating an infinite redirect loop.

    The fix uses Next.js route groups. Route groups (folders wrapped in parentheses) are invisible in the URL but create separate layout boundaries.

    Steps:

    1. Create the (auth) route group layout at src/app/(admin)/admin/(auth)/layout.jsx:
       - This is a simple pass-through layout — just returns {children}
       - It does NOT call requireAdminOrRedirect()
       - It does NOT render AdminSidebar or any dashboard chrome
       - Because this layout sits BETWEEN the admin layout.jsx and the login pages, Next.js will use THIS layout instead of the parent admin/layout.jsx for these routes
       - IMPORTANT: In Next.js App Router, a route group with its own layout.jsx does NOT inherit the parent segment's layout.jsx. The (auth)/layout.jsx replaces admin/layout.jsx for routes within (auth)/. The (admin)/layout.jsx (grandparent with just metadata) still applies.

       Content:
       ```jsx
       export default function AuthLayout({ children }) {
         return children
       }
       ```

    2. Move all 4 login page files from admin/login/ to admin/(auth)/login/:
       - src/app/(admin)/admin/login/page.jsx -> src/app/(admin)/admin/(auth)/login/page.jsx
       - src/app/(admin)/admin/login/forgot-password/page.jsx -> src/app/(admin)/admin/(auth)/login/forgot-password/page.jsx
       - src/app/(admin)/admin/login/forgot-password/sent/page.jsx -> src/app/(admin)/admin/(auth)/login/forgot-password/sent/page.jsx
       - src/app/(admin)/admin/login/set-new-password/page.jsx -> src/app/(admin)/admin/(auth)/login/set-new-password/page.jsx

       Copy each file's content EXACTLY as-is. No modifications to the page files themselves — all imports, UI, and logic stay the same.

    3. Delete the old files:
       - Remove src/app/(admin)/admin/login/page.jsx
       - Remove src/app/(admin)/admin/login/forgot-password/page.jsx
       - Remove src/app/(admin)/admin/login/forgot-password/sent/page.jsx
       - Remove src/app/(admin)/admin/login/set-new-password/page.jsx
       - Remove the now-empty src/app/(admin)/admin/login/ directory tree

    IMPORTANT: The URLs do NOT change. Route groups are transparent in Next.js routing:
    - /admin/login still works (served by admin/(auth)/login/page.jsx)
    - /admin/login/forgot-password still works
    - /admin/login/forgot-password/sent still works
    - /admin/login/set-new-password still works

    WHY this works: Next.js layout nesting follows the file system. Previously, login pages inherited:
      (admin)/layout.jsx -> (admin)/admin/layout.jsx [AUTH GUARD HERE] -> login/page.jsx

    After the fix:
      (admin)/layout.jsx -> (admin)/admin/(auth)/layout.jsx [NO AUTH GUARD] -> login/page.jsx

    The admin dashboard pages still use:
      (admin)/layout.jsx -> (admin)/admin/layout.jsx [AUTH GUARD] -> dashboard/page.jsx etc.
  </action>
  <verify>
    1. Run: npm run build -- confirm no build errors
    2. Run: npm run dev -- then visit http://localhost:3000/admin/login in a private/incognito window (no auth cookies). Page should load without redirect loop.
    3. Visit http://localhost:3000/admin/login/forgot-password — should load without redirect loop.
    4. Visit http://localhost:3000/admin/dashboard — should redirect to /admin/login (auth guard still works for dashboard routes).
    5. Confirm old login directory is fully removed: ls src/app/(admin)/admin/login/ should show "No such file or directory"
    6. Run: npm test -- all existing tests should pass
  </verify>
  <done>
    - /admin/login loads without ERR_TOO_MANY_REDIRECTS for unauthenticated users
    - /admin/login/forgot-password and /admin/login/set-new-password load without redirect loops
    - /admin/dashboard and all other admin routes still require authentication (redirect to /admin/login if not logged in)
    - No changes to page content, functionality, or URLs
    - All existing tests pass
  </done>
</task>

</tasks>

<verification>
1. Build succeeds: npm run build exits 0
2. No redirect loop: curl -I http://localhost:3000/admin/login returns 200, not 3xx chain
3. Auth guard intact: curl -I http://localhost:3000/admin/dashboard returns 307 redirect to /admin/login
4. Tests pass: npm test exits 0
</verification>

<success_criteria>
- Unauthenticated users can access /admin/login and all auth-related sub-pages without redirect loops
- Authenticated admin users still see the sidebar layout on /admin/dashboard and all other admin pages
- Zero changes to page content, styling, or functionality
- All URLs remain unchanged
</success_criteria>

<output>
After completion, create `.planning/quick/17-fix-redirect-loop-exclude-admin-login-fr/17-SUMMARY.md`
</output>
