---
phase: quick-7
plan: 01
subsystem: database, ui
tags: [rls, supabase, postgresql, scheduling, admin-ui]

# Dependency graph
requires:
  - phase: 002_rls_policies.sql
    provides: "Original product SELECT policies"
  - phase: 014_variation_rls.sql
    provides: "Product variation links SELECT policies"
provides:
  - "Time-based publish filtering via RLS (publish_start/publish_end enforcement)"
  - "4-state publish badge in admin product list (unpublished, scheduled, active, expired)"
affects: [product-detail, public-product-listing, admin-products]

# Tech tracking
tech-stack:
  added: []
  patterns:
    - "Date range RLS filtering: (col IS NULL OR col <= now()) pattern for optional date bounds"
    - "Multi-state badge rendering via status helper + styles map"

key-files:
  created:
    - supabase/migrations/015_publish_date_rls.sql
  modified:
    - src/components/admin/ProductsListClient.jsx

key-decisions:
  - "NULL dates treated as no restriction (backward compatible with all existing products)"
  - "Check expired before scheduled (if end date passed, expired even if start date also future)"

patterns-established:
  - "Date-aware RLS: always include publish_start/publish_end checks alongside published flag"
  - "Status helper pattern: getPublishStatus() returns enum string, renderBadge uses styles map"

# Metrics
duration: 2min
completed: 2026-02-16
---

# Quick Task 7: Add Time-Based Publish Filtering via RLS

**RLS policies updated across 4 tables to enforce publish_start/publish_end date ranges, with 4-state admin badges showing schedule status**

## Performance

- **Duration:** 2 min
- **Started:** 2026-02-16T06:03:38Z
- **Completed:** 2026-02-16T06:05:29Z
- **Tasks:** 2
- **Files modified:** 2

## Accomplishments
- Updated 8 RLS SELECT policies across products, product_images, product_options, product_variation_links to check publish_start/publish_end
- NULL dates treated as "no restriction" for full backward compatibility
- Admin product list now shows 4 distinct badge states: gray unpublished, blue scheduled, green active, red expired
- All badges remain clickable toggles for the published boolean

## Task Commits

Each task was committed atomically:

1. **Task 1: Create RLS migration with date range checks** - `3a88fdb` (feat)
2. **Task 2: Update admin product list with 4-state publish badges** - `c2e1941` (feat)

## Files Created/Modified
- `supabase/migrations/015_publish_date_rls.sql` - Drops and recreates 8 SELECT policies with date range checks
- `src/components/admin/ProductsListClient.jsx` - Added getPublishStatus helper and updated renderPublishBadge for 4 states

## Decisions Made
- NULL publish_start/publish_end treated as no restriction (backward compatible -- existing products without dates continue to work)
- Expired check takes priority over scheduled check (edge case: if end date passed, product is expired even if start date is also in the future)

## Deviations from Plan

None - plan executed exactly as written.

## Issues Encountered
None.

## User Setup Required
None - no external service configuration required. Migration must be run against Supabase when deploying.

## Next Phase Readiness
- RLS policies ready for production deployment
- Admin UI shows scheduling status at a glance
- No blockers

## Self-Check: PASSED

All files exist. All commits verified.

---
*Phase: quick-7*
*Completed: 2026-02-16*
