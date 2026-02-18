# Quick Task 25: Fix LINE OAuth CSRF and createCustomerProfile IDOR

## Task Description
Fix two HIGH-confidence security vulnerabilities found in security review:
1. LINE OAuth CSRF — state parameter not validated server-side
2. createCustomerProfile IDOR — no auth check, accepts arbitrary userId

## Vulnerability Analysis

### Vuln 1: LINE OAuth CSRF (src/app/auth/callback/line/route.js)
- **Issue**: State is stored in `sessionStorage` (client-only), server callback only checks `!state` (existence), never validates against stored value
- **Impact**: Attacker can craft a LINE OAuth callback URL with arbitrary state to log in a victim as the attacker's LINE account (login CSRF)
- **Fix**: Store state in HTTP-only cookie before redirect, validate in callback by comparing cookie to query param

### Vuln 2: createCustomerProfile IDOR (src/lib/actions/customer.js)
- **Issue**: Server action accepts `userId` as parameter, uses `createServiceClient()` (bypasses RLS) to upsert profile without auth check
- **Impact**: Any authenticated user can call this server action with another user's ID to modify their profile
- **Fix**: Add `supabase.auth.getUser()` check, derive userId from session instead of parameter

## Tasks

### Task 1: Fix LINE OAuth CSRF
**Files:** `src/app/auth/callback/line/route.js`, `src/components/LoginModal.jsx`, `src/app/(public)/login/page.jsx`

1. In `LoginModal.jsx` and `login/page.jsx` `handleLineLogin`:
   - Before redirect, set an HTTP-only cookie `line_oauth_state` with the generated state value
   - Use `document.cookie` with `SameSite=Lax; Path=/; Max-Age=600` (10 min expiry)

2. In `route.js` callback:
   - Read `line_oauth_state` cookie from request
   - Compare cookie value to `state` query parameter
   - If mismatch or missing, redirect with `auth_error=invalid_state`
   - Delete the cookie after validation

### Task 2: Fix createCustomerProfile IDOR
**Files:** `src/lib/actions/customer.js`, `src/components/LoginModal.jsx`

1. In `createCustomerProfile`:
   - Add `supabase.auth.getUser()` check at start
   - Derive `userId` from `user.id` instead of parameter
   - Change function signature: remove `userId` parameter
   - Keep `createServiceClient()` for the upsert (needed to bypass RLS)

2. In `LoginModal.jsx`:
   - Update `createCustomerProfile` call to remove `user.id` argument
   - Function now gets userId from auth session internally

## Verification
- LINE Login flow still works (state validated via cookie)
- SMS OTP registration still works (createCustomerProfile uses session)
- No CSRF possible on LINE callback (state must match cookie)
- No IDOR possible on profile creation (userId from auth session)
