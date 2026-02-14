# Coding Conventions

**Analysis Date:** 2026-02-15

## Naming Patterns

**Files:**
- Components: PascalCase (e.g., `AdminButton.jsx`, `ToastContainer.jsx`)
- Utilities/helpers: camelCase (e.g., `sanitize.js`, `reorder.js`, `audit.js`)
- Hooks: kebab-case prefixed with `use-` (e.g., `use-form-errors.js`)
- Actions: camelCase (e.g., `products.js`, `blog.js`, `auth.js`)
- Styles: Tailwind utilities — no separate CSS modules

**Functions:**
- camelCase for all function names
- Exported factory functions (e.g., `notFound()`, `unauthorized()`, `badRequest()`)
- Async functions clearly named (e.g., `getProducts()`, `createProduct()`, `updateBlog()`)
- Hook functions prefixed with `use` (e.g., `useFormErrors()`, `useToast()`)

**Variables:**
- camelCase for variables and constants
- Uppercase CONSTANTS rarely used (prefer camelCase)
- Query chains: `mockAdminQueryChain`, `mockServerClient` pattern in tests
- Descriptive names: `from`/`to` for pagination, `perPage` for pagination limit

**Types (JSDoc-like patterns):**
- No TypeScript; uses JSDoc for documentation
- Component props described in default parameters: `function AdminButton({ variant = 'primary', children, ... })`
- Function documentation via JSDoc blocks with `@param`, `@returns`, `@details`

## Code Style

**Formatting:**
- ESLint 9.39.1 with `@eslint/js` (flat config)
- No Prettier enforced; relies on ESLint for linting
- Indentation: 2 spaces (implicit in codebase patterns)
- Line length: No hard limit enforced

**Linting:**
- Config: `/c/Users/commo/OneDrive/Documents/GitHub/woodsmith-ai/eslint.config.js`
- Rules:
  - `no-unused-vars`: Error, but ignores PascalCase variables (React components, type-like patterns)
  - React Hooks recommended rules enabled
  - React Refresh recommended rules enabled (Vite-compatible)
- Ignored: `dist/` directory

**Line Breaking:**
- JSX attributes on separate lines for readability
- Long className strings: kept inline but with formatting clarity
- Objects: multiline for readability (e.g., mock setups in tests)

## Import Organization

**Order:**
1. External packages (e.g., `'use server'`, `'use client'`, React, Next.js)
2. Internal absolute imports via `@/` alias (e.g., `@/lib/`, `@/components/`)
3. Relative imports (rare in this codebase)

**Path Aliases:**
- `@/` resolves to `src/` directory
- Configured in `vitest.config.js`: `alias: { '@': path.resolve(__dirname, './src') }`
- Used consistently in actions, components, and tests

**Example pattern:**
```javascript
'use server'  // Directive first

import { revalidatePath } from 'next/cache'
import { createClient } from '@/lib/supabase/server'
import { productCreateSchema } from '@/lib/validations/products'
import { sanitizeObject } from '@/lib/sanitize'
```

## Error Handling

**Patterns:**
- Custom `AppError` class in `src/lib/errors.js` with statusCode and optional details
- Factory functions: `notFound()`, `unauthorized()`, `forbidden()`, `badRequest()`
- Pattern: Return `{ data: null, error: error.message }` from server actions
- Console error logging for audit/non-blocking failures: `console.error('Audit log error:', error.message)`

**Example:**
```javascript
export class AppError extends Error {
  constructor(message, statusCode, details = null) {
    super(message)
    this.statusCode = statusCode
    this.details = details
    this.name = 'AppError'
  }
}

export function notFound(message = 'Not found') {
  return new AppError(message, 404)
}
```

**Server Action pattern:**
```javascript
export async function getProduct(id) {
  const { data, error } = await supabase.from('products').eq('id', id).single()
  if (error) {
    return { data: null, error: error.message }
  }
  return { data, error: null }
}
```

## Logging

**Framework:** `console.error()` and `console.log()` only (no external logger)

**Patterns:**
- Error logging: `console.error('context:', error.message)` for unexpected failures
- Fire-and-forget: Audit logging does not throw on error to avoid disrupting main action
- Example from `src/lib/audit.js`:
  ```javascript
  export async function logAudit(params) {
    try {
      // ... audit logic
      if (error) {
        console.error('Audit log error:', error.message)
      }
    } catch (err) {
      console.error('Audit log exception:', err)
    }
  }
  ```

**When to log:**
- Unexpected errors only (validation errors are returned, not logged)
- Non-critical operations (audit logs, analytics)
- Debug patterns rarely used (no debug logs found in codebase)

## Comments

**When to Comment:**
- JSDoc for public functions: explain purpose, parameters, return value
- Inline comments sparingly: only for non-obvious logic (1 found: `// Generate quotation number: QT-YYYYMMDD-XXXX`)
- No TODO/FIXME comments in production code (found 1 in audit)

**JSDoc/TSDoc:**
- All exported functions documented with `@param`, `@returns`
- Example:
  ```javascript
  /**
   * Build a structured audit log entry.
   *
   * @param {{ userId: string, action: string, targetId?: string, details?: object, ip?: string }} params
   * @returns {{ user_id: string, action: string, target_id: string|null, ... }}
   */
  export function buildAuditEntry({ userId, action, targetId, details, ip }) {
    // ...
  }
  ```

## Function Design

**Size:**
- Most functions: 10-50 lines
- Server actions: 30-80 lines (include validation, Supabase calls, error handling)
- Large functions broken into smaller utilities (e.g., `reorderItems()` + `buildSortOrderUpdates()`)

**Parameters:**
- Destructuring preferred: `function AdminButton({ variant = 'primary', children, ... })`
- Default parameters used for optional values
- Server actions accept `formData` or plain objects (destructured)
- No spread operators in function signatures

**Return Values:**
- Functions return objects: `{ data, error: null }` pattern (success) or `{ data: null, error: errorMessage }`
- No throwing in server actions — return errors as objects
- Components return JSX directly

## Module Design

**Exports:**
- Named exports rarely used; default exports for components
- Multiple exports in utility/action files (e.g., `getProduct()`, `createProduct()`, `updateProduct()` in same file)
- Example from `src/lib/actions/products.js`:
  ```javascript
  export async function getProducts({ page = 1, perPage = 10, search = '', sortAsc = true } = {}) { ... }
  export async function getProduct(id) { ... }
  export async function createProduct(formData) { ... }
  ```

**Barrel Files:**
- No barrel files (`index.js` exports) used in codebase
- Imports always specify exact file path: `from '@/lib/sanitize'` not `from '@/lib'`

**File Organization:**
- One primary responsibility per file
- Admin shared components grouped: `src/components/admin/AdminButton.jsx`, `AdminInput.jsx`, etc.
- Utilities by domain: `src/lib/actions/`, `src/lib/validations/`, `src/lib/supabase/`

## Tailwind/CSS Conventions

**Token Classes (Design System):**
- Use `@theme` tokens in `src/app/globals.css`:
  - `text-orange`, `bg-orange` for brand primary
  - `text-black`, `bg-black` for body/headings
  - `text-grey`, `bg-grey` for secondary
  - `text-brown`, `bg-brown` for accents
  - `bg-beige` for section backgrounds
  - `bg-dark` for footer
- Never hardcode hex values in components — use token classes
- Example: `className="bg-orange text-white"` not `className="bg-[#ff7e1b] text-[#fff]"`

**Layout:**
- Container width: `max-w-[1212px]`
- Mobile-first design; breakpoint: `lg:` for desktop
- Spacing: Tailwind defaults (4px units: px-[16px], py-[8px], gap-[10px])
- Border color standard: `border-[#e5e7eb]` (Tailwind gray-200)

**Dynamic styling:**
- Variant pattern in components:
  ```javascript
  const variantClasses = {
    primary: 'bg-orange text-white hover:bg-orange/90',
    secondary: 'bg-white text-[#374151] border border-[#e5e7eb]',
    danger: 'bg-[#ef4444] text-white hover:bg-[#dc2626]',
  }
  ```
- Template literal className concatenation: `className={`${baseClasses} ${variantClasses[variant]} ${className}`}`

---

*Convention analysis: 2026-02-15*
