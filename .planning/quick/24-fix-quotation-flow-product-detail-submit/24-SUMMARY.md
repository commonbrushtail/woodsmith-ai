---
phase: quick-24b-fix-quotation-flow-product-detail-submit
plan: 01
subsystem: database, ui, api
tags: [supabase, rls, quotations, server-actions, product-detail]

# Dependency graph
requires:
  - phase: quick-24
    provides: custom SMS OTP flow (phone-auth.js), customer auth session pattern
provides:
  - Working quotation submission from product detail page for both authenticated and anonymous users
  - Migration 032 adding quantity and message columns to quotations table
affects: [admin quotations list, customer account quotations view]

# Tech tracking
tech-stack:
  added: []
  patterns:
    - "Service client bypass pattern: use createServiceClient() for inserts where RLS blocks anonymous users (NULL = NULL is FALSE in PostgreSQL)"
    - "Auth-split pattern: separate authSupabase (createClient) for user lookup, supabase (createServiceClient) for DB writes in same function"

key-files:
  created:
    - supabase/migrations/032_quotation_quantity_message.sql
  modified:
    - src/app/(public)/product/[id]/ProductDetailClient.jsx
    - src/lib/actions/customer.js

key-decisions:
  - "submitQuotation uses createServiceClient for DB insert - anonymous quotations have null customer_id, PostgreSQL NULL = NULL is FALSE so RLS insert policy blocks all anonymous submissions"
  - "id: dbProduct.id added to product mapping in ProductDetailClient - id was omitted, making product.id always undefined when passed to QuotationModal"
  - "quantity and message columns added as nullable (no NOT NULL constraint) - existing rows without these values remain valid"

patterns-established:
  - "Auth-split in server actions: use createClient() for auth.getUser(), createServiceClient() for DB writes that need to work for anonymous users"

# Metrics
duration: 5min
completed: 2026-02-18
---

# Quick Task 24b: Fix Quotation Submission Flow Summary

**Three bug fixes enabling end-to-end quotation submission: missing product ID in mapping, non-existent quantity/message columns, and RLS blocking anonymous inserts via service client switch**

## Performance

- **Duration:** ~5 min
- **Started:** 2026-02-18
- **Completed:** 2026-02-18
- **Tasks:** 2 auto + 1 human-verify checkpoint
- **Files modified:** 3 (1 created, 2 modified)

## Accomplishments
- Added migration 032 adding `quantity` and `message` columns to quotations table (were referenced in submitQuotation but never added to schema)
- Fixed `id: dbProduct.id` missing from product mapping in ProductDetailClient so product_id flows correctly to quotations insert
- Switched `submitQuotation` to use `createServiceClient()` for DB insert, bypassing RLS that blocked all anonymous quotation submissions (NULL = NULL is FALSE in PostgreSQL)

## Task Commits

Each task was committed atomically:

1. **Task 1: Add missing quotation columns via migration** - `a553b2f` (chore)
2. **Task 2: Fix product ID mapping and switch submitQuotation to service client** - `15d44ba` (fix)

## Files Created/Modified
- `supabase/migrations/032_quotation_quantity_message.sql` - Adds nullable quantity (integer) and message (text) columns to quotations table
- `src/app/(public)/product/[id]/ProductDetailClient.jsx` - Added `id: dbProduct.id` to product mapping object (line 207)
- `src/lib/actions/customer.js` - Split createClient/createServiceClient usage in submitQuotation: auth via authSupabase, DB insert via service client

## Decisions Made
- Service client for quotation inserts: anonymous users produce null customer_id, and the existing RLS `auth.uid() = customer_id` evaluates FALSE for null = null in PostgreSQL. QuotationModal is designed to accept anonymous submissions (it collects contact info), so bypassing RLS is correct here.
- Auth split pattern: createClient() kept for `auth.getUser()` (must use session-aware client), createServiceClient() only for the insert and subsequent product name lookup. All other functions in customer.js remain unchanged.
- quantity and message as nullable columns: no existing data needs these values, IF NOT EXISTS guard prevents re-run errors.

## Deviations from Plan

None - plan executed exactly as written.

## Issues Encountered
None.

## User Setup Required

**Database migration required before testing.**

Run the migration against your Supabase database:
```bash
# Option 1: Supabase CLI
supabase db push

# Option 2: Manual via Supabase dashboard SQL editor
-- Copy and run supabase/migrations/032_quotation_quantity_message.sql
ALTER TABLE quotations ADD COLUMN IF NOT EXISTS quantity integer;
ALTER TABLE quotations ADD COLUMN IF NOT EXISTS message text;
```

## Next Phase Readiness
- Quotation submission flow is fixed and ready for human verification (Task 3 checkpoint)
- Admin quotations list at /admin/quotations should show new submissions with correct product name and requester info

---
*Phase: quick-24b-fix-quotation-flow-product-detail-submit*
*Completed: 2026-02-18*
