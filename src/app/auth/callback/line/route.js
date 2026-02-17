import { NextResponse } from 'next/server'
import { LINE_CONFIG } from '@/lib/auth/line-config'

/**
 * Handle LINE Login OAuth callback.
 *
 * Flow:
 * 1. LINE redirects here with ?code=...&state=...
 * 2. Exchange code for LINE access token + ID token
 * 3. Get LINE user profile
 * 4. Sign in or create user in Supabase via admin API
 */
export async function GET(request) {
  const { searchParams, origin } = new URL(request.url)
  const code = searchParams.get('code')
  const state = searchParams.get('state')
  const error = searchParams.get('error')

  // LINE returned an error (e.g. user denied consent)
  if (error) {
    return NextResponse.redirect(`${origin}/?auth_error=line_denied`)
  }

  if (!code || !state) {
    return NextResponse.redirect(`${origin}/?auth_error=missing_params`)
  }

  try {
    // Exchange authorization code for tokens
    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || origin
    const tokenResponse = await fetch(LINE_CONFIG.tokenUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({
        grant_type: 'authorization_code',
        code,
        redirect_uri: `${siteUrl}/auth/callback/line`,
        client_id: process.env.NEXT_PUBLIC_LINE_LOGIN_CHANNEL_ID,
        client_secret: process.env.LINE_LOGIN_CHANNEL_SECRET,
      }),
    })

    if (!tokenResponse.ok) {
      console.error('LINE token exchange failed:', await tokenResponse.text())
      return NextResponse.redirect(`${origin}/?auth_error=line_token_failed`)
    }

    const tokens = await tokenResponse.json()

    // Extract email from LINE ID token (email claim is in JWT payload)
    let lineRealEmail = null
    if (tokens.id_token) {
      try {
        const payload = JSON.parse(atob(tokens.id_token.split('.')[1]))
        if (payload.email) {
          lineRealEmail = payload.email
        }
      } catch (e) {
        // ID token decode failed — not fatal, email field will remain as fallback
        console.error('Failed to decode LINE ID token:', e.message)
      }
    }

    // Get LINE user profile
    const profileResponse = await fetch(LINE_CONFIG.profileUrl, {
      headers: { Authorization: `Bearer ${tokens.access_token}` },
    })

    if (!profileResponse.ok) {
      console.error('LINE profile fetch failed:', await profileResponse.text())
      return NextResponse.redirect(`${origin}/?auth_error=line_profile_failed`)
    }

    const profile = await profileResponse.json()

    // Create or find Supabase user via admin API
    const { createServiceClient } = await import('@/lib/supabase/admin')
    const { createServerClient } = await import('@supabase/ssr')
    const { cookies } = await import('next/headers')

    const admin = createServiceClient()

    // Use deterministic email pattern for LINE users
    const lineEmail = `line_${profile.userId}@line.placeholder`

    // Find existing user by LINE user ID in app_metadata
    const { data: existingUsers } = await admin.auth.admin.listUsers()
    // Note: do NOT check app_metadata.provider — Supabase resets it to 'email'
    // after magic link verifyOtp, overwriting our 'line' value. Use line_user_id only.
    const existingUser = existingUsers?.users?.find(
      u => u.app_metadata?.line_user_id === profile.userId
    )

    let supabaseUser
    let isNewUser = false

    if (existingUser) {
      // If LINE provides a real email and the stored email is still the placeholder, update it
      const emailUpdate = (lineRealEmail && existingUser.email?.endsWith('@line.placeholder'))
        ? { email: lineRealEmail, email_confirm: true }
        : {}

      // Update existing user's metadata with latest LINE profile
      const { data: updatedUser, error: updateError } = await admin.auth.admin.updateUserById(
        existingUser.id,
        {
          ...emailUpdate,
          user_metadata: {
            display_name: profile.displayName,
            picture_url: profile.pictureUrl || null,
            line_user_id: profile.userId,
            role: existingUser.user_metadata?.role || 'customer',
          },
        }
      )

      if (updateError) {
        console.error('Failed to update LINE user metadata:', updateError)
        return NextResponse.redirect(`${origin}/?auth_error=line_session_failed`)
      }

      supabaseUser = updatedUser.user

      // Backfill email in user_profiles if LINE provides one and profile has none
      if (lineRealEmail) {
        await admin.from('user_profiles')
          .update({ email: lineRealEmail })
          .eq('user_id', existingUser.id)
          .is('email', null)
      }
    } else {
      // Create new Supabase user — use real email from LINE ID token if available
      const { data: newUser, error: createError } = await admin.auth.admin.createUser({
        email: lineRealEmail || lineEmail,
        email_confirm: true, // Skip email verification
        app_metadata: { provider: 'line', line_user_id: profile.userId },
        user_metadata: {
          display_name: profile.displayName,
          picture_url: profile.pictureUrl || null,
          line_user_id: profile.userId,
          role: 'customer',
        },
      })

      if (createError) {
        console.error('Failed to create LINE user:', createError)
        return NextResponse.redirect(`${origin}/?auth_error=line_session_failed`)
      }

      supabaseUser = newUser.user
      isNewUser = true

      // Create user_profiles row for new LINE user
      const { error: profileError } = await admin.from('user_profiles').upsert({
        user_id: supabaseUser.id,
        display_name: profile.displayName,
        phone: null,
        role: 'customer',
        auth_provider: 'line',
        avatar_url: profile.pictureUrl || null,
        email: lineRealEmail,
      }, { onConflict: 'user_id' })

      if (profileError) {
        console.error('Failed to create user_profiles row:', profileError)
        // Don't fail the login, profile can be created later
      }
    }

    // Generate magic link token for session establishment
    // Use supabaseUser.email — may be real email if LINE provided it, else placeholder
    const { data: linkData, error: linkError } = await admin.auth.admin.generateLink({
      type: 'magiclink',
      email: supabaseUser.email,
    })

    if (linkError || !linkData?.properties?.hashed_token) {
      console.error('Failed to generate magic link:', linkError)
      return NextResponse.redirect(`${origin}/?auth_error=line_session_failed`)
    }

    // Create cookie-aware Supabase client to establish session
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

    // Verify OTP to establish session and set cookies
    const { error: verifyError } = await supabase.auth.verifyOtp({
      token_hash: linkData.properties.hashed_token,
      type: 'magiclink',
    })

    if (verifyError) {
      console.error('Failed to verify magic link:', verifyError)
      return NextResponse.redirect(`${origin}/?auth_error=line_session_failed`)
    }

    // Redirect: users with incomplete profile go to completion form, others go to homepage
    if (isNewUser) {
      return NextResponse.redirect(`${origin}/register/line`)
    }

    // Returning users: check if their profile is complete
    const { data: existingProfile } = await admin
      .from('user_profiles')
      .select('profile_complete')
      .eq('user_id', supabaseUser.id)
      .single()

    if (!existingProfile?.profile_complete) {
      return NextResponse.redirect(`${origin}/register/line`)
    }

    return NextResponse.redirect(`${origin}/`)
  } catch (err) {
    console.error('LINE callback error:', err)
    return NextResponse.redirect(`${origin}/?auth_error=line_error`)
  }
}
