import { NextResponse } from 'next/server'
import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'

/**
 * Handle the password reset callback.
 *
 * Supports two flows:
 * 1. token_hash + type (custom Resend email flow — customer forgot-password)
 * 2. code (Supabase PKCE flow — admin forgot-password)
 */
export async function GET(request) {
  const { searchParams, origin } = new URL(request.url)
  const tokenHash = searchParams.get('token_hash')
  const type = searchParams.get('type')
  const code = searchParams.get('code')

  const cookieStore = await cookies()
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll()
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value, options }) =>
            cookieStore.set(name, value, options)
          )
        },
      },
    }
  )

  // Flow 1: token_hash from our custom Resend email
  if (tokenHash && type === 'recovery') {
    const { data, error } = await supabase.auth.verifyOtp({
      token_hash: tokenHash,
      type: 'recovery',
    })

    if (!error) {
      const role = data?.user?.user_metadata?.role
      if (role === 'admin' || role === 'editor') {
        return NextResponse.redirect(`${origin}/admin/login/set-new-password`)
      }
      return NextResponse.redirect(`${origin}/login/set-new-password`)
    }
  }

  // Flow 2: code from Supabase PKCE flow (admin forgot-password via Supabase email)
  if (code) {
    const { data, error } = await supabase.auth.exchangeCodeForSession(code)
    if (!error) {
      const role = data?.user?.user_metadata?.role
      if (role === 'admin' || role === 'editor') {
        return NextResponse.redirect(`${origin}/admin/login/set-new-password`)
      }
      return NextResponse.redirect(`${origin}/login/set-new-password`)
    }
  }

  // Invalid or missing params — redirect to login with error
  return NextResponse.redirect(`${origin}/login?error=invalid_link`)
}
