# Quick Task 11: Related Blog Posts — Replace Hardcoded Sidebar

## Problem
The "Blog ที่คล้ายกัน" sidebar in blog detail shows hardcoded fallback posts when real data is insufficient. The backend already fetches same-category posts but only returns up to 4 and doesn't backfill.

## Strategy for Related Posts
1. **Same category first** — posts sharing the same category slug, most recent first
2. **Backfill with recent posts** — if fewer than 4 same-category posts, fill remaining slots with the most recently published posts (any category)
3. **Never show hardcoded data** — if no posts exist at all, show nothing (hide section)

## Tasks

### Task 1: Improve `getPublishedBlogPost` related posts logic
**File:** `src/lib/data/public.js`

- After fetching same-category posts, check if count < 4
- If < 4, fetch additional recent posts (any category), excluding current post and already-fetched IDs
- Merge and return up to 4 total related posts

### Task 2: Remove hardcoded fallback from `BlogPostPageClient`
**File:** `src/app/(public)/blog/[id]/BlogPostPageClient.jsx`

- Remove `fallbackRelatedPosts` array and its image imports (imgCard1 used for fallback)
- Keep imgCard1 import only if used elsewhere (it is — for cover_image_url fallback)
- Use `dbRelated` directly, no fallback to hardcoded array
- Hide "Blog ที่คล้ายกัน" section entirely when `related.length === 0`

### Task 3: Build check
- Run `npm run build` to verify
