# Deploying WoodSmith to a DigitalOcean Droplet

The production runbook: one droplet runs the **lean self-hosted Supabase stack + the
Next.js app + Caddy TLS**, on a single domain, via `docker compose up`. Local parity is
`docs/DOCKER_LOCAL.md`. Rationale + verification: `.planning/SELFHOST_DIGITALOCEAN.md`.

## Architecture (one domain, path-routed)

```
                         https://woodsmith.example.com
                                     │
                              ┌──────▼──────┐   Let's Encrypt auto-TLS
                              │    Caddy    │
                              └──┬───────┬──┘
        /auth/v1 /rest/v1 /storage/v1 …  │  everything else (/, /products, /admin,
                 │                       │   /auth/callback/line, /api/…)
            ┌────▼────┐             ┌────▼────┐
            │  Kong   │             │  app    │  Next.js (standalone image)
            └────┬────┘             └─────────┘
   auth · rest · storage · imgproxy · meta
                 │
            ┌────▼────┐   pg_dump → Spaces (cron)
            │Postgres │   Storage files → DO Spaces (S3)
            └─────────┘
```

Lean stack = 7 services (`db, auth, rest, storage, imgproxy, kong, meta`) + `app` + `caddy`.
`COMPOSE_PROFILES` empty → lean; `full` adds Studio/realtime/analytics/etc. (local only).

---

## Prerequisites (do these BEFORE renting the droplet)

1. **Domain** registered, DNS you control. Gates TLS, LINE prod callback, Resend/email. *(long pole)*
2. **DigitalOcean account** + an SSH key.
3. **DO Spaces** bucket (Storage backend + backups) + Spaces access keys. Pick a region (e.g. `sgp1`).
4. **Container registry** (GHCR or DO Container Registry) — the app image is prebuilt and pulled.
5. **Resend** account with your sending domain verified + an API key.
6. **LINE Login** channel (you already have `2009412318`) — you'll add the prod callback in step 11.

---

## 1 — Build & push the app image (local machine or CI, NOT the droplet)

`next build --webpack` is memory-hungry; a 4 GB droplet can OOM. Build where there's RAM.

```bash
export DOMAIN=woodsmith.example.com
export REG=registry.example.com/woodsmith-app      # your GHCR/DOCR path
docker build \
  --build-arg NEXT_PUBLIC_SUPABASE_URL=https://$DOMAIN \
  --build-arg NEXT_PUBLIC_SUPABASE_ANON_KEY=<ANON_KEY from step 6> \
  --build-arg NEXT_PUBLIC_SITE_URL=https://$DOMAIN \
  --build-arg NEXT_PUBLIC_LINE_LOGIN_CHANNEL_ID=2009412318 \
  -t $REG:latest .
docker push $REG:latest
```
`NEXT_PUBLIC_*` are baked into the client bundle here — the image is domain-specific. Rebuild + repush to change the domain or the anon key. (You can do this step after step 6, once you have the ANON_KEY.)

## 2 — Create the droplet

- **4 GB / 2 vCPU** ("lean" — the app uses 0 realtime/edge, so the trimmed stack fits). Ubuntu 24.04 LTS.
- Region near your users (Thailand → `sgp1` Singapore). Attach your SSH key. Enable DO backups (optional, +20%).

## 3 — Harden the server

```bash
adduser deploy && usermod -aG sudo deploy          # non-root user; copy SSH key to ~deploy/.ssh
ufw allow OpenSSH && ufw allow 80 && ufw allow 443 && ufw --force enable
# Swap (protects boot/build memory on 4 GB):
fallocate -l 2G /swapfile && chmod 600 /swapfile && mkswap /swapfile && swapon /swapfile
echo '/swapfile none swap sw 0 0' >> /etc/fstab
apt-get update && apt-get install -y unattended-upgrades
```

## 4 — Install Docker + Compose

```bash
curl -fsSL https://get.docker.com | sh
usermod -aG docker deploy      # re-login so `docker` works without sudo
docker compose version         # v2+
```

## 5 — Get the stack + log in to the registry

```bash
sudo mkdir -p /opt/woodsmith && sudo chown deploy /opt/woodsmith
git clone <your-repo> /opt/woodsmith        # only supabase/docker/ is needed at runtime
cd /opt/woodsmith/supabase/docker
docker login registry.example.com           # so `docker compose pull` can fetch APP_IMAGE
```

## 6 — Secrets + `.env`

```bash
cp .env.example .env
# Generate strong secrets + signed anon/service JWTs (needs Node, or run via Docker):
docker run --rm -v "$PWD:/w" -w /w node:22-alpine node scripts/gen-secrets.mjs .env.secrets.local
```
Merge `.env.secrets.local` into `.env`, then set in `.env`:

| Var | Value |
|---|---|
| `COMPOSE_PROFILES` | *(empty)* — lean |
| `POSTGRES_PASSWORD`, `JWT_SECRET`, `ANON_KEY`, `SERVICE_ROLE_KEY`, `DASHBOARD_PASSWORD`, `VAULT_ENC_KEY`, `SECRET_KEY_BASE` | from `gen-secrets` |
| `PROXY_DOMAIN` | `woodsmith.example.com` |
| `SITE_URL`, `API_EXTERNAL_URL`, `SUPABASE_PUBLIC_URL` | `https://woodsmith.example.com` |
| `ADDITIONAL_REDIRECT_URLS` | `https://woodsmith.example.com/**` |
| `APP_IMAGE` | your pushed image ref |
| `RESEND_API_KEY`, `RESEND_FROM_EMAIL`, `ADMIN_NOTIFICATION_EMAIL` | your Resend values |
| `LINE_LOGIN_CHANNEL_SECRET` | your LINE channel secret |
| Storage → Spaces (see step 8) | `GLOBAL_S3_BUCKET`, `REGION`, S3 endpoint/keys |

The app reads `SUPABASE_SERVICE_ROLE_KEY` = the `SERVICE_ROLE_KEY` you generated (the app overlay maps it). Keep `.env` and `.env.secrets.local` mode `600`; never commit them.

## 7 — DNS

Point an **A record** for `woodsmith.example.com` → the droplet's public IP (AAAA for IPv6 optional). Wait for propagation (`dig +short woodsmith.example.com`). Caddy needs this resolving before it can issue a cert.

## 8 — Storage → DO Spaces (S3 backend)

Storage files must live in Spaces (durable + CDN), not on the droplet disk. Configure the S3
overlay env in `.env` (`GLOBAL_S3_BUCKET`, `REGION`, and the S3 endpoint/keys per
`docker-compose.s3.yml`), pointing at your Spaces bucket + keys. `getPublicUrl()` stays synchronous
(buckets public). *(This is plan step 5 — wire + smoke-test with real Spaces keys.)*

## 9 — Bring up the stack

```bash
docker compose \
  -f docker-compose.yml -f docker-compose.pg17.yml \
  -f docker-compose.s3.yml -f docker-compose.app.yml \
  pull
docker compose \
  -f docker-compose.yml -f docker-compose.pg17.yml \
  -f docker-compose.s3.yml -f docker-compose.app.yml \
  up -d
```
Caddy provisions TLS automatically (ports 80/443 open + DNS resolving). Watch: `docker compose logs -f caddy app kong`.

## 10 — Apply migrations + buckets

```bash
docker compose -f docker-compose.yml -f docker-compose.pg17.yml \
  -f docker-compose.migrate.yml run --rm migrate         # idempotent; applies all on a fresh DB
```
Create the 6 public buckets + the private `quotations` bucket (migration 052 makes `quotations`;
the 6 public ones via SQL into `storage.buckets`, as in `docs/DOCKER_LOCAL.md` Step 4). With the S3
backend, the bucket rows point at Spaces.

## 11 — LINE production callback

In the LINE Developers Console, add the callback: **`https://woodsmith.example.com/auth/callback/line`**
(exact match). Keep OpenID Connect + Email permission on (already applied). Localhost callback can stay for dev.

## 12 — Smoke test

Homepage + `/products` render · admin login → dashboard · submit a quotation · admin image upload
(lands in Spaces, public URL works) · **LINE login** completes against prod GoTrue → user in `auth.users`.

## 13 — Backups

```bash
# set Spaces creds in a 600-mode env file, then cron the backup script:
crontab -e
# 0 3 * * *  set -a; . /opt/woodsmith/backup.env; set +a; /opt/woodsmith/supabase/docker/scripts/backup.sh >> /var/log/woodsmith-backup.log 2>&1
```
`scripts/backup.sh` does `pg_dump | gzip` → Spaces via the aws-cli container. Add a Spaces lifecycle
rule to expire old backups. Test a restore before you rely on it.

## Ongoing ops

- **Deploy an app update:** build+push a new image → `docker compose … pull app && docker compose … up -d app`.
- **Apply new migrations:** commit SQL → re-run the step-10 `migrate` command (only new ones apply).
- **Logs:** `docker compose … logs -f <svc>`. **Restart survives reboot** (`restart: unless-stopped` + swap).
- **Studio when needed:** temporarily `COMPOSE_PROFILES=full docker compose … up -d studio` (behind auth), then stop it.

## Cost (VERIFIED July 2026)

Droplet 4 GB/2 vCPU **$24** + Spaces **$5** (250 GB + 1 TB) + optional DO backups (20% of droplet)
+ Resend (free tier covers low volume) ≈ **~$30/mo**. Bump to 8 GB (**$48**) only if you later need the full stack.
