---
phase: quick-3
plan: 01
subsystem: ui
tags: [react, admin, ux, navigation, onclick, event-delegation]

# Dependency graph
requires: []
provides:
  - "Clickable table rows in all 10 admin list pages navigating to edit pages"
  - "Event delegation pattern (e.target.closest) for safe row click handling"
affects: [admin-list-pages]

# Tech tracking
tech-stack:
  added: []
  patterns:
    - "SortableRow onClick prop pattern for dnd-kit rows"
    - "e.target.closest('button, a, input, select') guard for row click delegation"

key-files:
  created: []
  modified:
    - src/components/admin/BannersListClient.jsx
    - src/components/admin/BlogListClient.jsx
    - src/components/admin/BranchListClient.jsx
    - src/components/admin/CategoriesListClient.jsx
    - src/components/admin/FaqListClient.jsx
    - src/components/admin/GalleryListClient.jsx
    - src/components/admin/ManualsListClient.jsx
    - src/components/admin/ProductsListClient.jsx
    - src/components/admin/ProductTypesListClient.jsx
    - src/components/admin/VideoHighlightsListClient.jsx

key-decisions:
  - "Used e.target.closest() for event delegation instead of stopPropagation to avoid interfering with dnd-kit drag events"
  - "Corrected plan's file categorization: BlogListClient uses regular tr (not SortableRow), CategoriesListClient uses SortableRow (not regular tr)"

patterns-established:
  - "Row click navigation: onClick on tr/SortableRow with e.target.closest guard for interactive elements"

# Metrics
duration: 4min
completed: 2026-02-15
---

# Quick Task 3: Make Admin Table Rows Clickable Summary

**Clickable table rows across all 10 admin list pages with event delegation guard for interactive elements**

## Performance

- **Duration:** 4 min
- **Started:** 2026-02-15T10:31:47Z
- **Completed:** 2026-02-15T10:35:39Z
- **Tasks:** 2
- **Files modified:** 10

## Accomplishments
- All 10 admin list client components now have clickable rows that navigate to their respective edit pages
- Interactive elements (buttons, links, inputs, selects) within rows still function normally without triggering navigation
- Cursor changes to pointer when hovering over data rows, providing clear visual affordance

## Task Commits

Each task was committed atomically:

1. **Task 1: Add row click navigation to SortableRow-based list clients** - `d618bf3` (feat)
2. **Task 2: Add row click navigation to regular tr-based list clients** - `0c4c109` (feat)

## Files Created/Modified

- `src/components/admin/BannersListClient.jsx` - SortableRow onClick prop + row handler -> /admin/banner/edit/:id
- `src/components/admin/FaqListClient.jsx` - SortableRow onClick prop + row handler -> /admin/faq/edit/:id
- `src/components/admin/GalleryListClient.jsx` - SortableRow onClick prop + row handler -> /admin/gallery/edit/:id
- `src/components/admin/ManualsListClient.jsx` - SortableRow onClick prop + row handler -> /admin/manual/edit/:id
- `src/components/admin/ProductTypesListClient.jsx` - SortableRow onClick prop + row handler -> /admin/product-types/edit/:id
- `src/components/admin/VideoHighlightsListClient.jsx` - SortableRow onClick prop + row handler -> /admin/video-highlight/edit/:id
- `src/components/admin/CategoriesListClient.jsx` - SortableRow onClick prop + row handler -> /admin/categories/edit/:id
- `src/components/admin/BranchListClient.jsx` - Direct tr onClick handler -> /admin/branch/edit/:id
- `src/components/admin/BlogListClient.jsx` - Direct tr onClick handler -> /admin/blog/edit/:id
- `src/components/admin/ProductsListClient.jsx` - Direct tr onClick handler -> /admin/products/edit/:id

## Implementation Approach

**Two patterns used based on existing component structure:**

1. **SortableRow-based (7 files):** Added `onClick` prop to the local `SortableRow` component definition, forwarded it to the `<tr>` element, and added `cursor-pointer` class. The onClick handler is passed at the call site with the correct edit URL.

2. **Regular tr-based (3 files):** Added `onClick` handler and `cursor-pointer` class directly to the `<tr>` element in the map function.

**Event delegation pattern:** All handlers use `if (e.target.closest('button, a, input, select')) return` to prevent navigation when clicking interactive elements like status toggle badges, action menu buttons, checkboxes, drag handles, and links.

## Decisions Made
- Used `e.target.closest()` event delegation instead of `stopPropagation()` on child elements -- this is simpler and doesn't interfere with dnd-kit's pointer sensor event handling
- Corrected plan's categorization: BlogListClient actually uses regular `<tr>` (plan said SortableRow), CategoriesListClient actually uses SortableRow (plan said regular tr)

## Deviations from Plan

### Auto-fixed Issues

**1. [Rule 1 - Bug] Corrected file categorization between tasks**
- **Found during:** Task 1 (SortableRow-based files)
- **Issue:** Plan categorized BlogListClient as SortableRow-based (Task 1) and CategoriesListClient as regular tr-based (Task 2), but the actual code is the opposite
- **Fix:** Applied the correct implementation pattern to each file based on actual code structure
- **Files modified:** BlogListClient.jsx (treated as regular tr), CategoriesListClient.jsx (treated as SortableRow)
- **Verification:** Build passes, all files have correct onClick handlers
- **Committed in:** d618bf3 (CategoriesListClient in Task 1), 0c4c109 (BlogListClient in Task 2)

---

**Total deviations:** 1 auto-fixed (1 bug - plan/code mismatch)
**Impact on plan:** No scope change. All 10 files were updated as planned, just with the correct implementation pattern applied to each.

## Issues Encountered
None.

## User Setup Required
None - no external service configuration required.

## Next Phase Readiness
- All admin list pages now support row click navigation
- No blockers or concerns

## Self-Check: PASSED

- All 10 modified files exist on disk
- Both task commits (d618bf3, 0c4c109) exist in git log
- All 10 files contain the `e.target.closest` onClick guard pattern
- Build passes successfully
- Pre-existing test failures unrelated to changes (validation/RLS tests)

---
*Quick Task: 3-make-admin-table-rows-clickable-to-navig*
*Completed: 2026-02-15*
