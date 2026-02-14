import { z } from 'zod'

export const productCreateSchema = z.object({
  name: z.string().min(1),
  code: z.string().min(1),
  sku: z.string().min(1),
  type: z.enum(['construction', 'decoration', 'tool']),
  category: z.string().min(1),
  description: z.string().optional(),
  price: z.number().positive().optional(),
  sort_order: z.number().int().optional(),
  published: z.boolean().optional(),
  publish_start: z.string().optional(),
  publish_end: z.string().optional(),
})

export const productUpdateSchema = productCreateSchema.partial()
