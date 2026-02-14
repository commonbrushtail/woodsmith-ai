import { describe, it, expect, vi, beforeEach } from 'vitest'

// Mock next/headers
vi.mock('next/headers', () => ({
  cookies: vi.fn(() => ({
    getAll: () => [],
    set: vi.fn(),
  })),
  headers: vi.fn(() => new Map([['x-forwarded-for', '192.168.1.1']])),
}))

const mockInsert = vi.fn().mockReturnValue({ error: null })

// Mock Supabase admin client
vi.mock('@/lib/supabase/admin', () => ({
  createServiceClient: vi.fn(() => ({
    from: vi.fn(() => ({
      insert: mockInsert,
    })),
  })),
}))

describe('buildAuditEntry', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('creates structured audit entry with required fields', async () => {
    const { buildAuditEntry } = await import('@/lib/audit')
    const entry = buildAuditEntry({
      userId: 'user-123',
      action: 'product.create',
      targetId: 'prod-456',
      details: { name: 'New Product' },
    })
    expect(entry.user_id).toBe('user-123')
    expect(entry.action).toBe('product.create')
    expect(entry.target_id).toBe('prod-456')
    expect(entry.details).toEqual({ name: 'New Product' })
    expect(entry.created_at).toBeDefined()
  })

  it('includes IP when provided', async () => {
    const { buildAuditEntry } = await import('@/lib/audit')
    const entry = buildAuditEntry({
      userId: 'user-123',
      action: 'login',
      ip: '192.168.1.1',
    })
    expect(entry.ip_address).toBe('192.168.1.1')
  })

  it('defaults target_id to null', async () => {
    const { buildAuditEntry } = await import('@/lib/audit')
    const entry = buildAuditEntry({
      userId: 'user-123',
      action: 'logout',
    })
    expect(entry.target_id).toBeNull()
  })

  it('defaults details to null', async () => {
    const { buildAuditEntry } = await import('@/lib/audit')
    const entry = buildAuditEntry({
      userId: 'user-123',
      action: 'logout',
    })
    expect(entry.details).toBeNull()
  })

  it('defaults ip_address to null', async () => {
    const { buildAuditEntry } = await import('@/lib/audit')
    const entry = buildAuditEntry({
      userId: 'user-123',
      action: 'logout',
    })
    expect(entry.ip_address).toBeNull()
  })

  it('created_at is a valid ISO timestamp', async () => {
    const { buildAuditEntry } = await import('@/lib/audit')
    const entry = buildAuditEntry({
      userId: 'user-123',
      action: 'test',
    })
    const date = new Date(entry.created_at)
    expect(date.toISOString()).toBe(entry.created_at)
  })
})

describe('logAudit', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    mockInsert.mockReturnValue({ error: null })
  })

  it('inserts audit entry into audit_logs table', async () => {
    const { logAudit } = await import('@/lib/audit')
    const { createServiceClient } = await import('@/lib/supabase/admin')

    await logAudit({
      userId: 'user-123',
      action: 'product.delete',
      targetId: 'prod-789',
    })

    expect(createServiceClient).toHaveBeenCalled()
    expect(mockInsert).toHaveBeenCalledWith(
      expect.objectContaining({
        user_id: 'user-123',
        action: 'product.delete',
        target_id: 'prod-789',
      })
    )
  })

  it('does not throw on insert error', async () => {
    mockInsert.mockReturnValue({ error: { message: 'DB error' } })
    const { logAudit } = await import('@/lib/audit')

    // Should not throw — audit logging should be fire-and-forget
    await expect(logAudit({
      userId: 'user-123',
      action: 'test',
    })).resolves.not.toThrow()
  })
})
