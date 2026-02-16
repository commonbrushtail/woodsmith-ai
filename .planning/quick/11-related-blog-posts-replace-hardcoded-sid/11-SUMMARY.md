---
phase: quick
plan: 11
subsystem: ui, api
tags: [blog, related-posts, supabase, sidebar]

# Dependency graph
requires:
  - phase: quick-11 (dynamic blog categories)
    provides: blog_categories table and dynamic category data
provides:
  - Dynamic related blog posts with backfill (no hardcoded data)
  - Hidden sidebar when no related posts exist
affects: [blog-detail, public-data]

# Tech tracking
tech-stack:
  added: []
  patterns: [backfill pattern for related content queries]

key-files:
  created: []
  modified:
    - src/lib/data/public.js
    - src/app/(public)/blog/[id]/BlogPostPageClient.jsx
    - tests/lib/data/public.test.js

key-decisions:
  - "Backfill uses any-category recent posts excluding current and same-category results"
  - "Hide sidebar entirely when 0 related posts (no empty state UI)"

# Metrics
duration: 2min
completed: 2026-02-16
---

# Quick Task 11: Related Blog Posts - Replace Hardcoded Sidebar Summary

**Backend backfill for related blog posts (same-category first, then recent) with hardcoded fallback removal and conditional sidebar**

## Performance

- **Duration:** 2 min
- **Started:** 2026-02-16T09:56:05Z
- **Completed:** 2026-02-16T09:58:28Z
- **Tasks:** 3
- **Files modified:** 3

## Accomplishments
- Backend `getPublishedBlogPost` now backfills with recent posts when same-category results < 4
- Removed hardcoded `fallbackRelatedPosts` array from `BlogPostPageClient`
- Sidebar "Blog ที่คล้ายกัน" section hidden when no related posts exist
- Tests updated with 4 new/updated test cases covering backfill scenarios

## Task Commits

Each task was committed atomically:

1. **Task 1: Improve related posts backfill logic** - `f34faeb` (fix)
2. **Task 2: Remove hardcoded fallback from BlogPostPageClient** - `5ea206a` (fix)
3. **Task 3: Build check** - passed (no commit needed)

## Files Created/Modified
- `src/lib/data/public.js` - Added backfill query after same-category fetch; fills remaining slots with recent posts
- `src/app/(public)/blog/[id]/BlogPostPageClient.jsx` - Removed fallbackRelatedPosts array, use DB data directly, conditionally render sidebar
- `tests/lib/data/public.test.js` - Added `not` and `is` to mock chain, updated 4 test cases for backfill scenarios

## Decisions Made
- Backfill uses `.not('id', 'in', ...)` to exclude current post + already-fetched same-category posts
- No category on post still triggers backfill (gets 4 recent posts from any category)
- Sidebar hidden entirely (not shown with empty state) when 0 related posts

## Deviations from Plan

None - plan executed exactly as written.

## Issues Encountered

None.

## User Setup Required

None - no external service configuration required.

## Next Phase Readiness
- Blog detail page now uses fully dynamic related posts
- No hardcoded data remains in the sidebar

---
*Quick Task: 11-related-blog-posts-replace-hardcoded-sid*
*Completed: 2026-02-16*
