import { describe, it, expect, vi, beforeEach } from 'vitest'

// --- Mocks ---
function createQueryChain(finalResult = { data: null, error: null, count: 0 }) {
  const chain = {}
  const methods = ['select', 'insert', 'update', 'delete', 'eq', 'neq', 'or', 'ilike', 'order', 'range', 'single', 'limit']
  for (const m of methods) {
    chain[m] = vi.fn(() => chain)
  }
  chain.then = (resolve) => resolve(finalResult)
  return chain
}

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
describe('getPublishedProducts', () => {
  it('returns paginated products', async () => {
    const products = [{ id: '1', name: 'Board' }]
    mockQueryChain = createQueryChain({ data: products, count: 1, error: null })
    mockServerClient.from = vi.fn(() => mockQueryChain)

    const { getPublishedProducts } = await import('@/lib/data/public')
    const result = await getPublishedProducts({ page: 1, perPage: 16 })

    expect(result.data).toEqual(products)
    expect(result.count).toBe(1)
    expect(result.error).toBeNull()
    expect(mockServerClient.from).toHaveBeenCalledWith('products')
    expect(mockQueryChain.range).toHaveBeenCalledWith(0, 15)
  })

  it('filters by category', async () => {
    mockQueryChain = createQueryChain({ data: [], count: 0, error: null })
    mockServerClient.from = vi.fn(() => mockQueryChain)

    const { getPublishedProducts } = await import('@/lib/data/public')
    await getPublishedProducts({ category: 'ไม้แปรรูป' })

    expect(mockQueryChain.eq).toHaveBeenCalledWith('category', 'ไม้แปรรูป')
  })

  it('applies search filter', async () => {
    mockQueryChain = createQueryChain({ data: [], count: 0, error: null })
    mockServerClient.from = vi.fn(() => mockQueryChain)

    const { getPublishedProducts } = await import('@/lib/data/public')
    await getPublishedProducts({ search: 'ply' })

    expect(mockQueryChain.or).toHaveBeenCalledWith('name.ilike.%ply%,code.ilike.%ply%')
  })

  it('returns error on failure', async () => {
    mockQueryChain = createQueryChain({ data: null, count: null, error: { message: 'timeout' } })
    mockServerClient.from = vi.fn(() => mockQueryChain)

    const { getPublishedProducts } = await import('@/lib/data/public')
    const result = await getPublishedProducts()

    expect(result.error).toBe('timeout')
    expect(result.data).toEqual([])
  })
})

describe('getPublishedProduct', () => {
  it('returns product with related products', async () => {
    const product = { id: 'p1', name: 'Board', category: 'wood' }
    const related = [{ id: 'p2', name: 'Plank' }]

    // First call: product, second call: related products
    const productChain = createQueryChain({ data: product, error: null })
    const relatedChain = createQueryChain({ data: related, error: null })
    let callCount = 0
    mockServerClient.from = vi.fn(() => {
      callCount++
      return callCount === 1 ? productChain : relatedChain
    })

    const { getPublishedProduct } = await import('@/lib/data/public')
    const result = await getPublishedProduct('p1')

    expect(result.data.id).toBe('p1')
    expect(result.data.relatedProducts).toEqual(related)
    expect(result.error).toBeNull()
  })

  it('returns error when product not found', async () => {
    mockQueryChain = createQueryChain({ data: null, error: { message: 'not found' } })
    mockServerClient.from = vi.fn(() => mockQueryChain)

    const { getPublishedProduct } = await import('@/lib/data/public')
    const result = await getPublishedProduct('missing')

    expect(result.error).toBe('not found')
    expect(result.data).toBeNull()
  })
})

describe('getPublishedBlogPosts', () => {
  it('returns paginated blog posts', async () => {
    const posts = [{ id: '1', title: 'Guide' }]
    mockQueryChain = createQueryChain({ data: posts, count: 1, error: null })
    mockServerClient.from = vi.fn(() => mockQueryChain)

    const { getPublishedBlogPosts } = await import('@/lib/data/public')
    const result = await getPublishedBlogPosts({ page: 1, perPage: 20 })

    expect(result.data).toEqual(posts)
    expect(result.count).toBe(1)
    expect(mockServerClient.from).toHaveBeenCalledWith('blog_posts')
  })

  it('filters by category', async () => {
    mockQueryChain = createQueryChain({ data: [], count: 0, error: null })
    mockServerClient.from = vi.fn(() => mockQueryChain)

    const { getPublishedBlogPosts } = await import('@/lib/data/public')
    await getPublishedBlogPosts({ category: 'tips' })

    expect(mockQueryChain.eq).toHaveBeenCalledWith('category', 'tips')
  })
})

describe('getPublishedBlogPost', () => {
  it('fetches by UUID when given valid UUID', async () => {
    const uuid = '550e8400-e29b-41d4-a716-446655440000'
    const post = { id: uuid, title: 'Test', category: 'tips' }
    const related = [{ id: '2', title: 'Related' }]

    const postChain = createQueryChain({ data: post, error: null })
    const relatedChain = createQueryChain({ data: related, error: null })
    let callCount = 0
    mockServerClient.from = vi.fn(() => {
      callCount++
      return callCount === 1 ? postChain : relatedChain
    })

    const { getPublishedBlogPost } = await import('@/lib/data/public')
    const result = await getPublishedBlogPost(uuid)

    expect(postChain.eq).toHaveBeenCalledWith('id', uuid)
    expect(result.data.relatedPosts).toEqual(related)
  })

  it('fetches by slug when given non-UUID string', async () => {
    const post = { id: 'x', title: 'Test', category: null }
    mockQueryChain = createQueryChain({ data: post, error: null })
    mockServerClient.from = vi.fn(() => mockQueryChain)

    const { getPublishedBlogPost } = await import('@/lib/data/public')
    const result = await getPublishedBlogPost('my-post-slug')

    expect(mockQueryChain.eq).toHaveBeenCalledWith('slug', 'my-post-slug')
    // No category → no related posts fetch
    expect(result.data.relatedPosts).toEqual([])
  })

  it('skips related posts when no category', async () => {
    const post = { id: 'x', title: 'Test', category: null }
    mockQueryChain = createQueryChain({ data: post, error: null })
    mockServerClient.from = vi.fn(() => mockQueryChain)

    const { getPublishedBlogPost } = await import('@/lib/data/public')
    const result = await getPublishedBlogPost('x')

    // from() should only be called once (for the post itself)
    expect(mockServerClient.from).toHaveBeenCalledTimes(1)
    expect(result.data.relatedPosts).toEqual([])
  })
})

describe('getPublishedBranches', () => {
  it('returns all branches', async () => {
    const branches = [{ id: '1', name: 'Branch A' }]
    mockQueryChain = createQueryChain({ data: branches, error: null })
    mockServerClient.from = vi.fn(() => mockQueryChain)

    const { getPublishedBranches } = await import('@/lib/data/public')
    const result = await getPublishedBranches()

    expect(result.data).toEqual(branches)
    expect(mockServerClient.from).toHaveBeenCalledWith('branches')
  })

  it('filters by region', async () => {
    mockQueryChain = createQueryChain({ data: [], error: null })
    mockServerClient.from = vi.fn(() => mockQueryChain)

    const { getPublishedBranches } = await import('@/lib/data/public')
    await getPublishedBranches({ region: 'กรุงเทพ' })

    expect(mockQueryChain.eq).toHaveBeenCalledWith('region', 'กรุงเทพ')
  })
})

describe('getPublishedFaqs', () => {
  it('groups FAQs by group_title', async () => {
    const faqs = [
      { id: '1', question: 'Q1', group_title: 'สินค้า' },
      { id: '2', question: 'Q2', group_title: 'สินค้า' },
      { id: '3', question: 'Q3', group_title: 'บริการ' },
    ]
    mockQueryChain = createQueryChain({ data: faqs, error: null })
    mockServerClient.from = vi.fn(() => mockQueryChain)

    const { getPublishedFaqs } = await import('@/lib/data/public')
    const result = await getPublishedFaqs()

    expect(result.data['สินค้า']).toHaveLength(2)
    expect(result.data['บริการ']).toHaveLength(1)
  })

  it('uses default group for null group_title', async () => {
    const faqs = [{ id: '1', question: 'Q1', group_title: null }]
    mockQueryChain = createQueryChain({ data: faqs, error: null })
    mockServerClient.from = vi.fn(() => mockQueryChain)

    const { getPublishedFaqs } = await import('@/lib/data/public')
    const result = await getPublishedFaqs()

    expect(result.data['ทั่วไป']).toHaveLength(1)
  })
})

describe('getPublishedHighlights', () => {
  it('returns paginated highlights', async () => {
    const highlights = [{ id: '1', title: 'Video 1' }]
    mockQueryChain = createQueryChain({ data: highlights, count: 1, error: null })
    mockServerClient.from = vi.fn(() => mockQueryChain)

    const { getPublishedHighlights } = await import('@/lib/data/public')
    const result = await getPublishedHighlights({ page: 1, perPage: 18 })

    expect(result.data).toEqual(highlights)
    expect(result.count).toBe(1)
    expect(mockServerClient.from).toHaveBeenCalledWith('video_highlights')
    expect(mockQueryChain.range).toHaveBeenCalledWith(0, 17)
  })
})

describe('getPublishedManuals', () => {
  it('returns paginated manuals', async () => {
    const manuals = [{ id: '1', title: 'Manual 1' }]
    mockQueryChain = createQueryChain({ data: manuals, count: 1, error: null })
    mockServerClient.from = vi.fn(() => mockQueryChain)

    const { getPublishedManuals } = await import('@/lib/data/public')
    const result = await getPublishedManuals({ page: 1, perPage: 10 })

    expect(result.data).toEqual(manuals)
    expect(mockServerClient.from).toHaveBeenCalledWith('manuals')
  })
})

describe('getPublishedGalleryItems', () => {
  it('returns gallery items', async () => {
    const items = [{ id: '1', image_url: 'img.jpg' }]
    mockQueryChain = createQueryChain({ data: items, error: null })
    mockServerClient.from = vi.fn(() => mockQueryChain)

    const { getPublishedGalleryItems } = await import('@/lib/data/public')
    const result = await getPublishedGalleryItems()

    expect(result.data).toEqual(items)
    expect(mockServerClient.from).toHaveBeenCalledWith('gallery_items')
  })
})

describe('getActiveBanners', () => {
  it('returns active banners', async () => {
    const banners = [{ id: '1', image_url: 'banner.jpg' }]
    mockQueryChain = createQueryChain({ data: banners, error: null })
    mockServerClient.from = vi.fn(() => mockQueryChain)

    const { getActiveBanners } = await import('@/lib/data/public')
    const result = await getActiveBanners()

    expect(result.data).toEqual(banners)
    expect(mockServerClient.from).toHaveBeenCalledWith('banners')
  })

  it('returns empty array on error', async () => {
    mockQueryChain = createQueryChain({ data: null, error: { message: 'err' } })
    mockServerClient.from = vi.fn(() => mockQueryChain)

    const { getActiveBanners } = await import('@/lib/data/public')
    const result = await getActiveBanners()

    expect(result.data).toEqual([])
    expect(result.error).toBe('err')
  })
})

describe('getAboutContent', () => {
  it('returns about us singleton', async () => {
    const about = { id: '1', company_name: 'WoodSmith' }
    mockQueryChain = createQueryChain({ data: about, error: null })
    mockServerClient.from = vi.fn(() => mockQueryChain)

    const { getAboutContent } = await import('@/lib/data/public')
    const result = await getAboutContent()

    expect(result.data).toEqual(about)
    expect(mockServerClient.from).toHaveBeenCalledWith('about_us')
    expect(mockQueryChain.single).toHaveBeenCalled()
  })

  it('returns null data for PGRST116 (no rows)', async () => {
    mockQueryChain = createQueryChain({ data: null, error: { code: 'PGRST116', message: 'no rows' } })
    mockServerClient.from = vi.fn(() => mockQueryChain)

    const { getAboutContent } = await import('@/lib/data/public')
    const result = await getAboutContent()

    expect(result.data).toBeNull()
    expect(result.error).toBeNull()
  })

  it('returns error for other errors', async () => {
    mockQueryChain = createQueryChain({ data: null, error: { code: 'OTHER', message: 'something' } })
    mockServerClient.from = vi.fn(() => mockQueryChain)

    const { getAboutContent } = await import('@/lib/data/public')
    const result = await getAboutContent()

    expect(result.error).toBe('something')
  })
})

describe('getProductCategories', () => {
  it('returns unique categories with counts', async () => {
    const products = [
      { category: 'ไม้แปรรูป', type: 'construction' },
      { category: 'ไม้แปรรูป', type: 'construction' },
      { category: 'กระเบื้อง', type: 'decoration' },
    ]
    mockQueryChain = createQueryChain({ data: products, error: null })
    mockServerClient.from = vi.fn(() => mockQueryChain)

    const { getProductCategories } = await import('@/lib/data/public')
    const result = await getProductCategories()

    expect(result.data).toHaveLength(2)
    const wood = result.data.find(c => c.name === 'ไม้แปรรูป')
    expect(wood.count).toBe(2)
    expect(wood.type).toBe('construction')
  })
})

describe('getBranchRegions', () => {
  it('returns unique regions', async () => {
    const branches = [
      { region: 'กรุงเทพ' },
      { region: 'กรุงเทพ' },
      { region: 'เชียงใหม่' },
      { region: null },
    ]
    mockQueryChain = createQueryChain({ data: branches, error: null })
    mockServerClient.from = vi.fn(() => mockQueryChain)

    const { getBranchRegions } = await import('@/lib/data/public')
    const result = await getBranchRegions()

    expect(result.data).toEqual(['กรุงเทพ', 'เชียงใหม่'])
  })

  it('returns empty array on error', async () => {
    mockQueryChain = createQueryChain({ data: null, error: { message: 'err' } })
    mockServerClient.from = vi.fn(() => mockQueryChain)

    const { getBranchRegions } = await import('@/lib/data/public')
    const result = await getBranchRegions()

    expect(result.data).toEqual([])
    expect(result.error).toBe('err')
  })
})
