-- Add statistics fields to site_settings table
ALTER TABLE site_settings
ADD COLUMN IF NOT EXISTS stat_branches TEXT DEFAULT '97',
ADD COLUMN IF NOT EXISTS stat_products TEXT DEFAULT '20+',
ADD COLUMN IF NOT EXISTS stat_customers TEXT DEFAULT '10K+';

-- Update existing row with default values if they exist
UPDATE site_settings
SET
  stat_branches = '97',
  stat_products = '20+',
  stat_customers = '10K+'
WHERE stat_branches IS NULL;
