#!/usr/bin/env node
// Generate production secrets for the self-hosted Supabase stack.
//
// Produces strong random secrets AND the anon/service_role API keys, which are
// HS256 JWTs signed with the generated JWT_SECRET (so they must be generated
// together — regenerating JWT_SECRET invalidates the keys). Writes a ready-to-
// paste .env fragment; prints ONLY a summary, never the secret values.
//
// Usage (local, needs Node):        node scripts/gen-secrets.mjs [outfile]
//   or on the droplet via Docker:   docker run --rm -v "$PWD:/w" -w /w node:22-alpine \
//                                      node scripts/gen-secrets.mjs .env.secrets.local
// Default outfile: ./.env.secrets.local  (gitignored via *.local). --force to overwrite.
//
// After generating: merge the fragment into your production supabase/docker/.env,
// and set the app's NEXT_PUBLIC_SUPABASE_ANON_KEY / SUPABASE_SERVICE_ROLE_KEY to the
// ANON_KEY / SERVICE_ROLE_KEY printed here.

import { randomBytes, createHmac } from 'node:crypto'
import { writeFileSync, existsSync } from 'node:fs'

const args = process.argv.slice(2)
const force = args.includes('--force')
const outfile = args.find((a) => !a.startsWith('--')) || './.env.secrets.local'

if (existsSync(outfile) && !force) {
  console.error(`[gen-secrets] ${outfile} already exists — refusing to overwrite. Pass --force to replace.`)
  process.exit(1)
}

const b64url = (buf) =>
  Buffer.from(buf).toString('base64').replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '')
// URL/env-safe random string of exactly `len` chars (base62-ish)
const token = (len) => {
  let s = ''
  while (s.length < len) s += randomBytes(48).toString('base64').replace(/[^a-zA-Z0-9]/g, '')
  return s.slice(0, len)
}

function signJwt(payload, secret) {
  const header = b64url(JSON.stringify({ alg: 'HS256', typ: 'JWT' }))
  const body = b64url(JSON.stringify(payload))
  const sig = b64url(createHmac('sha256', secret).update(`${header}.${body}`).digest())
  return `${header}.${body}.${sig}`
}

const JWT_SECRET = token(64) // >= 32 required; 64 for headroom
const iat = Math.floor(Date.now() / 1000)
const exp = iat + 60 * 60 * 24 * 365 * 10 // 10 years
const iss = 'supabase'
const ANON_KEY = signJwt({ role: 'anon', iss, iat, exp }, JWT_SECRET)
const SERVICE_ROLE_KEY = signJwt({ role: 'service_role', iss, iat, exp }, JWT_SECRET)

const secrets = {
  POSTGRES_PASSWORD: token(40),
  JWT_SECRET,
  ANON_KEY,
  SERVICE_ROLE_KEY,
  DASHBOARD_USERNAME: 'supabase',
  DASHBOARD_PASSWORD: token(32),
  SECRET_KEY_BASE: token(64), // Phoenix (realtime/supavisor) — >= 64
  VAULT_ENC_KEY: token(32), // must be exactly 32 chars
  PG_META_CRYPTO_KEY: token(32),
  LOGFLARE_PUBLIC_ACCESS_TOKEN: token(32),
  LOGFLARE_PRIVATE_ACCESS_TOKEN: token(32),
  S3_PROTOCOL_ACCESS_KEY_ID: token(24),
  S3_PROTOCOL_ACCESS_KEY_SECRET: token(48),
}

const header = `# Generated production secrets for the self-hosted Supabase stack.\n# Merge into supabase/docker/.env. Keep SECRET — never commit. iat=${iat}\n`
const body = Object.entries(secrets)
  .map(([k, v]) => `${k}=${v}`)
  .join('\n')
writeFileSync(outfile, header + body + '\n', { mode: 0o600 })

// Summary only — no values.
console.log(`[gen-secrets] wrote ${Object.keys(secrets).length} secrets to ${outfile} (mode 600)`)
console.log('[gen-secrets] JWT keys signed with the generated JWT_SECRET (anon + service_role, 10y exp).')
console.log('[gen-secrets] NEXT: merge into prod .env; set app NEXT_PUBLIC_SUPABASE_ANON_KEY + SUPABASE_SERVICE_ROLE_KEY.')
console.log('[gen-secrets] Values are NOT printed. Open the file to copy them.')
