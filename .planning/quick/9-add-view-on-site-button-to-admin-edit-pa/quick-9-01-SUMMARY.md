---
phase: quick-9
plan: 01
subsystem: ui
tags: [admin, sidebar, navigation, external-link]

# Dependency graph
requires: []
provides:
  - "View-on-site links in admin product and blog edit sidebars"
affects: [admin-edit-pages]

# Tech tracking
tech-stack:
  added: []
  patterns:
    - "External-link anchor pattern with SVG icon in admin sidebar"

key-files:
  created: []
  modified:
    - "src/app/(admin)/admin/products/edit/[id]/ProductEditClient.jsx"
    - "src/app/(admin)/admin/blog/edit/[id]/BlogEditClient.jsx"

key-decisions:
  - "None - followed plan as specified"

patterns-established:
  - "View-on-site link pattern: anchor with target=_blank, external-link SVG, subtle outlined styling"

# Metrics
duration: 1min
completed: 2026-02-16
---

# Quick 9: Add View on Site Button to Admin Edit Pages Summary

**Added "ดูหน้าเว็บ" (View on site) links to product and blog admin edit sidebars, opening public detail pages in a new tab**

## Performance

- **Duration:** 1 min
- **Started:** 2026-02-16T07:19:47Z
- **Completed:** 2026-02-16T07:20:34Z
- **Tasks:** 2
- **Files modified:** 2

## Accomplishments
- Product edit sidebar now links to `/product/{id}` public page
- Blog edit sidebar now links to `/blog/{id}` public page
- Both links include external-link SVG icon and subtle outlined styling consistent with draft button

## Task Commits

Each task was committed atomically:

1. **Task 1: Add view-on-site link to ProductEditClient sidebar** - `3ec93cc` (feat)
2. **Task 2: Add view-on-site link to BlogEditClient sidebar** - `5861ad1` (feat)

## Files Created/Modified
- `src/app/(admin)/admin/products/edit/[id]/ProductEditClient.jsx` - Added view-on-site anchor after draft button in sidebar
- `src/app/(admin)/admin/blog/edit/[id]/BlogEditClient.jsx` - Added view-on-site anchor after draft button in sidebar

## Decisions Made
None - followed plan as specified.

## Deviations from Plan
None - plan executed exactly as written.

## Issues Encountered
None.

## User Setup Required
None - no external service configuration required.

## Next Phase Readiness
- Both admin edit pages now have convenient links to preview public-facing content
- Pattern can be extended to other content types with public detail pages if needed

---
*Phase: quick-9*
*Completed: 2026-02-16*
