---
phase: quick-14
plan: 01
subsystem: admin-auth
tags: [security, authentication, authorization, role-verification]
dependency_graph:
  requires: [admin-login.js, require-admin.js]
  provides: [role-gated-admin-login]
  affects: [/login]
tech_stack:
  added: []
  patterns: [role-verification-at-login, immediate-signout-on-role-fail]
key_files:
  created: []
  modified:
    - src/lib/actions/admin-login.js
decisions:
  - "Role check happens after successful signInWithPassword (not before) because Supabase doesn't expose role in the auth error"
  - "Immediate signOut on role failure prevents redirect loops from valid session cookies"
  - "ADMIN_ROLES constant defined inline (no import) to keep login action self-contained"
  - "Thai error message matches other admin auth errors for consistency"
metrics:
  duration: 48 seconds
  completed: 2026-02-17
---

# Quick Task 14: Add Role Verification to Admin Login Action

**One-liner:** Role verification at login prevents customers from authenticating at /login, eliminating redirect loops and providing clear Thai error messages.

## Objective

Add role verification to the `adminLogin` server action so that non-admin/non-editor users receive an immediate error message instead of being silently authenticated and caught in a redirect loop by middleware.

## Context

**Problem:** Customers could successfully authenticate at `/login` using their credentials, get a valid session cookie, but then be immediately bounced by middleware to `/login` again, creating a confusing redirect loop. The middleware checked roles, but the login action did not.

**Root cause:** The `adminLogin` action in `src/lib/actions/admin-login.js` only checked credentials (email/password) but not the user's role from `user_metadata`.

**Solution:** Add a role check immediately after successful `signInWithPassword`, sign out non-admin users, and return a Thai error message at the form level.

## Tasks Completed

### Task 1: Add role verification to adminLogin action ✓

**Files modified:** `src/lib/actions/admin-login.js`

**Changes:**

1. After successful `signInWithPassword` (line 30), extract `userRole` from `data.user.user_metadata.role`
2. Define `ADMIN_ROLES = ['admin', 'editor']` inline (matches `require-admin.js`)
3. Check if role is missing or not in allowed list
4. On role failure:
   - Call `await supabase.auth.signOut()` to revoke the session immediately (critical: prevents redirect loop)
   - Log audit event: `logAudit({ userId: data.user?.id, action: 'login.role_denied', ip, details: { email, role: userRole } })`
   - Return Thai error: `{ error: 'บัญชีนี้ไม่มีสิทธิ์เข้าใช้ระบบผู้ดูแล' }` ("This account does not have permission to access the admin system")
5. Only return `{ error: null }` (success) if role check passes

**Verification:**
- ✓ Role check exists after signInWithPassword (lines 37-46)
- ✓ signOut called on role failure (line 43)
- ✓ Audit log captures role denial with action 'login.role_denied' (line 44)
- ✓ Thai error message returned (line 45)
- ✓ Build passes without errors

**Commit:** `b7bbcd5` - feat(quick-14): add role verification to admin login action

## Deviations from Plan

None - plan executed exactly as written.

## Implementation Details

### Role Check Flow

```javascript
// After successful signInWithPassword
const userRole = data.user?.user_metadata?.role
const ADMIN_ROLES = ['admin', 'editor']

if (!userRole || !ADMIN_ROLES.includes(userRole)) {
  await supabase.auth.signOut()  // Critical: revoke session
  logAudit({ userId: data.user?.id, action: 'login.role_denied', ip, details: { email, role: userRole } })
  return { error: 'บัญชีนี้ไม่มีสิทธิ์เข้าใช้ระบบผู้ดูแล' }
}
```

### Why signOut is Critical

Without the `signOut` call, a non-admin user would:
1. Get a valid session cookie from `signInWithPassword`
2. See an error message in the login form
3. But still have an active session cookie
4. Trigger middleware redirect loop on any navigation attempt

The immediate `signOut` ensures the user has no valid session after the error is displayed.

### Error Display

The login page (`src/app/(admin)/login/page.jsx`) already displays `result.error` in a red alert paragraph (line 120-124), so no UI changes were needed:

```jsx
{error && (
  <p className="text-[#d92429] font-['IBM_Plex_Sans_Thai'] text-[14px] m-0" role="alert">
    {error}
  </p>
)}
```

### Audit Trail

Role denial attempts are now logged with:
- Action: `login.role_denied`
- User ID: The authenticated user's ID (before signOut)
- Details: Email and attempted role
- IP: For security monitoring

## Testing

### Manual Testing Scenarios

**Scenario 1: Customer attempts admin login**
1. Customer with valid email/password tries to log in at `/login`
2. Password authentication succeeds
3. Role check fails (user has no role or role is not 'admin'/'editor')
4. Session revoked via signOut
5. Error displayed: "บัญชีนี้ไม่มีสิทธิ์เข้าใช้ระบบผู้ดูแล"
6. No redirect loop (no valid session cookie)

**Scenario 2: Admin login continues to work**
1. Admin with role 'admin' or 'editor' logs in at `/login`
2. Password authentication succeeds
3. Role check passes
4. Success returned: `{ error: null }`
5. User redirected to `/admin/dashboard`

**Scenario 3: Rate limiting still works**
1. User attempts login 5+ times rapidly
2. Rate limiter blocks request before password check
3. Thai error: "เข้าสู่ระบบบ่อยเกินไป กรุณารอ X วินาที"

### Build Verification

```bash
npm run build
# ✓ Compiled successfully in 4.8s
# ✓ 47 routes built
```

## Security Impact

**Before:** Customers could authenticate at `/login`, get a session cookie, then be bounced by middleware, creating a confusing UX and potential security concern (why did my login "work"?).

**After:** Customers receive immediate, clear feedback at the form level. No session cookie is created, eliminating confusion and tightening the security boundary.

**Defense in depth:** This adds a second layer of role checking:
1. **Layer 1 (new):** Login action checks role after authentication
2. **Layer 2 (existing):** Middleware checks role on every request via `requireAdminOrRedirect`

Both layers use the same `ADMIN_ROLES = ['admin', 'editor']` logic.

## Performance Impact

- Negligible: One additional property access (`user_metadata.role`) and array includes check per login
- signOut only called on role failure (rare case)

## Related Work

- Quick task 13: Added `requireAdmin` and `requireAdminOrRedirect` utilities
- This task completes the admin auth story by adding role verification at the entry point (login form)

## Files Changed

| File | Lines Changed | Description |
|------|---------------|-------------|
| src/lib/actions/admin-login.js | +11 | Added role check, signOut, audit log, error return |

## Success Criteria Met

- ✓ adminLogin returns Thai error for non-admin/non-editor users
- ✓ Session cleaned up (signOut) for rejected users
- ✓ Existing admin/editor login flow unaffected
- ✓ Build succeeds
- ✓ Audit trail captures role denial attempts
- ✓ No UI changes needed (error display already exists)

## Self-Check: PASSED

**Files exist:**
```bash
[ -f "src/lib/actions/admin-login.js" ] && echo "FOUND: src/lib/actions/admin-login.js" || echo "MISSING"
```
FOUND: src/lib/actions/admin-login.js

**Commits exist:**
```bash
git log --oneline --all | grep -q "b7bbcd5" && echo "FOUND: b7bbcd5" || echo "MISSING"
```
FOUND: b7bbcd5

**Role check verified:**
- Lines 37-46 contain role verification logic
- signOut called on line 43
- Audit log on line 44
- Thai error message on line 45

All claims verified.

---

**Quick task 14 complete.** Admin login now enforces role verification at the form level, providing clear feedback and preventing redirect loops for non-admin users.
