'use server'

import { revalidatePath } from 'next/cache'
import { createServiceClient } from '@/lib/supabase/admin'

/**
 * Fetch all FAQs ordered by sort_order.
 */
export async function getFaqs({ page = 1, perPage = 50, search = '', sortAsc = true } = {}) {
  const supabase = createServiceClient()
  const from = (page - 1) * perPage
  const to = from + perPage - 1

  let query = supabase
    .from('faqs')
    .select('*', { count: 'exact' })
    .order('sort_order', { ascending: sortAsc })
    .range(from, to)

  if (search) {
    query = query.or(`question.ilike.%${search}%,answer.ilike.%${search}%`)
  }

  const { data, count, error } = await query

  if (error) {
    return { data: [], count: 0, error: error.message }
  }

  return { data: data || [], count: count || 0, error: null }
}

/**
 * Fetch a single FAQ by ID.
 */
export async function getFaq(id) {
  const supabase = createServiceClient()

  const { data, error } = await supabase
    .from('faqs')
    .select('*')
    .eq('id', id)
    .single()

  if (error) {
    return { data: null, error: error.message }
  }

  return { data, error: null }
}

/**
 * Create a new FAQ.
 */
export async function createFaq(formData) {
  const supabase = createServiceClient()

  const { data: existing } = await supabase
    .from('faqs')
    .select('sort_order')
    .order('sort_order', { ascending: false })
    .limit(1)

  const nextOrder = existing && existing.length > 0 ? existing[0].sort_order + 1 : 1

  const faqData = {
    question: formData.get('question') || '',
    answer: formData.get('answer') || '',
    published: formData.get('published') === 'true',
    sort_order: nextOrder,
  }

  const { data, error } = await supabase
    .from('faqs')
    .insert(faqData)
    .select()
    .single()

  if (error) {
    return { data: null, error: error.message }
  }

  revalidatePath('/admin/faq')
  return { data, error: null }
}

/**
 * Update a FAQ.
 */
export async function updateFaq(id, formData) {
  const supabase = createServiceClient()

  const updates = {}

  if (formData.has('question')) updates.question = formData.get('question')
  if (formData.has('answer')) updates.answer = formData.get('answer')
  if (formData.has('published')) updates.published = formData.get('published') === 'true'

  const { data, error } = await supabase
    .from('faqs')
    .update(updates)
    .eq('id', id)
    .select()
    .single()

  if (error) {
    return { data: null, error: error.message }
  }

  revalidatePath('/admin/faq')
  return { data, error: null }
}

/**
 * Delete a FAQ.
 */
export async function deleteFaq(id) {
  const supabase = createServiceClient()

  const { error } = await supabase
    .from('faqs')
    .delete()
    .eq('id', id)

  if (error) {
    return { error: error.message }
  }

  revalidatePath('/admin/faq')
  return { error: null }
}

/**
 * Toggle FAQ published status.
 */
export async function toggleFaqPublished(id, published) {
  const supabase = createServiceClient()

  const { error } = await supabase
    .from('faqs')
    .update({ published })
    .eq('id', id)

  if (error) {
    return { error: error.message }
  }

  revalidatePath('/admin/faq')
  return { error: null }
}
