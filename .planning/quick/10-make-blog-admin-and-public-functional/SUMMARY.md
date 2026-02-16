---
phase: quick-10
plan: 01
subsystem: blog
tags: [bugfix, admin, public, blog, category, search, date-picker]
dependency-graph:
  requires: []
  provides:
    - "Blog create form sends category to server"
    - "Blog edit form has category and publish date fields"
    - "Public blog category tabs match admin category values"
    - "Admin blog list search filters by title"
  affects:
    - src/app/(admin)/admin/blog/create/page.jsx
    - src/app/(admin)/admin/blog/edit/[id]/BlogEditClient.jsx
    - src/app/(public)/blog/BlogPageClient.jsx
    - src/components/admin/BlogListClient.jsx
tech-stack:
  added: []
  patterns:
    - "CATEGORY_LABELS lookup map for Thai display labels"
    - "Client-side search filtering before sort"
key-files:
  created: []
  modified:
    - src/app/(admin)/admin/blog/create/page.jsx
    - src/app/(admin)/admin/blog/edit/[id]/BlogEditClient.jsx
    - src/app/(public)/blog/BlogPageClient.jsx
    - src/components/admin/BlogListClient.jsx
decisions:
  - "Aligned category values to ideas/trend/style/knowledge across admin and public pages"
  - "Removed end-date pickers from create page (DB has single publish_date column)"
  - "Used CATEGORY_LABELS map for Thai display names on public blog cards"
metrics:
  duration: "5 min"
  completed: "2026-02-16"
  tasks: 5
  files-modified: 4
---

# Quick Task 10: Make Blog Admin and Public Functional - Summary

Fixed 6 bugs across 4 files that prevented blog admin and public pages from functioning correctly. Category now saves to database, edit page has category/date fields, public tabs filter correctly, and admin search works.

## What Was Done

### Task 1: Fix blog create page (commit: 60915ae)
- Added `formData.set('category', category)` so category is sent to server on submit
- Removed misleading end-date/time pickers (endDate, endTime, showEndCal, showEndTime state and JSX)
- Aligned category option values from news/knowledge/promotion/inspiration to ideas/trend/style/knowledge
- Updated section label from date range to single "วันที่เผยแพร่"
- Simplified clear button and picker toggle handlers

### Task 2: Add category and publish date to blog edit page (commit: 16e42f8)
- Added CalendarPicker and TimePickerDropdown imports
- Added CalendarIcon and ClockIcon SVG components
- Added category state initialized from `post.category`
- Added publishDate/publishTime states parsed from `post.publish_date`
- Added `formData.set('category', category)` and `formData.set('publish_date', pd)` to handleSubmit
- Added Category select section with matching option values
- Added Publish Date section with calendar and time pickers, pre-populated from existing data

### Task 3: Fix public blog page category display labels (commit: 51b8162)
- Added CATEGORY_LABELS map (ideas/trend/style/knowledge -> Thai labels)
- Updated allPosts mapping to use CATEGORY_LABELS for display while keeping raw categoryKey for filtering
- Public blog cards now show Thai category names instead of raw DB values

### Task 4: Fix admin blog list search (commit: 89c0dc6)
- Added filteredBlogs step that filters blogs by title using searchQuery before sorting
- Updated empty state message to show search-specific message when no results found

### Task 5: Build and test verification
- `npm run build` succeeded with no errors
- `npm test` showed 385 passed, 12 failed (all pre-existing validation schema failures, no new regressions)

## Deviations from Plan

None - plan executed exactly as written.

## Verification Results

1. Blog create page: category sent via FormData, no end-date pickers, category values aligned
2. Blog edit page: category select pre-populated from post data, publish date picker pre-populated, both sent on save
3. Public blog page: CATEGORY_LABELS map provides Thai display, categoryKey provides raw filtering
4. Admin blog list: search input filters displayed blogs by title in real-time
5. Build succeeds, no new test failures

## Self-Check: PASSED

All 4 modified files exist. All 4 task commits verified (60915ae, 16e42f8, 51b8162, 89c0dc6).
