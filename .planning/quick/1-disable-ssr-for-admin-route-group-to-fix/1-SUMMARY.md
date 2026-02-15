---
phase: quick-1
plan: 1
subsystem: admin
tags:
  - bugfix
  - hydration
  - dnd-kit
  - ssr
dependency_graph:
  requires: []
  provides:
    - client-only admin rendering
    - hydration-error-free dnd-kit
  affects:
    - all admin list pages (7 pages)
    - all admin CRUD pages (27 pages)
tech_stack:
  added: []
  patterns:
    - client-only wrapper component
    - layout-level SSR prevention
key_files:
  created:
    - src/components/admin/ClientOnly.jsx
  modified:
    - src/app/(admin)/admin/layout.jsx
    - src/components/admin/CategoriesListClient.jsx
decisions:
  - decision: "Disable SSR for entire admin route group instead of per-component workarounds"
    rationale: "Admin pages are internal-only (not SEO-relevant), client-only rendering is safe and simpler"
    alternatives: "Per-component mounted guards (previous approach, more brittle)"
  - decision: "Keep admin layout as Server Component, only wrap children slot"
    rationale: "Allows layout to remain server-rendered while children are client-only"
metrics:
  duration: "3 min"
  tasks_completed: 3
  files_modified: 3
  commits: 3
  completed: "2026-02-15"
---

# Quick Task 1: Disable SSR for Admin Route Group

Client-only rendering for all admin pages via layout-level wrapper, eliminating dnd-kit hydration errors across 7 list pages.

## Objective

Eliminate `aria-describedby` hydration mismatches in all admin pages using dnd-kit drag-and-drop by disabling SSR for the entire admin route group. Admin pages are internal tools (no SEO needs), making client-only rendering the cleanest solution.

## Tasks Completed

### Task 1: Create ClientOnly wrapper component
**Files:** `src/components/admin/ClientOnly.jsx`
**Commit:** `091343f`

Created reusable ClientOnly wrapper component with mounted state guard. Component prevents SSR/client HTML mismatches by delaying render until after client-side mount. Accepts optional fallback content for loading states.

### Task 2: Update admin layout to wrap children with ClientOnly
**Files:** `src/app/(admin)/admin/layout.jsx`
**Commit:** `4803877`

Modified admin layout to wrap children slot with ClientOnly component. Layout itself remains a Server Component (no `'use client'` directive added), only the children slot renders client-only. This applies to all 34 admin pages.

### Task 3: Revert mounted guard in CategoriesListClient
**Files:** `src/components/admin/CategoriesListClient.jsx`
**Commit:** `6a95a33`

Removed component-level mounted state guard from CategoriesListClient:
- Removed `mounted` state and `useEffect`
- Removed conditional rendering around DndContext
- Removed loading fallback UI
- DndContext now renders unconditionally

Layout-level ClientOnly wrapper makes component-level guards unnecessary.

## Deviations from Plan

None - plan executed exactly as written.

## Verification

**Manual testing required:**
1. Start dev server: `npm run dev`
2. Navigate to `http://localhost:3000/admin/categories`
3. Check browser console for hydration warnings (should be zero)
4. Test drag-and-drop functionality
5. Verify other admin list pages (banners, FAQ, gallery, manuals, video-highlights, product-types)

**Expected outcome:**
- Zero `aria-describedby` mismatch warnings in console
- All dnd-kit drag-and-drop features working correctly
- Admin pages render client-only (no SSR)

## Impact

**Scope:** All admin pages (34 pages)

**Benefits:**
- Eliminates hydration errors for dnd-kit across 7 list pages
- Simpler than per-component workarounds
- Single source of truth for SSR prevention
- Safe for admin use case (internal tool, no SEO needs)

**Affected pages:**
- Categories list
- Product types list
- Banners list
- FAQ list
- Gallery list
- Manuals list
- Video highlights list
- All other admin CRUD pages (now client-only)

**Trade-offs:**
- Slight initial render delay for admin pages (acceptable for internal tools)
- All admin pages now client-only (no server-side rendering)

## Key Decisions

| Decision | Rationale | Alternatives Considered |
|----------|-----------|------------------------|
| Layout-level SSR prevention | Single implementation point, affects all admin pages uniformly | Per-component mounted guards (more brittle, harder to maintain) |
| Keep layout as Server Component | Allows server-side rendering of layout structure while children are client-only | Make entire layout Client Component (unnecessary) |
| Remove component-level guards | Redundant with layout-level wrapper | Keep both (code duplication) |

## Files Modified

| File | Changes | Lines |
|------|---------|-------|
| `src/components/admin/ClientOnly.jsx` | Created wrapper component | 17 |
| `src/app/(admin)/admin/layout.jsx` | Added ClientOnly import and wrapper | +4 -1 |
| `src/components/admin/CategoriesListClient.jsx` | Removed mounted guard, imports, conditional | -8 (net) |

## Commits

1. `091343f` - feat(quick-1): create ClientOnly wrapper component
2. `4803877` - feat(quick-1): disable SSR for admin route group
3. `6a95a33` - refactor(quick-1): remove component-level mounted guard

## Self-Check: PASSED

**Files created:**
```bash
FOUND: src/components/admin/ClientOnly.jsx
```

**Files modified:**
```bash
FOUND: src/app/(admin)/admin/layout.jsx
FOUND: src/components/admin/CategoriesListClient.jsx
```

**Commits:**
```bash
FOUND: 091343f
FOUND: 4803877
FOUND: 6a95a33
```

All artifacts verified.

## Next Steps

1. Manual verification: Test admin pages in browser to confirm zero hydration errors
2. If verified: This fix can be considered complete and stable
3. Consider: Document this pattern in admin component guidelines for future reference
