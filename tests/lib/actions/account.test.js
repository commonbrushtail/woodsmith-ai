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

describe('updatePassword', () => {
  it('updates password when valid', async () => {
    const { updatePassword } = await import('@/lib/actions/account')
    const fd = fakeFormData({ new_password: 'newpass123', confirm_password: 'newpass123' })
    const result = await updatePassword(fd)

    expect(result.error).toBeNull()
    expect(mockAdmin.auth.admin.updateUserById).toHaveBeenCalledWith('u-1', { password: 'newpass123' })
  })

  it('rejects password shorter than 8 characters', async () => {
    const { updatePassword } = await import('@/lib/actions/account')
    const fd = fakeFormData({ new_password: 'short', confirm_password: 'short' })
    const result = await updatePassword(fd)

    expect(result.error).toBe('รหัสผ่านต้องมีอย่างน้อย 8 ตัวอักษร')
  })

  it('rejects mismatched passwords', async () => {
    const { updatePassword } = await import('@/lib/actions/account')
    const fd = fakeFormData({ new_password: 'password123', confirm_password: 'different123' })
    const result = await updatePassword(fd)

    expect(result.error).toBe('รหัสผ่านไม่ตรงกัน')
  })

  it('returns error when not authenticated', async () => {
    mockServerClient.auth.getUser.mockResolvedValue({ data: { user: null } })

    const { updatePassword } = await import('@/lib/actions/account')
    const fd = fakeFormData({ new_password: 'newpass123', confirm_password: 'newpass123' })
    const result = await updatePassword(fd)

    expect(result.error).toBe('ไม่ได้เข้าสู่ระบบ')
  })

  it('returns Supabase error on update failure', async () => {
    mockAdmin.auth.admin.updateUserById.mockResolvedValue({ error: { message: 'weak password' } })

    const { updatePassword } = await import('@/lib/actions/account')
    const fd = fakeFormData({ new_password: 'newpass123', confirm_password: 'newpass123' })
    const result = await updatePassword(fd)

    expect(result.error).toBe('weak password')
  })
})

describe('updateEmail', () => {
  it('updates email when provided', async () => {
    const { updateEmail } = await import('@/lib/actions/account')
    const fd = fakeFormData({ email: 'new@test.com' })
    const result = await updateEmail(fd)

    expect(result.error).toBeNull()
    expect(mockAdmin.auth.admin.updateUserById).toHaveBeenCalledWith('u-1', {
      email: 'new@test.com',
      email_confirm: true,
    })
  })

  it('rejects empty email', async () => {
    const { updateEmail } = await import('@/lib/actions/account')
    const fd = fakeFormData({ email: '' })
    const result = await updateEmail(fd)

    expect(result.error).toBe('กรุณาระบุอีเมล')
  })

  it('returns error when not authenticated', async () => {
    mockServerClient.auth.getUser.mockResolvedValue({ data: { user: null } })

    const { updateEmail } = await import('@/lib/actions/account')
    const fd = fakeFormData({ email: 'new@test.com' })
    const result = await updateEmail(fd)

    expect(result.error).toBe('ไม่ได้เข้าสู่ระบบ')
  })

  it('returns Supabase error on update failure', async () => {
    mockAdmin.auth.admin.updateUserById.mockResolvedValue({ error: { message: 'email taken' } })

    const { updateEmail } = await import('@/lib/actions/account')
    const fd = fakeFormData({ email: 'taken@test.com' })
    const result = await updateEmail(fd)

    expect(result.error).toBe('email taken')
  })
})
