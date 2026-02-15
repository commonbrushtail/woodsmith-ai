---
phase: 01-critical-bug-fixes
plan: 02
subsystem: admin-cms
tags: [bugfix, banner-management, file-upload, tdd, admin-ui]

dependency_graph:
  requires: []
  provides:
    - /admin/banner/create route
    - Banner creation workflow completion
  affects:
    - src/components/admin/BannersListClient.jsx (Create button now functional)

tech_stack:
  added: []
  patterns:
    - File upload with drag-and-drop UI
    - Image preview with replace/remove controls
    - FormData-based Server Action calls

key_files:
  created:
    - src/app/(admin)/admin/banner/create/page.jsx
    - tests/lib/actions/banners.test.js
  modified: []

decisions:
  - title: "Follow BannerEditClient file upload pattern"
    rationale: "Consistency across admin CMS - users expect same UX for banner creation/editing"
    alternatives: ["Text URL input field (simpler but inconsistent)"]
  - title: "Client-side validation requires image before save"
    rationale: "Prevent creating banners without images (UX/data quality)"
    alternatives: ["Server-side validation only", "Allow empty image_url"]

metrics:
  duration_minutes: 3
  tasks_completed: 4
  files_created: 2
  tests_added: 2
  completed_at: "2026-02-15T03:29:14Z"
---

# Phase 1 Plan 2: Fix Missing Banner Create Page

**One-liner:** Added /admin/banner/create page with file upload UI matching BannerEditClient pattern, completing banner CRUD workflow.

## Objective

Fix 404 error on `/admin/banner/create` route by creating missing banner create page. This unblocks admin banner management workflow - admins can now add new banners via CMS interface without database manipulation.

## What Was Built

### 1. Banner Create Page (`src/app/(admin)/admin/banner/create/page.jsx`)

**Client component with file upload pattern:**
- Drag-and-drop file upload area with dashed border and plus icon
- Image preview with replace/remove buttons
- Link URL text input field
- Right sidebar "Entry" panel with Publish/Save buttons
- Client-side validation: requires image before submission
- FormData submission to `createBanner` Server Action
- Redirects to `/admin/banner` after successful creation

**UI matches BannerEditClient:**
- Same SVG icons (PlusIcon, TrashIcon, ArrowLeftIcon, etc.)
- Same file upload validation using `validateFile`, `ALLOWED_IMAGE_TYPES`, `MAX_IMAGE_SIZE`
- Same image preview container styling (180px height, rounded corners)
- Same sidebar button styling (orange primary, white secondary)

**Key differences from edit page:**
- No initial banner data (all state starts empty/null)
- Calls `createBanner(formData)` instead of `updateBanner(id, formData)`
- No tab navigation (new banner has no draft/published history)
- "ใหม่" badge instead of status badge
- Title: "สร้างแบนเนอร์ใหม่" (Create new banner)

### 2. Test Coverage (`tests/lib/actions/banners.test.js`)

**Two test cases:**
1. **creates banner with image_url and link_url** - Verifies happy path creation with image and link
2. **handles missing image_url gracefully** - Edge case for empty image_url (server doesn't crash)

**Test structure:**
- Vitest with mocked Supabase admin client
- Mocked `revalidatePath` from `next/cache`
- Mocked storage functions (`uploadFile`, `deleteFile`, `getPublicUrl`)
- `createQueryChain` helper for fluent Supabase query mocking
- `fakeFormData` helper for FormData simulation

## TDD Cycle

**RED:** N/A - `createBanner` action already existed in `src/lib/actions/banners.js`

**GREEN:** Created page.jsx implementing file upload pattern. Tests pass immediately because action pre-exists.

**REFACTOR:** Added edge case test for empty image_url. Added client-side validation to improve UX (prevents submission without image).

## Verification Results

**Test suite:**
- 2/2 banner tests pass
- 347/350 total tests pass (3 pre-existing validation failures unrelated to this work)

**Production build:**
- Build succeeds in 5.1s
- Route `/admin/banner/create` appears in build output
- No compilation errors

**Navigation:**
- "Create new entry" button in BannersListClient already linked to `/admin/banner/create`
- Button now functional (no longer 404)

**Banner CRUD workflow complete:**
- List: `/admin/banner` ✓
- Create: `/admin/banner/create` ✓ (newly fixed)
- Edit: `/admin/banner/edit/[id]` ✓
- Delete: via list page action ✓

## Deviations from Plan

None - plan executed exactly as written. All 4 tasks completed:
1. Test coverage for createBanner action ✓
2. Banner create page following BannerEditClient pattern ✓
3. End-to-end workflow verification ✓
4. Edge case test for empty image_url ✓

## Impact

**Before:**
- Clicking "Create new entry" on banner list returned 404
- Admins had to manually insert banner records via database

**After:**
- Full banner creation workflow via CMS interface
- Consistent file upload UX across admin (matches edit page)
- Image preview with replace/remove controls
- Client-side validation prevents empty submissions

**Measurable success:**
1. New file created: `src/app/(admin)/admin/banner/create/page.jsx` (249 lines)
2. Test coverage: 2 tests for createBanner action
3. Build success: route appears in production build
4. Navigation fixed: 404 error eliminated
5. Workflow complete: banner CRUD now matches other admin resources

## Files Changed

**Created:**
- `src/app/(admin)/admin/banner/create/page.jsx` (249 lines) - Client component with file upload
- `tests/lib/actions/banners.test.js` (115 lines) - Test coverage for banner actions

**Modified:**
- None

## Commits

1. `aadb467` - test(01-02): add test coverage for createBanner action
2. `6b211cd` - feat(01-02): create banner create page with file upload

## Next Steps

None - bug fix complete. Banner management workflow now fully functional.

## Self-Check: PASSED

**Created files verification:**
```bash
[FOUND] src/app/(admin)/admin/banner/create/page.jsx
[FOUND] tests/lib/actions/banners.test.js
```

**Commits verification:**
```bash
[FOUND] aadb467 - test(01-02): add test coverage for createBanner action
[FOUND] 6b211cd - feat(01-02): create banner create page with file upload
```

**Route verification:**
```bash
[FOUND] /admin/banner/create in build output
```

All claims verified. Summary accurate.
