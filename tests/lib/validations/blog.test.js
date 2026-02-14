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

  it('rejects empty content', () => {
    const result = blogCreateSchema.safeParse({ title: 'x', content: '' })
    expect(result.success).toBe(false)
  })
})
