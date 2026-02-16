---
phase: quick-19
plan: 01
type: execute
wave: 1
depends_on: []
files_modified:
  - src/lib/auth/line-config.js
  - src/app/auth/callback/line/route.js
  - .env.example
  - tests/lib/auth/line-config.test.js
autonomous: true
must_haves:
  truths:
    - "LINE Login OAuth URL contains a valid client_id (not undefined)"
    - "LINE callback token exchange uses correct channel ID and secret"
    - "Env var names are consistent between code, .env.example, and .env.local"
  artifacts:
    - path: "src/lib/auth/line-config.js"
      provides: "Client-safe LINE channel ID access"
      contains: "NEXT_PUBLIC_LINE_LOGIN_CHANNEL_ID"
    - path: "src/app/auth/callback/line/route.js"
      provides: "Server-side token exchange with correct env vars"
      contains: "LINE_LOGIN_CHANNEL_SECRET"
    - path: ".env.example"
      provides: "Correct env var documentation"
      contains: "NEXT_PUBLIC_LINE_LOGIN_CHANNEL_ID"
  key_links:
    - from: "src/lib/auth/line-config.js"
      to: "NEXT_PUBLIC_LINE_LOGIN_CHANNEL_ID env var"
      via: "process.env.NEXT_PUBLIC_LINE_LOGIN_CHANNEL_ID"
      pattern: "process\\.env\\.NEXT_PUBLIC_LINE_LOGIN_CHANNEL_ID"
    - from: "src/app/auth/callback/line/route.js"
      to: "LINE_LOGIN_CHANNEL_SECRET env var"
      via: "process.env.LINE_LOGIN_CHANNEL_SECRET"
      pattern: "process\\.env\\.LINE_LOGIN_CHANNEL_SECRET"
---

<objective>
Fix LINE Login env var mismatch causing `client_id=undefined` in OAuth URL.

Purpose: The code reads `LINE_CHANNEL_ID` and `LINE_CHANNEL_SECRET` but `.env.local` defines `LINE_LOGIN_CHANNEL_ID` and `LINE_LOGIN_CHANNEL_SECRET`. Additionally, `getLineLoginUrl()` is called client-side (via `LoginModal.jsx`) so the channel ID needs `NEXT_PUBLIC_` prefix. The channel secret stays server-only (used only in the callback route handler).

Output: LINE Login OAuth flow works with correct env var names and client-side accessibility.
</objective>

<execution_context>
@C:/Users/commo/.claude/get-shit-done/workflows/execute-plan.md
@C:/Users/commo/.claude/get-shit-done/templates/summary.md
</execution_context>

<context>
@src/lib/auth/line-config.js
@src/app/auth/callback/line/route.js
@src/components/LoginModal.jsx (lines 325-332 — handleLineLogin calls getLineLoginUrl client-side)
@.env.example
@tests/lib/auth/line-config.test.js
</context>

<tasks>

<task type="auto">
  <name>Task 1: Fix env var names in LINE config, callback route, and docs</name>
  <files>
    src/lib/auth/line-config.js
    src/app/auth/callback/line/route.js
    .env.example
  </files>
  <action>
In `src/lib/auth/line-config.js`:
- Line 5: Update JSDoc comment from `LINE_CHANNEL_ID` to `NEXT_PUBLIC_LINE_LOGIN_CHANNEL_ID`
- Line 6: Update JSDoc comment from `LINE_CHANNEL_SECRET` to `LINE_LOGIN_CHANNEL_SECRET`
- Line 22: Change `process.env.LINE_CHANNEL_ID` to `process.env.NEXT_PUBLIC_LINE_LOGIN_CHANNEL_ID`

The channel ID needs NEXT_PUBLIC_ prefix because `getLineLoginUrl()` is dynamically imported by `LoginModal.jsx` (a client component) at line 326. Without the prefix, Next.js does not inline the value and it resolves to `undefined` at runtime.

The channel secret is NOT referenced in line-config.js, so no change needed there.

In `src/app/auth/callback/line/route.js`:
- Line 39: Change `process.env.LINE_CHANNEL_ID` to `process.env.NEXT_PUBLIC_LINE_LOGIN_CHANNEL_ID`
- Line 40: Change `process.env.LINE_CHANNEL_SECRET` to `process.env.LINE_LOGIN_CHANNEL_SECRET`

The callback route is a server-side Route Handler (runs only on the server), so it CAN access both NEXT_PUBLIC_ and non-prefixed vars. Using NEXT_PUBLIC_ for channel ID keeps it consistent with line-config.js. The secret stays non-prefixed (server-only) for security.

In `.env.example`:
- Line 26: Change `LINE_LOGIN_CHANNEL_ID=` to `NEXT_PUBLIC_LINE_LOGIN_CHANNEL_ID=`
- Keep `LINE_LOGIN_CHANNEL_SECRET=` as-is (already correct name, no NEXT_PUBLIC_ needed for secrets)
- Keep `LINE_LOGIN_CALLBACK_URL=` as-is

Also remind user (in summary) to update `.env.local`: rename `LINE_LOGIN_CHANNEL_ID` to `NEXT_PUBLIC_LINE_LOGIN_CHANNEL_ID`.
  </action>
  <verify>
Run `grep -r "LINE_CHANNEL_ID" src/` and confirm zero results (old name fully eliminated).
Run `grep -r "NEXT_PUBLIC_LINE_LOGIN_CHANNEL_ID" src/` and confirm it appears in line-config.js and route.js.
Run `grep -r "LINE_LOGIN_CHANNEL_SECRET" src/` and confirm it appears in route.js.
  </verify>
  <done>
All LINE env var references match: code reads NEXT_PUBLIC_LINE_LOGIN_CHANNEL_ID (client-safe) and LINE_LOGIN_CHANNEL_SECRET (server-only). .env.example documents the correct names.
  </done>
</task>

<task type="auto">
  <name>Task 2: Update test env stubs to match new var names</name>
  <files>tests/lib/auth/line-config.test.js</files>
  <action>
In `tests/lib/auth/line-config.test.js`:
- Line 4: Change `vi.stubEnv('LINE_CHANNEL_ID', 'test-channel-id')` to `vi.stubEnv('NEXT_PUBLIC_LINE_LOGIN_CHANNEL_ID', 'test-channel-id')`
- Line 5: Change `vi.stubEnv('LINE_CHANNEL_SECRET', 'test-channel-secret')` to `vi.stubEnv('LINE_LOGIN_CHANNEL_SECRET', 'test-channel-secret')`

No other test logic changes needed -- the test assertions check URL content (client_id=test-channel-id) which remains the same.
  </action>
  <verify>
Run `npm test -- tests/lib/auth/line-config.test.js` and confirm all 11 tests pass.
  </verify>
  <done>Tests pass with updated env var names. No references to old LINE_CHANNEL_ID or LINE_CHANNEL_SECRET remain in test files.</done>
</task>

</tasks>

<verification>
1. `grep -r "LINE_CHANNEL_ID\b" src/ tests/` returns zero results (old names eliminated everywhere)
2. `grep -r "LINE_CHANNEL_SECRET\b" src/ tests/` returns zero results (old name eliminated)
3. `npm test -- tests/lib/auth/line-config.test.js` -- all 11 tests pass
4. `npm test` -- full test suite passes (no regressions)
</verification>

<success_criteria>
- NEXT_PUBLIC_LINE_LOGIN_CHANNEL_ID used in line-config.js and route.js (client-accessible)
- LINE_LOGIN_CHANNEL_SECRET used in route.js only (server-only, never exposed to client)
- .env.example documents correct variable names
- All existing tests pass with updated env var stubs
- No references to old LINE_CHANNEL_ID or LINE_CHANNEL_SECRET remain in codebase
</success_criteria>

<output>
After completion, create `.planning/quick/19-fix-line-login-env-var-mismatch-code-rea/19-SUMMARY.md`

Note to user: After this fix, rename the variable in `.env.local`:
- `LINE_LOGIN_CHANNEL_ID=2009130281` becomes `NEXT_PUBLIC_LINE_LOGIN_CHANNEL_ID=2009130281`
- `LINE_LOGIN_CHANNEL_SECRET` stays as-is (name already correct)
</output>
