---
phase: quick-8
plan: 01
subsystem: ui
tags: [admin, sidebar, publish, draft, consistency]

# Dependency graph
requires: []
provides:
  - "Consistent sidebar UI across 10 admin create/edit pages (blog, branch, manual, video-highlight, faq)"
  - "Status indicator pattern (gray dot for draft, green dot for published)"
  - "Standardized publish/draft button wording"
affects: [admin-ui, content-management]

# Tech tracking
tech-stack:
  added: []
  patterns:
    - "Admin sidebar status indicator with colored dot + text"
    - "Create pages always show static draft status"
    - "Edit pages derive status from entity.published prop"

key-files:
  created: []
  modified:
    - "src/app/(admin)/admin/blog/create/page.jsx"
    - "src/app/(admin)/admin/blog/edit/[id]/BlogEditClient.jsx"
    - "src/app/(admin)/admin/branch/create/page.jsx"
    - "src/app/(admin)/admin/branch/edit/[id]/BranchEditClient.jsx"
    - "src/app/(admin)/admin/manual/create/page.jsx"
    - "src/app/(admin)/admin/manual/edit/[id]/ManualEditClient.jsx"
    - "src/app/(admin)/admin/video-highlight/create/page.jsx"
    - "src/app/(admin)/admin/video-highlight/edit/[id]/VideoHighlightEditClient.jsx"
    - "src/app/(admin)/admin/faq/create/page.jsx"
    - "src/app/(admin)/admin/faq/edit/[id]/FaqEditClient.jsx"

key-decisions:
  - "Used highlight prop name for VideoHighlightEditClient (not video as plan suggested) to match actual component signature"
  - "BranchEditClient buggy handleSubmit(activeTab === 'published') fixed to handleSubmit(false)"

patterns-established:
  - "Admin sidebar pattern: Entry heading + status dot + status text + publish button + draft button"
  - "Create pages: static gray dot with 'สถานะ: ฉบับร่าง'"
  - "Edit pages: dynamic dot color/text from entity.published"

# Metrics
duration: 4min
completed: 2026-02-16
---

# Quick-8 Plan 01: Standard Admin Pages Tab Removal + Status Sidebar

**Removed DRAFT/PUBLISHED tab bar from 10 admin pages and added consistent sidebar with status indicator, publish, and save-as-draft buttons**

## Performance

- **Duration:** 4 min
- **Tasks:** 2
- **Files modified:** 10

## Accomplishments
- Removed non-functional DRAFT/PUBLISHED tab bar from all 10 standard admin create/edit pages
- Added consistent status indicator (colored dot + Thai text) in the sidebar across all pages
- Standardized button wording: "เผยแพร่" for publish, "บันทึกฉบับร่าง" for save as draft
- Fixed BranchEditClient bug where secondary button used removed `activeTab` variable

## Task Commits

Each task was committed atomically:

1. **Task 1: Update 5 create pages** - `5d49cff` (feat)
2. **Task 2: Update 5 edit pages** - `1b4e0d2` (feat)

## Files Created/Modified
- `src/app/(admin)/admin/blog/create/page.jsx` - Removed tabs, added static draft status sidebar
- `src/app/(admin)/admin/blog/edit/[id]/BlogEditClient.jsx` - Removed tabs, added dynamic status sidebar (post.published)
- `src/app/(admin)/admin/branch/create/page.jsx` - Removed tabs, added static draft status sidebar
- `src/app/(admin)/admin/branch/edit/[id]/BranchEditClient.jsx` - Removed tabs, fixed activeTab bug, added dynamic status sidebar (branch.published)
- `src/app/(admin)/admin/manual/create/page.jsx` - Removed tabs, added static draft status sidebar
- `src/app/(admin)/admin/manual/edit/[id]/ManualEditClient.jsx` - Removed tabs, added dynamic status sidebar (manual.published)
- `src/app/(admin)/admin/video-highlight/create/page.jsx` - Removed tabs, added static draft status sidebar
- `src/app/(admin)/admin/video-highlight/edit/[id]/VideoHighlightEditClient.jsx` - Removed tabs, added dynamic status sidebar (highlight.published)
- `src/app/(admin)/admin/faq/create/page.jsx` - Removed tabs, added static draft status sidebar
- `src/app/(admin)/admin/faq/edit/[id]/FaqEditClient.jsx` - Removed tabs, added dynamic status sidebar (faq.published)

## Decisions Made
- Used `highlight` prop name for VideoHighlightEditClient (actual component signature) instead of `video` as plan suggested
- Fixed BranchEditClient `handleSubmit(activeTab === 'published')` bug as part of tab removal (would have caused runtime error)

## Deviations from Plan

### Auto-fixed Issues

**1. [Rule 1 - Bug] Fixed BranchEditClient secondary button using removed variable**
- **Found during:** Task 2 (Edit pages update)
- **Issue:** BranchEditClient secondary button called `handleSubmit(activeTab === 'published')` but `activeTab` was being removed
- **Fix:** Changed to `handleSubmit(false)` explicitly
- **Files modified:** src/app/(admin)/admin/branch/edit/[id]/BranchEditClient.jsx
- **Verification:** Grep confirms exactly 1 `handleSubmit(false)` in file
- **Committed in:** 1b4e0d2 (Task 2 commit)

**2. [Rule 1 - Bug] Used correct prop name for VideoHighlightEditClient**
- **Found during:** Task 2 (Edit pages update)
- **Issue:** Plan specified `video.published` but actual component prop is `highlight`
- **Fix:** Used `highlight.published` instead of `video.published`
- **Files modified:** src/app/(admin)/admin/video-highlight/edit/[id]/VideoHighlightEditClient.jsx
- **Verification:** Grep confirms `highlight.published` in status indicator
- **Committed in:** 1b4e0d2 (Task 2 commit)

---

**Total deviations:** 2 auto-fixed (2 bug fixes)
**Impact on plan:** Both auto-fixes necessary for correctness. No scope creep.

## Issues Encountered
None

## User Setup Required
None - no external service configuration required.

## Next Phase Readiness
- All 10 standard admin pages now have consistent sidebar UI
- Plan 02 (special admin pages) handles the remaining 5 pages separately

## Self-Check: PASSED

- All 10 modified files exist on disk
- Commit 5d49cff (Task 1) found in git log
- Commit 1b4e0d2 (Task 2) found in git log

---
*Plan: quick-8-01*
*Completed: 2026-02-16*
