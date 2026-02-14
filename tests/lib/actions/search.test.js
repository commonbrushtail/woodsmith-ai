import { describe, it, expect, vi, beforeEach } from 'vitest'

// --- Mocks ---

// Query chain is thenable — resolves when awaited
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

vi.mock('@/lib/supabase/server', () => ({
  createClient: vi.fn(async () => mockServerClient),
}))

beforeEach(() => {
  vi.clearAllMocks()
  mockQueryChain = createQueryChain()
  mockServerClient = {
    from: vi.fn(() => mockQueryChain),
  }
})

// --- Tests ---
describe('searchAll', () => {
  it('returns empty results for short query', async () => {
    const { searchAll } = await import('@/lib/actions/search')
    const result = await searchAll('a')

    expect(result.products).toEqual([])
    expect(result.posts).toEqual([])
    expect(mockServerClient.from).not.toHaveBeenCalled()
  })

  it('returns empty results for empty query', async () => {
    const { searchAll } = await import('@/lib/actions/search')
    const result = await searchAll('')

    expect(result.products).toEqual([])
    expect(result.posts).toEqual([])
  })

  it('returns empty results for null query', async () => {
    const { searchAll } = await import('@/lib/actions/search')
    const result = await searchAll(null)

    expect(result.products).toEqual([])
    expect(result.posts).toEqual([])
  })

  it('searches products and blog posts in parallel', async () => {
    const products = [{ id: 'p1', name: 'Plywood' }]
    const posts = [{ id: 'b1', title: 'Wood Guide' }]

    // Each from() call returns a different chain with different results
    const productChain = createQueryChain({ data: products, error: null })
    const postChain = createQueryChain({ data: posts, error: null })
    let fromCallCount = 0
    mockServerClient.from = vi.fn(() => {
      fromCallCount++
      return fromCallCount === 1 ? productChain : postChain
    })

    const { searchAll } = await import('@/lib/actions/search')
    const result = await searchAll('wood')

    expect(result.products).toEqual(products)
    expect(result.posts).toEqual(posts)
  })

  it('handles null data gracefully', async () => {
    mockQueryChain = createQueryChain({ data: null, error: null })
    mockServerClient.from = vi.fn(() => mockQueryChain)

    const { searchAll } = await import('@/lib/actions/search')
    const result = await searchAll('test query')

    expect(result.products).toEqual([])
    expect(result.posts).toEqual([])
  })
})

describe('getRecommendedProducts', () => {
  it('returns recommended products', async () => {
    const products = [{ id: 'p1', name: 'Best Seller' }]
    mockQueryChain = createQueryChain({ data: products, error: null })
    mockServerClient.from = vi.fn(() => mockQueryChain)

    const { getRecommendedProducts } = await import('@/lib/actions/search')
    const result = await getRecommendedProducts()

    expect(result).toEqual(products)
    expect(mockQueryChain.eq).toHaveBeenCalledWith('recommended', true)
    expect(mockQueryChain.limit).toHaveBeenCalledWith(6)
  })

  it('returns empty array when no data', async () => {
    mockQueryChain = createQueryChain({ data: null, error: null })
    mockServerClient.from = vi.fn(() => mockQueryChain)

    const { getRecommendedProducts } = await import('@/lib/actions/search')
    const result = await getRecommendedProducts()

    expect(result).toEqual([])
  })
})

describe('getPopularCategories', () => {
  it('returns top 5 categories by frequency', async () => {
    const data = [
      { category: 'ไม้แปรรูป' },
      { category: 'ไม้แปรรูป' },
      { category: 'ไม้แปรรูป' },
      { category: 'กระเบื้อง' },
      { category: 'กระเบื้อง' },
      { category: 'สี' },
      { category: 'เครื่องมือ' },
      { category: 'ฉนวน' },
      { category: 'ท่อ' },
      { category: 'ท่อ' },
    ]
    mockQueryChain = createQueryChain({ data, error: null })
    mockServerClient.from = vi.fn(() => mockQueryChain)

    const { getPopularCategories } = await import('@/lib/actions/search')
    const result = await getPopularCategories()

    expect(result).toHaveLength(5)
    expect(result[0]).toBe('ไม้แปรรูป') // 3 occurrences = first
    expect(result[1]).toBe('กระเบื้อง') // 2 occurrences
    expect(result[2]).toBe('ท่อ') // 2 occurrences
  })

  it('returns empty array when no products', async () => {
    mockQueryChain = createQueryChain({ data: null, error: null })
    mockServerClient.from = vi.fn(() => mockQueryChain)

    const { getPopularCategories } = await import('@/lib/actions/search')
    const result = await getPopularCategories()

    expect(result).toEqual([])
  })

  it('excludes null categories', async () => {
    const data = [
      { category: 'ไม้แปรรูป' },
      { category: null },
      { category: null },
    ]
    mockQueryChain = createQueryChain({ data, error: null })
    mockServerClient.from = vi.fn(() => mockQueryChain)

    const { getPopularCategories } = await import('@/lib/actions/search')
    const result = await getPopularCategories()

    expect(result).toEqual(['ไม้แปรรูป'])
  })
})
