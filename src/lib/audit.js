import { createServiceClient } from '@/lib/supabase/admin'

/**
 * Build a structured audit log entry.
 *
 * @param {{ userId: string, action: string, targetId?: string, details?: object, ip?: string }} params
 * @returns {{ user_id: string, action: string, target_id: string|null, details: object|null, ip_address: string|null, created_at: string }}
 */
export function buildAuditEntry({ userId, action, targetId, details, ip }) {
  return {
    user_id: userId,
    action,
    target_id: targetId ?? null,
    details: details ?? null,
    ip_address: ip ?? null,
    created_at: new Date().toISOString(),
  }
}

/**
 * Log an audit event to the audit_logs table.
 * Fire-and-forget — does not throw on error to avoid disrupting the main action.
 *
 * @param {{ userId: string, action: string, targetId?: string, details?: object, ip?: string }} params
 */
export async function logAudit(params) {
  try {
    const entry = buildAuditEntry(params)
    const supabase = createServiceClient()
    const { error } = supabase.from('audit_logs').insert(entry)

    if (error) {
      console.error('Audit log error:', error.message)
    }
  } catch (err) {
    console.error('Audit log exception:', err)
  }
}
