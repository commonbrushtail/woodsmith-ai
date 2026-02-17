# Supabase Custom HTTP SMS Provider Setup

This document covers the one-time Supabase dashboard configuration required to wire the custom HTTP SMS provider to the `/api/sms/send` route.

## Step 1: Enable the Phone Provider

1. Open your Supabase project dashboard.
2. Go to **Authentication** > **Providers** > **Phone**.
3. Toggle **Enable Phone Provider** to ON.

## Step 2: Select Custom HTTP as the SMS Provider

In the Phone provider settings, find the **SMS Provider** dropdown and select **Custom HTTP**.

## Step 3: Configure the Custom HTTP Provider

### URL field

Set the URL to your deployed API route:

```
https://woodsmith.vercel.app/api/sms/send
```

For local development (requires a tunnel such as ngrok, since Supabase cloud must be able to reach your machine):

```
http://localhost:3000/api/sms/send
```

Replace the domain with the actual deployment URL before going to production.

### Secret field

```
woodsmith-sms-2024
```

This value must match the `SMS_WEBHOOK_SECRET` environment variable in `.env.local`. Supabase will send it as an `Authorization: Bearer <secret>` header with every request to your route.

## Step 4: OTP Settings

| Setting | Value | Notes |
|---------|-------|-------|
| OTP Expiry | `179` | Matches the 179-second countdown in LoginModal |
| OTP Length | `6` | Six-digit OTP |

## How Supabase Calls the Route

When a user requests an OTP, Supabase sends a POST request to your URL:

```
POST /api/sms/send
Authorization: Bearer woodsmith-sms-2024
Content-Type: application/json

{
  "phone": "+66812345678",
  "otp": "123456"
}
```

The route at `src/app/api/sms/send/route.js` validates the bearer token, converts the `+66` prefix back to a `0`-prefix Thai mobile number, and forwards the OTP to SMSKUB.

## Required Environment Variables

These values must be set in `.env.local` (and in the Vercel project environment variables for production).

| Variable | Value | Where to find it |
|----------|-------|-----------------|
| `SMSKUB_BASE_URL` | `https://console.sms-kub.com` | Fixed — SMSKUB API base URL |
| `SMSKUB_TOKEN` | `<your token>` | SMSKUB dashboard > API Keys |
| `SMSKUB_SENDER` | `SMS-DEMO` | SMSKUB dashboard — use your approved sender name |
| `SMS_WEBHOOK_SECRET` | `woodsmith-sms-2024` | Must match the **Secret field** configured above in Supabase |

## Verification Checklist

- [ ] Phone provider toggled ON in Supabase dashboard
- [ ] SMS Provider set to "Custom HTTP"
- [ ] URL points to the correct deployment (production URL for live, ngrok URL for local testing)
- [ ] Secret field value matches `SMS_WEBHOOK_SECRET` in `.env.local`
- [ ] OTP Expiry set to `179`
- [ ] OTP Length set to `6`
- [ ] All four env vars set in Vercel project settings
