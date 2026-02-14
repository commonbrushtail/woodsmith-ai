# PITFALLS.md — Phase 6 Bug Fixes

**Milestone**: Fix 5 runtime bugs in WoodSmith AI without regressing 202 existing tests

**Context**: Next.js 16 + React 19 + TipTap 3 + dnd-kit + Tailwind v4. TDD methodology. All fixes must maintain test coverage and not break existing functionality.

---

## Critical Success Factors

1. **Run tests before AND after each fix** — never batch fixes without verification
2. **Test in both dev and production builds** — SSR/hydration bugs behave differently
3. **Check console for warnings** — React hydration warnings are red flags
4. **Verify visual regression** — CSS/layout changes can break responsive design
5. **Test edge cases** — empty states, long content, special characters

---

## Bug Category 1: TipTap SSR Crashes

### The Bug
TipTap editor crashes on server render because it tries to access browser-only APIs (DOM, window).

### Common Fix Approaches
- Add `immediatelyRender: false` to `useEditor()` options
- Wrap editor in dynamic import with `ssr: false`
- Add conditional rendering based on `typeof window !== 'undefined'`

### ⚠️ Pitfall 1.1: Content Flash on Client Hydration

**Warning Signs:**
- Editor appears empty for 100-300ms after page load
- Existing content "pops in" after initial render
- CLS (Cumulative Layout Shift) increases

**Why It Happens:**
`immediatelyRender: false` tells TipTap to skip rendering until the client mounts. If you have existing content in the database, it won't display until React hydrates.

**Prevention:**
```jsx
// ❌ BAD: Content disappears until hydration
const editor = useEditor({
  immediatelyRender: false,
  content: initialContent
});

// ✅ GOOD: Show placeholder during hydration
const [isClient, setIsClient] = useState(false);
useEffect(() => setIsClient(true), []);

{!isClient && initialContent && (
  <div className="prose" dangerouslySetInnerHTML={{ __html: initialContent }} />
)}
{isClient && <EditorContent editor={editor} />}
```

**Test Strategy:**
- E2E test: Load page with existing content, measure time-to-content
- Visual regression: Screenshot before/after hydration
- Check for React warnings in console

---

### ⚠️ Pitfall 1.2: Missing Editor Toolbar on First Render

**Warning Signs:**
- Toolbar buttons disabled until user clicks editor
- `editor.isActive()` returns false for existing formatting
- Bold/italic state not reflected in toolbar

**Why It Happens:**
When `immediatelyRender: false`, the editor instance is `null` until client mount. Toolbar components that read `editor.isActive('bold')` during SSR will break.

**Prevention:**
```jsx
// ❌ BAD: Crashes on server
<BoldButton active={editor.isActive('bold')} />

// ✅ GOOD: Null-safe toolbar
<BoldButton active={editor?.isActive('bold') ?? false} />
```

**Test Strategy:**
- Unit test: Render toolbar with `editor = null`, verify no crashes
- Integration test: Load editor with formatted content, verify toolbar state

---

### ⚠️ Pitfall 1.3: Form Submission with Null Editor

**Warning Signs:**
- Form submits empty content on first render
- `editor.getHTML()` throws error
- Save button enabled before editor initializes

**Why It Happens:**
`useEditor()` returns `null` during SSR and first client render. Form handlers that call `editor.getHTML()` will crash.

**Prevention:**
```jsx
// ❌ BAD: Crashes if editor not ready
const handleSubmit = () => {
  const html = editor.getHTML();
  // ...
};

// ✅ GOOD: Guard against null editor
const handleSubmit = () => {
  if (!editor) {
    console.error('Editor not initialized');
    return;
  }
  const html = editor.getHTML();
  // ...
};

// ✅ BETTER: Disable submit until ready
<button disabled={!editor} onClick={handleSubmit}>Save</button>
```

**Test Strategy:**
- Unit test: Call submit handler with `editor = null`, verify graceful failure
- E2E test: Click save immediately after page load, verify error handling

---

### ⚠️ Pitfall 1.4: Extension Configuration Lost on Remount

**Warning Signs:**
- Image upload breaks after first save
- Custom link attributes disappear
- Extensions re-register on every render

**Why It Happens:**
If `extensions` array is defined inline in `useEditor()`, React recreates it on every render, causing TipTap to destroy and recreate the editor.

**Prevention:**
```jsx
// ❌ BAD: Extensions recreated every render
const editor = useEditor({
  extensions: [
    StarterKit,
    Image.configure({ inline: true }),
    Link.configure({ openOnClick: false })
  ]
});

// ✅ GOOD: Memoize extensions
const extensions = useMemo(() => [
  StarterKit,
  Image.configure({ inline: true }),
  Link.configure({ openOnClick: false })
], []);

const editor = useEditor({ extensions });
```

**Test Strategy:**
- Integration test: Submit form twice in a row, verify extensions still work
- Unit test: Render editor, trigger re-render, check extension count

---

## Bug Category 2: dnd-kit Hydration Mismatches

### The Bug
Server renders table with sortable rows, client hydrates with different structure due to drag handles/wrappers, causing React hydration error.

### Common Fix Approaches
- Suppress hydration on sortable wrapper: `suppressHydrationWarning`
- Move drag handles outside table structure
- Use `useSensors` with pointer sensor instead of mouse sensor

### ⚠️ Pitfall 2.1: CSS Grid/Flexbox Breaks After Restructure

**Warning Signs:**
- Table columns misaligned after adding `<SortableContext>`
- Drag handle breaks table layout on mobile
- CSS `display: table-row` overridden by dnd-kit wrapper

**Why It Happens:**
dnd-kit wraps each sortable item in a `<div>` with `transform: translate3d()`. This breaks native `<table>` semantics (`<tbody>` > `<tr>` > `<td>`).

**Prevention:**
```jsx
// ❌ BAD: Breaks table layout
<tbody>
  <SortableContext items={items}>
    {items.map(item => (
      <SortableRow key={item.id} item={item} /> // Renders <div><tr>...</tr></div>
    ))}
  </SortableContext>
</tbody>

// ✅ GOOD: Use CSS Grid instead of <table>
<div className="grid grid-cols-[auto_1fr_100px] gap-4">
  <SortableContext items={items}>
    {items.map(item => (
      <SortableRow key={item.id} item={item} />
    ))}
  </SortableContext>
</div>
```

**Test Strategy:**
- Visual regression: Screenshot table before/after restructure (desktop + mobile)
- E2E test: Drag item, verify columns still aligned
- CSS specificity: Verify no `!important` hacks added

---

### ⚠️ Pitfall 2.2: Hydration Mismatch from Conditional Drag Handles

**Warning Signs:**
- React error: "Text content does not match server-rendered HTML"
- Drag handle only appears after client hydration
- `useEffect` used to toggle handle visibility

**Why It Happens:**
If drag handle visibility depends on client-only state (window width, user permissions), server renders without handle, client renders with handle.

**Prevention:**
```jsx
// ❌ BAD: Conditional handle causes mismatch
const [showHandle, setShowHandle] = useState(false);
useEffect(() => {
  setShowHandle(window.innerWidth > 768);
}, []);

{showHandle && <DragHandle />}

// ✅ GOOD: Suppress hydration or always render
<div suppressHydrationWarning>
  <DragHandle className="lg:block hidden" />
</div>
```

**Test Strategy:**
- Check console for hydration warnings in dev mode
- E2E test: Load page, verify no console errors
- Unit test: Render component on server, verify handle present

---

### ⚠️ Pitfall 2.3: Lost Focus/Blur Events After Drag

**Warning Signs:**
- Input fields lose focus during drag
- Form validation doesn't trigger after reorder
- `onBlur` handlers not called

**Why It Happens:**
dnd-kit clones the dragged element, removing it from the DOM. If user was focused on an input inside the row, focus is lost.

**Prevention:**
```jsx
// ❌ BAD: Focus lost on drag
<SortableItem>
  <input onBlur={saveValue} />
</SortableItem>

// ✅ GOOD: Save on drag end, not blur
const handleDragEnd = (event) => {
  // Reorder items
  // Then save all values
  items.forEach(item => saveValue(item));
};
```

**Test Strategy:**
- E2E test: Focus input, drag row, verify value persisted
- Integration test: Mock drag event, verify save handler called

---

### ⚠️ Pitfall 2.4: Inconsistent `z-index` During Drag

**Warning Signs:**
- Dragged item appears behind other rows
- Drag overlay clipped by parent container
- `overflow: hidden` on parent breaks drag preview

**Why It Happens:**
dnd-kit renders drag overlay with `position: fixed`, but CSS stacking context can interfere.

**Prevention:**
```css
/* ❌ BAD: Parent clips overlay */
.sortable-container {
  overflow: hidden;
  position: relative;
  z-index: 1;
}

/* ✅ GOOD: Overlay in higher stacking context */
.sortable-container {
  overflow: visible;
  position: relative;
}

.drag-overlay {
  z-index: 9999;
}
```

**Test Strategy:**
- Visual test: Drag item across entire table, verify always visible
- E2E test: Drag to bottom of long list, verify no clipping

---

## Bug Category 3: Admin Page Creation Pitfalls

### The Bug
New admin pages missing middleware rules, navigation links, or form validation patterns.

### ⚠️ Pitfall 3.1: Forgotten Middleware Route Rule

**Warning Signs:**
- New admin page accessible without login
- `/admin/new-feature` returns 404 in production
- Middleware doesn't redirect to `/login`

**Why It Happens:**
`middleware.js` has explicit route patterns. New routes must be added manually.

**Prevention:**
```js
// ❌ BAD: New route not protected
const adminRoutes = [
  '/admin/dashboard',
  '/admin/products',
  // Forgot to add /admin/new-feature
];

// ✅ GOOD: Use wildcard or explicit list
const adminRoutes = ['/admin/*']; // Covers all admin routes
```

**Test Strategy:**
- E2E test: Access new route without login, verify redirect
- Integration test: Mock unauthenticated session, verify 401

---

### ⚠️ Pitfall 3.2: Missing Sidebar Navigation Link

**Warning Signs:**
- Users can't access new page from UI (must type URL)
- Sidebar active state doesn't highlight new page
- Mobile menu missing new link

**Why It Happens:**
Sidebar component has hardcoded navigation array.

**Prevention:**
```jsx
// ❌ BAD: Hardcoded links in component
<Link href="/admin/products">Products</Link>
<Link href="/admin/blog">Blog</Link>
// Forgot to add new feature

// ✅ GOOD: Config-driven navigation
const NAV_ITEMS = [
  { href: '/admin/products', label: 'Products' },
  { href: '/admin/blog', label: 'Blog' },
  { href: '/admin/new-feature', label: 'New Feature' }
];

NAV_ITEMS.map(item => <Link href={item.href}>{item.label}</Link>)
```

**Test Strategy:**
- E2E test: Click all sidebar links, verify pages load
- Visual test: Screenshot sidebar, verify new link present

---

### ⚠️ Pitfall 3.3: Inconsistent Form Validation Patterns

**Warning Signs:**
- New form uses different validation library (Joi vs Zod)
- Error messages in English instead of Thai
- Missing required field indicators (`*`)

**Why It Happens:**
Developer copies old form code instead of using shared components.

**Prevention:**
```jsx
// ❌ BAD: Inline validation, inconsistent messages
const validate = (data) => {
  if (!data.name) return { error: 'Name required' }; // English!
};

// ✅ GOOD: Use shared Zod schema + Thai messages
import { productSchema } from '@/lib/validations/products';

const result = productSchema.safeParse(data);
if (!result.success) {
  return { error: result.error.flatten() }; // Thai messages
}
```

**Test Strategy:**
- Unit test: Submit invalid form, verify Thai error messages
- Integration test: Check all required fields have `*` indicator

---

### ⚠️ Pitfall 3.4: Missing Audit Log Entries

**Warning Signs:**
- New CRUD actions don't appear in audit log
- `lib/audit.js` not imported
- Admin actions not traceable

**Why It Happens:**
Developer forgets to call `logAudit()` in Server Actions.

**Prevention:**
```js
// ❌ BAD: No audit trail
export async function createNewFeature(data) {
  const { error } = await supabase.from('features').insert(data);
  return { success: !error };
}

// ✅ GOOD: Log all admin actions
import { logAudit } from '@/lib/audit';

export async function createNewFeature(data) {
  const { error } = await supabase.from('features').insert(data);
  await logAudit('create', 'features', data.id, user.id);
  return { success: !error };
}
```

**Test Strategy:**
- Integration test: Perform action, query `admin_audit_log`, verify entry
- E2E test: Check audit log page shows new action

---

## Bug Category 4: HTML Stripping in Form Fields

### The Bug
Profile form displays TipTap HTML output as plain text or with tags visible.

### ⚠️ Pitfall 4.1: Regex-Based HTML Stripping Breaks on Edge Cases

**Warning Signs:**
- Self-closing tags not handled: `<img src="..." />`
- Nested tags leave orphan closing tags: `<b><i>text</i></b>` → `text</b>`
- HTML entities decoded incorrectly: `&lt;` → `<`

**Why It Happens:**
Simple regex like `/<[^>]*>/g` doesn't handle nested/malformed HTML.

**Prevention:**
```js
// ❌ BAD: Naive regex breaks on edge cases
const stripHtml = (html) => html.replace(/<[^>]*>/g, '');

// ✅ GOOD: Use DOMParser (client) or jsdom (server)
const stripHtml = (html) => {
  if (typeof window !== 'undefined') {
    const div = document.createElement('div');
    div.innerHTML = html;
    return div.textContent || '';
  }
  // Server-side: use existing sanitize-html.js
  return sanitizeToText(html);
};
```

**Test Strategy:**
- Unit test: Strip HTML with nested tags, self-closing tags, entities
- Integration test: Submit TipTap content, verify plain text stored

---

### ⚠️ Pitfall 4.2: Whitespace Collapsed in Plaintext Conversion

**Warning Signs:**
- Paragraphs run together: `<p>A</p><p>B</p>` → `AB` instead of `A\n\nB`
- Line breaks lost: `<br>` → `` instead of `\n`
- List items concatenated: `<li>A</li><li>B</li>` → `AB` instead of `- A\n- B`

**Why It Happens:**
`textContent` collapses whitespace per HTML spec.

**Prevention:**
```js
// ❌ BAD: Lost paragraph breaks
const text = div.textContent; // "<p>A</p><p>B</p>" → "AB"

// ✅ GOOD: Preserve block-level spacing
const stripHtml = (html) => {
  const div = document.createElement('div');
  div.innerHTML = html;

  // Add newlines before block elements
  div.querySelectorAll('p, br, li').forEach(el => {
    el.insertAdjacentText('beforebegin', '\n');
  });

  return div.textContent.trim();
};
```

**Test Strategy:**
- Unit test: Convert multi-paragraph HTML, verify double newlines
- E2E test: Enter rich text, verify preview shows proper spacing

---

### ⚠️ Pitfall 4.3: XSS Vulnerability in Preview Display

**Warning Signs:**
- User-submitted HTML rendered directly: `dangerouslySetInnerHTML`
- `<script>` tags not stripped
- Event handlers not removed: `<img onerror="alert()">`

**Why It Happens:**
Developer uses `dangerouslySetInnerHTML` to preserve formatting instead of stripping to text.

**Prevention:**
```jsx
// ❌ BAD: XSS vulnerability
<div dangerouslySetInnerHTML={{ __html: userInput }} />

// ✅ GOOD: Sanitize before display
import { sanitizeHtml } from '@/lib/sanitize-html';

<div dangerouslySetInnerHTML={{ __html: sanitizeHtml(userInput) }} />

// ✅ BETTER: Strip to plain text for form fields
<textarea value={stripHtml(userInput)} />
```

**Test Strategy:**
- Security test: Submit `<script>alert('XSS')</script>`, verify not executed
- Unit test: Sanitize HTML with event handlers, verify stripped

---

## Bug Category 5: Sort Order Off-by-One Errors

### The Bug
Gallery images display in wrong order because `display_order` is 0-indexed in code but 1-indexed in database.

### ⚠️ Pitfall 5.1: Cascade Failures from Index Shift

**Warning Signs:**
- Changing `display_order` breaks carousel component
- Reorder function subtracts 1 from all indices
- First item disappears after re-sort

**Why It Happens:**
Multiple components depend on same `display_order` field with different assumptions (0-indexed vs 1-indexed).

**Prevention:**
```js
// ❌ BAD: Mixed indexing conventions
// Component A (0-indexed)
const firstItem = items[0]; // display_order = 0

// Component B (1-indexed)
const firstItem = items.find(i => i.display_order === 1);

// ✅ GOOD: Normalize at data boundary
const fetchGallery = async () => {
  const { data } = await supabase
    .from('gallery')
    .select('*')
    .order('display_order');

  // Normalize to 0-indexed for frontend
  return data.map((item, idx) => ({
    ...item,
    displayOrder: idx // Always 0-indexed in React
  }));
};
```

**Test Strategy:**
- Integration test: Fetch gallery, verify first item has `displayOrder = 0`
- E2E test: Reorder items, verify no items disappear
- Grep codebase for `display_order` usage, verify consistency

---

### ⚠️ Pitfall 5.2: Race Condition in Reorder Updates

**Warning Signs:**
- Items jump back to old order after drag
- Multiple simultaneous drags corrupt order
- `display_order` values duplicate

**Why It Happens:**
Optimistic UI updates local state, but server update fails or takes too long, causing stale data.

**Prevention:**
```js
// ❌ BAD: Fire-and-forget update
const handleDragEnd = (event) => {
  const newOrder = reorderArray(items, event);
  setItems(newOrder); // Optimistic update
  updateOrder(newOrder); // May fail silently
};

// ✅ GOOD: Rollback on failure
const handleDragEnd = async (event) => {
  const oldOrder = items;
  const newOrder = reorderArray(items, event);

  setItems(newOrder); // Optimistic

  const { error } = await updateOrder(newOrder);
  if (error) {
    setItems(oldOrder); // Rollback
    toast.error('Failed to reorder');
  }
};
```

**Test Strategy:**
- E2E test: Drag item, kill network, verify rollback
- Integration test: Mock failed update, verify order unchanged

---

### ⚠️ Pitfall 5.3: Unique Constraint Violations During Reorder

**Warning Signs:**
- Database error: "duplicate key value violates unique constraint"
- Reorder fails when moving item from position 1 → 5
- Batch update leaves gaps in sequence

**Why It Happens:**
If `display_order` has unique constraint, updating `item[1].order = 2` fails if `item[2]` already has `order = 2`.

**Prevention:**
```sql
-- ❌ BAD: Unique constraint blocks reorder
ALTER TABLE gallery ADD CONSTRAINT unique_order UNIQUE (display_order);

-- ✅ GOOD: Use transaction with temp values
BEGIN;
UPDATE gallery SET display_order = display_order + 1000 WHERE id = ANY($1);
UPDATE gallery SET display_order = $2 WHERE id = $1;
COMMIT;

-- ✅ BETTER: No unique constraint, validate in app
-- Check for duplicates in Server Action before commit
```

**Test Strategy:**
- Integration test: Reorder items in same gallery, verify no constraint errors
- Unit test: Generate order updates, verify no duplicate values

---

### ⚠️ Pitfall 5.4: Incorrect Sort Direction After Filter

**Warning Signs:**
- Filtering items changes sort order
- Removed items leave gaps: `[1, 2, 4, 5]` instead of `[1, 2, 3, 4]`
- Re-adding item inserts at wrong position

**Why It Happens:**
Component filters items client-side but doesn't renormalize `display_order`.

**Prevention:**
```js
// ❌ BAD: Filter breaks order
const visibleItems = items
  .filter(i => i.category === selectedCategory)
  .sort((a, b) => a.display_order - b.display_order);
// display_order still has gaps: [1, 3, 7]

// ✅ GOOD: Renormalize after filter
const visibleItems = items
  .filter(i => i.category === selectedCategory)
  .sort((a, b) => a.display_order - b.display_order)
  .map((item, idx) => ({ ...item, displayOrder: idx }));
// display_order sequential: [0, 1, 2]
```

**Test Strategy:**
- E2E test: Filter items, drag to reorder, verify correct final order
- Unit test: Filter + sort, verify no gaps in indices

---

## Cross-Cutting Pitfalls

### ⚠️ Pitfall X.1: Test Failures Due to Missing Mocks

**Warning Signs:**
- New bug fix passes E2E but fails unit tests
- Tests try to access `window.document` in server environment
- Mock Supabase client missing new table columns

**Prevention:**
- Run `npm test` before AND after each fix
- Update mocks when adding new dependencies
- Use `vi.mock()` for browser-only APIs

---

### ⚠️ Pitfall X.2: Production Build Failures After Dev Testing

**Warning Signs:**
- `npm run dev` works, `npm run build` fails
- Webpack throws "Module not found" in production
- SSR crashes only in production build

**Prevention:**
- Run `npm run build` before committing bug fixes
- Test production build locally: `npm run build && npm start`
- Check Next.js build logs for warnings

---

### ⚠️ Pitfall X.3: Regression in Unrelated Features

**Warning Signs:**
- Fixing TipTap breaks quotation form
- Fixing drag-and-drop breaks mobile menu
- Shared component change cascades to 10+ pages

**Prevention:**
- Run full test suite (`npm test`) after each fix
- Visual regression: Screenshot key pages before/after
- E2E smoke test: Visit all 46 pages, verify no console errors

---

## Quality Gates for Phase 6

Before merging each bug fix:

1. ✅ All 202 tests pass (no regressions)
2. ✅ No React hydration warnings in console
3. ✅ `npm run build` succeeds
4. ✅ E2E test covers fixed bug
5. ✅ Visual regression check (screenshot diff)
6. ✅ No new ESLint errors
7. ✅ Code reviewed against this PITFALLS doc

---

## References

- TipTap SSR: https://tiptap.dev/docs/editor/api/extensions/starter-kit#immediatelyrender
- dnd-kit Hydration: https://docs.dndkit.com/api-documentation/sensors#pointer-sensor
- Next.js Hydration: https://nextjs.org/docs/messages/react-hydration-error
- Array Reordering: WoodSmith `lib/reorder.js`

---

**Last Updated**: 2026-02-15
**Milestone**: Phase 6 Bug Fixes
**Status**: Ready for implementation
