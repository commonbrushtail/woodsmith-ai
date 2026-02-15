-- Fix: ensure youtube_url column exists on manuals table
-- (003_public_columns.sql was tracked but column was not created)
ALTER TABLE manuals ADD COLUMN IF NOT EXISTS youtube_url text;
