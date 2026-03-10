'use server'

import { revalidatePath } from 'next/cache'
import { createServiceClient } from '@/lib/supabase/admin'
import { requireAdmin } from '@/lib/auth/require-admin'

/**
 * Fetch all legal pages (admin).
 */
export async function getLegalPages() {
  const { error: authError } = await requireAdmin()
  if (authError) return { data: null, error: authError }

  const supabase = createServiceClient()
  const { data, error } = await supabase
    .from('legal_pages')
    .select('*')
    .order('slug')

  if (error) return { data: null, error: error.message }
  return { data, error: null }
}

/**
 * Update a legal page by slug.
 */
export async function updateLegalPage(slug, content) {
  const { error: authError } = await requireAdmin()
  if (authError) return { error: authError }

  const supabase = createServiceClient()
  const { error } = await supabase
    .from('legal_pages')
    .update({ content })
    .eq('slug', slug)

  if (error) return { error: error.message }

  revalidatePath('/admin/legal-pages')
  revalidatePath(`/${slug === 'cookies' ? 'cookies' : slug}`)
  revalidatePath('/terms')
  revalidatePath('/privacy')
  return { error: null }
}
