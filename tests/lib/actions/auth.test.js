import { describe, it, expect, vi, beforeEach } from 'vitest'

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

describe('requestPasswordReset', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    mockResetPasswordForEmail.mockResolvedValue({ error: null })
  })

  it('returns error for empty email', async () => {
    const { requestPasswordReset } = await import('@/lib/actions/auth')
    const result = await requestPasswordReset('')
    expect(result.error).toBeTruthy()
    expect(mockResetPasswordForEmail).not.toHaveBeenCalled()
  })

  it('returns error for invalid email format', async () => {
    const { requestPasswordReset } = await import('@/lib/actions/auth')
    const result = await requestPasswordReset('not-an-email')
    expect(result.error).toBeTruthy()
    expect(mockResetPasswordForEmail).not.toHaveBeenCalled()
  })

  it('calls resetPasswordForEmail with redirect URL for valid email', async () => {
    const { requestPasswordReset } = await import('@/lib/actions/auth')
    const result = await requestPasswordReset('admin@woodsmith.co.th')
    expect(result.error).toBeNull()
    expect(mockResetPasswordForEmail).toHaveBeenCalledWith(
      'admin@woodsmith.co.th',
      expect.objectContaining({
        redirectTo: expect.stringContaining('/auth/reset-password'),
      })
    )
  })

  it('returns error when Supabase returns an error', async () => {
    mockResetPasswordForEmail.mockResolvedValue({
      error: { message: 'User not found' },
    })
    const { requestPasswordReset } = await import('@/lib/actions/auth')
    const result = await requestPasswordReset('unknown@test.com')
    expect(result.error).toBeTruthy()
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
