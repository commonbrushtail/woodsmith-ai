import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'

// Mock next/headers
vi.mock('next/headers', () => ({
  cookies: vi.fn(() => ({
    getAll: () => [],
    set: vi.fn(),
  })),
}))

const mockResetPasswordForEmail = vi.fn()
const mockUpdateUser = vi.fn()

// Mock Supabase server client
vi.mock('@/lib/supabase/server', () => ({
  createClient: vi.fn(() =>
    Promise.resolve({
      auth: {
        resetPasswordForEmail: mockResetPasswordForEmail,
        updateUser: mockUpdateUser,
      },
    })
  ),
}))

// requestPasswordReset generates a recovery link via the admin API (bypassing
// Supabase's built-in email) and sends it through Resend.
const { mockGenerateLink } = vi.hoisted(() => ({ mockGenerateLink: vi.fn() }))
vi.mock('@/lib/supabase/admin', () => ({
  createServiceClient: () => ({ auth: { admin: { generateLink: mockGenerateLink } } }),
}))

describe('requestPasswordReset', () => {
  // Captured at collection time, before any test mutates it.
  const savedRecaptcha = process.env.RECAPTCHA_SECRET_KEY

  beforeEach(() => {
    vi.clearAllMocks()
    // Exercise the core generateLink + Resend flow in isolation by skipping the
    // reCAPTCHA branch (which otherwise depends on whether .env.local is loaded).
    delete process.env.RECAPTCHA_SECRET_KEY
    mockGenerateLink.mockResolvedValue({
      data: { properties: { hashed_token: 'tok123' } },
      error: null,
    })
    // Stub the Resend HTTP call so no network request is made.
    vi.stubGlobal('fetch', vi.fn(async () => ({ ok: true, text: async () => '' })))
  })

  afterEach(() => {
    vi.unstubAllGlobals()
    if (savedRecaptcha === undefined) delete process.env.RECAPTCHA_SECRET_KEY
    else process.env.RECAPTCHA_SECRET_KEY = savedRecaptcha
  })

  it('returns error for empty email', async () => {
    const { requestPasswordReset } = await import('@/lib/actions/auth')
    const result = await requestPasswordReset('')
    expect(result.error).toBeTruthy()
    expect(mockGenerateLink).not.toHaveBeenCalled()
  })

  it('returns error for invalid email format', async () => {
    const { requestPasswordReset } = await import('@/lib/actions/auth')
    const result = await requestPasswordReset('not-an-email')
    expect(result.error).toBeTruthy()
    expect(mockGenerateLink).not.toHaveBeenCalled()
  })

  it('generates a recovery link and sends the email for a valid email', async () => {
    const { requestPasswordReset } = await import('@/lib/actions/auth')
    const result = await requestPasswordReset('admin@woodsmith.co.th')
    expect(result.error).toBeNull()
    expect(mockGenerateLink).toHaveBeenCalledWith({ type: 'recovery', email: 'admin@woodsmith.co.th' })
    expect(fetch).toHaveBeenCalledWith('https://api.resend.com/emails', expect.objectContaining({ method: 'POST' }))
  })

  it('returns an error when the reset email fails to send', async () => {
    vi.stubGlobal('fetch', vi.fn(async () => ({ ok: false, text: async () => 'boom' })))
    const { requestPasswordReset } = await import('@/lib/actions/auth')
    const result = await requestPasswordReset('admin@woodsmith.co.th')
    expect(result.error).toBeTruthy()
  })

  it('does not reveal whether the email exists when link generation fails', async () => {
    mockGenerateLink.mockResolvedValue({ data: null, error: { message: 'not found' } })
    const { requestPasswordReset } = await import('@/lib/actions/auth')
    const result = await requestPasswordReset('unknown@test.com')
    expect(result.error).toBeNull()
  })

  it('requires a captcha token when reCAPTCHA is configured', async () => {
    process.env.RECAPTCHA_SECRET_KEY = 'test-secret'
    const { requestPasswordReset } = await import('@/lib/actions/auth')
    const result = await requestPasswordReset('admin@woodsmith.co.th')
    expect(result.error).toBe('กรุณายืนยันว่าคุณไม่ใช่หุ่นยนต์')
    expect(mockGenerateLink).not.toHaveBeenCalled()
  })
})

describe('updatePassword', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    mockUpdateUser.mockResolvedValue({ data: { user: {} }, error: null })
  })

  it('returns error for empty password', async () => {
    const { updatePassword } = await import('@/lib/actions/auth')
    const result = await updatePassword('')
    expect(result.error).toBeTruthy()
    expect(mockUpdateUser).not.toHaveBeenCalled()
  })

  it('returns error for password shorter than 8 characters', async () => {
    const { updatePassword } = await import('@/lib/actions/auth')
    const result = await updatePassword('short')
    expect(result.error).toBeTruthy()
    expect(mockUpdateUser).not.toHaveBeenCalled()
  })

  it('calls updateUser with new password for valid input', async () => {
    const { updatePassword } = await import('@/lib/actions/auth')
    const result = await updatePassword('newSecurePassword123')
    expect(result.error).toBeNull()
    expect(mockUpdateUser).toHaveBeenCalledWith({ password: 'newSecurePassword123' })
  })

  it('returns error when Supabase returns an error', async () => {
    mockUpdateUser.mockResolvedValue({
      data: null,
      error: { message: 'Session expired' },
    })
    const { updatePassword } = await import('@/lib/actions/auth')
    const result = await updatePassword('newSecurePassword123')
    expect(result.error).toBeTruthy()
  })
})
