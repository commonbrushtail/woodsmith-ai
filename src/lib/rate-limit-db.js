/**
 * Durable, shared rate-limit check backed by the `check_rate_limit` Postgres
 * function (migration 050). Unlike the in-memory limiter, this holds across
 * serverless instances.
 *
 * Fails OPEN: if the DB check errors we allow the request (reCAPTCHA remains the
 * primary bot defense) rather than block legitimate users on a transient error.
 *
 * @param {import('@supabase/supabase-js').SupabaseClient} supabase - service-role client
 * @param {string} key
 * @param {{ windowSeconds: number, max: number }} opts
 * @returns {Promise<boolean>} true if allowed
 */
export async function checkRateLimitDb(supabase, key, { windowSeconds, max }) {
  const { data, error } = await supabase.rpc('check_rate_limit', {
    p_key: key,
    p_window_seconds: windowSeconds,
    p_max: max,
  })
  if (error) return true // fail open
  return data !== false
}
