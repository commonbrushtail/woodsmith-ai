-- Seed 2 root product type entries: วัสดุก่อสร้าง and ผลิตภัณฑ์สำเร็จ
-- Then re-parent all existing root categories under the appropriate new root

-- 1. Insert the 2 root product types
INSERT INTO product_categories (id, name, slug, type, parent_id, sort_order, published, created_at, updated_at)
VALUES
  ('10000000-0000-0000-0000-000000000001', 'วัสดุก่อสร้าง', 'construction-materials', 'construction', NULL, 0, true, now(), now()),
  ('10000000-0000-0000-0000-000000000002', 'ผลิตภัณฑ์สำเร็จ', 'finished-products', 'decoration', NULL, 1, true, now(), now())
ON CONFLICT DO NOTHING;

-- 2. Re-parent existing root categories (parent_id IS NULL) under the new roots
--    based on their type field
UPDATE product_categories
SET parent_id = '10000000-0000-0000-0000-000000000001'
WHERE parent_id IS NULL
  AND type = 'construction'
  AND id != '10000000-0000-0000-0000-000000000001';

UPDATE product_categories
SET parent_id = '10000000-0000-0000-0000-000000000002'
WHERE parent_id IS NULL
  AND type = 'decoration'
  AND id != '10000000-0000-0000-0000-000000000002';
