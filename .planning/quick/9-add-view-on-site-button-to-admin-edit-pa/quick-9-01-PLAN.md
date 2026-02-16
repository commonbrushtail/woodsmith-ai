---
phase: quick-9
plan: 01
type: execute
wave: 1
depends_on: []
files_modified:
  - "src/app/(admin)/admin/products/edit/[id]/ProductEditClient.jsx"
  - "src/app/(admin)/admin/blog/edit/[id]/BlogEditClient.jsx"
autonomous: true
must_haves:
  truths:
    - "Admin editing a product sees a view-on-site link in the sidebar that opens the product public page in a new tab"
    - "Admin editing a blog post sees a view-on-site link in the sidebar that opens the blog public page in a new tab"
  artifacts:
    - path: "src/app/(admin)/admin/products/edit/[id]/ProductEditClient.jsx"
      provides: "View on site link for products"
      contains: "target=_blank"
    - path: "src/app/(admin)/admin/blog/edit/[id]/BlogEditClient.jsx"
      provides: "View on site link for blog posts"
      contains: "target=_blank"
  key_links:
    - from: "ProductEditClient.jsx sidebar"
      to: "/product/[id]"
      via: "anchor href with product.id"
      pattern: "href=.*product/"
    - from: "BlogEditClient.jsx sidebar"
      to: "/blog/[id]"
      via: "anchor href with post.id"
      pattern: "href=.*blog/"
---

<objective>
Add a "ดูหน้าเว็บ" (View on site) link to the admin edit page sidebars for Products and Blog posts — the only two content types with public detail pages.

Purpose: Let admins quickly preview the public-facing page for the content they are editing, without manually navigating to it.
Output: Two modified sidebar sections with an external-link anchor below the draft button.
</objective>

<execution_context>
@C:/Users/commo/.claude/get-shit-done/workflows/execute-plan.md
@C:/Users/commo/.claude/get-shit-done/templates/summary.md
</execution_context>

<context>
@src/app/(admin)/admin/products/edit/[id]/ProductEditClient.jsx
@src/app/(admin)/admin/blog/edit/[id]/BlogEditClient.jsx
</context>

<tasks>

<task type="auto">
  <name>Task 1: Add view-on-site link to ProductEditClient sidebar</name>
  <files>src/app/(admin)/admin/products/edit/[id]/ProductEditClient.jsx</files>
  <action>
In ProductEditClient.jsx, inside the sidebar `<div>` that contains the Entry heading, status indicator, publish button, and draft button (lines ~517-546), add an anchor element AFTER the draft button (after the closing `</button>` on line 545, before the closing `</div>` on line 546).

Insert this anchor:
```jsx
<a
  href={`/product/${product.id}`}
  target="_blank"
  rel="noopener noreferrer"
  className="w-full flex items-center justify-center gap-[6px] px-[16px] py-[8px] rounded-[8px] bg-white text-[#6b7280] font-['IBM_Plex_Sans_Thai'] font-medium text-[13px] border border-[#e8eaef] cursor-pointer hover:bg-[#f9fafb] hover:text-[#374151] transition-colors"
>
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
    <polyline points="15 3 21 3 21 9" />
    <line x1="10" y1="14" x2="21" y2="3" />
  </svg>
  ดูหน้าเว็บ
</a>
```

The `product` object is already available in scope (passed as a prop). The link uses `product.id` to construct the public URL `/product/{id}`.
  </action>
  <verify>Run `npm run build 2>&1 | tail -20` — build succeeds with no errors in ProductEditClient.jsx. Visually confirm the anchor tag is placed after the draft button inside the sidebar div.</verify>
  <done>ProductEditClient.jsx sidebar contains a "ดูหน้าเว็บ" link pointing to `/product/${product.id}` with target="_blank" and an external-link SVG icon, positioned after the draft button.</done>
</task>

<task type="auto">
  <name>Task 2: Add view-on-site link to BlogEditClient sidebar</name>
  <files>src/app/(admin)/admin/blog/edit/[id]/BlogEditClient.jsx</files>
  <action>
In BlogEditClient.jsx, inside the sidebar `<div>` that contains the Entry heading, status indicator, publish button, and draft button (lines ~239-271), add an anchor element AFTER the draft button (after the closing `</button>` on line 270, before the closing `</div>` on line 271).

Insert this anchor:
```jsx
<a
  href={`/blog/${post.id}`}
  target="_blank"
  rel="noopener noreferrer"
  className="w-full flex items-center justify-center gap-[6px] px-[16px] py-[8px] rounded-[8px] bg-white text-[#6b7280] font-['IBM_Plex_Sans_Thai'] font-medium text-[13px] border border-[#e8eaef] cursor-pointer hover:bg-[#f9fafb] hover:text-[#374151] transition-colors"
>
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
    <polyline points="15 3 21 3 21 9" />
    <line x1="10" y1="14" x2="21" y2="3" />
  </svg>
  ดูหน้าเว็บ
</a>
```

The `post` object is already available in scope (passed as a prop). The link uses `post.id` to construct the public URL `/blog/{id}`.
  </action>
  <verify>Run `npm run build 2>&1 | tail -20` — build succeeds with no errors in BlogEditClient.jsx. Visually confirm the anchor tag is placed after the draft button inside the sidebar div.</verify>
  <done>BlogEditClient.jsx sidebar contains a "ดูหน้าเว็บ" link pointing to `/blog/${post.id}` with target="_blank" and an external-link SVG icon, positioned after the draft button.</done>
</task>

</tasks>

<verification>
1. `npm run build` completes without errors
2. Both ProductEditClient.jsx and BlogEditClient.jsx contain `target="_blank"` anchor tags with correct public URLs
3. The link text is "ดูหน้าเว็บ" in both files
4. Links use the entity's ID (product.id and post.id respectively)
5. Links are placed inside the sidebar Entry card, after the draft button
</verification>

<success_criteria>
- ProductEditClient sidebar has a "ดูหน้าเว็บ" link opening /product/{id} in a new tab
- BlogEditClient sidebar has a "ดูหน้าเว็บ" link opening /blog/{id} in a new tab
- Both links have external-link SVG icons and subtle outlined styling consistent with the draft button
- Build passes with no errors
</success_criteria>

<output>
After completion, create `.planning/quick/9-add-view-on-site-button-to-admin-edit-pa/quick-9-01-SUMMARY.md`
</output>
