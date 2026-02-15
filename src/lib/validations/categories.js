import { z } from 'zod'

export const categoryCreateSchema = z.object({
  name: z.string().min(1, 'กรุณาระบุชื่อหมวดหมู่'),
  slug: z.string().min(1, 'กรุณาระบุ slug'),
  type: z.enum(['construction', 'decoration', 'tool'], {
    errorMap: () => ({ message: 'ประเภทไม่ถูกต้อง' }),
  }),
  parent_id: z.string().uuid().nullable().optional(),
  sort_order: z.number().int().optional(),
  published: z.boolean().optional(),
  is_featured: z.boolean().optional(),
})

export const categoryUpdateSchema = categoryCreateSchema.partial()
