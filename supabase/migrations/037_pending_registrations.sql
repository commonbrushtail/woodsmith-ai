-- Temporary table for email verification before creating Supabase auth user
CREATE TABLE IF NOT EXISTS pending_registrations (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  email text NOT NULL,
  token text NOT NULL UNIQUE,
  expires_at timestamptz NOT NULL,
  created_at timestamptz DEFAULT now()
);

-- Index for fast token lookups
CREATE INDEX idx_pending_registrations_token ON pending_registrations (token);

-- Auto-cleanup expired rows (older than 2 hours)
CREATE INDEX idx_pending_registrations_expires ON pending_registrations (expires_at);

-- Allow service role full access, no public access needed
ALTER TABLE pending_registrations ENABLE ROW LEVEL SECURITY;
