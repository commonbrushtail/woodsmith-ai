-- WoodSmith AI: Time-based publish filtering via RLS
--
-- Updates RLS SELECT policies on products, product_images, product_options,
-- and product_variation_links to enforce publish_start/publish_end date ranges.
--
-- Logic:
--   published = true
--   AND (publish_start IS NULL OR publish_start <= now())   -- not yet started → hidden
--   AND (publish_end IS NULL OR publish_end >= now())       -- already ended → hidden
--
-- NULL dates = no restriction (backward compatible with existing products).

-- ============================================================
-- PRODUCTS: replace SELECT policies with date range checks
-- ============================================================

DROP POLICY "Public can read published products" ON products;
DROP POLICY "Authenticated can read published products" ON products;

CREATE POLICY "Public can read published products"
  ON products FOR SELECT
  TO anon
  USING (
    published = true
    AND (publish_start IS NULL OR publish_start <= now())
    AND (publish_end IS NULL OR publish_end >= now())
  );

CREATE POLICY "Authenticated can read published products"
  ON products FOR SELECT
  TO authenticated
  USING (
    published = true
    AND (publish_start IS NULL OR publish_start <= now())
    AND (publish_end IS NULL OR publish_end >= now())
  );

-- ============================================================
-- PRODUCT_IMAGES: replace SELECT policies with date range checks
-- ============================================================

DROP POLICY "Public can read product images" ON product_images;
DROP POLICY "Authenticated can read product images" ON product_images;

CREATE POLICY "Public can read product images"
  ON product_images FOR SELECT
  TO anon
  USING (
    EXISTS (
      SELECT 1 FROM products
      WHERE products.id = product_images.product_id
        AND products.published = true
        AND (products.publish_start IS NULL OR products.publish_start <= now())
        AND (products.publish_end IS NULL OR products.publish_end >= now())
    )
  );

CREATE POLICY "Authenticated can read product images"
  ON product_images FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM products
      WHERE products.id = product_images.product_id
        AND products.published = true
        AND (products.publish_start IS NULL OR products.publish_start <= now())
        AND (products.publish_end IS NULL OR products.publish_end >= now())
    )
  );

-- ============================================================
-- PRODUCT_OPTIONS: replace SELECT policies with date range checks
-- ============================================================

DROP POLICY "Public can read product options" ON product_options;
DROP POLICY "Authenticated can read product options" ON product_options;

CREATE POLICY "Public can read product options"
  ON product_options FOR SELECT
  TO anon
  USING (
    EXISTS (
      SELECT 1 FROM products
      WHERE products.id = product_options.product_id
        AND products.published = true
        AND (products.publish_start IS NULL OR products.publish_start <= now())
        AND (products.publish_end IS NULL OR products.publish_end >= now())
    )
  );

CREATE POLICY "Authenticated can read product options"
  ON product_options FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM products
      WHERE products.id = product_options.product_id
        AND products.published = true
        AND (products.publish_start IS NULL OR products.publish_start <= now())
        AND (products.publish_end IS NULL OR products.publish_end >= now())
    )
  );

-- ============================================================
-- PRODUCT_VARIATION_LINKS: replace SELECT policies with date range checks
-- ============================================================

DROP POLICY "Public can read product variation links" ON product_variation_links;
DROP POLICY "Authenticated can read product variation links" ON product_variation_links;

CREATE POLICY "Public can read product variation links"
  ON product_variation_links FOR SELECT
  TO anon
  USING (
    EXISTS (
      SELECT 1 FROM products
      WHERE products.id = product_variation_links.product_id
        AND products.published = true
        AND (products.publish_start IS NULL OR products.publish_start <= now())
        AND (products.publish_end IS NULL OR products.publish_end >= now())
    )
  );

CREATE POLICY "Authenticated can read product variation links"
  ON product_variation_links FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM products
      WHERE products.id = product_variation_links.product_id
        AND products.published = true
        AND (products.publish_start IS NULL OR products.publish_start <= now())
        AND (products.publish_end IS NULL OR products.publish_end >= now())
    )
  );
