/**
 * Custom SMS webhook for Supabase phone auth.
 *
 * Supabase POSTs here when a phone OTP needs to be sent.
 * We forward it to SMSKUB's messages endpoint.
 *
 * Supabase dashboard setup:
 *   Auth → Providers → Phone → SMS Provider → Custom HTTP
 *   URL: https://yourdomain.com/api/sms/send
 *   Secret: (value of SMS_WEBHOOK_SECRET env var)
 *
 * Required env vars:
 *   SMSKUB_BASE_URL       https://console.sms-kub.com
 *   SMSKUB_TOKEN          API token from SMSKUB console
 *   SMSKUB_SENDER         Sender name (e.g. SMS-DEMO or your approved sender)
 *   SMS_WEBHOOK_SECRET    Any random secret — paste the same value in Supabase dashboard
 */
export async function POST(request) {
  try {
    // Verify request is from Supabase using the shared secret
    const authHeader = request.headers.get('authorization')
    const expectedSecret = process.env.SMS_WEBHOOK_SECRET
    if (expectedSecret && authHeader !== `Bearer ${expectedSecret}`) {
      return Response.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const { phone, otp } = body

    if (!phone || !otp) {
      return Response.json({ error: 'Missing phone or otp' }, { status: 400 })
    }

    // Supabase sends +66XXXXXXXXX — SMSKUB expects 0XXXXXXXXX
    const thaiPhone = phone.startsWith('+66')
      ? '0' + phone.slice(3)
      : phone

    const message = `รหัส OTP WoodSmith ของคุณคือ ${otp} (หมดอายุใน 3 นาที)`

    const smskubRes = await fetch(
      `${process.env.SMSKUB_BASE_URL}/api/messages`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'key': process.env.SMSKUB_TOKEN,
        },
        body: JSON.stringify({
          to: [thaiPhone],
          from: process.env.SMSKUB_SENDER,
          message,
        }),
      }
    )

    const data = await smskubRes.json()

    if (data.code !== 200) {
      console.error('SMSKUB error:', data)
      return Response.json({ error: data.message || 'SMS send failed' }, { status: 500 })
    }

    return Response.json({ message: 'SMS sent' }, { status: 200 })
  } catch (err) {
    console.error('SMS webhook error:', err)
    return Response.json({ error: 'Internal error' }, { status: 500 })
  }
}
