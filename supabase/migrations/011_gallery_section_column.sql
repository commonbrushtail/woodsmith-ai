-- Add section column to gallery_items to differentiate homepage vs about page images
ALTER TABLE gallery_items ADD COLUMN section text NOT NULL DEFAULT 'homepage';
CREATE INDEX idx_gallery_items_section ON gallery_items(section);
