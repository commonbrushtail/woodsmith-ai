import { describe, it, expect, vi, beforeEach } from 'vitest'

// --- Mocks ---
const mockRevalidatePath = vi.fn()
vi.mock('next/cache', () => ({ revalidatePath: (...args) => mockRevalidatePath(...args) }))

// Query chain is thenable — resolves when awaited
function createQueryChain(finalResult = { data: null, error: null, count: 0 }) {
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

vi.mock('@/lib/supabase/admin', () => ({
  createServiceClient: vi.fn(() => mockAdmin),
}))
vi.mock('@/lib/supabase/server', () => ({
  createClient: vi.fn(async () => mockServerClient),
}))

beforeEach(() => {
  vi.clearAllMocks()

  mockQueryChain = createQueryChain()
  mockServerClient = {
    from: vi.fn(() => mockQueryChain),
    auth: {
      getUser: vi.fn().mockResolvedValue({ data: { user: { id: 'user-1' } } }),
    },
  }

  mockAdminQueryChain = createQueryChain()
  mockAdmin = {
    from: vi.fn(() => mockAdminQueryChain),
  }
})

// --- Tests ---
describe('createCustomerProfile', () => {
  it('inserts a customer profile row', async () => {
    mockAdminQueryChain = createQueryChain({ error: null })
    mockAdmin.from = vi.fn(() => mockAdminQueryChain)

    const { createCustomerProfile } = await import('@/lib/actions/customer')
    const result = await createCustomerProfile('user-1', {
      displayName: 'John',
      phone: '0812345678',
      email: 'john@test.com',
    })

    expect(result.error).toBeNull()
    expect(mockAdminQueryChain.insert).toHaveBeenCalledWith({
      user_id: 'user-1',
      display_name: 'John',
      phone: '0812345678',
      email: 'john@test.com',
      role: 'customer',
    })
  })

  it('returns error on insert failure', async () => {
    mockAdminQueryChain = createQueryChain({ error: { message: 'duplicate user_id' } })
    mockAdmin.from = vi.fn(() => mockAdminQueryChain)

    const { createCustomerProfile } = await import('@/lib/actions/customer')
    const result = await createCustomerProfile('user-1', {
      displayName: 'John',
      phone: '0812345678',
      email: 'john@test.com',
    })

    expect(result.error).toBe('duplicate user_id')
  })
})

describe('getCustomerProfile', () => {
  it('returns profile for authenticated user', async () => {
    const profile = { user_id: 'user-1', display_name: 'John', role: 'customer' }
    mockQueryChain = createQueryChain({ data: profile, error: null })
    mockServerClient.from = vi.fn(() => mockQueryChain)

    const { getCustomerProfile } = await import('@/lib/actions/customer')
    const result = await getCustomerProfile()

    expect(result.data).toEqual(profile)
    expect(result.error).toBeNull()
  })

  it('returns error when not authenticated', async () => {
    mockServerClient.auth.getUser.mockResolvedValue({ data: { user: null } })

    const { getCustomerProfile } = await import('@/lib/actions/customer')
    const result = await getCustomerProfile()

    expect(result.error).toBe('Not authenticated')
    expect(result.data).toBeNull()
  })
})

describe('updateCustomerProfile', () => {
  it('updates profile for authenticated user', async () => {
    mockQueryChain = createQueryChain({ error: null })
    mockServerClient.from = vi.fn(() => mockQueryChain)

    const { updateCustomerProfile } = await import('@/lib/actions/customer')
    const result = await updateCustomerProfile({
      display_name: 'Jane',
      phone: '0899999999',
    })

    expect(result.error).toBeNull()
    expect(mockQueryChain.update).toHaveBeenCalled()
    expect(mockRevalidatePath).toHaveBeenCalledWith('/account')
  })

  it('returns error when not authenticated', async () => {
    mockServerClient.auth.getUser.mockResolvedValue({ data: { user: null } })

    const { updateCustomerProfile } = await import('@/lib/actions/customer')
    const result = await updateCustomerProfile({ display_name: 'Jane' })

    expect(result.error).toBe('Not authenticated')
  })

  it('accepts FormData-like objects', async () => {
    mockQueryChain = createQueryChain({ error: null })
    mockServerClient.from = vi.fn(() => mockQueryChain)

    const { updateCustomerProfile } = await import('@/lib/actions/customer')
    const fd = {
      get: vi.fn((key) => {
        if (key === 'display_name') return 'Test'
        if (key === 'phone') return '0811111111'
        return undefined
      }),
    }
    const result = await updateCustomerProfile(fd)
    expect(result.error).toBeNull()
  })
})

describe('submitQuotation', () => {
  it('validates and submits a quotation', async () => {
    const quotation = { id: 'q-1', quotation_number: 'QT-20240101-1234' }
    mockQueryChain = createQueryChain({ data: quotation, error: null })
    mockServerClient.from = vi.fn(() => mockQueryChain)

    const { submitQuotation } = await import('@/lib/actions/customer')
    const result = await submitQuotation({
      productId: '550e8400-e29b-41d4-a716-446655440000',
      requesterName: 'John Doe',
      requesterPhone: '0812345678',
      requesterEmail: 'john@test.com',
      message: 'Need 100 boards',
      quantity: 100,
    })

    expect(result.data).toEqual(quotation)
    expect(result.error).toBeNull()

    const insertCall = mockQueryChain.insert.mock.calls[0][0]
    expect(insertCall.quotation_number).toMatch(/^QT-\d{8}-\d{4}$/)
    expect(insertCall.status).toBe('pending')
    expect(insertCall.customer_id).toBe('user-1')
  })

  it('returns validation error for missing name', async () => {
    const { submitQuotation } = await import('@/lib/actions/customer')
    const result = await submitQuotation({
      requesterName: '',
      requesterPhone: '0812345678',
    })

    expect(result.error).toBe('ข้อมูลไม่ถูกต้อง')
    expect(result.fieldErrors).toBeDefined()
  })

  it('returns validation error for short phone number', async () => {
    const { submitQuotation } = await import('@/lib/actions/customer')
    const result = await submitQuotation({
      requesterName: 'John',
      requesterPhone: '12345',
    })

    expect(result.error).toBe('ข้อมูลไม่ถูกต้อง')
    expect(result.fieldErrors.requester_phone).toBeDefined()
  })

  it('returns Supabase error on insert failure', async () => {
    mockQueryChain = createQueryChain({ data: null, error: { message: 'insert failed' } })
    mockServerClient.from = vi.fn(() => mockQueryChain)

    const { submitQuotation } = await import('@/lib/actions/customer')
    const result = await submitQuotation({
      requesterName: 'John',
      requesterPhone: '0812345678',
    })

    expect(result.error).toBe('insert failed')
  })
})

describe('getMyQuotations', () => {
  it('returns quotations for authenticated user', async () => {
    const quotations = [{ id: 'q-1' }, { id: 'q-2' }]
    mockQueryChain = createQueryChain({ data: quotations, error: null })
    mockServerClient.from = vi.fn(() => mockQueryChain)

    const { getMyQuotations } = await import('@/lib/actions/customer')
    const result = await getMyQuotations()

    expect(result.data).toEqual(quotations)
    expect(result.error).toBeNull()
  })

  it('returns error when not authenticated', async () => {
    mockServerClient.auth.getUser.mockResolvedValue({ data: { user: null } })

    const { getMyQuotations } = await import('@/lib/actions/customer')
    const result = await getMyQuotations()

    expect(result.error).toBe('Not authenticated')
    expect(result.data).toEqual([])
  })
})
