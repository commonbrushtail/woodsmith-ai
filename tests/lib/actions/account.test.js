import { describe, it, expect, vi, beforeEach } from 'vitest'

// --- Mocks ---

// Query chain is thenable — resolves when awaited (e.g. `await supabase.from(...).select(...)`)
function createQueryChain(finalResult = { data: null, error: null }) {
  const chain = {}
  const methods = ['select', 'insert', 'update', 'delete', 'eq', 'or', 'ilike', 'order', 'range', 'single', 'limit']
  for (const m of methods) {
    chain[m] = vi.fn(() => chain)
  }
  chain.then = (resolve) => resolve(finalResult)
  return chain
}

// Client mock is NOT thenable — safe to `await createClient()`
let mockQueryChain
let mockServerClient
let mockAdminQueryChain
let mockAdmin

vi.mock('@/lib/supabase/server', () => ({
  createClient: vi.fn(async () => mockServerClient),
}))
vi.mock('@/lib/supabase/admin', () => ({
  createServiceClient: vi.fn(() => mockAdmin),
}))

// account.sendPasswordResetEmail() delegates to auth.requestPasswordReset via a
// dynamic import; mock it so we don't exercise the real reCAPTCHA/Resend flow.
const { mockRequestPasswordReset } = vi.hoisted(() => ({ mockRequestPasswordReset: vi.fn() }))
vi.mock('@/lib/actions/auth', () => ({
  requestPasswordReset: (...args) => mockRequestPasswordReset(...args),
}))

function fakeFormData(obj) {
  const map = new Map(Object.entries(obj))
  return { get: (key) => (map.has(key) ? map.get(key) : null) }
}

beforeEach(() => {
  vi.clearAllMocks()

  mockQueryChain = createQueryChain()
  mockServerClient = {
    from: vi.fn(() => mockQueryChain),
    auth: {
      getUser: vi.fn().mockResolvedValue({
        data: { user: { id: 'u-1', email: 'admin@test.com', user_metadata: { display_name: 'Admin', role: 'admin' } } },
      }),
    },
  }

  mockAdminQueryChain = createQueryChain({ data: { display_name: 'Admin User', phone: '0812345678', role: 'admin' }, error: null })
  mockAdmin = {
    from: vi.fn(() => mockAdminQueryChain),
    auth: {
      admin: { updateUserById: vi.fn().mockResolvedValue({ error: null }) },
    },
  }
})

// --- Tests ---
describe('getAccountInfo', () => {
  it('returns merged account info from auth + profile', async () => {
    const { getAccountInfo } = await import('@/lib/actions/account')
    const result = await getAccountInfo()

    expect(result.error).toBeNull()
    expect(result.data.id).toBe('u-1')
    expect(result.data.email).toBe('admin@test.com')
    expect(result.data.displayName).toBe('Admin User')
    expect(result.data.phone).toBe('0812345678')
    expect(result.data.role).toBe('admin')
  })

  it('falls back to user_metadata when profile is null', async () => {
    mockAdminQueryChain = createQueryChain({ data: null, error: null })
    mockAdmin.from = vi.fn(() => mockAdminQueryChain)

    const { getAccountInfo } = await import('@/lib/actions/account')
    const result = await getAccountInfo()

    expect(result.data.displayName).toBe('Admin')
    expect(result.data.role).toBe('admin')
    expect(result.data.phone).toBe('')
  })

  it('returns error when not authenticated', async () => {
    mockServerClient.auth.getUser.mockResolvedValue({
      data: { user: null },
      error: { message: 'no session' },
    })

    const { getAccountInfo } = await import('@/lib/actions/account')
    const result = await getAccountInfo()

    expect(result.error).toBe('ไม่ได้เข้าสู่ระบบ')
    expect(result.data).toBeNull()
  })
})

// The old admin updatePassword/updateEmail forms were removed in the "account
// cleanup" refactor (commit 0d24ed7); the account page now offers a single
// "reset via email" action. Test that current export instead.
describe('sendPasswordResetEmail', () => {
  it('delegates to requestPasswordReset with the current user email', async () => {
    mockRequestPasswordReset.mockResolvedValue({ error: null })

    const { sendPasswordResetEmail } = await import('@/lib/actions/account')
    const result = await sendPasswordResetEmail()

    expect(mockRequestPasswordReset).toHaveBeenCalledWith('admin@test.com')
    expect(result.error).toBeNull()
  })

  it('forwards an error returned by requestPasswordReset', async () => {
    mockRequestPasswordReset.mockResolvedValue({ error: 'boom' })

    const { sendPasswordResetEmail } = await import('@/lib/actions/account')
    const result = await sendPasswordResetEmail()

    expect(result.error).toBe('boom')
  })

  it('returns error when not authenticated', async () => {
    mockServerClient.auth.getUser.mockResolvedValue({ data: { user: null } })

    const { sendPasswordResetEmail } = await import('@/lib/actions/account')
    const result = await sendPasswordResetEmail()

    expect(result.error).toBe('ไม่ได้เข้าสู่ระบบ')
    expect(mockRequestPasswordReset).not.toHaveBeenCalled()
  })

  it('returns error when the account has no email', async () => {
    mockServerClient.auth.getUser.mockResolvedValue({ data: { user: { id: 'u-1' } } })

    const { sendPasswordResetEmail } = await import('@/lib/actions/account')
    const result = await sendPasswordResetEmail()

    expect(result.error).toBe('ไม่พบอีเมลของบัญชีนี้')
    expect(mockRequestPasswordReset).not.toHaveBeenCalled()
  })
})
