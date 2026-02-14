# Testing Patterns

**Analysis Date:** 2026-02-15

## Test Framework

**Runner:**
- Vitest 4.0.18
- Config: `vitest.config.js`
- Environment: jsdom (browser simulation)
- Setup file: `tests/setup.js` (imports `@testing-library/jest-dom`)

**Assertion Library:**
- Vitest built-in: `expect()`
- Testing Library matchers via `@testing-library/jest-dom`

**Run Commands:**
```bash
npm test              # Run all tests once
npm run test:watch   # Run tests in watch mode
npm run test:e2e     # Run Playwright E2E tests
npm run test:e2e:ui  # Run E2E tests with UI
```

## Test File Organization

**Location:**
- Co-located: `/tests/` directory mirrors `/src/` structure
- Tests for `src/lib/actions/` live in `tests/lib/actions/`
- Tests for `src/components/` live in `tests/components/`
- Tests for `src/lib/hooks/` live in `tests/hooks/`

**Naming:**
- Pattern: `<module>.test.js` (e.g., `sanitize.test.js`, `products.test.js`)
- E2E tests: `<feature>.spec.js` (e.g., `admin-login.spec.js`, `customer-otp.spec.js`)

**Structure:**
```
tests/
├── setup.js              # Vitest setup (imports jest-dom)
├── components/
│   ├── Toast.test.js
│   └── SearchOverlay.test.js
├── hooks/
│   └── use-form-errors.test.js
├── lib/
│   ├── actions/          # Server action tests
│   ├── auth/             # Auth-specific tests
│   └── data/             # Public data-fetching tests
└── e2e/
    ├── auth/
    │   ├── admin-login.spec.js
    │   ├── admin-logout.spec.js
    │   ├── customer-line.spec.js
    │   └── customer-otp.spec.js
    ├── middleware/
    └── storage/
```

**Total Tests:** 30 test files, ~202 test cases (199 pass, 3 pre-existing validation failures)

## Test Structure

**Suite Organization:**
```javascript
import { describe, it, expect, vi, beforeEach } from 'vitest'

describe('FunctionName', () => {
  it('does something specific', () => {
    // Arrange
    const input = ...
    // Act
    const result = ...
    // Assert
    expect(result).toBe(...)
  })

  it('handles error case', () => {
    expect(() => {
      functionName(invalidInput)
    }).toThrow('expected error')
  })
})
```

**Patterns:**
- `describe()` groups related tests by function/component name
- `it()` describes specific behavior (present tense: "does X", "returns Y", "throws error")
- `beforeEach()` setup before each test
- `afterEach()` cleanup after each test (rare; vi.clearAllMocks() preferred)

**Example from `tests/lib/sanitize.test.js`:**
```javascript
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
    expect(sanitizeInput(123)).toBe('')
  })

  it('preserves Thai characters', () => {
    expect(sanitizeInput('สวัสดี')).toBe('สวัสดี')
  })
})
```

## Mocking

**Framework:** Vitest's `vi` module

**Patterns:**

### Module Mocking
```javascript
// Mock entire module
vi.mock('@/lib/supabase/server', () => ({
  createClient: vi.fn(async () => mockServerClient),
}))

// Mock multiple related modules
const mockRevalidatePath = vi.fn()
vi.mock('next/cache', () => ({
  revalidatePath: (...args) => mockRevalidatePath(...args),
}))
```

### Mock Setup and Cleanup
```javascript
beforeEach(() => {
  vi.clearAllMocks()  // Reset all mock call counts/state

  mockAdminQueryChain = createQueryChain()
  mockAdmin = { from: vi.fn(() => mockAdminQueryChain) }
})
```

### Query Chain Mocking (Supabase)
Supabase queries are chainable and thenable. Tests mock this pattern:
```javascript
function createQueryChain(finalResult = { data: null, error: null, count: 0 }) {
  const chain = {}
  const methods = ['select', 'insert', 'update', 'delete', 'eq', 'or', 'ilike', 'order', 'range', 'single', 'limit']
  for (const m of methods) {
    chain[m] = vi.fn(() => chain)  // Each method returns chain for chaining
  }
  chain.then = (resolve) => resolve(finalResult)  // Make thenable
  return chain
}

// Usage in test:
mockAdminQueryChain = createQueryChain({ data: posts, count: 1, error: null })
mockAdmin.from = vi.fn(() => mockAdminQueryChain)

const { getBlogPosts } = await import('@/lib/actions/blog')
const result = await getBlogPosts({ page: 1 })
expect(result.data).toEqual(posts)
```

### Mock Return Values
```javascript
// Resolved value for async function
mockResetPasswordForEmail.mockResolvedValue({ error: null })

// Multiple calls with different values
const results = [
  mockResolvedValue({ data: { user: {} }, error: null }),
  mockResolvedValue({ data: null, error: { message: 'timeout' } }),
]

// Check if called with specific arguments
expect(mockResetPasswordForEmail).toHaveBeenCalledWith(
  'admin@woodsmith.co.th',
  expect.objectContaining({
    redirectTo: expect.stringContaining('/auth/reset-password'),
  })
)
```

### Form Data Mocking
```javascript
function fakeFormData(obj) {
  const map = new Map(Object.entries(obj))
  return {
    get: (key) => (map.has(key) ? map.get(key) : null),
    has: (key) => map.has(key),
  }
}

// Usage:
const formData = fakeFormData({
  name: 'Product Name',
  code: 'CODE001',
  sku: 'SKU-001',
})
await createProduct(formData)
```

**What to Mock:**
- External dependencies: Supabase clients, Next.js APIs (`next/cache`, `next/headers`)
- File I/O and storage operations
- Time-dependent functions (rarely needed)
- Network calls (always mock Supabase)

**What NOT to Mock:**
- Pure utility functions (test them directly): `sanitizeInput()`, `reorderItems()`
- Custom error classes
- Validation schemas (test actual Zod schemas)
- Components that are being tested (render them directly)

## Fixtures and Factories

**Test Data:**
No dedicated fixture files; test data created inline in test files:
```javascript
// Toast test
mockToasts = [
  { id: 1, type: 'success', message: 'บันทึกสำเร็จ' },
  { id: 2, type: 'error', message: 'เกิดข้อผิดพลาด' },
]

// Products test
const posts = [{ id: '1', title: 'Post 1' }]
mockAdminQueryChain = createQueryChain({ data: posts, count: 1, error: null })
```

**Factory Functions (helpers):**
- `createQueryChain()` — creates mock Supabase query chain
- `fakeFormData()` — creates FormData-like mock object
- Error factories: `notFound()`, `unauthorized()`, `forbidden()`, `badRequest()`

**Location:**
- Inline in test file at top, after imports and mocks
- Reused across multiple tests via beforeEach/describe blocks

## Coverage

**Requirements:** Not enforced (no coverage threshold configured)

**View Coverage:**
```bash
npm test -- --coverage  # Not configured in vitest.config.js, would need addition
```

Current approach: Rely on manual testing and E2E tests for coverage verification.

## Test Types

**Unit Tests (Vitest):**
- **Scope:** Single function/component in isolation
- **Approach:** Mock all external dependencies
- **Examples:**
  - `tests/lib/sanitize.test.js` — pure input sanitization
  - `tests/lib/errors.test.js` — error factory functions
  - `tests/lib/reorder.test.js` — array reordering utility
  - `tests/lib/rate-limit.test.js` — rate limiting logic
  - `tests/hooks/use-form-errors.test.js` — form error hook

**Integration Tests (Vitest + Supabase mocks):**
- **Scope:** Server action + mocked Supabase interaction
- **Approach:** Mock Supabase query chains; test full action flow
- **Examples:**
  - `tests/lib/actions/products.test.js` — getProducts(), createProduct(), etc.
  - `tests/lib/actions/blog.test.js` — blog CRUD operations
  - `tests/lib/actions/auth.test.js` — password reset, login flows
  - `tests/lib/data/public.test.js` — public data-fetching with RLS

**Component Tests (Vitest + React Testing Library):**
- **Scope:** Component rendering and user interaction
- **Approach:** Render component, query DOM, simulate clicks
- **Examples:**
  - `tests/components/Toast.test.js` — ToastContainer rendering and removal
  - `tests/components/SearchOverlay.test.js` — search overlay behavior

**E2E Tests (Playwright):**
- **Scope:** Full user workflows across browser
- **Approach:** Navigate page, fill forms, verify redirects and UI state
- **Examples:**
  - `e2e/auth/admin-login.spec.js` — login form, credentials, redirect to dashboard
  - `e2e/auth/customer-otp.spec.js` — OTP flow
  - `e2e/auth/customer-line.spec.js` — LINE Login flow
- **Config:** `playwright.config.js` (uses dev server on port 3000)

## Common Patterns

**Async Testing:**
```javascript
describe('requestPasswordReset', () => {
  it('calls resetPasswordForEmail with redirect URL for valid email', async () => {
    const { requestPasswordReset } = await import('@/lib/actions/auth')
    const result = await requestPasswordReset('admin@woodsmith.co.th')

    expect(result.error).toBeNull()
    expect(mockResetPasswordForEmail).toHaveBeenCalledWith(
      'admin@woodsmith.co.th',
      expect.objectContaining({
        redirectTo: expect.stringContaining('/auth/reset-password'),
      })
    )
  })
})
```

**Error Testing:**
```javascript
it('returns error for invalid email format', async () => {
  const { requestPasswordReset } = await import('@/lib/actions/auth')
  const result = await requestPasswordReset('not-an-email')

  expect(result.error).toBeTruthy()
  expect(mockResetPasswordForEmail).not.toHaveBeenCalled()
})

// Or for throwing functions:
it('throws error for missing parameter', () => {
  expect(() => {
    functionThatThrows()
  }).toThrow('expected message')
})
```

**Component Testing (Testing Library):**
```javascript
import { render, screen, fireEvent } from '@testing-library/react'

it('calls removeToast when close button is clicked', () => {
  mockToasts = [{ id: 42, type: 'success', message: 'Close me' }]
  render(createElement(ToastContainer))

  const closeButton = screen.getByRole('button')
  fireEvent.click(closeButton)

  expect(mockRemoveToast).toHaveBeenCalledWith(42)
})
```

**Playwright E2E:**
```javascript
import { test, expect } from '@playwright/test'

test.describe('Admin Login', () => {
  test('redirects to dashboard on valid login', async ({ page }) => {
    await page.goto('/login')
    await page.locator('input[type="email"]').fill('admin@woodsmith.test')
    await page.locator('input[type="password"]').fill('test-admin-password-123')
    await page.getByRole('button', { name: /เข้าสู่ระบบ/ }).click()

    await expect(page).toHaveURL('/admin/dashboard', { timeout: 15000 })
  })
})
```

---

*Testing analysis: 2026-02-15*
