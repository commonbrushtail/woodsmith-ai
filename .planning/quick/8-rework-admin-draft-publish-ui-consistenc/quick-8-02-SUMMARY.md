---
phase: quick-8
plan: 02
subsystem: admin-ui
tags: [ui-consistency, tab-removal, bug-fix, sidebar]
dependency_graph:
  requires: []
  provides: [products-sidebar-fixed, banner-status-sidebar, about-us-clean-sidebar, profile-clean-sidebar]
  affects: [admin-products, admin-banner, admin-about-us, admin-profile]
tech_stack:
  added: []
  patterns: [status-indicator-sidebar, explicit-publish-buttons]
key_files:
  created: []
  modified:
    - src/app/(admin)/admin/products/create/ProductCreateClient.jsx
    - src/app/(admin)/admin/products/edit/[id]/ProductEditClient.jsx
    - src/app/(admin)/admin/banner/edit/[id]/BannerEditClient.jsx
    - src/app/(admin)/admin/about-us/page.jsx
    - src/app/(admin)/admin/profile/page.jsx
decisions:
  - Products publish button now explicitly calls handleSubmit(true) instead of depending on activeTab
  - Banner sidebar uses Thai labels 'ใช้งาน'/'ไม่ใช้งาน' for status indicator
  - About Us dots menu button removed from sidebar (served no function)
  - Profile save button simplified to handleSubmit() with no args
metrics:
  duration: 3 min
  completed: 2026-02-16
---

# Phase quick-8 Plan 02: Special Admin Pages Tab Removal Summary

Removed DRAFT/PUBLISHED tab bars from 5 special admin pages and fixed the activeTab-dependent publish bug in Products create/edit, with pattern-specific sidebar updates for each page.

## Tasks Completed

### Task 1: Fix Products create/edit -- remove tabs, fix activeTab bug in sidebar
**Commit:** `9d9d132`

- Removed `activeTab` state, `tabs` array, and tab bar JSX from both ProductCreateClient and ProductEditClient
- **Bug fix:** Primary sidebar button was `handleSubmit(activeTab === 'published')` -- when on DRAFT tab (default for create), clicking "save" would always save as draft even though the button appeared to be the primary action. Now explicitly calls `handleSubmit(true)` for publish
- Added status indicator: static "draft" on create page, dynamic based on `product.published` on edit page
- Renamed publish button label from "บันทึก" to "เผยแพร่"

### Task 2: Update Banner edit, About Us, and Profile
**Commit:** `993af93`

- **Banner:** Removed tab bar, added status indicator using `banner.status` field with Thai labels "ใช้งาน"/"ไม่ใช้งาน", buttons call `handleSave(true)`/`handleSave(false)`
- **About Us:** Removed tab bar and `activeTab` state, removed non-functional dots menu button from sidebar, kept single "บันทึก" button
- **Profile:** Removed tab bar and `activeTab` state, simplified save button to `handleSubmit()` (no publish arg needed)

## Deviations from Plan

None -- plan executed exactly as written.

## Observations

- BranchEditClient.jsx has the same `handleSubmit(activeTab === 'published')` bug pattern found in Products. This file was not in scope for this plan but should be addressed in a future task.

## Self-Check: PASSED

All 5 modified files verified present. Both task commits (9d9d132, 993af93) confirmed in git log.
