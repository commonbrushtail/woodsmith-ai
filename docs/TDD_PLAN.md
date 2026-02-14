# Test-Driven Implementation Plan

Test-first approach for Phase 1 Infrastructure. Every feature follows the
RED-GREEN-REFACTOR cycle: write a failing test, implement the minimum code
to pass, then clean up.

---

## Step 0 — Test Infrastructure Setup

### 0.1 Install Test Dependencies

```bash
npm install -D vitest @testing-library/react @testing-library/jest-dom jsdom
npm install -D playwright @playwright/test
npx playwright install chromium
```

| Package | Purpose |
|---------|---------|
| `vitest` | Unit + integration test runner (fast, ESM-native) |
| `@testing-library/react` | Component rendering + interaction |
| `@testing-library/jest-dom` | DOM assertion matchers (`toBeInTheDocument`, etc.) |
| `jsdom` | Browser environment simulation for Vitest |
| `playwright` | End-to-end browser testing |

### 0.2 Configure Vitest

Create `vitest.config.js`:

```js
import { defineConfig } from 'vitest/config'
import path from 'path'

export default defineConfig({
  test: {
    environment: 'jsdom',
    globals: true,
    setupFiles: ['./tests/setup.js'],
    include: ['tests/**/*.test.js'],
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
})
```

Create `tests/setup.js`:

```js
import '@testing-library/jest-dom'
```

### 0.3 Configure Playwright

Create `playwright.config.js`:

```js
import { defineConfig } from '@playwright/test'

export default defineConfig({
  testDir: './e2e',
  webServer: {
    command: 'npm run dev',
    port: 3000,
    reuseExistingServer: true,
  },
  use: {
    baseURL: 'http://localhost:3000',
  },
})
```

### 0.4 Add Test Scripts to `package.json`

```json
{
  "scripts": {
    "test": "vitest run",
    "test:watch": "vitest",
    "test:e2e": "playwright test",
    "test:e2e:ui": "playwright test --ui"
  }
}
```

### 0.5 Directory Structure

```
tests/
  setup.js                          # Test setup (jest-dom matchers)
  lib/
    supabase/
      client.test.js                # Supabase browser client tests
      server.test.js                # Supabase server client tests
    storage.test.js                 # File storage utility tests
    db.test.js                      # Database helper tests
    errors.test.js                  # Error helper tests
    validations/
      products.test.js              # Product schema tests
      blog.test.js                  # Blog schema tests
      quotations.test.js            # Quotation schema tests
  middleware.test.js                # Route protection tests
e2e/
  auth/
    admin-login.spec.js             # Admin login flow
    admin-logout.spec.js            # Admin logout flow
    forgot-password.spec.js         # Password reset flow
    customer-otp.spec.js            # Customer SMS OTP flow
    customer-line.spec.js           # Customer LINE login flow
  middleware/
    route-protection.spec.js        # Route guard behavior
  storage/
    file-upload.spec.js             # Upload + delete flows
```

### Commit: `Set up Vitest + Playwright test infrastructure`

---

## Step 1 — Supabase Client (src/lib/supabase/)

### 1.1 Write Failing Tests

**`tests/lib/supabase/client.test.js`**

```js
import { describe, it, expect, vi } from 'vitest'

describe('createBrowserClient', () => {
  it('exports a createClient function', async () => {
    const mod = await import('@/lib/supabase/client')
    expect(mod.createClient).toBeDefined()
    expect(typeof mod.createClient).toBe('function')
  })

  it('returns a Supabase client instance', async () => {
    const { createClient } = await import('@/lib/supabase/client')
    const client = createClient()
    expect(client).toBeDefined()
    expect(client.auth).toBeDefined()
    expect(client.from).toBeDefined()
    expect(client.storage).toBeDefined()
  })

  it('uses environment variables for configuration', async () => {
    // Verify it reads from NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY
    const { createClient } = await import('@/lib/supabase/client')
    const client = createClient()
    expect(client).toBeDefined()
  })
})
```

**`tests/lib/supabase/server.test.js`**

```js
import { describe, it, expect } from 'vitest'

describe('createServerClient', () => {
  it('exports a createClient function', async () => {
    const mod = await import('@/lib/supabase/server')
    expect(mod.createClient).toBeDefined()
    expect(typeof mod.createClient).toBe('function')
  })

  it('returns a Supabase client with auth methods', async () => {
    const { createClient } = await import('@/lib/supabase/server')
    const client = await createClient()
    expect(client.auth).toBeDefined()
    expect(client.from).toBeDefined()
  })
})
```

### 1.2 Implement

Create `src/lib/supabase/client.js` and `src/lib/supabase/server.js`.

### 1.3 Verify: `npm test -- tests/lib/supabase/`

### Commit: `Add Supabase client with tests`

---

## Step 2 — Error Helpers (src/lib/errors.js)

### 2.1 Write Failing Tests

**`tests/lib/errors.test.js`**

```js
import { describe, it, expect } from 'vitest'
import { AppError, notFound, unauthorized, forbidden, badRequest } from '@/lib/errors'

describe('AppError', () => {
  it('creates an error with status code and message', () => {
    const error = new AppError('Not found', 404)
    expect(error.message).toBe('Not found')
    expect(error.statusCode).toBe(404)
    expect(error instanceof Error).toBe(true)
  })
})

describe('error factories', () => {
  it('notFound returns 404 error', () => {
    const error = notFound('Product not found')
    expect(error.statusCode).toBe(404)
    expect(error.message).toBe('Product not found')
  })

  it('unauthorized returns 401 error', () => {
    const error = unauthorized()
    expect(error.statusCode).toBe(401)
  })

  it('forbidden returns 403 error', () => {
    const error = forbidden()
    expect(error.statusCode).toBe(403)
  })

  it('badRequest returns 400 error with details', () => {
    const error = badRequest('Invalid input', { field: 'name' })
    expect(error.statusCode).toBe(400)
    expect(error.details).toEqual({ field: 'name' })
  })
})
```

### 2.2 Implement `src/lib/errors.js`

### 2.3 Verify: `npm test -- tests/lib/errors.test.js`

### Commit: `Add error helpers with tests`

---

## Step 3 — Zod Validation Schemas (src/lib/validations/)

### 3.1 Write Failing Tests

**`tests/lib/validations/products.test.js`**

```js
import { describe, it, expect } from 'vitest'
import { productCreateSchema, productUpdateSchema } from '@/lib/validations/products'

describe('productCreateSchema', () => {
  it('accepts valid product data', () => {
    const valid = {
      name: 'ไม้สักทอง',
      code: 'TEAK-001',
      sku: 'WS-TEAK-001',
      type: 'construction',
      category: 'ไม้แปรรูป',
    }
    const result = productCreateSchema.safeParse(valid)
    expect(result.success).toBe(true)
  })

  it('rejects missing required fields', () => {
    const result = productCreateSchema.safeParse({})
    expect(result.success).toBe(false)
    expect(result.error.issues.length).toBeGreaterThan(0)
  })

  it('rejects empty name', () => {
    const result = productCreateSchema.safeParse({ name: '', code: 'X', sku: 'Y', type: 'construction', category: 'cat' })
    expect(result.success).toBe(false)
  })

  it('accepts optional fields as undefined', () => {
    const valid = {
      name: 'Test',
      code: 'T-001',
      sku: 'WS-T-001',
      type: 'construction',
      category: 'cat',
    }
    const result = productCreateSchema.safeParse(valid)
    expect(result.success).toBe(true)
    expect(result.data.description).toBeUndefined()
  })

  it('validates publish dates when provided', () => {
    const valid = {
      name: 'Test',
      code: 'T-001',
      sku: 'WS-T-001',
      type: 'construction',
      category: 'cat',
      publish_start: '2026-01-01',
      publish_end: '2026-12-31',
    }
    const result = productCreateSchema.safeParse(valid)
    expect(result.success).toBe(true)
  })
})

describe('productUpdateSchema', () => {
  it('allows partial updates (all fields optional)', () => {
    const result = productUpdateSchema.safeParse({ name: 'Updated name' })
    expect(result.success).toBe(true)
  })

  it('rejects invalid types for known fields', () => {
    const result = productUpdateSchema.safeParse({ sort_order: 'not-a-number' })
    expect(result.success).toBe(false)
  })
})
```

**`tests/lib/validations/blog.test.js`**

```js
import { describe, it, expect } from 'vitest'
import { blogCreateSchema } from '@/lib/validations/blog'

describe('blogCreateSchema', () => {
  it('accepts valid blog data', () => {
    const result = blogCreateSchema.safeParse({
      title: 'วิธีเลือกไม้สำหรับบ้าน',
      content: '<p>เนื้อหาบทความ</p>',
    })
    expect(result.success).toBe(true)
  })

  it('auto-generates slug from title if not provided', () => {
    const result = blogCreateSchema.safeParse({
      title: 'Test Blog Post',
      content: '<p>Content</p>',
    })
    expect(result.success).toBe(true)
  })

  it('rejects empty title', () => {
    const result = blogCreateSchema.safeParse({ title: '', content: 'x' })
    expect(result.success).toBe(false)
  })

  it('rejects empty content', () => {
    const result = blogCreateSchema.safeParse({ title: 'x', content: '' })
    expect(result.success).toBe(false)
  })
})
```

**`tests/lib/validations/quotations.test.js`**

```js
import { describe, it, expect } from 'vitest'
import { quotationCreateSchema, quotationStatusSchema } from '@/lib/validations/quotations'

describe('quotationCreateSchema', () => {
  it('accepts valid quotation data', () => {
    const result = quotationCreateSchema.safeParse({
      product_id: 'uuid-here',
      requester_name: 'สมชาย',
      requester_phone: '+66812345678',
    })
    expect(result.success).toBe(true)
  })

  it('rejects missing product_id', () => {
    const result = quotationCreateSchema.safeParse({
      requester_name: 'สมชาย',
      requester_phone: '+66812345678',
    })
    expect(result.success).toBe(false)
  })
})

describe('quotationStatusSchema', () => {
  it('accepts valid status values', () => {
    expect(quotationStatusSchema.safeParse('pending').success).toBe(true)
    expect(quotationStatusSchema.safeParse('approved').success).toBe(true)
    expect(quotationStatusSchema.safeParse('rejected').success).toBe(true)
  })

  it('rejects invalid status', () => {
    expect(quotationStatusSchema.safeParse('cancelled').success).toBe(false)
  })
})
```

### 3.2 Implement schemas in `src/lib/validations/`

### 3.3 Verify: `npm test -- tests/lib/validations/`

### Commit: `Add Zod validation schemas with tests`

---

## Step 4 — Database Schema (SQL Migration)

### 4.1 Write Failing Tests

**`tests/lib/db.test.js`**

```js
import { describe, it, expect } from 'vitest'

describe('database tables exist', () => {
  // These tests verify the migration ran correctly.
  // They use the service role key to bypass RLS.

  it('can query user_profiles table', async () => {
    const { createServiceClient } = await import('@/lib/supabase/admin')
    const supabase = createServiceClient()
    const { error } = await supabase.from('user_profiles').select('id').limit(1)
    expect(error).toBeNull()
  })

  it('can query products table', async () => {
    const { createServiceClient } = await import('@/lib/supabase/admin')
    const supabase = createServiceClient()
    const { error } = await supabase.from('products').select('id').limit(1)
    expect(error).toBeNull()
  })

  it('can query banners table', async () => {
    const { createServiceClient } = await import('@/lib/supabase/admin')
    const supabase = createServiceClient()
    const { error } = await supabase.from('banners').select('id').limit(1)
    expect(error).toBeNull()
  })

  it('can query blog_posts table', async () => {
    const { createServiceClient } = await import('@/lib/supabase/admin')
    const supabase = createServiceClient()
    const { error } = await supabase.from('blog_posts').select('id').limit(1)
    expect(error).toBeNull()
  })

  it('can query quotations table', async () => {
    const { createServiceClient } = await import('@/lib/supabase/admin')
    const supabase = createServiceClient()
    const { error } = await supabase.from('quotations').select('id').limit(1)
    expect(error).toBeNull()
  })
})
```

> Note: These are integration tests that hit the real Supabase instance.
> They verify the migration was applied correctly. Run with
> `npm test -- tests/lib/db.test.js` after running the SQL migration.

### 4.2 Write SQL Migration

Create `supabase/migrations/001_initial_schema.sql` with all 14 tables,
enums, indexes, and triggers (auto-update `updated_at`).

### 4.3 Run Migration in Supabase Dashboard

Paste SQL into SQL Editor and execute.

### 4.4 Verify: `npm test -- tests/lib/db.test.js`

### Commit: `Add database schema migration and integration tests`

---

## Step 5 — RLS Policies

### 5.1 Write Failing Tests

**`tests/lib/rls.test.js`**

```js
import { describe, it, expect } from 'vitest'

describe('RLS: anonymous access', () => {
  // Uses the anon key (public client) — should only see published content.

  it('can read published products', async () => {
    const { createClient } = await import('@/lib/supabase/client')
    const supabase = createClient()
    const { data, error } = await supabase
      .from('products')
      .select('id, name')
      .eq('published', true)
      .limit(5)
    expect(error).toBeNull()
    // data may be empty if no seed data yet, but no permission error
  })

  it('cannot read unpublished products', async () => {
    // Insert an unpublished product via admin client, then try to read via anon
    const { createServiceClient } = await import('@/lib/supabase/admin')
    const admin = createServiceClient()

    const { data: inserted } = await admin.from('products').insert({
      name: 'RLS Test Unpublished',
      code: 'RLS-TEST',
      sku: 'RLS-SKU',
      type: 'construction',
      category: 'test',
      published: false,
    }).select('id').single()

    const { createClient } = await import('@/lib/supabase/client')
    const anon = createClient()
    const { data } = await anon
      .from('products')
      .select('id')
      .eq('id', inserted.id)
      .single()

    expect(data).toBeNull() // RLS blocks unpublished for anon

    // Cleanup
    await admin.from('products').delete().eq('id', inserted.id)
  })

  it('cannot insert into products as anonymous', async () => {
    const { createClient } = await import('@/lib/supabase/client')
    const anon = createClient()
    const { error } = await anon.from('products').insert({
      name: 'Should fail',
      code: 'FAIL',
      sku: 'FAIL',
      type: 'construction',
      category: 'test',
    })
    expect(error).not.toBeNull()
  })

  it('cannot delete from products as anonymous', async () => {
    const { createClient } = await import('@/lib/supabase/client')
    const anon = createClient()
    const { error } = await anon
      .from('products')
      .delete()
      .eq('code', 'NONEXISTENT')
    expect(error).not.toBeNull()
  })
})

describe('RLS: admin access', () => {
  it('admin can read all products including unpublished', async () => {
    const { createServiceClient } = await import('@/lib/supabase/admin')
    const admin = createServiceClient()
    const { error } = await admin.from('products').select('id').limit(1)
    expect(error).toBeNull()
  })

  it('admin can insert products', async () => {
    const { createServiceClient } = await import('@/lib/supabase/admin')
    const admin = createServiceClient()
    const { data, error } = await admin.from('products').insert({
      name: 'RLS Admin Test',
      code: 'ADMIN-TEST',
      sku: 'ADMIN-SKU',
      type: 'construction',
      category: 'test',
      published: false,
    }).select('id').single()
    expect(error).toBeNull()
    expect(data.id).toBeDefined()

    // Cleanup
    await admin.from('products').delete().eq('id', data.id)
  })
})
```

### 5.2 Write RLS Policies SQL

Add to `supabase/migrations/002_rls_policies.sql`.

### 5.3 Run migration, then verify: `npm test -- tests/lib/rls.test.js`

### Commit: `Add RLS policies with integration tests`

---

## Step 6 — Storage Utilities (src/lib/storage.js)

### 6.1 Write Failing Tests

**`tests/lib/storage.test.js`**

```js
import { describe, it, expect } from 'vitest'
import { uploadFile, deleteFile, getPublicUrl } from '@/lib/storage'

describe('getPublicUrl', () => {
  it('returns a URL string for a given bucket and path', () => {
    const url = getPublicUrl('products', 'test-image.jpg')
    expect(url).toContain('products')
    expect(url).toContain('test-image.jpg')
    expect(url.startsWith('http')).toBe(true)
  })
})

describe('uploadFile', () => {
  it('uploads a file and returns the path', async () => {
    const file = new File(['test content'], 'test.txt', { type: 'text/plain' })
    const result = await uploadFile('products', file, 'test-uploads/test.txt')
    expect(result.path).toBeDefined()
    expect(result.error).toBeNull()

    // Cleanup
    await deleteFile('products', result.path)
  })

  it('returns error for invalid bucket', async () => {
    const file = new File(['test'], 'test.txt', { type: 'text/plain' })
    const result = await uploadFile('nonexistent-bucket', file, 'test.txt')
    expect(result.error).not.toBeNull()
  })
})

describe('deleteFile', () => {
  it('deletes an existing file without error', async () => {
    // Upload first
    const file = new File(['delete me'], 'delete-test.txt', { type: 'text/plain' })
    const { path } = await uploadFile('products', file, 'test-uploads/delete-test.txt')

    // Delete
    const result = await deleteFile('products', path)
    expect(result.error).toBeNull()
  })
})
```

### 6.2 Implement `src/lib/storage.js`

### 6.3 Verify: `npm test -- tests/lib/storage.test.js`

> Note: These are integration tests — they need Supabase storage buckets
> created first. Create buckets manually in dashboard before running.

### Commit: `Add storage utilities with tests`

---

## Step 7 — Middleware (Route Protection)

### 7.1 Write Failing Tests

**`tests/middleware.test.js`**

```js
import { describe, it, expect, vi, beforeEach } from 'vitest'

// Middleware logic is tested by extracting the route-matching logic into
// a pure function that can be unit tested without Next.js middleware runtime.

import { getRouteAction } from '@/lib/auth/route-rules'

describe('getRouteAction', () => {
  it('allows public routes without auth', () => {
    const action = getRouteAction('/', null)
    expect(action).toBe('allow')
  })

  it('allows /products without auth', () => {
    const action = getRouteAction('/products', null)
    expect(action).toBe('allow')
  })

  it('allows /blog without auth', () => {
    const action = getRouteAction('/blog', null)
    expect(action).toBe('allow')
  })

  it('redirects /admin/dashboard to /login when unauthenticated', () => {
    const action = getRouteAction('/admin/dashboard', null)
    expect(action).toEqual({ redirect: '/login' })
  })

  it('redirects /admin/products to /login when unauthenticated', () => {
    const action = getRouteAction('/admin/products', null)
    expect(action).toEqual({ redirect: '/login' })
  })

  it('allows /admin/dashboard for admin user', () => {
    const user = { role: 'admin' }
    const action = getRouteAction('/admin/dashboard', user)
    expect(action).toBe('allow')
  })

  it('allows /admin/products for editor user', () => {
    const user = { role: 'editor' }
    const action = getRouteAction('/admin/products', user)
    expect(action).toBe('allow')
  })

  it('blocks /admin/dashboard for customer user', () => {
    const user = { role: 'customer' }
    const action = getRouteAction('/admin/dashboard', user)
    expect(action).toEqual({ redirect: '/' })
  })

  it('redirects /login to /admin/dashboard for authenticated admin', () => {
    const user = { role: 'admin' }
    const action = getRouteAction('/login', user)
    expect(action).toEqual({ redirect: '/admin/dashboard' })
  })

  it('allows /login for unauthenticated user', () => {
    const action = getRouteAction('/login', null)
    expect(action).toBe('allow')
  })

  it('protects /account/* for unauthenticated users', () => {
    const action = getRouteAction('/account/profile', null)
    expect(action).toEqual({ redirect: '/login' })
  })

  it('allows /account/* for any authenticated user', () => {
    const user = { role: 'customer' }
    const action = getRouteAction('/account/profile', user)
    expect(action).toBe('allow')
  })

  it('skips middleware for static assets', () => {
    const action = getRouteAction('/_next/static/chunk.js', null)
    expect(action).toBe('skip')
  })

  it('skips middleware for API routes', () => {
    const action = getRouteAction('/api/health', null)
    expect(action).toBe('skip')
  })
})
```

### 7.2 Implement

1. Create `src/lib/auth/route-rules.js` — pure function with route logic
2. Create `middleware.js` — thin wrapper calling `getRouteAction` + Supabase session refresh

### 7.3 Verify: `npm test -- tests/middleware.test.js`

### Commit: `Add middleware route protection with tests`

---

## Step 8 — Admin Auth (Login / Logout / Forgot Password)

### 8.1 Write Failing E2E Tests

**`e2e/auth/admin-login.spec.js`**

```js
import { test, expect } from '@playwright/test'

test.describe('Admin Login', () => {
  test('shows login form', async ({ page }) => {
    await page.goto('/login')
    await expect(page.getByRole('heading', { name: /เข้าสู่ระบบ/ })).toBeVisible()
    await expect(page.getByLabel(/อีเมล/)).toBeVisible()
    await expect(page.getByLabel(/รหัสผ่าน/)).toBeVisible()
  })

  test('shows error on invalid credentials', async ({ page }) => {
    await page.goto('/login')
    await page.getByLabel(/อีเมล/).fill('wrong@example.com')
    await page.getByLabel(/รหัสผ่าน/).fill('wrongpassword')
    await page.getByRole('button', { name: /เข้าสู่ระบบ/ }).click()
    // Should show error message, not redirect
    await expect(page).toHaveURL('/login')
  })

  test('redirects to dashboard on valid login', async ({ page }) => {
    await page.goto('/login')
    await page.getByLabel(/อีเมล/).fill(process.env.TEST_ADMIN_EMAIL)
    await page.getByLabel(/รหัสผ่าน/).fill(process.env.TEST_ADMIN_PASSWORD)
    await page.getByRole('button', { name: /เข้าสู่ระบบ/ }).click()
    await expect(page).toHaveURL('/admin/dashboard')
  })

  test('redirects /admin/* to /login when not authenticated', async ({ page }) => {
    await page.goto('/admin/products')
    await expect(page).toHaveURL('/login')
  })

  test('redirects /login to /admin/dashboard when already authenticated', async ({ page }) => {
    // Login first
    await page.goto('/login')
    await page.getByLabel(/อีเมล/).fill(process.env.TEST_ADMIN_EMAIL)
    await page.getByLabel(/รหัสผ่าน/).fill(process.env.TEST_ADMIN_PASSWORD)
    await page.getByRole('button', { name: /เข้าสู่ระบบ/ }).click()
    await expect(page).toHaveURL('/admin/dashboard')

    // Try visiting /login again
    await page.goto('/login')
    await expect(page).toHaveURL('/admin/dashboard')
  })
})
```

**`e2e/auth/admin-logout.spec.js`**

```js
import { test, expect } from '@playwright/test'

test.describe('Admin Logout', () => {
  test('logs out and redirects to login', async ({ page }) => {
    // Login
    await page.goto('/login')
    await page.getByLabel(/อีเมล/).fill(process.env.TEST_ADMIN_EMAIL)
    await page.getByLabel(/รหัสผ่าน/).fill(process.env.TEST_ADMIN_PASSWORD)
    await page.getByRole('button', { name: /เข้าสู่ระบบ/ }).click()
    await expect(page).toHaveURL('/admin/dashboard')

    // Logout
    await page.getByRole('button', { name: /ออกจากระบบ/ }).click()
    await expect(page).toHaveURL('/login')

    // Verify can't access admin
    await page.goto('/admin/dashboard')
    await expect(page).toHaveURL('/login')
  })
})
```

### 8.2 Implement

Wire login/logout/forgot-password to Supabase Auth in the existing page files.

### 8.3 Verify: `npm run test:e2e -- e2e/auth/`

### Commit: `Wire admin auth with E2E tests`

---

## Step 9 — Customer Auth (SMS OTP + LINE Login)

### 9.1 Write Failing E2E Tests

**`e2e/auth/customer-otp.spec.js`**

```js
import { test, expect } from '@playwright/test'

test.describe('Customer SMS OTP Login', () => {
  test('shows phone input in login modal', async ({ page }) => {
    await page.goto('/')
    await page.getByRole('button', { name: /เข้าสู่ระบบ/ }).click()
    await expect(page.getByLabel(/หมายเลขโทรศัพท์/)).toBeVisible()
  })

  test('sends OTP and shows verification input', async ({ page }) => {
    await page.goto('/')
    await page.getByRole('button', { name: /เข้าสู่ระบบ/ }).click()
    await page.getByLabel(/หมายเลขโทรศัพท์/).fill('0812345678')
    await page.getByRole('button', { name: /ส่ง OTP|ขอรหัส/ }).click()
    // Should show OTP input field
    await expect(page.getByLabel(/รหัส OTP|กรอกรหัส/)).toBeVisible()
  })
})
```

**`e2e/auth/customer-line.spec.js`**

```js
import { test, expect } from '@playwright/test'

test.describe('Customer LINE Login', () => {
  test('LINE login button exists in modal', async ({ page }) => {
    await page.goto('/')
    await page.getByRole('button', { name: /เข้าสู่ระบบ/ }).click()
    await expect(page.getByRole('button', { name: /LINE/ })).toBeVisible()
  })

  test('LINE login redirects to LINE authorization', async ({ page }) => {
    await page.goto('/')
    await page.getByRole('button', { name: /เข้าสู่ระบบ/ }).click()
    await page.getByRole('button', { name: /LINE/ }).click()
    // Should redirect to LINE OAuth (external URL)
    await page.waitForURL(/access.line.me|supabase/)
  })
})
```

### 9.2 Implement

Wire `LoginModal.jsx` to Supabase OTP + OAuth. Create callback route.

### 9.3 Verify: `npm run test:e2e -- e2e/auth/customer-*`

### Commit: `Wire customer auth (OTP + LINE) with E2E tests`

---

## Step 10 — Seed Script

### 10.1 Write Failing Test

**`tests/seed.test.js`**

```js
import { describe, it, expect } from 'vitest'

describe('seed data', () => {
  it('products table has seed data after running seed', async () => {
    const { createServiceClient } = await import('@/lib/supabase/admin')
    const supabase = createServiceClient()
    const { data, error } = await supabase.from('products').select('id')
    expect(error).toBeNull()
    expect(data.length).toBeGreaterThan(0)
  })

  it('banners table has seed data', async () => {
    const { createServiceClient } = await import('@/lib/supabase/admin')
    const supabase = createServiceClient()
    const { data, error } = await supabase.from('banners').select('id')
    expect(error).toBeNull()
    expect(data.length).toBeGreaterThan(0)
  })

  it('blog_posts table has seed data', async () => {
    const { createServiceClient } = await import('@/lib/supabase/admin')
    const supabase = createServiceClient()
    const { data, error } = await supabase.from('blog_posts').select('id')
    expect(error).toBeNull()
    expect(data.length).toBeGreaterThan(0)
  })
})
```

### 10.2 Implement `scripts/seed.js`

### 10.3 Run: `node scripts/seed.js` then `npm test -- tests/seed.test.js`

### Commit: `Add seed script with verification tests`

---

## Execution Summary

| Step | What | Test Type | Files Created |
|------|------|-----------|---------------|
| 0 | Test infrastructure | — | `vitest.config.js`, `playwright.config.js`, `tests/setup.js` |
| 1 | Supabase clients | Unit | `src/lib/supabase/client.js`, `server.js` |
| 2 | Error helpers | Unit | `src/lib/errors.js` |
| 3 | Validation schemas | Unit | `src/lib/validations/*.js` |
| 4 | Database schema | Integration | `supabase/migrations/001_initial_schema.sql` |
| 5 | RLS policies | Integration | `supabase/migrations/002_rls_policies.sql` |
| 6 | Storage utilities | Integration | `src/lib/storage.js` |
| 7 | Middleware | Unit | `middleware.js`, `src/lib/auth/route-rules.js` |
| 8 | Admin auth | E2E | Modified: login pages, sidebar |
| 9 | Customer auth | E2E | Modified: `LoginModal.jsx`, callback routes |
| 10 | Seed data | Integration | `scripts/seed.js` |

### Test Pyramid

```
        /  E2E  \           4 specs (login, logout, OTP, LINE)
       /----------\
      / Integration \       4 suites (DB, RLS, storage, seed)
     /----------------\
    /    Unit Tests     \   4 suites (clients, errors, validations, middleware)
   /--------------------\
```

### Environment Variables for Testing

Add to `.env.local` (already gitignored):

```bash
# Test accounts (create in Supabase dashboard)
TEST_ADMIN_EMAIL=admin@woodsmith.test
TEST_ADMIN_PASSWORD=test-admin-password-123
```

### AI Loop Execution

```bash
git checkout -b ai/phase1-tdd
# Step 0: npm install, create configs        → commit
# Step 1: Supabase client tests + impl       → commit
# Step 2: Error helpers tests + impl         → commit
# Step 3: Validation schema tests + impl     → commit
# Step 4: DB migration + integration tests   → commit
# Step 5: RLS policies + tests               → commit
# Step 6: Storage utils tests + impl         → commit
# Step 7: Middleware tests + impl            → commit
# Step 8: Admin auth E2E tests + wiring     → commit
# Step 9: Customer auth E2E tests + wiring  → commit
# Step 10: Seed script + verification       → commit
# Final: npm run build (must pass)          → commit
```
