-- Migration 031: add ref_code column to phone_otp_codes
-- Reference code is displayed in the OTP screen UI and included in the SMS.

ALTER TABLE phone_otp_codes ADD COLUMN IF NOT EXISTS ref_code TEXT NOT NULL DEFAULT '';
