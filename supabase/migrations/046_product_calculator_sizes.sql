-- Add JSONB column to store multiple calculator sizes per product
-- Each entry: { label, coverage_per_box, pieces_per_box, plank_width, plank_length, waste_percentage }
ALTER TABLE products ADD COLUMN IF NOT EXISTS calculator_sizes JSONB DEFAULT '[]';

-- Migrate existing single-size data into the new array column
UPDATE products
SET calculator_sizes = jsonb_build_array(
  jsonb_build_object(
    'label', 'ขนาดมาตรฐาน',
    'coverage_per_box', coverage_per_box,
    'pieces_per_box', pieces_per_box,
    'plank_width', plank_width,
    'plank_length', plank_length,
    'waste_percentage', COALESCE(waste_percentage, 5)
  )
)
WHERE show_area_calculator = true
  AND coverage_per_box IS NOT NULL;
