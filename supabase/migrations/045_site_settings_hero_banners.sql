-- Add hero banner image URL columns for public pages
ALTER TABLE site_settings
ADD COLUMN IF NOT EXISTS banner_about_url TEXT DEFAULT '',
ADD COLUMN IF NOT EXISTS banner_blog_url TEXT DEFAULT '',
ADD COLUMN IF NOT EXISTS banner_manual_url TEXT DEFAULT '',
ADD COLUMN IF NOT EXISTS banner_highlight_url TEXT DEFAULT '',
ADD COLUMN IF NOT EXISTS banner_faq_url TEXT DEFAULT '';
