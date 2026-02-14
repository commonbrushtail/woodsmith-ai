import { describe, it, expect } from 'vitest'
import { uploadFile, deleteFile, getPublicUrl } from '@/lib/storage'

describe('getPublicUrl', () => {
  it('returns a URL string for a given bucket and path', () => {
    const url = getPublicUrl('products', 'test-image.jpg')
    expect(url).toContain('products')
    expect(url).toContain('test-image.jpg')
    expect(url.startsWith('http')).toBe(true)
  })
})

describe('uploadFile', () => {
  it('uploads a file and returns the path', async () => {
    const file = new File(['test content'], 'test.txt', { type: 'text/plain' })
    const result = await uploadFile('products', file, 'test-uploads/test.txt')
    expect(result.path).toBeDefined()
    expect(result.error).toBeNull()

    // Cleanup
    await deleteFile('products', result.path)
  })

  it('returns error for invalid bucket', async () => {
    const file = new File(['test'], 'test.txt', { type: 'text/plain' })
    const result = await uploadFile('nonexistent-bucket', file, 'test.txt')
    expect(result.error).not.toBeNull()
  })
})

describe('deleteFile', () => {
  it('deletes an existing file without error', async () => {
    // Upload first
    const file = new File(['delete me'], 'delete-test.txt', { type: 'text/plain' })
    const { path } = await uploadFile('products', file, 'test-uploads/delete-test.txt')

    // Delete
    const result = await deleteFile('products', path)
    expect(result.error).toBeNull()
  })
})
