#!/usr/bin/env sh
# Idempotent migration runner for the self-hosted Supabase Postgres.
#
# Applies supabase/migrations/*.sql in filename order, recording each in a ledger
# table (migrations.schema_migrations) so re-runs only apply NEW migrations. Safe
# to run on every deploy. Replaces the old manual "pipe each file into psql" loop.
#
# Each migration runs in its own transaction together with its ledger insert, so a
# failure rolls back cleanly and is retried next run. Requires the `auth` schema to
# exist (several migrations reference auth.*), so run it once the stack is up
# (the compose service depends on `auth` being healthy).
#
# Env (all optional except the password, which the compose service injects):
#   PGHOST (default db) PGPORT (5432) PGUSER (postgres) PGDATABASE (postgres)
#   PGPASSWORD (required)   MIGRATIONS_DIR (default /migrations)
#   MIGRATE_BASELINE=1  -> record all migrations as applied WITHOUT running them
#                          (for adopting the runner on a DB already migrated
#                           out-of-band; run once, then use normal mode).
set -eu

MIGRATIONS_DIR="${MIGRATIONS_DIR:-/migrations}"
: "${PGHOST:=db}"; : "${PGPORT:=5432}"; : "${PGUSER:=postgres}"; : "${PGDATABASE:=postgres}"
export PGHOST PGPORT PGUSER PGDATABASE

log() { echo "[migrate] $*"; }
psql_q() { psql -v ON_ERROR_STOP=1 -X -q "$@"; }

log "waiting for Postgres at ${PGHOST}:${PGPORT} ..."
i=0
until pg_isready -q 2>/dev/null; do
  i=$((i + 1))
  if [ "$i" -ge 60 ]; then log "ERROR: Postgres not ready after 60s"; exit 1; fi
  sleep 1
done

log "ensuring ledger table (migrations.schema_migrations) ..."
psql_q <<'SQL'
create schema if not exists migrations;
create table if not exists migrations.schema_migrations (
  filename   text primary key,
  checksum   text not null,
  applied_at timestamptz not null default now()
);
SQL

applied=0
skipped=0
baseline="${MIGRATE_BASELINE:-0}"
[ "$baseline" = "1" ] && log "BASELINE mode — recording migrations as applied WITHOUT running them"

for f in "$MIGRATIONS_DIR"/*.sql; do
  [ -e "$f" ] || { log "no .sql files found in ${MIGRATIONS_DIR}"; break; }
  name="$(basename "$f")"
  sum="$(md5sum "$f" | cut -d' ' -f1)"

  prev="$(psql_q -t -A -c "select checksum from migrations.schema_migrations where filename = '${name}'")"
  if [ -n "$prev" ]; then
    if [ "$prev" != "$sum" ]; then
      log "WARN: ${name} already applied but file content changed (ledger=${prev}, file=${sum}) — NOT re-applying"
    fi
    skipped=$((skipped + 1))
    continue
  fi

  if [ "$baseline" = "1" ]; then
    psql_q -c "insert into migrations.schema_migrations (filename, checksum) values ('${name}', '${sum}') on conflict (filename) do nothing"
    applied=$((applied + 1))
    continue
  fi

  log "applying ${name} ..."
  # migration + ledger insert in a single transaction: all-or-nothing
  psql_q --single-transaction \
    -f "$f" \
    -c "insert into migrations.schema_migrations (filename, checksum) values ('${name}', '${sum}')"
  applied=$((applied + 1))
done

if [ "$baseline" = "1" ]; then
  log "baseline done — recorded=${applied} already-present=${skipped}"
else
  log "done — applied=${applied} skipped=${skipped}"
fi
