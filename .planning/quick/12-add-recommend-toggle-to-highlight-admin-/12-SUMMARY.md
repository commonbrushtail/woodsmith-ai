---
phase: quick-12
plan: 01
subsystem: admin-cms
tags: [video-highlights, recommended-badge, homepage-curation, ui-consistency]
dependency_graph:
  requires: []
  provides:
    - video_highlights.recommended column
    - toggleVideoHighlightRecommended server action
    - getRecommendedHighlights public data function
    - unified recommended badge design across all admin lists
  affects:
    - src/components/admin/VideoHighlightsListClient.jsx
    - src/components/admin/BlogListClient.jsx
    - src/components/admin/ProductsListClient.jsx
    - src/lib/data/public.js
    - src/app/(public)/page.jsx
tech_stack:
  added: []
  patterns:
    - recommended toggle pattern (matching blog/products)
    - fallback data fetching (recommended → all published)
    - unified badge component styling
key_files:
  created:
    - supabase/migrations/023_video_highlight_recommended.sql
  modified:
    - src/lib/actions/video-highlights.js
    - src/components/admin/VideoHighlightsListClient.jsx
    - src/components/admin/BlogListClient.jsx
    - src/components/admin/ProductsListClient.jsx
    - src/lib/data/public.js
    - src/app/(public)/page.jsx
decisions:
  - Unified recommended badge styling: green YES / grey NO (removed orange NO, removed ChevronDown icons)
  - Homepage uses recommended highlights with fallback to all published (prevents empty section)
  - RLS policies already filter to published=true, no additional filter needed in getRecommendedHighlights
metrics:
  duration: 2 min
  tasks_completed: 2
  files_modified: 7
  completed_date: 2026-02-16
---

# Phase quick-12 Plan 01: Add Recommend Toggle to Video Highlights Summary

**One-liner:** Video highlight admin list now has recommend toggle matching blog/products, homepage shows curated recommended highlights with automatic fallback.

## Context

The video highlights admin list lacked a recommend toggle (blog and products already had it), and the homepage always showed all published highlights with no curation mechanism. Additionally, the recommended badge designs were inconsistent across the three admin list pages (blog/products/highlights).

## What Was Built

### Task 1: Add recommended column + server action + admin toggle

**Files:**
- `supabase/migrations/023_video_highlight_recommended.sql` — ALTER TABLE adds `recommended boolean NOT NULL DEFAULT false`
- `src/lib/actions/video-highlights.js` — Added `toggleVideoHighlightRecommended(id, recommended)` server action, updated `createVideoHighlight` and `updateVideoHighlight` to handle recommended field from formData
- `src/components/admin/VideoHighlightsListClient.jsx` — Added "แนะนำ" column header, `handleToggleRecommended` handler, `renderRecommendedBadge` function with unified styling (green YES, grey NO, no chevron), updated colSpan from 6 to 7

**Commit:** `542ec3b`

### Task 2: Unify existing badge designs + wire homepage to recommended highlights

**Files:**
- `src/components/admin/BlogListClient.jsx` — Changed NO badge from orange (`border-[#f97316] text-[#ea580c] bg-[#fff7ed]`) to grey (`border-[#d1d5db] text-[#6b7280] bg-[#f9fafb]`)
- `src/components/admin/ProductsListClient.jsx` — Removed `<ChevronDownIcon>` from both YES and NO states, changed NO badge from orange to grey, added `bg-transparent border-none p-0` to button wrapper
- `src/lib/data/public.js` — Added `getRecommendedHighlights({ perPage = 4 })` function (filters by `recommended = true`, orders by `sort_order`)
- `src/app/(public)/page.jsx` — Changed homepage to fetch recommended highlights first, falling back to `getPublishedHighlights` if `recommendedRes.data.length === 0`

**Commit:** `17f157a`

## Deviations from Plan

None — plan executed exactly as written.

## Verification Results

- ✓ `npm run build` passes with no errors
- ✓ `npm test` passes (388 pass, 12 pre-existing failures unaffected)
- ✓ Migration file exists with correct SQL
- ✓ All three admin lists now use identical badge styling (green YES, grey NO, no icons)
- ✓ Homepage fetches recommended highlights with fallback logic

## Key Decisions

1. **Unified badge design:** All three admin lists (blog, products, video highlights) now use the exact same recommended badge styling:
   - YES: `border-[#22c55e] text-[#16a34a] bg-[#f0fdf4]`
   - NO: `border-[#d1d5db] text-[#6b7280] bg-[#f9fafb]`
   - Button wrapper: `cursor-pointer bg-transparent border-none p-0`
   - No ChevronDown icons (removed from products, not added to blog/highlights)

2. **Homepage fallback pattern:** Prevents empty highlight section by falling back to all published highlights when no highlights are marked recommended. This ensures a good user experience during content transitions.

3. **RLS policy reuse:** `getRecommendedHighlights` does not explicitly filter by `published = true` because existing RLS policies already handle this for anon/auth users.

## Impact

**Admin:**
- Video highlight admin list now has curated homepage control (matching blog/products)
- All three admin lists visually consistent (recommended badges identical)

**Public:**
- Homepage shows admin-curated highlights when available
- No blank sections if admin hasn't marked any highlights recommended yet (automatic fallback)

## Self-Check

Verifying created files exist:

```bash
[ -f "supabase/migrations/023_video_highlight_recommended.sql" ] && echo "FOUND: supabase/migrations/023_video_highlight_recommended.sql" || echo "MISSING: supabase/migrations/023_video_highlight_recommended.sql"
```

Verifying commits exist:

```bash
git log --oneline --all | grep -q "542ec3b" && echo "FOUND: 542ec3b" || echo "MISSING: 542ec3b"
git log --oneline --all | grep -q "17f157a" && echo "FOUND: 17f157a" || echo "MISSING: 17f157a"
```

**Results:**
```
FOUND: supabase/migrations/023_video_highlight_recommended.sql
FOUND: 542ec3b
FOUND: 17f157a
```

## Self-Check: PASSED

All created files and commits verified successfully.
