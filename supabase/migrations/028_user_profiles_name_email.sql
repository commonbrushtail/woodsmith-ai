-- Add first_name, last_name, email columns to user_profiles for LINE profile completion form
-- These are nullable (no NOT NULL) so existing rows and SMS OTP users are unaffected

ALTER TABLE user_profiles ADD COLUMN IF NOT EXISTS first_name text;
ALTER TABLE user_profiles ADD COLUMN IF NOT EXISTS last_name text;
ALTER TABLE user_profiles ADD COLUMN IF NOT EXISTS email text;
