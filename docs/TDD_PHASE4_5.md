# TDD Implementation Plan: Phase 4 (Remaining) + Phase 5

Test-driven implementation for remaining polish and future enhancements.
Each session is scoped for a single ralph-loop run (~50 iterations max).

---

## Current State

**Completed:** Phases 1–4 core + Sessions 1–4 of this plan.

**Test Infrastructure:**
- Vitest (jsdom) — 15+ test files, `tests/**/*.test.js`
- Playwright — 4 E2E specs in `e2e/`
- `@testing-library/react` + `@testing-library/jest-dom` installed
- Zod 4, `vitest.config.js` with `@` alias, `.env.local` auto-loaded

**Resolved Gaps (S1–S4):**
- ~~Server actions return `fieldErrors` but no admin form displays them~~ → S1: `useFormErrors` hook + `AdminInput` error prop
- ~~Zero error boundaries~~ → S1: `ErrorBoundary` component in admin + public layouts
- ~~Zero loading skeletons~~ → S2: `AdminSkeleton` components + 9 `loading.jsx` files
- ~~`AdminInput` has no `error` prop~~ → S1: error prop with red border + message
- ~~`RichTextToolbar` is a static SVG placeholder~~ → S3: TipTap `RichTextEditor` with full toolbar
- ~~No drag-and-drop library installed~~ → S4: `@dnd-kit` with `SortableList` wired into 5 pages
- ~~File upload has no client-side validation or progress~~ → S2: `AdminFileInput` + `upload-validation.js`

**Remaining Gaps (S5–S7):**
- No sanitization (except rich text), CSRF, rate-limiting, or audit logging
- LINE Login and forgot-password not wired
- Test coverage needs expansion

---

## Session Overview

| Session | Scope | New Tests | Est. Files | Status |
|---------|-------|-----------|------------|--------|
| S1 | Admin Form Validation UX + Error Boundaries | ~20 | 15 | ✅ Done |
| S2 | Loading States + File Upload Improvements | ~12 | 18 | ✅ Done |
| S3 | TipTap Rich Text Editor | ~8 | 8 | ✅ Done |
| S4 | Drag-and-Drop Reordering | ~10 | 12 | ✅ Done |
| S5 | Auth Gaps (LINE, forgot-password) | ~6 | 8 | Pending |
| S6 | Security Hardening | ~15 | 10 | Pending |
| S7 | Test Coverage Expansion | ~30 | 20 | Pending |

---

## Session 1: Admin Form Validation UX + Error Boundaries ✅

**Branch:** `ai/phase4-s1-validation-ux` (5 commits)

### Goal
Display Zod field-level errors inline in admin forms. Add error boundaries.

### TDD Steps

#### 1.1 Extend AdminInput with error display

**Test first** (`tests/components/admin-input.test.jsx`):
```js
import { render, screen } from '@testing-library/react'
import AdminInput from '@/components/admin/AdminInput'

describe('AdminInput', () => {
  it('renders without error styling by default', () => {
    render(<AdminInput label="Name" value="" onChange={() => {}} />)
    expect(screen.getByRole('textbox')).not.toHaveClass('border-red-500')
  })

  it('displays error message when error prop is provided', () => {
    render(<AdminInput label="Name" value="" onChange={() => {}} error="กรุณาระบุชื่อ" />)
    expect(screen.getByText('กรุณาระบุชื่อ')).toBeInTheDocument()
  })

  it('applies error border styling when error prop is provided', () => {
    render(<AdminInput label="Name" value="" onChange={() => {}} error="Required" />)
    const input = screen.getByRole('textbox')
    expect(input.className).toContain('border-[#ef4444]')
  })

  it('clears error styling when error prop becomes null', () => {
    const { rerender } = render(<AdminInput label="Name" value="" onChange={() => {}} error="Required" />)
    rerender(<AdminInput label="Name" value="" onChange={() => {}} error={null} />)
    expect(screen.queryByText('Required')).not.toBeInTheDocument()
  })
})
```

**Then implement:**
- Add `error` prop to `AdminInput` component
- Show red border + error text below input when `error` is truthy
- Support all input types (text, textarea, select, file)

#### 1.2 Create useFormErrors hook

**Test first** (`tests/hooks/use-form-errors.test.js`):
```js
import { renderHook, act } from '@testing-library/react'
import { useFormErrors } from '@/lib/hooks/use-form-errors'

describe('useFormErrors', () => {
  it('starts with empty errors', () => {
    const { result } = renderHook(() => useFormErrors())
    expect(result.current.errors).toEqual({})
  })

  it('sets field errors from server response', () => {
    const { result } = renderHook(() => useFormErrors())
    act(() => {
      result.current.setFieldErrors({ name: 'กรุณาระบุชื่อ', code: 'กรุณาระบุรหัส' })
    })
    expect(result.current.errors.name).toBe('กรุณาระบุชื่อ')
    expect(result.current.errors.code).toBe('กรุณาระบุรหัส')
  })

  it('clears a specific field error', () => {
    const { result } = renderHook(() => useFormErrors())
    act(() => {
      result.current.setFieldErrors({ name: 'Required' })
      result.current.clearError('name')
    })
    expect(result.current.errors.name).toBeUndefined()
  })

  it('clears all errors', () => {
    const { result } = renderHook(() => useFormErrors())
    act(() => {
      result.current.setFieldErrors({ name: 'A', code: 'B' })
      result.current.clearAll()
    })
    expect(result.current.errors).toEqual({})
  })

  it('getError returns error for a field', () => {
    const { result } = renderHook(() => useFormErrors())
    act(() => {
      result.current.setFieldErrors({ name: 'Error' })
    })
    expect(result.current.getError('name')).toBe('Error')
    expect(result.current.getError('other')).toBeUndefined()
  })
})
```

**Then implement** `src/lib/hooks/use-form-errors.js`:
- `errors` state object
- `setFieldErrors(obj)` — merge field errors from server action response
- `clearError(field)` — clear on input change
- `clearAll()` — clear on form submit
- `getError(field)` — get error for a field

#### 1.3 Wire fieldErrors into admin forms

Wire into these admin pages (pattern: use `useFormErrors` hook, pass `error={formErrors.getError('field')}` to each `AdminInput`, call `clearError` on input change):

- `src/app/(admin)/admin/products/create/page.jsx`
- `src/app/(admin)/admin/products/edit/[id]/ProductEditClient.jsx`
- `src/app/(admin)/admin/blog/create/page.jsx`
- `src/app/(admin)/admin/blog/edit/[id]/BlogEditClient.jsx`
- `src/app/(admin)/admin/banner/edit/[id]/BannerEditClient.jsx`
- `src/app/(admin)/admin/branch/create/page.jsx`
- `src/app/(admin)/admin/faq/create/page.jsx`

#### 1.4 Error Boundary

**Test first** (`tests/components/error-boundary.test.jsx`):
```js
import { render, screen } from '@testing-library/react'
import ErrorBoundary from '@/components/ErrorBoundary'

const ThrowError = () => { throw new Error('Test error') }

describe('ErrorBoundary', () => {
  // Suppress console.error for expected errors
  beforeEach(() => vi.spyOn(console, 'error').mockImplementation(() => {}))
  afterEach(() => vi.restoreAllMocks())

  it('renders children when no error', () => {
    render(<ErrorBoundary><div>Hello</div></ErrorBoundary>)
    expect(screen.getByText('Hello')).toBeInTheDocument()
  })

  it('renders fallback UI on error', () => {
    render(<ErrorBoundary><ThrowError /></ErrorBoundary>)
    expect(screen.getByText(/เกิดข้อผิดพลาด/)).toBeInTheDocument()
  })

  it('shows retry button', () => {
    render(<ErrorBoundary><ThrowError /></ErrorBoundary>)
    expect(screen.getByRole('button', { name: /ลองใหม่/ })).toBeInTheDocument()
  })
})
```

**Then implement:**
- `src/components/ErrorBoundary.jsx` — class component with fallback UI
- Add to `src/app/(admin)/admin/layout.jsx` wrapping `{children}`
- Add to `src/app/(public)/layout.jsx` wrapping `{children}`

#### Files Changed

**New:**
- `tests/components/admin-input.test.jsx`
- `tests/hooks/use-form-errors.test.js`
- `tests/components/error-boundary.test.jsx`
- `src/lib/hooks/use-form-errors.js`
- `src/components/ErrorBoundary.jsx`

**Modified:**
- `src/components/admin/AdminInput.jsx` (add `error` prop)
- `src/app/(admin)/admin/layout.jsx` (add ErrorBoundary)
- `src/app/(public)/layout.jsx` (add ErrorBoundary)
- 7 admin create/edit pages (wire fieldErrors display)

---

## Session 2: Loading States + File Upload Improvements ✅

**Branch:** `ai/phase4-s2-loading-uploads` (4 commits)

### Goal
Add loading skeletons for admin pages. Improve file upload UX.

### TDD Steps

#### 2.1 Admin Skeleton Components

**Test first** (`tests/components/admin-skeleton.test.jsx`):
```js
import { render, screen } from '@testing-library/react'
import { TableSkeleton, FormSkeleton, CardSkeleton } from '@/components/admin/AdminSkeleton'

describe('AdminSkeleton', () => {
  it('TableSkeleton renders correct number of rows', () => {
    const { container } = render(<TableSkeleton rows={5} columns={4} />)
    const rows = container.querySelectorAll('[data-testid="skeleton-row"]')
    expect(rows).toHaveLength(5)
  })

  it('FormSkeleton renders animated pulse elements', () => {
    const { container } = render(<FormSkeleton fields={3} />)
    const pulses = container.querySelectorAll('.animate-pulse')
    expect(pulses.length).toBeGreaterThan(0)
  })

  it('CardSkeleton renders grid of placeholder cards', () => {
    const { container } = render(<CardSkeleton count={6} />)
    const cards = container.querySelectorAll('[data-testid="skeleton-card"]')
    expect(cards).toHaveLength(6)
  })
})
```

**Then implement** `src/components/admin/AdminSkeleton.jsx`:
- `TableSkeleton` — animated rows for list pages
- `FormSkeleton` — animated fields for create/edit pages
- `CardSkeleton` — animated cards for grid views

#### 2.2 Next.js loading.jsx files

Create `loading.jsx` files for admin routes that show skeletons:
- `src/app/(admin)/admin/products/loading.jsx` → `<TableSkeleton rows={10} columns={6} />`
- `src/app/(admin)/admin/blog/loading.jsx`
- `src/app/(admin)/admin/banner/loading.jsx`
- `src/app/(admin)/admin/gallery/loading.jsx`
- `src/app/(admin)/admin/quotations/loading.jsx`
- `src/app/(admin)/admin/users/loading.jsx`
- `src/app/(admin)/admin/dashboard/loading.jsx`

And for public routes:
- `src/app/(public)/products/loading.jsx` → `<CardSkeleton count={12} />`
- `src/app/(public)/blog/loading.jsx`

#### 2.3 File Upload Validation

**Test first** (`tests/lib/upload-validation.test.js`):
```js
import { validateFile, ALLOWED_IMAGE_TYPES, MAX_IMAGE_SIZE } from '@/lib/upload-validation'

describe('validateFile', () => {
  it('accepts valid image file', () => {
    const file = new File(['x'], 'photo.jpg', { type: 'image/jpeg' })
    Object.defineProperty(file, 'size', { value: 1024 * 100 }) // 100KB
    expect(validateFile(file, 'image')).toEqual({ valid: true, error: null })
  })

  it('rejects file exceeding max size', () => {
    const file = new File(['x'], 'huge.jpg', { type: 'image/jpeg' })
    Object.defineProperty(file, 'size', { value: 1024 * 1024 * 11 }) // 11MB
    const result = validateFile(file, 'image')
    expect(result.valid).toBe(false)
    expect(result.error).toContain('ขนาดไฟล์')
  })

  it('rejects invalid image type', () => {
    const file = new File(['x'], 'doc.exe', { type: 'application/x-msdownload' })
    Object.defineProperty(file, 'size', { value: 1024 })
    const result = validateFile(file, 'image')
    expect(result.valid).toBe(false)
    expect(result.error).toContain('ประเภทไฟล์')
  })

  it('accepts PDF for document type', () => {
    const file = new File(['x'], 'manual.pdf', { type: 'application/pdf' })
    Object.defineProperty(file, 'size', { value: 1024 * 500 })
    expect(validateFile(file, 'document')).toEqual({ valid: true, error: null })
  })

  it('exports constants', () => {
    expect(ALLOWED_IMAGE_TYPES).toContain('image/jpeg')
    expect(ALLOWED_IMAGE_TYPES).toContain('image/png')
    expect(ALLOWED_IMAGE_TYPES).toContain('image/webp')
    expect(MAX_IMAGE_SIZE).toBe(10 * 1024 * 1024) // 10MB
  })
})
```

**Then implement** `src/lib/upload-validation.js`:
- `validateFile(file, type)` — returns `{ valid, error }`
- Constants: `ALLOWED_IMAGE_TYPES`, `ALLOWED_DOCUMENT_TYPES`, `MAX_IMAGE_SIZE`, `MAX_DOCUMENT_SIZE`

#### 2.4 Enhanced AdminInput file type with preview

**Test first** (`tests/components/admin-file-input.test.jsx`):
```js
import { render, screen, fireEvent } from '@testing-library/react'
import AdminFileInput from '@/components/admin/AdminFileInput'

describe('AdminFileInput', () => {
  it('shows image preview when file is selected', async () => {
    const onChange = vi.fn()
    render(<AdminFileInput accept="image" onChange={onChange} />)
    // preview area should appear after file selection
  })

  it('shows validation error for invalid file type', () => {
    // ...
  })

  it('shows file size in human-readable format', () => {
    // ...
  })

  it('shows existing image when initialPreview is provided', () => {
    render(<AdminFileInput accept="image" initialPreview="https://example.com/img.jpg" onChange={() => {}} />)
    expect(screen.getByRole('img')).toHaveAttribute('src', 'https://example.com/img.jpg')
  })
})
```

**Then implement** `src/components/admin/AdminFileInput.jsx`:
- Image preview (URL.createObjectURL for local, URL for existing)
- File type/size validation with error display
- Human-readable size display
- Remove/replace button
- Drop zone visual feedback

#### Files Changed

**New:**
- `tests/components/admin-skeleton.test.jsx`
- `tests/lib/upload-validation.test.js`
- `tests/components/admin-file-input.test.jsx`
- `src/components/admin/AdminSkeleton.jsx`
- `src/components/admin/AdminFileInput.jsx`
- `src/lib/upload-validation.js`
- 9 `loading.jsx` files (admin + public routes)

**Modified:**
- Admin create/edit pages that use file uploads (replace `AdminInput type="file"` with `AdminFileInput`)

---

## Session 3: TipTap Rich Text Editor ✅

**Branch:** `ai/phase5-s3-tiptap` (5 commits)

### Goal
Replace the static `RichTextToolbar` placeholder with a functional TipTap editor.

### Dependencies
```bash
npm install @tiptap/react @tiptap/starter-kit @tiptap/extension-image @tiptap/extension-link
```

### TDD Steps

#### 3.1 RichTextEditor component

**Test first** (`tests/components/rich-text-editor.test.jsx`):
```js
import { render, screen } from '@testing-library/react'
import RichTextEditor from '@/components/admin/RichTextEditor'

describe('RichTextEditor', () => {
  it('renders toolbar with formatting buttons', () => {
    render(<RichTextEditor content="" onChange={() => {}} />)
    expect(screen.getByLabelText('Bold')).toBeInTheDocument()
    expect(screen.getByLabelText('Italic')).toBeInTheDocument()
    expect(screen.getByLabelText('Heading 2')).toBeInTheDocument()
  })

  it('renders with initial content', () => {
    render(<RichTextEditor content="<p>Hello</p>" onChange={() => {}} />)
    expect(screen.getByText('Hello')).toBeInTheDocument()
  })

  it('calls onChange when content changes', async () => {
    const onChange = vi.fn()
    render(<RichTextEditor content="" onChange={onChange} />)
    // Type into editor and verify onChange called
  })

  it('renders with custom minHeight', () => {
    const { container } = render(<RichTextEditor content="" onChange={() => {}} minHeight="400px" />)
    const editorArea = container.querySelector('.ProseMirror')
    expect(editorArea).toBeTruthy()
  })
})
```

**Then implement** `src/components/admin/RichTextEditor.jsx`:
- TipTap `useEditor` hook with StarterKit, Image, Link extensions
- Toolbar: Bold, Italic, Heading 2/3, BulletList, OrderedList, Link, Image, Undo/Redo
- `content` prop (HTML string) and `onChange(html)` callback
- Image insertion via URL prompt (future: Supabase upload)
- Link insertion with URL input
- Styled to match existing admin UI (gray borders, IBM Plex Sans Thai)

#### 3.2 Wire into admin pages

**Test first** (`tests/components/rich-text-editor-integration.test.jsx`):
```js
import { render, screen } from '@testing-library/react'
import RichTextEditor from '@/components/admin/RichTextEditor'

describe('RichTextEditor integration', () => {
  it('receives content prop and renders it', () => {
    render(<RichTextEditor content="<p>Existing content</p>" onChange={() => {}} />)
    expect(screen.getByText('Existing content')).toBeInTheDocument()
  })

  it('onChange returns HTML string', () => {
    const onChange = vi.fn()
    render(<RichTextEditor content="" onChange={onChange} />)
    // Editor should call onChange with HTML when content changes
    expect(onChange).toBeDefined()
  })
})
```

**Then implement:** Replace `RichTextToolbar` + static `<div contentEditable>` in:
- `src/app/(admin)/admin/products/create/page.jsx` — description, specs, notes fields
- `src/app/(admin)/admin/products/edit/[id]/ProductEditClient.jsx`
- `src/app/(admin)/admin/blog/create/page.jsx` — blog content field
- `src/app/(admin)/admin/blog/edit/[id]/BlogEditClient.jsx`
- `src/app/(admin)/admin/about-us/page.jsx` — about content field

#### 3.3 SafeHtmlContent component for public pages

**Test first** (`tests/components/safe-html-render.test.jsx`):
```js
import { render, screen } from '@testing-library/react'
import SafeHtmlContent from '@/components/SafeHtmlContent'

describe('SafeHtmlContent', () => {
  it('renders sanitized HTML content', () => {
    render(<SafeHtmlContent html="<p>Hello <strong>world</strong></p>" />)
    expect(screen.getByText('Hello')).toBeInTheDocument()
  })

  it('strips script tags before rendering', () => {
    const { container } = render(<SafeHtmlContent html='<p>Safe</p><script>alert("xss")</script>' />)
    expect(container.innerHTML).not.toContain('script')
    expect(screen.getByText('Safe')).toBeInTheDocument()
  })

  it('renders empty div for null content', () => {
    const { container } = render(<SafeHtmlContent html={null} />)
    expect(container.firstChild).toBeEmptyDOMElement()
  })
})
```

**Then implement** `src/components/SafeHtmlContent.jsx`:
- Uses `sanitizeHtml` before `dangerouslySetInnerHTML`
- Wire into blog detail + product detail pages

#### 3.4 HTML sanitization utility

**Test first** (`tests/lib/sanitize-html.test.js`):
```js
import { sanitizeHtml } from '@/lib/sanitize-html'

describe('sanitizeHtml', () => {
  it('allows safe HTML tags', () => {
    expect(sanitizeHtml('<p>Hello <strong>world</strong></p>')).toBe('<p>Hello <strong>world</strong></p>')
  })

  it('strips script tags', () => {
    expect(sanitizeHtml('<p>Hello</p><script>alert("xss")</script>')).toBe('<p>Hello</p>')
  })

  it('strips event handlers', () => {
    expect(sanitizeHtml('<img src="x" onerror="alert(1)">')).not.toContain('onerror')
  })

  it('allows img with src', () => {
    const result = sanitizeHtml('<img src="https://example.com/img.jpg" alt="test">')
    expect(result).toContain('src="https://example.com/img.jpg"')
  })

  it('allows links with href', () => {
    const result = sanitizeHtml('<a href="https://example.com">link</a>')
    expect(result).toContain('href="https://example.com"')
  })
})
```

**Then implement** `src/lib/sanitize-html.js`:
- Allowlist-based HTML sanitizer for rendering rich text on public pages
- Allow: p, h1-h6, strong, em, ul, ol, li, a, img, br, blockquote
- Strip: script, style, event handlers (on*), javascript: URLs

#### Files Changed

**New:**
- `tests/components/rich-text-editor.test.jsx`
- `tests/components/rich-text-editor-integration.test.jsx`
- `tests/components/safe-html-render.test.jsx`
- `tests/lib/sanitize-html.test.js`
- `src/components/admin/RichTextEditor.jsx`
- `src/components/SafeHtmlContent.jsx`
- `src/lib/sanitize-html.js`

**Modified:**
- `package.json` (add TipTap deps)
- 5 admin pages (replace RichTextToolbar with real editor)
- Public blog/product detail pages (use SafeHtmlContent)

---

## Session 4: Drag-and-Drop Reordering ✅

**Branch:** `ai/phase5-s4-drag-drop` (4 commits, 14 tests)

### Goal
Add drag-and-drop reordering for ordered content (banners, gallery, FAQ, etc.).

### Dependencies
```bash
npm install @dnd-kit/core @dnd-kit/sortable @dnd-kit/utilities
```

Why `@dnd-kit`: Framework-agnostic, lightweight, accessible (keyboard support),
active maintenance, works with React 19. Alternatives: `react-beautiful-dnd`
(deprecated), `pragmatic-drag-and-drop` (heavier).

### TDD Steps

#### 4.1 Reorder utility

**Test first** (`tests/lib/reorder.test.js`):
```js
import { reorderItems, buildSortOrderUpdates } from '@/lib/reorder'

describe('reorderItems', () => {
  it('moves item from index 0 to index 2', () => {
    const items = [{ id: 'a' }, { id: 'b' }, { id: 'c' }]
    const result = reorderItems(items, 0, 2)
    expect(result.map(i => i.id)).toEqual(['b', 'c', 'a'])
  })

  it('returns same array if from === to', () => {
    const items = [{ id: 'a' }, { id: 'b' }]
    const result = reorderItems(items, 0, 0)
    expect(result).toEqual(items)
  })
})

describe('buildSortOrderUpdates', () => {
  it('generates updates with sequential sort_order values', () => {
    const items = [{ id: 'b' }, { id: 'c' }, { id: 'a' }]
    const updates = buildSortOrderUpdates(items)
    expect(updates).toEqual([
      { id: 'b', sort_order: 0 },
      { id: 'c', sort_order: 1 },
      { id: 'a', sort_order: 2 },
    ])
  })
})
```

**Then implement** `src/lib/reorder.js`:
- `reorderItems(items, fromIndex, toIndex)` — pure array reorder
- `buildSortOrderUpdates(items)` — generate `{ id, sort_order }` pairs

#### 4.2 SortableList component

**Test first** (`tests/components/sortable-list.test.jsx`):
```js
import { render, screen } from '@testing-library/react'
import SortableList from '@/components/admin/SortableList'

describe('SortableList', () => {
  const items = [
    { id: '1', name: 'First' },
    { id: '2', name: 'Second' },
    { id: '3', name: 'Third' },
  ]

  it('renders all items', () => {
    render(
      <SortableList items={items} onReorder={() => {}}>
        {(item) => <div>{item.name}</div>}
      </SortableList>
    )
    expect(screen.getByText('First')).toBeInTheDocument()
    expect(screen.getByText('Second')).toBeInTheDocument()
    expect(screen.getByText('Third')).toBeInTheDocument()
  })

  it('renders drag handles', () => {
    render(
      <SortableList items={items} onReorder={() => {}}>
        {(item) => <div>{item.name}</div>}
      </SortableList>
    )
    const handles = screen.getAllByLabelText('ลากเพื่อจัดเรียง')
    expect(handles).toHaveLength(3)
  })
})
```

**Then implement** `src/components/admin/SortableList.jsx`:
- Wraps `@dnd-kit/sortable` with `DndContext` + `SortableContext`
- `SortableItem` with drag handle (grip icon)
- `onReorder(newItems)` callback
- Keyboard accessible (up/down arrows)
- Visual drag overlay

#### 4.3 Wire reorder server actions

Existing server actions already have `reorder` functions. Wire into:
- `src/components/admin/BannersListClient.jsx`
- `src/components/admin/GalleryListClient.jsx`
- `src/components/admin/FaqListClient.jsx`
- `src/components/admin/ManualsListClient.jsx`
- `src/components/admin/VideoHighlightsListClient.jsx`

Pattern: wrap table rows with `SortableList`, call `reorder*` server action on drop.

#### Files Changed

**New:**
- `tests/lib/reorder.test.js`
- `tests/components/sortable-list.test.jsx`
- `src/lib/reorder.js`
- `src/components/admin/SortableList.jsx`

**Modified:**
- `package.json` (add @dnd-kit deps)
- 5 admin list client components (add sortable wrapper)

---

## Session 5: Auth Gaps

**Branch:** `ai/phase5-s5-auth`

### Goal
Wire forgot-password flow and prepare LINE Login integration.

### TDD Steps

#### 5.1 Forgot-password flow

**Test first** (`tests/lib/actions/auth.test.js`):
```js
import { describe, it, expect, vi } from 'vitest'

// Mock Supabase client
vi.mock('@/lib/supabase/server', () => ({
  createClient: vi.fn(() => ({
    auth: {
      resetPasswordForEmail: vi.fn().mockResolvedValue({ error: null }),
      updateUser: vi.fn().mockResolvedValue({ data: { user: {} }, error: null }),
    }
  }))
}))

describe('requestPasswordReset', () => {
  it('requires valid email', async () => {
    const { requestPasswordReset } = await import('@/lib/actions/auth')
    const result = await requestPasswordReset('')
    expect(result.error).toBeTruthy()
  })

  it('calls resetPasswordForEmail with redirect URL', async () => {
    const { requestPasswordReset } = await import('@/lib/actions/auth')
    const result = await requestPasswordReset('admin@test.com')
    expect(result.error).toBeNull()
  })
})
```

**Then implement:**
- `src/lib/actions/auth.js` — `requestPasswordReset(email)` server action
- Wire `src/app/(admin)/login/forgot-password/page.jsx` — form calls action, redirects to `/sent`
- Wire `src/app/(admin)/login/forgot-password/sent/page.jsx` — confirmation message
- Create `src/app/auth/reset-password/route.js` — handle reset callback, redirect to set-new-password page

#### 5.2 LINE Login preparation

**Test first** (`tests/lib/auth/line-config.test.js`):
```js
import { getLineLoginUrl, validateLineCallback } from '@/lib/auth/line-config'

describe('getLineLoginUrl', () => {
  it('generates URL with correct client_id and redirect_uri', () => {
    const url = getLineLoginUrl('test-state')
    expect(url).toContain('access.line.me/oauth2')
    expect(url).toContain('response_type=code')
    expect(url).toContain('state=test-state')
  })
})

describe('validateLineCallback', () => {
  it('rejects missing code', () => {
    expect(() => validateLineCallback({ state: 'x' })).toThrow()
  })

  it('rejects missing state', () => {
    expect(() => validateLineCallback({ code: 'x' })).toThrow()
  })

  it('accepts valid callback params', () => {
    const result = validateLineCallback({ code: 'abc', state: 'xyz' })
    expect(result).toEqual({ code: 'abc', state: 'xyz' })
  })
})
```

**Then implement:**
- `src/lib/auth/line-config.js` — LINE OAuth URL builder, callback validator
- Update `src/app/auth/callback/route.js` — handle LINE provider
- Update `src/components/LoginModal.jsx` — LINE button calls Supabase `signInWithOAuth({ provider: 'line' })`
- Add env vars documentation: `LINE_CHANNEL_ID`, `LINE_CHANNEL_SECRET`

#### Files Changed

**New:**
- `tests/lib/actions/auth.test.js`
- `tests/lib/auth/line-config.test.js`
- `src/lib/actions/auth.js`
- `src/lib/auth/line-config.js`
- `src/app/auth/reset-password/route.js`

**Modified:**
- `src/app/(admin)/login/forgot-password/page.jsx` (wire form)
- `src/app/(admin)/login/forgot-password/sent/page.jsx` (wire message)
- `src/app/auth/callback/route.js` (add LINE handling)
- `src/components/LoginModal.jsx` (wire LINE button)

---

## Session 6: Security Hardening

**Branch:** `ai/phase5-s6-security`

### Goal
Add rate limiting, input sanitization, and audit logging.

### TDD Steps

#### 6.1 Rate limiter (in-memory for now)

**Test first** (`tests/lib/rate-limit.test.js`):
```js
import { createRateLimiter } from '@/lib/rate-limit'

describe('createRateLimiter', () => {
  it('allows requests within limit', () => {
    const limiter = createRateLimiter({ windowMs: 60000, max: 3 })
    expect(limiter.check('user-1').allowed).toBe(true)
    expect(limiter.check('user-1').allowed).toBe(true)
    expect(limiter.check('user-1').allowed).toBe(true)
  })

  it('blocks requests exceeding limit', () => {
    const limiter = createRateLimiter({ windowMs: 60000, max: 2 })
    limiter.check('user-1')
    limiter.check('user-1')
    const result = limiter.check('user-1')
    expect(result.allowed).toBe(false)
    expect(result.retryAfterMs).toBeGreaterThan(0)
  })

  it('tracks limits per key independently', () => {
    const limiter = createRateLimiter({ windowMs: 60000, max: 1 })
    expect(limiter.check('user-1').allowed).toBe(true)
    expect(limiter.check('user-2').allowed).toBe(true)
    expect(limiter.check('user-1').allowed).toBe(false)
  })

  it('resets after window expires', () => {
    vi.useFakeTimers()
    const limiter = createRateLimiter({ windowMs: 1000, max: 1 })
    limiter.check('user-1')
    expect(limiter.check('user-1').allowed).toBe(false)
    vi.advanceTimersByTime(1001)
    expect(limiter.check('user-1').allowed).toBe(true)
    vi.useRealTimers()
  })
})
```

**Then implement** `src/lib/rate-limit.js`:
- `createRateLimiter({ windowMs, max })` — sliding window counter per key
- In-memory Map (sufficient for single-process Next.js dev/preview)
- Apply to login action: 5 attempts per minute per IP
- Apply to password reset: 3 attempts per 15 minutes per email

#### 6.2 Input sanitization

**Test first** (`tests/lib/sanitize.test.js`):
```js
import { sanitizeInput, sanitizeObject } from '@/lib/sanitize'

describe('sanitizeInput', () => {
  it('trims whitespace', () => {
    expect(sanitizeInput('  hello  ')).toBe('hello')
  })

  it('strips null bytes', () => {
    expect(sanitizeInput('hel\x00lo')).toBe('hello')
  })

  it('returns empty string for non-string input', () => {
    expect(sanitizeInput(null)).toBe('')
    expect(sanitizeInput(undefined)).toBe('')
  })

  it('preserves Thai characters', () => {
    expect(sanitizeInput('สวัสดี')).toBe('สวัสดี')
  })
})

describe('sanitizeObject', () => {
  it('sanitizes all string values in an object', () => {
    const input = { name: '  Test  ', count: 5, desc: 'hello\x00' }
    const result = sanitizeObject(input)
    expect(result).toEqual({ name: 'Test', count: 5, desc: 'hello' })
  })
})
```

**Then implement** `src/lib/sanitize.js`:
- `sanitizeInput(str)` — trim, strip null bytes
- `sanitizeObject(obj)` — apply to all string values
- Wire into server actions (before Zod validation)

#### 6.3 Audit logger

**Test first** (`tests/lib/audit.test.js`):
```js
import { buildAuditEntry } from '@/lib/audit'

describe('buildAuditEntry', () => {
  it('creates structured audit entry', () => {
    const entry = buildAuditEntry({
      userId: 'user-123',
      action: 'product.create',
      targetId: 'prod-456',
      details: { name: 'New Product' },
    })
    expect(entry.user_id).toBe('user-123')
    expect(entry.action).toBe('product.create')
    expect(entry.target_id).toBe('prod-456')
    expect(entry.created_at).toBeDefined()
  })

  it('includes IP when provided', () => {
    const entry = buildAuditEntry({
      userId: 'user-123',
      action: 'login',
      ip: '192.168.1.1',
    })
    expect(entry.ip_address).toBe('192.168.1.1')
  })
})
```

**Then implement:**
- `src/lib/audit.js` — `buildAuditEntry()`, `logAudit()` (inserts into `audit_logs` table)
- New migration: `supabase/migrations/004_audit_logs.sql` — create `audit_logs` table
- Wire into critical server actions: login, user invite, quotation status change, product delete

#### Files Changed

**New:**
- `tests/lib/rate-limit.test.js`
- `tests/lib/sanitize.test.js`
- `tests/lib/audit.test.js`
- `src/lib/rate-limit.js`
- `src/lib/sanitize.js`
- `src/lib/audit.js`
- `supabase/migrations/004_audit_logs.sql`

**Modified:**
- `src/app/(admin)/login/page.jsx` (add rate limiting)
- `src/lib/actions/auth.js` (add rate limiting)
- 3–5 critical server action files (add audit logging + sanitization)

---

## Session 7: Test Coverage Expansion

**Branch:** `ai/phase5-s7-tests`

### Goal
Expand unit, integration, and E2E test coverage for existing features.

### Test Plan

#### 7.1 Server Action Unit Tests (mock Supabase)

```
tests/lib/actions/products.test.js    — createProduct, updateProduct validation paths
tests/lib/actions/blog.test.js        — createBlogPost, updateBlogPost validation paths
tests/lib/actions/quotations.test.js  — updateQuotationStatus validation
tests/lib/actions/customer.test.js    — submitQuotation validation
tests/lib/actions/account.test.js     — updatePassword, updateEmail validation
tests/lib/actions/search.test.js      — searchAll query building
```

Pattern for each:
```js
vi.mock('@/lib/supabase/server', () => ({ createClient: vi.fn(() => mockSupabase) }))
vi.mock('@/lib/supabase/admin', () => ({ createServiceClient: vi.fn(() => mockAdmin) }))

describe('createProduct', () => {
  it('returns fieldErrors for invalid input', async () => { ... })
  it('calls supabase.from("products").insert() with valid data', async () => { ... })
  it('handles database error gracefully', async () => { ... })
})
```

#### 7.2 Public Data Layer Tests

```
tests/lib/data/public.test.js — getPublishedProducts, getPublishedBlogPosts, etc.
```

Test query building, error handling, and data transformation.

#### 7.3 Component Tests

```
tests/components/toast.test.jsx         — Toast rendering and auto-dismiss
tests/components/search-overlay.test.jsx — search input, debounce, results display
tests/components/login-modal.test.jsx    — OTP flow steps, form validation
```

#### 7.4 E2E Tests (Playwright)

```
e2e/admin/products-crud.spec.js    — Create, edit, delete product
e2e/admin/blog-crud.spec.js        — Create, edit, publish blog post
e2e/public/product-browse.spec.js  — Browse products, filter by category, view detail
e2e/public/search.spec.js          — Open search, type query, see results, click result
```

#### 7.5 Route Protection Tests

Expand `tests/middleware.test.js`:
```js
it('redirects unauthenticated user from /account to /', () => { ... })
it('redirects customer from /admin to /', () => { ... })
it('allows admin to access /admin/products', () => { ... })
it('allows editor to access /admin/blog', () => { ... })
```

#### Files Changed

**New:** ~20 test files across `tests/` and `e2e/`

**Modified:** None (tests only)

---

## Dependency Summary

### npm Packages to Install

| Session | Package | Version | Purpose |
|---------|---------|---------|---------|
| S3 | `@tiptap/react` | latest | Rich text editor React binding |
| S3 | `@tiptap/starter-kit` | latest | Essential extensions bundle |
| S3 | `@tiptap/extension-image` | latest | Image embedding |
| S3 | `@tiptap/extension-link` | latest | Link insertion |
| S4 | `@dnd-kit/core` | latest | Drag-and-drop primitives |
| S4 | `@dnd-kit/sortable` | latest | Sortable list preset |
| S4 | `@dnd-kit/utilities` | latest | CSS transform utilities |

### Database Migrations

| Session | Migration | Purpose |
|---------|-----------|---------|
| S6 | `004_audit_logs.sql` | Audit logging table |

### Environment Variables

| Session | Variable | Purpose |
|---------|----------|---------|
| S5 | `LINE_CHANNEL_ID` | LINE Login OAuth |
| S5 | `LINE_CHANNEL_SECRET` | LINE Login OAuth |

---

## Execution Order

Sessions can be run in any order, but this sequence is recommended:

```
S1 (Validation UX)     — foundation for all forms
  ↓
S2 (Loading + Uploads)  — UX polish, independent
  ↓
S3 (TipTap)            — rich text, independent
  ↓
S4 (Drag-and-Drop)     — reordering, independent
  ↓
S5 (Auth Gaps)          — needs LINE credentials
  ↓
S6 (Security)           — hardening, independent
  ↓
S7 (Tests)              — runs last, covers everything
```

S1 should go first (other sessions benefit from `useFormErrors`).
S7 should go last (tests cover all prior work).
S2–S6 are independent and can run in any order.

---

## Ralph-Loop Prompts

All prompts use `--max-iterations 50` and `--completion-promise`.

### Session 1 Prompt

`/ralph-loop --max-iterations 50`

```
You are implementing Phase 4 Session 1 for WoodSmith AI — Admin Form Validation UX + Error Boundaries.

## Context
- Phase 1–4 core complete. Branch from main.
- Server actions already return `{ fieldErrors }` from Zod validation (products.js, blog.js, customer.js).
- `AdminInput` component exists but has no `error` prop.
- No error boundaries exist.
- Testing: Vitest + @testing-library/react + jsdom. Tests in `tests/**/*.test.js`.

## TDD Pattern
1. Write test first in `tests/`
2. Run `npm test` — confirm test fails
3. Implement the code
4. Run `npm test` — confirm test passes
5. Commit

## Tasks (in order)

### 1. Extend AdminInput with error prop
- Test: `tests/components/admin-input.test.jsx`
- Implement: add `error` prop to `src/components/admin/AdminInput.jsx`
- Red border + error text below input

### 2. Create useFormErrors hook
- Test: `tests/hooks/use-form-errors.test.js`
- Implement: `src/lib/hooks/use-form-errors.js`
- API: `{ errors, setFieldErrors, clearError, clearAll, getError }`

### 3. Wire fieldErrors into admin forms
- Products create, Products edit, Blog create, Blog edit, Banner edit, Branch create, FAQ create
- Pattern: `const formErrors = useFormErrors()`, pass `error={formErrors.getError('field')}` to AdminInput
- On submit: `if (result.fieldErrors) formErrors.setFieldErrors(result.fieldErrors)`
- On input change: `formErrors.clearError('fieldName')`

### 4. Create ErrorBoundary component
- Test: `tests/components/error-boundary.test.jsx`
- Implement: `src/components/ErrorBoundary.jsx` (class component)
- Add to admin layout and public layout

## Rules
- TDD: write test first, then implement
- `npm run build` must pass after each section
- Commit after each completed task
- Branch: `ai/phase4-s1-validation-ux`
- When done, update `docs/TODO.md`: check off completed items under Phase 4 Remaining

## Completion
When all 4 tasks done, tests pass, build passes:
<promise>PHASE4 S1 VALIDATION UX COMPLETE</promise>
```

### Session 2 Prompt

`/ralph-loop --max-iterations 50`

```
You are implementing Phase 4 Session 2 for WoodSmith AI — Loading States + File Upload Improvements.

## Context
- Branch from main (or latest session branch).
- Admin pages have no loading skeletons.
- `AdminInput type="file"` is a basic dashed border with hidden file input, no preview or validation.
- Testing: Vitest + @testing-library/react.

## TDD Pattern
Write test → confirm fail → implement → confirm pass → commit.

## Tasks (in order)

### 1. Admin Skeleton Components
- Test: `tests/components/admin-skeleton.test.jsx`
- Implement: `src/components/admin/AdminSkeleton.jsx` — TableSkeleton, FormSkeleton, CardSkeleton
- Animated pulse placeholders matching admin layout

### 2. Next.js loading.jsx files
- Create loading.jsx for: products, blog, banner, gallery, quotations, users, dashboard (admin)
- Create loading.jsx for: products, blog (public)
- Each imports from AdminSkeleton or uses simple skeleton

### 3. File Upload Validation utility
- Test: `tests/lib/upload-validation.test.js`
- Implement: `src/lib/upload-validation.js` — validateFile(), constants for types/sizes

### 4. Enhanced AdminFileInput component
- Test: `tests/components/admin-file-input.test.jsx`
- Implement: `src/components/admin/AdminFileInput.jsx`
- Features: image preview, type/size validation, human-readable size, remove button
- Wire into admin create/edit pages that upload files

## Rules
- TDD, `npm run build` must pass, commit after each task
- Branch: `ai/phase4-s2-loading-uploads`
- When done, update `docs/TODO.md`: check off completed items under Phase 4 Remaining

## Completion
<promise>PHASE4 S2 LOADING UPLOADS COMPLETE</promise>
```

### Session 3 Prompt

`/ralph-loop --max-iterations 50`

```
You are implementing Phase 5 Session 3 for WoodSmith AI — TipTap Rich Text Editor.

## Context
- Branch from main. Install: `npm install @tiptap/react @tiptap/starter-kit @tiptap/extension-image @tiptap/extension-link`
- Current rich text is a static `RichTextToolbar()` function rendering SVG buttons that do nothing.
- Used in: products/create, blog/create, about-us
- Content stored as HTML in DB (description, content columns).

## TDD Pattern
Write test → confirm fail → implement → confirm pass → commit.

## Tasks (in order)

### 1. Create RichTextEditor component
- **Test first:** `tests/components/rich-text-editor.test.jsx`
  - Renders toolbar with formatting buttons (Bold, Italic, H2, etc.)
  - Renders with initial HTML content
  - Calls onChange when content changes
  - Renders with custom minHeight
- **Then implement:** `src/components/admin/RichTextEditor.jsx`
  - TipTap with StarterKit + Image + Link
  - Toolbar: Bold, Italic, H2, H3, BulletList, OrderedList, Link, Image, Undo, Redo
  - Props: `content` (HTML), `onChange(html)`, `minHeight`

### 2. Create sanitizeHtml utility
- **Test first:** `tests/lib/sanitize-html.test.js`
  - Allows safe HTML tags (p, strong, em, h2, ul, li, a, img)
  - Strips script tags
  - Strips event handlers (onerror, onclick)
  - Strips javascript: URLs
  - Preserves img src and a href
- **Then implement:** `src/lib/sanitize-html.js`
  - Allowlist: p, h1-6, strong, em, ul, ol, li, a, img, br, blockquote
  - Strip: script, style, on* handlers, javascript: URLs

### 3. Wire into admin pages
- **Test first:** `tests/components/rich-text-editor-integration.test.jsx`
  - RichTextEditor receives content prop and renders it
  - RichTextEditor onChange returns HTML string
  - Editor replaces the old static RichTextToolbar
- **Then implement:** Replace RichTextToolbar in:
  - products/create, products/edit, blog/create, blog/edit, about-us
  - Wire onChange to form state, content prop from DB data

### 4. Wire sanitized HTML into public pages
- **Test first:** `tests/components/safe-html-render.test.jsx`
  - Renders sanitized HTML content
  - Strips dangerous tags before rendering
  - Returns empty div for null/undefined content
- **Then implement:** Create `SafeHtmlContent` component
  - Blog detail: render post.content via SafeHtmlContent
  - Product detail: render description via SafeHtmlContent
  - Uses sanitizeHtml before dangerouslySetInnerHTML

## Rules
- TDD, `npm run build` must pass, commit after each task
- Branch: `ai/phase5-s3-tiptap`
- When done, update `docs/TODO.md`: check off TipTap items under Phase 5

## Completion
<promise>PHASE5 S3 TIPTAP COMPLETE</promise>
```

### Session 4 Prompt

`/ralph-loop --max-iterations 50`

```
You are implementing Phase 5 Session 4 for WoodSmith AI — Drag-and-Drop Reordering.

## Context
- Branch from main. Install: `npm install @dnd-kit/core @dnd-kit/sortable @dnd-kit/utilities`
- Server actions already have `reorder*()` functions (banners, gallery, faqs, manuals, video-highlights).
- Admin list pages use AdminTable but no drag-and-drop.

## TDD Pattern
Write test → confirm fail → implement → confirm pass → commit.

## Tasks (in order)

### 1. Reorder utility
- Test: `tests/lib/reorder.test.js`
- Implement: `src/lib/reorder.js` — reorderItems(), buildSortOrderUpdates()

### 2. SortableList component
- Test: `tests/components/sortable-list.test.jsx`
- Implement: `src/components/admin/SortableList.jsx`
- DndContext + SortableContext, drag handle, keyboard accessible

### 3. Wire into admin list pages
- BannersListClient, GalleryListClient, FaqListClient, ManualsListClient, VideoHighlightsListClient
- Add drag handles, wrap rows with SortableList, call reorder action on drop

## Rules
- TDD, `npm run build` must pass, commit after each task
- Branch: `ai/phase5-s4-drag-drop`
- When done, update `docs/TODO.md`: check off drag-and-drop items under Phase 4 Remaining

## Completion
<promise>PHASE5 S4 DRAG DROP COMPLETE</promise>
```

### Session 5 Prompt

`/ralph-loop --max-iterations 50`

```
You are implementing Phase 5 Session 5 for WoodSmith AI — Auth Gaps.

## Context
- Branch from main.
- Forgot-password pages exist: `/login/forgot-password/page.jsx` and `/sent/page.jsx` but are not wired.
- LINE Login button exists in LoginModal but is not functional.
- Auth callback route exists at `src/app/auth/callback/route.js`.

## TDD Pattern
Write test → confirm fail → implement → confirm pass → commit.

## Tasks (in order)

### 1. Forgot-password server action
- Test: `tests/lib/actions/auth.test.js` (mock Supabase)
- Implement: `src/lib/actions/auth.js` — requestPasswordReset(email)

### 2. Wire forgot-password pages
- Wire form on forgot-password/page.jsx
- Wire confirmation on forgot-password/sent/page.jsx
- Create `src/app/auth/reset-password/route.js` for reset callback

### 3. LINE Login config
- Test: `tests/lib/auth/line-config.test.js`
- Implement: `src/lib/auth/line-config.js` — URL builder, callback validator

### 4. Wire LINE Login
- Update LoginModal — LINE button calls supabase.auth.signInWithOAuth
- Update auth callback route — handle LINE provider

## Rules
- TDD, `npm run build` must pass, commit after each task
- Branch: `ai/phase5-s5-auth`
- When done, update `docs/TODO.md`: check off auth items under Phase 5

## Completion
<promise>PHASE5 S5 AUTH COMPLETE</promise>
```

### Session 6 Prompt

`/ralph-loop --max-iterations 50`

```
You are implementing Phase 5 Session 6 for WoodSmith AI — Security Hardening.

## Context
- Branch from main.
- No rate limiting, sanitization, or audit logging exists.
- Server actions accept FormData and parse directly.
- Login has no brute-force protection.

## TDD Pattern
Write test → confirm fail → implement → confirm pass → commit.

## Tasks (in order)

### 1. Rate limiter
- Test: `tests/lib/rate-limit.test.js`
- Implement: `src/lib/rate-limit.js` — createRateLimiter({ windowMs, max })
- Wire into login action (5/min) and password reset (3/15min)

### 2. Input sanitization
- Test: `tests/lib/sanitize.test.js`
- Implement: `src/lib/sanitize.js` — sanitizeInput(), sanitizeObject()
- Wire into server actions before Zod validation

### 3. Audit logger
- Test: `tests/lib/audit.test.js`
- Implement: `src/lib/audit.js` — buildAuditEntry(), logAudit()
- Migration: `supabase/migrations/004_audit_logs.sql`
- Wire into: login, user invite, quotation status change, product delete

## Rules
- TDD, `npm run build` must pass, commit after each task
- Branch: `ai/phase5-s6-security`
- When done, update `docs/TODO.md`: check off security items under Phase 5

## Completion
<promise>PHASE5 S6 SECURITY COMPLETE</promise>
```

### Session 7 Prompt

`/ralph-loop --max-iterations 50`

```
You are implementing Phase 5 Session 7 for WoodSmith AI — Test Coverage Expansion.

## Context
- Branch from main (or latest session branch).
- 11 existing unit tests in tests/, 4 E2E specs in e2e/.
- Server actions in src/lib/actions/, data layer in src/lib/data/public.js.
- Components in src/components/.

## Goal
Add comprehensive test coverage. Target: all server action validation paths, public data layer, key components, and E2E flows.

## Tasks (in order)

### 1. Server Action tests (mock Supabase)
- tests/lib/actions/products.test.js
- tests/lib/actions/blog.test.js
- tests/lib/actions/quotations.test.js
- tests/lib/actions/customer.test.js
- tests/lib/actions/account.test.js
- tests/lib/actions/search.test.js

### 2. Public data layer tests
- tests/lib/data/public.test.js

### 3. Component tests
- tests/components/toast.test.jsx
- tests/components/search-overlay.test.jsx

### 4. Expanded route protection tests
- tests/middleware.test.js (add customer/editor role cases)

### 5. E2E tests
- e2e/admin/products-crud.spec.js
- e2e/admin/blog-crud.spec.js
- e2e/public/product-browse.spec.js
- e2e/public/search.spec.js

## Rules
- Run `npm test` after each test file is written
- Run `npm run test:e2e` for Playwright tests
- Commit after each test file passes
- Branch: `ai/phase5-s7-tests`
- When done, update `docs/TODO.md`: check off testing items under Phase 5

## Completion
<promise>PHASE5 S7 TESTS COMPLETE</promise>
```
