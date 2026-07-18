# WoodSmith AI — Next.js 16 (webpack) production image.
#
# NEXT_PUBLIC_* values are INLINED into the client bundle at build time, so they
# must be passed as --build-arg. Server-only secrets (SUPABASE_SERVICE_ROLE_KEY,
# LINE_LOGIN_CHANNEL_SECRET, SES/Resend keys, etc.) are provided at RUNTIME via
# `docker run --env` / compose `environment:` — never baked into the image.
#
# Build (example, self-hosted droplet):
#   docker build \
#     --build-arg NEXT_PUBLIC_SUPABASE_URL=https://api.example.com \
#     --build-arg NEXT_PUBLIC_SUPABASE_ANON_KEY=... \
#     --build-arg NEXT_PUBLIC_SITE_URL=https://example.com \
#     --build-arg NEXT_PUBLIC_LINE_LOGIN_CHANNEL_ID=2009412318 \
#     -t woodsmith-app:latest .
#
# The build is memory-hungry (`next build --webpack`); build in CI or on a
# machine with >=4 GB RAM and push the image to a registry — do NOT build on a
# lean 4 GB droplet (it can OOM). See .planning/SELFHOST_DIGITALOCEAN.md.

# syntax=docker/dockerfile:1

# ---------- deps: install node_modules from the lockfile ----------
FROM node:22-alpine AS deps
RUN apk add --no-cache libc6-compat
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci --no-audit --no-fund

# ---------- builder: next build --webpack -> .next/standalone ----------
FROM node:22-alpine AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .

ARG NEXT_PUBLIC_SUPABASE_URL
ARG NEXT_PUBLIC_SUPABASE_ANON_KEY
ARG NEXT_PUBLIC_SITE_URL
ARG NEXT_PUBLIC_LINE_LOGIN_CHANNEL_ID
ENV NEXT_PUBLIC_SUPABASE_URL=$NEXT_PUBLIC_SUPABASE_URL \
    NEXT_PUBLIC_SUPABASE_ANON_KEY=$NEXT_PUBLIC_SUPABASE_ANON_KEY \
    NEXT_PUBLIC_SITE_URL=$NEXT_PUBLIC_SITE_URL \
    NEXT_PUBLIC_LINE_LOGIN_CHANNEL_ID=$NEXT_PUBLIC_LINE_LOGIN_CHANNEL_ID \
    NODE_ENV=production \
    NEXT_TELEMETRY_DISABLED=1 \
    NODE_OPTIONS=--max-old-space-size=4096

RUN npm run build

# ---------- runner: minimal image running the standalone server ----------
FROM node:22-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production \
    NEXT_TELEMETRY_DISABLED=1 \
    PORT=3000 \
    HOSTNAME=0.0.0.0

RUN addgroup -g 1001 -S nodejs && adduser -S nextjs -u 1001

# Standalone output already contains a minimal server.js + node_modules.
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static
COPY --from=builder --chown=nextjs:nodejs /app/public ./public

USER nextjs
EXPOSE 3000

HEALTHCHECK --interval=30s --timeout=5s --start-period=25s --retries=3 \
  CMD wget -qO- http://127.0.0.1:3000/ >/dev/null 2>&1 || exit 1

CMD ["node", "server.js"]
