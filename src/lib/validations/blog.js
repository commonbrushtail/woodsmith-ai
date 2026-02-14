import { z } from 'zod'

export const blogCreateSchema = z.object({
  title: z.string().min(1, 'กรุณาระบุชื่อบทความ'),
  content: z.string().optional(),
  slug: z.string().optional(),
  category: z.string().optional().nullable(),
  cover_image: z.string().optional(),
  recommended: z.boolean().optional(),
  published: z.boolean().optional(),
  publish_date: z.string().optional().nullable(),
})

export const blogUpdateSchema = blogCreateSchema.partial()
