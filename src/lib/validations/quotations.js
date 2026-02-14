import { z } from 'zod'

export const quotationCreateSchema = z.object({
  product_id: z.string().min(1),
  requester_name: z.string().min(1),
  requester_phone: z.string().min(1),
  requester_email: z.string().email().optional(),
  message: z.string().optional(),
  quantity: z.number().positive().optional(),
})

export const quotationStatusSchema = z.enum(['pending', 'approved', 'rejected'])
