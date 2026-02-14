import { describe, it, expect } from 'vitest'
import { productCreateSchema, productUpdateSchema } from '@/lib/validations/products'

describe('productCreateSchema', () => {
  it('accepts valid product data', () => {
    const valid = {
      name: 'ไม้สักทอง',
      code: 'TEAK-001',
      sku: 'WS-TEAK-001',
      type: 'construction',
      category: 'ไม้แปรรูป',
    }
    const result = productCreateSchema.safeParse(valid)
    expect(result.success).toBe(true)
  })

  it('rejects missing required fields', () => {
    const result = productCreateSchema.safeParse({})
    expect(result.success).toBe(false)
    expect(result.error.issues.length).toBeGreaterThan(0)
  })

  it('rejects empty name', () => {
    const result = productCreateSchema.safeParse({ name: '', code: 'X', sku: 'Y', type: 'construction', category: 'cat' })
    expect(result.success).toBe(false)
  })

  it('accepts optional fields as undefined', () => {
    const valid = {
      name: 'Test',
      code: 'T-001',
      sku: 'WS-T-001',
      type: 'construction',
      category: 'cat',
    }
    const result = productCreateSchema.safeParse(valid)
    expect(result.success).toBe(true)
    expect(result.data.description).toBeUndefined()
  })

  it('validates publish dates when provided', () => {
    const valid = {
      name: 'Test',
      code: 'T-001',
      sku: 'WS-T-001',
      type: 'construction',
      category: 'cat',
      publish_start: '2026-01-01',
      publish_end: '2026-12-31',
    }
    const result = productCreateSchema.safeParse(valid)
    expect(result.success).toBe(true)
  })
})

describe('productUpdateSchema', () => {
  it('allows partial updates (all fields optional)', () => {
    const result = productUpdateSchema.safeParse({ name: 'Updated name' })
    expect(result.success).toBe(true)
  })

  it('rejects invalid types for known fields', () => {
    const result = productUpdateSchema.safeParse({ sort_order: 'not-a-number' })
    expect(result.success).toBe(false)
  })
})
