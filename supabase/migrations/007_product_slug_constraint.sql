-- Add NOT NULL and UNIQUE constraint to products.slug after seeding
ALTER TABLE products ALTER COLUMN slug SET NOT NULL;
CREATE UNIQUE INDEX IF NOT EXISTS products_slug_idx ON products (slug);
