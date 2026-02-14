import { NextResponse } from 'next/server'
import { LINE_CONFIG } from '@/lib/auth/line-config'
import { createClient } from '@/lib/supabase/server'

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
        client_id: process.env.LINE_CHANNEL_ID,
        client_secret: process.env.LINE_CHANNEL_SECRET,
      }),
    })

    if (!tokenResponse.ok) {
      console.error('LINE token exchange failed:', await tokenResponse.text())
      return NextResponse.redirect(`${origin}/?auth_error=line_token_failed`)
    }

    const tokens = await tokenResponse.json()

    // Get LINE user profile
    const profileResponse = await fetch(LINE_CONFIG.profileUrl, {
      headers: { Authorization: `Bearer ${tokens.access_token}` },
    })

    if (!profileResponse.ok) {
      console.error('LINE profile fetch failed:', await profileResponse.text())
      return NextResponse.redirect(`${origin}/?auth_error=line_profile_failed`)
    }

    const profile = await profileResponse.json()

    // Sign in or link via Supabase
    // Use the LINE userId as a unique identifier
    const supabase = await createClient()

    // Try to find existing user by LINE ID in metadata
    // For now, we store the LINE profile data for the application to use
    // The full LINE-to-Supabase user linking requires Supabase custom OIDC
    // provider configuration in the dashboard, which maps LINE users
    // to Supabase auth users automatically.
    //
    // Until LINE is configured as a Supabase OIDC provider:
    // Store LINE profile in a cookie/session for the app to process
    const lineProfile = {
      lineUserId: profile.userId,
      displayName: profile.displayName,
      pictureUrl: profile.pictureUrl || null,
    }

    // Redirect to homepage with LINE profile data
    // The app can process this to create/link the customer account
    const encodedProfile = encodeURIComponent(JSON.stringify(lineProfile))
    return NextResponse.redirect(`${origin}/?line_login=${encodedProfile}`)
  } catch (err) {
    console.error('LINE callback error:', err)
    return NextResponse.redirect(`${origin}/?auth_error=line_error`)
  }
}
