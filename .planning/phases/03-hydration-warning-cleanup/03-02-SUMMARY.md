---
phase: 03-hydration-warning-cleanup
plan: 02
subsystem: testing
tags:
  - test-coverage
  - hydration-fix-verification
  - drag-and-drop
  - vitest
  - testing-library
dependency_graph:
  requires:
    - 03-01-PLAN.md (DndContext hydration fix)
  provides:
    - Test coverage for all 5 ListClient components
    - Regression prevention for BUG-03
  affects:
    - CI/CD test suite
    - Future ListClient refactoring safety
tech_stack:
  added:
    - Vitest test files for ListClient components
  patterns:
    - console.error spy for hydration warning detection
    - Mock all external dependencies (next/navigation, actions, toast)
    - Test pattern: hydration warnings, drag handles, data display, empty state
key_files:
  created:
    - tests/components/banners-list-client.test.jsx
    - tests/components/video-highlights-list-client.test.jsx
    - tests/components/gallery-list-client.test.jsx
    - tests/components/manuals-list-client.test.jsx
    - tests/components/faq-list-client.test.jsx
  modified: []
decisions:
  - title: "FaqListClient toast-context exclusion"
    context: "FaqListClient does not import toast-context"
    decision: "Do not mock toast-context for FaqListClient tests"
    rationale: "Only mock dependencies that are actually imported"
    alternatives_considered:
      - Mock it anyway for consistency (rejected - creates false dependency)
  - title: "Use getByRole for ambiguous text queries"
    context: "GalleryListClient has 'แกลลอรี่' in both heading and table header"
    decision: "Use getByRole('heading', { name: /แกลลอรี่/ }) for header assertions"
    rationale: "More specific query prevents test flakiness from multiple matches"
    alternatives_considered:
      - Use getAllBy* and check index (rejected - fragile)
metrics:
  duration_minutes: 4
  completed_date: "2026-02-15"
  test_count_added: 20
  test_files_added: 5
  pre_existing_failures: 3
---

# Phase 3 Plan 2: ListClient Hydration Test Coverage Summary

**One-liner:** Added comprehensive test coverage for all 5 ListClient components to verify hydration fix and prevent BUG-03 regressions

## Objective Achieved

Added 20 test cases across 5 new test files to verify that the DndContext hydration fix (from 03-01) successfully eliminates console warnings and maintains drag-and-drop functionality.

## Tasks Completed

### Task 1: BannersListClient, VideoHighlightsListClient, GalleryListClient Tests
- Created `tests/components/banners-list-client.test.jsx` (4 tests)
- Created `tests/components/video-highlights-list-client.test.jsx` (4 tests)
- Created `tests/components/gallery-list-client.test.jsx` (4 tests)
- Fixed ambiguous text query for GalleryListClient using `getByRole`
- All 12 tests passing

### Task 2: ManualsListClient and FaqListClient Tests
- Created `tests/components/manuals-list-client.test.jsx` (4 tests)
- Created `tests/components/faq-list-client.test.jsx` (4 tests)
- Correctly excluded toast-context mock for FaqListClient
- All 8 tests passing

### Task 3: Full Test Suite and Production Build
- **Full test suite:** 393 passing, 3 failing (pre-existing validation failures in quotations.test.js)
- **New tests added:** 20 test cases across 5 files
- **Production build:** Successful with no errors
- **BUG-03 fully tested:** All affected components have dedicated test coverage

## Test Coverage Report

| Component | Test File | Tests | Status | Duration |
|-----------|-----------|-------|--------|----------|
| BannersListClient | `banners-list-client.test.jsx` | 4 | ✅ Pass | 103ms |
| VideoHighlightsListClient | `video-highlights-list-client.test.jsx` | 4 | ✅ Pass | 107ms |
| GalleryListClient | `gallery-list-client.test.jsx` | 4 | ✅ Pass | 175ms |
| ManualsListClient | `manuals-list-client.test.jsx` | 4 | ✅ Pass | 203ms |
| FaqListClient | `faq-list-client.test.jsx` | 4 | ✅ Pass | 181ms |

**Total:** 20 test cases, 100% passing

## Test Pattern Applied

Each test file follows the same 4-test pattern:

```javascript
describe('ComponentName', () => {
  // 1. Hydration verification
  it('renders without hydration warnings', () => {
    // Spy on console.error
    // Filter for Hydration/validateDOMNesting warnings
    // Assert zero warnings
  })

  // 2. Functional verification
  it('renders items with drag handles', () => {
    // Verify drag handles present via aria-label
  })

  // 3. Data display verification
  it('displays data correctly', () => {
    // Check headers, counts, status badges, titles/captions
  })

  // 4. Edge case verification
  it('renders empty state', () => {
    // Verify empty state message
  })
})
```

## Deviations from Plan

None - plan executed exactly as written.

## Performance Metrics

- **Plan duration:** 4 minutes
- **Test execution time:** ~770ms (all 5 files)
- **Build time:** 4.6s compilation
- **Final test count:** 393 passing (396 total, 3 pre-existing failures)

## Key Decisions

**1. FaqListClient toast-context exclusion**
- **Issue:** FaqListClient does not import `@/lib/toast-context`
- **Decision:** Do not mock toast-context for FaqListClient tests
- **Result:** Clean test with no false dependencies

**2. Ambiguous text query fix**
- **Issue:** GalleryListClient has "แกลลอรี่" in both `<h1>` and `<th>`, causing test failure
- **Fix:** Use `getByRole('heading', { name: /แกลลอรี่/ })` for specificity
- **Result:** Test passes reliably

## Verification Results

✅ All 20 new ListClient tests pass
✅ Each test verifies no hydration warnings via console.error spy
✅ Each test verifies drag handles are present (functional check)
✅ Each test includes empty state coverage
✅ Full test suite passes (393 tests, 3 pre-existing failures unchanged)
✅ Production build succeeds

## Impact

- **BUG-03 resolution:** Fully tested with 20 test cases
- **Regression prevention:** Future refactoring of ListClient components will catch hydration issues
- **CI/CD confidence:** Automated verification of drag-and-drop functionality
- **Test suite growth:** +20 test cases (+5% increase)

## Files Modified

### Created (5 files)
- `tests/components/banners-list-client.test.jsx` (89 lines, 4 tests)
- `tests/components/video-highlights-list-client.test.jsx` (98 lines, 4 tests)
- `tests/components/gallery-list-client.test.jsx` (90 lines, 4 tests)
- `tests/components/manuals-list-client.test.jsx` (92 lines, 4 tests)
- `tests/components/faq-list-client.test.jsx` (81 lines, 4 tests)

**Total lines added:** 450 lines of test code

## Related Plans

- **Depends on:** 03-01-PLAN.md (DndContext moved outside table in all 5 ListClient components)
- **Enables:** Future confident refactoring of ListClient components

## Self-Check: PASSED

✅ All created test files exist:
```bash
tests/components/banners-list-client.test.jsx - FOUND
tests/components/video-highlights-list-client.test.jsx - FOUND
tests/components/gallery-list-client.test.jsx - FOUND
tests/components/manuals-list-client.test.jsx - FOUND
tests/components/faq-list-client.test.jsx - FOUND
```

✅ All commits exist:
```bash
6761c42 - test(03-02): add hydration tests for BannersListClient, VideoHighlightsListClient, GalleryListClient - FOUND
f4b0791 - test(03-02): add hydration tests for ManualsListClient and FaqListClient - FOUND
```

✅ All tests pass (20/20)
✅ Production build succeeds
✅ No regressions introduced (existing test count maintained)
