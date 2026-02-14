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

// Admin uses createServiceClient (sync) — chain includes .from()
let mockAdminQueryChain
let mockAdmin

// Server uses createClient (async, awaited) — client is NOT thenable
let mockServerClient

vi.mock('@/lib/supabase/admin', () => ({
  createServiceClient: vi.fn(() => mockAdmin),
}))
vi.mock('@/lib/supabase/server', () => ({
  createClient: vi.fn(async () => mockServerClient),
}))

const mockUploadFile = vi.fn()
const mockDeleteFile = vi.fn()
const mockGetPublicUrl = vi.fn()
vi.mock('@/lib/storage', () => ({
  uploadFile: (...args) => mockUploadFile(...args),
  deleteFile: (...args) => mockDeleteFile(...args),
  getPublicUrl: (...args) => mockGetPublicUrl(...args),
}))

function fakeFormData(obj) {
  const map = new Map(Object.entries(obj))
  return {
    get: (key) => (map.has(key) ? map.get(key) : null),
    has: (key) => map.has(key),
  }
}

beforeEach(() => {
  vi.clearAllMocks()

  mockAdminQueryChain = createQueryChain()
  mockAdmin = { from: vi.fn(() => mockAdminQueryChain) }

  mockServerClient = {
    from: vi.fn(() => createQueryChain()),
    auth: {
      getUser: vi.fn().mockResolvedValue({ data: { user: { id: 'user-1' } } }),
    },
  }
})

// --- Tests ---
describe('getBlogPosts', () => {
  it('returns paginated blog posts', async () => {
    const posts = [{ id: '1', title: 'Post 1' }]
    mockAdminQueryChain = createQueryChain({ data: posts, count: 1, error: null })
    mockAdmin.from = vi.fn(() => mockAdminQueryChain)

    const { getBlogPosts } = await import('@/lib/actions/blog')
    const result = await getBlogPosts({ page: 1, perPage: 10 })

    expect(result.data).toEqual(posts)
    expect(result.count).toBe(1)
    expect(result.error).toBeNull()
    expect(mockAdmin.from).toHaveBeenCalledWith('blog_posts')
  })

  it('applies search filter', async () => {
    mockAdminQueryChain = createQueryChain({ data: [], count: 0, error: null })
    mockAdmin.from = vi.fn(() => mockAdminQueryChain)

    const { getBlogPosts } = await import('@/lib/actions/blog')
    await getBlogPosts({ search: 'wood' })

    expect(mockAdminQueryChain.ilike).toHaveBeenCalledWith('title', '%wood%')
  })

  it('returns error on failure', async () => {
    mockAdminQueryChain = createQueryChain({ data: null, count: null, error: { message: 'timeout' } })
    mockAdmin.from = vi.fn(() => mockAdminQueryChain)

    const { getBlogPosts } = await import('@/lib/actions/blog')
    const result = await getBlogPosts()

    expect(result.error).toBe('timeout')
    expect(result.data).toEqual([])
  })
})

describe('getBlogPost', () => {
  it('returns a single post by ID', async () => {
    const post = { id: 'bp-1', title: 'Guide' }
    mockAdminQueryChain = createQueryChain({ data: post, error: null })
    mockAdmin.from = vi.fn(() => mockAdminQueryChain)

    const { getBlogPost } = await import('@/lib/actions/blog')
    const result = await getBlogPost('bp-1')

    expect(result.data).toEqual(post)
    expect(mockAdminQueryChain.eq).toHaveBeenCalledWith('id', 'bp-1')
    expect(mockAdminQueryChain.single).toHaveBeenCalled()
  })
})

describe('createBlogPost', () => {
  it('validates and inserts a blog post with auto-generated slug', async () => {
    const newPost = { id: 'new-1', title: 'My Post' }
    mockAdminQueryChain = createQueryChain({ data: newPost, error: null })
    mockAdmin.from = vi.fn(() => mockAdminQueryChain)

    const { createBlogPost } = await import('@/lib/actions/blog')
    const fd = fakeFormData({
      title: 'My Post',
      content: 'Some content',
      category: 'tips',
      recommended: 'false',
      published: 'false',
    })

    const result = await createBlogPost(fd)
    expect(result.data).toEqual(newPost)
    expect(result.error).toBeNull()

    // Check the insert was called with a slug containing the title
    const insertCall = mockAdminQueryChain.insert.mock.calls[0][0]
    expect(insertCall.slug).toContain('my-post')
    expect(insertCall.title).toBe('My Post')
    expect(mockRevalidatePath).toHaveBeenCalledWith('/admin/blog')
  })

  it('returns validation error for empty title', async () => {
    const { createBlogPost } = await import('@/lib/actions/blog')
    const fd = fakeFormData({ title: '' })

    const result = await createBlogPost(fd)
    expect(result.error).toBe('ข้อมูลไม่ถูกต้อง')
    expect(result.fieldErrors).toBeDefined()
    expect(result.fieldErrors.title).toBeDefined()
  })

  it('handles cover image upload', async () => {
    mockAdminQueryChain = createQueryChain({ data: { id: 'new-2' }, error: null })
    mockAdmin.from = vi.fn(() => mockAdminQueryChain)
    mockUploadFile.mockResolvedValue({ path: 'blog/123.jpg', error: null })
    mockGetPublicUrl.mockReturnValue('https://s.com/blog/123.jpg')

    const { createBlogPost } = await import('@/lib/actions/blog')
    const fd = fakeFormData({
      title: 'With Image',
      cover_image: { name: 'photo.jpg', size: 2048 },
    })

    const result = await createBlogPost(fd)
    expect(result.data).toBeDefined()
    expect(mockUploadFile).toHaveBeenCalled()

    const insertCall = mockAdminQueryChain.insert.mock.calls[0][0]
    expect(insertCall.cover_image_url).toBe('https://s.com/blog/123.jpg')
  })

  it('returns error on upload failure', async () => {
    mockUploadFile.mockResolvedValue({ path: null, error: { message: 'Size limit' } })

    const { createBlogPost } = await import('@/lib/actions/blog')
    const fd = fakeFormData({
      title: 'Fail Upload',
      cover_image: { name: 'big.jpg', size: 99999 },
    })

    const result = await createBlogPost(fd)
    expect(result.error).toBe('Size limit')
  })
})

describe('updateBlogPost', () => {
  it('updates specified fields', async () => {
    mockAdminQueryChain = createQueryChain({ data: { id: 'u-1', title: 'Updated' }, error: null })
    mockAdmin.from = vi.fn(() => mockAdminQueryChain)

    const { updateBlogPost } = await import('@/lib/actions/blog')
    const fd = fakeFormData({ title: 'Updated', content: 'New content' })

    const result = await updateBlogPost('u-1', fd)
    expect(result.data.title).toBe('Updated')
    expect(mockAdminQueryChain.update).toHaveBeenCalled()
    expect(mockRevalidatePath).toHaveBeenCalledWith('/admin/blog')
  })
})

describe('deleteBlogPost', () => {
  it('deletes cover image from storage and removes post', async () => {
    mockAdminQueryChain = createQueryChain({ data: { cover_image_url: 'https://s.com/blog/abc.jpg' }, error: null })
    mockAdmin.from = vi.fn(() => mockAdminQueryChain)
    mockDeleteFile.mockResolvedValue({})

    const { deleteBlogPost } = await import('@/lib/actions/blog')
    const result = await deleteBlogPost('d-1')

    expect(result.error).toBeNull()
    expect(mockDeleteFile).toHaveBeenCalledWith('blog', 'abc.jpg')
    expect(mockRevalidatePath).toHaveBeenCalledWith('/admin/blog')
  })

  it('handles post without cover image', async () => {
    mockAdminQueryChain = createQueryChain({ data: { cover_image_url: null }, error: null })
    mockAdmin.from = vi.fn(() => mockAdminQueryChain)

    const { deleteBlogPost } = await import('@/lib/actions/blog')
    const result = await deleteBlogPost('d-2')

    expect(result.error).toBeNull()
    expect(mockDeleteFile).not.toHaveBeenCalled()
  })
})

describe('toggleBlogRecommended', () => {
  it('updates recommended flag', async () => {
    mockAdminQueryChain = createQueryChain({ error: null })
    mockAdmin.from = vi.fn(() => mockAdminQueryChain)

    const { toggleBlogRecommended } = await import('@/lib/actions/blog')
    const result = await toggleBlogRecommended('t-1', true)

    expect(result.error).toBeNull()
    expect(mockAdminQueryChain.update).toHaveBeenCalledWith({ recommended: true })
  })
})

describe('toggleBlogPublished', () => {
  it('updates published flag', async () => {
    mockAdminQueryChain = createQueryChain({ error: null })
    mockAdmin.from = vi.fn(() => mockAdminQueryChain)

    const { toggleBlogPublished } = await import('@/lib/actions/blog')
    const result = await toggleBlogPublished('t-2', false)

    expect(result.error).toBeNull()
    expect(mockAdminQueryChain.update).toHaveBeenCalledWith({ published: false })
  })
})
