---
phase: quick-15
plan: 01
subsystem: user-management
tags: [security, authorization, user-metadata, auth-sync]
dependency_graph:
  requires: [user-profiles-table, supabase-auth, require-admin-utility]
  provides: [working-invite-user, working-update-user-role, role-synchronized-auth]
  affects: [admin-login, require-admin, middleware, user-management-ui]
tech_stack:
  added: []
  patterns: [dual-write-user-metadata-and-profiles, auth-admin-updateUserById]
key_files:
  created: []
  modified:
    - src/lib/actions/users.js
decisions:
  - "Dual-write role to both user_profiles table and auth user_metadata (user_profiles for queries, user_metadata for auth checks)"
  - "Follow deleteUser pattern: fetch user_id from profile before auth operations"
  - "updateUserRole syncs to auth immediately (no deferred sync) to ensure role changes take effect on next login"
metrics:
  duration_seconds: 70
  duration_minutes: 1
  tasks_completed: 1
  files_modified: 1
  commits: 1
  completed_at: "2026-02-17"
---

# Quick Task 15: Fix Authorization Bypass in User Management

**One-liner:** Synced role to user_metadata in inviteUser and updateUserRole, fixing critical authorization bypass where invited users couldn't log in.

## Objective

Fix critical authorization bypass vulnerability in user management actions. Both `inviteUser()` and `updateUserRole()` stored role only in `user_profiles` table, but ALL auth checks (`adminLogin`, `requireAdmin`, `requireAdminOrRedirect`, middleware route-rules) read from `user.user_metadata.role`. Result: invited users cannot log in, and role changes have no effect.

## Tasks Completed

### Task 1: Add role to user_metadata in inviteUser and sync role in updateUserRole ✓

**Fix 1 — inviteUser (line 99):**
Changed `createUser` call to include role in user_metadata:
```js
user_metadata: { display_name: displayName, role }
```

**Fix 2 — updateUserRole (lines 141-170):**
Added dual update pattern:
1. Fetch `user_id` from `user_profiles` table (profile ID ≠ auth user ID)
2. Update `user_profiles.role` (for queries)
3. Sync to auth `user_metadata.role` via `auth.admin.updateUserById()`
4. Return error if either update fails

**Verification:**
- ✅ `npm run build` passes (no syntax errors)
- ✅ inviteUser sets `user_metadata: { display_name, role }` during auth user creation
- ✅ updateUserRole syncs role to both user_profiles AND auth user_metadata
- ✅ Grep shows `user_metadata` at lines 99, 162, 165

**Files modified:**
- `src/lib/actions/users.js` (24 insertions, 1 deletion)

**Commit:** `07e84bf` — fix(quick-15): sync role to user_metadata in inviteUser and updateUserRole

## Deviations from Plan

None — plan executed exactly as written.

## Verification Results

### Build Verification
```bash
npm run build
```
✅ Build passed — all 47 routes compiled successfully

### Code Review Verification
✅ inviteUser line 99: `user_metadata: { display_name: displayName, role }`
✅ updateUserRole lines 162-165: `auth.admin.updateUserById(profile.user_id, { user_metadata: { role } })`

### Auth Chain Verification
Auth flow now intact:
1. **inviteUser** → creates auth user with `user_metadata.role`
2. **adminLogin** (line 38) → reads `data.user?.user_metadata?.role`
3. **requireAdmin** (line 20) → reads `user.user_metadata?.role`
4. **middleware** (line 38) → reads `user.user_metadata?.role`

Role changes via **updateUserRole** also flow through:
1. Updates `user_profiles.role` (for admin UI queries)
2. Syncs to `auth.user_metadata.role` (for auth checks)

## Success Criteria

- ✅ inviteUser creates auth users with role in user_metadata, matching what all auth checks expect
- ✅ updateUserRole syncs role changes to auth user_metadata, not just user_profiles table
- ✅ No other functions modified (minimal, surgical fix)
- ✅ Build passes

## Impact

**Security:** Critical authorization bypass fixed. Invited admin/editor users can now:
1. Log in via `/login` (adminLogin role check passes)
2. Access `/admin/*` routes (middleware role check passes)
3. Call admin-protected server actions (requireAdmin role check passes)

Role changes take effect immediately on next login (no stale auth metadata).

**Testing:** No new tests added (quick task). Manual verification via admin user invitation flow recommended.

## Technical Details

### Dual-Write Pattern
Role is now stored in TWO places:
1. **user_profiles.role** — for admin UI queries (user list, role display)
2. **auth.user_metadata.role** — for all auth checks (login, middleware, server actions)

This is correct: user_profiles is queryable via SQL, user_metadata is accessible on auth user object.

### Why updateUserRole Needs Two Updates
The `id` parameter in `updateUserRole(id, role)` is the `user_profiles.id` (profile row ID), NOT the auth `user.id`. Pattern follows `deleteUser()` (lines 163-167):
1. Query `user_profiles` to get `user_id` (auth user ID)
2. Use `user_id` to call `auth.admin.updateUserById()`

Without this lookup, we'd be passing the wrong ID to the auth API.

## Self-Check: PASSED

### File Verification
```bash
[ -f "src/lib/actions/users.js" ] && echo "FOUND: src/lib/actions/users.js" || echo "MISSING: src/lib/actions/users.js"
```
✅ FOUND: src/lib/actions/users.js

### Commit Verification
```bash
git log --oneline --all | grep -q "07e84bf" && echo "FOUND: 07e84bf" || echo "MISSING: 07e84bf"
```
✅ FOUND: 07e84bf

### Code Pattern Verification
```bash
grep -n "user_metadata" src/lib/actions/users.js
```
✅ Line 99: inviteUser sets role in user_metadata
✅ Lines 162-165: updateUserRole syncs role to user_metadata

All claimed artifacts verified.

---

**Completed:** 2026-02-17
**Duration:** 1 minute
**Result:** Authorization bypass fixed. Admin user invitation workflow now functional.
