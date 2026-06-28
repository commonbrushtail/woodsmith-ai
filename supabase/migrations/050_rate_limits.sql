-- Durable, shared rate limiting (replaces the in-memory limiter which doesn't
-- hold across serverless instances). A fixed-window counter per key.

CREATE TABLE IF NOT EXISTS rate_limits (
  key text PRIMARY KEY,
  window_start timestamptz NOT NULL DEFAULT now(),
  count integer NOT NULL DEFAULT 0
);

-- Only the service role touches this table (server-side checks). Enable RLS
-- with no policies so anon/authenticated have no access.
ALTER TABLE rate_limits ENABLE ROW LEVEL SECURITY;

-- Atomically reset-or-increment the window and report whether the request is
-- allowed. Called via the service-role client: supabase.rpc('check_rate_limit',
-- { p_key, p_window_seconds, p_max }). Returns true when within the limit.
CREATE OR REPLACE FUNCTION check_rate_limit(p_key text, p_window_seconds integer, p_max integer)
RETURNS boolean
LANGUAGE plpgsql
AS $$
DECLARE
  v_now timestamptz := now();
  v_count integer;
BEGIN
  INSERT INTO rate_limits (key, window_start, count)
  VALUES (p_key, v_now, 1)
  ON CONFLICT (key) DO UPDATE
    SET
      window_start = CASE
        WHEN rate_limits.window_start < v_now - make_interval(secs => p_window_seconds)
          THEN v_now
        ELSE rate_limits.window_start
      END,
      count = CASE
        WHEN rate_limits.window_start < v_now - make_interval(secs => p_window_seconds)
          THEN 1
        ELSE rate_limits.count + 1
      END
  RETURNING count INTO v_count;

  RETURN v_count <= p_max;
END;
$$;
