---
phase: 06-variation-admin-ui
plan: 01
subsystem: admin-variations
tags: [admin-ui, variations, navigation, list-page]
dependency_graph:
  requires: [05-01-variation-crud-operations]
  provides: [variations-list-page, variations-sidebar-nav]
  affects: [admin-sidebar-menu]
tech_stack:
  added: []
  patterns: [server-component-list-page, client-list-component, force-delete-confirmation]
key_files:
  created:
    - src/app/(admin)/admin/variations/page.jsx
    - src/components/admin/VariationsListClient.jsx
  modified:
    - src/components/admin/AdminSidebar.jsx
decisions:
  - summary: "Follow FaqListClient pattern for simpler list component without pagination"
    rationale: "Variation groups are expected to be few (typically 5-20), so pagination is not needed"
  - summary: "Implement two-step delete flow with force confirmation for linked groups"
    rationale: "Matches deleteVariationGroup API behavior with warning flag for groups linked to products"
metrics:
  duration_minutes: 3
  tasks_completed: 1
  files_created: 2
  files_modified: 1
  commits: 1
  completed_at: "2026-02-15T14:40:11Z"
---

# Phase 06 Plan 01: Variation List Page Summary

**One-liner:** Admin variations list page with sidebar navigation, search filtering, and force-delete confirmation for linked groups.

## What Was Built

Created the variations admin list page establishing the entry point for variation management. Admins can now browse variation groups, see entry/product counts, navigate to edit pages, and delete groups with confirmation for linked items.

## Implementation Details

### Files Created

**src/app/(admin)/admin/variations/page.jsx**
- Server component fetching variation groups via `getVariationGroups()`
- Passes data to client component for rendering
- Follows products list page pattern

**src/components/admin/VariationsListClient.jsx**
- Client component with search, table, and actions
- Search filters groups by name (client-side)
- Table shows: index, name, entry count, product count, actions
- Clickable rows navigate to edit page
- 3-dot menu with edit link and delete button
- Delete handler implements two-step flow: first call without force, show confirm dialog if warning returned, second call with force flag if confirmed

### Files Modified

**src/components/admin/AdminSidebar.jsx**
- Added `/admin/variations` to iconSidebar content paths array
- Added "ตัวเลือกสินค้า (Variations)" menu item to contentMenuItems after products entry

## Deviations from Plan

None - plan executed exactly as written.

## Verification Results

- Build passed with no errors
- Route `/admin/variations` appears in Next.js route table
- AdminSidebar.jsx contains `/admin/variations` in both iconSidebar paths and contentMenuItems
- VariationsListClient implements force-delete confirmation flow
- All three files follow existing codebase patterns (server component for page, client component for interactivity)

## Self-Check: PASSED

Files verified:
- FOUND: src/components/admin/AdminSidebar.jsx
- FOUND: src/app/(admin)/admin/variations/page.jsx
- FOUND: src/components/admin/VariationsListClient.jsx
- VERIFIED: /admin/variations in AdminSidebar.jsx
- VERIFIED: getVariationGroups import in page.jsx

Commits verified:
- FOUND: 2669c39 (feat(06-01): add variations list page with sidebar navigation)

## Next Steps

Continue to next plan in Phase 06:
- Plan 02: Variation create/edit pages with entry management UI
- Plan 03: Product variation selection interface in product edit page
