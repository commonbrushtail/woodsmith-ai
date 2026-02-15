import { z } from 'zod'

export const variationGroupSchema = z.object({
  name: z.string().min(1, 'กรุณาระบุชื่อกลุ่มตัวเลือก'),
})

export const variationGroupUpdateSchema = variationGroupSchema.partial()

export const variationEntrySchema = z.object({
  label: z.string().min(1, 'กรุณาระบุชื่อตัวเลือก'),
  group_id: z.string().uuid('รหัสกลุ่มไม่ถูกต้อง'),
  image_url: z.string().url().nullable().optional(),
  sort_order: z.number().int().optional(),
})

export const variationEntryUpdateSchema = variationEntrySchema.partial().omit({ group_id: true })
