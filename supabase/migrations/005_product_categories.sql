-- WoodSmith AI: Product Categories Table
-- Two-level hierarchy with self-referencing parent_id

CREATE TABLE product_categories (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  parent_id uuid REFERENCES product_categories(id) ON DELETE CASCADE,
  name text NOT NULL,
  slug text NOT NULL,
  image_url text,
  type product_type NOT NULL DEFAULT 'construction',
  sort_order integer NOT NULL DEFAULT 0,
  published boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE TRIGGER product_categories_updated_at
  BEFORE UPDATE ON product_categories
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- Name must be unique within same parent level
CREATE UNIQUE INDEX product_categories_name_parent_idx
  ON product_categories (name, COALESCE(parent_id, '00000000-0000-0000-0000-000000000000'));

-- ============================================================
-- RLS POLICIES
-- ============================================================

ALTER TABLE product_categories ENABLE ROW LEVEL SECURITY;

-- Public: anyone can read published categories
CREATE POLICY "product_categories_public_read"
  ON product_categories FOR SELECT
  USING (published = true);

-- Admin/Editor: full access
CREATE POLICY "product_categories_admin_all"
  ON product_categories FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM user_profiles
      WHERE user_profiles.user_id = auth.uid()
      AND user_profiles.role IN ('admin', 'editor')
    )
  );
