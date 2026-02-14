import { describe, it, expect, vi, beforeEach } from 'vitest'

// --- Mocks ---
const mockRevalidatePath = vi.fn()
vi.mock('next/cache', () => ({ revalidatePath: (...args) => mockRevalidatePath(...args) }))

function createChain(finalResult = { data: null, error: null, count: 0 }) {
  const chain = {}
  const methods = ['from', 'select', 'insert', 'update', 'delete', 'eq', 'or', 'ilike', 'order', 'range', 'single']
  for (const m of methods) {
    chain[m] = vi.fn(() => chain)
  }
  chain.then = (resolve) => resolve(finalResult)
  return chain
}

let mockAdmin
vi.mock('@/lib/supabase/admin', () => ({
  createServiceClient: vi.fn(() => mockAdmin),
}))

// Mock server client (used by audit logging in updateQuotationStatus)
const mockServerClient = {
  auth: { getUser: vi.fn().mockResolvedValue({ data: { user: { id: 'admin-1' } } }) },
}
vi.mock('@/lib/supabase/server', () => ({
  createClient: vi.fn(async () => mockServerClient),
}))

vi.mock('@/lib/audit', () => ({
  logAudit: vi.fn(),
}))

beforeEach(() => {
  vi.clearAllMocks()
  mockAdmin = createChain()
})

// --- Tests ---
describe('getQuotations', () => {
  it('returns paginated quotations', async () => {
    const rows = [{ id: '1', quotation_number: 'QT-001' }]
    mockAdmin = createChain({ data: rows, count: 1, error: null })

    const { getQuotations } = await import('@/lib/actions/quotations')
    const result = await getQuotations({ page: 1, perPage: 10 })

    expect(result.data).toEqual(rows)
    expect(result.count).toBe(1)
    expect(result.error).toBeNull()
    expect(mockAdmin.from).toHaveBeenCalledWith('quotations')
    expect(mockAdmin.order).toHaveBeenCalledWith('created_at', { ascending: false })
  })

  it('filters by status when provided', async () => {
    mockAdmin = createChain({ data: [], count: 0, error: null })
    const { getQuotations } = await import('@/lib/actions/quotations')
    await getQuotations({ status: 'pending' })

    expect(mockAdmin.eq).toHaveBeenCalledWith('status', 'pending')
  })

  it('applies search filter', async () => {
    mockAdmin = createChain({ data: [], count: 0, error: null })
    const { getQuotations } = await import('@/lib/actions/quotations')
    await getQuotations({ search: 'QT-2024' })

    expect(mockAdmin.or).toHaveBeenCalledWith(
      'quotation_number.ilike.%QT-2024%,requester_name.ilike.%QT-2024%'
    )
  })

  it('returns error on failure', async () => {
    mockAdmin = createChain({ data: null, error: { message: 'connection error' }, count: null })
    const { getQuotations } = await import('@/lib/actions/quotations')
    const result = await getQuotations()

    expect(result.error).toBe('connection error')
    expect(result.data).toEqual([])
  })
})

describe('getQuotation', () => {
  it('returns a single quotation with product details', async () => {
    const q = { id: 'q-1', quotation_number: 'QT-001', product: { code: 'P1', name: 'Board' } }
    mockAdmin = createChain({ data: q, error: null })

    const { getQuotation } = await import('@/lib/actions/quotations')
    const result = await getQuotation('q-1')

    expect(result.data).toEqual(q)
    expect(mockAdmin.eq).toHaveBeenCalledWith('id', 'q-1')
    expect(mockAdmin.single).toHaveBeenCalled()
  })

  it('returns error when not found', async () => {
    mockAdmin = createChain({ data: null, error: { message: 'not found' } })
    const { getQuotation } = await import('@/lib/actions/quotations')
    const result = await getQuotation('missing')

    expect(result.error).toBe('not found')
  })
})

describe('updateQuotationStatus', () => {
  it('updates status for valid value', async () => {
    mockAdmin = createChain({ error: null })
    const { updateQuotationStatus } = await import('@/lib/actions/quotations')
    const result = await updateQuotationStatus('q-1', 'approved')

    expect(result.error).toBeNull()
    expect(mockAdmin.update).toHaveBeenCalledWith({ status: 'approved' })
    expect(mockRevalidatePath).toHaveBeenCalledWith('/admin/quotations')
    expect(mockRevalidatePath).toHaveBeenCalledWith('/admin/quotations/q-1')
  })

  it('rejects invalid status value', async () => {
    const { updateQuotationStatus } = await import('@/lib/actions/quotations')
    const result = await updateQuotationStatus('q-1', 'invalid_status')

    expect(result.error).toBe('สถานะไม่ถูกต้อง')
    // Should not call Supabase
    expect(mockAdmin.update).not.toHaveBeenCalled()
  })

  it('accepts all valid enum values', async () => {
    const { updateQuotationStatus } = await import('@/lib/actions/quotations')

    for (const status of ['pending', 'approved', 'rejected']) {
      mockAdmin = createChain({ error: null })
      const result = await updateQuotationStatus('q-1', status)
      expect(result.error).toBeNull()
    }
  })
})

describe('updateAdminNotes', () => {
  it('updates admin notes on a quotation', async () => {
    mockAdmin = createChain({ error: null })
    const { updateAdminNotes } = await import('@/lib/actions/quotations')
    const result = await updateAdminNotes('q-1', 'Customer wants blue color')

    expect(result.error).toBeNull()
    expect(mockAdmin.update).toHaveBeenCalledWith({ admin_notes: 'Customer wants blue color' })
    expect(mockRevalidatePath).toHaveBeenCalledWith('/admin/quotations/q-1')
  })

  it('returns error on Supabase failure', async () => {
    mockAdmin = createChain({ error: { message: 'permission denied' } })
    const { updateAdminNotes } = await import('@/lib/actions/quotations')
    const result = await updateAdminNotes('q-1', 'notes')

    expect(result.error).toBe('permission denied')
  })
})

describe('deleteQuotation', () => {
  it('deletes quotation and revalidates path', async () => {
    mockAdmin = createChain({ error: null })
    const { deleteQuotation } = await import('@/lib/actions/quotations')
    const result = await deleteQuotation('q-1')

    expect(result.error).toBeNull()
    expect(mockAdmin.delete).toHaveBeenCalled()
    expect(mockAdmin.eq).toHaveBeenCalledWith('id', 'q-1')
    expect(mockRevalidatePath).toHaveBeenCalledWith('/admin/quotations')
  })

  it('returns error on delete failure', async () => {
    mockAdmin = createChain({ error: { message: 'FK constraint' } })
    const { deleteQuotation } = await import('@/lib/actions/quotations')
    const result = await deleteQuotation('q-1')

    expect(result.error).toBe('FK constraint')
  })
})
