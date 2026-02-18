-- Create site_settings table
CREATE TABLE IF NOT EXISTS site_settings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  -- Company Information
  company_name TEXT NOT NULL DEFAULT 'บริษัท วนชัย วู้ดสมิธ จำกัด',
  company_address TEXT NOT NULL DEFAULT 'เลขที่ 2/1 ถนน วงศ์สว่าง แขวงวงศ์สว่าง เขตบางซื่อ กรุงเทพฯ 10800',
  phone_number TEXT NOT NULL DEFAULT '0 2587 9700-1',

  -- Social Media
  line_id TEXT DEFAULT '@vanachai.woodsmith',
  facebook_url TEXT DEFAULT '',
  instagram_url TEXT DEFAULT '',
  tiktok_url TEXT DEFAULT '',
  line_url TEXT DEFAULT '',

  -- Footer
  copyright_text TEXT DEFAULT '© 2019 @vanachai.woodsmith. All rights reserved.',

  -- Timestamps
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Insert default settings (single row) - only if table is empty
INSERT INTO site_settings (
  company_name,
  company_address,
  phone_number,
  line_id,
  copyright_text
)
SELECT
  'บริษัท วนชัย วู้ดสมิธ จำกัด',
  'เลขที่ 2/1 ถนน วงศ์สว่าง แขวงวงศ์สว่าง เขตบางซื่อ กรุงเทพฯ 10800',
  '0 2587 9700-1',
  '@vanachai.woodsmith',
  '© 2019 @vanachai.woodsmith. All rights reserved.'
WHERE NOT EXISTS (SELECT 1 FROM site_settings);

-- RLS Policies
ALTER TABLE site_settings ENABLE ROW LEVEL SECURITY;

-- Public read access (for footer/header display)
CREATE POLICY "Allow public read access to site_settings"
  ON site_settings FOR SELECT
  TO public
  USING (true);

-- Admin INSERT access
CREATE POLICY "Allow admin insert access to site_settings"
  ON site_settings FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM auth.users
      WHERE auth.users.id = auth.uid()
      AND auth.users.raw_user_meta_data->>'role' IN ('admin', 'editor')
    )
  );

-- Admin UPDATE access
CREATE POLICY "Allow admin update access to site_settings"
  ON site_settings FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM auth.users
      WHERE auth.users.id = auth.uid()
      AND auth.users.raw_user_meta_data->>'role' IN ('admin', 'editor')
    )
  );

-- Admin DELETE access (for cleanup)
CREATE POLICY "Allow admin delete access to site_settings"
  ON site_settings FOR DELETE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM auth.users
      WHERE auth.users.id = auth.uid()
      AND auth.users.raw_user_meta_data->>'role' IN ('admin', 'editor')
    )
  );

-- Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_site_settings_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger
CREATE TRIGGER site_settings_updated_at
  BEFORE UPDATE ON site_settings
  FOR EACH ROW
  EXECUTE FUNCTION update_site_settings_updated_at();
