-- ============================================================
-- Migration 022: Branch HQ flag + image support
-- Adds is_hq boolean, image_url, and seeds the HQ branch
-- ============================================================

ALTER TABLE branches ADD COLUMN is_hq boolean NOT NULL DEFAULT false;
ALTER TABLE branches ADD COLUMN image_url text;

-- Only one branch can be HQ at a time
CREATE UNIQUE INDEX idx_branches_is_hq ON branches (is_hq) WHERE is_hq = true;

-- Seed the head office branch
INSERT INTO branches (name, address, phone, hours, region, published, is_hq, sort_order)
VALUES (
  'บริษัท วนชัย วู้ดสมิธ จำกัด',
  'เลขที่ 2/1 ถนน วงศ์สว่าง แขวงวงศ์สว่าง เขตบางซื่อ กรุงเทพฯ 10800',
  '0 2587 9700-1',
  'ทุกวัน 08:00 น. - 19:00 น.',
  'ภาคกลาง',
  true,
  true,
  0
);
