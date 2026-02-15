---
phase: 06-variation-admin-ui
plan: 02
subsystem: admin-ui
tags: [crud, forms, drag-drop, image-upload]
dependency_graph:
  requires:
    - "06-01 (variations list page)"
    - "05-01 (variation server actions)"
  provides:
    - "Variation group create page"
    - "Variation group edit page with full CRUD"
  affects:
    - "Admin workflow (complete variation management UI)"
tech_stack:
  added:
    - "dnd-kit drag-and-drop (reorder entries)"
    - "EntryImageUpload component (swatch uploads)"
  patterns:
    - "Two-phase create (group first, then entries)"
    - "Incremental edit updates (only changed fields)"
    - "Immediate delete for entries (no batch)"
    - "Force-delete confirmation for linked groups"
key_files:
  created:
    - "src/app/(admin)/admin/variations/create/page.jsx"
    - "src/components/admin/VariationCreateClient.jsx"
    - "src/app/(admin)/admin/variations/edit/[id]/page.jsx"
    - "src/app/(admin)/admin/variations/edit/[id]/VariationEditClient.jsx"
  modified: []
decisions:
  - "Follow ProductCreateClient layout pattern (header/content/sidebar)"
  - "Two-phase create flow (create group, then create entries sequentially)"
  - "Partial success handling (continue creating entries on individual failures)"
  - "Track original values in edit mode to detect changes efficiently"
  - "Immediate delete for individual entries (not batched with save)"
  - "Drag-and-drop reorder only affects existing entries in database"
  - "New entries get sort_order assigned by server on creation"
metrics:
  duration: 4
  completed: 2026-02-15
---

# Phase 6 Plan 02: Variation Form Pages Summary

Create and edit pages for variation groups with full CRUD functionality, entry management, swatch image upload, and drag-and-drop reordering.

## Tasks Completed

### Task 1: Create Variation Group Create Page
**Files:**
- `src/app/(admin)/admin/variations/create/page.jsx` (server component)
- `src/components/admin/VariationCreateClient.jsx` (client form, 312 lines)

**Implementation:**
- Server component renders VariationCreateClient (no pre-fetch needed for new group)
- Client form follows ProductCreateClient layout pattern (header + content + sidebar)
- Group name input with validation (required field)
- Entry list management: label input + swatch image upload per entry
- Start with one empty entry by default
- Add/remove entries dynamically
- EntryImageUpload component pattern (48x48 swatch preview, dashed border upload button)
- Two-phase submit flow: create group first, get ID, then create entries sequentially
- Partial success handling: continue creating entries even if individual entry fails
- Toast notifications for validation errors and success
- Navigate to /admin/variations on success

**Commit:** `d9e5e82`

### Task 2: Create Variation Group Edit Page
**Files:**
- `src/app/(admin)/admin/variations/edit/[id]/page.jsx` (server component)
- `src/app/(admin)/admin/variations/edit/[id]/VariationEditClient.jsx` (client form, 519 lines)

**Implementation:**
- Server component fetches variation group via getVariationGroup action
- Returns 404 via notFound() if group not found or error
- Client form pre-fills group name and entries from prop
- Track original values (originalLabel, originalImageUrl) to detect changes
- Incremental update flow (only update changed fields):
  - Update group name if changed
  - Update existing entries with changed labels or images
  - Create new entries added during edit session
- Entry image handling: upload new, remove existing, preserve unchanged
- Individual entry deletion: immediate delete from DB with confirmation (not batched)
- Drag-and-drop reorder via dnd-kit:
  - DndContext + SortableContext wrapping entry list
  - SortableEntryRow component with useSortable hook
  - GripIcon drag handle (6-dot pattern)
  - arrayMove on drag end + call reorderVariationEntries action
  - Only reorder existing entries (new entries get sort_order on save)
- Group deletion with force-delete flow:
  - First call without force flag
  - If warning (linked products), show confirm dialog with product count
  - If confirmed, call with force: true
- Toast notifications for all operations
- Navigate to /admin/variations on save or delete

**Commit:** `2126db6`

## Deviations from Plan

None — plan executed exactly as written.

## Implementation Notes

**Create Page Flow:**
1. Admin enters group name (required)
2. Admin adds entries with labels (optional swatch images)
3. On save:
   - Validate group name
   - Create group via createVariationGroup (get new group ID)
   - For each entry with non-empty label: create via createVariationEntry
   - Continue on individual entry errors (partial success OK)
   - Navigate to list page

**Edit Page Flow:**
1. Server fetches group + entries (sorted by sort_order)
2. Client pre-fills form with existing data
3. Admin can:
   - Update group name
   - Update entry labels and swatch images
   - Add new entries (not persisted until save)
   - Delete existing entries (immediate DB delete with confirmation)
   - Drag-and-drop reorder entries (updates DB immediately)
4. On save:
   - Update group name if changed
   - Update existing entries with changes
   - Create new entries added during session
   - Navigate to list page
5. On delete group:
   - Check for linked products
   - Show confirmation if links exist
   - Delete with force if confirmed

**Drag-and-Drop Pattern:**
- Follow FaqListClient pattern exactly
- useSensors with PointerSensor + KeyboardSensor
- SortableContext with verticalListSortingStrategy
- Each entry row uses useSortable hook
- CSS.Translate for transform, opacity on isDragging
- arrayMove to reorder local state
- buildSortOrderUpdates to generate DB update payloads
- Call reorderVariationEntries action on drag end

**Entry Deletion Pattern:**
- Existing entries: immediate delete via deleteVariationEntry (with confirmation)
- New entries (not yet saved): just remove from local state
- Different from batch delete approach — simpler UX, immediate feedback

**Image Upload Pattern:**
- EntryImageUpload component shared with create page
- Same pattern as OptionsAccordion (validateFile, URL.createObjectURL preview)
- 48x48 size, dashed border when empty, preview with X button on hover
- Remove button revokes object URL to prevent memory leak

## Verification

- Build passes with no errors
- /admin/variations/create renders form with group name + entry list
- /admin/variations/edit/[id] renders pre-filled form with existing data
- All four files follow server/client component pattern
- DndContext and SortableContext imported and used correctly
- Server actions imported: createVariationGroup, createVariationEntry, updateVariationGroup, updateVariationEntry, deleteVariationEntry, deleteVariationGroup, reorderVariationEntries
- All UI text in Thai
- Styling matches existing admin page conventions

## Self-Check: PASSED

**Created files exist:**
```
FOUND: src/app/(admin)/admin/variations/create/page.jsx
FOUND: src/components/admin/VariationCreateClient.jsx
FOUND: src/app/(admin)/admin/variations/edit/[id]/page.jsx
FOUND: src/app/(admin)/admin/variations/edit/[id]/VariationEditClient.jsx
```

**Commits exist:**
```
FOUND: d9e5e82 (Task 1 commit)
FOUND: 2126db6 (Task 2 commit)
```

All files created, all commits exist. Plan completed successfully.
