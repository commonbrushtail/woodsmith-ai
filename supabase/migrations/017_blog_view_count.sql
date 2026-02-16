-- Add view_count to blog_posts for tracking page views.

ALTER TABLE blog_posts
  ADD COLUMN view_count integer NOT NULL DEFAULT 0;
