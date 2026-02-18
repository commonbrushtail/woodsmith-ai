---
phase: 24-fix-quotation-flow-product-detail-submit
plan: 01
type: execute
wave: 1
depends_on: []
files_modified:
  - src/app/(public)/product/[id]/ProductDetailClient.jsx
  - src/lib/actions/customer.js
  - supabase/migrations/032_quotation_quantity_message.sql
autonomous: false
must_haves:
  truths:
    - "Customer can submit a quotation from the product detail page and it succeeds without error"
    - "Submitted quotation appears in admin quotation list with correct product name, requester info, and message"
    - "Quotation submission works for both logged-in and anonymous users"
  artifacts:
    - path: "supabase/migrations/032_quotation_quantity_message.sql"
      provides: "quantity and message columns on quotations table"
      contains: "ALTER TABLE quotations"
    - path: "src/app/(public)/product/[id]/ProductDetailClient.jsx"
      provides: "Product ID passed to QuotationModal"
      contains: "id: dbProduct"
    - path: "src/lib/actions/customer.js"
      provides: "Working submitQuotation server action using service client"
      contains: "createServiceClient"
  key_links:
    - from: "ProductDetailClient.jsx"
      to: "QuotationModal.jsx"
      via: "product prop with id field"
      pattern: "id: dbProduct.id"
    - from: "QuotationModal.jsx"
      to: "submitQuotation (customer.js)"
      via: "dynamic import and function call"
      pattern: "submitQuotation"
    - from: "submitQuotation"
      to: "quotations table"
      via: "supabase insert with service client"
      pattern: "createServiceClient"
---

<objective>
Fix the end-to-end quotation submission flow: product detail page -> QuotationModal -> submitQuotation server action -> quotations table -> admin quotation list.

Three bugs prevent quotations from being created:

1. Missing product ID: ProductDetailClient maps dbProduct to a display object but never copies dbProduct.id, so product.id is always undefined and product_id is inserted as null.

2. Non-existent columns: submitQuotation inserts quantity and message columns that do not exist in the quotations table schema, causing a Supabase error on every insert attempt.

3. RLS blocks inserts: The INSERT policy requires auth.uid() = customer_id, but for anonymous users both values are null and NULL = NULL evaluates to FALSE in PostgreSQL. The QuotationModal is designed to work for all users (it collects contact info), so inserts must work without authentication.

Purpose: Core business flow -- customers requesting quotations is the primary conversion action on the site.
Output: Working quotation submission that creates rows visible in admin quotation list.
</objective>

<execution_context>
@C:/Users/commo/.claude/get-shit-done/workflows/execute-plan.md
@C:/Users/commo/.claude/get-shit-done/templates/summary.md
</execution_context>

<context>
@src/app/(public)/product/[id]/ProductDetailClient.jsx
@src/components/QuotationModal.jsx
@src/lib/actions/customer.js
@src/lib/validations/quotations.js
@src/lib/supabase/admin.js
@src/app/(admin)/admin/(dashboard)/quotations/page.jsx
@src/components/admin/QuotationListClient.jsx
@supabase/migrations/001_initial_schema.sql (lines 251-273: quotations table)
@supabase/migrations/002_rls_policies.sql (lines 230-242: quotation RLS)
</context>

<tasks>

<task type="auto">
  <name>Task 1: Add missing quotation columns via migration</name>
  <files>supabase/migrations/032_quotation_quantity_message.sql</files>
  <action>
    Create migration file supabase/migrations/032_quotation_quantity_message.sql that adds two columns to the quotations table:

    ALTER TABLE quotations ADD COLUMN IF NOT EXISTS quantity integer;
    ALTER TABLE quotations ADD COLUMN IF NOT EXISTS message text;

    These columns are referenced by submitQuotation() in src/lib/actions/customer.js and validated by quotationCreateSchema in src/lib/validations/quotations.js, but were never added to the table. The quantity column is nullable integer, message is nullable text.

    Do NOT add any RLS policy changes in this migration. Task 2 switches the insert to use createServiceClient which bypasses RLS entirely.
  </action>
  <verify>
    File exists at supabase/migrations/032_quotation_quantity_message.sql with two ALTER TABLE ADD COLUMN statements.
  </verify>
  <done>Migration file created with quantity (integer, nullable) and message (text, nullable) columns added to quotations table.</done>
</task>

<task type="auto">
  <name>Task 2: Fix product ID mapping and switch submitQuotation to service client</name>
  <files>
    src/app/(public)/product/[id]/ProductDetailClient.jsx
    src/lib/actions/customer.js
  </files>
  <action>
    Fix 1 -- ProductDetailClient.jsx (line ~206):

    In the product mapping block (around line 206), add id: dbProduct.id to the mapped object. The current code creates a new object with name, sku, category, etc. but omits id. Change the mapping from:

    const product = dbProduct ? {
      name: dbProduct.name,
      sku: dbProduct.sku || dbProduct.code,

    to:

    const product = dbProduct ? {
      id: dbProduct.id,
      name: dbProduct.name,
      sku: dbProduct.sku || dbProduct.code,

    This ensures product.id is defined when passed to QuotationModal at line 391.

    Fix 2 -- customer.js submitQuotation function (line ~131):

    Change submitQuotation to use createServiceClient() instead of createClient() for the database insert. This bypasses RLS, which is necessary because anonymous users have no auth session so auth.uid() = customer_id fails (null = null is FALSE in SQL). The function already imports createServiceClient from @/lib/supabase/admin (line 4). Admin quotation reads already use service client (in src/lib/actions/quotations.js).

    Replace these lines inside submitQuotation:
      const supabase = await createClient()
      const { data: { user } } = await supabase.auth.getUser()

    With:
      const authSupabase = await createClient()
      const { data: { user } } = await authSupabase.auth.getUser()
      const supabase = createServiceClient()

    Keep the user?.id || null for customer_id -- this correctly links the quotation to a logged-in user when available, or stores null for anonymous users. The supabase variable now points to the service client for the .from('quotations').insert() call and the product name lookup for email notifications.

    IMPORTANT: Do NOT change the createClient import or remove it -- it is still needed by getCustomerProfile, updateCustomerProfile, completeLineProfile, completePhoneProfile, and getMyQuotations functions in the same file.
  </action>
  <verify>
    1. grep for "id: dbProduct.id" in ProductDetailClient.jsx confirms the fix
    2. grep for "createServiceClient()" in customer.js within the submitQuotation function confirms service client usage
    3. npm run build succeeds without errors
  </verify>
  <done>
    Product ID correctly flows from DB to ProductDetailClient to QuotationModal to submitQuotation.
    submitQuotation uses service client to bypass RLS, allowing both authenticated and anonymous quotation submissions.
    Quotation rows are created with correct product_id, message, and quantity columns.
  </done>
</task>

<task type="checkpoint:human-verify" gate="blocking">
  <name>Task 3: Verify end-to-end quotation flow</name>
  <files></files>
  <action>Human verifies the complete quotation submission flow works end-to-end.</action>
  <what-built>Fixed end-to-end quotation submission flow with three bug fixes: (1) migration adding quantity/message columns, (2) product ID mapping fix, (3) service client for RLS bypass.</what-built>
  <how-to-verify>
    1. Apply the migration: run supabase db push or execute 032_quotation_quantity_message.sql against your Supabase database
    2. Start dev server: npm run dev
    3. Navigate to any product detail page (e.g. /products/construction/.../product-slug)
    4. Click the orange button
    5. Fill in name, phone, optional email and message
    6. Click next then confirm
    7. Should see green success screen
    8. Log in to admin at /admin/login
    9. Navigate to /admin/quotations
    10. Verify the new quotation appears with correct product name and requester info
    11. Click the quotation number to verify detail page shows all fields
  </how-to-verify>
  <verify>User confirms flow works end-to-end.</verify>
  <done>Quotation flow verified working from product detail through admin list.</done>
  <resume-signal>Type approved or describe any issues with the flow</resume-signal>
</task>

</tasks>

<verification>
- Quotation submission from product detail page succeeds (no console errors, no Supabase errors)
- New quotation row has non-null product_id matching the viewed product
- Admin quotation list shows the quotation with product name
- Works for both logged-in customers and anonymous visitors
</verification>

<success_criteria>
- Customer clicks quotation button on product detail, fills form, submits, sees success
- Quotation row created in database with correct product_id, requester info, message
- Admin can see and manage the quotation at /admin/quotations
- No RLS policy violations in Supabase logs
</success_criteria>

<output>
After completion, create .planning/quick/24-fix-quotation-flow-product-detail-submit/24-SUMMARY.md
</output>
