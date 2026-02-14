# Codebase Concerns

**Analysis Date:** 2026-02-15

## Critical Bugs (Phase 6 Blockers)

### TipTap SSR Crash — Breaks 5+ Admin Pages

**Issue:** `RichTextEditor.jsx` component crashes on server-side render due to missing `immediatelyRender: false` option in `useEditor()`.

**Files:** `src/components/admin/RichTextEditor.jsx` (line 169)

**Impact:** Crashes pages:
- `/admin/about-us`
- `/admin/blog/create`
- `/admin/blog/edit/[id]`
- `/admin/products/create`
- `/admin/products/edit/[id]`

ErrorBoundary catches the error but page becomes non-functional. Users see error state instead of working form.

**Root Cause:** TipTap's `useEditor` hook requires `immediatelyRender: false` when used in Server Components or during SSR to avoid DOM-only initialization errors.

**Fix Approach:**
```javascript
const editor = useEditor({
  extensions: [...],
  content,
  onUpdate: ({ editor }) => onChange?.(editor.getHTML()),
  immediatelyRender: false,  // Add this line
})
```

---

### dnd-kit Hydration Mismatch — Console Errors on 5 List Pages

**Issue:** `SortableList.jsx` renders dnd-kit's accessibility wrapper `<div>` inside `<table>` element, causing React hydration mismatch warnings.

**Files:**
- `src/components/admin/SortableList.jsx` (lines 102-118)
- Affects: `src/components/admin/BannersListClient.jsx`, `VideoHighlightsListClient.jsx`, `GalleryListClient.jsx`, `ManualsListClient.jsx`, `FaqListClient.jsx`

**Pages Affected:**
- `/admin/banner`
- `/admin/video-highlight`
- `/admin/gallery`
- `/admin/manual`
- `/admin/faq`

**Symptom:** Console warnings about mismatched server/client HTML tree. Drag-and-drop still works but errors persist.

**Fix Approach:** Restructure component hierarchy to move `DndContext`/`SortableContext` outside table boundary:
- Option A: Use `<div>` instead of `<table>` for sortable lists
- Option B: Render dnd-kit outside table, apply styling to create table appearance
- Option C: Use dnd-kit's table-compatible hooks (if available)

---

### Missing Banner Create Page

**Issue:** `/admin/banner/create` returns 404. The "Create new entry" button on `/admin/banner` list page is broken.

**Files:**
- `src/app/(admin)/admin/banner/` — Missing `create/page.jsx`
- List page that links: `src/components/admin/BannersListClient.jsx`

**Impact:** Admins cannot create new banners via CMS UI. Must use API or database directly.

**Fix Approach:** Create `src/app/(admin)/admin/banner/create/page.jsx` following the pattern from other create pages:
- Similar structure to `src/app/(admin)/admin/blog/create/page.jsx` or `products/create/page.jsx`
- Use `BannerCreateClient` component (may need to create if not exists)
- Integrate with `src/lib/actions/banners.js` createBanner action

---

## Medium-Severity Issues

### Profile Page Raw HTML Display

**Issue:** Admin profile page (`/admin/profile`) displays raw HTML tags in the company name field when HTML content is stored.

**Files:** `src/app/(admin)/admin/profile/page.jsx` (lines 159-167)

**Problem:** The `companyName` input field shows `<p>` tags as plain text instead of stripping/rendering them.

**Example:** If `companyName = "<p>My Company</p>"`, the input displays the literal `<p>` tags.

**Fix Approach:** Either:
1. Strip HTML tags before displaying: `companyName.replace(/<[^>]*>/g, '')`
2. Switch field to use `RichTextEditor` if HTML content is intentional
3. Store plaintext separately from HTML version

---

### Gallery Order Off-by-One

**Issue:** First gallery item in `/admin/gallery` list displays `sort_order: 0` instead of `1`.

**Files:** `src/components/admin/GalleryListClient.jsx` (check display/indexing logic)

**Impact:** Visual confusion for admins. Actual database order is correct, but UI display is misleading.

**Fix Approach:** Check sort order display indexing:
```javascript
// If showing as 0-based, convert to 1-based for display
displayOrder = item.sort_order + 1
```

---

## Test Coverage Gaps

### Validation Test Failures (3 Pre-existing)

**Issue:** 3 test failures exist in validation suite, unrelated to recent changes.

**Files:**
- `tests/lib/validations/quotations.test.js` — 2 failures
  - "accepts valid quotation data"
  - "rejects missing product_id"
- `tests/lib/validations/blog.test.js` — 1 failure
  - "rejects empty content"

**Root Cause:** Zod schema validation logic mismatch (quotation product_id requirement, blog content requirement).

**Status:** Pre-existing from Phase 5. 199 of 202 tests passing. Does not block Phase 6 work.

**Fix Approach:** Review Zod schemas in `src/lib/validations/`:
- `quotations.js` — product_id validation
- `blog.js` — content validation
- Update test expectations or schema requirements to match business logic

---

## Security & Data Handling

### Client-Side Prompt Usage (Minor UX Concern)

**Issue:** `RichTextEditor.jsx` uses `window.prompt()` for link and image URL input (lines 28-39).

**Files:** `src/components/admin/RichTextEditor.jsx`

**Risk Level:** Low — limited to authenticated admin context. No injection risk (URLs are sanitized on output).

**Better Approach:** Replace with modal dialog for better UX:
```javascript
// Instead of: const url = window.prompt('URL:')
// Use: <URLModal /> component with input validation
```

**Current Mitigation:** URL sanitization happens in `src/lib/sanitize-html.js` (line 94 checks for `javascript:` protocol).

---

### Audit Log Fire-and-Forget Pattern

**Issue:** Audit logging in `src/lib/audit.js` (line 26) silently catches errors without retry or alerting.

**Files:** `src/lib/audit.js` (logAudit function)

**Risk Level:** Medium — Audit trails are critical for compliance. Silent failures could leave untracked actions.

**Current Behavior:**
```javascript
// Does not throw, just logs to console
try {
  // Insert to audit_logs
} catch (err) {
  console.error('Audit log exception:', err)
  // No retry, no escalation
}
```

**Recommendation:**
- Add alerting mechanism for audit log failures
- Consider retry logic for transient failures
- Log to external service if database fails
- Monitor for audit_logs insertion errors in production

---

## Technical Debt

### Large Client Components

**Issue:** Several admin list and edit components exceed 400+ lines, making them harder to test and maintain.

**Files:**
- `src/app/(admin)/admin/branch/create/page.jsx` — 1037 lines
- `src/app/(admin)/admin/blog/create/page.jsx` — 885 lines
- `src/app/(admin)/admin/manual/create/page.jsx` — 881 lines
- `src/app/(admin)/admin/gallery/create/page.jsx` — 767 lines
- `src/components/admin/ProductsListClient.jsx` — 539 lines

**Impact:** Harder to refactor, test, and understand. Single-page changes can have wide-reaching effects.

**Fix Approach:**
- Extract form sections into sub-components
- Separate form logic into custom hooks
- Split server/client concerns more clearly
- Example: Extract `RichTextSection`, `ImageUploadSection` into reusable components

---

### Missing Create Page Patterns

**Issue:** Not all resources follow consistent create page structure.

**Files:** Missing `src/app/(admin)/admin/banner/create/page.jsx`

**Pattern:** Most create pages follow this structure:
- `/admin/[resource]/create/page.jsx` — server page
- `[resource]CreateClient.jsx` — client component with form logic
- But banner section is incomplete.

**Fix Approach:** Standardize all resource pages:
- Products ✓
- Blog ✓
- Banner ✗ (missing create)
- Gallery ✓
- Manual ✓
- Video ✓
- FAQ ✓
- Branch ✓

---

### Rate Limiter Only In-Memory

**Issue:** `src/lib/rate-limit.js` uses in-memory Map for rate limit storage.

**Files:** `src/lib/rate-limit.js` (lines 8-10)

**Limitation:** Rate limits don't persist across:
- Server restarts
- Multi-process deployments (load-balanced servers)
- Resets on each deployment

**Current Usage:** Login attempts (5 per 60s) and password reset (3 per 15 mins)

**Deployment Impact:** In production with multiple instances, each server has separate rate limit state. Users could bypass by switching servers.

**Fix Approach:** For production deployments:
1. Move rate limiting to database (Redis or Supabase)
2. Use centralized session-based tracking
3. Or: Document as single-instance limitation, add warning to deploy docs

**Current Status:** Acceptable for single-process Next.js. Not suitable for load-balanced production.

---

### Environment Variable Defaults for Dev

**Issue:** Code falls back to default values for env vars (e.g., `process.env.VAR ?? 'localhost:54321'`).

**Files:**
- `src/lib/supabase/server.js` (line 8)
- `src/lib/supabase/admin.js` (line 8)
- `src/lib/supabase/client.js` (line 7)
- `middleware.js` (line 13)

**Risk:** If env vars are missing, app silently connects to localhost instead of failing loudly.

**Better Approach:**
```javascript
// Validate on startup
if (!process.env.NEXT_PUBLIC_SUPABASE_URL) {
  throw new Error('Missing NEXT_PUBLIC_SUPABASE_URL')
}
```

**Current Mitigation:** Dev setup requires `.env.local` file. Fallbacks aid local development.

---

## Scaling & Performance Concerns

### Supabase GoTrueClient Multiplicity Warnings

**Issue:** Test suite produces warnings about multiple GoTrueClient instances in same context.

**Test Output Warning:**
```
GoTrueClient@sb-xxxx (2.95.3) Multiple GoTrueClient instances detected
in the same browser context. It is not an error, but this should be
avoided as it may produce undefined behavior when used concurrently.
```

**Files:** Appears in test environment (`tests/lib/storage.test.js`, `tests/lib/db.test.js`, etc.)

**Impact:** Tests still pass. No runtime impact in production (different context). But suggests potential race conditions in test setup.

**Fix Approach:**
- Consolidate Supabase client creation in test setup
- Use single shared client instance across tests
- Or: Accept warnings as test-specific artifact (not production issue)

---

### No Full-Text Search

**Issue:** Search functionality in `src/lib/data/public.js` uses simple string matching, not PostgreSQL full-text search.

**Files:** `src/lib/data/public.js` (search function — check implementation)

**Limitation:** Search is case-sensitive, substring-based, no ranking. As product catalog grows, performance degrades.

**Future Enhancement:** Implement PostgreSQL `tsvector` + `tsquery` for:
- Fuzzy matching
- Relevance ranking
- Better performance on large datasets

---

## Missing Critical Features

### No Image Preview Before Upload

**Issue:** File upload inputs show no preview of selected image before submission.

**Files:**
- `src/components/admin/AdminFileInput.jsx` — File input component
- Multiple create/edit pages using `AdminFileInput`

**Impact:** Users upload wrong files without realizing until save completes.

**Fix Approach:** Add image preview after file selection:
```javascript
// Show preview after FileList change
onFileSelect={(file) => {
  const preview = URL.createObjectURL(file)
  setPreviewUrl(preview)
}}
```

---

### No Upload Progress Indication

**Issue:** Large file uploads have no progress feedback.

**Files:**
- `src/lib/storage.js` — No progress tracking
- Upload pages — No loading indicator

**Impact:** Users don't know upload status, may think it failed.

**Fix Approach:**
- Use Supabase upload progress events
- Show percentage bar during upload
- Add estimated time remaining

---

## Dependencies at Risk

### No CSRF Protection

**Issue:** Server Actions handle mutations without explicit CSRF tokens.

**Files:** All `src/lib/actions/*.js` files

**Current Mitigation:** Next.js automatically validates origin for Server Actions. But explicit CSRF tokens would be more secure.

**Risk Level:** Low-Medium. Next.js provides implicit protection. Explicit tokens add defense-in-depth.

**Fix Approach:** Consider adding CSRF token validation layer or form-level tokens.

---

### HTML Sanitization Maintenance

**Issue:** `src/lib/sanitize-html.js` is a custom implementation, not a battle-tested library.

**Files:** `src/lib/sanitize-html.js` — 101 lines of custom code

**Risk:** Custom sanitizers can have bypasses. Any new tag/attribute bypass could be an XSS vector.

**Current Mitigation:** Allowlist is strict (specific tags only). Tests cover common XSS patterns (15 tests).

**Better Approach:** Consider established library like `DOMPurify` or `sanitize-html` npm package for production. Trade-off: adds dependency.

**Current Status:** Custom solution works for current feature set. Acceptable risk with test coverage.

---

## Testing Coverage

### Component Integration Tests Missing

**Issue:** Components like `LoginModal`, `SearchOverlay` have unit tests but no integration tests with actual Supabase.

**Files:**
- `tests/components/` — Component tests use mocks
- No integration tests for auth flows

**Impact:** Real-world failures (e.g., Supabase connection issue) not caught until runtime.

**Fix Approach:** Add integration test suite:
- Test LoginModal against real Supabase Auth
- Test search against real product data
- Test auth state synchronization

---

### E2E Tests Limited

**Issue:** E2E test coverage exists but limited to auth flows.

**Files:** `e2e/auth/` — Only auth tests

**Missing E2E Coverage:**
- Product CRUD operations
- Blog creation and publishing
- Quotation submission
- Admin data management flows

**Fix Approach:** Expand E2E suite with critical user journeys:
```javascript
// E2E: Admin creates a product
// E2E: Customer submits quotation
// E2E: Product appears on homepage
```

---

## Monitoring & Observability Gaps

### No Error Tracking Service

**Issue:** Application has no external error tracking (Sentry, Rollbar, etc.).

**Files:** No integration point for error reporting

**Impact:** Production errors only visible in Supabase logs or if user reports them manually.

**Recommendation:** Add error tracking for production:
- Sentry or Datadog for error collection
- Real-time alerts for critical errors
- Error trend analysis

---

### Limited Audit Trail

**Issue:** Audit logging captures admin actions but not customer actions (quotations, purchases).

**Files:** `src/lib/audit.js` — Only wired to admin actions

**Gap:** Can't track customer behavior for compliance or debugging.

**Recommendation:**
- Log customer quotation submissions
- Log profile changes
- Retention policy: keep for 90+ days

---

## Database Concerns

### No Data Backup Strategy Documented

**Issue:** No documented backup/recovery procedure.

**Risk:** Supabase data loss or corruption has no recovery path.

**Recommendation:**
- Document daily backup strategy
- Test recovery procedures
- Set up automated backups if not using Supabase Backup add-on

---

### RLS Policy Edge Cases

**Issue:** Row-level security policies are functional but may have gaps on edge cases.

**Files:** `supabase/migrations/002_rls_policies.sql`

**Known Limitations:**
- Only tested against unit test scenarios
- No edge case testing (e.g., deleted users, expired sessions)
- No fuzz testing of policy combinations

**Recommendation:**
- Add edge case RLS tests
- Regular security audit of policies
- Test permission matrix (admin, editor, customer, anon)

---

## Summary by Severity

| Severity | Count | Items |
|----------|-------|-------|
| **Critical** | 3 | TipTap SSR crash, dnd-kit hydration, missing banner create |
| **Medium** | 4 | Profile HTML display, gallery order, audit logging, rate limiter limits |
| **Low** | 8+ | Large components, window.prompt, test failures, search limits, etc. |

**Phase 6 Blockers (must fix):** TipTap SSR, dnd-kit hydration, banner create page

**Phase 7+ Enhancements:** E2E tests, full-text search, error tracking, CSRF tokens

---

*Concerns audit: 2026-02-15*
