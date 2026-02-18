import { Resend } from 'resend'

/**
 * Lazily initialized Resend client singleton.
 * Only created when first email is sent (avoids errors if RESEND_API_KEY is not set).
 */
let resendClient = null

function getResendClient() {
  if (!resendClient) {
    const apiKey = process.env.RESEND_API_KEY
    if (!apiKey) {
      console.warn('RESEND_API_KEY not configured — emails will not be sent')
      return null
    }
    resendClient = new Resend(apiKey)
  }
  return resendClient
}

/**
 * Send an email via Resend. Fire-and-forget — never throws.
 *
 * @param {{ to: string|string[], subject: string, html: string }} params
 */
export async function sendEmail({ to, subject, html }) {
  try {
    const client = getResendClient()
    if (!client) return

    const from = process.env.RESEND_FROM_EMAIL || 'WoodSmith <onboarding@resend.dev>'

    const { error } = await client.emails.send({
      from,
      to: Array.isArray(to) ? to : [to],
      subject,
      html,
    })

    if (error) {
      console.error('Resend email error:', error)
    }
  } catch (err) {
    console.error('Resend email exception:', err)
  }
}
