---
phase: quick-18
plan: 01
subsystem: admin-layouts
tags:
  - layout-separation
  - route-groups
  - sidebar
  - authentication
dependency_graph:
  requires:
    - quick-16-admin-login-routes
  provides:
    - independent-auth-dashboard-layouts
  affects:
    - all-admin-pages
tech_stack:
  added:
    - next-js-route-groups-sibling-pattern
  patterns:
    - sibling-route-groups
    - layout-separation
    - clean-architecture
key_files:
  created:
    - src/app/(admin)/admin/(dashboard)/layout.jsx
    - src/app/(admin)/admin/(auth)/layout.jsx
  modified:
    - src/app/(admin)/admin/layout.jsx
  moved:
    - 18 admin content directories to (dashboard)/
    - 4 login pages to (auth)/
decisions:
  - summary: "Use sibling route groups (auth) and (dashboard) instead of nested groups"
    rationale: "Sibling groups have independent layouts, eliminating need for x-pathname header workaround"
  - summary: "Simplify admin/layout.jsx to pure pass-through (no sidebar logic)"
    rationale: "Parent layout should be minimal when children have distinct chrome requirements"
  - summary: "Update import paths from ../../../ to ../../../../ in moved files"
    rationale: "(dashboard) adds one more directory level, requires path adjustment"
metrics:
  duration: 2
  completed_date: 2026-02-17
  tasks: 1
  files_created: 2
  files_modified: 65
  lines_changed: 62
---

# Phase quick-18 Plan 01: Separate Admin Login and Dashboard Layouts Summary

**Admin login and dashboard now use independent layouts via sibling route groups, eliminating fragile x-pathname header workaround.**

## Context

The admin system had a fragile layout design where `admin/layout.jsx` applied to ALL routes (both login and dashboard). It used an `x-pathname` header check to conditionally skip the sidebar for login routes. This violated Next.js best practices because:

1. Nested route groups still inherit their parent directory's layout
2. Header-based layout switching is fragile and hard to understand
3. The correct pattern is sibling route groups with independent layouts

## What Was Built

### 1. New Directory Structure

**Before:**
```
admin/
  layout.jsx          (sidebar + x-pathname workaround)
  (auth)/
    layout.jsx        (pass-through, but wrapped by admin/layout.jsx)
    login/...
  dashboard/          (goes through admin/layout.jsx)
  products/...        (goes through admin/layout.jsx)
  blog/...            (goes through admin/layout.jsx)
  ... [15 more directories]
```

**After:**
```
admin/
  layout.jsx          (minimal pass-through, NO sidebar logic)
  (auth)/
    layout.jsx        (pass-through, independent)
    login/...
  (dashboard)/
    layout.jsx        (sidebar + ErrorBoundary + ClientOnly)
    dashboard/...
    products/...
    blog/...
    ... [18 admin content directories]
```

### 2. Layout Separation

**admin/layout.jsx** (simplified):
- Pure pass-through component
- No imports (no AdminSidebar, ErrorBoundary, ClientOnly, headers)
- No x-pathname header workaround
- Just returns `children`

**(dashboard)/layout.jsx** (new):
- Contains AdminSidebar rendering
- Wraps children with ErrorBoundary + ClientOnly
- Standard dashboard chrome for all admin content pages
- Import paths: `../../../../components/...` (one level deeper)

**(auth)/layout.jsx** (unchanged):
- Already a pass-through
- No sidebar, no chrome
- Clean login experience

### 3. Files Moved

Moved 18 admin content directories into `(dashboard)/`:
1. about-us
2. account
3. banner
4. blog
5. blog-categories
6. branch
7. categories
8. dashboard
9. faq
10. gallery
11. manual
12. products
13. product-types
14. quotations
15. site-settings
16. users
17. variations
18. video-highlight

All login pages remained in `(auth)/login/` (no changes needed).

### 4. Import Path Updates

Updated all imports in moved files from `../../../` to `../../../../` because the `(dashboard)` route group adds one more directory level in the filesystem.

Files updated:
- 9 loading.jsx files (AdminSkeleton imports)
- 1 dashboard/page.jsx (AdminHeader import)
- (dashboard)/layout.jsx (AdminSidebar, ErrorBoundary, ClientOnly)

## Deviations from Plan

None - plan executed exactly as written.

## Technical Details

### Why Sibling Route Groups Work

In Next.js App Router:

**Layout chain for dashboard pages:**
```
admin/layout.jsx → (dashboard)/layout.jsx → page.jsx
```
Since `admin/layout.jsx` is minimal, `(dashboard)/layout.jsx` controls all chrome.

**Layout chain for login pages:**
```
admin/layout.jsx → (auth)/layout.jsx → page.jsx
```
Since both are pass-through, login pages have no sidebar.

### URL Preservation

Route groups (parentheses) are invisible in URLs:
- `/admin/login` → `admin/(auth)/login/page.jsx`
- `/admin/dashboard` → `admin/(dashboard)/dashboard/page.jsx`
- `/admin/products` → `admin/(dashboard)/products/page.jsx`

Zero URL changes.

### Build Verification

Build succeeded with all 47 routes rendering correctly:
- 4 login routes under `/admin/login/*` (no sidebar)
- 34 admin content routes under `/admin/*` (with sidebar)
- All URLs unchanged

### Test Coverage

All 38 middleware route tests passed, confirming:
- Route protection still works
- Session refresh still works
- No impact on authentication flow

## Key Decisions

1. **Sibling route groups over nested** - Independent layouts without inheritance
2. **Minimal parent layout** - When children have distinct chrome needs, parent should be pass-through
3. **Import path consistency** - Automatically updated all relative imports to match new directory depth

## Impact

### Before (Fragile)

```jsx
// admin/layout.jsx
export default async function DashboardLayout({ children }) {
  const headersList = await headers()
  const pathname = headersList.get('x-pathname') || ''
  const isAuthRoute = pathname.startsWith('/admin/login')

  if (isAuthRoute) {
    return children  // Fragile header check
  }

  return (
    <div className="flex h-screen">
      <AdminSidebar />
      <main>{children}</main>
    </div>
  )
}
```

### After (Clean)

```jsx
// admin/layout.jsx
export default function AdminLayout({ children }) {
  return children
}

// (dashboard)/layout.jsx
export default function DashboardLayout({ children }) {
  return (
    <div className="flex h-screen">
      <AdminSidebar />
      <main>{children}</main>
    </div>
  )
}
```

### Benefits

- ✅ No header-sniffing logic
- ✅ Clear separation of concerns
- ✅ Each route group controls its own chrome
- ✅ Easier to understand and maintain
- ✅ Follows Next.js best practices
- ✅ No runtime overhead from pathname checking

## Files Changed

**Created:**
- `src/app/(admin)/admin/(dashboard)/layout.jsx` - Dashboard layout with sidebar
- `src/app/(admin)/admin/(auth)/layout.jsx` - Auth layout pass-through

**Modified:**
- `src/app/(admin)/admin/layout.jsx` - Simplified to pass-through (removed 30 lines, added 3)
- 65 files total (2 created, 1 simplified, 62 moved with path updates)

**Moved:**
- 18 admin content directories → `(dashboard)/`
- Import paths updated in 10 files

## Commits

- `5ab319d`: refactor(quick-18): separate admin login and dashboard layouts using route groups

## Self-Check: PASSED

✅ **Created files exist:**
```
FOUND: src/app/(admin)/admin/(dashboard)/layout.jsx
FOUND: src/app/(admin)/admin/(auth)/layout.jsx
```

✅ **Modified file simplified:**
```
FOUND: src/app/(admin)/admin/layout.jsx (3 lines, no imports)
```

✅ **All directories moved:**
```
FOUND: src/app/(admin)/admin/(dashboard)/about-us
FOUND: src/app/(admin)/admin/(dashboard)/account
FOUND: src/app/(admin)/admin/(dashboard)/banner
FOUND: src/app/(admin)/admin/(dashboard)/blog
FOUND: src/app/(admin)/admin/(dashboard)/blog-categories
FOUND: src/app/(admin)/admin/(dashboard)/branch
FOUND: src/app/(admin)/admin/(dashboard)/categories
FOUND: src/app/(admin)/admin/(dashboard)/dashboard
FOUND: src/app/(admin)/admin/(dashboard)/faq
FOUND: src/app/(admin)/admin/(dashboard)/gallery
FOUND: src/app/(admin)/admin/(dashboard)/manual
FOUND: src/app/(admin)/admin/(dashboard)/products
FOUND: src/app/(admin)/admin/(dashboard)/product-types
FOUND: src/app/(admin)/admin/(dashboard)/quotations
FOUND: src/app/(admin)/admin/(dashboard)/site-settings
FOUND: src/app/(admin)/admin/(dashboard)/users
FOUND: src/app/(admin)/admin/(dashboard)/variations
FOUND: src/app/(admin)/admin/(dashboard)/video-highlight
```

✅ **Commit exists:**
```
FOUND: 5ab319d (git log)
```

✅ **Build succeeds:**
```
Next.js production build completed successfully
47 routes generated
```

✅ **Tests pass:**
```
38/38 middleware tests passed
```

---

**Completion time:** 2 minutes
**Status:** ✅ Complete
