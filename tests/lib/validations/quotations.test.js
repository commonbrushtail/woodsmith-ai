import { describe, it, expect } from 'vitest'
import { quotationCreateSchema, quotationStatusSchema } from '@/lib/validations/quotations'

describe('quotationCreateSchema', () => {
  it('accepts valid quotation data', () => {
    const result = quotationCreateSchema.safeParse({
      product_id: '11111111-1111-4111-8111-111111111111',
      requester_name: 'สมชาย',
      requester_phone: '+66812345678',
    })
    expect(result.success).toBe(true)
  })

  it('rejects missing requester_name', () => {
    // product_id is optional (general/non-product quote requests are allowed);
    // requester_name is the one genuinely required field.
    const result = quotationCreateSchema.safeParse({
      requester_phone: '+66812345678',
    })
    expect(result.success).toBe(false)
  })
})

describe('quotationStatusSchema', () => {
  it('accepts valid status values', () => {
    expect(quotationStatusSchema.safeParse('pending').success).toBe(true)
    expect(quotationStatusSchema.safeParse('approved').success).toBe(true)
    expect(quotationStatusSchema.safeParse('rejected').success).toBe(true)
  })

  it('rejects invalid status', () => {
    expect(quotationStatusSchema.safeParse('cancelled').success).toBe(false)
  })
})
