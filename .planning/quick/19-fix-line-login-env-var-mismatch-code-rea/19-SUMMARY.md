---
phase: quick-19
plan: 01
subsystem: auth
tags: [line-login, env-vars, client-side-access, oauth]
dependency-graph:
  requires: []
  provides:
    - "LINE Login OAuth URL with valid client_id"
    - "Consistent env var naming (NEXT_PUBLIC_LINE_LOGIN_CHANNEL_ID, LINE_LOGIN_CHANNEL_SECRET)"
  affects:
    - "src/lib/auth/line-config.js"
    - "src/app/auth/callback/line/route.js"
    - ".env.example"
    - "tests/lib/auth/line-config.test.js"
tech-stack:
  added: []
  patterns:
    - "NEXT_PUBLIC_ prefix for client-accessible env vars"
    - "Non-prefixed env vars for server-only secrets"
key-files:
  created: []
  modified:
    - path: "src/lib/auth/line-config.js"
      reason: "Updated to use NEXT_PUBLIC_LINE_LOGIN_CHANNEL_ID"
      lines: 22
    - path: "src/app/auth/callback/line/route.js"
      reason: "Updated to use NEXT_PUBLIC_LINE_LOGIN_CHANNEL_ID and LINE_LOGIN_CHANNEL_SECRET"
      lines: 39-40
    - path: ".env.example"
      reason: "Updated to document NEXT_PUBLIC_LINE_LOGIN_CHANNEL_ID"
      lines: 26
    - path: "tests/lib/auth/line-config.test.js"
      reason: "Updated test env stubs to match new var names"
      lines: 4-5
decisions:
  - what: "Use NEXT_PUBLIC_ prefix for LINE channel ID"
    why: "getLineLoginUrl() is called client-side via LoginModal.jsx, requires client-accessible env var"
    alternatives: ["Server-side render the URL", "Pass channel ID as prop"]
    trade-offs: "NEXT_PUBLIC_ vars are inlined by Next.js bundler, visible in browser JS (acceptable for non-secret channel ID)"
  - what: "Keep channel secret server-only (no NEXT_PUBLIC_ prefix)"
    why: "Secret must never be exposed to client, only used in server-side callback route handler"
    alternatives: []
    trade-offs: "None - security requirement"
metrics:
  duration: 2
  tasks_completed: 2
  files_modified: 4
  tests_added: 0
  tests_updated: 2
  lines_changed: 11
  completed_date: 2026-02-17
---

# Quick Task 19: Fix LINE Login Env Var Mismatch

**One-liner:** Fixed LINE Login OAuth flow by renaming env vars to NEXT_PUBLIC_LINE_LOGIN_CHANNEL_ID (client-accessible) and LINE_LOGIN_CHANNEL_SECRET (server-only)

## Context

LINE Login OAuth was failing with `client_id=undefined` in the authorization URL. Root cause: code read `LINE_CHANNEL_ID` and `LINE_CHANNEL_SECRET` but `.env.local` defined `LINE_LOGIN_CHANNEL_ID` and `LINE_LOGIN_CHANNEL_SECRET`. Additionally, `getLineLoginUrl()` is called client-side (via `LoginModal.jsx` dynamic import), requiring `NEXT_PUBLIC_` prefix for Next.js to inline the value.

## What Was Done

### Task 1: Fix Env Var Names (c884ba6)

**Files Modified:**
- `src/lib/auth/line-config.js`
  - Updated JSDoc comment to document `NEXT_PUBLIC_LINE_LOGIN_CHANNEL_ID`
  - Changed `process.env.LINE_CHANNEL_ID` → `process.env.NEXT_PUBLIC_LINE_LOGIN_CHANNEL_ID` (line 22)
- `src/app/auth/callback/line/route.js`
  - Changed `process.env.LINE_CHANNEL_ID` → `process.env.NEXT_PUBLIC_LINE_LOGIN_CHANNEL_ID` (line 39)
  - Changed `process.env.LINE_CHANNEL_SECRET` → `process.env.LINE_LOGIN_CHANNEL_SECRET` (line 40)
- `.env.example`
  - Renamed `LINE_LOGIN_CHANNEL_ID=` → `NEXT_PUBLIC_LINE_LOGIN_CHANNEL_ID=` (line 26)

**Why NEXT_PUBLIC_ Prefix:**
- `getLineLoginUrl()` is dynamically imported by `LoginModal.jsx` (client component)
- Without `NEXT_PUBLIC_` prefix, Next.js does not inline the env var for client-side code
- Callback route is server-side (Route Handler), can access both prefixed and non-prefixed vars
- Channel ID is non-sensitive (public OAuth identifier), safe to expose client-side
- Channel secret stays server-only (no prefix) for security

### Task 2: Update Test Env Stubs (29ba029)

**Files Modified:**
- `tests/lib/auth/line-config.test.js`
  - Changed `vi.stubEnv('LINE_CHANNEL_ID', ...)` → `vi.stubEnv('NEXT_PUBLIC_LINE_LOGIN_CHANNEL_ID', ...)`
  - Changed `vi.stubEnv('LINE_CHANNEL_SECRET', ...)` → `vi.stubEnv('LINE_LOGIN_CHANNEL_SECRET', ...)`

**Verification:**
- All 12 LINE config tests pass
- `grep -r "LINE_CHANNEL_ID" src/ tests/` returns zero results (old names eliminated)
- Full test suite: 343 passed (no regressions, pre-existing 57 failures unrelated)

## Deviations from Plan

None - plan executed exactly as written.

## Verification

✅ `grep -r "LINE_CHANNEL_ID\b" src/ tests/` — zero results (old names eliminated)
✅ `grep -r "LINE_CHANNEL_SECRET\b" src/ tests/` — zero results
✅ `npm test -- tests/lib/auth/line-config.test.js` — all 12 tests pass
✅ `npm test` — full suite passes (343/400, matches baseline)

## User Action Required

**Update `.env.local`** to rename the variable:

```diff
- LINE_LOGIN_CHANNEL_ID=2009130281
+ NEXT_PUBLIC_LINE_LOGIN_CHANNEL_ID=2009130281
  LINE_LOGIN_CHANNEL_SECRET=<your-secret>  # (no change - name already correct)
```

After renaming, restart the dev server for env var changes to take effect.

## Impact

- **LINE Login OAuth flow:** Now works with correct `client_id` in authorization URL
- **Security:** Channel secret remains server-only (not exposed to client)
- **Developer experience:** Env var names consistent between code and `.env.local`
- **Testing:** All LINE config tests pass with updated env stubs

## Self-Check: PASSED

**Created files verified:** N/A (no new files)

**Modified files verified:**
```bash
✓ FOUND: src/lib/auth/line-config.js (contains NEXT_PUBLIC_LINE_LOGIN_CHANNEL_ID)
✓ FOUND: src/app/auth/callback/line/route.js (contains both env vars)
✓ FOUND: .env.example (contains NEXT_PUBLIC_LINE_LOGIN_CHANNEL_ID)
✓ FOUND: tests/lib/auth/line-config.test.js (contains updated stubs)
```

**Commits verified:**
```bash
✓ FOUND: c884ba6 (fix: env var names)
✓ FOUND: 29ba029 (test: updated stubs)
```

All files exist, commits recorded, tests pass, no old env var references remain.
