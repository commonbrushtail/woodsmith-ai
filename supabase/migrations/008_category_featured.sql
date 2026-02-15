-- Add is_featured column to product_categories
-- Allows admin to handpick subcategories shown in the top grid on category pages

ALTER TABLE product_categories ADD COLUMN is_featured boolean NOT NULL DEFAULT false;
