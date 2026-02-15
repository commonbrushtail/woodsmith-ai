---
phase: 07-product-integration
plan: 01
subsystem: product-variations
tags: [server-actions, ui-components, variation-linking]
dependency_graph:
  requires: [variation-groups, variation-entries, product-variation-links]
  provides: [syncProductVariationLinks-action, VariationLinker-component]
  affects: [product-forms]
tech_stack:
  added: []
  patterns: [bulk-replace-pattern, ad-hoc-creation, nested-joins]
key_files:
  created:
    - src/components/admin/VariationLinker.jsx
  modified:
    - src/lib/actions/products.js
decisions:
  - slug: bulk-replace-sync
    summary: "syncProductVariationLinks uses delete-all-then-insert pattern for atomic link sync"
    rationale: "Simplifies form submission logic (no diff calculation needed), ensures consistency"
  - slug: nested-join-in-getProduct
    summary: "getProduct joins product_variation_links with nested variation_groups and variation_entries"
    rationale: "Single query fetches all data needed to initialize VariationLinker in edit mode"
  - slug: ad-hoc-entry-creation
    summary: "VariationLinker reuses existing createVariationEntry action from variations.js"
    rationale: "No new server action needed, maintains single source of truth for entry creation"
  - slug: auto-select-all-entries
    summary: "When adding a group, all entries are pre-selected by default"
    rationale: "User-friendly default (most products use all entries), easy to deselect if needed"
metrics:
  duration_minutes: 3
  tasks_completed: 2
  commits: 2
  files_created: 1
  files_modified: 1
  completed_at: 2026-02-15T15:03:35Z
---

# Phase 07 Plan 01: Product-Variation Data Layer Summary

**One-liner:** Server action for bulk-syncing product-variation links + reusable VariationLinker component with group search, entry selection, unlinking, and ad-hoc entry creation

## Objective

Create the data layer (syncProductVariationLinks action) and shared UI component (VariationLinker) that Plan 02 will integrate into product create/edit forms.

## What Was Built

### 1. syncProductVariationLinks Action (products.js)

**Purpose:** Bulk replace product-variation links atomically

**Implementation:**
- Takes productId and links array `[{ group_id, entry_id }]`
- Deletes ALL existing links for the product
- Inserts new links if array is non-empty
- Logs audit event for admin action tracking
- Revalidates both list and detail pages

**Pattern:** Delete-all-then-insert ensures consistency (no partial updates, no orphaned links)

**No Zod validation:** UUIDs come from internal component state, not user text input

### 2. Extended getProduct to Fetch Variation Links

**Changes:**
- Added `product_variation_links` to select query with nested joins
- Each link includes `variation_groups(id, name)` and `variation_entries(id, label, image_url, sort_order)`
- Single query provides all data needed to initialize VariationLinker in edit mode

**Result:** `product.product_variation_links` array available in edit forms

### 3. VariationLinker Component (VariationLinker.jsx)

**Purpose:** Reusable variation linking UI for product forms

**Props:**
- `allGroups` — variation groups with entries (fetched by parent server component)
- `initialLinks` — existing product_variation_links (for edit mode, empty for create)
- `onChange(links)` — callback receiving current links as `[{ group_id, entry_id }]`

**Features:**
- **Group search/select:** Dropdown with search filter, adds group on click
- **Entry checkboxes:** All entries pre-selected by default when group is added
- **Unlink button:** Removes group and clears its selected entries (implements LINK-03)
- **Ad-hoc entry creation:** Inline input to create new entries on-the-fly using `createVariationEntry` action
- **Auto-select new entries:** Newly created entries are automatically checked
- **Collapsible groups:** Click chevron to expand/collapse entry list

**Styling:**
- Matches OptionsAccordion pattern (white card, `bg-[#f9fafb]` for group cards)
- Thai labels throughout
- Orange accent color for badges and buttons
- Entry count badge shows "3/5 เลือกแล้ว" (selected/total)

**State management:**
- Manages own local state (linkedGroups, selectedEntries, expandedGroups)
- Initializes from `initialLinks` prop
- Calls `onChange` on every selection change
- Parent form accumulates links and sends on submit

## Tasks Completed

| Task | Description | Files | Commit |
|------|-------------|-------|--------|
| 1 | Add syncProductVariationLinks action and extend getProduct | src/lib/actions/products.js | 2b53b44 |
| 2 | Create VariationLinker component | src/components/admin/VariationLinker.jsx | 93d4cb3 |

## Deviations from Plan

None - plan executed exactly as written.

## Technical Decisions

**1. Bulk Replace vs Diff-Based Sync**
- Chose: Delete-all-then-insert
- Rationale: Simpler, atomic, no risk of partial updates
- Trade-off: Slightly more DB writes, but negligible for variation link count

**2. Nested Joins in getProduct**
- Chose: Single query with nested joins
- Rationale: Avoids N+1 queries, provides all data in one round-trip
- Pattern: `product_variation_links(id, group_id, entry_id, variation_groups(...), variation_entries(...))`

**3. Ad-Hoc Entry Creation**
- Chose: Reuse `createVariationEntry` from variations.js
- Rationale: Maintains single source of truth, no duplicate logic
- Implementation: Import action directly, call in transition, add to local state on success

**4. Auto-Select All Entries**
- Chose: Pre-check all entries when adding a group
- Rationale: User-friendly default (most products use all entries in a group)
- Escape hatch: Easy to uncheck individual entries if needed

## Verification Results

**Build:** ✅ Passed

**Greps:**
- ✅ `syncProductVariationLinks` exported from products.js
- ✅ `product_variation_links` in getProduct select query
- ✅ VariationLinker exports default component
- ✅ `createVariationEntry` imported for ad-hoc creation
- ✅ `onChange` callback called on selection changes

**Success Criteria:**
- ✅ Server action can bulk-replace product-variation links
- ✅ getProduct returns variation link data with group/entry details
- ✅ VariationLinker component provides complete UI for selecting groups, picking entries, unlinking groups, and creating ad-hoc entries
- ✅ All code compiles and build passes

## Next Steps

**Plan 02:** Integrate VariationLinker into ProductCreateClient and ProductEditClient
- Fetch variation groups in server component
- Pass to VariationLinker as prop
- Accumulate links from onChange callback
- Send to syncProductVariationLinks on form submit

## Self-Check: PASSED

**Created files verified:**
```
FOUND: src/components/admin/VariationLinker.jsx
```

**Modified files verified:**
```
FOUND: src/lib/actions/products.js
```

**Commits verified:**
```
FOUND: 2b53b44 (feat(07-01): add syncProductVariationLinks action and extend getProduct)
FOUND: 93d4cb3 (feat(07-01): create VariationLinker component for product forms)
```

**Key exports verified:**
```
FOUND: syncProductVariationLinks in products.js (line 369)
FOUND: product_variation_links in getProduct select (line 46)
FOUND: default export in VariationLinker.jsx (line 41)
```

All files created, commits exist, exports present. Self-check passed.
