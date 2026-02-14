/**
 * LINE Login OIDC configuration.
 *
 * Required env vars:
 *   LINE_CHANNEL_ID     — LINE Login Channel ID
 *   LINE_CHANNEL_SECRET — LINE Login Channel Secret
 *   NEXT_PUBLIC_SITE_URL — Site base URL for redirect
 */

export const LINE_CONFIG = {
  authorizationUrl: 'https://access.line.me/oauth2/v2.1/authorize',
  tokenUrl: 'https://api.line.me/oauth2/v2.1/token',
  profileUrl: 'https://api.line.me/v2/profile',
}

/**
 * Build the LINE Login authorization URL.
 * @param {string} state — CSRF state parameter
 * @returns {string} Full authorization URL
 */
export function getLineLoginUrl(state) {
  const channelId = process.env.LINE_CHANNEL_ID
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'
  const redirectUri = `${siteUrl}/auth/callback/line`

  const params = new URLSearchParams({
    response_type: 'code',
    client_id: channelId,
    redirect_uri: redirectUri,
    state,
    scope: 'openid profile',
  })

  return `${LINE_CONFIG.authorizationUrl}?${params.toString()}`
}

/**
 * Validate LINE OAuth callback parameters.
 * @param {{ code?: string, state?: string }} params
 * @returns {{ code: string, state: string }}
 * @throws {Error} If code or state is missing
 */
export function validateLineCallback(params) {
  const { code, state } = params || {}

  if (!code) {
    throw new Error('Missing authorization code from LINE callback')
  }
  if (!state) {
    throw new Error('Missing state parameter from LINE callback')
  }

  return { code, state }
}
