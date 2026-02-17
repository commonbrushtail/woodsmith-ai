---
phase: quick-22
plan: 01
type: execute
wave: 1
depends_on: []
files_modified:
  - src/lib/auth/line-config.js
  - src/app/auth/callback/line/route.js
  - src/app/(public)/register/line/page.jsx
  - tests/lib/auth/line-config.test.js
autonomous: true
must_haves:
  truths:
    - "LINE OAuth requests email scope alongside openid and profile"
    - "New LINE users with a verified email get it stored in user_profiles.email during callback"
    - "Returning LINE users with no email get it stored if LINE provides one on re-login"
    - "Register form hides email field when email is already captured from LINE"
    - "Register form shows email field as fallback when LINE did not provide email"
    - "Form validation adjusts: email not required when already captured"
  artifacts:
    - path: "src/lib/auth/line-config.js"
      provides: "email scope in LINE OAuth URL"
      contains: "openid profile email"
    - path: "src/app/auth/callback/line/route.js"
      provides: "ID token decoding and email extraction"
      contains: "id_token"
    - path: "src/app/(public)/register/line/page.jsx"
      provides: "Conditional email field based on profile.email"
  key_links:
    - from: "src/lib/auth/line-config.js"
      to: "LINE OAuth authorization URL"
      via: "scope parameter"
      pattern: "scope.*openid profile email"
    - from: "src/app/auth/callback/line/route.js"
      to: "user_profiles.email"
      via: "ID token decode then upsert"
      pattern: "id_token.*split.*email"
    - from: "src/app/(public)/register/line/page.jsx"
      to: "user_profiles.email"
      via: "checkAccess query checks if email already set"
      pattern: "profile\\.email"
---

<objective>
Use LINE's `email` OAuth scope to automatically capture the user's email during OAuth callback, so the /register/line form only asks for first name and last name when email is already available.

Purpose: Reduce friction in LINE registration by eliminating a redundant form field when LINE already provides the email.
Output: Updated OAuth scope, callback email extraction, conditional form field.
</objective>

<execution_context>
@C:/Users/commo/.claude/get-shit-done/workflows/execute-plan.md
@C:/Users/commo/.claude/get-shit-done/templates/summary.md
</execution_context>

<context>
@src/lib/auth/line-config.js
@src/app/auth/callback/line/route.js
@src/app/(public)/register/line/page.jsx
@src/lib/actions/customer.js
@tests/lib/auth/line-config.test.js
</context>

<tasks>

<task type="auto">
  <name>Task 1: Add email scope and extract email from LINE ID token in callback</name>
  <files>
    src/lib/auth/line-config.js
    src/app/auth/callback/line/route.js
    tests/lib/auth/line-config.test.js
  </files>
  <action>
  1. In `src/lib/auth/line-config.js`, change the `scope` parameter in `getLineLoginUrl` from `'openid profile'` to `'openid profile email'`.

  2. In `src/app/auth/callback/line/route.js`, after the token exchange succeeds (line ~48, after `const tokens = await tokenResponse.json()`), decode the ID token to extract email:
     ```js
     // Extract email from LINE ID token (email claim is in JWT payload)
     let lineRealEmail = null
     if (tokens.id_token) {
       try {
         const payload = JSON.parse(atob(tokens.id_token.split('.')[1]))
         if (payload.email) {
           lineRealEmail = payload.email
         }
       } catch (e) {
         // ID token decode failed — not fatal, email field will remain as fallback
         console.error('Failed to decode LINE ID token:', e.message)
       }
     }
     ```

  3. For NEW users (in the `isNewUser` block, line ~124 where user_profiles is upserted), add `email: lineRealEmail` to the upsert object so user_profiles.email is set if LINE provided it.

  4. For RETURNING users (in the `existingUser` block, around line ~83), after updating auth metadata, also update user_profiles.email IF lineRealEmail is not null AND the user's existing profile has no email. Do a conditional update:
     ```js
     if (lineRealEmail) {
       await admin.from('user_profiles')
         .update({ email: lineRealEmail })
         .eq('user_id', existingUser.id)
         .is('email', null)
     }
     ```
     The `.is('email', null)` ensures we only fill in email if not already set (never overwrite user-provided email).

  5. In `tests/lib/auth/line-config.test.js`, update the test "requests openid and profile scopes" (line ~44) to also assert `email` is in the scope. Change the test name to "requests openid, profile, and email scopes" and add `expect(url).toMatch(/email/)`.
  </action>
  <verify>Run `npm test -- tests/lib/auth/line-config.test.js` — all tests pass including updated scope assertion.</verify>
  <done>LINE OAuth URL includes `email` scope. Callback decodes ID token and stores email in user_profiles for both new and returning users (only when LINE provides it, and only when profile has no email yet).</done>
</task>

<task type="auto">
  <name>Task 2: Conditionally hide email field in register form when email already captured</name>
  <files>
    src/app/(public)/register/line/page.jsx
  </files>
  <action>
  1. In the `checkAccess` useEffect, expand the user_profiles select to include `email`:
     Change `.select('first_name')` to `.select('first_name, email')`.

  2. Add a new state variable `hasEmail` (default `false`):
     ```js
     const [hasEmail, setHasEmail] = useState(false)
     ```

  3. After the `profile?.first_name` check (which redirects if already complete), check if profile has email:
     ```js
     if (profile?.email) {
       setHasEmail(true)
     }
     ```

  4. In the form's `isDisabled` calculation (line ~88), make email validation conditional:
     Change:
     ```js
     const isDisabled = submitting || !form.firstName.trim() || !form.lastName.trim() || !form.email.trim() || !agreed
     ```
     To:
     ```js
     const isDisabled = submitting || !form.firstName.trim() || !form.lastName.trim() || (!hasEmail && !form.email.trim()) || !agreed
     ```

  5. Wrap the email field JSX (lines ~144-157, the div containing the email label, input, and helper text) in a conditional:
     ```jsx
     {!hasEmail && (
       <div className="flex flex-col gap-[8px] w-full">
         <label ...>อีเมล *</label>
         <input type="email" ... />
         <p ...>เราเก็บอีเมลของคุณ...</p>
       </div>
     )}
     ```

  6. In `handleSubmit`, pass `email: hasEmail ? null : form.email` to `completeLineProfile` so it doesn't overwrite the LINE-provided email with empty string:
     ```js
     const result = await completeLineProfile({
       firstName: form.firstName,
       lastName: form.lastName,
       email: hasEmail ? null : form.email,
     })
     ```

  7. In `src/lib/actions/customer.js` in `completeLineProfile`, make the email update conditional — only include `email` in the update object if it is truthy:
     ```js
     const updateData = {
       first_name: sanitized.firstName,
       last_name: sanitized.lastName,
       display_name: displayName,
     }
     if (sanitized.email) {
       updateData.email = sanitized.email
     }
     ```
     Do the same for the auth metadata sync — only include email if truthy.
     This prevents overwriting the LINE-captured email with null/empty.
  </action>
  <verify>
  1. Run `npm test -- tests/lib/actions/customer.test.js` — existing tests still pass.
  2. Run `npm run build` — no build errors.
  </verify>
  <done>
  - When LINE provides email via ID token, /register/line form shows only first name and last name fields (email hidden).
  - When LINE does not provide email, /register/line form shows all three fields (first name, last name, email) as fallback.
  - completeLineProfile never overwrites an existing email with null.
  </done>
</task>

</tasks>

<verification>
1. `npm test` — all tests pass (line-config scope test updated, customer tests unbroken)
2. `npm run build` — production build succeeds
3. Manual flow (when LINE Developer Console has email scope enabled):
   - New LINE login: if LINE provides email, email stored in user_profiles, form shows only name fields
   - New LINE login: if LINE does not provide email, form shows all three fields
   - Returning LINE user: email backfilled if missing
</verification>

<success_criteria>
- LINE OAuth scope includes `email`
- ID token decoded in callback, email extracted and stored in user_profiles
- Register form conditionally hides email field based on profile.email existence
- No regressions in existing tests
- Production build succeeds
</success_criteria>

<output>
After completion, create `.planning/quick/22-use-line-email-scope-to-pre-fill-and-ski/22-SUMMARY.md`
</output>
