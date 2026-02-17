---
phase: quick-21
plan: "01"
subsystem: auth
tags: [line-login, profile, registration, server-action, migration]
dependency_graph:
  requires: [quick-20]
  provides: [line-user-profile-completion]
  affects: [user_profiles, auth/callback/line, /register/line]
tech_stack:
  added: []
  patterns: [guard-on-mount, completeLineProfile-server-action, magic-link-session]
key_files:
  created:
    - supabase/migrations/028_user_profiles_name_email.sql
    - src/app/(public)/register/line/page.jsx
  modified:
    - src/lib/actions/customer.js
    - src/app/auth/callback/line/route.js
decisions:
  - "completeLineProfile uses RLS-respecting server client (user updates own row) instead of service client"
  - "Guard checks app_metadata.provider=line (set in LINE callback, not forgeable client-side)"
  - "Profile completeness determined by first_name IS NULL check (not a separate boolean flag)"
  - "Auth metadata update is non-fatal: profile row is source of truth, metadata sync is best-effort"
metrics:
  duration: "2 min"
  completed: "2026-02-17"
  tasks: 2
  files_created: 2
  files_modified: 2
---

# Quick Task 21: LINE Login Profile Completion Form Summary

## One-liner

Profile completion form at `/register/line` collects first/last name and email from new LINE OAuth users before they reach the main site.

## What Was Built

New LINE users who authenticate via LINE OAuth are now redirected to `/register/line` (instead of `/`) where they complete their profile. Returning LINE users with an existing first_name bypass the form entirely and go directly to `/`.

## Tasks Completed

| # | Task | Commit | Files |
|---|------|--------|-------|
| 1 | Database migration + completeLineProfile action | ce0566e | 028 migration, customer.js |
| 2 | LINE callback redirect + /register/line page | 9bba669 | route.js, page.jsx |

## Files Created

**`supabase/migrations/028_user_profiles_name_email.sql`**
Adds `first_name`, `last_name`, `email` columns (nullable) to `user_profiles`. No NOT NULL constraints so existing rows (SMS OTP users, admins) are unaffected.

**`src/app/(public)/register/line/page.jsx`**
Client component with:
- Mount-time guard: redirects unauthenticated users to `/`, non-LINE users to `/`, users with existing first_name to `/account`
- Form UI matching RegisterScreen from LoginModal.jsx (pixel-identical inputs, labels, checkbox, button)
- LINE display name shown under heading
- Calls `completeLineProfile` server action on submit, redirects to `/account` on success

## Files Modified

**`src/lib/actions/customer.js`**
Added `completeLineProfile({ firstName, lastName, email })`:
- Gets authenticated user via server client (respects RLS)
- Sanitizes inputs via `sanitizeObject`
- Updates `user_profiles`: first_name, last_name, email, display_name
- Best-effort sync to Supabase Auth user_metadata
- Revalidates `/account`

**`src/app/auth/callback/line/route.js`**
Changed final redirect: `isNewUser` now goes to `/register/line`, returning users still go to `/`.

## Flow

```
LINE OAuth -> /auth/callback/line
  -> new user: redirect to /register/line
     -> form: fill first_name, last_name, email + agree terms
     -> submit: completeLineProfile() -> user_profiles updated
     -> redirect to /account
  -> returning user (first_name set): redirect to /
```

## Guard Logic

The page guard on mount checks three conditions before showing the form:
1. User is authenticated — else redirect to `/`
2. `app_metadata.provider === 'line'` — else redirect to `/`
3. `user_profiles.first_name IS NULL` — else redirect to `/account` (already completed)

## Deviations from Plan

None — plan executed exactly as written.

## Self-Check

### Files exist
- `supabase/migrations/028_user_profiles_name_email.sql` — FOUND
- `src/app/(public)/register/line/page.jsx` — FOUND
- `src/lib/actions/customer.js` exports `completeLineProfile` — FOUND
- `src/app/auth/callback/line/route.js` contains `register/line` — FOUND

### Commits exist
- ce0566e: feat(quick-21): migration + server action
- 9bba669: feat(quick-21): callback redirect + page

### Build
- `npm run build` passed with `/register/line` listed as dynamic route

## Self-Check: PASSED
