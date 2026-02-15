---
phase: quick-4
plan: 01
subsystem: admin-branch-edit
tags: [bugfix, admin, ui]
dependency_graph:
  requires: []
  provides:
    - "Branch edit save button preserves publish status"
  affects:
    - "src/app/(admin)/admin/branch/edit/[id]/BranchEditClient.jsx"
tech_stack:
  added: []
  patterns: ["Status preservation via activeTab state"]
key_files:
  created: []
  modified:
    - "src/app/(admin)/admin/branch/edit/[id]/BranchEditClient.jsx"
decisions:
  - "Use activeTab state to determine publish status on save"
  - "Preserve existing behavior: Publish button forces published=true, Save button preserves current status"
metrics:
  duration: "30s"
  completed: "2026-02-15"
  tasks_completed: 1
  files_modified: 1
  commits: 1
---

# Quick Task 4: Fix Branch Edit Save Button to Preserve Publish Status

**One-liner:** Branch edit Save button now preserves current publish status (draft/published) instead of always demoting to draft.

## Overview

Fixed a bug where the "บันทึก" (Save) button in the branch edit form always set `published: false`, causing published branches to be demoted to draft status whenever admins saved edits. The Save button now preserves the current active tab status.

## What Was Done

### Task 1: Fix Save button to preserve publish status

**Status:** ✓ Complete

Changed line 289 in `BranchEditClient.jsx` from:
```jsx
onClick={() => handleSubmit(false)}
```

To:
```jsx
onClick={() => handleSubmit(activeTab === 'published')}
```

**How it works:**
- The `activeTab` state is initialized from `branch.published` (line 40)
- Users can switch between "draft" and "published" tabs to change status
- Save button now calls `handleSubmit(activeTab === 'published')`, which:
  - Saves as published if activeTab is 'published'
  - Saves as draft if activeTab is 'draft'
- Publish button (line 279) still correctly calls `handleSubmit(true)` to force publish

**Files modified:**
- `src/app/(admin)/admin/branch/edit/[id]/BranchEditClient.jsx` (1 line changed)

**Commit:** `a514d8e`

## Deviations from Plan

None - plan executed exactly as written.

## Key Decisions

1. **Use activeTab state for status preservation**: The `activeTab` state already tracks whether the branch is in "draft" or "published" mode. Using `activeTab === 'published'` is the cleanest way to preserve the current status.

2. **Preserve Publish button behavior**: The "เผยแพร่" (Publish) button continues to force `published: true` regardless of active tab, which is the correct UX for "publish now" action.

## Technical Notes

**Before:**
- Save button always called `handleSubmit(false)` → always set published to false
- Published branches would be demoted to draft on any edit

**After:**
- Save button calls `handleSubmit(activeTab === 'published')` → preserves status
- Draft branches stay draft, published branches stay published (unless user switches tabs)
- Publish button still forces publish (expected behavior)

## Verification

**Automated:**
- Code change confirmed in file (line 289 now has correct logic)
- Lint check attempted (pre-existing lint config issue unrelated to this change)

**Manual verification needed:**
1. Edit a published branch → make a change → click "บันทึก" → should remain published
2. Edit a draft branch → make a change → click "บันทึก" → should remain draft
3. Switch tabs before saving → status should match selected tab
4. Click "เผยแพร่" button → should always set to published

## Impact

**User-facing:**
- Admins can now edit published branches without accidentally demoting them to draft
- Expected "Save preserves status" behavior now matches standard CMS conventions

**Technical:**
- Minimal change (1 line)
- No breaking changes
- Uses existing state management pattern

## Files Changed

**Modified:**
- `src/app/(admin)/admin/branch/edit/[id]/BranchEditClient.jsx`
  - Line 289: Changed Save button onClick handler to preserve activeTab status

## Commits

| Hash | Message |
|------|---------|
| a514d8e | fix(quick-4): preserve publish status in branch edit save button |

## Self-Check

### File Existence
```bash
[ -f "C:/Users/commo/OneDrive/Documents/GitHub/woodsmith-ai/src/app/(admin)/admin/branch/edit/[id]/BranchEditClient.jsx" ] && echo "FOUND"
```

### Commit Existence
```bash
git log --oneline --all | grep -q "a514d8e" && echo "FOUND"
```

**Result:** PASSED - File modified and commit created successfully.

## Next Steps

Manual verification recommended:
1. Start dev server: `npm run dev`
2. Navigate to `/admin/branch`
3. Test save behavior on both draft and published branches
4. Verify tab switching updates status correctly
