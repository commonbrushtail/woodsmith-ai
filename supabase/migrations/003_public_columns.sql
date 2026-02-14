-- WoodSmith AI: Add columns needed by public-facing pages
-- These columns exist in the frontend UI but were missing from the initial schema.

-- blog_posts: category tabs (ideas, trend, style, knowledge)
ALTER TABLE blog_posts ADD COLUMN IF NOT EXISTS category text;

-- branches: region filter, business hours, LINE link
ALTER TABLE branches ADD COLUMN IF NOT EXISTS region text;
ALTER TABLE branches ADD COLUMN IF NOT EXISTS hours text;
ALTER TABLE branches ADD COLUMN IF NOT EXISTS line_url text;

-- faqs: group questions by section title
ALTER TABLE faqs ADD COLUMN IF NOT EXISTS group_title text;

-- video_highlights: duration overlay + channel name
ALTER TABLE video_highlights ADD COLUMN IF NOT EXISTS duration text;
ALTER TABLE video_highlights ADD COLUMN IF NOT EXISTS channel_name text;

-- manuals: YouTube tutorial link
ALTER TABLE manuals ADD COLUMN IF NOT EXISTS youtube_url text;
