'use server'

import { revalidatePath } from 'next/cache'
import { createServiceClient } from '@/lib/supabase/admin'

/**
 * List quotations with pagination and optional status filter.
 */
export async function getQuotations({ page = 1, perPage = 10, status = '', search = '' } = {}) {
  const supabase = createServiceClient()
  const from = (page - 1) * perPage
  const to = from + perPage - 1

  let query = supabase
    .from('quotations')
    .select('*, product:products(code, name)', { count: 'exact' })
    .order('created_at', { ascending: false })
    .range(from, to)

  if (status) {
    query = query.eq('status', status)
  }

  if (search) {
    query = query.or(`quotation_number.ilike.%${search}%,requester_name.ilike.%${search}%`)
  }

  const { data, error, count } = await query

  if (error) {
    return { data: [], count: 0, error: error.message }
  }

  return { data: data || [], count: count || 0, error: null }
}

/**
 * Get a single quotation by ID with product details.
 */
export async function getQuotation(id) {
  const supabase = createServiceClient()
  const { data, error } = await supabase
    .from('quotations')
    .select('*, product:products(code, name)')
    .eq('id', id)
    .single()

  if (error) {
    return { data: null, error: error.message }
  }

  return { data, error: null }
}

/**
 * Update quotation status.
 */
export async function updateQuotationStatus(id, status) {
  const supabase = createServiceClient()
  const { error } = await supabase
    .from('quotations')
    .update({ status })
    .eq('id', id)

  if (error) {
    return { error: error.message }
  }

  revalidatePath('/admin/quotations')
  revalidatePath(`/admin/quotations/${id}`)
  return { error: null }
}

/**
 * Add/update admin notes on a quotation.
 */
export async function updateAdminNotes(id, notes) {
  const supabase = createServiceClient()
  const { error } = await supabase
    .from('quotations')
    .update({ admin_notes: notes })
    .eq('id', id)

  if (error) {
    return { error: error.message }
  }

  revalidatePath(`/admin/quotations/${id}`)
  return { error: null }
}

/**
 * Delete a quotation.
 */
export async function deleteQuotation(id) {
  const supabase = createServiceClient()
  const { error } = await supabase
    .from('quotations')
    .delete()
    .eq('id', id)

  if (error) {
    return { error: error.message }
  }

  revalidatePath('/admin/quotations')
  return { error: null }
}
