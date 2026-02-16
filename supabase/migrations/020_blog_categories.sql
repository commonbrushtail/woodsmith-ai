-- Blog categories table for dynamic category management.

CREATE TABLE blog_categories (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  sort_order INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

CREATE TRIGGER blog_categories_updated_at
  BEFORE UPDATE ON blog_categories
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE INDEX idx_blog_categories_sort ON blog_categories(sort_order);

-- RLS: public read, admin writes via service client
ALTER TABLE blog_categories ENABLE ROW LEVEL SECURITY;

CREATE POLICY blog_categories_select ON blog_categories
  FOR SELECT USING (true);

-- Seed existing hardcoded categories
INSERT INTO blog_categories (name, slug, sort_order) VALUES
  ('ไอเดียและเคล็ดลับ', 'ideas', 0),
  ('เทรนด์', 'trend', 1),
  ('สไตล์และฟังก์ชัน', 'style', 2),
  ('ความรู้ทั่วไป', 'knowledge', 3);
