-- Add variation_entry_id to product_images so each product can have
-- different images per variation (e.g. different door photos per color).
-- NULL = default/shared image, non-NULL = shown when that variation is selected.

ALTER TABLE product_images
  ADD COLUMN variation_entry_id uuid REFERENCES variation_entries(id) ON DELETE SET NULL;

CREATE INDEX idx_product_images_variation_entry
  ON product_images(variation_entry_id)
  WHERE variation_entry_id IS NOT NULL;

-- Allow RLS: public can read product_images (already covered by existing policy)
