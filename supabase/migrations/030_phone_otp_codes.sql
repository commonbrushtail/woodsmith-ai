-- Migration 030: phone_otp_codes table
-- Custom OTP storage for SMS login (bypasses Supabase built-in phone auth)
-- OTPs are generated server-side, stored here, and verified against SMSKUB delivery.

CREATE TABLE IF NOT EXISTS phone_otp_codes (
  phone       TEXT        PRIMARY KEY,             -- Thai format: 0XXXXXXXXX
  otp         TEXT        NOT NULL,
  expires_at  TIMESTAMPTZ NOT NULL,
  used        BOOLEAN     NOT NULL DEFAULT false,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Enable RLS — service role bypasses it; no public access needed
ALTER TABLE phone_otp_codes ENABLE ROW LEVEL SECURITY;
-- No policies = no access for anon/authenticated roles
