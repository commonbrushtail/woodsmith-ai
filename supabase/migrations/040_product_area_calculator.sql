-- Add area calculator toggle to products
ALTER TABLE products ADD COLUMN IF NOT EXISTS show_area_calculator BOOLEAN DEFAULT false;
