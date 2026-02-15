-- WoodSmith AI: Variation Management Tables
-- 3 tables for v1.1 Variations Management feature

-- ============================================================
-- TABLE 1: variation_groups
-- ============================================================

CREATE TABLE variation_groups (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE TRIGGER variation_groups_updated_at
  BEFORE UPDATE ON variation_groups
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- ============================================================
-- TABLE 2: variation_entries
-- ============================================================

CREATE TABLE variation_entries (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  group_id uuid NOT NULL REFERENCES variation_groups(id) ON DELETE CASCADE,
  label text NOT NULL,
  image_url text,
  sort_order integer NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX idx_variation_entries_group_id ON variation_entries(group_id);

-- ============================================================
-- TABLE 3: product_variation_links
-- ============================================================

CREATE TABLE product_variation_links (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  product_id uuid NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  group_id uuid NOT NULL REFERENCES variation_groups(id) ON DELETE CASCADE,
  entry_id uuid NOT NULL REFERENCES variation_entries(id) ON DELETE CASCADE,
  created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE(product_id, entry_id)
);

CREATE INDEX idx_product_variation_links_product_id ON product_variation_links(product_id);
CREATE INDEX idx_product_variation_links_group_id ON product_variation_links(group_id);
CREATE INDEX idx_product_variation_links_entry_id ON product_variation_links(entry_id);
