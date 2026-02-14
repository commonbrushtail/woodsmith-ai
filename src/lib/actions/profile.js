'use server'

import { revalidatePath } from 'next/cache'
import { createServiceClient } from '@/lib/supabase/admin'

/**
 * Get the company profile (singleton from company_profile table).
 * Content is stored as JSON in the 'content' text column.
 */
export async function getCompanyProfile() {
  const supabase = createServiceClient()
  const { data, error } = await supabase
    .from('company_profile')
    .select('*')
    .limit(1)
    .single()

  if (error) {
    if (error.code === 'PGRST116') {
      // No rows — return empty defaults
      return {
        data: { id: null, companyName: '', setKey: '', setRecommendedKey: '', setTip: '', social_links: null },
        error: null,
      }
    }
    return { data: null, error: error.message }
  }

  let parsed = { companyName: '', setKey: '', setRecommendedKey: '', setTip: '' }
  if (data.content) {
    try {
      parsed = JSON.parse(data.content)
    } catch {
      parsed = { companyName: data.content, setKey: '', setRecommendedKey: '', setTip: '' }
    }
  }

  return {
    data: { id: data.id, ...parsed, social_links: data.social_links, updated_at: data.updated_at },
    error: null,
  }
}

/**
 * Update the company profile (upsert singleton).
 */
export async function updateCompanyProfile(formData) {
  const supabase = createServiceClient()

  const content = JSON.stringify({
    companyName: formData.get('companyName') || '',
    setKey: formData.get('setKey') || '',
    setRecommendedKey: formData.get('setRecommendedKey') || '',
    setTip: formData.get('setTip') || '',
  })

  // Try to get existing record
  const { data: existing } = await supabase
    .from('company_profile')
    .select('id')
    .limit(1)
    .single()

  let result
  if (existing?.id) {
    result = await supabase
      .from('company_profile')
      .update({ content })
      .eq('id', existing.id)
      .select()
      .single()
  } else {
    result = await supabase
      .from('company_profile')
      .insert({ content })
      .select()
      .single()
  }

  if (result.error) {
    return { data: null, error: result.error.message }
  }

  revalidatePath('/admin/profile')
  return { data: result.data, error: null }
}
