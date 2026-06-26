import { draftMode } from 'next/headers'
import { createClient } from '@/lib/supabase/server'
import { createServiceClient } from '@/lib/supabase/admin'
import { requireAdmin } from '@/lib/auth/require-admin'

// -------------------------------------------------------------------
// Draft-aware read access for public data functions.
//
// Two independent gates protect unpublished content:
//   1. Draft Mode must be enabled (a signed httpOnly cookie set only by the
//      /api/preview route, which is itself behind requireAdmin()).
//   2. The requester must STILL pass requireAdmin() here, at read time.
//
// A forged or stale Draft Mode cookie with no admin session falls through to
// the normal anon client and sees nothing unpublished — so no extra RLS
// policy is needed. When Draft Mode is off (every public request), this is
// byte-for-byte identical to calling createClient() directly.
// -------------------------------------------------------------------

/**
 * Pick the Supabase client a public data function should read through.
 * - Normal request            -> anon server client (RLS = published only)
 * - Preview request by admin   -> service-role client (bypasses RLS = drafts visible)
 *
 * @returns {Promise<import('@supabase/supabase-js').SupabaseClient>}
 */
export async function getReadClient() {
  const { isEnabled } = await draftMode()
  if (!isEnabled) return createClient() // hot public path — no admin check

  const { user } = await requireAdmin() // second gate
  if (!user) return createClient() // bypass cookie without admin session = still public

  return createServiceClient()
}

/**
 * True only when the current request is a real admin previewing drafts.
 * Use to render preview-only UI (e.g. the draft banner).
 *
 * @returns {Promise<boolean>}
 */
export async function isPreview() {
  const { isEnabled } = await draftMode()
  if (!isEnabled) return false

  const { user } = await requireAdmin()
  return !!user
}
