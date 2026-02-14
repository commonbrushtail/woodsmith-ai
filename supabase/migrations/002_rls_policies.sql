-- WoodSmith AI: Row Level Security Policies
--
-- Access model:
--   - Public (anon): read-only on published content
--   - Customer: read published content + read/write own quotations
--   - Admin/Editor: full access to all CMS tables (via service role key in server actions)
--   - Service role key bypasses RLS entirely
--
-- Note: Admin CRUD operations use the service role key (createServiceClient),
-- which bypasses RLS. These policies primarily protect the anon key (public client).

-- ============================================================
-- Enable RLS on all tables
-- ============================================================

ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE product_images ENABLE ROW LEVEL SECURITY;
ALTER TABLE product_options ENABLE ROW LEVEL SECURITY;
ALTER TABLE banners ENABLE ROW LEVEL SECURITY;
ALTER TABLE blog_posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE video_highlights ENABLE ROW LEVEL SECURITY;
ALTER TABLE gallery_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE manuals ENABLE ROW LEVEL SECURITY;
ALTER TABLE about_us ENABLE ROW LEVEL SECURITY;
ALTER TABLE branches ENABLE ROW LEVEL SECURITY;
ALTER TABLE faqs ENABLE ROW LEVEL SECURITY;
ALTER TABLE quotations ENABLE ROW LEVEL SECURITY;
ALTER TABLE company_profile ENABLE ROW LEVEL SECURITY;

-- ============================================================
-- PRODUCTS: public can read published only
-- ============================================================

CREATE POLICY "Public can read published products"
  ON products FOR SELECT
  TO anon
  USING (published = true);

CREATE POLICY "Authenticated can read published products"
  ON products FOR SELECT
  TO authenticated
  USING (published = true);

-- ============================================================
-- PRODUCT_IMAGES: public can read images of published products
-- ============================================================

CREATE POLICY "Public can read product images"
  ON product_images FOR SELECT
  TO anon
  USING (
    EXISTS (
      SELECT 1 FROM products WHERE products.id = product_images.product_id AND products.published = true
    )
  );

CREATE POLICY "Authenticated can read product images"
  ON product_images FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM products WHERE products.id = product_images.product_id AND products.published = true
    )
  );

-- ============================================================
-- PRODUCT_OPTIONS: public can read options of published products
-- ============================================================

CREATE POLICY "Public can read product options"
  ON product_options FOR SELECT
  TO anon
  USING (
    EXISTS (
      SELECT 1 FROM products WHERE products.id = product_options.product_id AND products.published = true
    )
  );

CREATE POLICY "Authenticated can read product options"
  ON product_options FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM products WHERE products.id = product_options.product_id AND products.published = true
    )
  );

-- ============================================================
-- BANNERS: public can read active banners
-- ============================================================

CREATE POLICY "Public can read active banners"
  ON banners FOR SELECT
  TO anon
  USING (status = 'active');

CREATE POLICY "Authenticated can read active banners"
  ON banners FOR SELECT
  TO authenticated
  USING (status = 'active');

-- ============================================================
-- BLOG_POSTS: public can read published posts
-- ============================================================

CREATE POLICY "Public can read published blog posts"
  ON blog_posts FOR SELECT
  TO anon
  USING (published = true);

CREATE POLICY "Authenticated can read published blog posts"
  ON blog_posts FOR SELECT
  TO authenticated
  USING (published = true);

-- ============================================================
-- VIDEO_HIGHLIGHTS: public can read published
-- ============================================================

CREATE POLICY "Public can read published video highlights"
  ON video_highlights FOR SELECT
  TO anon
  USING (published = true);

CREATE POLICY "Authenticated can read published video highlights"
  ON video_highlights FOR SELECT
  TO authenticated
  USING (published = true);

-- ============================================================
-- GALLERY_ITEMS: public can read published
-- ============================================================

CREATE POLICY "Public can read published gallery items"
  ON gallery_items FOR SELECT
  TO anon
  USING (published = true);

CREATE POLICY "Authenticated can read published gallery items"
  ON gallery_items FOR SELECT
  TO authenticated
  USING (published = true);

-- ============================================================
-- MANUALS: public can read published
-- ============================================================

CREATE POLICY "Public can read published manuals"
  ON manuals FOR SELECT
  TO anon
  USING (published = true);

CREATE POLICY "Authenticated can read published manuals"
  ON manuals FOR SELECT
  TO authenticated
  USING (published = true);

-- ============================================================
-- ABOUT_US: public can read
-- ============================================================

CREATE POLICY "Public can read about us"
  ON about_us FOR SELECT
  TO anon
  USING (true);

CREATE POLICY "Authenticated can read about us"
  ON about_us FOR SELECT
  TO authenticated
  USING (true);

-- ============================================================
-- BRANCHES: public can read published
-- ============================================================

CREATE POLICY "Public can read published branches"
  ON branches FOR SELECT
  TO anon
  USING (published = true);

CREATE POLICY "Authenticated can read published branches"
  ON branches FOR SELECT
  TO authenticated
  USING (published = true);

-- ============================================================
-- FAQS: public can read published
-- ============================================================

CREATE POLICY "Public can read published faqs"
  ON faqs FOR SELECT
  TO anon
  USING (published = true);

CREATE POLICY "Authenticated can read published faqs"
  ON faqs FOR SELECT
  TO authenticated
  USING (published = true);

-- ============================================================
-- COMPANY_PROFILE: public can read
-- ============================================================

CREATE POLICY "Public can read company profile"
  ON company_profile FOR SELECT
  TO anon
  USING (true);

CREATE POLICY "Authenticated can read company profile"
  ON company_profile FOR SELECT
  TO authenticated
  USING (true);

-- ============================================================
-- USER_PROFILES: users can read own profile
-- ============================================================

CREATE POLICY "Users can read own profile"
  ON user_profiles FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can update own profile"
  ON user_profiles FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- ============================================================
-- QUOTATIONS: customers can create and read own quotations
-- ============================================================

CREATE POLICY "Customers can create quotations"
  ON quotations FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = customer_id);

CREATE POLICY "Customers can read own quotations"
  ON quotations FOR SELECT
  TO authenticated
  USING (auth.uid() = customer_id);
