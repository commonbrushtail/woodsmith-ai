---
phase: quick-6
plan: 01
type: execute
wave: 1
depends_on: []
files_modified:
  - src/lib/pagination.js
  - src/app/(public)/products/ProductsPageClient.jsx
  - src/app/(public)/products/[category]/ProductCategoryPageClient.jsx
  - src/components/admin/ProductsListClient.jsx
  - src/components/admin/AdminTable.jsx
autonomous: true
must_haves:
  truths:
    - "When on page 5 of 10, the page number 5 is visible and highlighted in all pagination controls"
    - "When on page 1 of 10, pages 1,2,3 are visible with ellipsis before the last page"
    - "When on the last page of 10, pages 8,9,10 are visible with ellipsis after page 1"
    - "No page number appears duplicated in any pagination control"
  artifacts:
    - path: "src/lib/pagination.js"
      provides: "Shared getPageNumbers(current, total) utility"
      exports: ["getPageNumbers"]
    - path: "src/app/(public)/products/ProductsPageClient.jsx"
      provides: "Fixed pagination using shared utility"
      contains: "getPageNumbers"
    - path: "src/app/(public)/products/[category]/ProductCategoryPageClient.jsx"
      provides: "Fixed pagination using shared utility"
      contains: "getPageNumbers"
    - path: "src/components/admin/ProductsListClient.jsx"
      provides: "Fixed pagination using shared utility"
      contains: "getPageNumbers"
    - path: "src/components/admin/AdminTable.jsx"
      provides: "Fixed pagination using shared utility"
      contains: "getPageNumbers"
  key_links:
    - from: "src/lib/pagination.js"
      to: "4 consumer files"
      via: "import { getPageNumbers }"
      pattern: "import.*getPageNumbers.*from.*lib/pagination"
---

<objective>
Fix pagination active page display when navigating past page 3 in all pagination controls.

Purpose: Currently 4 pagination implementations never show the current page number when the user navigates beyond page 3, making it impossible to know which page you are on.

Output: A shared `getPageNumbers` utility and 4 fixed pagination components.
</objective>

<execution_context>
@C:/Users/commo/.claude/get-shit-done/workflows/execute-plan.md
@C:/Users/commo/.claude/get-shit-done/templates/summary.md
</execution_context>

<context>
@src/app/(public)/blog/BlogPageClient.jsx (lines 60-65 — correct reference implementation)
@src/app/(public)/highlight/HighlightPageClient.jsx (lines 77-91 — correct reference implementation)
@src/app/(public)/products/ProductsPageClient.jsx (lines 132-189 — broken)
@src/app/(public)/products/[category]/ProductCategoryPageClient.jsx (lines 146-203 — broken)
@src/components/admin/ProductsListClient.jsx (lines 239-296 — broken)
@src/components/admin/AdminTable.jsx (lines 95-148 — broken)
</context>

<tasks>

<task type="auto">
  <name>Task 1: Create shared getPageNumbers utility and fix all 4 broken pagination components</name>
  <files>
    src/lib/pagination.js
    src/app/(public)/products/ProductsPageClient.jsx
    src/app/(public)/products/[category]/ProductCategoryPageClient.jsx
    src/components/admin/ProductsListClient.jsx
    src/components/admin/AdminTable.jsx
  </files>
  <action>
1. Create `src/lib/pagination.js` exporting a single function:

```js
/**
 * Generate page numbers array with ellipsis for pagination controls.
 * @param {number} current - Current active page (1-based)
 * @param {number} total - Total number of pages
 * @returns {Array<number|string>} Page numbers and '...' ellipsis markers
 */
export function getPageNumbers(current, total) {
  if (total <= 5) return Array.from({ length: total }, (_, i) => i + 1)
  if (current <= 3) return [1, 2, 3, '...', total]
  if (current >= total - 2) return [1, '...', total - 2, total - 1, total]
  return [1, '...', current - 1, current, current + 1, '...', total]
}
```

This is the exact algorithm from `BlogPageClient.jsx` (lines 60-65) which is proven correct.

2. Fix `src/app/(public)/products/ProductsPageClient.jsx`:
   - Add `import { getPageNumbers } from '@/lib/pagination'` at the top
   - In the `Pagination` component (line 132), replace the static page-building logic (lines 133-142) with: `const pages = getPageNumbers(currentPage, totalPages)`
   - Delete the `for` loop and `if/else` block that builds pages statically
   - Keep all JSX rendering unchanged (the `pages.map(...)` and button styling stay exactly the same)

3. Fix `src/app/(public)/products/[category]/ProductCategoryPageClient.jsx`:
   - Identical fix as #2 above. Add import, replace lines 147-156 with `const pages = getPageNumbers(currentPage, totalPages)`
   - Keep all JSX rendering unchanged

4. Fix `src/components/admin/ProductsListClient.jsx`:
   - Add `import { getPageNumbers } from '@/lib/pagination'` at the top
   - In `renderPageNumbers()` (line 239), replace the `visiblePages` building logic (lines 254-257) with: `const visiblePages = getPageNumbers(currentPage, totalPages)`
   - The rest of the function (prev/next buttons, rendering loop) stays the same
   - Note: This component uses `'...'` string for ellipsis, and the shared function returns `'...'`, so the existing `p === '...'` check works as-is

5. Fix `src/components/admin/AdminTable.jsx`:
   - Add `import { getPageNumbers } from '@/lib/pagination'` at the top
   - Replace the entire sliding-window page generation block (lines 103-140) with a simpler approach:
     - Compute `const pages = getPageNumbers(currentPage, totalPages)`
     - Map over `pages` rendering buttons for numbers and `...` span for ellipsis markers
     - Keep the prev/next buttons (lines 96-102 and 141-147) exactly as they are
     - Keep the exact same button styling classes (size-[32px], rounded-[6px], bg-orange text-white for active, etc.)
   - This eliminates the duplicate-last-page bug because `getPageNumbers` never produces duplicates

DO NOT change any visual styling, class names, button shapes, or colors. Only the page number generation logic changes.
  </action>
  <verify>
Run `npm run build` to confirm no import errors or build failures. Then manually verify the logic by tracing through examples:
- getPageNumbers(1, 10) should return [1, 2, 3, '...', 10]
- getPageNumbers(5, 10) should return [1, '...', 4, 5, 6, '...', 10]
- getPageNumbers(9, 10) should return [1, '...', 8, 9, 10]
- getPageNumbers(3, 5) should return [1, 2, 3, 4, 5]

Also run `npm test` to confirm existing tests still pass.
  </verify>
  <done>
All 4 pagination components use the shared getPageNumbers utility. Current page is always visible and highlighted regardless of which page is active. No duplicate page numbers appear. No styling changes.
  </done>
</task>

</tasks>

<verification>
1. `npm run build` succeeds with no errors
2. `npm test` passes (no regressions)
3. `grep -r "getPageNumbers" src/` shows imports in all 5 files (1 definition + 4 consumers)
4. The old static `for (let i = 1; i <= Math.min(3` pattern no longer exists in any of the 4 fixed files
</verification>

<success_criteria>
- Shared `src/lib/pagination.js` exists with correct algorithm
- All 4 broken files import and use the shared function
- Page 5 of 10 shows: [1] [...] [4] [5*] [6] [...] [10] in every pagination control
- Page 1 of 10 shows: [1*] [2] [3] [...] [10]
- Page 10 of 10 shows: [1] [...] [8] [9] [10*]
- No visual styling changes
- Build and tests pass
</success_criteria>

<output>
After completion, create `.planning/quick/6-fix-pagination-active-page-display-past-/6-SUMMARY.md`
</output>
