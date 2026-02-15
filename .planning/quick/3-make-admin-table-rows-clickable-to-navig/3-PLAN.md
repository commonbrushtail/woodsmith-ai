---
phase: quick-3
plan: 01
type: execute
wave: 1
depends_on: []
files_modified:
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
autonomous: true

must_haves:
  truths:
    - "Admin can click any table row to navigate to edit page"
    - "Clicking buttons/links/inputs within row does NOT navigate"
    - "Cursor changes to pointer when hovering over rows"
  artifacts:
    - path: "src/components/admin/BannersListClient.jsx"
      provides: "Clickable banner rows navigating to /admin/banner/edit/${id}"
      contains: "onClick={(e) => {"
    - path: "src/components/admin/ProductsListClient.jsx"
      provides: "Clickable product rows navigating to /admin/products/edit/${id}"
      contains: "onClick={(e) => {"
    - path: "src/components/admin/GalleryListClient.jsx"
      provides: "Clickable gallery rows navigating to /admin/gallery/edit/${id}"
      contains: "onClick={(e) => {"
  key_links:
    - from: "tr onClick handler"
      to: "router.push()"
      via: "e.target.closest() check"
      pattern: "if \\(e\\.target\\.closest\\('button, a, input, select'\\)\\) return"
---

<objective>
Make all admin list table rows clickable to navigate to their respective edit pages.

Purpose: Improve UX by allowing admins to click anywhere on a row (not just the action menu) to edit an item.
Output: 10 updated admin list client components with clickable rows.
</objective>

<execution_context>
@C:/Users/commo/.claude/get-shit-done/workflows/execute-plan.md
@C:/Users/commo/.claude/get-shit-done/templates/summary.md
</execution_context>

<context>
@C:/Users/commo/OneDrive/Documents/GitHub/woodsmith-ai/.planning/PROJECT.md
@C:/Users/commo/OneDrive/Documents/GitHub/woodsmith-ai/src/components/admin/BannersListClient.jsx
@C:/Users/commo/OneDrive/Documents/GitHub/woodsmith-ai/src/components/admin/BlogListClient.jsx
@C:/Users/commo/OneDrive/Documents/GitHub/woodsmith-ai/src/components/admin/BranchListClient.jsx
@C:/Users/commo/OneDrive/Documents/GitHub/woodsmith-ai/src/components/admin/CategoriesListClient.jsx
@C:/Users/commo/OneDrive/Documents/GitHub/woodsmith-ai/src/components/admin/FaqListClient.jsx
@C:/Users/commo/OneDrive/Documents/GitHub/woodsmith-ai/src/components/admin/GalleryListClient.jsx
@C:/Users/commo/OneDrive/Documents/GitHub/woodsmith-ai/src/components/admin/ManualsListClient.jsx
@C:/Users/commo/OneDrive/Documents/GitHub/woodsmith-ai/src/components/admin/ProductsListClient.jsx
@C:/Users/commo/OneDrive/Documents/GitHub/woodsmith-ai/src/components/admin/ProductTypesListClient.jsx
@C:/Users/commo/OneDrive/Documents/GitHub/woodsmith-ai/src/components/admin/VideoHighlightsListClient.jsx
</context>

<tasks>

<task type="auto">
  <name>Add row click navigation to SortableRow-based list clients</name>
  <files>
    src/components/admin/BannersListClient.jsx
    src/components/admin/BlogListClient.jsx
    src/components/admin/FaqListClient.jsx
    src/components/admin/GalleryListClient.jsx
    src/components/admin/ManualsListClient.jsx
    src/components/admin/ProductTypesListClient.jsx
    src/components/admin/VideoHighlightsListClient.jsx
  </files>
  <action>
For each file that defines a local `SortableRow` component:

1. Update the `SortableRow` component signature to accept an `onClick` prop:
   ```jsx
   function SortableRow({ id, children, onClick }) {
   ```

2. Add the `onClick` handler and `cursor-pointer` class to the `<tr>` element:
   ```jsx
   return (
     <tr
       ref={setNodeRef}
       style={style}
       onClick={onClick}
       className="border-b border-[#f3f4f6] hover:bg-[#f9fafb] transition-colors cursor-pointer"
     >
   ```

3. Where `SortableRow` is used in the JSX (inside the map function), pass an onClick handler:
   ```jsx
   <SortableRow
     key={item.id}
     id={item.id}
     onClick={(e) => {
       if (e.target.closest('button, a, input, select')) return
       router.push('/admin/{section}/edit/' + item.id)
     }}
   >
   ```

Replace `{section}` with the correct URL segment for each file:
- BannersListClient: `/admin/banner/edit/${item.id}`
- BlogListClient: `/admin/blog/edit/${item.id}`
- FaqListClient: `/admin/faq/edit/${item.id}`
- GalleryListClient: `/admin/gallery/edit/${item.id}`
- ManualsListClient: `/admin/manual/edit/${item.id}`
- ProductTypesListClient: `/admin/product-types/edit/${item.id}`
- VideoHighlightsListClient: `/admin/video-highlight/edit/${item.id}`

The `e.target.closest()` check prevents navigation when clicking interactive elements (buttons, links, inputs, selects) within the row, such as:
- Toggle status badges
- Drag handles
- Action menu buttons
- Checkboxes

All files already have `useRouter` imported and `router` available from `const router = useRouter()`.
  </action>
  <verify>
Run dev server and manually test one file from each category:
- Click on a row (not on buttons/badges) → should navigate to edit page
- Click on status badge or action menu → should NOT navigate
- Hover over row → cursor should be pointer

```bash
npm run dev
```

Visit these pages and test row clicks:
- http://localhost:3000/admin/banner (BannersListClient)
- http://localhost:3000/admin/blog (BlogListClient)
- http://localhost:3000/admin/faq (FaqListClient)
  </verify>
  <done>
SortableRow-based list clients (7 files) have clickable rows that navigate to edit pages. Clicking interactive elements within rows does NOT trigger navigation. Rows show pointer cursor on hover.
  </done>
</task>

<task type="auto">
  <name>Add row click navigation to regular tr-based list clients</name>
  <files>
    src/components/admin/BranchListClient.jsx
    src/components/admin/CategoriesListClient.jsx
    src/components/admin/ProductsListClient.jsx
  </files>
  <action>
For each file that uses regular `<tr>` elements (no SortableRow):

1. Locate the `<tr>` element inside the map function (in the tbody).

2. Add `onClick` handler and `cursor-pointer` class to the existing `<tr>`:
   ```jsx
   <tr
     key={item.id}
     onClick={(e) => {
       if (e.target.closest('button, a, input, select')) return
       router.push('/admin/{section}/edit/' + item.id)
     }}
     className="border-t border-[#f3f4f6] hover:bg-[#fafafa] transition-colors cursor-pointer"
   >
   ```

Replace `{section}` with the correct URL segment for each file:
- BranchListClient: `/admin/branch/edit/${item.id}` (use `branch.id` for the variable name)
- CategoriesListClient: `/admin/categories/edit/${item.id}` (use `category.id` for the variable name)
- ProductsListClient: `/admin/products/edit/${item.id}` (use `product.id` for the variable name)

The `e.target.closest()` check prevents navigation when clicking:
- Checkboxes
- Toggle badges (recommended, published status)
- Action menu buttons
- Any other interactive elements

All files already have `useRouter` imported and `router` available.

Note: ProductsListClient already has a `className` on the `<tr>` — append `cursor-pointer` to the existing classes.
  </action>
  <verify>
Run dev server and manually test:
- Click on a row (avoiding buttons/badges/checkboxes) → should navigate to edit page
- Click on status badge or checkbox → should NOT navigate
- Hover over row → cursor should be pointer

```bash
npm run dev
```

Visit these pages and test row clicks:
- http://localhost:3000/admin/branch (BranchListClient)
- http://localhost:3000/admin/categories (CategoriesListClient)
- http://localhost:3000/admin/products (ProductsListClient)
  </verify>
  <done>
Regular tr-based list clients (3 files) have clickable rows that navigate to edit pages. Clicking interactive elements within rows does NOT trigger navigation. Rows show pointer cursor on hover.
  </done>
</task>

</tasks>

<verification>
After both tasks complete:

1. Start dev server: `npm run dev`
2. Test ALL 10 admin list pages:
   - /admin/banner
   - /admin/blog
   - /admin/branch
   - /admin/categories
   - /admin/faq
   - /admin/gallery
   - /admin/manual
   - /admin/products
   - /admin/product-types
   - /admin/video-highlight

3. For each page, verify:
   - Clicking anywhere on a row (not on buttons/badges/inputs) navigates to edit page
   - Clicking status badges, action menu, checkboxes, drag handles does NOT navigate
   - Cursor shows pointer when hovering over rows
   - Edit page URL matches expected pattern

4. Check console for any errors during navigation
</verification>

<success_criteria>
- All 10 list client files updated with row click handlers
- Row clicks navigate to correct edit page URL for each section
- Interactive elements (buttons, badges, inputs) still function normally without triggering navigation
- Cursor pointer indicates clickable rows
- No console errors during testing
- UX improvement: admins can now click anywhere on a row to edit, not just the action menu
</success_criteria>

<output>
After completion, create `.planning/quick/3-make-admin-table-rows-clickable-to-navig/3-01-SUMMARY.md` documenting:
- Files modified (10 list clients)
- Implementation approach (SortableRow onClick prop vs direct tr onClick)
- Event delegation pattern used (e.target.closest check)
- Testing results from all 10 admin pages
</output>
