import { describe, it, expect, vi, beforeEach } from 'vitest'

// --- Mocks ---
const mockRevalidatePath = vi.fn()
vi.mock('next/cache', () => ({ revalidatePath: (...args) => mockRevalidatePath(...args) }))

// Build a chainable Supabase mock
function createChain(finalResult = { data: null, error: null, count: 0 }) {
  const chain = {}
  const methods = ['from', 'select', 'insert', 'update', 'delete', 'eq', 'or', 'ilike', 'order', 'range', 'single']
  for (const m of methods) {
    chain[m] = vi.fn(() => chain)
  }
  // Make the chain thenable so `await query` resolves to finalResult
  chain.then = (resolve) => resolve(finalResult)
  return chain
}

let mockAdmin
vi.mock('@/lib/supabase/admin', () => ({
  createServiceClient: vi.fn(() => mockAdmin),
}))

const mockUploadFile = vi.fn()
const mockDeleteFile = vi.fn()
const mockGetPublicUrl = vi.fn()
vi.mock('@/lib/storage', () => ({
  uploadFile: (...args) => mockUploadFile(...args),
  deleteFile: (...args) => mockDeleteFile(...args),
  getPublicUrl: (...args) => mockGetPublicUrl(...args),
}))

// Helper: create a FormData-like object
function fakeFormData(obj) {
  const map = new Map(Object.entries(obj))
  return {
    get: (key) => (map.has(key) ? map.get(key) : null),
    has: (key) => map.has(key),
  }
}

beforeEach(() => {
  vi.clearAllMocks()
  mockAdmin = createChain()
})

// --- Tests ---
describe('getProducts', () => {
  it('returns paginated products on success', async () => {
    const rows = [{ id: '1', name: 'Wood A' }]
    mockAdmin = createChain({ data: rows, count: 1, error: null })

    const { getProducts } = await import('@/lib/actions/products')
    const result = await getProducts({ page: 1, perPage: 10 })

    expect(result.data).toEqual(rows)
    expect(result.count).toBe(1)
    expect(result.error).toBeNull()
    expect(mockAdmin.from).toHaveBeenCalledWith('products')
    expect(mockAdmin.range).toHaveBeenCalledWith(0, 9)
  })

  it('applies search filter when search term provided', async () => {
    mockAdmin = createChain({ data: [], count: 0, error: null })
    const { getProducts } = await import('@/lib/actions/products')
    await getProducts({ search: 'plywood' })

    expect(mockAdmin.or).toHaveBeenCalledWith(
      'name.ilike.%plywood%,code.ilike.%plywood%,sku.ilike.%plywood%'
    )
  })

  it('returns error on Supabase failure', async () => {
    mockAdmin = createChain({ data: null, count: null, error: { message: 'DB error' } })
    const { getProducts } = await import('@/lib/actions/products')
    const result = await getProducts()

    expect(result.error).toBe('DB error')
    expect(result.data).toEqual([])
  })

  it('calculates correct range for page 3', async () => {
    mockAdmin = createChain({ data: [], count: 0, error: null })
    const { getProducts } = await import('@/lib/actions/products')
    await getProducts({ page: 3, perPage: 5 })

    expect(mockAdmin.range).toHaveBeenCalledWith(10, 14)
  })
})

describe('getProduct', () => {
  it('returns a single product by ID', async () => {
    const product = { id: 'abc', name: 'Test Product' }
    mockAdmin = createChain({ data: product, error: null })

    const { getProduct } = await import('@/lib/actions/products')
    const result = await getProduct('abc')

    expect(result.data).toEqual(product)
    expect(result.error).toBeNull()
    expect(mockAdmin.eq).toHaveBeenCalledWith('id', 'abc')
    expect(mockAdmin.single).toHaveBeenCalled()
  })

  it('returns error when product not found', async () => {
    mockAdmin = createChain({ data: null, error: { message: 'not found' } })
    const { getProduct } = await import('@/lib/actions/products')
    const result = await getProduct('missing')

    expect(result.data).toBeNull()
    expect(result.error).toBe('not found')
  })
})

describe('createProduct', () => {
  it('validates and inserts a product', async () => {
    const product = { id: 'new-1', name: 'Board' }
    mockAdmin = createChain({ data: product, error: null })

    const { createProduct } = await import('@/lib/actions/products')
    const fd = fakeFormData({
      name: 'Board',
      code: 'BRD-001',
      sku: 'SKU-001',
      type: 'construction',
      category: 'ไม้แปรรูป',
      description: 'A board',
      characteristics: '',
      specifications: '',
      recommended: 'false',
      published: 'false',
      publish_start: '',
      publish_end: '',
    })

    const result = await createProduct(fd)
    expect(result.data).toEqual(product)
    expect(result.error).toBeNull()
    expect(mockAdmin.insert).toHaveBeenCalled()
    expect(mockRevalidatePath).toHaveBeenCalledWith('/admin/products')
  })

  it('returns validation errors for missing required fields', async () => {
    const { createProduct } = await import('@/lib/actions/products')
    const fd = fakeFormData({ name: '', code: '', sku: '', type: 'construction', category: '' })

    const result = await createProduct(fd)
    expect(result.error).toBe('ข้อมูลไม่ถูกต้อง')
    expect(result.fieldErrors).toBeDefined()
    expect(result.fieldErrors.name).toBeDefined()
  })

  it('inserts product options when provided', async () => {
    const product = { id: 'p-1', name: 'Board' }
    mockAdmin = createChain({ data: product, error: null })

    const { createProduct } = await import('@/lib/actions/products')
    const options = JSON.stringify([{ type: 'color', label: 'Red' }, { type: 'size', label: 'Large' }])
    const fd = fakeFormData({
      name: 'Board',
      code: 'BRD-002',
      sku: 'SKU-002',
      type: 'construction',
      category: 'ไม้แปรรูป',
      options,
    })

    await createProduct(fd)

    // insert called twice: once for product, once for options
    expect(mockAdmin.insert).toHaveBeenCalledTimes(2)
  })

  it('returns Supabase error on insert failure', async () => {
    mockAdmin = createChain({ data: null, error: { message: 'duplicate key' } })

    const { createProduct } = await import('@/lib/actions/products')
    const fd = fakeFormData({
      name: 'Board',
      code: 'BRD-003',
      sku: 'SKU-003',
      type: 'construction',
      category: 'ไม้แปรรูป',
    })

    const result = await createProduct(fd)
    expect(result.error).toBe('duplicate key')
  })
})

describe('updateProduct', () => {
  it('updates fields and revalidates paths', async () => {
    const updated = { id: 'u-1', name: 'Updated Board' }
    mockAdmin = createChain({ data: updated, error: null })

    const { updateProduct } = await import('@/lib/actions/products')
    const fd = fakeFormData({ name: 'Updated Board' })

    const result = await updateProduct('u-1', fd)
    expect(result.data).toEqual(updated)
    expect(mockAdmin.update).toHaveBeenCalled()
    expect(mockRevalidatePath).toHaveBeenCalledWith('/admin/products')
    expect(mockRevalidatePath).toHaveBeenCalledWith('/admin/products/edit/u-1')
  })

  it('replaces product options when options field is provided', async () => {
    mockAdmin = createChain({ data: { id: 'u-2' }, error: null })

    const { updateProduct } = await import('@/lib/actions/products')
    const fd = fakeFormData({
      name: 'Board',
      options: JSON.stringify([{ type: 'color', label: 'Blue' }]),
    })

    await updateProduct('u-2', fd)

    // delete old options + insert new ones
    expect(mockAdmin.delete).toHaveBeenCalled()
    expect(mockAdmin.insert).toHaveBeenCalled()
  })
})

describe('deleteProduct', () => {
  it('deletes product images from storage then deletes product', async () => {
    // First call: select images; second call: delete product
    const images = [{ url: 'https://storage.com/products/p1/img.png' }]
    mockAdmin = createChain({ data: images, error: null })
    mockDeleteFile.mockResolvedValue({})

    const { deleteProduct } = await import('@/lib/actions/products')
    const result = await deleteProduct('d-1')

    expect(result.error).toBeNull()
    expect(mockDeleteFile).toHaveBeenCalledWith('products', 'p1/img.png')
    expect(mockAdmin.delete).toHaveBeenCalled()
    expect(mockRevalidatePath).toHaveBeenCalledWith('/admin/products')
  })

  it('returns error on Supabase delete failure', async () => {
    mockAdmin = createChain({ data: null, error: { message: 'FK constraint' } })

    const { deleteProduct } = await import('@/lib/actions/products')
    const result = await deleteProduct('d-2')

    expect(result.error).toBe('FK constraint')
  })
})

describe('toggleProductRecommended', () => {
  it('updates recommended flag', async () => {
    mockAdmin = createChain({ error: null })

    const { toggleProductRecommended } = await import('@/lib/actions/products')
    const result = await toggleProductRecommended('t-1', true)

    expect(result.error).toBeNull()
    expect(mockAdmin.update).toHaveBeenCalledWith({ recommended: true })
    expect(mockRevalidatePath).toHaveBeenCalledWith('/admin/products')
  })
})

describe('toggleProductPublished', () => {
  it('updates published flag', async () => {
    mockAdmin = createChain({ error: null })

    const { toggleProductPublished } = await import('@/lib/actions/products')
    const result = await toggleProductPublished('t-2', false)

    expect(result.error).toBeNull()
    expect(mockAdmin.update).toHaveBeenCalledWith({ published: false })
  })
})

describe('uploadProductImage', () => {
  it('uploads file and inserts image record', async () => {
    mockUploadFile.mockResolvedValue({ path: 'p1/123.jpg', error: null })
    mockGetPublicUrl.mockReturnValue('https://storage.com/products/p1/123.jpg')
    mockAdmin = createChain({ data: [], error: null })

    const { uploadProductImage } = await import('@/lib/actions/products')
    const fd = fakeFormData({ file: { name: 'photo.jpg', size: 1024 } })
    const result = await uploadProductImage('p1', fd)

    expect(result.url).toBe('https://storage.com/products/p1/123.jpg')
    expect(result.error).toBeNull()
    expect(mockUploadFile).toHaveBeenCalledWith('products', { name: 'photo.jpg', size: 1024 }, expect.stringContaining('p1/'))
  })

  it('returns error when no file provided', async () => {
    const { uploadProductImage } = await import('@/lib/actions/products')
    const fd = fakeFormData({})
    const result = await uploadProductImage('p1', fd)

    expect(result.error).toBe('No file provided')
  })

  it('returns upload error', async () => {
    mockUploadFile.mockResolvedValue({ path: null, error: { message: 'Too large' } })

    const { uploadProductImage } = await import('@/lib/actions/products')
    const fd = fakeFormData({ file: { name: 'big.jpg', size: 999999 } })
    const result = await uploadProductImage('p1', fd)

    expect(result.error).toBe('Too large')
  })
})

describe('deleteProductImage', () => {
  it('deletes image from storage and database', async () => {
    mockAdmin = createChain({ data: { url: 'https://s.com/products/p1/img.jpg', product_id: 'p1' }, error: null })
    mockDeleteFile.mockResolvedValue({})

    const { deleteProductImage } = await import('@/lib/actions/products')
    const result = await deleteProductImage('img-1')

    expect(result.error).toBeNull()
    expect(mockDeleteFile).toHaveBeenCalledWith('products', 'p1/img.jpg')
    expect(mockAdmin.delete).toHaveBeenCalled()
  })
})
