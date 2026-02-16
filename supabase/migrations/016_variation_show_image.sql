-- Add show_image flag to product_variation_links
-- Controls whether variation swatch images are displayed on the public product page.
-- Default true = show images. Admin can toggle per-group in product edit form.

ALTER TABLE product_variation_links
  ADD COLUMN show_image boolean NOT NULL DEFAULT true;
