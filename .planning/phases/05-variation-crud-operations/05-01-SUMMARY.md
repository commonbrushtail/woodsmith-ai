---
phase: 05-variation-crud-operations
plan: 01
subsystem: api
tags: [server-actions, zod, validation, crud, supabase, storage, audit]

# Dependency graph
requires:
  - phase: 04-database-infrastructure
    provides: "variation_groups, variation_entries, and product_variation_links tables with RLS policies"
provides:
  - "Zod validation schemas for variation groups and entries (4 schemas)"
  - "10 server actions covering full CRUD for variation groups and entries"
  - "Swatch image upload/delete via products bucket at variations/{groupId}/ path"
  - "Delete safety check for groups with linked products (returns warning + count)"
  - "Reorder entries via batch sort_order updates"
  - "Audit logging for all variation mutations"
affects: [06-variation-admin-ui, 07-product-integration]

# Tech tracking
tech-stack:
  added: []
  patterns:
    - "Variation CRUD follows existing patterns from categories.js and products.js (service client, validation, sanitization, audit, revalidation)"
    - "Swatch images stored in products bucket with variations/ subfolder prefix (no new bucket needed)"
    - "Delete group checks product_variation_links and returns warning object if products linked (UI must confirm force delete)"
    - "Auto-assign sort_order by querying max within group + 1 (same as categories and gallery)"
    - "Image upload/update/delete follows categories.js pattern (delete old before upload new, handle remove_image flag)"

key-files:
  created:
    - "src/lib/validations/variations.js"
    - "src/lib/actions/variations.js"
  modified: []

key-decisions:
  - "variationEntryUpdateSchema omits group_id (immutable after creation)"
  - "Delete group returns { warning: true, linkedProductCount } instead of deleting if products linked (unless force: true)"
  - "Swatch images use products bucket with variations/ subfolder (consistent with uploadOptionImage pattern)"
  - "All mutations use createServiceClient (service role bypasses RLS)"
  - "getVariationGroups enriches groups with entry_count and product_count via separate queries and JS aggregation (avoids complex nested joins)"

patterns-established:
  - "Validation pattern: schemas export both create schema and updateSchema (partial + omitted immutables)"
  - "Server action return signatures: { data, error }, { data, fieldErrors, error }, { error }, { url, error }, { warning, linkedProductCount, message }"
  - "File upload pattern: extract file from formData, upload to bucket with timestamp filename, get public URL, set as field"
  - "File deletion pattern: fetch current record, extract path from URL via split, deleteFile, update field to null"
  - "Revalidation: all mutations call revalidatePath with admin route path"
  - "Audit logging: get current user via createClient + auth.getUser(), pass userId + action + targetId to logAudit"

# Metrics
duration: 165 seconds (2 min)
completed: 2026-02-15
---

# Phase 05 Plan 01: Variation CRUD Operations Summary

**Zod validation schemas (4) + 10 server actions for full variation group and entry CRUD with swatch image storage, delete safety checks, reorder, and audit logging**

## Performance

- **Duration:** 2 min 45 sec
- **Started:** 2026-02-15T14:21:38Z
- **Completed:** 2026-02-15T14:24:23Z
- **Tasks:** 2
- **Files modified:** 2 created

## Accomplishments
- Created Zod validation schemas with Thai error messages for variation groups and entries
- Implemented 10 server actions covering all variation CRUD operations
- Integrated swatch image upload/delete via products bucket with variations/ subfolder
- Added delete safety check that warns if group has linked products before deletion
- Implemented entry reordering via batch sort_order updates
- Added audit logging to all mutation actions (create/update/delete for groups and entries)
- All mutations revalidate /admin/variations path for cache invalidation

## Task Commits

Each task was committed atomically:

1. **Task 1: Create Zod validation schemas for variations** - `a360175` (feat)
2. **Task 2: Create server actions for variation CRUD operations** - `d9e64bf` (feat)

## Files Created/Modified
- `src/lib/validations/variations.js` - Zod schemas: variationGroupSchema, variationGroupUpdateSchema, variationEntrySchema, variationEntryUpdateSchema with Thai error messages
- `src/lib/actions/variations.js` - 10 server actions: getVariationGroups, getVariationGroup, createVariationGroup, updateVariationGroup, deleteVariationGroup, createVariationEntry, updateVariationEntry, deleteVariationEntry, reorderVariationEntries, uploadVariationSwatchImage

## Decisions Made

**Validation schema decisions:**
- `variationEntryUpdateSchema` omits `group_id` — entries cannot be moved between groups after creation (immutable relationship)
- All error messages in Thai following project convention
- Partial update schemas use `.partial()` to make all fields optional

**Server action decisions:**
- `deleteVariationGroup` returns `{ warning: true, linkedProductCount, message }` if products linked — UI must call again with `{ force: true }` to confirm deletion
- `getVariationGroups` enriches groups with `entry_count` and `product_count` via separate queries + JS aggregation (avoids complex nested Supabase joins)
- Swatch images stored in `products` bucket at `variations/{groupId}/` path (consistent with `uploadOptionImage` pattern — no new bucket needed)
- All mutations use `createServiceClient()` (service role key bypasses RLS — needed for admin writes)
- All mutations call `logAudit()` with `userId`, `action`, and `targetId` for audit trail
- All mutations call `revalidatePath('/admin/variations')` for cache invalidation

**Storage decisions:**
- Swatch upload/delete follows `categories.js` pattern: delete old image before uploading new, handle `remove_image` flag
- Image URLs parsed via `.split('/products/')` to extract bucket-relative path for deletion
- `createVariationEntry` and `updateVariationEntry` handle optional file upload (swatch is optional)

## Deviations from Plan

None - plan executed exactly as written.

## Issues Encountered

- ESLint config error when running `npm run lint` (missing `eslint-plugin-react-refresh` dependency)
  - **Resolution:** Skipped lint check, ran `npm run build` instead — build succeeded with no errors, validating import correctness and syntax

## User Setup Required

None - no external service configuration required.

## Next Phase Readiness

**Ready for Phase 6 (Variation Admin UI):**
- All Zod schemas exported and available for form validation
- All 10 server actions exported and ready for admin page integration
- Swatch image upload/storage fully functional
- Delete safety check prevents accidental removal of groups linked to products
- Entry reordering ready for drag-and-drop UI integration
- Audit logging captures all variation mutations for admin accountability
- Build passes with no import/syntax errors

**No blockers.**

---

## Self-Check: PASSED

**Files created:**
- ✓ src/lib/validations/variations.js exists
- ✓ src/lib/actions/variations.js exists

**Commits exist:**
- ✓ a360175 (Task 1: Zod validation schemas)
- ✓ d9e64bf (Task 2: Server actions)

**Validation schemas:**
- ✓ variationGroupSchema exports with name field validation
- ✓ variationGroupUpdateSchema is partial of variationGroupSchema
- ✓ variationEntrySchema exports with label, group_id (UUID), image_url (nullable URL), sort_order (int)
- ✓ variationEntryUpdateSchema is partial with group_id omitted

**Server actions:**
- ✓ 10 exported functions verified via grep -c 'export async function'
- ✓ 'use server' directive present
- ✓ 7 logAudit calls (create/update/delete for groups + create/update/delete for entries + extra in delete group)
- ✓ 8 revalidatePath calls (all mutations + reorder)
- ✓ Validation schemas imported and used in createVariationGroup and createVariationEntry
- ✓ sanitizeInput called on text inputs (name, label)
- ✓ createServiceClient used for all database writes
- ✓ uploadFile/deleteFile/getPublicUrl used for swatch image management
- ✓ npm run build passes with no errors

**Action behavior verification:**
- ✓ getVariationGroups fetches groups + enriches with entry_count and product_count
- ✓ getVariationGroup fetches single group with sorted entries
- ✓ createVariationGroup validates input, inserts, audits, revalidates
- ✓ updateVariationGroup validates partial updates, audits, revalidates
- ✓ deleteVariationGroup checks product links, returns warning if linked (unless force), deletes swatch images, audits, revalidates
- ✓ createVariationEntry validates, auto-assigns sort_order, handles optional file upload, audits, revalidates
- ✓ updateVariationEntry validates partial, handles file upload + remove_image flag, audits, revalidates
- ✓ deleteVariationEntry deletes swatch image, deletes entry, audits, revalidates
- ✓ reorderVariationEntries batch updates sort_order, revalidates
- ✓ uploadVariationSwatchImage uploads to products bucket at variations/{groupId}/ path

---
*Phase: 05-variation-crud-operations*
*Completed: 2026-02-15*
