'use server'

import { revalidatePath } from 'next/cache'
import { createServiceClient } from '@/lib/supabase/admin'
import { createClient } from '@/lib/supabase/server'
import { quotationDeclineSchema } from '@/lib/validations/quotations'
import { logAudit } from '@/lib/audit'
import { requireAdmin } from '@/lib/auth/require-admin'
import { sendEmail } from '@/lib/email'
import { quotationDeclined, quotationQuote } from '@/lib/email-templates'
import { uploadFile, getSignedUrl } from '@/lib/storage'

const QUOTE_FILE_TYPES = ['application/pdf', 'image/jpeg', 'image/png', 'image/webp']
const QUOTE_FILE_MAX = 10 * 1024 * 1024 // 10MB

/**
 * List quotations with pagination and optional status filter.
 */
export async function getQuotations({ page = 1, perPage = 10, status = '', search = '' } = {}) {
  const { user, error: authError } = await requireAdmin()
  if (authError) return { data: [], count: 0, error: authError }

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
  const { user, error: authError } = await requireAdmin()
  if (authError) return { data: null, error: authError }

  const supabase = createServiceClient()
  const { data, error } = await supabase
    .from('quotations')
    .select('*, product:products(code, name, product_images(url, is_primary, sort_order))')
    .eq('id', id)
    .single()

  if (error) {
    return { data: null, error: error.message }
  }

  // Signed URL so the admin can view the attached quote file (private bucket).
  if (data?.quote_file_path) {
    data.quote_file_signed_url = await getSignedUrl('quotations', data.quote_file_path)
  }

  return { data, error: null }
}

/**
 * Decline a quotation request (terminal action). Sets status to 'rejected',
 * records an optional reason, and emails the customer once. This is the only
 * action that rejects — there is no standalone status control anymore.
 */
export async function declineQuotation(id, reason) {
  const { user, error: authError } = await requireAdmin()
  if (authError) return { error: authError }

  const parsed = quotationDeclineSchema.safeParse({ reason })
  if (!parsed.success) {
    return { error: 'เหตุผลในการปฏิเสธยาวเกินไป' }
  }
  const declineReason = parsed.data.reason || null

  const supabase = createServiceClient()
  const { error } = await supabase
    .from('quotations')
    .update({
      status: 'rejected',
      decline_reason: declineReason,
      declined_at: new Date().toISOString(),
    })
    .eq('id', id)

  if (error) {
    return { error: error.message }
  }

  logAudit({ userId: user?.id, action: 'quotation.declined', targetId: id, details: { hasReason: !!declineReason } })

  // Fire-and-forget: notify the customer that the request was declined.
  const { data: quotation } = await supabase
    .from('quotations')
    .select('quotation_number, requester_name, requester_email')
    .eq('id', id)
    .single()

  if (quotation?.requester_email) {
    const { subject, html } = quotationDeclined({
      quotationNumber: quotation.quotation_number,
      requesterName: quotation.requester_name,
      reason: declineReason,
    })
    sendEmail({ to: quotation.requester_email, subject, html })
  }

  revalidatePath('/admin/quotations')
  revalidatePath(`/admin/quotations/${id}`)
  return { error: null }
}

/**
 * Send a quote response (price + customer-visible message) and email it to the
 * customer. Distinct from admin_notes (internal). Sending the quote is also the
 * act of responding/approving, so it marks the quotation 'approved' in the same
 * write and sends exactly one email (the quote).
 */
export async function sendQuotationResponse(id, formData) {
  const { user, error: authError } = await requireAdmin()
  if (authError) return { error: authError }

  const amountRaw = formData.get('amount')
  const message = (formData.get('message') || '').toString().trim()
  const file = formData.get('file')
  const hasFile = file && typeof file === 'object' && typeof file.size === 'number' && file.size > 0
  const hasAmount = amountRaw !== null && amountRaw !== '' && amountRaw !== undefined

  if (!hasAmount && !message && !hasFile) {
    return { error: 'กรุณาระบุราคา ข้อความ หรือแนบไฟล์ถึงลูกค้า' }
  }
  const quotedAmount = hasAmount ? Number(amountRaw) : null
  if (quotedAmount !== null && (Number.isNaN(quotedAmount) || quotedAmount < 0)) {
    return { error: 'ราคาไม่ถูกต้อง' }
  }

  const supabase = createServiceClient()

  // Upload the attachment if provided.
  const update = {
    quoted_amount: quotedAmount,
    quote_message: message || null,
    quoted_at: new Date().toISOString(),
    status: 'approved',
  }
  if (hasFile) {
    if (!QUOTE_FILE_TYPES.includes(file.type)) {
      return { error: 'รองรับเฉพาะไฟล์ PDF หรือรูปภาพ' }
    }
    if (file.size > QUOTE_FILE_MAX) {
      return { error: 'ไฟล์ใหญ่เกิน 10MB' }
    }
    const safeName = (file.name || 'quote').replace(/[^\w.\-]+/g, '_')
    const path = `${id}/quote-${safeName}`
    const { error: upErr } = await uploadFile('quotations', file, path)
    if (upErr) return { error: 'อัปโหลดไฟล์ไม่สำเร็จ' }
    update.quote_file_path = path
    update.quote_file_name = file.name || 'ใบเสนอราคา'
  }

  const { error } = await supabase.from('quotations').update(update).eq('id', id)
  if (error) return { error: error.message }

  logAudit({ userId: user?.id, action: 'quotation.quote_sent', targetId: id, details: { quotedAmount, hasFile, status: 'approved' } })

  // Fire-and-forget: email the quote (with download link) to the customer.
  const { data: quotation } = await supabase
    .from('quotations')
    .select('quotation_number, requester_name, requester_email, quote_file_path, quote_file_name')
    .eq('id', id)
    .single()

  if (quotation?.requester_email) {
    // 7-day signed URL for the email link (the account page generates fresh
    // short-lived URLs after that).
    const signedUrl = quotation.quote_file_path
      ? await getSignedUrl('quotations', quotation.quote_file_path, 60 * 60 * 24 * 7)
      : null
    const { subject, html } = quotationQuote({
      quotationNumber: quotation.quotation_number,
      requesterName: quotation.requester_name,
      quotedAmount,
      quoteMessage: message || null,
      fileUrl: signedUrl,
      fileName: quotation.quote_file_name,
    })
    sendEmail({ to: quotation.requester_email, subject, html })
  }

  revalidatePath('/admin/quotations')
  revalidatePath(`/admin/quotations/${id}`)
  return { error: null }
}

/**
 * Add/update admin notes on a quotation.
 */
export async function updateAdminNotes(id, notes) {
  const { user, error: authError } = await requireAdmin()
  if (authError) return { error: authError }

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
  const { user, error: authError } = await requireAdmin()
  if (authError) return { error: authError }

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
