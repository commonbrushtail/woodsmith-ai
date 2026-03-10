import { z } from 'zod'

export const quotationCreateSchema = z.object({
  product_id: z.string().regex(/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i, 'Invalid ID').nullable().optional(),
  requester_name: z.string().min(1, 'กรุณาระบุชื่อ'),
  requester_phone: z.string().min(9, 'เบอร์โทรต้องมีอย่างน้อย 9 หลัก').optional().or(z.literal('')),
  requester_email: z.string().email('รูปแบบอีเมลไม่ถูกต้อง').optional().or(z.literal('')),
  message: z.string().optional(),
  quantity: z.number().positive().nullable().optional(),
})

export const quotationStatusSchema = z.enum(['pending', 'approved', 'rejected'])
