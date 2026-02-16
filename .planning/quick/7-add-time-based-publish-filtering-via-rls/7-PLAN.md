---
phase: quick-7
plan: 01
type: execute
wave: 1
depends_on: []
files_modified:
  - supabase/migrations/015_publish_date_rls.sql
  - src/components/admin/ProductsListClient.jsx
autonomous: true
must_haves:
  truths:
    - "Public users cannot see products where publish_start is in the future"
    - "Public users cannot see products where publish_end is in the past"
    - "Public users CAN see products with null publish_start/publish_end (backward compatible)"
    - "Admin list shows 4 distinct badge states based on published flag and date range"
    - "Clicking a schedule-status badge still toggles the published boolean only"
  artifacts:
    - path: "supabase/migrations/015_publish_date_rls.sql"
      provides: "Updated RLS policies with date range checks"
      contains: "publish_start IS NULL OR publish_start <= now()"
    - path: "src/components/admin/ProductsListClient.jsx"
      provides: "4-state publish badge rendering"
      contains: "renderPublishBadge"
  key_links:
    - from: "supabase/migrations/015_publish_date_rls.sql"
      to: "products table"
      via: "RLS policy replacement"
      pattern: "DROP POLICY.*CREATE POLICY"
    - from: "supabase/migrations/015_publish_date_rls.sql"
      to: "product_images, product_options, product_variation_links tables"
      via: "EXISTS subquery update"
      pattern: "publish_start IS NULL OR publish_start <= now\\(\\)"
---

<objective>
Add time-based publish filtering to products via RLS policies and update the admin list to show schedule status badges.

Purpose: Products with publish_start/publish_end dates should be automatically hidden/shown on the public site based on current time, without requiring manual toggle. Admin users see the scheduling status at a glance.

Output: One SQL migration file, one updated React component.
</objective>

<execution_context>
@C:/Users/commo/.claude/get-shit-done/workflows/execute-plan.md
@C:/Users/commo/.claude/get-shit-done/templates/summary.md
</execution_context>

<context>
@supabase/migrations/002_rls_policies.sql
@supabase/migrations/014_variation_rls.sql
@src/components/admin/ProductsListClient.jsx
</context>

<tasks>

<task type="auto">
  <name>Task 1: Create RLS migration with date range checks</name>
  <files>supabase/migrations/015_publish_date_rls.sql</files>
  <action>
Create migration file `supabase/migrations/015_publish_date_rls.sql` that:

1. **Products table** - DROP and recreate both SELECT policies:
   ```sql
   DROP POLICY "Public can read published products" ON products;
   DROP POLICY "Authenticated can read published products" ON products;
   ```
   Then CREATE replacements with the same names using:
   ```sql
   USING (
     published = true
     AND (publish_start IS NULL OR publish_start <= now())
     AND (publish_end IS NULL OR publish_end >= now())
   )
   ```

2. **product_images table** - DROP and recreate both SELECT policies. Update the EXISTS subquery to include date checks:
   ```sql
   DROP POLICY "Public can read product images" ON product_images;
   DROP POLICY "Authenticated can read product images" ON product_images;
   ```
   Recreate with:
   ```sql
   USING (
     EXISTS (
       SELECT 1 FROM products
       WHERE products.id = product_images.product_id
         AND products.published = true
         AND (products.publish_start IS NULL OR products.publish_start <= now())
         AND (products.publish_end IS NULL OR products.publish_end >= now())
     )
   )
   ```

3. **product_options table** - Same DROP/CREATE pattern as product_images, updating the EXISTS subquery with date conditions.

4. **product_variation_links table** - Same DROP/CREATE pattern, updating the EXISTS subquery with date conditions. These policies are in `014_variation_rls.sql` but the new migration replaces them:
   ```sql
   DROP POLICY "Public can read product variation links" ON product_variation_links;
   DROP POLICY "Authenticated can read product variation links" ON product_variation_links;
   ```
   Recreate with same date-aware EXISTS subquery pattern.

Add a header comment explaining the migration purpose. Total: 8 DROP + 8 CREATE statements (2 per table x 4 tables).
  </action>
  <verify>Review the SQL file to confirm: 8 policies dropped, 8 policies created, all 4 tables covered (products, product_images, product_options, product_variation_links), all new policies include the three-part USING clause (published = true AND publish_start check AND publish_end check).</verify>
  <done>Migration file exists with correct DROP/CREATE for all 8 policies across 4 tables. NULL dates are treated as "no restriction" (backward compatible).</done>
</task>

<task type="auto">
  <name>Task 2: Update admin product list with 4-state publish badges</name>
  <files>src/components/admin/ProductsListClient.jsx</files>
  <action>
Update the `renderPublishBadge(product)` function in `ProductsListClient.jsx` to show 4 states based on `product.published`, `product.publish_start`, and `product.publish_end`:

1. **Determine publish status** - Add a helper function `getPublishStatus(product)` that returns one of 4 values:
   - `'unpublished'` — `published === false` (regardless of dates)
   - `'scheduled'` — `published === true` AND `publish_start` is set AND `publish_start > now`
   - `'active'` — `published === true` AND currently within date range (or no dates set). Specifically: `(publish_start is null OR publish_start <= now) AND (publish_end is null OR publish_end >= now)`
   - `'expired'` — `published === true` AND `publish_end` is set AND `publish_end < now`

   Check expired BEFORE scheduled when both dates exist (if end date has passed, it is expired even if start date is also in the future — edge case but safer).

2. **Update `renderPublishBadge`** to render based on status:
   - `'unpublished'`: gray badge "ไม่แสดง" (keep existing gray styles: `border-[#d1d5db] text-[#6b7280] bg-[#f9fafb]`)
   - `'scheduled'`: blue/purple badge "รอเผยแพร่" (styles: `border-[#818cf8] text-[#6366f1] bg-[#eef2ff]`)
   - `'active'`: green badge "เผยแพร่" (keep existing green styles: `border-[#22c55e] text-[#16a34a] bg-[#f0fdf4]`)
   - `'expired'`: red/orange badge "หมดอายุ" (styles: `border-[#f87171] text-[#dc2626] bg-[#fef2f2]`)

3. **All badges remain clickable** — clicking any badge still calls `handleTogglePublished(product.id, product.published)` to toggle the `published` boolean. The ChevronDownIcon should match the text color of each badge variant.

4. **Do NOT change** any other part of the component — only the `renderPublishBadge` function and the new `getPublishStatus` helper.
  </action>
  <verify>Run `npm run build` to verify no build errors. Visually inspect: the renderPublishBadge function handles all 4 states, each with distinct colors, all badges remain clickable toggle buttons.</verify>
  <done>Admin product list shows: gray "ไม่แสดง" for unpublished, blue "รอเผยแพร่" for scheduled, green "เผยแพร่" for active, red "หมดอายุ" for expired. All badges toggle the published boolean on click.</done>
</task>

</tasks>

<verification>
1. SQL migration has correct syntax and covers all 4 tables (products, product_images, product_options, product_variation_links)
2. All 8 original policies are dropped and 8 new ones created with date range checks
3. NULL publish_start/publish_end treated as "no restriction" (backward compatible with existing products)
4. Admin badge shows 4 distinct states with correct Thai labels
5. Badge click behavior unchanged (toggles published boolean only)
6. `npm run build` passes without errors
</verification>

<success_criteria>
- Migration file `015_publish_date_rls.sql` exists with all 8 policy replacements
- `renderPublishBadge` renders 4 distinct badge states with correct colors and Thai text
- Build passes cleanly
- Existing products with no publish dates continue to work (NULL = no restriction)
</success_criteria>

<output>
After completion, create `.planning/quick/7-add-time-based-publish-filtering-via-rls/7-SUMMARY.md`
</output>
