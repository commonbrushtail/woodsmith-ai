import { describe, it, expect, vi, beforeEach } from 'vitest'

// Mutable state the mocks read lazily.
let draftEnabled = false
let adminUser = null

const anonClient = { __kind: 'anon' }
const serviceClient = { __kind: 'service' }

vi.mock('next/headers', () => ({
  draftMode: vi.fn(async () => ({ isEnabled: draftEnabled })),
}))
vi.mock('@/lib/supabase/server', () => ({
  createClient: vi.fn(async () => anonClient),
}))
vi.mock('@/lib/supabase/admin', () => ({
  createServiceClient: vi.fn(() => serviceClient),
}))
vi.mock('@/lib/auth/require-admin', () => ({
  requireAdmin: vi.fn(async () => ({ user: adminUser, error: adminUser ? null : 'no' })),
}))

beforeEach(() => {
  vi.clearAllMocks()
  draftEnabled = false
  adminUser = null
})

describe('getReadClient', () => {
  it('returns the anon client when draft mode is OFF (public path unchanged)', async () => {
    draftEnabled = false
    const { getReadClient } = await import('@/lib/data/draft')
    const { requireAdmin } = await import('@/lib/auth/require-admin')

    const client = await getReadClient()

    expect(client).toBe(anonClient)
    // Must not even check admin on the hot public path.
    expect(requireAdmin).not.toHaveBeenCalled()
  })

  it('returns the service client when draft mode is ON and requester is an admin', async () => {
    draftEnabled = true
    adminUser = { id: 'admin-1', user_metadata: { role: 'admin' } }
    const { getReadClient } = await import('@/lib/data/draft')

    const client = await getReadClient()

    expect(client).toBe(serviceClient)
  })

  it('falls back to the anon client when draft mode is ON but requester is NOT an admin', async () => {
    draftEnabled = true
    adminUser = null // forged/stale bypass cookie, no admin session
    const { getReadClient } = await import('@/lib/data/draft')

    const client = await getReadClient()

    expect(client).toBe(anonClient)
  })
})

describe('isPreview', () => {
  it('is false when draft mode is OFF', async () => {
    draftEnabled = false
    const { isPreview } = await import('@/lib/data/draft')
    expect(await isPreview()).toBe(false)
  })

  it('is true when draft mode is ON and requester is an admin', async () => {
    draftEnabled = true
    adminUser = { id: 'admin-1' }
    const { isPreview } = await import('@/lib/data/draft')
    expect(await isPreview()).toBe(true)
  })

  it('is false when draft mode is ON but requester is not an admin', async () => {
    draftEnabled = true
    adminUser = null
    const { isPreview } = await import('@/lib/data/draft')
    expect(await isPreview()).toBe(false)
  })
})
