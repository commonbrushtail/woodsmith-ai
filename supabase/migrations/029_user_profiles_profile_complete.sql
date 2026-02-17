-- Add profile_complete flag to user_profiles
-- Tracks whether a LINE (or future social login) user has finished the
-- registration form. Defaults to false; set to true by completeLineProfile().
-- SMS OTP users complete registration inline so they are treated as complete
-- at insert time (see trigger below).

ALTER TABLE user_profiles
  ADD COLUMN profile_complete boolean NOT NULL DEFAULT false;

-- Existing SMS OTP users (auth_provider = 'email') are already complete
UPDATE user_profiles
  SET profile_complete = true
  WHERE auth_provider = 'email';

-- New SMS OTP users should default to complete at insert.
-- We handle this in application code (createCustomerProfile sets profile_complete: true).
