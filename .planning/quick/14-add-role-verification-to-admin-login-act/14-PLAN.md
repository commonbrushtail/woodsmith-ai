---
phase: quick-14
plan: 01
type: execute
wave: 1
depends_on: []
files_modified:
  - src/lib/actions/admin-login.js
autonomous: true
must_haves:
  truths:
    - "Non-admin users (customers) see a clear Thai error message when attempting to log in at /login"
    - "Non-admin users do NOT get a session cookie after the failed login attempt"
    - "Admin and editor users can still log in successfully"
  artifacts:
    - path: "src/lib/actions/admin-login.js"
      provides: "Role-gated admin login action"
      contains: "user_metadata"
  key_links:
    - from: "src/lib/actions/admin-login.js"
      to: "supabase.auth.signOut"
      via: "sign out after role check failure"
      pattern: "signOut"
---

<objective>
Add role verification to the adminLogin server action so that non-admin/non-editor users receive an immediate error message instead of being silently authenticated and caught in a redirect loop.

Purpose: Prevent customers from "successfully" authenticating at /login only to be bounced by middleware, creating a confusing loop. Give clear feedback at the form level.
Output: Updated admin-login.js with role check after signInWithPassword.
</objective>

<execution_context>
@C:/Users/commo/.claude/get-shit-done/workflows/execute-plan.md
@C:/Users/commo/.claude/get-shit-done/templates/summary.md
</execution_context>

<context>
@src/lib/actions/admin-login.js
@src/lib/auth/require-admin.js
@src/app/(admin)/login/page.jsx
</context>

<tasks>

<task type="auto">
  <name>Task 1: Add role verification to adminLogin action</name>
  <files>src/lib/actions/admin-login.js</files>
  <action>
After the successful `signInWithPassword` call (line 30-31), add a role check before returning success:

1. Extract the role from `data.user.user_metadata?.role`
2. Define allowed roles as `['admin', 'editor']` (match the ADMIN_ROLES constant in `src/lib/auth/require-admin.js`)
3. If the role is missing or not in the allowed list:
   a. Call `await supabase.auth.signOut()` to revoke the session immediately (critical: without this, the user has a valid session cookie despite the error)
   b. Log an audit event: `logAudit({ userId: data.user?.id, action: 'login.role_denied', ip, details: { email, role: userRole } })`
   c. Return `{ error: 'บัญชีนี้ไม่มีสิทธิ์เข้าใช้ระบบผู้ดูแล' }` (Thai: "This account does not have permission to access the admin system")
4. Only return `{ error: null }` (success) if the role check passes

Do NOT import requireAdmin — the login action creates its own supabase client and the role check is a simple inline conditional (3-4 lines). Keep it self-contained.

The login page (LoginPage in `src/app/(admin)/login/page.jsx`) already displays `result.error` in a red alert paragraph, so no UI changes are needed.
  </action>
  <verify>
1. Read the updated file and confirm: (a) role check exists after signInWithPassword, (b) signOut is called on role failure, (c) audit log captures role denial, (d) Thai error message is returned.
2. Run `npm run build` to confirm no build errors.
  </verify>
  <done>
- Customer accounts attempting admin login see "บัญชีนี้ไม่มีสิทธิ์เข้าใช้ระบบผู้ดูแล" error message
- Customer session is revoked (signOut called) so no session cookie lingers
- Admin/editor logins continue to work (role check passes, success returned)
- Audit log records role denial events with action 'login.role_denied'
  </done>
</task>

</tasks>

<verification>
- The adminLogin function checks user_metadata.role after successful authentication
- Non-admin users are signed out and receive an error in Thai
- Admin and editor users pass the check and get { error: null }
- No changes needed to login page UI (error display already works)
- Build passes without errors
</verification>

<success_criteria>
1. adminLogin returns a Thai error message for non-admin/non-editor users
2. The session is cleaned up (signOut) for rejected users
3. Existing admin/editor login flow is unaffected
4. Build succeeds
</success_criteria>

<output>
After completion, create `.planning/quick/14-add-role-verification-to-admin-login-act/14-SUMMARY.md`
</output>
