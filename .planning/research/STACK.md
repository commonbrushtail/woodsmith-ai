# Stack Research — Bug Fix Solutions

**Domain:** Runtime bug fixes (TipTap SSR, dnd-kit hydration, React 19 App Router)
**Researched:** 2026-02-15
**Confidence:** MEDIUM (based on library patterns and React 19/Next.js 16 behavior analysis)

## Problem Summary

WoodSmith AI has 5 runtime bugs discovered during Chrome DevTools audit:
1. **TipTap SSR crash** — `useEditor()` missing `immediatelyRender: false` (critical)
2. **dnd-kit hydration mismatch** — `<DndContext>` inside `<table>` creates invalid HTML (medium)
3. **Missing banner create page** — 404 on `/admin/banner/create` (medium)
4. **Raw HTML in profile field** — HTML tags showing in text input (low)
5. **Gallery order off-by-one** — first item shows "0" instead of "1" (low)

This research focuses on **bugs #1 and #2** which require library-specific knowledge.

---

## Bug #1: TipTap SSR Crash

### Current State

**File:** `src/components/admin/RichTextEditor.jsx`

```jsx
const editor = useEditor({
  extensions: [
    StarterKit.configure({ link: false }),
    Image,
    Link.configure({ openOnClick: false }),
  ],
  content,
  onUpdate: ({ editor }) => {
    onChange?.(editor.getHTML())
  },
  // ❌ Missing immediatelyRender: false
})
```

**Impact:** Crashes 5 admin pages (about-us, blog create/edit, products create/edit). ErrorBoundary catches it but pages are unusable.

### Root Cause

TipTap 3.x changed SSR behavior in React 19:
- `useEditor()` now tries to render immediately by default
- Next.js App Router uses React Server Components by default
- Component is marked `'use client'` BUT initial render happens on server
- Editor instance tries to access browser APIs (window, document) during SSR → crash

### Solution

Add `immediatelyRender: false` to `useEditor()` config.

```jsx
const editor = useEditor({
  extensions: [
    StarterKit.configure({ link: false }),
    Image,
    Link.configure({ openOnClick: false }),
  ],
  content,
  onUpdate: ({ editor }) => {
    onChange?.(editor.getHTML())
  },
  immediatelyRender: false, // ✅ Defers rendering until client hydration
})
```

**Why this works:**
- `immediatelyRender: false` tells TipTap to skip rendering during SSR
- Editor initialization waits until component mounts on client
- Prevents browser API access during server render
- Compatible with React 19 + Next.js 16 App Router

### Testing Strategy

Update `tests/components/rich-text-editor.test.jsx`:
```jsx
test('editor renders without SSR crash', () => {
  render(<RichTextEditor content="<p>Test</p>" onChange={vi.fn()} />)
  expect(screen.getByTestId('editor-wrapper')).toBeInTheDocument()
  // Editor should exist but not throw during initial render
})
```

### What NOT to Do

| Avoid | Why | Use Instead |
|-------|-----|-------------|
| Dynamic import with `ssr: false` | Breaks Next.js prerendering, delays TTI | `immediatelyRender: false` |
| Conditional rendering with `typeof window !== 'undefined'` | Causes hydration mismatch warnings | `immediatelyRender: false` |
| Moving component back to pages/ router | Defeats App Router benefits | `immediatelyRender: false` |
| Downgrading TipTap to 2.x | Loses React 19 compatibility | `immediatelyRender: false` |

---

## Bug #2: dnd-kit Hydration Mismatch

### Current State

**File:** `src/components/admin/BannersListClient.jsx` (and 4 other ListClient files)

```jsx
<table className="w-full border-collapse">
  <thead>
    <tr>{/* header cells */}</tr>
  </thead>
  <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
    <SortableContext items={sortedBanners.map((b) => b.id)} strategy={verticalListSortingStrategy}>
      <tbody>
        {sortedBanners.map((banner) => (
          <SortableRow key={banner.id} id={banner.id}>
            {/* table cells */}
          </SortableRow>
        ))}
      </tbody>
    </SortableContext>
  </DndContext>
</table>
```

**Problem:**
- `DndContext` injects accessibility `<div>` elements
- Invalid HTML: `<table>` cannot contain `<div>` as direct child (must be `<thead>`, `<tbody>`, `<tfoot>`)
- React 19's stricter hydration checks flag this → console warnings
- Functional but console errors on 5 list pages (banner, video-highlight, gallery, FAQ, manual)

### Root Cause

dnd-kit's `DndContext` renders accessibility announcements as `<div>` elements:
```html
<!-- What browser renders: -->
<table>
  <thead>...</thead>
  <div role="status" aria-live="assertive">Screen reader text</div> ❌ Invalid
  <tbody>...</tbody>
</table>
```

HTML5 spec requires `<table>` to only contain `<caption>`, `<colgroup>`, `<thead>`, `<tbody>`, `<tfoot>`.

### Solution Pattern 1: Wrapper Outside Table (Recommended)

Move `DndContext` outside `<table>`:

```jsx
<DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
  <SortableContext items={sortedBanners.map((b) => b.id)} strategy={verticalListSortingStrategy}>
    <div className="border border-[#e5e7eb] rounded-[12px] overflow-hidden bg-white">
      <div className="overflow-x-auto">
        <table className="w-full border-collapse">
          <thead>
            <tr>{/* header cells */}</tr>
          </thead>
          <tbody>
            {sortedBanners.map((banner) => (
              <SortableRow key={banner.id} id={banner.id}>
                {/* table cells */}
              </SortableRow>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  </SortableContext>
</DndContext>
```

**Why this works:**
- `DndContext` accessibility divs render outside `<table>`
- HTML is valid
- Drag-and-drop still works (sensors detect pointer events on child elements)
- No hydration mismatch

**Affected files:**
- `src/components/admin/BannersListClient.jsx`
- `src/components/admin/VideoHighlightsListClient.jsx`
- `src/components/admin/GalleryListClient.jsx`
- `src/components/admin/FaqListClient.jsx`
- `src/components/admin/ManualsListClient.jsx`

### Solution Pattern 2: Custom Accessibility Announcer (Alternative)

If Pattern 1 breaks existing styles, use custom announcer:

```jsx
import { DndContext, Announcements } from '@dnd-kit/core'

const announcements = {
  onDragStart(id) { return `Picked up item ${id}` },
  onDragOver(id, overId) { return `Moved over ${overId}` },
  onDragEnd(id, overId) { return `Dropped ${id} over ${overId}` },
  onDragCancel(id) { return `Cancelled ${id}` }
}

<DndContext
  sensors={sensors}
  collisionDetection={closestCenter}
  onDragEnd={handleDragEnd}
  accessibility={{ announcements }} // Uses ARIA live region instead of div
>
```

**When to use:** Only if Pattern 1 causes visual regression. Pattern 1 is simpler and preferred.

### Testing Strategy

```jsx
// No test changes needed — functional behavior unchanged
// Visual regression test:
test('table renders without hydration errors', () => {
  const consoleWarn = vi.spyOn(console, 'warn')
  render(<BannersListClient banners={mockBanners} />)
  expect(consoleWarn).not.toHaveBeenCalled()
  consoleWarn.mockRestore()
})
```

### What NOT to Do

| Avoid | Why | Use Instead |
|-------|-----|-------------|
| Suppress hydration warnings with `suppressHydrationWarning` | Masks the real issue, doesn't fix invalid HTML | Move DndContext outside table |
| Replace `<table>` with `<div>` grid | Breaks semantic HTML, accessibility, existing styles | Keep table, move DndContext |
| Custom CSS `display: table` on divs | Worse accessibility than real table | Keep table, move DndContext |
| Disable dnd-kit accessibility | Violates WCAG guidelines | Move DndContext outside table |

---

## Bug #3: Missing Banner Create Page

**Quick Fix:** Copy existing pattern from another create page.

```bash
# Template pattern (from products/blog create pages):
cp src/app/(admin)/admin/blog/create/page.jsx \
   src/app/(admin)/admin/banner/create/page.jsx
```

Then update:
- Import `createBanner` from `@/lib/actions/banners`
- Update form fields (banner only has `image_url`, `link_url`, `is_active`, `sort_order`)
- Remove rich text editor (banner doesn't use description)

**No library research needed** — pure application logic.

---

## Bug #4: Raw HTML in Profile Field

**File:** `src/app/(admin)/admin/profile/page.jsx`

Current: Company name shows `<p>Company Name</p>` as plain text.

**Solution:** Strip HTML before displaying in text input:

```jsx
function stripHtml(html) {
  if (!html) return ''
  // Use DOMParser in browser, or regex for simple cases
  return html.replace(/<[^>]*>/g, '')
}

<input
  type="text"
  value={stripHtml(profile?.company_name || '')}
  // ...
/>
```

**Alternative:** Switch to RichTextEditor if company_name should support formatting. Check DB schema first.

**No library research needed** — string manipulation.

---

## Bug #5: Gallery Order Off-by-One

**File:** `src/components/admin/GalleryListClient.jsx`

Current: First item shows order "0" instead of "1".

**Root cause:** `sort_order` in DB is 0-indexed, but UI should be 1-indexed.

**Solution:**
```jsx
// In table cell:
<td>{item.sort_order + 1}</td>

// Or in data transformation:
const displayItems = items.map(item => ({
  ...item,
  displayOrder: item.sort_order + 1
}))
```

**No library research needed** — display logic.

---

## Version Compatibility Matrix

| Package | Installed | Compatible With | Notes |
|---------|-----------|-----------------|-------|
| **TipTap** | `@tiptap/react@3.19.0` | React 19.2 ✅, Next.js 16 ✅ | Requires `immediatelyRender: false` in App Router |
| **dnd-kit** | `@dnd-kit/core@6.3.1` | React 19.2 ✅, Next.js 16 ✅ | DndContext must be outside `<table>` elements |
| **React** | `19.2.4` | TipTap 3.19 ✅, dnd-kit 6.3 ✅ | Stricter hydration checks |
| **Next.js** | `16.1.6` | All current libraries ✅ | App Router uses React Server Components |

**All libraries are compatible** — no upgrades/downgrades needed. Just config changes.

---

## Recommended Fix Order

1. **TipTap SSR crash** (1 line change) — highest impact, easiest fix
2. **Missing banner create page** (copy-paste + modify) — breaks user workflow
3. **dnd-kit hydration** (5 files, move wrapper) — functional but noisy console errors
4. **Gallery off-by-one** (1 line change) — cosmetic
5. **Profile HTML stripping** (add helper function) — cosmetic

Total estimated time: 2-3 hours including tests.

---

## Testing Checklist

- [ ] RichTextEditor renders without crash in Vitest
- [ ] RichTextEditor works in browser (about-us, blog, products pages)
- [ ] All 5 sortable list pages render without hydration warnings
- [ ] Drag-and-drop still works after moving DndContext
- [ ] Banner create page matches existing create page patterns
- [ ] Gallery order displays 1-indexed (not 0-indexed)
- [ ] Profile company name displays as plain text (no HTML tags)
- [ ] `npm run build` passes
- [ ] All 202 existing tests still pass

---

## Implementation Notes

### File Changes Required

| File | Change Type | Complexity |
|------|-------------|------------|
| `src/components/admin/RichTextEditor.jsx` | Add 1 option to useEditor | Low |
| `src/components/admin/BannersListClient.jsx` | Move DndContext wrapper | Medium |
| `src/components/admin/VideoHighlightsListClient.jsx` | Move DndContext wrapper | Medium |
| `src/components/admin/GalleryListClient.jsx` | Move DndContext wrapper + fix order display | Medium |
| `src/components/admin/FaqListClient.jsx` | Move DndContext wrapper | Medium |
| `src/components/admin/ManualsListClient.jsx` | Move DndContext wrapper | Medium |
| `src/app/(admin)/admin/banner/create/page.jsx` | Create new file | Medium |
| `src/app/(admin)/admin/profile/page.jsx` | Add HTML stripping | Low |
| `tests/components/rich-text-editor.test.jsx` | Verify no SSR errors | Low |

**9 files, ~150 lines changed** (mostly moving wrappers).

### No New Dependencies

All fixes use existing libraries with configuration changes. No `npm install` needed.

---

## Sources

**TipTap SSR Fix:**
- MEDIUM confidence — Based on TipTap 3.x API patterns and React 19 SSR behavior
- `immediatelyRender` is documented in TipTap 3.x migration guides
- Pattern confirmed by React 19 hydration requirements

**dnd-kit Hydration Fix:**
- MEDIUM confidence — Based on HTML5 table spec + dnd-kit architecture
- Invalid HTML structure is verifiable via Chrome DevTools DOM inspector
- React 19 hydration checks are stricter about invalid nesting

**Library Compatibility:**
- HIGH confidence — Verified via `npm list` output showing installed versions
- React 19.2.4, TipTap 3.19.0, dnd-kit 6.3.1 all support each other per package.json peer deps

**React 19 Hydration Behavior:**
- MEDIUM confidence — Based on React 19 changelog and Next.js 16 App Router docs
- Cannot verify via Context7/WebFetch (tools disabled), but patterns match known React 19 strictness

---

## Additional Context

### Why These Bugs Weren't Caught Earlier

1. **TipTap SSR crash** — Likely worked in dev mode due to Fast Refresh, only crashes in production build or cold starts
2. **dnd-kit hydration** — Functional despite warnings, easy to miss in console noise
3. **Missing banner page** — Oversight during Phase 2 implementation (other create pages exist)
4. **Raw HTML display** — Edge case if company_name rarely contains HTML
5. **Off-by-one order** — Cosmetic, didn't break functionality

### Prevention Strategy

Add to `npm run build` CI checks:
```json
{
  "scripts": {
    "build": "next build --webpack",
    "build:check": "npm run lint && npm test && npm run build"
  }
}
```

Run production build locally before merging to catch SSR crashes.

---

## Related Documentation

- React 19 SSR hydration: Next.js 16 App Router uses stricter checks
- TipTap 3.x migration: `immediatelyRender` option added for App Router compat
- dnd-kit accessibility: `DndContext` injects ARIA live regions as div elements
- HTML5 table spec: Only specific elements allowed as table children

**Implementation:** Apply fixes in order listed above. Test after each fix. Batch into single PR titled "Fix Phase 6 runtime bugs (TipTap SSR, dnd-kit hydration, banner page, profile HTML, gallery order)".
