# Project State

## Project Reference

See: .planning/PROJECT.md (updated 2026-02-15)

**Core value:** Customers can browse products and submit quotation requests seamlessly

**Current focus:** v1.1 Variations Management

## Current Position

Milestone: v1.1 Variations Management
Phase: 7 of 7 (Product Integration)
Current Plan: 2 of 2
Status: Complete
Last activity: 2026-02-18 — Completed quick task 25: Fix LINE OAuth CSRF and createCustomerProfile IDOR security vulnerabilities

Progress: [███████░░░] 70% (across all milestones: 7 of 10 phases complete, Phase 7: 2 of 2 plans done)

## Milestone History

| Milestone | Phases | Plans | Status | Shipped |
|-----------|--------|-------|--------|---------|
| v1.0 Bug Fix | 1-3 | 5 | ✓ Complete | 2026-02-15 |
| v1.1 Variations Management | 4-7 | 5 | ✓ Complete | 2026-02-15 |

## Performance Metrics

**v1.0 Velocity:**
- Total plans completed: 5
- Average duration: 5 min
- Total execution time: 0.43 hours

**By Phase:**

| Phase | Plans | Total | Avg/Plan |
|-------|-------|-------|----------|
| 1. Critical Bug Fixes | 2 | 6 min | 3 min |
| 2. Cosmetic Bug Fixes | 1 | 9 min | 9 min |
| 3. Hydration Warning Cleanup | 2 | 10 min | 5 min |
| 4. Database Infrastructure | 1 | 1 min | 1 min |

**v1.1 Velocity:**
- Total plans completed: 6
- Average duration: 3 min
- Total execution time: 0.25 hours

**By Phase:**

| Phase | Plans | Total | Avg/Plan |
|-------|-------|-------|----------|
| 4. Database Infrastructure | 1 | 1 min | 1 min |
| 5. Variation CRUD Operations | 1 | 2 min | 2 min |
| 6. Variation Admin UI | 2 | 7 min | 3.5 min |
| 7. Product Integration | 2 | 6 min | 3 min |

## Accumulated Context

### Decisions

All decisions logged in PROJECT.md Key Decisions table.

Recent decisions affecting v1.1:
- Linked variation groups with per-product entry selection (flexible: shared groups reduce repetitive data entry, per-product picks allow customization)
- Start fresh for variations, keep existing product_options (avoids risky data migration)
- Only variation_groups has updated_at column (entries and links are immutable)
- UNIQUE constraint on (product_id, entry_id) prevents duplicate variation links
- variation_groups and variation_entries allow unrestricted public read (shared catalog)
- product_variation_links filter by products.published for public read (matches product_images/product_options pattern)
- variationEntryUpdateSchema omits group_id (entries cannot be moved between groups after creation)
- deleteVariationGroup returns warning if products linked (requires force flag to proceed)
- Swatch images stored in products bucket at variations/{groupId}/ path (no new bucket needed)
- All variation mutations use createServiceClient (service role bypasses RLS for admin writes)
- Follow FaqListClient pattern for variations list (no pagination needed for small group count)
- Implement two-step delete flow with force confirmation for linked variation groups
- [Phase 06]: Two-phase create flow for variation groups (group first, then entries)
- [Phase 06]: Immediate delete for variation entries (not batched with save)
- [Phase 07]: Bulk replace pattern for product-variation link sync (delete-all-then-insert ensures consistency)
- [Phase 07]: Auto-select all entries when adding variation group (user-friendly default)
- [Phase 07]: Place VariationLinker after OptionsAccordion (section 8.5) to keep variations separate from legacy product_options
- [Phase 07]: Sync variation links AFTER product mutation succeeds to prevent orphaned links
- [Quick 13]: Two separate requireAdmin functions (requireAdmin for actions, requireAdminOrRedirect for layouts) for context-appropriate behavior
- [Quick 13]: All admin-only functions protected including read operations (createServiceClient bypasses RLS, must be admin-gated)
- [Quick 14]: Role verification at login prevents customer authentication at /login form level (defense-in-depth with middleware)
- [Quick 14]: Immediate signOut on role failure prevents redirect loops from lingering session cookies
- [Quick 15]: Dual-write role to both user_profiles table and auth user_metadata (user_profiles for queries, user_metadata for auth checks)
- [Quick 15]: updateUserRole syncs to auth immediately (no deferred sync) to ensure role changes take effect on next login
- [Quick 16]: /admin/login route check MUST precede general /admin check to prevent redirect loops (route precedence pattern)
- [Quick 16]: Old /login path falls through to default allow (no longer special, available for future customer login modal)
- [Quick 18]: Sibling route groups (auth) and (dashboard) for independent layouts (eliminates x-pathname header workaround)
- [Quick 18]: Minimal parent layout when children have distinct chrome requirements (pass-through pattern)
- [Phase quick-19]: NEXT_PUBLIC_ prefix for LINE channel ID enables client-side OAuth URL generation
- [Quick 20]: Magic link token + verifyOtp pattern for programmatic server-side login without password
- [Quick 20]: Deterministic email pattern (line_{userId}@line.placeholder) for LINE users in Supabase Auth
- [Quick 20]: Dual metadata storage (app_metadata for user lookup, user_metadata for profile access) for LINE users
- [Quick 20]: User_profiles row with auth_provider=line distinguishes LINE users from SMS OTP users
- [Quick 21]: Profile completeness tracked via explicit profile_complete boolean column (migration 029) — not IS NULL (more reliable)
- [Quick 21]: Guard checks app_metadata.line_user_id (Supabase resets app_metadata.provider to 'email' after verifyOtp — do NOT use provider for LINE identification)
- [Quick 21]: Auth metadata update in completeLineProfile is non-fatal; user_profiles is source of truth
- [Quick 22]: Email extracted from LINE ID token JWT payload via atob decode — no extra API call needed
- [Quick 22]: .is('email', null) guard on returning-user backfill prevents overwriting user-entered email
- [Quick 22]: completeLineProfile null-safe email update (only included when truthy) prevents overwriting LINE-captured email with empty string
- [Quick 22]: hasEmail state in /register/line drives conditional email field render based on profile.email existence
- [Quick 23]: profile_complete: true stored in user_metadata so Navbar can gate UI client-side without a DB query
- [Quick 23]: Navbar shows login button (not avatar) until profile_complete = true — prevents partial-registration confusion
- [Quick 23]: display_name = firstName in user_metadata; navbar computed as "FirstName L." from first_name + last_name[0]
- [Quick 23b]: PhoneLoginScreen owns sending/error state; parent handleSendOtp returns { error } or undefined (not void) so child can react
- [Quick 23b]: On OTP send success, sending stays true — screen transitions away, no cleanup needed
- [Quick 23b]: handleSendOtp wrapped in try/catch to handle both Supabase errors and unexpected exceptions
- [Quick 23b]: docs/SUPABASE_SMS_SETUP.md documents OTP expiry as 179s to match LoginModal countdown timer exactly
- [Quick 24]: phone_otp_codes table (migration 030) stores OTP with 3-minute expiry; service role only access
- [Quick 24]: sendPhoneOtp generates OTP, upserts to DB, delivers via SMSKUB /api/messages directly (no Supabase phone auth needed)
- [Quick 24]: verifyPhoneOtp validates OTP against DB, marks used, finds/creates Supabase user, generates magic link, establishes session via verifyOtp (mirrors LINE Login pattern)
- [Quick 24]: New SMS users get placeholder email phone_{phone}@phone.placeholder + user_profiles row with auth_provider=sms, profile_complete=false
- [Quick 24]: LoginModal now calls sendPhoneOtp/verifyPhoneOtp server actions instead of supabase.auth.signInWithOtp/verifyOtp
- [Quick 24b]: submitQuotation uses createServiceClient for DB insert — anonymous quotations have null customer_id and NULL = NULL is FALSE in PostgreSQL, blocking RLS insert policy for all anonymous users
- [Quick 24b]: id: dbProduct.id added to product mapping in ProductDetailClient — was omitted, making product.id always undefined when passed to QuotationModal
- [Quick 24b]: quantity and message columns added to quotations table as nullable integer/text via migration 032 (were referenced in submitQuotation but never added to schema)
- [Quick 25]: Cookie-based CSRF state for LINE OAuth (SameSite=Lax, 10-min expiry, cleared after use) — server validates state from cookie against query param
- [Quick 25]: createCustomerProfile derives userId from auth session — eliminates IDOR by design, no longer accepts userId as parameter

### Quick Tasks Completed

| # | Task | Date | Result |
|---|------|------|--------|
| 5 | Check if pagination of admin really work | 2026-02-15 | VERIFIED — all pagination working correctly, no changes needed |
| 6 | Fix pagination active page display past page 3 | 2026-02-16 | FIXED — shared getPageNumbers utility, 4 components fixed (2 min) |
| 7 | Add time-based publish filtering via RLS | 2026-02-16 | DONE — 8 RLS policies updated + 4-state admin badges (2 min) |
| 8 | Rework admin draft/publish UI consistency | 2026-02-16 | DONE — 15 pages updated (Plan 01: 10 standard, Plan 02: 5 special), activeTab bug fixed (3 min) |
| 9 | Add view-on-site button to admin edit pages | 2026-02-16 | DONE — 2 files updated (ProductEditClient + BlogEditClient sidebars, 1 min) |
| 10 | Make blog admin and public functional | 2026-02-16 | DONE — 6 bugs fixed across 4 files (category submission, edit fields, public labels, search filter, 5 min) |
| 11 | Dynamic blog categories | 2026-02-16 | DONE — blog_categories table + CRUD actions + admin pages + CategorySelect + dynamic public pages (12 files created, 6 modified) |
| 11b | Related blog posts replace hardcoded sidebar | 2026-02-16 | DONE — backfill logic in getPublishedBlogPost, removed fallbackRelatedPosts, conditional sidebar (3 files, 2 min) |
| 12 | Add recommend toggle to highlight admin | 2026-02-16 | DONE — migration, server action, admin toggle column, unified badge design (blog/products/highlights), homepage curated highlights with fallback (7 files, 2 min) |
| 13 | Add authentication for admin site settings | 2026-02-17 | DONE — requireAdmin utility, layout guard, 67 functions protected across 18 action files, defense-in-depth admin auth (7 min) |
| 14 | Add role verification to admin login action | 2026-02-17 | DONE — role check after signInWithPassword, immediate signOut on failure, Thai error message, eliminates redirect loops (1 min) |
| 15 | Fix authorization bypass in inviteUser/updateUserRole | 2026-02-17 | DONE — role synced to user_metadata in both functions, invited users can now log in, role changes take effect (1 min) |
| 16 | Move admin login from /login to /admin/login | 2026-02-17 | DONE — login pages moved to /admin namespace, route-rules updated with precedence check, all redirects updated, 38 tests pass (3 min) |
| 18 | Separate admin login and dashboard layouts | 2026-02-17 | DONE — sibling route groups (auth) and (dashboard), removed x-pathname workaround, 18 directories moved, 65 files updated (2 min) |
| 19 | Fix LINE Login env var mismatch | 2026-02-17 | DONE — renamed to NEXT_PUBLIC_LINE_LOGIN_CHANNEL_ID (client-accessible) and LINE_LOGIN_CHANNEL_SECRET (server-only), 4 files updated, 12 tests pass (2 min) |
| 20 | Fix LINE Login user registration after redirect | 2026-02-17 | DONE — LINE OAuth callback creates real Supabase Auth session using admin API + magic link token, user_profiles row for new LINE users with auth_provider=line (2 files, 2 min) |
| 21 | LINE Login profile completion form | 2026-02-17 | DONE — new LINE users redirect to /register/line, form collects first_name/last_name/email, completeLineProfile action + migration 028 (4 files, 2 min) |
| 22 | LINE email scope to pre-fill and skip email field | 2026-02-17 | DONE — email scope added, ID token decoded for email, user_profiles.email stored on login, register form hides email when already captured (5 files, 3 min) |
| 23 | Hide navbar user UI until profile_complete = true | 2026-02-17 | DONE — isProfileComplete flag gates mobile/desktop avatar+dropdown, profile_complete set in user_metadata for both SMS OTP and LINE flows (3 files, 1 min) |
| 23b | SMS login loading/error feedback + Supabase SMS provider docs | 2026-02-17 | DONE — PhoneLoginScreen sending/error state, handleSendOtp returns { error } on failure, docs/SUPABASE_SMS_SETUP.md with full config (2 files, 3 min) |
| 24 | Custom SMS OTP flow via SMSKUB (bypass Supabase phone auth) | 2026-02-17 | DONE — migration 030 + phone-auth.js server actions + LoginModal updated; Supabase has no Custom HTTP SMS option so OTP generated/stored/verified server-side (3 files, commit 6921b47) |
| 24b | Fix quotation flow: product ID mapping, missing columns, RLS bypass | 2026-02-18 | DONE — migration 032 adds quantity/message columns, ProductDetailClient adds id: dbProduct.id, submitQuotation uses createServiceClient to bypass RLS for anonymous users (3 files, 5 min) |
| 25 | Fix LINE OAuth CSRF and createCustomerProfile IDOR | 2026-02-18 | DONE — cookie-based state validation for LINE OAuth, auth-derived userId for createCustomerProfile (5 files, 2 min) |

### Pending Todos

None.

### Blockers/Concerns

None.

## Session Continuity

Last session: 2026-02-18
Stopped at: Completed quick task 25 (security fixes — LINE OAuth CSRF cookie-based state validation + createCustomerProfile IDOR auth-derived userId)
Resume file: None

### Recent Activity

| Date | Activity | Outcome |
|------|----------|---------|
| 2026-02-15 | v1.0 shipped | 5 bugs fixed, 194 tests added |
| 2026-02-15 | v1.1 started | Requirements defined (18 total) |
| 2026-02-15 | v1.1 roadmap created | 4 phases, 100% requirement coverage |
| 2026-02-15 | Phase 04 Plan 01 executed | Variation tables + RLS (2 migrations, 2 tasks, 1 min) |
| 2026-02-15 | Phase 05 Plan 01 executed | Variation CRUD server actions (10 actions, 4 schemas, 2 tasks, 2 min) |
| 2026-02-15 | Phase 06 Plan 01 executed | Variation list page (sidebar nav, search, force-delete, 1 task, 3 min) |
| 2026-02-15 | Phase 06 Plan 02 executed | Variation form pages (create/edit with CRUD, drag-drop, 2 tasks, 4 min) |
| 2026-02-15 | Phase 07 Plan 01 executed | Product-variation data layer (syncProductVariationLinks action, VariationLinker component, 2 tasks, 3 min) |
| 2026-02-15 | Phase 07 Plan 02 executed | Product admin integration (VariationLinker in create/edit forms, 2 tasks, 3 min) |
| 2026-02-15 | v1.1 shipped | Variations Management complete (6 plans, 15 min total) |
| 2026-02-16 | Quick task 6 executed | Pagination active page fix (shared utility + 4 components, 2 min) |
| 2026-02-16 | Quick task 7 executed | Time-based publish RLS + 4-state admin badges (2 files, 2 min) |
| 2026-02-16 | Quick task 8 executed | Admin draft/publish UI rework — 15 pages updated, tabs removed, consistent sidebar (3 min) |
| 2026-02-16 | Quick task 9 executed | View-on-site links added to product + blog edit sidebars (1 min) |
| 2026-02-16 | Quick task 10 executed | Blog admin+public fixes: category submission, edit fields, public labels, search filter (5 min) |
| 2026-02-16 | Quick task 11 executed | Dynamic blog categories: migration, CRUD actions, admin CRUD pages, CategorySelect, sidebar, dynamic public pages |
| 2026-02-16 | Quick task 11b executed | Related blog posts: backfill logic, removed hardcoded fallback, conditional sidebar (3 files, 2 min) |
| 2026-02-16 | Quick task 12 executed | Video highlight recommend toggle: migration, server action, unified badge design, homepage curation (7 files, 2 min) |
| 2026-02-17 | Quick task 13 executed | Admin auth enforcement: requireAdmin utility, layout guard, 67 functions protected across 18 files, defense-in-depth (7 min) |
| 2026-02-17 | Quick task 14 executed | Admin login role verification: role check after signInWithPassword, immediate signOut on failure, Thai error, eliminates redirect loops (1 min) |
| 2026-02-17 | Quick task 15 executed | User management auth bypass fix: role synced to user_metadata in inviteUser and updateUserRole, dual-write pattern (1 file, 1 min) |
| 2026-02-17 | Quick task 16 executed | Move admin login to /admin/login: login pages moved, route precedence established, 11 files updated, 38 tests pass (3 min) |
| 2026-02-17 | Quick task 18 executed | Separate admin login and dashboard layouts: sibling route groups, x-pathname workaround removed, 18 directories moved to (dashboard)/, clean architecture (2 min) |
| 2026-02-17 | Quick task 19 executed | LINE Login env var fix: renamed to NEXT_PUBLIC_LINE_LOGIN_CHANNEL_ID (client-accessible) and LINE_LOGIN_CHANNEL_SECRET (server-only), OAuth flow now works (4 files, 2 min) |
| 2026-02-17 | Quick task 20 executed | LINE Login session creation: rewrite OAuth callback to create Supabase Auth user via admin API, establish session via magic link token, create user_profiles row with auth_provider=line (2 files, 2 min) |
| 2026-02-17 | Quick task 21 executed | LINE Login profile completion form: /register/line page with guard logic, first/last/email form matching RegisterScreen design, completeLineProfile action, migration 028 adds columns (4 files, 2 min) |
| 2026-02-17 | Quick task 22 executed | LINE email scope: email scope in OAuth URL, ID token JWT decode in callback, email stored in user_profiles for new and returning users, conditional email field in /register/line (5 files, 3 min) |
| 2026-02-17 | Quick task 23 executed | Navbar profile_complete gate: isProfileComplete flag hides avatar/dropdown until registration done, user_metadata synced in both SMS OTP and LINE flows (3 files, 1 min) |
| 2026-02-17 | Quick task 23b executed | SMS login loading/error feedback: PhoneLoginScreen sending/error state with Thai text, handleSendOtp returns { error }, docs/SUPABASE_SMS_SETUP.md created (2 files, 3 min) |
| 2026-02-18 | Quick task 24b executed | Quotation flow fix: migration 032 adds quantity/message, ProductDetailClient adds id: dbProduct.id, submitQuotation uses service client to bypass RLS for anonymous users (3 files, 5 min) |
| 2026-02-18 | Quick task 25 executed | Security fixes: LINE OAuth CSRF (cookie-based state validation) + createCustomerProfile IDOR (auth-derived userId) (5 files, 2 min) |

---
*Last updated: 2026-02-18*
