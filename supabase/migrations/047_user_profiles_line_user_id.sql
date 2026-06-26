-- Add line_user_id to user_profiles.
--
-- The LINE login callback already tried to write user_profiles.line_user_id,
-- but the column never existed, so those writes silently errored and the
-- column was effectively unusable. This adds it, backfills existing LINE
-- users from their auth metadata, and enforces one profile per LINE account.
--
-- Nullable: email / SMS users keep NULL and are unaffected. A UNIQUE index
-- still permits multiple NULLs in Postgres, so only real LINE IDs are constrained.

ALTER TABLE user_profiles ADD COLUMN IF NOT EXISTS line_user_id text;

-- Backfill from existing auth users' app_metadata (the prior source of truth).
UPDATE user_profiles up
SET line_user_id = au.raw_app_meta_data ->> 'line_user_id'
FROM auth.users au
WHERE up.user_id = au.id
  AND au.raw_app_meta_data ->> 'line_user_id' IS NOT NULL
  AND up.line_user_id IS NULL;

-- One profile per LINE account; also makes line_user_id lookups indexed.
CREATE UNIQUE INDEX IF NOT EXISTS user_profiles_line_user_id_key
  ON user_profiles (line_user_id);
