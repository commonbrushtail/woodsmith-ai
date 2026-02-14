# Roadmap: WoodSmith AI - Bug Fix Milestone

## Overview

This milestone stabilizes the existing codebase by resolving 5 runtime bugs discovered during Chrome DevTools audit. The bugs stem from React 19's stricter SSR/hydration checks and library integration patterns. All fixes follow TDD methodology (write failing test, implement fix, verify green). The journey moves from critical workflow blockers to cosmetic issues to technical debt, ensuring the admin CMS and public site function cleanly without console warnings or crashes.

## Phases

**Phase Numbering:**
- Integer phases (1, 2, 3): Planned milestone work
- Decimal phases (2.1, 2.2): Urgent insertions (marked with INSERTED)

Decimal phases appear between their surrounding integers in numeric order.

- [ ] **Phase 1: Critical Bug Fixes** - Unblock admin workflows (TipTap SSR crash, missing Banner create page)
- [ ] **Phase 2: Cosmetic Bug Fixes** - Polish UI display issues (Profile HTML tags, Gallery order off-by-one)
- [ ] **Phase 3: Hydration Warning Cleanup** - Eliminate dnd-kit React hydration mismatches on 5 sortable list pages

## Phase Details

### Phase 1: Critical Bug Fixes
**Goal**: Admin users can manage all content types without crashes or 404 errors
**Depends on**: Nothing (first phase)
**Requirements**: BUG-01, BUG-02, TEST-01, TEST-02, TEST-03, TEST-04, TEST-05
**Success Criteria** (what must be TRUE):
  1. Admin can create/edit blog posts, product descriptions, and About Us content using TipTap without SSR crashes
  2. Admin can navigate to `/admin/banner/create` and successfully create new banners
  3. All 5 affected admin pages (about-us, blog create/edit, products create/edit, banner create) load without errors
  4. All existing 202 tests still pass after fixes (no regressions)
  5. Production build succeeds (`npm run build`) after fixes
**Plans**: TBD

Plans:
- [ ] 01-01: TBD during plan-phase
- [ ] 01-02: TBD during plan-phase

### Phase 2: Cosmetic Bug Fixes
**Goal**: Admin UI displays content correctly without raw HTML or confusing numbering
**Depends on**: Phase 1
**Requirements**: BUG-04, BUG-05, TEST-01, TEST-02, TEST-03, TEST-04, TEST-05
**Success Criteria** (what must be TRUE):
  1. Admin profile page displays company name as plain text (no visible `<p>` tags)
  2. Gallery list displays sort order starting from 1 (user-friendly numbering)
  3. HTML stripping works correctly for edge cases (nested tags, self-closing tags, entities)
  4. All existing tests still pass after fixes
  5. Production build succeeds after fixes
**Plans**: TBD

Plans:
- [ ] 02-01: TBD during plan-phase
- [ ] 02-02: TBD during plan-phase

### Phase 3: Hydration Warning Cleanup
**Goal**: All admin sortable list pages render cleanly without React hydration mismatches
**Depends on**: Phase 2
**Requirements**: BUG-03, TEST-01, TEST-02, TEST-03, TEST-04, TEST-05
**Success Criteria** (what must be TRUE):
  1. All 5 sortable list pages (banner, video-highlight, gallery, FAQ, manual) load without console hydration warnings
  2. Drag-and-drop reordering still works correctly on all 5 pages after restructure
  3. Responsive layouts (mobile/desktop) display correctly after moving DndContext wrappers
  4. All existing tests still pass after dnd-kit component refactoring
  5. Production build succeeds after fixes
**Plans**: TBD

Plans:
- [ ] 03-01: TBD during plan-phase

## Progress

**Execution Order:**
Phases execute in numeric order: 1 → 2 → 3

| Phase | Plans Complete | Status | Completed |
|-------|----------------|--------|-----------|
| 1. Critical Bug Fixes | 0/TBD | Not started | - |
| 2. Cosmetic Bug Fixes | 0/TBD | Not started | - |
| 3. Hydration Warning Cleanup | 0/TBD | Not started | - |

---
*Roadmap created: 2026-02-15*
*Milestone: Bug Fix Milestone*
