-- Atomic view count increment function for blog_posts.

CREATE OR REPLACE FUNCTION increment_blog_view(post_id uuid)
RETURNS void
LANGUAGE sql
AS $$
  UPDATE blog_posts
  SET view_count = view_count + 1
  WHERE id = post_id;
$$;
