---
phase: quick-22
plan: 01
subsystem: auth
tags: [line-login, oauth, oidc, id-token, jwt, user-profiles]

# Dependency graph
requires:
  - phase: quick-21
    provides: /register/line profile completion form and completeLineProfile action
  - phase: quick-20
    provides: LINE OAuth callback creating Supabase session and user_profiles row
  - phase: quick-19
    provides: LINE Login env vars (NEXT_PUBLIC_LINE_LOGIN_CHANNEL_ID, LINE_LOGIN_CHANNEL_SECRET)

provides:
  - LINE OAuth scope includes 'email' for email capture
  - LINE ID token decoded in callback to extract email claim
  - user_profiles.email populated from LINE ID token on new user creation
  - user_profiles.email backfilled for returning users when profile has no email
  - /register/line form conditionally hides email field when already captured

affects: [quick-20, quick-21, register-line, line-callback]

# Tech tracking
tech-stack:
  added: []
  patterns:
    - JWT payload decode via atob(token.split('.')[1]) for ID token email extraction
    - Conditional form field hiding based on server-provided profile state
    - Null-safe update pattern (only update email when truthy, never overwrite)

key-files:
  created: []
  modified:
    - src/lib/auth/line-config.js
    - src/app/auth/callback/line/route.js
    - src/app/(public)/register/line/page.jsx
    - src/lib/actions/customer.js
    - tests/lib/auth/line-config.test.js

key-decisions:
  - "Email scope added to LINE OAuth URL (openid profile email) — enables LINE ID token to contain email claim"
  - "Email extracted from JWT ID token payload via atob decode (no additional API call required)"
  - "lineRealEmail stored in user_profiles on new user upsert; backfilled for returning users with .is('email', null) guard"
  - "hasEmail state in /register/line set from profile.email existence — drives conditional field render"
  - "completeLineProfile: email only included in updateData when truthy (null email passed when hasEmail=true)"
  - "createCustomerProfile updated to accept optional email param, included in insert when provided"

patterns-established:
  - "Null-safe profile update: build updateData object, only add optional fields when truthy"
  - "Conditional form field: fetch profile state in checkAccess useEffect, derive hasEmail flag, conditionally render field"

# Metrics
duration: 3min
completed: 2026-02-17
---

# Quick Task 22: LINE Email Scope Summary

**LINE OAuth captures user email via ID token JWT decode, eliminating the email form field in /register/line when LINE already provides it**

## Performance

- **Duration:** 3 min
- **Started:** 2026-02-17T10:35:30Z
- **Completed:** 2026-02-17T10:38:30Z
- **Tasks:** 2
- **Files modified:** 5

## Accomplishments

- LINE OAuth URL now requests `openid profile email` scope, enabling email claim in the ID token
- LINE callback decodes the ID token JWT payload using `atob(tokens.id_token.split('.')[1])` and stores `lineRealEmail` in `user_profiles` for both new and returning users
- `/register/line` form reads `profile.email` in `checkAccess`, sets `hasEmail` state, conditionally hides the email field when already captured
- `completeLineProfile` never overwrites an existing email (null guard in updateData construction)

## Task Commits

Each task was committed atomically:

1. **Task 1: Add email scope and extract email from LINE ID token** - `eccb2ff` (feat)
2. **Task 2: Conditionally hide email field when LINE provides email** - `f79755f` (feat)

**Plan metadata:** (docs commit follows)

## Files Created/Modified

- `src/lib/auth/line-config.js` - scope changed from `'openid profile'` to `'openid profile email'`
- `src/app/auth/callback/line/route.js` - ID token decode block added after token exchange; email stored in upsert for new users; backfill update for returning users
- `src/app/(public)/register/line/page.jsx` - hasEmail state + conditional email field render + null email passed to completeLineProfile when hasEmail
- `src/lib/actions/customer.js` - completeLineProfile: null-safe email in updateData and metaUpdate; createCustomerProfile: optional email param
- `tests/lib/auth/line-config.test.js` - scope test renamed and updated to assert `email` scope

## Decisions Made

- Email extracted from JWT ID token payload via `atob(tokens.id_token.split('.')[1])` — no extra LINE API call needed, email is a standard OIDC claim in the ID token when email scope is granted
- `.is('email', null)` guard on returning-user backfill prevents overwriting a user-entered email with a LINE email
- `hasEmail ? null : form.email` in handleSubmit avoids sending empty string that would overwrite the LINE-captured email in user_profiles
- `createCustomerProfile` updated to accept `email` to fix a pre-existing test that expected the field to pass through

## Deviations from Plan

### Auto-fixed Issues

**1. [Rule 1 - Bug] createCustomerProfile did not accept or pass through email parameter**

- **Found during:** Task 2 verification (running customer.test.js)
- **Issue:** Test `inserts a customer profile row` called `createCustomerProfile` with `email: 'john@test.com'` and expected it in the insert object, but the function signature only accepted `{ displayName, phone }` and never included email in the insert data
- **Fix:** Added `email` to destructured params, sanitized it, and conditionally included it in `profileData` when truthy
- **Files modified:** `src/lib/actions/customer.js`
- **Verification:** All 13 customer tests pass
- **Committed in:** `f79755f` (Task 2 commit)

---

**Total deviations:** 1 auto-fixed (Rule 1 - existing test revealed missing email passthrough in createCustomerProfile)
**Impact on plan:** Auto-fix was necessary for correctness — function now behaves as the test specified. No scope creep.

## Issues Encountered

Pre-existing test failures (57 tests across 9 files) confirmed on baseline before changes — no regressions introduced by this task.

## User Setup Required

**LINE Developer Console configuration required:**
- Enable the "Email" permission in LINE Login channel settings (Login > Channel > OpenID Connect > Email)
- Without this, LINE will not include the `email` claim in the ID token even with scope requested
- Users must grant email permission at login consent screen

No code changes required — the scope is already set in `line-config.js`.

## Next Phase Readiness

- LINE email capture complete end-to-end
- Register form is adaptive: 2 fields (name only) when email captured, 3 fields as fallback
- Returning users get email backfilled on next LINE login if missing

---
*Phase: quick-22*
*Completed: 2026-02-17*

## Self-Check: PASSED

- FOUND: src/lib/auth/line-config.js
- FOUND: src/app/auth/callback/line/route.js
- FOUND: src/lib/actions/customer.js
- FOUND: tests/lib/auth/line-config.test.js
- FOUND: 22-SUMMARY.md
- FOUND commit: eccb2ff (Task 1)
- FOUND commit: f79755f (Task 2)
