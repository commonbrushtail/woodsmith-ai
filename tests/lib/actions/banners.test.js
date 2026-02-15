import { describe, it, expect, vi, beforeEach } from 'vitest'

// Mock Supabase admin client
let mockAdminQueryChain
let mockAdmin

vi.mock('@/lib/supabase/admin', () => ({
  createServiceClient: () => mockAdmin,
}))

// Mock next/cache
const mockRevalidatePath = vi.fn()
vi.mock('next/cache', () => ({
  revalidatePath: (...args) => mockRevalidatePath(...args),
}))

// Mock storage functions
vi.mock('@/lib/storage', () => ({
  uploadFile: vi.fn(),
  deleteFile: vi.fn(),
  getPublicUrl: vi.fn((bucket, path) => `https://cdn.woodsmith.test/${bucket}/${path}`),
}))

// Helper to create query chain
function createQueryChain(finalResult = { data: null, error: null }) {
  const chain = {}
  const methods = ['select', 'insert', 'update', 'delete', 'eq', 'or', 'order', 'limit', 'single']
  for (const m of methods) {
    chain[m] = vi.fn(() => chain)
  }
  chain.then = (resolve) => resolve(finalResult)
  return chain
}

// Helper for FormData
function fakeFormData(obj) {
  const map = new Map(Object.entries(obj))
  return {
    get: (key) => (map.has(key) ? map.get(key) : null),
    has: (key) => map.has(key),
    set: (key, val) => map.set(key, val),
  }
}

beforeEach(() => {
  vi.clearAllMocks()
  mockAdminQueryChain = createQueryChain()
  mockAdmin = { from: vi.fn(() => mockAdminQueryChain) }
})

describe('createBanner', () => {
  it('creates banner with image_url and link_url', async () => {
    // Mock: existing banners query (for sort_order calculation)
    const existingChain = createQueryChain({ data: [{ sort_order: 2 }], error: null })
    const insertChain = createQueryChain({ data: { id: 'b1', image_url: 'https://cdn.woodsmith.test/banner.jpg', link_url: 'https://woodsmith.test/products', status: 'active', sort_order: 3 }, error: null })

    let callCount = 0
    mockAdmin.from = vi.fn((table) => {
      if (table === 'banners') {
        callCount++
        // First call is select for sort_order
        if (callCount === 1) return existingChain
        // Second call is insert
        return insertChain
      }
      return mockAdminQueryChain
    })

    const { createBanner } = await import('@/lib/actions/banners')

    const formData = fakeFormData({
      image_url: 'https://cdn.woodsmith.test/banner.jpg',
      link_url: 'https://woodsmith.test/products',
      status: 'active',
    })

    const result = await createBanner(formData)

    expect(result.error).toBeNull()
    expect(result.data).toBeTruthy()
    expect(result.data.sort_order).toBe(3)
    expect(mockRevalidatePath).toHaveBeenCalledWith('/admin/banner')
  })

  it('handles missing image_url gracefully', async () => {
    // Mock: existing banners query
    const existingChain = createQueryChain({ data: [{ sort_order: 1 }], error: null })
    const insertChain = createQueryChain({ data: { id: 'b2', image_url: '', link_url: 'https://woodsmith.test/products', status: 'active', sort_order: 2 }, error: null })

    let callCount = 0
    mockAdmin.from = vi.fn((table) => {
      if (table === 'banners') {
        callCount++
        if (callCount === 1) return existingChain
        return insertChain
      }
      return mockAdminQueryChain
    })

    const { createBanner } = await import('@/lib/actions/banners')

    const formData = fakeFormData({
      image_url: '',  // Empty image URL
      link_url: 'https://woodsmith.test/products',
      status: 'active',
    })

    const result = await createBanner(formData)

    // Should still create banner (validation happens on client)
    // This test verifies server action doesn't crash with empty image_url
    expect(result).toBeTruthy()
    expect(result.data).toBeTruthy()
  })
})
