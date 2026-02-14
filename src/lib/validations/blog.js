import { z } from 'zod'

export const blogCreateSchema = z.object({
  title: z.string().min(1),
  content: z.string().min(1),
  slug: z.string().optional(),
  excerpt: z.string().optional(),
  cover_image: z.string().optional(),
  published: z.boolean().optional(),
  publish_date: z.string().optional(),
})
