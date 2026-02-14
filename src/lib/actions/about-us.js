'use server'

import { revalidatePath } from 'next/cache'
import { createServiceClient } from '@/lib/supabase/admin'

/**
 * Fetch the singleton about_us record.
 * The `content` column stores JSON: { companyName, companySlogan, companyDetail }
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
      return { data: { id: null, companyName: '', companySlogan: '', companyDetail: '' }, error: null }
    }
    return { data: null, error: error.message }
  }

  // Parse content JSON
  let parsed = { companyName: '', companySlogan: '', companyDetail: '' }
  if (data.content) {
    try {
      parsed = JSON.parse(data.content)
    } catch {
      // If content isn't JSON, treat it as companyDetail
      parsed = { companyName: '', companySlogan: '', companyDetail: data.content }
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
    companyName: formData.get('companyName') || '',
    companySlogan: formData.get('companySlogan') || '',
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
  return { error: null }
}
