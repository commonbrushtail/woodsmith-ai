-- WoodSmith AI: Variation Management RLS Policies
--
-- Access model for variations:
--   - variation_groups: public read (unrestricted)
--   - variation_entries: public read (unrestricted)
--   - product_variation_links: public read only when linked product is published
--   - All admin writes use service role key (bypasses RLS)

-- ============================================================
-- Enable RLS on all variation tables
-- ============================================================

ALTER TABLE variation_groups ENABLE ROW LEVEL SECURITY;
ALTER TABLE variation_entries ENABLE ROW LEVEL SECURITY;
ALTER TABLE product_variation_links ENABLE ROW LEVEL SECURITY;

-- ============================================================
-- VARIATION_GROUPS: public can read all groups
-- ============================================================

CREATE POLICY "Public can read variation groups"
  ON variation_groups FOR SELECT
  TO anon
  USING (true);

CREATE POLICY "Authenticated can read variation groups"
  ON variation_groups FOR SELECT
  TO authenticated
  USING (true);

-- ============================================================
-- VARIATION_ENTRIES: public can read all entries
-- ============================================================

CREATE POLICY "Public can read variation entries"
  ON variation_entries FOR SELECT
  TO anon
  USING (true);

CREATE POLICY "Authenticated can read variation entries"
  ON variation_entries FOR SELECT
  TO authenticated
  USING (true);

-- ============================================================
-- PRODUCT_VARIATION_LINKS: public can read links of published products
-- ============================================================

CREATE POLICY "Public can read product variation links"
  ON product_variation_links FOR SELECT
  TO anon
  USING (
    EXISTS (
      SELECT 1 FROM products WHERE products.id = product_variation_links.product_id AND products.published = true
    )
  );

CREATE POLICY "Authenticated can read product variation links"
  ON product_variation_links FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM products WHERE products.id = product_variation_links.product_id AND products.published = true
    )
  );
