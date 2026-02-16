---
phase: quick-15
plan: 01
type: execute
wave: 1
depends_on: []
files_modified:
  - src/lib/actions/users.js
autonomous: true

must_haves:
  truths:
    - "Invited admin/editor users can log in and access /admin/ routes"
    - "Role changes via updateUserRole take effect on next login"
  artifacts:
    - path: "src/lib/actions/users.js"
      provides: "inviteUser and updateUserRole with user_metadata.role sync"
      contains: "user_metadata.*role"
  key_links:
    - from: "src/lib/actions/users.js#inviteUser"
      to: "src/lib/auth/require-admin.js"
      via: "user_metadata.role field"
      pattern: "user_metadata.*role"
    - from: "src/lib/actions/users.js#updateUserRole"
      to: "middleware.js"
      via: "user_metadata.role field synced via auth.admin.updateUserById"
      pattern: "updateUserById.*user_metadata"
---

<objective>
Fix critical authorization bypass in user management actions. Both `inviteUser()` and `updateUserRole()` store role only in `user_profiles` table but ALL auth checks (adminLogin, requireAdmin, requireAdminOrRedirect, middleware route-rules) read from `user.user_metadata.role`. Invited users cannot log in and role changes have no effect.

Purpose: Without this fix, the entire admin user invitation workflow is broken. No new admin/editor can be added via the user management interface.
Output: Patched `src/lib/actions/users.js` where both functions sync role to `user_metadata`.
</objective>

<execution_context>
@C:/Users/commo/.claude/get-shit-done/workflows/execute-plan.md
@C:/Users/commo/.claude/get-shit-done/templates/summary.md
</execution_context>

<context>
@src/lib/actions/users.js
@src/lib/auth/require-admin.js
@src/lib/actions/admin-login.js
@middleware.js
@src/lib/auth/route-rules.js
</context>

<tasks>

<task type="auto">
  <name>Task 1: Add role to user_metadata in inviteUser and sync role in updateUserRole</name>
  <files>src/lib/actions/users.js</files>
  <action>
Two fixes in `src/lib/actions/users.js`:

**Fix 1 — inviteUser() line 99:**
Change the `createUser` call to include `role` in `user_metadata`:
```js
user_metadata: { display_name: displayName, role },
```
This ensures the auth user is created with the role that adminLogin (line 38: `data.user?.user_metadata?.role`), requireAdmin (line 20: `user.user_metadata?.role`), and middleware (line 38: `user.user_metadata?.role`) all check.

**Fix 2 — updateUserRole() after the user_profiles update succeeds:**
After the existing `user_profiles` update (line 140-143), add a call to sync `user_metadata.role` on the auth user. This requires:
1. First, fetch the `user_id` from `user_profiles` where `id` matches (the `id` param is the profile row ID, not the auth user ID).
2. Then call `supabase.auth.admin.updateUserById(user_id, { user_metadata: { role } })`.
3. If the auth update fails, return an error.

The lookup pattern already exists in `deleteUser()` (lines 163-167) — follow the same approach:
```js
// Get user_id from profile
const { data: profile, error: fetchError } = await supabase
  .from('user_profiles')
  .select('user_id')
  .eq('id', id)
  .single()

if (fetchError) {
  return { error: fetchError.message }
}

// Sync role to auth user_metadata
const { error: authUpdateError } = await supabase.auth.admin.updateUserById(
  profile.user_id,
  { user_metadata: { role } }
)

if (authUpdateError) {
  return { error: authUpdateError.message }
}
```

Place the profile lookup BEFORE the user_profiles update so we can fail early if the profile doesn't exist. Then do both updates (user_profiles + auth metadata).

Do NOT change any other functions. Do NOT modify the `user_profiles` insert in inviteUser — it should continue storing role there as well (dual-write is correct: user_profiles for queries, user_metadata for auth checks).
  </action>
  <verify>
1. `npm run build` completes without errors (server action syntax valid).
2. Manual code review: confirm `inviteUser` createUser call includes `role` in user_metadata object.
3. Manual code review: confirm `updateUserRole` calls `auth.admin.updateUserById` with `{ user_metadata: { role } }` after profile update.
4. Grep verification: `grep -n "user_metadata" src/lib/actions/users.js` shows role in both inviteUser and updateUserRole.
  </verify>
  <done>
- inviteUser() sets `user_metadata: { display_name, role }` during auth user creation
- updateUserRole() syncs role to both user_profiles AND auth user_metadata
- Both functions' role values flow through to all four auth check points (adminLogin, requireAdmin, requireAdminOrRedirect, middleware)
  </done>
</task>

</tasks>

<verification>
- `npm run build` passes (no syntax errors in server action)
- `grep -n "user_metadata" src/lib/actions/users.js` shows role included in both inviteUser createUser call AND updateUserRole updateUserById call
- Auth check chain is intact: inviteUser sets role -> adminLogin reads role -> middleware reads role -> requireAdmin reads role
</verification>

<success_criteria>
- inviteUser creates auth users with role in user_metadata, matching what all auth checks expect
- updateUserRole syncs role changes to auth user_metadata, not just user_profiles table
- No other functions modified (minimal, surgical fix)
- Build passes
</success_criteria>

<output>
After completion, create `.planning/quick/15-fix-authorization-bypass-inviteuser-must/15-SUMMARY.md`
</output>
