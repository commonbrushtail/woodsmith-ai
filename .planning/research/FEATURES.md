# Feature Research: TDD Testing Patterns for Bug Fixes

**Domain:** Testing Methodology (TipTap, dnd-kit, Next.js Server Components)
**Researched:** 2026-02-15
**Confidence:** MEDIUM (based on existing codebase patterns + library knowledge)

## Feature Landscape

### Table Stakes (Users Expect These)

| Feature | Why Expected | Complexity | Notes |
|---------|--------------|------------|-------|
| Component rendering tests | Verify components render without crashing | Low | Already established pattern in codebase (RichTextEditor.test.jsx, SortableList.test.jsx) |
| SSR/hydration safety tests | Catch SSR crashes before runtime | Medium | Critical for TipTap/dnd-kit client components |
| Props validation tests | Verify required props work correctly | Low | Standard pattern in AdminInput.test.jsx |
| Error boundary coverage | Ensure errors don't crash entire app | Medium | Already implemented (ErrorBoundary.test.jsx) |
| Unit tests for pure functions | Test reorder logic, sanitization in isolation | Low | Established pattern (reorder.test.js, sanitize-html.test.js) |
| Server Action mocking | Test CRUD operations without hitting DB | Medium | Complex mocking pattern already in blog.test.js |
| Form submission tests | Verify server actions are called correctly | Medium | Required for banner create page fix |
| HTML sanitization tests | Prevent XSS in user-generated content | Medium | Already established (sanitize-html.test.js - 15 tests) |

### Differentiators (Competitive Advantage)

| Feature | Value Proposition | Complexity | Notes |
|---------|-------------------|------------|-------|
| TDD red-green-refactor flow | Write failing test first, then fix | Medium | Enforces bug reproducibility before fix |
| Regression test suite | Prevent bugs from reoccurring | Low | Each bug fix gets permanent test coverage |
| Edge case testing (off-by-one) | Catch boundary conditions | Medium | Gallery order 0 vs 1, empty arrays, single items |
| Hydration mismatch detection | Catch React SSR mismatches in tests | High | Requires careful jsdom setup, may need custom matchers |
| Accessibility testing | Verify ARIA labels on drag handles | Low | Already used in SortableList.test.jsx (aria-label checks) |
| Integration tests with mocked Supabase | Test full flow with realistic data | High | Requires complex mock setup (seen in blog.test.js) |
| Visual regression testing (optional) | Catch UI changes | High | Would require Playwright screenshot comparison |

### Anti-Features (Commonly Requested, Often Problematic)

| Feature | Why Requested | Why Problematic | Alternative |
|---------|---------------|-----------------|-------------|
| Testing actual drag-and-drop events | "We need to test the drag works" | jsdom doesn't support mouse events well; brittle | Test the `handleDragEnd` callback logic instead |
| Testing TipTap editor interactions (typing, formatting) | "We need to test editing works" | TipTap's internal state is complex; hard to simulate | Test toolbar button rendering and `onChange` callback |
| E2E tests for every bug | "E2E catches everything" | Slow, flaky, expensive to maintain | Use E2E only for critical user flows; unit tests for bugs |
| Testing Next.js Server Components in isolation | "We need to test RSC rendering" | Server Components can't be tested in jsdom | Test data-fetching functions separately; use E2E for full flow |
| Full HTML rendering in tests | "We need to test exact HTML output" | Brittle; breaks on minor DOM changes | Test semantic structure (roles, testids) instead |
| Testing CSS hydration | "We need to verify styles don't flash" | Vitest doesn't render actual CSS | Use visual regression (Playwright) or manual QA |

## Feature Dependencies

```
TDD Red-Green-Refactor
  └─> Bug Reproducibility Test (RED)
      ├─> TipTap SSR Fix
      │   ├─> Component Rendering Test (renders without crashing)
      │   ├─> Editor Options Test (verify immediatelyRender: false)
      │   └─> onChange Callback Test (verify editor updates)
      │
      ├─> dnd-kit Hydration Fix
      │   ├─> Rendering Test (no hydration warnings)
      │   ├─> Structure Test (DndContext placement)
      │   └─> Drag Handler Test (callback logic only)
      │
      ├─> Banner Create Page
      │   ├─> Server Action Test (createBanner)
      │   ├─> Form Submission Test (FormData handling)
      │   └─> Validation Test (Zod schema)
      │
      ├─> Profile HTML Display
      │   ├─> HTML Stripping Test (stripTags utility)
      │   ├─> Component Test (input shows plain text)
      │   └─> Sanitization Test (XSS prevention)
      │
      └─> Gallery Order Off-by-One
          ├─> Sort Order Display Test (1-indexed vs 0-indexed)
          ├─> Reorder Logic Test (edge cases: first, last, single)
          └─> buildSortOrderUpdates Test (starts at 0 or 1)
```

## MVP Definition

### Launch With (v1) - Phase 6 Bug Fixes

**For each bug, follow this TDD pattern:**

- [x] **Write failing test first (RED)**
  - TipTap: Test that editor renders without `immediatelyRender: false` → expect SSR crash
  - dnd-kit: Test that SortableList renders table structure → expect hydration error
  - Banner create: Test page exists at `/admin/banner/create` → expect 404
  - Profile HTML: Test that `<p>Company</p>` displays as "Company" → expect raw tags
  - Gallery order: Test first item shows order "1" → expect "0"

- [x] **Implement minimal fix (GREEN)**
  - TipTap: Add `immediatelyRender: false` to useEditor config
  - dnd-kit: Move DndContext outside table or use CSS-only wrapper
  - Banner create: Create page.jsx with form + server action
  - Profile HTML: Add `stripHtmlTags()` utility + apply to input value
  - Gallery order: Change display to `sort_order + 1` or normalize data layer

- [x] **Refactor for quality (REFACTOR)**
  - Extract shared test helpers
  - Add edge case tests
  - Document patterns for future bugs

### Add After Validation (v1.x) - Post-Bug Fix Enhancements

- [ ] **Playwright E2E smoke tests** — Trigger: After 3+ manual regression bugs found
  - Admin login → Create blog post → Verify published
  - Customer registration → Submit quotation → Verify received

- [ ] **Performance regression tests** — Trigger: User reports slowness
  - TipTap editor load time (< 500ms)
  - Gallery image list render (< 1s for 50 items)

- [ ] **Visual regression tests** — Trigger: UI inconsistency bugs reported
  - Screenshot comparison for key admin pages
  - Requires Playwright setup

## Feature Prioritization Matrix

| Feature | User Value | Implementation Cost | Priority |
|---------|------------|---------------------|----------|
| **Bug Reproducibility Tests** | Critical (prevents regressions) | Low (1-2 tests per bug) | **P0** |
| TipTap SSR rendering test | Critical (5+ pages unusable) | Low (copy existing pattern) | **P0** |
| dnd-kit hydration test | High (console errors, confusing) | Medium (need hydration detection) | **P1** |
| Banner create page test | High (broken UI link) | Low (copy products create pattern) | **P1** |
| HTML sanitization test | Medium (security + UX) | Low (already have stripTags pattern) | **P1** |
| Gallery order edge cases | Low (cosmetic) | Low (simple arithmetic) | **P2** |
| Drag-and-drop callback tests | Medium (prevents reorder bugs) | Low (test pure function) | **P2** |
| Server Action integration tests | Medium (catches CRUD bugs) | High (complex mocking) | **P2** |
| E2E smoke tests | Low (CI cost/value ratio) | High (Playwright setup + maintenance) | **P3** |

## Testing Pattern Reference (Existing Codebase)

### 1. TipTap Component Testing Pattern

**File:** `tests/components/rich-text-editor.test.jsx`

**Pattern:**
```javascript
describe('RichTextEditor', () => {
  it('renders toolbar with formatting buttons', () => {
    render(<RichTextEditor content="" onChange={() => {}} />)
    expect(screen.getByRole('button', { name: /bold/i })).toBeTruthy()
  })

  it('renders with initial HTML content', () => {
    const { container } = render(
      <RichTextEditor content="<p>Hello world</p>" onChange={() => {}} />
    )
    const editorEl = container.querySelector('.ProseMirror')
    expect(editorEl.textContent).toContain('Hello world')
  })
})
```

**Key Learnings:**
- Test toolbar buttons by role + accessible name
- TipTap content renders inside `.ProseMirror` selector
- Don't test actual typing/editing (brittle, TipTap's responsibility)
- Test `onChange` callback receives HTML string

**For Bug Fix:**
```javascript
// RED: Failing test before fix
it('does not crash on server render without immediatelyRender option', () => {
  // This will fail if component tries to render editor on server
  const { container } = render(<RichTextEditor content="<p>Test</p>" />)
  expect(container.querySelector('.ProseMirror')).toBeTruthy()
})

// After adding immediatelyRender: false → test passes (GREEN)
```

### 2. dnd-kit Component Testing Pattern

**File:** `tests/components/sortable-list.test.jsx`

**Pattern:**
```javascript
describe('SortableList', () => {
  const items = [{ id: '1', name: 'First' }]

  it('renders all items', () => {
    render(
      <SortableList items={items} onReorder={() => {}}>
        {(item) => <span>{item.name}</span>}
      </SortableList>
    )
    expect(screen.getByText('First')).toBeInTheDocument()
  })

  it('renders drag handles for each item', () => {
    render(<SortableList items={items} onReorder={() => {}} />)
    const handles = screen.getAllByLabelText('ลากเพื่อจัดเรียง')
    expect(handles).toHaveLength(items.length)
  })
})
```

**Key Learnings:**
- Test ARIA labels on drag handles (accessibility + testability)
- Don't test actual drag events (not supported in jsdom)
- Test `onReorder` callback is passed (not that it's called)
- Use `data-testid` for complex DOM queries

**For Bug Fix (Hydration):**
```javascript
// RED: Test will show hydration warning in console
it('renders without hydration errors', () => {
  const spy = vi.spyOn(console, 'error')
  render(<SortableList items={items} onReorder={() => {}} />)

  // Check no React hydration errors
  const hydrationErrors = spy.mock.calls.filter(
    call => call[0]?.includes?.('Hydration') || call[0]?.includes?.('did not match')
  )
  expect(hydrationErrors).toHaveLength(0)
  spy.mockRestore()
})
```

### 3. Server Action Testing Pattern

**File:** `tests/lib/actions/blog.test.js`

**Pattern:**
```javascript
// Complex mocking setup
const mockRevalidatePath = vi.fn()
vi.mock('next/cache', () => ({ revalidatePath: (...args) => mockRevalidatePath(...args) }))

function createQueryChain(finalResult = { data: null, error: null }) {
  const chain = {}
  const methods = ['select', 'insert', 'update', 'delete', 'eq', 'or', 'ilike']
  for (const m of methods) {
    chain[m] = vi.fn(() => chain)
  }
  chain.then = (resolve) => resolve(finalResult)
  return chain
}

describe('createBlogPost', () => {
  it('inserts blog post and returns data', async () => {
    mockAdminQueryChain = createQueryChain({ data: { id: '1' }, error: null })

    const formData = fakeFormData({ title: 'New Post', content: '<p>Body</p>' })
    const result = await createBlogPost(formData)

    expect(result.error).toBeNull()
    expect(mockAdmin.from).toHaveBeenCalledWith('blog_posts')
    expect(mockRevalidatePath).toHaveBeenCalledWith('/admin/blog')
  })
})
```

**Key Learnings:**
- Mock `next/cache` revalidatePath
- Create chainable Supabase query mock (thenable)
- Use `fakeFormData` helper for FormData objects
- Test both success and error paths

**For Banner Create Page:**
```javascript
// RED: Test before page exists
describe('createBanner', () => {
  it('creates banner with image upload', async () => {
    // Setup mocks for Supabase insert + storage upload
    mockAdminQueryChain = createQueryChain({ data: { id: 'b1' }, error: null })
    mockUploadFile.mockResolvedValue({ url: 'https://cdn/banner.jpg', error: null })

    const formData = fakeFormData({
      title: 'Sale Banner',
      image: new File([''], 'banner.jpg', { type: 'image/jpeg' }),
    })

    const result = await createBanner(formData)
    expect(result.error).toBeNull()
  })
})
```

### 4. HTML Sanitization Testing Pattern

**File:** `tests/lib/sanitize-html.test.js`

**Pattern:**
```javascript
describe('sanitizeHtml', () => {
  it('allows safe HTML tags', () => {
    const html = '<p>Hello <strong>bold</strong></p>'
    expect(sanitizeHtml(html)).toBe(html)
  })

  it('strips script tags', () => {
    const html = '<p>Safe</p><script>alert("xss")</script>'
    const result = sanitizeHtml(html)
    expect(result).not.toContain('<script')
    expect(result).toContain('<p>Safe</p>')
  })
})
```

**Key Learnings:**
- Test both allow-list (safe tags pass through) and deny-list (dangerous tags stripped)
- Test event handlers, javascript: URLs, unknown tags
- Test edge cases: null, undefined, empty string

**For Profile HTML Display:**
```javascript
// New utility: stripHtmlTags (different from sanitizeHtml)
describe('stripHtmlTags', () => {
  it('removes all HTML tags from string', () => {
    expect(stripHtmlTags('<p>Company</p>')).toBe('Company')
    expect(stripHtmlTags('<strong>Bold</strong> text')).toBe('Bold text')
  })

  it('handles nested tags', () => {
    expect(stripHtmlTags('<div><p>Nested</p></div>')).toBe('Nested')
  })

  it('returns empty string for null/undefined', () => {
    expect(stripHtmlTags(null)).toBe('')
    expect(stripHtmlTags(undefined)).toBe('')
  })
})
```

### 5. Edge Case Testing Pattern (Reorder Logic)

**File:** `tests/lib/reorder.test.js`

**Pattern:**
```javascript
describe('buildSortOrderUpdates', () => {
  it('generates updates with sequential sort_order values starting at 0', () => {
    const items = [{ id: 'b' }, { id: 'c' }, { id: 'a' }]
    const updates = buildSortOrderUpdates(items)
    expect(updates).toEqual([
      { id: 'b', sort_order: 0 },
      { id: 'c', sort_order: 1 },
      { id: 'a', sort_order: 2 },
    ])
  })

  it('returns empty array for empty input', () => {
    expect(buildSortOrderUpdates([])).toEqual([])
  })

  it('works with single item', () => {
    const items = [{ id: 'x' }]
    expect(buildSortOrderUpdates(items)).toEqual([{ id: 'x', sort_order: 0 }])
  })
})
```

**Key Learnings:**
- Test boundary conditions: empty array, single item, first, last
- Test both 0-indexed and 1-indexed logic
- Pure function testing is fast and reliable

**For Gallery Order Fix:**
```javascript
// Option A: Fix at display layer (view transforms data)
it('displays sort_order as 1-indexed', () => {
  const items = [
    { id: '1', sort_order: 0, name: 'First' },
    { id: '2', sort_order: 1, name: 'Second' },
  ]

  // Test display helper
  expect(displaySortOrder(items[0].sort_order)).toBe('1')
  expect(displaySortOrder(items[1].sort_order)).toBe('2')
})

// Option B: Fix at data layer (DB stores 1-indexed)
it('generates sort_order starting at 1', () => {
  const items = [{ id: 'a' }, { id: 'b' }]
  const updates = buildSortOrderUpdates(items, { startIndex: 1 })
  expect(updates).toEqual([
    { id: 'a', sort_order: 1 },
    { id: 'b', sort_order: 2 },
  ])
})
```

## TDD Workflow for Each Bug Fix

### Step 1: Reproduce Bug in Test (RED)

```bash
# Create test file first
touch tests/bugs/tiptap-ssr-crash.test.jsx

# Run test — should FAIL
npm test tests/bugs/tiptap-ssr-crash.test.jsx

# Verify failure matches production bug
```

### Step 2: Minimal Fix (GREEN)

```bash
# Edit component with minimal change
# Example: Add immediatelyRender: false to RichTextEditor.jsx

# Run test again — should PASS
npm test tests/bugs/tiptap-ssr-crash.test.jsx

# Run full suite to ensure no regressions
npm test
```

### Step 3: Refactor + Edge Cases (REFACTOR)

```bash
# Add edge case tests
# Extract reusable helpers
# Document pattern in comments

# Run full suite
npm test

# Verify build still passes
npm run build
```

### Step 4: Move Tests to Permanent Location

```bash
# Move from tests/bugs/ to tests/components/ or tests/lib/
# Update imports
# Commit with descriptive message

git add tests/components/rich-text-editor.test.jsx src/components/admin/RichTextEditor.jsx
git commit -m "Fix TipTap SSR crash: add immediatelyRender option

- Add failing test reproducing SSR crash
- Fix: useEditor({ immediatelyRender: false })
- Add edge case tests for editor options
- Prevents crash on about-us, blog, products edit pages"
```

## Anti-Patterns to Avoid

### ❌ Don't: Test Implementation Details

```javascript
// BAD: Testing TipTap's internal state
it('updates editor state when typing', () => {
  const { container } = render(<RichTextEditor />)
  const editor = container.querySelector('.ProseMirror')

  // Simulating typing is brittle and couples to TipTap internals
  fireEvent.input(editor, { target: { value: 'New text' } })
  expect(editor.state.doc.textContent).toBe('New text') // TipTap internals
})

// GOOD: Test the contract (onChange callback)
it('calls onChange when editor content changes', () => {
  const onChange = vi.fn()
  render(<RichTextEditor content="" onChange={onChange} />)

  // Test that onChange is passed to useEditor config
  // Actual typing is TipTap's responsibility
})
```

### ❌ Don't: Test Actual Drag Events in jsdom

```javascript
// BAD: Simulating drag events (doesn't work reliably in jsdom)
it('reorders items when dragged', () => {
  render(<SortableList items={items} onReorder={onReorder} />)

  const firstItem = screen.getByText('First')
  fireEvent.dragStart(firstItem) // jsdom doesn't support this well
  fireEvent.dragEnd(firstItem)

  expect(onReorder).toHaveBeenCalled() // Flaky
})

// GOOD: Test the reorder logic directly
it('calls onReorder with new array when drag ends', () => {
  const handleDragEnd = (event) => {
    const { active, over } = event
    const newItems = arrayMove(items, oldIndex, newIndex)
    onReorder(newItems)
  }

  // Test handleDragEnd logic directly
  handleDragEnd({ active: { id: '1' }, over: { id: '3' } })
  expect(onReorder).toHaveBeenCalledWith([...])
})
```

### ❌ Don't: Test Next.js Server Components in Vitest

```javascript
// BAD: Trying to render Server Component in jsdom
import BannerListPage from '@/app/(admin)/admin/banner/page'

it('renders banner list page', async () => {
  render(await BannerListPage()) // Server Components can't be tested in jsdom
})

// GOOD: Test the data-fetching function separately
import { getBanners } from '@/lib/actions/banner'

it('getBanners returns all banners', async () => {
  mockAdminQueryChain = createQueryChain({ data: [...banners], error: null })
  const result = await getBanners()
  expect(result.data).toHaveLength(3)
})
```

### ❌ Don't: Hardcode Exact HTML Structure

```javascript
// BAD: Brittle — breaks when className changes
it('renders with correct structure', () => {
  const { container } = render(<AdminInput label="Name" />)
  expect(container.innerHTML).toContain(
    '<div class="flex flex-col gap-[8px] w-full">'
  )
})

// GOOD: Test semantic structure (roles, testids)
it('renders input with accessible label', () => {
  render(<AdminInput label="Name" />)
  expect(screen.getByLabelText('Name')).toBeInTheDocument()
})
```

## Sources

**Confidence Level: MEDIUM**

Sources are based on:

1. **Existing codebase test patterns** (HIGH confidence for project conventions)
   - `tests/components/rich-text-editor.test.jsx` — TipTap component testing
   - `tests/components/sortable-list.test.jsx` — dnd-kit component testing
   - `tests/lib/actions/blog.test.js` — Server Action mocking pattern
   - `tests/lib/sanitize-html.test.js` — HTML sanitization testing
   - `tests/lib/reorder.test.js` — Edge case testing for sort logic

2. **Library knowledge** (MEDIUM confidence — not verified against 2026 docs)
   - TipTap 3.19.0: `immediatelyRender: false` option for SSR (from component inspection)
   - dnd-kit 6.3.1/10.0.0: Hydration issues with SSR (common known issue)
   - Vitest 4.0.18 + Testing Library 16.3.2: Component testing patterns
   - Next.js 16: Server Component testing limitations

3. **TDD methodology** (HIGH confidence — universal testing principles)
   - Red-Green-Refactor cycle
   - Test-first development for bug fixes
   - Edge case testing (boundary conditions)
   - Regression prevention

**Note:** Could not access Context7, WebSearch, or WebFetch to verify latest 2026 documentation. Patterns are based on existing working tests in codebase + general library knowledge. Recommend validating against official docs when internet access is available.
