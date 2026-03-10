-- Legal pages table for Terms, Privacy Policy, Cookie Policy
CREATE TABLE IF NOT EXISTS legal_pages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug TEXT NOT NULL UNIQUE,  -- 'terms', 'privacy', 'cookies'
  title TEXT NOT NULL,
  content TEXT DEFAULT '',     -- Rich text HTML content
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Seed default rows
INSERT INTO legal_pages (slug, title) VALUES
  ('terms', 'ข้อกำหนดและเงื่อนไขการใช้งาน'),
  ('privacy', 'นโยบายความเป็นส่วนตัว'),
  ('cookies', 'นโยบายคุกกี้')
ON CONFLICT (slug) DO NOTHING;

-- RLS
ALTER TABLE legal_pages ENABLE ROW LEVEL SECURITY;

-- Public read
CREATE POLICY "Allow public read access to legal_pages"
  ON legal_pages FOR SELECT
  TO public
  USING (true);

-- Admin write
CREATE POLICY "Allow admin insert access to legal_pages"
  ON legal_pages FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM auth.users
      WHERE auth.users.id = auth.uid()
      AND auth.users.raw_user_meta_data->>'role' IN ('admin', 'editor')
    )
  );

CREATE POLICY "Allow admin update access to legal_pages"
  ON legal_pages FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM auth.users
      WHERE auth.users.id = auth.uid()
      AND auth.users.raw_user_meta_data->>'role' IN ('admin', 'editor')
    )
  );

-- Auto-update timestamp
CREATE OR REPLACE FUNCTION update_legal_pages_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER legal_pages_updated_at
  BEFORE UPDATE ON legal_pages
  FOR EACH ROW
  EXECUTE FUNCTION update_legal_pages_updated_at();
