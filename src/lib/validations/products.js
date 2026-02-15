import { z } from 'zod'

export const productCreateSchema = z.object({
  name: z.string().min(1, 'กรุณาระบุชื่อสินค้า'),
  code: z.string().min(1, 'กรุณาระบุรหัสสินค้า'),
  sku: z.string().min(1, 'กรุณาระบุ SKU'),
  slug: z.string().min(1, 'กรุณาระบุ Slug'),
  type: z.enum(['construction', 'decoration', 'tool'], { errorMap: () => ({ message: 'ประเภทสินค้าไม่ถูกต้อง' }) }),
  category: z.string().min(1, 'กรุณาระบุหมวดหมู่'),
  description: z.string().optional(),
  price: z.number().positive('ราคาต้องมากกว่า 0').optional().nullable(),
  sort_order: z.number().int().optional().nullable(),
  published: z.boolean().optional(),
  publish_start: z.string().optional().nullable(),
  publish_end: z.string().optional().nullable(),
})

export const productUpdateSchema = productCreateSchema.partial()
