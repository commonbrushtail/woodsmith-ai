-- Add image_url column to product_options for option swatch/thumbnail images
ALTER TABLE product_options ADD COLUMN image_url text;
