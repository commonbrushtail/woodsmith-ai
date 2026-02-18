import { describe, it, expect, vi, beforeEach } from 'vitest'

// Track the mock send function via the Resend constructor
let mockSend

vi.mock('resend', () => ({
  Resend: vi.fn(function () {
    mockSend = vi.fn().mockResolvedValue({ data: { id: 'test-id' }, error: null })
    this.emails = { send: mockSend }
  }),
}))

describe('sendEmail', () => {
  beforeEach(() => {
    vi.resetModules()
    mockSend = null
    vi.stubEnv('RESEND_API_KEY', 'test-key')
    vi.stubEnv('RESEND_FROM_EMAIL', 'Test <test@test.com>')
  })

  it('sends email via Resend', async () => {
    const { sendEmail } = await import('@/lib/email')
    await sendEmail({
      to: 'user@example.com',
      subject: 'Test',
      html: '<p>Hello</p>',
    })
    expect(mockSend).toHaveBeenCalledWith(
      expect.objectContaining({
        from: 'Test <test@test.com>',
        to: ['user@example.com'],
        subject: 'Test',
        html: '<p>Hello</p>',
      })
    )
  })

  it('wraps single email in array', async () => {
    const { sendEmail } = await import('@/lib/email')
    await sendEmail({
      to: 'single@example.com',
      subject: 'Test',
      html: '<p>Hi</p>',
    })
    expect(mockSend).toHaveBeenCalledWith(
      expect.objectContaining({ to: ['single@example.com'] })
    )
  })

  it('passes array of emails as-is', async () => {
    const { sendEmail } = await import('@/lib/email')
    await sendEmail({
      to: ['a@example.com', 'b@example.com'],
      subject: 'Test',
      html: '<p>Hi</p>',
    })
    expect(mockSend).toHaveBeenCalledWith(
      expect.objectContaining({ to: ['a@example.com', 'b@example.com'] })
    )
  })

  it('does not throw on Resend API error', async () => {
    const { sendEmail } = await import('@/lib/email')
    // First call initializes the client, then override mock
    await sendEmail({ to: 'x@x.com', subject: 'init', html: '' })
    mockSend.mockResolvedValue({ data: null, error: { message: 'API error' } })
    await expect(
      sendEmail({ to: 'user@example.com', subject: 'Test', html: '<p>Hi</p>' })
    ).resolves.not.toThrow()
  })

  it('does not throw on send exception', async () => {
    const { sendEmail } = await import('@/lib/email')
    await sendEmail({ to: 'x@x.com', subject: 'init', html: '' })
    mockSend.mockRejectedValue(new Error('Network error'))
    await expect(
      sendEmail({ to: 'user@example.com', subject: 'Test', html: '<p>Hi</p>' })
    ).resolves.not.toThrow()
  })

  it('does not send when RESEND_API_KEY is missing', async () => {
    vi.stubEnv('RESEND_API_KEY', '')
    const { sendEmail } = await import('@/lib/email')
    await sendEmail({ to: 'user@example.com', subject: 'Test', html: '<p>Hi</p>' })
    expect(mockSend).toBeNull()
  })

  it('uses default from email when RESEND_FROM_EMAIL is not set', async () => {
    vi.stubEnv('RESEND_FROM_EMAIL', '')
    const { sendEmail } = await import('@/lib/email')
    await sendEmail({
      to: 'user@example.com',
      subject: 'Test',
      html: '<p>Hi</p>',
    })
    expect(mockSend).toHaveBeenCalledWith(
      expect.objectContaining({ from: 'WoodSmith <onboarding@resend.dev>' })
    )
  })
})
