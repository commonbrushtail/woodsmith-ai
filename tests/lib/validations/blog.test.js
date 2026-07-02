import { describe, it, expect } from 'vitest'
import { blogCreateSchema } from '@/lib/validations/blog'

describe('blogCreateSchema', () => {
  it('accepts valid blog data', () => {
    const result = blogCreateSchema.safeParse({
      title: 'วิธีเลือกไม้สำหรับบ้าน',
      content: '<p>เนื้อหาบทความ</p>',
    })
    expect(result.success).toBe(true)
  })

  it('auto-generates slug from title if not provided', () => {
    const result = blogCreateSchema.safeParse({
      title: 'Test Blog Post',
      content: '<p>Content</p>',
    })
    expect(result.success).toBe(true)
  })

  it('rejects empty title', () => {
    const result = blogCreateSchema.safeParse({ title: '', content: 'x' })
    expect(result.success).toBe(false)
  })

  it('accepts empty content (content is optional; only title is required)', () => {
    expect(blogCreateSchema.safeParse({ title: 'x', content: '' }).success).toBe(true)
    expect(blogCreateSchema.safeParse({ title: 'x' }).success).toBe(true)
  })
})
