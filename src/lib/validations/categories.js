import { z } from 'zod'

export const categoryCreateSchema = z.object({
  name: z.string().min(1, 'กรุณาระบุชื่อหมวดหมู่'),
  slug: z.string().min(1, 'กรุณาระบุ slug'),
  type: z.enum(['construction', 'decoration'], {
    errorMap: () => ({ message: 'ประเภทไม่ถูกต้อง' }),
  }),
  parent_id: z.string().regex(/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i, 'Invalid ID').nullable().optional(),
  sort_order: z.number().int().optional(),
  published: z.boolean().optional(),
  is_featured: z.boolean().optional(),
})

export const categoryUpdateSchema = categoryCreateSchema.partial()
