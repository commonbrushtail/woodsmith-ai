---
phase: quick-16
plan: 01
subsystem: auth
tags: [admin, login, routing, middleware]
dependency_graph:
  requires: []
  provides: ["/admin/login route", "admin login pages under /admin namespace"]
  affects: [middleware, route-rules, admin-sidebar, require-admin, e2e-tests]
tech_stack:
  added: []
  patterns: [route-precedence, redirect-loop-prevention]
key_files:
  created: []
  modified:
    - src/app/(admin)/admin/login/page.jsx
    - src/app/(admin)/admin/login/forgot-password/page.jsx
    - src/app/(admin)/admin/login/forgot-password/sent/page.jsx
    - src/app/(admin)/admin/login/set-new-password/page.jsx
    - src/lib/auth/route-rules.js
    - src/lib/auth/require-admin.js
    - src/components/admin/AdminSidebar.jsx
    - src/app/auth/reset-password/route.js
    - tests/middleware.test.js
    - e2e/auth/admin-login.spec.js
    - e2e/auth/admin-logout.spec.js
decisions:
  - decision: "/admin/login check MUST come before general /admin check in route-rules.js"
    rationale: "Prevents redirect loops (unauthenticated user hitting /admin/login would otherwise be redirected to /admin/login infinitely)"
    alternatives: ["Complex conditional logic", "Separate middleware for login routes"]
    chosen: "Route precedence with explicit check order"
  - decision: "Old /login path falls through to default 'allow' behavior"
    rationale: "No longer special — could be used for customer login modal in future, or left as unused path"
    alternatives: ["Redirect /login to /admin/login", "Return 404 for /login"]
    chosen: "Allow as regular route (fallback)"
metrics:
  duration_minutes: 3.4
  completed_date: 2026-02-17
  tasks_completed: 2
  files_modified: 11
  tests_updated: 4
  tests_passing: 38
---

# Quick Task 16: Move Admin Login to /admin/login

**One-liner:** Admin login and auth flows moved from `/login` to `/admin/login` to separate admin and customer authentication namespaces

## Overview

Moved the admin login page and its sub-pages (forgot-password, set-new-password) from `/login` to `/admin/login`. This creates a clear separation between admin authentication (email/password at `/admin/login`) and customer authentication (SMS OTP + LINE Login via modal on public site).

**Why this matters:** The URL structure now matches the authentication boundary — `/admin/*` is the admin namespace, including login. This eliminates confusion and makes the routing rules cleaner.

## Task Breakdown

### Task 1: Move login pages and update all internal links
**Commit:** `f36a144`

- Moved entire login directory tree from `src/app/(admin)/login/` to `src/app/(admin)/admin/login/`
- Updated all internal references:
  - Login page: `/login/forgot-password` → `/admin/login/forgot-password`
  - Forgot-password page: success redirect and back link updated
  - Forgot-password sent page: back link updated
  - Set-new-password page: success redirect to `/admin/login?reset=success`
  - Reset-password route: redirects updated for both success and error cases
  - AdminSidebar: logout redirect updated
  - require-admin.js: both redirect calls updated
- Old `/login` directory removed from filesystem
- Git detected renames automatically (R status for 4 files)

**Files modified:** 7 files (4 renames + 3 edits)

### Task 2: Update middleware route rules and all tests
**Commit:** `854e343`

- Updated `route-rules.js`:
  - `/admin/login` check now handles both exact match and sub-routes (`pathname === '/admin/login' || pathname.startsWith('/admin/login/')`)
  - **CRITICAL:** This check MUST come BEFORE the general `pathname.startsWith('/admin')` check to prevent redirect loops
  - Unauthenticated users accessing `/admin/*` now redirect to `/admin/login` (was `/login`)
  - Old `/login` block removed entirely

- Updated `tests/middleware.test.js`:
  - Changed 19 occurrences of `/login` to `/admin/login` in test expectations
  - Updated test descriptions to reflect new route
  - Added 3 new tests:
    - Old `/login` path now treated as regular route (fallback allow)
    - `/admin/login/forgot-password` allows unauthenticated access
    - `/admin/login/set-new-password` allows unauthenticated access
  - All 38 tests pass

- Updated E2E tests:
  - `e2e/auth/admin-login.spec.js`: all `/login` references → `/admin/login`
  - `e2e/auth/admin-logout.spec.js`: all `/login` references → `/admin/login`

**Files modified:** 4 files (1 route logic + 3 test files)

## Deviations from Plan

None — plan executed exactly as written.

## Verification Results

1. ✅ Middleware tests: All 38 tests pass
2. ✅ Production build: Successful (no broken imports)
3. ✅ Route-rules audit: No `/login` references remain (all updated to `/admin/login`)
4. ✅ Old directory removed: `src/app/(admin)/login/` no longer exists
5. ✅ New directory exists: `src/app/(admin)/admin/login/page.jsx` confirmed

## Technical Details

### Route Precedence Pattern

The order of checks in `route-rules.js` is critical:

```javascript
// 1. Check /admin/login FIRST (allow login page for unauthenticated)
if (pathname === '/admin/login' || pathname.startsWith('/admin/login/')) {
  if (user && ADMIN_ROLES.includes(user.role)) {
    return { redirect: '/admin/dashboard' }  // Already logged in → go to dashboard
  }
  return 'allow'  // Not logged in → show login page
}

// 2. Then check general /admin (redirect to login if not authenticated)
if (pathname.startsWith('/admin')) {
  if (!user) {
    return { redirect: '/admin/login' }  // Not logged in → go to login
  }
  // ... role checks
}
```

If the order were reversed, unauthenticated users would hit an infinite redirect loop: `/admin/login` → `/admin/login` → `/admin/login` ...

### Old /login Path Behavior

The old `/login` path is no longer special — it falls through to the default `allow` behavior. This leaves the path available for future use (e.g., a customer login modal route) without breaking anything.

## Files Changed

### Created
None (only moved existing files)

### Modified
- `src/app/(admin)/admin/login/page.jsx` (moved + updated link)
- `src/app/(admin)/admin/login/forgot-password/page.jsx` (moved + updated 2 links)
- `src/app/(admin)/admin/login/forgot-password/sent/page.jsx` (moved + updated link)
- `src/app/(admin)/admin/login/set-new-password/page.jsx` (moved + updated redirect)
- `src/lib/auth/route-rules.js` (route logic updated)
- `src/lib/auth/require-admin.js` (2 redirects updated)
- `src/components/admin/AdminSidebar.jsx` (logout redirect updated)
- `src/app/auth/reset-password/route.js` (2 redirects updated)
- `tests/middleware.test.js` (19 expectations + 3 new tests)
- `e2e/auth/admin-login.spec.js` (4 URL references updated)
- `e2e/auth/admin-logout.spec.js` (3 URL references updated)

### Deleted
- `src/app/(admin)/login/` (entire directory tree removed)

## Impact Analysis

### User-Facing Changes
- Admin users now visit `/admin/login` instead of `/login` to access the admin panel
- Forgot-password and set-new-password flows now under `/admin/login/*`
- Admin logout redirects to `/admin/login`
- Old `/login` bookmarks will show empty page (no redirect, just fallback allow)

### Developer-Facing Changes
- Middleware route rules have explicit precedence ordering
- All admin redirects now use `/admin/login`
- E2E tests reflect new URL structure
- 38 passing tests ensure routing behavior is correct

### Breaking Changes
**None** — users with existing sessions continue to work. Only the login URL changes, which is not a breaking change for authenticated users.

## Next Steps

None required — this is a standalone routing improvement. The old `/login` path can be repurposed in the future if needed.

## Self-Check

### Created Files
None — only moved files

### Modified Files
✅ `src/app/(admin)/admin/login/page.jsx` — verified href="/admin/login/forgot-password"
✅ `src/app/(admin)/admin/login/forgot-password/page.jsx` — verified router.push and href updated
✅ `src/app/(admin)/admin/login/forgot-password/sent/page.jsx` — verified href="/admin/login"
✅ `src/app/(admin)/admin/login/set-new-password/page.jsx` — verified router.push('/admin/login?reset=success')
✅ `src/lib/auth/route-rules.js` — verified /admin/login check before /admin check
✅ `src/lib/auth/require-admin.js` — verified redirect('/admin/login')
✅ `src/components/admin/AdminSidebar.jsx` — verified router.push('/admin/login')
✅ `src/app/auth/reset-password/route.js` — verified both redirects use /admin/login
✅ `tests/middleware.test.js` — verified 38 tests pass
✅ `e2e/auth/admin-login.spec.js` — verified all '/login' → '/admin/login'
✅ `e2e/auth/admin-logout.spec.js` — verified all '/login' → '/admin/login'

### Commits
✅ `f36a144` — feat(quick-16): move admin login from /login to /admin/login
✅ `854e343` — test(quick-16): update middleware route rules and tests for /admin/login

### Tests
✅ Middleware tests: 38/38 passed
✅ Production build: Successful

## Self-Check: PASSED

All files exist, all commits verified, all tests passing.
