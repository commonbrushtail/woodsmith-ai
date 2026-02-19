-- Remove 'tool' from product_type enum
-- First update any rows that might use 'tool' to 'construction'
UPDATE products SET type = 'construction' WHERE type = 'tool';
UPDATE product_categories SET type = 'construction' WHERE type = 'tool';

-- Drop defaults that reference the old enum type
ALTER TABLE products ALTER COLUMN type DROP DEFAULT;
ALTER TABLE product_categories ALTER COLUMN type DROP DEFAULT;

-- Recreate enum without 'tool'
ALTER TYPE product_type RENAME TO product_type_old;
CREATE TYPE product_type AS ENUM ('construction', 'decoration');
ALTER TABLE products ALTER COLUMN type TYPE product_type USING type::text::product_type;
ALTER TABLE product_categories ALTER COLUMN type TYPE product_type USING type::text::product_type;
DROP TYPE product_type_old;

-- Restore defaults
ALTER TABLE products ALTER COLUMN type SET DEFAULT 'construction';
ALTER TABLE product_categories ALTER COLUMN type SET DEFAULT 'construction';
