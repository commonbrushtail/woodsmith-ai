'use server'

import { revalidatePath } from 'next/cache'
import { createServiceClient } from '@/lib/supabase/admin'

/**
 * Fetch the singleton about_us record.
 * The `content` column stores JSON: { companyDetail }
 */
export async function getAboutUs() {
  const supabase = createServiceClient()

  const { data, error } = await supabase
    .from('about_us')
    .select('*')
    .limit(1)
    .single()

  if (error) {
    // No row yet — return empty defaults
    if (error.code === 'PGRST116') {
      return { data: { id: null, companyDetail: '' }, error: null }
    }
    return { data: null, error: error.message }
  }

  // Parse content JSON
  let parsed = { companyDetail: '' }
  if (data.content) {
    try {
      const json = JSON.parse(data.content)
      parsed = { companyDetail: json.companyDetail || '' }
    } catch {
      // If content isn't JSON, treat it as companyDetail directly
      parsed = { companyDetail: data.content }
    }
  }

  return {
    data: { id: data.id, ...parsed, updated_at: data.updated_at },
    error: null,
  }
}

/**
 * Update (or insert) the singleton about_us record.
 */
export async function updateAboutUs(formData) {
  const supabase = createServiceClient()

  const content = JSON.stringify({
    companyDetail: formData.get('companyDetail') || '',
  })

  // Try to get existing record
  const { data: existing } = await supabase
    .from('about_us')
    .select('id')
    .limit(1)
    .single()

  let result
  if (existing?.id) {
    result = await supabase
      .from('about_us')
      .update({ content })
      .eq('id', existing.id)
      .select()
      .single()
  } else {
    result = await supabase
      .from('about_us')
      .insert({ content })
      .select()
      .single()
  }

  if (result.error) {
    return { error: result.error.message }
  }

  revalidatePath('/admin/about-us')
  revalidatePath('/about')
  return { error: null }
}
