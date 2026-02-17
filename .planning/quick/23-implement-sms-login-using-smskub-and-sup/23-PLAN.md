---
phase: quick-23
plan: 01
type: execute
wave: 1
depends_on: []
files_modified:
  - src/components/LoginModal.jsx
  - docs/SUPABASE_SMS_SETUP.md
autonomous: false

must_haves:
  truths:
    - "Login button shows loading state while OTP send is in progress"
    - "Login button is disabled and non-interactive during OTP send"
    - "Error message appears if OTP send fails (e.g. invalid number)"
    - "Supabase SMS provider dashboard config is documented in a reference file"
  artifacts:
    - path: "src/components/LoginModal.jsx"
      provides: "PhoneLoginScreen with sending/error states"
    - path: "docs/SUPABASE_SMS_SETUP.md"
      provides: "Step-by-step Supabase custom HTTP provider setup instructions"
  key_links:
    - from: "PhoneLoginScreen (onSendOtp prop)"
      to: "handleSendOtp in LoginModal"
      via: "sending state lifted into PhoneLoginScreen, result returned to parent"
      pattern: "setSending\\(true\\)"
---

<objective>
Add loading/error feedback to PhoneLoginScreen during OTP send, and document the Supabase dashboard config step for the custom HTTP SMS provider.

Purpose: The OTP send is currently a silent async operation — the button stays active and gives no feedback while the network call is in-flight. Users may double-tap or think nothing happened. The Supabase dashboard config is a one-time manual step that must be documented so it is not forgotten.
Output: LoginModal.jsx with loading state in PhoneLoginScreen; docs/SUPABASE_SMS_SETUP.md with copy-paste config values.
</objective>

<execution_context>
@C:/Users/commo/.claude/get-shit-done/workflows/execute-plan.md
@C:/Users/commo/.claude/get-shit-done/templates/summary.md
</execution_context>

<context>
@.planning/PROJECT.md
@.planning/STATE.md
@src/components/LoginModal.jsx
</context>

<tasks>

<task type="auto">
  <name>Task 1: Add sending/error state to PhoneLoginScreen</name>
  <files>src/components/LoginModal.jsx</files>
  <action>
    The `PhoneLoginScreen` component receives `onSendOtp` as a prop but has no loading or error state of its own — the parent's `handleSendOtp` is async but the result is never surfaced back into `PhoneLoginScreen`.

    Changes to `PhoneLoginScreen`:
    1. Add `sending` and `error` state variables (useState).
    2. Replace the inline `onClick` on the login button with a named async handler `handleSend`:
       - Set `sending(true)`, clear `error`.
       - Await `onSendOtp(phone)` — the parent must return an error object on failure or nothing on success.
       - If result has `.error`, set `error(result.error)` and keep `sending(false)`.
       - If no error, `sending` remains true (screen transitions away, no cleanup needed).
    3. Disable the button when `phone.length !== 10 || sending`.
    4. Show Thai loading text while sending: `'กำลังส่ง OTP...'` instead of `'เข้าสู่ระบบ'`.
    5. Render error message below the button (same style as OtpScreen: `font-['IBM_Plex_Sans_Thai'] text-[13px] text-[#dc2626] mt-[12px] m-0`).

    Changes to `handleSendOtp` in `LoginModal`:
    1. Wrap the existing logic in a try/catch.
    2. On Supabase error, return `{ error: 'ไม่สามารถส่ง OTP ได้ กรุณาตรวจสอบเบอร์โทรและลองใหม่' }` instead of only `console.error`.
    3. On success (no error), return nothing (undefined) — the existing `setScreen('otp')` runs as before.

    Do NOT change OtpScreen, RegisterScreen, or any other part of the modal.
  </action>
  <verify>
    Visually: open LoginModal, enter a 10-digit number, click login — button text changes to 'กำลังส่ง OTP...' and button is disabled for the duration of the network call.
    Error path: temporarily break the Supabase call (wrong URL or return early with a fake error) — red error message appears below the button without crashing.
    Run: `npm test` — existing tests pass (no regressions).
  </verify>
  <done>
    PhoneLoginScreen button is disabled and shows Thai loading text while OTP send is in-flight. On failure, a red Thai error message appears below the button. On success, screen transitions to OTP screen as before.
  </done>
</task>

<task type="auto">
  <name>Task 2: Document Supabase custom HTTP SMS provider config</name>
  <files>docs/SUPABASE_SMS_SETUP.md</files>
  <action>
    Create `docs/SUPABASE_SMS_SETUP.md` documenting the one-time Supabase dashboard configuration required to wire the custom HTTP SMS provider to the `/api/sms/send` route.

    Include:
    1. **Where to go**: Supabase Dashboard → Authentication → Providers → Phone → toggle Enable Phone Provider.
    2. **SMS Provider**: select "Custom HTTP" from the provider dropdown.
    3. **URL field**: `{SITE_URL}/api/sms/send` — replace `{SITE_URL}` with the actual deployment URL (e.g. `https://woodsmith.vercel.app/api/sms/send`). For local dev: `http://localhost:3000/api/sms/send` (requires ngrok or similar tunnel if testing against Supabase cloud).
    4. **Secret field**: `woodsmith-sms-2024` (must match `SMS_WEBHOOK_SECRET` in `.env.local`).
    5. **OTP Expiry**: set to `179` seconds (matches the 179-second countdown in LoginModal).
    6. **OTP Length**: `6`.
    7. Note: Supabase will POST `{ "phone": "+66XXXXXXXXX", "otp": "123456" }` to the URL with header `Authorization: Bearer woodsmith-sms-2024`. The route converts `+66` → `0` prefix before calling SMSKUB.
    8. Add a section listing the required env vars and where to find each value:
       - `SMSKUB_BASE_URL` = `https://console.sms-kub.com`
       - `SMSKUB_TOKEN` = SMSKUB dashboard → API keys
       - `SMSKUB_SENDER` = `SMS-DEMO` (or approved sender name)
       - `SMS_WEBHOOK_SECRET` = `woodsmith-sms-2024` (set this to match Supabase secret field)
  </action>
  <verify>
    File exists at `docs/SUPABASE_SMS_SETUP.md` and contains the URL pattern, secret value, OTP length, and env var list.
  </verify>
  <done>
    `docs/SUPABASE_SMS_SETUP.md` exists with all config values needed to complete the Supabase dashboard setup without referring to external sources.
  </done>
</task>

<task type="checkpoint:human-verify" gate="blocking">
  <what-built>
    PhoneLoginScreen loading/error feedback (Task 1) and Supabase SMS config documentation (Task 2).
  </what-built>
  <how-to-verify>
    1. Run `npm run dev` and open `http://localhost:3000`.
    2. Click the login button in the navbar to open LoginModal.
    3. Enter a 10-digit phone number.
    4. Click "เข้าสู่ระบบ" — confirm the button changes to "กำลังส่ง OTP..." and is non-clickable during the send.
    5. If you have SMSKUB credentials and Supabase configured: confirm the OTP SMS arrives and the OTP screen appears after send completes.
    6. To test error state: temporarily add `return { error: 'test error' }` at the top of `handleSendOtp`, reload, enter a number, click — confirm red error text appears.
    7. Check `docs/SUPABASE_SMS_SETUP.md` exists and contains the correct URL, secret, and env var values.
    8. Run `npm test` — confirm no regressions.
  </how-to-verify>
  <resume-signal>Type "approved" or describe issues found.</resume-signal>
</task>

</tasks>

<verification>
- PhoneLoginScreen button is disabled and shows loading text while OTP send is in progress
- Error message renders in red Thai text on OTP send failure
- handleSendOtp returns { error: string } on failure so PhoneLoginScreen can display it
- docs/SUPABASE_SMS_SETUP.md exists with all required config values
- npm test passes with no new failures
</verification>

<success_criteria>
- Clicking login in PhoneLoginScreen shows "กำลังส่ง OTP..." and disables the button during the async call
- Failed OTP send (network/Supabase error) shows a Thai error message below the button — no silent failures
- docs/SUPABASE_SMS_SETUP.md documents the exact Supabase dashboard steps, URL, secret, OTP settings, and env vars
- No regressions in existing test suite
</success_criteria>

<output>
After completion, create `.planning/quick/23-implement-sms-login-using-smskub-and-sup/quick-23-SUMMARY.md`
</output>
