-- Fix: ensure region, hours, line_url columns exist on branches table
-- (003_public_columns.sql was tracked but columns were not created)
ALTER TABLE branches ADD COLUMN IF NOT EXISTS region text;
ALTER TABLE branches ADD COLUMN IF NOT EXISTS hours text;
ALTER TABLE branches ADD COLUMN IF NOT EXISTS line_url text;
