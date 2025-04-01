import { PostType } from '@/constants/post'
import * as z from 'zod'

const ImagePreviewSchema = z.object({
  file: z.instanceof(File),
  preview: z.string()
})

export const postSchema = z.object({
  type: z.enum(Object.values(PostType) as [string, ...string[]]),
  description: z.string().min(1, { message: 'Description is required' }),
  scheduledDate: z.date({ required_error: 'Date is required' }),
  scheduledTime: z.string().min(1, { message: 'Time is required' }),
  images: z.array(ImagePreviewSchema).optional(),
  scheduleAll: z.boolean().optional(),
  selectedPages: z.array(z.string()).optional()
})

export type PostSchema = z.infer<typeof postSchema>
