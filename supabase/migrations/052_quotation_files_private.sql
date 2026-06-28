-- Make quote attachments private; they are now served via short-lived signed
-- URLs (generated server-side) instead of public URLs. The column holds the
-- storage PATH, not a public URL.
UPDATE storage.buckets SET public = false WHERE id = 'quotations';

ALTER TABLE quotations RENAME COLUMN quote_file_url TO quote_file_path;
