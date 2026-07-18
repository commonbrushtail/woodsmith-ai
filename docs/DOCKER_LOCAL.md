# Running Supabase Locally with Docker

Phase 1 of the Hostinger migration (`docs/MIGRATION_HOSTINGER.md`). Goal: run the **same** Supabase stack on your laptop that we'll later deploy to a Hostinger VPS, and verify the WoodSmith Next.js app works end-to-end against it.

**No money is spent in this phase.** Hostinger only enters the picture in Phase 2.

---

## Prerequisites

1. **Docker Desktop** running on Windows/macOS, or `docker` + `docker compose` CLI on Linux. Check with `docker compose version` (need v2+).
2. **~5 GB free disk** for images on first run.
3. **Free ports**: `5432` (Postgres), `8000` (Kong HTTP), `8443` (Kong HTTPS), `4000` (Logflare). If any are in use, edit `supabase/docker/.env` after copying.
4. **Node.js** already required by the project (Next.js dev server).

---

## Step 1 — Configure environment

```powershell
cd supabase/docker
Copy-Item .env.example .env
```

The defaults in `.env.example` are **insecure development placeholders** — fine for local testing. Before deploying to the Hostinger VPS we regenerate every secret (covered in Phase 2).

**Local dev tweaks** in `supabase/docker/.env`:

```ini
# Email/SMTP — local only, dummy values are fine
ENABLE_EMAIL_AUTOCONFIRM=true   # skip email confirmation for local admin signups

# Phone signup — leave these enabled in the env to keep the upstream defaults
# but our app will simply never call the phone endpoints (SMS removed)
ENABLE_PHONE_SIGNUP=false

# OpenAI key for Studio AI assistant — leave blank, optional
OPENAI_API_KEY=
```

---

## Step 2 — Start the stack

From `supabase/docker/`:

```powershell
docker compose -f docker-compose.yml -f docker-compose.pg17.yml up -d
```

We use `docker-compose.pg17.yml` to pin Postgres 17 (the major version your `supabase/config.toml` already specifies for the cloud project — we want exact parity).

**First run downloads ~3 GB of images** and takes 5–15 minutes depending on connection. Progress with:

```powershell
docker compose ps
docker compose logs -f db auth rest storage kong
```

When healthy, the stack exposes:

| Endpoint | URL |
|---|---|
| Studio (admin dashboard) | <http://localhost:8000> (login: `supabase` / value of `DASHBOARD_PASSWORD`) |
| API gateway (Kong) | <http://localhost:8000> |
| Postgres direct | `postgres://postgres:<POSTGRES_PASSWORD>@localhost:5432/postgres` |

---

## Step 3 — Apply project migrations

The repo's `supabase/migrations/*.sql` files describe our schema, RLS, and audit logs. Apply them with the idempotent migration runner (a one-shot compose service — records applied migrations in a ledger table so re-runs only apply new ones):

```powershell
# From supabase/docker/ — safe to re-run any time; applies only new migrations.
docker compose -f docker-compose.yml -f docker-compose.pg17.yml -f docker-compose.migrate.yml run --rm migrate
```

If your DB already has migrations applied out-of-band (e.g. via the old manual loop), adopt the ledger once with `-e MIGRATE_BASELINE=1` (records them without re-running), then use the normal command above. See `supabase/docker/scripts/migrate.sh`.

Verify:

```powershell
docker exec -it supabase-db psql -U postgres -d postgres -c "\dt public.*"
```

You should see all the WoodSmith tables (products, blog_posts, banners, quotations, user_profiles, etc.).

---

## Step 4 — Re-create storage buckets

The 6 buckets (`products`, `banners`, `blog`, `gallery`, `manuals`, `video-highlights`) need to exist in the local Storage service. Easiest path: open Studio (<http://localhost:8000> → Storage), click "New bucket" 6 times. Mark each as **Public** so the existing `getPublicUrl()` calls keep working.

Or via SQL (faster):

```sql
insert into storage.buckets (id, name, public) values
  ('products',         'products',         true),
  ('banners',          'banners',          true),
  ('blog',             'blog',             true),
  ('gallery',          'gallery',          true),
  ('manuals',          'manuals',          true),
  ('video-highlights', 'video-highlights', true)
on conflict (id) do nothing;
```

---

## Step 5 — Point the Next.js app at the local stack

Create or edit `.env.local` at repo root (gitignored). The values below come from `supabase/docker/.env.example`'s defaults:

```ini
NEXT_PUBLIC_SUPABASE_URL=http://localhost:8000
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyAgCiAgICAicm9sZSI6ICJhbm9uIiwKICAgICJpc3MiOiAic3VwYWJhc2UtZGVtbyIsCiAgICAiaWF0IjogMTY0MTc2OTIwMCwKICAgICJleHAiOiAxNzk5NTM1NjAwCn0.dc_X5iR_VP_qT0zsiyj_I_OZ2T9FtRU2BBNWN8Bu4GE
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyAgCiAgICAicm9sZSI6ICJzZXJ2aWNlX3JvbGUiLAogICAgImlzcyI6ICJzdXBhYmFzZS1kZW1vIiwKICAgICJpYXQiOiAxNjQxNzY5MjAwLAogICAgImV4cCI6IDE3OTk1MzU2MDAKfQ.DaYlNEoUrrEn2Ig7tqibS-PHK5vgusbcbo7X36XVt4Q
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

Keep your existing `LINE_LOGIN_*` env vars — LINE Login still works against local Supabase as long as the LINE Developers Console has `http://localhost:3000/auth/callback/line` whitelisted.

---

## Step 6 — Smoke test

```powershell
npm run dev
```

Walk through these golden paths:

- [ ] Public homepage loads, products list renders
- [ ] Product detail page renders with images
- [ ] LINE Login completes (or stub it locally if you don't have a LINE channel set up)
- [ ] Submit a quotation as a logged-in customer — row appears in Studio's Quotations table
- [ ] Admin login (`/admin/login`) with a fresh email/password — works
- [ ] Admin: create a product with image upload — image saved to local Storage, public URL works
- [ ] Run `npm test` and `npm run test:e2e` — all green

If everything passes, **Phase 1 is done**. We can move on to Phase 2 (Hostinger VPS).

---

## Common issues

**"Port 8000 already in use"** — Either stop the conflicting service or change `KONG_HTTP_PORT` in `.env`. Remember to update `NEXT_PUBLIC_SUPABASE_URL` to match.

**"Auth service won't start"** — Most often a `JWT_SECRET` mismatch. Make sure you didn't edit it after the first boot. To reset: `cd supabase/docker && docker compose down -v && rm -rf volumes/db/data volumes/storage`, then start over.

**"Storage uploads fail with 403"** — Check the bucket exists and is public, and that `SUPABASE_SERVICE_ROLE_KEY` in `.env.local` matches `SERVICE_ROLE_KEY` in `supabase/docker/.env`.

**"OAuth redirect mismatch"** — LINE will reject any redirect URL not registered in the LINE Developers Console. For local dev add `http://localhost:3000/auth/callback/line` to the channel's callback URL list.

---

## Stopping & resetting

```powershell
# Stop containers, keep data
docker compose -f docker-compose.yml -f docker-compose.pg17.yml down

# Stop and wipe everything (danger — drops all local data)
docker compose -f docker-compose.yml -f docker-compose.pg17.yml down -v
Remove-Item -Recurse -Force volumes/db/data, volumes/storage
```

The provided `supabase/docker/reset.sh` does the same on Linux/macOS.

---

## What this validates for the Hostinger move

If your app runs against this local Docker stack:

- The schema migrations apply cleanly to a fresh self-hosted Postgres ✅
- RLS policies behave the same as on cloud Supabase ✅
- Storage uploads/reads work via the same Storage API ✅
- LINE Login OAuth flow works against self-hosted GoTrue ✅
- Service role + anon keys behave identically ✅

The only things still untested at that point are production-level concerns: TLS, public domain, traffic volume, off-site backups. Those are Phase 2/5 in the migration plan.
