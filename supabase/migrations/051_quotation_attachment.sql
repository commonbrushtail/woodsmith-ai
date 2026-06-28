-- Quote attachment: a file (e.g. a PDF quote) the admin sends to the customer.
ALTER TABLE quotations ADD COLUMN IF NOT EXISTS quote_file_url text;
ALTER TABLE quotations ADD COLUMN IF NOT EXISTS quote_file_name text;

-- Public storage bucket for quote attachments. Public read (unguessable paths);
-- uploads happen server-side via the service role. Created here so it exists in
-- every environment.
INSERT INTO storage.buckets (id, name, public)
VALUES ('quotations', 'quotations', true)
ON CONFLICT (id) DO NOTHING;
