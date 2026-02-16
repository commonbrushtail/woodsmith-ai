-- Ensure blog_posts.category column exists and refresh PostgREST schema cache.

ALTER TABLE blog_posts ADD COLUMN IF NOT EXISTS category text;

NOTIFY pgrst, 'reload schema';
