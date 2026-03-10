'use server'

import { createServiceClient } from '@/lib/supabase/admin'
import { revalidatePath } from 'next/cache'
import { requireAdmin } from '@/lib/auth/require-admin'
import { uploadFile, getPublicUrl } from '@/lib/storage'

const BANNER_KEYS = ['banner_about', 'banner_blog', 'banner_manual', 'banner_highlight', 'banner_faq']

/**
 * Get site settings
 */
export async function getSiteSettings() {
  const { user, error: authError } = await requireAdmin()
  if (authError) return { data: null, error: authError }

  try {
    const supabase = createServiceClient()
    const { data, error } = await supabase
      .from('site_settings')
      .select('*')
      .limit(1)

    if (error) {
      console.error('Error fetching site settings:', error)
      return { data: null, error: error.message }
    }

    // Return the first row if exists, otherwise null
    return { data: data?.[0] || null, error: null }
  } catch (err) {
    console.error('Unexpected error:', err)
    return { data: null, error: err.message }
  }
}

/**
 * Update site settings
 */
export async function updateSiteSettings(formData) {
  const { user, error: authError } = await requireAdmin()
  if (authError) return { data: null, error: authError }

  try {
    const supabase = createServiceClient()

    // Get all existing settings to check for duplicates
    const { data: allRows } = await supabase
      .from('site_settings')
      .select('*')

    console.log('All rows in site_settings:', allRows?.length)

    // If multiple rows exist, delete extras and keep only the first one
    if (allRows && allRows.length > 1) {
      const idsToDelete = allRows.slice(1).map(row => row.id)
      await supabase
        .from('site_settings')
        .delete()
        .in('id', idsToDelete)
      console.log('Deleted duplicate rows:', idsToDelete.length)
    }

    // Get the single row we'll work with
    const existing = allRows && allRows[0]

    // Prepare data - ensure we have all required fields
    const settingsData = {
      company_name: formData.get('company_name') || '',
      company_address: formData.get('company_address') || '',
      phone_number: formData.get('phone_number') || '',
      line_id: formData.get('line_id') || '',
      facebook_url: formData.get('facebook_url') || '',
      instagram_url: formData.get('instagram_url') || '',
      tiktok_url: formData.get('tiktok_url') || '',
      line_url: formData.get('line_url') || '',
      copyright_text: formData.get('copyright_text') || '',
      stat_branches: formData.get('stat_branches') || '',
      stat_products: formData.get('stat_products') || '',
      stat_customers: formData.get('stat_customers') || '',
    }

    // Handle banner image uploads
    for (const key of BANNER_KEYS) {
      const file = formData.get(key)
      if (file && file.size > 0) {
        const ext = file.name.split('.').pop() || 'webp'
        const storagePath = `site/${key}.${ext}`
        const { error: uploadError } = await uploadFile('banners', file, storagePath)
        if (!uploadError) {
          settingsData[`${key}_url`] = getPublicUrl('banners', storagePath)
        }
      } else {
        // Preserve existing URL if no new file uploaded
        const existingUrl = formData.get(`${key}_url`)
        if (existingUrl) {
          settingsData[`${key}_url`] = existingUrl
        }
      }
    }

    let data, error

    if (existing) {
      // Update existing row
      const result = await supabase
        .from('site_settings')
        .update(settingsData)
        .eq('id', existing.id)
        .select()
        .limit(1)

      data = result.data?.[0]
      error = result.error
      console.log('Update result:', { success: !error, rowId: existing.id })
    } else {
      // Insert new row if none exists
      const result = await supabase
        .from('site_settings')
        .insert(settingsData)
        .select()
        .limit(1)

      data = result.data?.[0]
      error = result.error
      console.log('Insert result:', { success: !error })
    }

    if (error) {
      console.error('Error saving site settings:', error)
      return { data: null, error: error.message }
    }

    // Check if data was actually returned (RLS might have blocked it)
    if (!data) {
      console.error('⚠️ UPDATE/INSERT returned no data - likely RLS policy blocking')
      return {
        data: null,
        error: 'Permission denied. Please check RLS policies and user role.'
      }
    }

    console.log('✅ Successfully saved:', data)

    revalidatePath('/admin/site-settings')
    revalidatePath('/', 'layout') // Revalidate all pages since footer/header is everywhere

    return { data, error: null }
  } catch (err) {
    console.error('Unexpected error:', err)
    return { data: null, error: err.message }
  }
}
