---
phase: quick-12
plan: 01
type: execute
wave: 1
depends_on: []
files_modified:
  - supabase/migrations/023_video_highlight_recommended.sql
  - src/lib/actions/video-highlights.js
  - src/components/admin/VideoHighlightsListClient.jsx
  - src/components/admin/BlogListClient.jsx
  - src/components/admin/ProductsListClient.jsx
  - src/lib/data/public.js
  - src/app/(public)/page.jsx
autonomous: true
must_haves:
  truths:
    - "Admin can toggle recommended on/off for video highlights in the list page"
    - "Recommended badge design is identical across blog, products, and video highlights admin lists"
    - "Homepage highlight section shows only recommended highlights (falling back to all if none recommended)"
  artifacts:
    - path: "supabase/migrations/023_video_highlight_recommended.sql"
      provides: "recommended column on video_highlights table"
      contains: "ALTER TABLE video_highlights ADD COLUMN recommended"
    - path: "src/lib/actions/video-highlights.js"
      provides: "toggleVideoHighlightRecommended server action"
      exports: ["toggleVideoHighlightRecommended"]
    - path: "src/components/admin/VideoHighlightsListClient.jsx"
      provides: "Recommended column with toggle badge in highlight list"
    - path: "src/lib/data/public.js"
      provides: "getRecommendedHighlights function for homepage"
      exports: ["getRecommendedHighlights"]
  key_links:
    - from: "src/components/admin/VideoHighlightsListClient.jsx"
      to: "src/lib/actions/video-highlights.js"
      via: "toggleVideoHighlightRecommended import"
      pattern: "toggleVideoHighlightRecommended"
    - from: "src/app/(public)/page.jsx"
      to: "src/lib/data/public.js"
      via: "getRecommendedHighlights import"
      pattern: "getRecommendedHighlights"
---

<objective>
Add a `recommended` column to video_highlights, add a recommend toggle to the video highlight admin list page, unify the recommended badge design across all three admin list pages (blog, products, highlights), and wire the homepage highlight section to show recommended highlights with a fallback.

Purpose: Allows admin to curate which video highlights appear on the homepage, matching the pattern already used for blog and products. Unifies inconsistent badge styles.
Output: Migration file, updated server actions, unified admin toggle badges, homepage wired to recommended highlights.
</objective>

<execution_context>
@C:/Users/commo/.claude/get-shit-done/workflows/execute-plan.md
@C:/Users/commo/.claude/get-shit-done/templates/summary.md
</execution_context>

<context>
@src/lib/actions/video-highlights.js
@src/components/admin/VideoHighlightsListClient.jsx
@src/components/admin/BlogListClient.jsx
@src/components/admin/ProductsListClient.jsx
@src/lib/data/public.js
@src/app/(public)/page.jsx
@src/components/HighlightSection.jsx
</context>

<tasks>

<task type="auto">
  <name>Task 1: Add recommended column + server action + admin toggle</name>
  <files>
    supabase/migrations/023_video_highlight_recommended.sql
    src/lib/actions/video-highlights.js
    src/components/admin/VideoHighlightsListClient.jsx
  </files>
  <action>
1. Create migration `supabase/migrations/023_video_highlight_recommended.sql`:
   ```sql
   ALTER TABLE video_highlights ADD COLUMN recommended boolean NOT NULL DEFAULT false;
   ```

2. In `src/lib/actions/video-highlights.js`:
   - Add `toggleVideoHighlightRecommended(id, recommended)` function following the exact pattern of `toggleVideoHighlightPublished` (same file, lines 167-181). Update the field from `published` to `recommended`. Revalidate both `/admin/video-highlight` and `/highlight` paths.
   - Also update `createVideoHighlight` and `updateVideoHighlight` to handle the `recommended` field from formData (same pattern as `published` field handling).

3. In `src/components/admin/VideoHighlightsListClient.jsx`:
   - Import `toggleVideoHighlightRecommended` from the actions file (add to existing import on line 7).
   - Add `handleToggleRecommended` handler following the same pattern as `handleTogglePublished` (line 224-229).
   - Add `renderRecommendedBadge(highlight)` function. Use the UNIFIED badge design (see below for canonical style).
   - Add a new table column header "แนะนำ" (between the title column and publish status column).
   - Add a new `<td>` in the row rendering that calls `renderRecommendedBadge(highlight)`.
   - Update the empty state `colSpan` from 6 to 7.

**Unified recommended badge design** (use this exact pattern in all three list clients):
```jsx
function renderRecommendedBadge(item) {
  return (
    <button onClick={() => handleToggleRecommended(item.id, item.recommended)} className="cursor-pointer bg-transparent border-none p-0">
      {item.recommended ? (
        <span className="inline-flex items-center gap-[4px] rounded-full border border-[#22c55e] text-[#16a34a] bg-[#f0fdf4] px-[10px] py-[2px] text-[12px] font-medium leading-[20px] whitespace-nowrap">
          YES
        </span>
      ) : (
        <span className="inline-flex items-center gap-[4px] rounded-full border border-[#d1d5db] text-[#6b7280] bg-[#f9fafb] px-[10px] py-[2px] text-[12px] font-medium leading-[20px] whitespace-nowrap">
          NO
        </span>
      )}
    </button>
  )
}
```

Key design decisions for unification:
- YES state: green border/text/bg (same across all three) -- `border-[#22c55e] text-[#16a34a] bg-[#f0fdf4]`
- NO state: grey border/text/bg (NOT orange -- match the publish badge "not published" pattern) -- `border-[#d1d5db] text-[#6b7280] bg-[#f9fafb]`
- No ChevronDown icon (remove from products, keep it simple like blog)
- Wrapper is a `<button>` with `cursor-pointer bg-transparent border-none p-0`
  </action>
  <verify>
Run `npm run build` -- should compile without errors. Check that the migration file exists and has correct SQL.
  </verify>
  <done>
Video highlights admin list page has a "แนะนำ" column with clickable YES/NO badges that toggle the recommended field via server action. Migration adds the recommended column.
  </done>
</task>

<task type="auto">
  <name>Task 2: Unify existing badge designs + wire homepage to recommended highlights</name>
  <files>
    src/components/admin/BlogListClient.jsx
    src/components/admin/ProductsListClient.jsx
    src/lib/data/public.js
    src/app/(public)/page.jsx
  </files>
  <action>
1. In `src/components/admin/BlogListClient.jsx` (lines 183-197):
   - Update `renderRecommendedBadge` to use the unified design from Task 1.
   - Currently the NO state uses orange (`border-[#f97316] text-[#ea580c] bg-[#fff7ed]`). Change to grey: `border-[#d1d5db] text-[#6b7280] bg-[#f9fafb]`.
   - The YES state is already correct (green).
   - The wrapper button style is already correct.

2. In `src/components/admin/ProductsListClient.jsx` (lines 194-215):
   - Update `renderRecommendedBadge` to use the unified design from Task 1.
   - Remove the `<ChevronDownIcon>` from both YES and NO states.
   - Change the NO state from orange to grey (same as blog fix above).
   - Change the wrapper from bare `<button>` with inline classes to match the unified pattern: add `bg-transparent border-none p-0` and remove any extra styling. Currently the buttons lack the `bg-transparent border-none p-0` classes.

3. In `src/lib/data/public.js`:
   - Add a new function `getRecommendedHighlights({ perPage = 4 } = {})`:
     ```js
     export async function getRecommendedHighlights({ perPage = 4 } = {}) {
       const supabase = await createClient()
       const { data, error } = await supabase
         .from('video_highlights')
         .select('*')
         .eq('recommended', true)
         .order('sort_order', { ascending: true })
         .limit(perPage)
       if (error) return { data: [], error: error.message }
       return { data: data || [], error: null }
     }
     ```
   Note: RLS policies already filter to `published = true` for anon/auth users, so no need to add a published filter.

4. In `src/app/(public)/page.jsx`:
   - Import `getRecommendedHighlights` alongside existing imports from `public.js`.
   - Replace the `getPublishedHighlights({ perPage: 4 })` call with a two-step approach:
     ```js
     // Try recommended first, fall back to all published
     const recommendedRes = await getRecommendedHighlights({ perPage: 4 })
     const highlightsRes = recommendedRes.data.length > 0
       ? recommendedRes
       : await getPublishedHighlights({ perPage: 4 })
     ```
   - Keep `getPublishedHighlights` in the import (used as fallback).
   - Remove `getPublishedHighlights` from the `Promise.all` and run the highlight logic after it. The other 4 fetches stay in `Promise.all`. Structure:
     ```js
     const [bannersRes, blogsRes, productsRes, galleryRes] = await Promise.all([
       getActiveBanners(),
       getPublishedBlogPosts({ perPage: 5 }),
       getPublishedProducts({ perPage: 12 }),
       getPublishedGalleryItems('homepage'),
     ])

     // Highlights: prefer recommended, fall back to all published
     const recommendedRes = await getRecommendedHighlights({ perPage: 4 })
     const highlightsRes = recommendedRes.data.length > 0
       ? recommendedRes
       : await getPublishedHighlights({ perPage: 4 })
     ```
  </action>
  <verify>
Run `npm run build` -- should compile without errors. Run `npm test` -- existing tests should still pass.
  </verify>
  <done>
Blog and products admin lists use the same grey NO / green YES badge design as highlights. Homepage shows recommended highlights when available, falls back to all published highlights when none are recommended.
  </done>
</task>

</tasks>

<verification>
1. `npm run build` passes with no errors
2. `npm test` passes (existing tests unaffected)
3. Migration file `023_video_highlight_recommended.sql` exists with correct ALTER TABLE
4. Video highlight admin list shows recommend column with toggle badges
5. All three admin lists (blog, products, highlights) use identical badge styling for recommended
6. Homepage fetches recommended highlights first, falls back to all published
</verification>

<success_criteria>
- Admin can toggle recommended on video highlights from the list page
- All three admin list pages show visually identical recommended badges (green YES, grey NO, no chevron icons)
- Homepage highlight section prioritizes recommended highlights
- When no highlights are marked recommended, homepage falls back to showing all published highlights (no blank section)
</success_criteria>

<output>
After completion, create `.planning/quick/12-add-recommend-toggle-to-highlight-admin-/12-SUMMARY.md`
</output>
