import { z } from 'zod'

export const blogCategorySchema = z.object({
  name: z.string().min(1, 'กรุณาระบุชื่อหมวดหมู่'),
})

export const blogCategoryUpdateSchema = blogCategorySchema.partial()
