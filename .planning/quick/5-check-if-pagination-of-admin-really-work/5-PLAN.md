---
phase: quick-5
plan: 01
type: execute
wave: 1
depends_on: []
files_modified:
  - src/app/(admin)/admin/products/page.jsx
  - src/components/admin/ProductsListClient.jsx
  - src/app/(admin)/admin/blog/page.jsx
  - src/app/(admin)/admin/quotations/page.jsx
  - src/app/(admin)/admin/users/page.jsx
  - src/app/(admin)/admin/banner/page.jsx
  - src/app/(admin)/admin/branch/page.jsx
  - src/app/(admin)/admin/faq/page.jsx
  - src/app/(admin)/admin/manual/page.jsx
  - src/app/(admin)/admin/video-highlight/page.jsx
  - src/app/(admin)/admin/gallery/page.jsx
autonomous: true
must_haves:
  truths:
    - "Products list page fetches correct page of data when user clicks pagination buttons"
    - "Products list page respects rows-per-page selection"
    - "All other admin list pages load all items (client-side filtering is sufficient for <100 items)"
  artifacts:
    - path: "src/app/(admin)/admin/products/page.jsx"
      provides: "Server component that reads searchParams for page/perPage and passes to getProducts"
    - path: "src/components/admin/ProductsListClient.jsx"
      provides: "Client component with working pagination that navigates via URL params"
  key_links:
    - from: "src/components/admin/ProductsListClient.jsx"
      to: "src/app/(admin)/admin/products/page.jsx"
      via: "URL searchParams (page, perPage)"
      pattern: "searchParams.*page"
    - from: "src/app/(admin)/admin/products/page.jsx"
      to: "src/lib/actions/products.js"
      via: "getProducts({ page, perPage })"
      pattern: "getProducts.*page.*perPage"
---

<objective>
Investigate and fix admin pagination. Currently, all admin list pages hardcode `{ page: 1, perPage: N }` in their server components, and the client-side pagination controls in ProductsListClient are cosmetic -- clicking page buttons updates local state but never triggers a new data fetch. Other list pages have no pagination UI at all.

Purpose: Ensure the Products admin page (the only one with pagination UI) actually paginates data from the database, and confirm all other admin list pages are intentionally loading all items.

Output: Working server-side pagination for Products; all other list pages load all items with large perPage (appropriate for small datasets).
</objective>

<execution_context>
@C:/Users/commo/.claude/get-shit-done/workflows/execute-plan.md
@C:/Users/commo/.claude/get-shit-done/templates/summary.md
</execution_context>

<context>
@src/app/(admin)/admin/products/page.jsx
@src/components/admin/ProductsListClient.jsx
@src/lib/actions/products.js
@src/app/(admin)/admin/blog/page.jsx
@src/app/(admin)/admin/quotations/page.jsx
@src/app/(admin)/admin/users/page.jsx
</context>

<tasks>

<task type="auto">
  <name>Task 1: Fix Products pagination to use URL-driven server-side fetching</name>
  <files>
    src/app/(admin)/admin/products/page.jsx
    src/components/admin/ProductsListClient.jsx
  </files>
  <action>
The Products page is the ONLY admin list page with pagination UI (page numbers, rows-per-page selector). Currently it is broken: the server component hardcodes `{ page: 1, perPage: 10 }`, and the client component's pagination buttons only update local state without fetching new data.

**Fix the server component** (`src/app/(admin)/admin/products/page.jsx`):
- Accept `searchParams` prop (Next.js App Router convention for server components).
- Read `page` and `perPage` from `searchParams` (default to `page=1`, `perPage=10`).
- Parse them as integers and pass to `getProducts({ page, perPage })`.
- Pass `currentPage` and `rowsPerPage` as props to `ProductsListClient` alongside `products` and `totalCount`.

**Fix the client component** (`src/components/admin/ProductsListClient.jsx`):
- Accept `currentPage` and `rowsPerPage` as props (from URL params via server component).
- Remove the `useState` for `currentPage` and `rowsPerPage` -- these are now URL-driven.
- When user clicks a page button or changes rows-per-page, use `useRouter().push()` or `useRouter().replace()` to navigate to the same page with updated `?page=N&perPage=M` search params. This triggers a server re-render with the correct data slice.
- Update `renderPageNumbers()` to use the prop `currentPage` instead of local state.
- Update the rows-per-page `<select>` to navigate instead of setting local state.
- The row index display should account for the current page: `(currentPage - 1) * rowsPerPage + index + 1` instead of `index + 1`.

NOTE: Do NOT touch the `getProducts` server action -- it already correctly implements `.range(from, to)` pagination. The bug is entirely in the page/component layer.

NOTE: Next.js 16 App Router `searchParams` is a Promise that must be awaited in server components: `const params = await searchParams`.
  </action>
  <verify>
Run `npm run build` to confirm no build errors. Then manually verify: visit `/admin/products` -- should show page 1 of 10. Click page 2 -- URL should update to `?page=2` and show different products. Change rows-per-page to 25 -- URL should update to `?perPage=25&page=1`.
  </verify>
  <done>
Products admin page has working server-side pagination: page buttons and rows-per-page selector update URL params, server re-fetches the correct data slice, and the UI reflects the current page accurately.
  </done>
</task>

<task type="auto">
  <name>Task 2: Normalize other admin list pages to load all items</name>
  <files>
    src/app/(admin)/admin/blog/page.jsx
    src/app/(admin)/admin/quotations/page.jsx
    src/app/(admin)/admin/users/page.jsx
    src/app/(admin)/admin/banner/page.jsx
    src/app/(admin)/admin/branch/page.jsx
    src/app/(admin)/admin/faq/page.jsx
    src/app/(admin)/admin/manual/page.jsx
    src/app/(admin)/admin/video-highlight/page.jsx
    src/app/(admin)/admin/gallery/page.jsx
  </files>
  <action>
All non-product admin list pages currently hardcode `{ page: 1, perPage: 50 }`. These pages have NO pagination UI -- they show all items in a single list with client-side search/filter only. The `perPage: 50` is an arbitrary limit that will silently hide items 51+ from the admin.

For each of these 9 pages, change the `perPage` value to `1000` to effectively load all items. These are admin-only pages for entities that will realistically never exceed a few hundred items (blogs, FAQs, branches, manuals, etc.), so loading all items is the correct approach. True server-side pagination is only warranted for Products (which can grow to thousands).

Specific changes per file:
- `blog/page.jsx`: `perPage: 50` -> `perPage: 1000`
- `quotations/page.jsx`: `perPage: 50` -> `perPage: 1000`
- `users/page.jsx`: `perPage: 50` -> `perPage: 1000`
- `banner/page.jsx`: Check current value, change to `perPage: 1000`
- `branch/page.jsx`: `perPage: 50` -> `perPage: 1000`
- `faq/page.jsx`: `perPage: 50` -> `perPage: 1000`
- `manual/page.jsx`: `perPage: 50` -> `perPage: 1000`
- `video-highlight/page.jsx`: `perPage: 50` -> `perPage: 1000`
- `gallery/page.jsx`: Check current value, change to `perPage: 1000`

Do NOT add pagination UI to these pages. They intentionally use client-side search/filter/sort only.
  </action>
  <verify>
Run `npm run build` to confirm no build errors. Spot-check 2-3 admin list pages (e.g., `/admin/blog`, `/admin/faq`) to confirm they still render correctly and show all items.
  </verify>
  <done>
All non-product admin list pages use `perPage: 1000` to load all items, eliminating the risk of silently hiding items beyond position 50.
  </done>
</task>

</tasks>

<verification>
1. `npm run build` passes with no errors
2. Products page: page buttons change URL and show different data slices
3. Products page: rows-per-page selector changes URL and adjusts data slice
4. Products page: row numbers are correct across pages (page 2 starts at 11, not 1)
5. Other admin list pages load and display all items without pagination UI
6. `npm test` passes (existing tests still work)
</verification>

<success_criteria>
- Products admin list page has working server-side pagination driven by URL search params
- All other admin list pages load up to 1000 items (effectively all) with no pagination UI
- No build or test regressions
</success_criteria>

<output>
After completion, create `.planning/quick/5-check-if-pagination-of-admin-really-work/5-SUMMARY.md`
</output>
