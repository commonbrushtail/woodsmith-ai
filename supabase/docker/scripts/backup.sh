#!/usr/bin/env sh
# Postgres backup -> DigitalOcean Spaces (S3-compatible). Run on the droplet via
# cron. Uses the running supabase-db container's pg_dump and the aws-cli container
# for upload, so no host-side tools are required.
#
# Required env (export, or `set -a; . /path/to/backup.env; set +a` before running):
#   POSTGRES_PASSWORD                 (from the stack .env)
#   POSTGRES_DB                       (default: postgres)
#   SPACES_BUCKET                     e.g. woodsmith-prod
#   SPACES_REGION                     e.g. sgp1
#   SPACES_ENDPOINT                   e.g. https://sgp1.digitaloceanspaces.com
#   SPACES_ACCESS_KEY_ID / SPACES_SECRET_ACCESS_KEY
#   BACKUP_PREFIX                     (default: backups/db)
#
# Cron (daily 03:00): 0 3 * * * /opt/woodsmith/supabase/docker/scripts/backup.sh >> /var/log/woodsmith-backup.log 2>&1
# Retention: add a Spaces lifecycle rule to expire objects under BACKUP_PREFIX/
# (safer than client-side deletes).
set -eu

: "${POSTGRES_DB:=postgres}"
: "${BACKUP_PREFIX:=backups/db}"
: "${DB_CONTAINER:=supabase-db}"

ts="$(date -u +%Y%m%dT%H%M%SZ)"
file="woodsmith-${POSTGRES_DB}-${ts}.sql.gz"
tmp="/tmp/${file}"

echo "[backup] dumping ${POSTGRES_DB} from ${DB_CONTAINER} ..."
docker exec -e PGPASSWORD="${POSTGRES_PASSWORD}" "${DB_CONTAINER}" \
  pg_dump -U postgres -d "${POSTGRES_DB}" --no-owner --clean --if-exists \
  | gzip -9 > "${tmp}"

size="$(wc -c < "${tmp}")"
echo "[backup] dump ${size} bytes -> s3://${SPACES_BUCKET}/${BACKUP_PREFIX}/${file}"

docker run --rm -v "${tmp}:/data/${file}:ro" \
  -e AWS_ACCESS_KEY_ID="${SPACES_ACCESS_KEY_ID}" \
  -e AWS_SECRET_ACCESS_KEY="${SPACES_SECRET_ACCESS_KEY}" \
  amazon/aws-cli \
  --endpoint-url "${SPACES_ENDPOINT}" --region "${SPACES_REGION}" \
  s3 cp "/data/${file}" "s3://${SPACES_BUCKET}/${BACKUP_PREFIX}/${file}"

rm -f "${tmp}"
echo "[backup] done: ${file}"
