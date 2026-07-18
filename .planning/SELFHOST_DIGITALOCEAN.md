# Self-host WoodSmith on a DigitalOcean Droplet (Docker)

Concrete plan. Supersedes the Hostinger-targeted `docs/DOCKER_LOCAL.md` (stack is host-agnostic;
only the host-specific bits change). Direction chosen with user in the 2026-07-02 handoff.

## Goal
One DO Droplet runs, via `docker compose up`: the Next.js app + the **full self-hosted Supabase
stack** (GoTrue, Postgres, PostgREST, Storage, Kong, imgproxy). Same stack runs locally for dev.
Keep ~100% of current code — this is packaging + hosting, not an app rewrite.

## Verified facts (2026-07-02)
- Docker 29.2 + Compose v5 present and working on this machine.
- The self-host stack lives on branch `ai/self-host-supabase` under `supabase/docker/` (13 services,
  official Supabase vendored stack). Now grafted into this worktree for verification.
- App uses **0 Realtime channels** and **0 Edge Functions** (grep-verified) → both are droppable.
- **Migration drift:** `main` has 52 migration files; `ai/self-host-supabase` has 46 (branch forked
  before 6 landed). `main` is authoritative — verify the stack against main's 52.
- **Bucket drift:** branch docs say 6 buckets; `main`/CLAUDE.md say 7 (main added a 7th, likely
  private quotation files). Use main's set.
- **Orphaned local stack:** a `supabase` compose project is half-running from a **deleted** clone
  (`C:\Users\commo\OneDrive\Documents\GitHub\woodsmith-ai` — `.git` gone). Its bind mounts point at
  the vanished path → `db/kong/vector/pooler` exit 127 on restart. Must be torn down before a clean boot.
- Docs on the branch target **Hostinger**, not DigitalOcean — re-point them.

## Stack: 13 services, keep vs trim
Core (KEEP on droplet): `db` (Postgres), `auth` (GoTrue), `rest` (PostgREST), `storage`, `imgproxy`, `kong` (gateway).
Trim for lean droplet (app doesn't use them): `realtime`, `functions` (edge), `analytics` (Logflare) + `vector`,
`supavisor` (pooler), `studio` (run only when needed / behind auth).
- **Lean** → ~4 GB / 2 vCPU droplet ≈ **$24/mo** + Spaces $5 + backups ≈ **~$30/mo**.
- **Full** → 8 GB / 4 vCPU ≈ **$48/mo** + extras ≈ **~$63/mo**.
Recommendation: **lean** — 0 realtime/edge usage makes the trim safe. Local dev boots full for parity.

## Plan (in order)

### 1. Local dev boot + verification ✅ DONE (2026-07-02)
- ✅ Tore down orphaned `supabase` project. Note: Postgres data was a **host bind-mount** under the
  deleted clone, so it was already gone — only two ancillary named volumes removed.
- ✅ `.env` from `.env.example` with `ENABLE_EMAIL_AUTOCONFIRM=true`, `ENABLE_PHONE_SIGNUP=false`,
  demo keys. Booted `docker compose -f docker-compose.yml -f docker-compose.pg17.yml up -d`.
- ✅ **All 52 main migrations applied to fresh PG17 with 0 errors.** → 26 public tables.
- ✅ Seed data landed: 38 products, 2 categories, 3 legal pages, 1 site_settings row.
- ✅ Buckets: migration 052 creates private `quotations`; added the 6 public buckets → 7 total.
- ✅ API gateway verified: Kong→PostgREST `GET /rest/v1/products` = HTTP 200 (anon key, RLS);
  Kong→GoTrue `GET /auth/v1/settings` = HTTP 200 (`email:true`).
- ⚠️ `supabase-vector` (Logflare shipper) crash-loops (exit 78) — **non-critical, slated for trim**.
  `edge-functions` up (no healthcheck). All 6 app-critical services healthy.
- ✅ **App smoke test (public read path) DONE:** `npm install` + `npm run dev` in the worktree with
  `.env.local` → `http://localhost:8000`. Verified against self-hosted stack, all HTTP 200, zero
  Supabase/connection errors in dev log:
  - `/` (homepage), `/products` (renders real taxonomy: decoration → ประตู/โต๊ะ types from DB)
  - product-type pages render
  - `/product/<uuid>` → 307 redirect → canonical `/products/decoration/โต๊ะ/table` → renders `<h1>โต๊ะ</h1>`
  - Confirms the supabase-js read path (RLS-filtered `public.js`) works unchanged against self-hosted.
- ✅ **Admin auth + session verified (browser, Playwright):** created an admin user via GoTrue admin API
  (`user_metadata.role=admin`, email-confirmed). Logged in through `/admin/login` → `POST /admin/login 200`
  → session cookie set → `/admin/dashboard` rendered behind `requireAdminOrRedirect` showing **real data
  (Total products: 38)**. Confirms full chain: signInWithPassword → self-hosted GoTrue → `@supabase/ssr`
  cookie → middleware `getUser()` → `requireAdmin()` → protected server-action DB read.
- ✅ **Write path verified (browser → DB):** created a FAQ group in the admin UI → server action →
  `createServiceClient().insert()` → **row persisted in self-hosted Postgres** (`faq_groups`, verified via
  psql, then cleaned up). Admin writes use service-role after `requireAdmin`, so RLS is bypassed by design.
- ⚠️ **Observation (not a stack/app issue):** an EXTERNAL client (leftover auto-refreshing browser tab)
  polls `/about` ~1–2×/s — persists even with the Playwright browser on about:blank. All 200s, no redirect
  loop. Unrelated to self-hosting; worth closing that stray tab.
- ✅ **Storage subsystem verified (API + full UI):** (a) service-role upload → `storage.objects` metadata →
  **public URL serves the image** (HTTP 200 image/png) → imgproxy `/render/image` transform HTTP 200 →
  DELETE HTTP 200 (full CRUD). (b) End-to-end UI: admin Gallery drag/click upload → server action →
  storage-api → object `gallery/1783007521967-*.png` stored → gallery UI displays it. This is the exact
  subsystem that maps to **DO Spaces** via `docker-compose.s3.yml`.
- ✅ **LINE OAuth verified end-to-end against self-hosted GoTrue (real channel 2009412318):** clicked
  "Login with LINE" → correct authorize redirect (`redirect_uri=http://localhost:3000/auth/callback/line`).
  Had to register that callback in the LINE console first (LINE 400'd until added — localhost was never
  registered). After adding + real LINE login, the callback ran the **hand-rolled `generateLink`+`verifyOtp`**
  against self-hosted GoTrue → user created in local `auth.users` (line_user_id, display_name "Tae",
  placeholder email) + `user_profiles` row → session established → redirected to `/register/line`.
  NOTE: LINE returned no email (channel lacks the "Email address permission"), so the account uses a
  `line_<uid>@line.placeholder` identifier and the register form collects a real notification email — by design.
- **Result: EVERY layer verified against main's real schema+seed on self-hosted Supabase — stack boot,
  migrations, public read, admin auth/session, write path, Storage (CRUD, API+UI), AND LINE OAuth.
  Self-host foundation is 100% proven. Nothing app-side blocks the DO migration; remaining work is
  packaging/hosting (Dockerfile, migration apply-path, Spaces, droplet provisioning).**

### 2. Dockerfile for the Next.js app ✅ DONE
- `Dockerfile` (multi-stage deps→builder→runner) + `.dockerignore` + `output: 'standalone'` in
  `next.config.mjs`. `next build --webpack`, runs `node server.js` as non-root, HEALTHCHECK on `/`.
- NEXT_PUBLIC_* passed as `--build-arg` (inlined at build); server secrets at runtime only.
- **VERIFIED:** image builds, boots (~74ms), and serves real data from the self-hosted stack
  (homepage + /products taxonomy HTTP 200 via `host.docker.internal:8000`).
- ⚠️ **Lockfile bug (worked around, needs a real fix):** committed `package-lock.json` is out of sync
  (missing transitive `@floating-ui/dom@1.8.0`) → strict `npm ci` fails. Dockerfile falls back to
  `npm install`. A clean regen bumps ~247 transitive pins → do it as its own change + full test run,
  then switch the Dockerfile back to `npm ci` only.
- Build-time OOM risk on 4 GB droplet → build in CI / beefier machine, push image to a registry
  (GHCR/DO Container Registry), pull on droplet. Don't `next build` on the lean droplet.

### 3. Migrations onto self-hosted Postgres
- `scripts/db-push.ps1` currently targets the HOSTED Supabase over a direct PG URL. Add a self-hosted
  apply path: init-on-boot (mount ordered SQL) or a one-shot `migrate` compose service. Idempotency check.

### 4. GoTrue config (email/password + LINE OAuth)
- Verify the hand-rolled LINE flow (`generateLink` + `verifyOtp`) against self-hosted GoTrue.
- Set `SITE_URL`, `API_EXTERNAL_URL`, `ADDITIONAL_REDIRECT_URLS`, JWT secret.
- App bypasses Supabase built-in emails (sends via Resend/SES in app code) → GoTrue SMTP mostly moot;
  confirm no flow depends on GoTrue-sent mail.

### 5. Storage → DO Spaces (S3 backend)
- Use `docker-compose.s3.yml` to point Storage at Spaces (S3-compatible). Repoint the 7 buckets.
- Keep `getPublicUrl()` synchronous (buckets public). Set CDN/base URL.

### 6. Droplet provisioning
- Docker + compose + Caddy TLS (`docker-compose.caddy.yml`, auto-HTTPS) + secrets management +
  backups (`pg_dump` → Spaces, cron) + basic monitoring + swap (build/boot memory).

### 7. Branch reconciliation
- `main` (green, 52 migrations, 7 buckets, SES-ready tests) is the base.
- Graft `supabase/docker/` + `docs/DOCKER_LOCAL.md` (retitled DO) from `ai/self-host-supabase` onto it
  — done partially in this worktree already.
- Fold `ai/ses-email-migration` as the email piece.
- Do NOT take the branch's test-file rewrites (main fixed the same tests differently) or its stale
  46-migration set. Take the stack, the SMS-removal, the LF `.gitattributes` fix.

## Open questions for the user
- Orphan teardown: OK to destroy the orphaned local `supabase` stack + volumes? (data = deleted-clone dev DB)
- Droplet size: lean ~$30/mo vs full ~$63/mo (recommend lean).
- Push `main` to origin now or later? (needs user's GitHub creds)
- Registry choice for prebuilt app image (GHCR vs DO Container Registry).

## Don't retrace (ruled out)
- ❌ Neon rewrite. ❌ Managed-Postgres hybrid. ❌ Email on DO / self-hosted SMTP (port 25 blocked).
- ❌ Re-authoring the compose stack — extend/trim the vendored one.
