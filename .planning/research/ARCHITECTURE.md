# Architecture Analysis — Phase 6 Bug Fixes

**Project:** WoodSmith AI
**Milestone:** Phase 6 — Runtime Bug Fixes
**Date:** 2026-02-15
**Analyzed by:** GSD Project Researcher

---

## Executive Summary

This document maps the architectural boundaries and data flow impacts for 5 runtime bugs discovered in the WoodSmith AI Next.js 16 App Router application. Each fix touches different layers of the server/client component boundary, requiring careful consideration of Next.js SSR behavior, hydration, and data flow patterns.

**Key architectural constraints:**
- Strict route group separation: `(public)` vs `(admin)` layouts
- Server Components (data fetching) → Client Components (interactivity) boundary
- Server Actions handle all mutations
- ErrorBoundary wraps all admin pages
- Middleware → Route Groups → Server Components → Client Components → Server Actions pipeline

---

## 1. Component Boundaries (Server/Client Split)

### 1.1 TipTap SSR Fix

**Current Architecture:**
```
Server Component (page.jsx)
  └─ Client Component (BlogEditClient.jsx) ← 'use client'
       └─ Client Component (RichTextEditor.jsx) ← 'use client' + useEditor hook
            └─ TipTap useEditor (CRASHES without immediatelyRender: false)
```

**Server/Client Boundary:**
- `src/app/(admin)/admin/blog/edit/[id]/page.jsx` — **Server Component** (fetches data via `getBlogPost()`)
- `src/app/(admin)/admin/blog/edit/[id]/BlogEditClient.jsx` — **Client Component** (state + form)
- `src/components/admin/RichTextEditor.jsx` — **Client Component** (TipTap integration)

**Impact:**
- TipTap's `useEditor` hook runs on **both server (SSR) and client (hydration)**
- Without `immediatelyRender: false`, TipTap attempts to render during SSR, causing:
  - Server-side crash (no DOM available)
  - ErrorBoundary catches it but page is unusable
  - Affects 5 admin pages: about-us, blog create/edit, products create/edit

**Data Flow:**
1. Server Component fetches initial `post.content` (HTML string) from Supabase
2. Props passed to Client Component
3. Client Component initializes TipTap with `content` prop
4. **Bug**: TipTap renders during SSR → crashes
5. **Fix**: Add `immediatelyRender: false` to defer rendering until client hydration

**Why This Boundary Matters:**
- TipTap is **client-only** (requires `window`, `document`)
- Must be wrapped in Client Component with `'use client'`
- Cannot be rendered during SSR without `immediatelyRender: false` option

**Files Touched:**
- `src/components/admin/RichTextEditor.jsx` (add config option)

---

### 1.2 dnd-kit Hydration Fix

**Current Architecture:**
```
Server Component (page.jsx)
  └─ Client Component (GalleryListClient.jsx) ← 'use client'
       └─ <table> ← DOM structure
            └─ DndContext + SortableContext ← renders <div> inside <table>
                 └─ SortableRow (<tr>) ← dnd-kit accessibility text causes hydration mismatch
```

**Server/Client Boundary:**
- `src/app/(admin)/admin/gallery/page.jsx` — **Server Component** (fetches gallery items)
- `src/components/admin/GalleryListClient.jsx` — **Client Component** (drag-drop list)
- `src/components/admin/SortableList.jsx` — **Reusable Client Component** (dnd-kit wrapper)

**Impact:**
- dnd-kit injects `<div>` elements (screen reader announcements) during SSR
- These `<div>` elements are placed **inside `<table>`**, violating HTML spec
- React hydration detects mismatch: server HTML ≠ client HTML
- **Result**: Console errors on 5 list pages (banner, video-highlight, gallery, FAQ, manual)
- Functional but noisy (hydration warnings)

**Data Flow:**
1. Server Component fetches gallery items from Supabase
2. Props passed to Client Component (`GalleryListClient`)
3. Client Component renders `<table>` with inline dnd-kit logic
4. **Bug**: `DndContext` renders inside `<tbody>`, injecting `<div>` → hydration mismatch
5. **Fix Options**:
   - **Option A**: Move `DndContext`/`SortableContext` **outside** `<table>` (restructure layout)
   - **Option B**: Use `SortableList.jsx` wrapper (already exists, cleaner API)
   - **Option C**: Suppress hydration warnings (not recommended)

**Why This Boundary Matters:**
- dnd-kit is **client-only** (requires `'use client'`)
- SSR renders HTML structure **once**, client hydration **must match exactly**
- Invalid HTML structure (`<div>` in `<table>`) breaks hydration contract

**Files Touched:**
- `src/components/admin/GalleryListClient.jsx` (refactor table structure)
- `src/components/admin/BannersListClient.jsx` (same issue)
- `src/components/admin/VideoHighlightsListClient.jsx` (same issue)
- `src/components/admin/FaqListClient.jsx` (same issue)
- `src/components/admin/ManualsListClient.jsx` (same issue)
- Alternatively: use existing `src/components/admin/SortableList.jsx` (cleaner)

---

### 1.3 Banner Create Page (Missing)

**Expected Architecture:**
```
Server Component (banner/create/page.jsx) ← DOES NOT EXIST
  └─ Client Component (BannerCreateClient.jsx or inline) ← DOES NOT EXIST
```

**Existing Pattern (for reference):**
```
Server Component (faq/create/page.jsx) ← Client Component marked 'use client'
  ├─ useState (form state)
  ├─ useTransition (loading state)
  └─ Server Action call (createFaq)
```

**Server/Client Boundary:**
- **Should be**: Simple Client Component page (no data fetching needed)
- Follows pattern from `src/app/(admin)/admin/faq/create/page.jsx` (direct `'use client'` page)
- Calls `createBanner()` Server Action from `src/lib/actions/banners.js`

**Impact:**
- Missing page causes 404 on `/admin/banner/create`
- "Create new entry" link on banner list page is broken

**Data Flow:**
1. User navigates to `/admin/banner/create`
2. **Bug**: 404 (page does not exist)
3. **Fix**: Create page following `faq/create/page.jsx` pattern
4. Page renders form → user submits → calls `createBanner()` Server Action → redirects to list

**Why This Boundary Matters:**
- Create pages are **pure Client Components** (no data fetching)
- Marked with `'use client'` at top of file
- Call Server Actions for mutations
- Follow admin form pattern: header + tabs + form fields + sidebar

**Files to Create:**
- `src/app/(admin)/admin/banner/create/page.jsx` (new file)

---

### 1.4 Profile Raw HTML Display

**Current Architecture:**
```
Server Component (profile/page.jsx) ← Actually Client Component 'use client'
  ├─ useEffect ← fetches company profile via getCompanyProfile()
  ├─ useState ← stores companyName field
  └─ <input value={companyName} /> ← displays "<p>Company</p>" as plain text
```

**Server/Client Boundary:**
- `src/app/(admin)/admin/profile/page.jsx` — **Client Component** (marked `'use client'`)
- Fetches data via `getCompanyProfile()` Server Action
- **Bug**: `companyName` contains HTML tags (`<p>Company Name</p>`), displayed raw in text input

**Impact:**
- Admin sees literal HTML tags in profile input field
- User experience issue (not a crash)

**Data Flow:**
1. Client Component mounts → calls `getCompanyProfile()` Server Action
2. Server Action returns `data.companyName` (may contain HTML from TipTap editor)
3. **Bug**: HTML stored in DB, displayed raw in `<input type="text">`
4. **Fix Options**:
   - **Option A**: Strip HTML tags before display (use `sanitizeHtml()` or regex)
   - **Option B**: Switch input to `RichTextEditor` (overkill for single-line field)
   - **Option C**: Store plain text in DB (requires migration + server action update)

**Why This Boundary Matters:**
- Data sanitization can happen at **3 layers**:
  1. **Server Action** (before DB write) — prevents HTML from being stored
  2. **Server Component** (after DB read) — strips HTML before passing to client
  3. **Client Component** (before display) — strips HTML in useEffect
- **Best practice**: Sanitize at **Server Action** layer (source of truth)

**Files Touched:**
- `src/lib/actions/profile.js` (strip HTML before saving)
- OR `src/app/(admin)/admin/profile/page.jsx` (strip HTML before setState)

---

### 1.5 Gallery Order Off-by-One

**Current Architecture:**
```
Server Component (gallery/page.jsx)
  └─ Client Component (GalleryListClient.jsx)
       └─ <table> (displays sort_order as-is from DB)
            └─ DB stores sort_order = 0, 1, 2, 3...
                 └─ UI displays "0" instead of "1" ← off-by-one
```

**Server/Client Boundary:**
- `src/app/(admin)/admin/gallery/page.jsx` — **Server Component** (fetches gallery items)
- `src/components/admin/GalleryListClient.jsx` — **Client Component** (renders table)

**Impact:**
- Gallery list shows first item as "Order: 0" instead of "Order: 1"
- Visual inconsistency (internal indexing vs user-facing display)

**Data Flow:**
1. Server Component fetches gallery items: `sort_order` values are `0, 1, 2, 3...`
2. Props passed to Client Component
3. Client Component renders `<td>{item.sort_order}</td>`
4. **Bug**: Zero-indexed DB value displayed to user
5. **Fix**: Display `{item.sort_order + 1}` or `{index + 1}` in UI

**Why This Boundary Matters:**
- **DB layer** uses zero-indexed `sort_order` (standard practice)
- **UI layer** should display one-indexed values (user-friendly)
- Transformation happens at **Client Component** (display layer)
- Does NOT affect `buildSortOrderUpdates()` (reorder logic still zero-indexed)

**Files Touched:**
- `src/components/admin/GalleryListClient.jsx` (display transformation)
- Potentially other list pages if same pattern exists

---

## 2. Data Flow Impact

### 2.1 Mutation Pipeline

**Standard Admin Mutation Flow:**
```
Client Component (form)
  → useTransition (loading state)
  → Server Action call (e.g., createBlogPost, updateProduct)
  → Supabase mutation (INSERT/UPDATE/DELETE)
  → RLS check (admin role required)
  → Audit log (if critical action)
  → Return { data, error, fieldErrors }
  → Client Component handles response
  → router.refresh() (revalidate server components)
  → router.push('/admin/...) (redirect to list)
```

**Affected by Fixes:**
- **TipTap fix**: No impact on mutation flow (client-only rendering fix)
- **dnd-kit fix**: No impact on mutation flow (hydration fix)
- **Banner create**: Adds new mutation flow (missing)
- **Profile HTML**: Impacts `updateCompanyProfile()` Server Action (add HTML stripping)
- **Gallery order**: No impact on mutation flow (display-only fix)

---

### 2.2 Data Fetching Pipeline

**Standard Admin Data Flow:**
```
Server Component (page.jsx)
  → Server Action (e.g., getBlogPost, getGalleryItems)
  → Supabase query (SELECT with RLS)
  → Return { data, error }
  → Server Component passes data as props
  → Client Component receives props
  → Client Component renders UI
```

**Affected by Fixes:**
- **TipTap fix**: Impacts how `content` prop is rendered (deferred to client)
- **dnd-kit fix**: No impact on data fetching (client-side hydration fix)
- **Banner create**: No data fetching (create page is empty form)
- **Profile HTML**: Impacts `getCompanyProfile()` (may need HTML stripping)
- **Gallery order**: Impacts display transformation (no DB change)

---

### 2.3 Reorder Utility Chain

**Drag-and-Drop Reorder Flow:**
```
Client Component (GalleryListClient)
  → DndContext onDragEnd handler
  → arrayMove (dnd-kit utility)
  → buildSortOrderUpdates (src/lib/reorder.js)
  → reorderGalleryItems Server Action
  → Supabase batch UPDATE (set sort_order for each item)
  → router.refresh() (revalidate list)
```

**Impact of dnd-kit Fix:**
- Hydration fix does NOT change reorder logic
- `buildSortOrderUpdates()` still returns zero-indexed `sort_order` values
- Gallery order fix changes **display only**, not underlying data

**Files in Reorder Chain:**
- `src/lib/reorder.js` — pure functions (no changes needed)
- `src/lib/actions/gallery.js` — `reorderGalleryItems()` Server Action (no changes needed)
- `src/components/admin/GalleryListClient.jsx` — drag handlers + display (hydration + display fixes)

---

## 3. Dependency Order (Build Sequence)

### 3.1 Independent Fixes (Parallel)

Can be fixed in **any order** without dependencies:

1. **TipTap SSR fix** (single-file change, isolated)
2. **Banner create page** (new file, no dependencies)
3. **Profile HTML fix** (single Server Action change)
4. **Gallery order fix** (single display transformation)

---

### 3.2 Dependent Fixes (Sequential)

**dnd-kit hydration fix** should be done **after** examining reorder chain:
- Verify `buildSortOrderUpdates()` still works correctly
- Verify gallery order display doesn't break drag-drop
- Test all 5 list pages (banner, video, gallery, FAQ, manual)

**Recommended Order:**
1. **TipTap SSR fix** (critical — blocks 5 admin pages)
2. **Banner create page** (critical — 404 error)
3. **Gallery order fix** (low priority, cosmetic)
4. **Profile HTML fix** (low priority, cosmetic)
5. **dnd-kit hydration fix** (medium priority, functional but noisy)

---

## 4. Testing Strategy

### 4.1 TipTap Fix Verification

**Test Cases:**
- [ ] Navigate to `/admin/blog/create` → RichTextEditor renders without crash
- [ ] Navigate to `/admin/blog/edit/[id]` → content loads correctly
- [ ] Navigate to `/admin/products/create` → RichTextEditor renders
- [ ] Navigate to `/admin/products/edit/[id]` → content loads correctly
- [ ] Navigate to `/admin/about-us` → RichTextEditor renders
- [ ] Open Chrome DevTools → no console errors
- [ ] Type in editor → changes reflected in form state
- [ ] Submit form → HTML saved to DB correctly

**Affected Pages:**
- `/admin/blog/create`
- `/admin/blog/edit/[id]`
- `/admin/products/create`
- `/admin/products/edit/[id]`
- `/admin/about-us`

---

### 4.2 dnd-kit Fix Verification

**Test Cases:**
- [ ] Navigate to `/admin/gallery` → no hydration warnings in console
- [ ] Navigate to `/admin/banner` → no hydration warnings
- [ ] Navigate to `/admin/video-highlight` → no hydration warnings
- [ ] Navigate to `/admin/faq` → no hydration warnings
- [ ] Navigate to `/admin/manual` → no hydration warnings
- [ ] Drag-drop item in gallery list → order updates correctly
- [ ] Check DB → `sort_order` values updated correctly
- [ ] Refresh page → order persists

**Affected Pages:**
- `/admin/gallery` (uses dnd-kit)
- `/admin/banner` (uses dnd-kit)
- `/admin/video-highlight` (uses dnd-kit)
- `/admin/faq` (uses dnd-kit)
- `/admin/manual` (uses dnd-kit)

---

### 4.3 Banner Create Page Verification

**Test Cases:**
- [ ] Navigate to `/admin/banner` → click "Create new entry" → page loads (no 404)
- [ ] Fill form → submit → banner created in DB
- [ ] Check `/admin/banner` list → new banner appears
- [ ] Check Supabase `banners` table → row inserted with correct `sort_order`

---

### 4.4 Profile HTML Fix Verification

**Test Cases:**
- [ ] Navigate to `/admin/profile` → company name field shows plain text (no `<p>` tags)
- [ ] Edit company name → save → check DB → no HTML tags stored
- [ ] Reload page → company name displays correctly

---

### 4.5 Gallery Order Fix Verification

**Test Cases:**
- [ ] Navigate to `/admin/gallery` → first item shows "Order: 1" (not "0")
- [ ] Drag-drop to reorder → order numbers update correctly
- [ ] Check DB → `sort_order` still zero-indexed (0, 1, 2, 3...)
- [ ] UI displays one-indexed (1, 2, 3, 4...)

---

## 5. Architecture Patterns (Reference)

### 5.1 Admin Page Patterns

**Edit Page (Server + Client):**
```jsx
// src/app/(admin)/admin/blog/edit/[id]/page.jsx (Server Component)
import { notFound } from 'next/navigation'
import { getBlogPost } from '@/lib/actions/blog'
import BlogEditClient from './BlogEditClient'

export default async function BlogEditPage({ params }) {
  const { id } = await params
  const { data: post, error } = await getBlogPost(id)
  if (error || !post) notFound()
  return <BlogEditClient post={post} />
}
```

**Create Page (Client Only):**
```jsx
// src/app/(admin)/admin/faq/create/page.jsx (Client Component)
'use client'

import { useState, useTransition } from 'react'
import { useRouter } from 'next/navigation'
import { createFaq } from '@/lib/actions/faqs'
import { useToast } from '@/lib/toast-context'

export default function FaqCreatePage() {
  const { toast } = useToast()
  const router = useRouter()
  const [isPending, startTransition] = useTransition()
  // ... form state ...

  const handleSubmit = () => {
    startTransition(async () => {
      const formData = new FormData()
      // ... build formData ...
      const result = await createFaq(formData)
      if (result.error) {
        toast.error('เกิดข้อผิดพลาด: ' + result.error)
      } else {
        router.push('/admin/faq')
        router.refresh()
      }
    })
  }

  return (
    <div className={isPending ? 'opacity-60 pointer-events-none' : ''}>
      {/* ... form UI ... */}
    </div>
  )
}
```

---

### 5.2 Layout Hierarchy

```
Root Layout (src/app/layout.jsx)
  ├─ <html>, <head>, <body> only
  ├─ Fonts loaded via <link>
  └─ Providers (ToastProvider)
       │
       ├─ (public) Route Group
       │   └─ Public Layout (TopBar, Navbar, Footer, LineFAB)
       │        └─ Page (Server Component or Client Component)
       │
       └─ (admin) Route Group
           └─ Admin Layout (Sidebar + ErrorBoundary)
                └─ Page (Server Component or Client Component)
```

**Rules:**
- Root layout is **minimal** (html/head/body only)
- Route group layouts **never** include `<html>`, `<head>`, or `<body>` (hydration errors)
- Admin pages wrapped in ErrorBoundary (catches TipTap crashes)

---

## 6. Key Files Reference

### 6.1 TipTap Integration

- `src/components/admin/RichTextEditor.jsx` — TipTap wrapper (needs `immediatelyRender: false`)
- `src/lib/sanitize-html.js` — HTML sanitizer (used on output)
- `src/components/SafeHtmlContent.jsx` — XSS-safe rendering (public pages)

### 6.2 dnd-kit Integration

- `src/components/admin/SortableList.jsx` — Reusable dnd-kit wrapper (cleaner API)
- `src/lib/reorder.js` — Reorder utilities (`buildSortOrderUpdates`)
- `src/components/admin/*ListClient.jsx` — 5 list pages with inline dnd-kit

### 6.3 Server Actions (Mutations)

- `src/lib/actions/banners.js` — Banner CRUD (missing `createBanner` form page)
- `src/lib/actions/profile.js` — Profile update (needs HTML stripping)
- `src/lib/actions/gallery.js` — Gallery reorder (works correctly)

### 6.4 Middleware & Auth

- `middleware.js` — Session refresh + route protection
- `src/lib/auth/route-rules.js` — Route access rules (admin vs customer)

---

## 7. Conclusion

All 5 bugs are **isolated fixes** with **minimal cross-dependencies**:

1. **TipTap SSR fix**: Single config option (`immediatelyRender: false`)
2. **dnd-kit hydration fix**: Refactor table structure or use `SortableList.jsx`
3. **Banner create page**: New file following existing pattern
4. **Profile HTML fix**: Strip HTML in Server Action or client display
5. **Gallery order fix**: Add `+1` transformation in display layer

**Recommended build order**: TipTap → Banner create → Gallery order → Profile HTML → dnd-kit

**Total effort**: ~2-4 hours for all fixes + testing

---

## Quality Gate Checklist

- [x] Server/client boundaries clearly mapped for each fix
- [x] Data flow impact documented (mutation pipeline, data fetching, reorder chain)
- [x] Build order implications noted (independent vs sequential)
- [x] Testing strategy per fix
- [x] Reference patterns provided (edit page, create page, layout hierarchy)
- [x] Key files identified for each fix

---

**End of Architecture Analysis**
