import { createClient as createSupabaseClient } from '@supabase/supabase-js'

export function createServiceClient() {
  return createSupabaseClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL ?? 'http://localhost:54321',
    process.env.SUPABASE_SERVICE_ROLE_KEY ?? 'test-service-role-key',
    {
      auth: {
        autoRefreshToken: false,
        persistSession: false,
      },
    }
  )
}

/**
 * Fetch ALL auth users, paginating through every page.
 *
 * `admin.auth.admin.listUsers()` returns only a single page (default 50),
 * so a plain call silently misses everyone beyond the first page. Any lookup
 * across the whole user base (by email, by line_user_id, etc.) must page
 * through every result or it will fail / create duplicates once the user
 * count exceeds one page.
 *
 * @param {import('@supabase/supabase-js').SupabaseClient} admin - service-role client
 * @param {number} [perPage=1000] - page size; larger = fewer round-trips
 * @returns {Promise<Array<object>>} every auth user
 */
export async function listAllAuthUsers(admin, perPage = 1000) {
  const all = []
  let page = 1
  // Loop until a page comes back short — that page is the last one.
  for (;;) {
    const { data, error } = await admin.auth.admin.listUsers({ page, perPage })
    if (error) throw error
    const users = data?.users ?? []
    all.push(...users)
    if (users.length < perPage) break
    page += 1
  }
  return all
}
