---
phase: quick-20
plan: 01
type: execute
wave: 1
depends_on: []
files_modified:
  - src/app/auth/callback/line/route.js
  - src/lib/actions/customer.js
autonomous: true
must_haves:
  truths:
    - "LINE Login creates a Supabase auth session after redirect"
    - "User is logged in (session cookie set) when redirected to homepage"
    - "LINE user profile data (displayName, pictureUrl, lineUserId) stored in user_metadata"
    - "Returning LINE users reuse existing Supabase account (no duplicate)"
    - "New LINE users get a user_profiles row with role=customer and auth_provider=line"
  artifacts:
    - path: "src/app/auth/callback/line/route.js"
      provides: "LINE callback that creates Supabase session via admin API"
    - path: "src/lib/actions/customer.js"
      provides: "createLineCustomerProfile server-side helper"
  key_links:
    - from: "src/app/auth/callback/line/route.js"
      to: "supabase.auth.admin"
      via: "createServiceClient for admin user management"
      pattern: "auth\\.admin\\.(listUsers|createUser|generateLink)"
    - from: "src/app/auth/callback/line/route.js"
      to: "supabase.auth.verifyOtp"
      via: "cookie-aware server client exchanges magiclink token for session"
      pattern: "verifyOtp.*token_hash"
---

<objective>
Fix LINE Login so that after the OAuth redirect, a real Supabase Auth session is created and the user is logged in.

Purpose: Currently the LINE callback exchanges the code for a LINE token and profile, but never creates a Supabase Auth user or session. It just redirects with profile data as a query parameter, which nothing consumes. The user appears not logged in after LINE Login.

Output: Working LINE Login flow that creates/finds a Supabase user, establishes a session cookie, and redirects the logged-in user to the homepage.
</objective>

<execution_context>
@C:/Users/commo/.claude/get-shit-done/workflows/execute-plan.md
@C:/Users/commo/.claude/get-shit-done/templates/summary.md
</execution_context>

<context>
@src/app/auth/callback/line/route.js
@src/app/auth/callback/route.js
@src/lib/supabase/admin.js
@src/lib/supabase/server.js
@src/lib/actions/customer.js
@src/lib/auth/line-config.js
@src/components/LoginModal.jsx
@middleware.js
</context>

<tasks>

<task type="auto">
  <name>Task 1: Rewrite LINE callback to create Supabase session</name>
  <files>src/app/auth/callback/line/route.js, src/lib/actions/customer.js</files>
  <action>
Rewrite the LINE OAuth callback route to properly create a Supabase Auth session.

**In `src/app/auth/callback/line/route.js`:**

The current flow stops after getting the LINE profile and redirects with profile data in a query param. Replace the entire section after `const profile = await profileResponse.json()` with:

1. **Find or create Supabase user via admin API:**
   - Use `createServiceClient()` from `@/lib/supabase/admin` (service role client)
   - Use a deterministic email pattern for LINE users: `line_{profile.userId}@line.placeholder` (Supabase requires an email for user identification)
   - Call `admin.auth.admin.listUsers()` and filter by `app_metadata.provider === 'line'` AND `app_metadata.line_user_id === profile.userId` to find existing user
   - If NOT found: call `admin.auth.admin.createUser()` with:
     ```js
     {
       email: `line_${profile.userId}@line.placeholder`,
       email_confirm: true,  // Skip email verification
       app_metadata: { provider: 'line', line_user_id: profile.userId },
       user_metadata: {
         display_name: profile.displayName,
         picture_url: profile.pictureUrl || null,
         line_user_id: profile.userId,
         role: 'customer',
       },
     }
     ```
   - If found: update user_metadata with latest LINE profile (displayName/pictureUrl may change):
     ```js
     admin.auth.admin.updateUserById(existingUser.id, {
       user_metadata: {
         display_name: profile.displayName,
         picture_url: profile.pictureUrl || null,
         line_user_id: profile.userId,
         role: existingUser.user_metadata?.role || 'customer',
       },
     })
     ```

2. **Generate a magic link token for session establishment:**
   - Call `admin.auth.admin.generateLink({ type: 'magiclink', email: userEmail })` where `userEmail` is the LINE user's placeholder email
   - This returns `data.properties.hashed_token`

3. **Create a cookie-aware Supabase client (like the standard auth callback route does):**
   - Import `createServerClient` from `@supabase/ssr` and `cookies` from `next/headers`
   - Create a Supabase client with cookie read/write access (copy the pattern from `src/app/auth/callback/route.js`)
   - Call `supabase.auth.verifyOtp({ token_hash: hashedToken, type: 'magiclink' })` to establish the session and set cookies

4. **Create user_profiles row for new LINE users:**
   - After creating a new Supabase auth user, insert a `user_profiles` row via the service client:
     ```js
     admin.from('user_profiles').insert({
       user_id: newUser.id,
       display_name: profile.displayName,
       phone: null,
       role: 'customer',
       auth_provider: 'line',
       avatar_url: profile.pictureUrl || null,
     })
     ```
   - Only do this for NEW users (not returning users)
   - Use `.upsert()` with `onConflict: 'user_id'` as a safety net against duplicates

5. **Redirect to homepage on success:** `NextResponse.redirect(origin + '/')` (no query params needed since session cookie handles auth state)

6. **Error handling:** If any step fails, log the error and redirect with `?auth_error=line_session_failed`

**In `src/lib/actions/customer.js`:**
   - Remove the `email` field from `createCustomerProfile` insert (the `user_profiles` table does NOT have an `email` column per migration 001). The email should only be stored in Supabase Auth `user_metadata`, not in `user_profiles`.

**Key implementation notes:**
- Do NOT use `createClient()` from `@/lib/supabase/server` for admin operations (it uses anon key). Use `createServiceClient()` for admin auth API calls.
- DO use a cookie-aware client (like `src/app/auth/callback/route.js`) for the `verifyOtp` call that establishes the session. This client needs `cookies()` from `next/headers` to set the session cookies.
- The `generateLink` + `verifyOtp` pattern is the standard way to programmatically sign in a user server-side in Supabase when you don't have their password.
  </action>
  <verify>
1. `npm run build` passes without errors
2. `npm test` passes (existing tests should not break)
3. Code review: The LINE callback route must:
   - Import createServiceClient from admin.js
   - Call auth.admin.createUser or auth.admin.listUsers
   - Call auth.admin.generateLink with type magiclink
   - Create a cookie-aware client and call verifyOtp with token_hash
   - Redirect to `/` without query params on success
   - Insert into user_profiles for new users with auth_provider: 'line'
  </verify>
  <done>
LINE Login OAuth callback creates a real Supabase Auth user (or finds existing), generates a magic link token, exchanges it for a session via cookie-aware client, and redirects the user to the homepage fully authenticated. New LINE users get a user_profiles row with role=customer and auth_provider=line. Returning LINE users reuse their existing account. The createCustomerProfile function no longer attempts to insert a non-existent email column.
  </done>
</task>

</tasks>

<verification>
- `npm run build` succeeds
- `npm test` passes (no regression)
- LINE callback route uses admin API (createServiceClient) for user management
- LINE callback route uses cookie-aware client for session establishment
- New LINE users get both auth.users entry AND user_profiles row
- Returning LINE users reuse existing Supabase account
- No LINE profile data leaked in URL query parameters
</verification>

<success_criteria>
- After LINE Login OAuth flow, the user is redirected to homepage with an active Supabase session
- Middleware recognizes the user as authenticated (session cookie set correctly)
- The user can access /account routes after LINE Login
- No duplicate Supabase auth users created for the same LINE account
</success_criteria>

<output>
After completion, create `.planning/quick/20-fix-line-login-user-registration-after-r/20-SUMMARY.md`
</output>
