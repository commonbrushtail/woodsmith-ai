# Quick Task 25: Summary

## Task
Fix two HIGH-confidence security vulnerabilities found in security review:
1. LINE OAuth CSRF — state parameter not validated server-side
2. createCustomerProfile IDOR — no auth check, accepts arbitrary userId

## Changes Made

### Vuln 1: LINE OAuth CSRF (3 files)
- **`src/components/LoginModal.jsx`**: Changed `sessionStorage.setItem` to `document.cookie` with `SameSite=Lax; Path=/; Max-Age=600`
- **`src/app/(public)/login/page.jsx`**: Same cookie fix for standalone login page
- **`src/app/auth/callback/line/route.js`**:
  - Added state validation: reads `line_oauth_state` cookie from request headers, compares to `state` query param
  - Redirects with `auth_error=invalid_state` on mismatch
  - Clears state cookie on all success redirects via `clearStateCookie()` helper

### Vuln 2: createCustomerProfile IDOR (3 files)
- **`src/lib/actions/customer.js`**:
  - Removed `userId` parameter from function signature
  - Added `supabase.auth.getUser()` check — returns "Not authenticated" if no session
  - Derives `user.id` from authenticated session instead of accepting it as input
- **`src/components/LoginModal.jsx`**: Updated caller to remove `user.id` argument
- **`tests/lib/actions/customer.test.js`**:
  - Updated tests for new signature (no userId param)
  - Added `upsert` to mock chain methods
  - Added new test: "returns error when not authenticated"

## Files Modified
- `src/app/auth/callback/line/route.js`
- `src/components/LoginModal.jsx`
- `src/app/(public)/login/page.jsx`
- `src/lib/actions/customer.js`
- `tests/lib/actions/customer.test.js`

## Test Results
- All 3 `createCustomerProfile` tests pass (including new auth check test)
- 4 pre-existing `submitQuotation` test failures (unrelated to this change)

## Decisions
- [Quick 25]: Cookie-based CSRF state for LINE OAuth (SameSite=Lax, 10-min expiry, cleared after use) — server can validate without sessionStorage
- [Quick 25]: createCustomerProfile derives userId from auth session — eliminates IDOR by design, server action is no longer callable with arbitrary user IDs
