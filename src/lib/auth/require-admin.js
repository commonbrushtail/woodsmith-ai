import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'

const ADMIN_ROLES = ['admin', 'editor']

/**
 * Verify the current user is an authenticated admin or editor.
 * For use in server actions. Returns { user, error } without throwing.
 *
 * @returns {Promise<{user: object|null, error: string|null}>}
 */
export async function requireAdmin() {
  const supabase = await createClient()
  const { data: { user }, error: authError } = await supabase.auth.getUser()

  if (authError || !user) {
    return { user: null, error: 'ไม่ได้เข้าสู่ระบบ' }
  }

  const userRole = user.user_metadata?.role
  if (!userRole || !ADMIN_ROLES.includes(userRole)) {
    return { user: null, error: 'ไม่มีสิทธิ์เข้าถึง' }
  }

  return { user, error: null }
}

/**
 * Verify the current user is an authenticated admin or editor.
 * For use in server components (layouts/pages). Redirects to /login if unauthorized.
 *
 * @returns {Promise<object>} The authenticated admin user
 */
export async function requireAdminOrRedirect() {
  const supabase = await createClient()
  const { data: { user }, error: authError } = await supabase.auth.getUser()

  if (authError || !user) {
    redirect('/login')
  }

  const userRole = user.user_metadata?.role
  if (!userRole || !ADMIN_ROLES.includes(userRole)) {
    redirect('/login')
  }

  return user
}
