---
phase: quick-21
plan: 01
type: execute
wave: 1
depends_on: []
files_modified:
  - supabase/migrations/028_user_profiles_name_email.sql
  - src/app/auth/callback/line/route.js
  - src/app/(public)/register/line/page.jsx
  - src/lib/actions/customer.js
autonomous: true

must_haves:
  truths:
    - "New LINE users are redirected to /register/line after first OAuth login"
    - "The registration form shows first_name, last_name, email fields matching Figma design"
    - "Submitting the form saves first_name, last_name, email to user_profiles and redirects to /account"
    - "Returning LINE users (who already have first_name) skip the form and go to /"
    - "Direct visits to /register/line by non-LINE or already-completed users redirect away"
  artifacts:
    - path: "supabase/migrations/028_user_profiles_name_email.sql"
      provides: "first_name, last_name, email columns on user_profiles"
      contains: "ALTER TABLE user_profiles"
    - path: "src/app/(public)/register/line/page.jsx"
      provides: "Profile completion form page"
      min_lines: 50
    - path: "src/app/auth/callback/line/route.js"
      provides: "New user redirect to /register/line"
      contains: "register/line"
    - path: "src/lib/actions/customer.js"
      provides: "completeLineProfile server action"
      exports: ["completeLineProfile"]
  key_links:
    - from: "src/app/auth/callback/line/route.js"
      to: "/register/line"
      via: "redirect for isNewUser"
      pattern: "register/line"
    - from: "src/app/(public)/register/line/page.jsx"
      to: "src/lib/actions/customer.js"
      via: "completeLineProfile server action call"
      pattern: "completeLineProfile"
    - from: "src/lib/actions/customer.js"
      to: "user_profiles"
      via: "update first_name, last_name, email columns"
      pattern: "first_name.*last_name.*email"
---

<objective>
Add a profile completion form for new LINE Login users so they can provide their first name, last name, and email after their first OAuth login.

Purpose: LINE OAuth only provides a display name. The business needs structured name fields and email for quotations, communications, and account management.
Output: Migration file, updated LINE callback, new registration page, new server action.
</objective>

<execution_context>
@C:/Users/commo/.claude/get-shit-done/workflows/execute-plan.md
@C:/Users/commo/.claude/get-shit-done/templates/summary.md
</execution_context>

<context>
@src/components/LoginModal.jsx (RegisterScreen component has the exact form UI to replicate)
@src/app/auth/callback/line/route.js (LINE OAuth callback - needs new user redirect)
@src/lib/actions/customer.js (customer server actions - add completeLineProfile)
@src/app/(public)/layout.jsx (public layout wraps /register/line page)
@src/lib/auth/route-rules.js (middleware route rules - /register/line is public, falls through to allow)
@supabase/migrations/001_initial_schema.sql (user_profiles table definition)
</context>

<tasks>

<task type="auto">
  <name>Task 1: Database migration and server action for LINE profile completion</name>
  <files>
    supabase/migrations/028_user_profiles_name_email.sql
    src/lib/actions/customer.js
  </files>
  <action>
    1. Create migration `supabase/migrations/028_user_profiles_name_email.sql`:
       - ALTER TABLE user_profiles ADD COLUMN first_name text;
       - ALTER TABLE user_profiles ADD COLUMN last_name text;
       - ALTER TABLE user_profiles ADD COLUMN email text;
       - No NOT NULL constraints (existing rows would break, and SMS OTP users may not have these)

    2. Add `completeLineProfile` server action to `src/lib/actions/customer.js`:
       - Export async function `completeLineProfile({ firstName, lastName, email })`
       - Get authenticated user via `createClient()` server client
       - If no user, return `{ error: 'Not authenticated' }`
       - Sanitize inputs using `sanitizeObject`
       - Update `user_profiles` row for user_id: set `first_name`, `last_name`, `email`, `display_name` = `${firstName} ${lastName}`
       - Also update Supabase Auth user_metadata via `supabase.auth.updateUser({ data: { display_name, first_name, last_name, email } })`
       - `revalidatePath('/account')`
       - Return `{ error: null }` on success

    Note: Use the existing `createClient` (server client, respects RLS) for the profile update since RLS allows users to update their own row. Use sanitizeObject from `@/lib/sanitize` (already imported in customer.js).
  </action>
  <verify>
    - Migration file exists with correct ALTER TABLE statements
    - `completeLineProfile` is exported from customer.js
    - Function handles auth check, sanitization, profile update, and auth metadata update
  </verify>
  <done>
    - user_profiles table has first_name, last_name, email columns (nullable)
    - completeLineProfile server action updates both user_profiles and auth user_metadata
  </done>
</task>

<task type="auto">
  <name>Task 2: LINE callback redirect and profile completion page</name>
  <files>
    src/app/auth/callback/line/route.js
    src/app/(public)/register/line/page.jsx
  </files>
  <action>
    1. Update `src/app/auth/callback/line/route.js`:
       - Change the final redirect (line 181): when `isNewUser` is true, redirect to `${origin}/register/line` instead of `${origin}/`
       - Keep existing user redirect to `${origin}/` unchanged

    2. Create `src/app/(public)/register/line/page.jsx` as a CLIENT component ('use client'):

       The page lives under the (public) route group so it automatically gets TopBar/Navbar/Footer from the public layout.

       **Guard logic (on mount via useEffect):**
       - Import `createClient` from `@/lib/supabase/client`
       - Get current user via `supabase.auth.getUser()`
       - If no user: redirect to `/` via `router.push('/')`
       - If user has app_metadata.provider !== 'line': redirect to `/` (not a LINE user)
       - Query `user_profiles` for the user's row; if `first_name` is already set, redirect to `/account` (already completed)
       - While checking, show a loading state

       **Form UI (replicate RegisterScreen from LoginModal.jsx):**
       - WoodSmith logo at top (import from `@/assets/6727cae5f32ea2c35a94792ae9603addc6300612.png`)
       - Heading: "สร้างบัญชี WoodSmith"
       - Subtitle: "โปรดกรอกรายละเอียดของคุณเพื่อสร้างบัญชี"
       - Show "ลงทะเบียนด้วย LINE" with the user's LINE display name (from user_metadata.display_name)
       - Form fields in a centered container (max-w-[450px] mx-auto):
         - ชื่อจริง * and นามสกุล * side-by-side (flex-col lg:flex-row gap-[24px])
         - อีเมล * full width
         - All inputs: h-[42px] border border-[#e5e7eb] px-[16px] font-['IBM_Plex_Sans_Thai'] text-[14px] text-black outline-none
       - Terms checkbox: "ฉันได้อ่านและยอมรับ ข้อตกลงและเงื่อนไขการใช้บริการ" (orange underline on terms link)
       - "สร้างบัญชี" button: w-full h-[48px] bg-orange, disabled when fields empty or terms unchecked
       - Error message display if submission fails (red text below button)

       **Form submission:**
       - Import `completeLineProfile` from `@/lib/actions/customer`
       - Call `completeLineProfile({ firstName, lastName, email })`
       - On success: `router.push('/account')`
       - On error: show error message
       - Disable button during submission (loading state)

       **Page layout:**
       - Center the form content: py-[60px] px-[20px] with a max-w-[450px] mx-auto wrapper
       - This is a standalone page (not a modal), so give it proper vertical padding
       - The page is within (public) route group so TopBar/Footer are already present

       **Style reference:** Copy the exact input/button/label styling from RegisterScreen in LoginModal.jsx lines 186-271. The form fields, labels, checkbox, and buttons should be pixel-identical.
  </action>
  <verify>
    - LINE callback redirects new users to /register/line
    - `/register/line` page renders with form fields
    - Guard redirects unauthenticated users to /
    - Guard redirects non-LINE users to /
    - Guard redirects users who already completed profile to /account
    - Form submission calls completeLineProfile and redirects to /account
    - `npm run build` passes without errors
  </verify>
  <done>
    - New LINE users see profile completion form after first login
    - Form collects first_name, last_name, email with terms checkbox
    - Successful submission saves data and redirects to /account
    - Returning LINE users bypass the form entirely
  </done>
</task>

</tasks>

<verification>
1. Full flow test: LINE OAuth -> callback -> redirect to /register/line -> fill form -> submit -> /account
2. Guard test: Visit /register/line without auth -> redirects to /
3. Guard test: Visit /register/line as non-LINE user -> redirects to /
4. Guard test: Visit /register/line as LINE user with completed profile -> redirects to /account
5. Returning LINE user flow: LINE OAuth -> callback -> redirect to / (not /register/line)
6. `npm run build` passes
</verification>

<success_criteria>
- New LINE users complete their profile with first_name, last_name, email before reaching the main site
- The form matches the RegisterScreen design from LoginModal.jsx (Figma node 52-10279)
- Profile data is stored in both user_profiles table and Supabase Auth user_metadata
- Page guards prevent unauthorized access and double-completion
- Build succeeds without errors
</success_criteria>

<output>
After completion, create `.planning/quick/21-line-login-profile-completion-form-for-n/21-SUMMARY.md`
</output>
