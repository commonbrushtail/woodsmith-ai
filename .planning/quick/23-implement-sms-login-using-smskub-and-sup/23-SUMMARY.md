---
phase: quick-23
plan: 01
subsystem: auth
tags: [sms, otp, supabase, phone-auth, smskub, loading-state, error-handling]

requires:
  - phase: quick-20
    provides: SMS OTP login flow with Supabase signInWithOtp
  - phase: quick-21
    provides: PhoneLoginScreen and OtpScreen components in LoginModal

provides:
  - PhoneLoginScreen with sending/error states (loading text + disabled button during OTP send)
  - handleSendOtp returns { error } on failure so PhoneLoginScreen can display it
  - docs/SUPABASE_SMS_SETUP.md with complete Supabase custom HTTP SMS provider config

affects: [auth, login-modal, sms-otp, smskub-integration]

tech-stack:
  added: []
  patterns:
    - "Lift result back from parent to child: parent async handler returns { error } or undefined; child component owns sending/error state"
    - "On success, sending stays true — screen transitions away (no cleanup needed)"
    - "Error display pattern: font-['IBM_Plex_Sans_Thai'] text-[13px] text-[#dc2626] mt-[12px] m-0 (matches OtpScreen)"

key-files:
  created:
    - docs/SUPABASE_SMS_SETUP.md
  modified:
    - src/components/LoginModal.jsx

key-decisions:
  - "PhoneLoginScreen owns its own sending/error state — parent handleSendOtp returns { error } or undefined (not void) so child can react"
  - "On OTP send success, sending stays true because the screen transitions away — no cleanup needed"
  - "handleSendOtp wrapped in try/catch to handle both Supabase errors and unexpected exceptions"
  - "docs/SUPABASE_SMS_SETUP.md documents OTP expiry as 179s to match LoginModal countdown"

patterns-established:
  - "Error display in PhoneLoginScreen uses identical style to OtpScreen: text-[#dc2626] text-[13px] mt-[12px]"

duration: 3min
completed: 2026-02-17
---

# Quick Task 23: SMS Login Loading/Error Feedback Summary

**PhoneLoginScreen now shows 'กำลังส่ง OTP...' with a disabled button during send and a red Thai error message on failure, with Supabase custom HTTP SMS provider config documented in docs/SUPABASE_SMS_SETUP.md**

## Performance

- **Duration:** ~3 min
- **Started:** 2026-02-17T14:27:28Z
- **Completed:** 2026-02-17T14:30:02Z
- **Tasks:** 2 (+ 1 checkpoint — human verify)
- **Files modified:** 2

## Accomplishments

- PhoneLoginScreen button disabled and shows 'กำลังส่ง OTP...' during the async OTP send network call
- Failed OTP send surfaces a Thai error message below the button — no more silent failures
- `handleSendOtp` wrapped in try/catch, returns `{ error }` on Supabase error or exception, `undefined` on success
- `docs/SUPABASE_SMS_SETUP.md` documents exact URL, secret, OTP expiry/length, and all required env vars for Supabase dashboard setup

## Task Commits

1. **Task 1: Add sending/error state to PhoneLoginScreen** - `07a6aa0` (feat)
2. **Task 2: Document Supabase custom HTTP SMS provider config** - `0a6909e` (docs)

## Files Created/Modified

- `src/components/LoginModal.jsx` - PhoneLoginScreen now has `sending`/`error` state, `handleSend` async handler, disabled button logic, loading text, red error display; `handleSendOtp` now returns `{ error }` on failure
- `docs/SUPABASE_SMS_SETUP.md` - Step-by-step Supabase dashboard config: enable Phone provider, select Custom HTTP, set URL/secret/OTP expiry/OTP length, env vars table, verification checklist

## Decisions Made

- PhoneLoginScreen owns its own `sending` and `error` state. The parent `handleSendOtp` must return `{ error }` on failure or `undefined` on success — this is the communication contract between child UI state and parent network logic.
- On success, `sending` is intentionally left `true` because the screen transitions away (no unmounting cleanup race condition).
- `handleSendOtp` wrapped in try/catch to handle both Supabase-returned errors and unexpected exceptions from dynamic imports or network failures.
- OTP expiry documented as `179` seconds to exactly match the LoginModal countdown timer.

## Deviations from Plan

None — plan executed exactly as written.

## Issues Encountered

None.

## Checkpoint

The plan includes a `checkpoint:human-verify` gate after Task 2. User must:

1. Run `npm run dev` and open `http://localhost:3000`
2. Open the LoginModal, enter a 10-digit number, click "เข้าสู่ระบบ"
3. Confirm button shows "กำลังส่ง OTP..." and is disabled during the send
4. Test error state by temporarily adding `return { error: 'test error' }` at top of `handleSendOtp`
5. Confirm `docs/SUPABASE_SMS_SETUP.md` exists with correct values
6. Run `npm test` to confirm no regressions

## Next Steps

After human verification, complete Supabase dashboard configuration following `docs/SUPABASE_SMS_SETUP.md` to enable live SMS OTP flow.

---
*Phase: quick-23*
*Completed: 2026-02-17*
