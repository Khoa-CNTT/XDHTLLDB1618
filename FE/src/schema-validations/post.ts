import { PostType } from '@/constants/post'
import * as z from 'zod'

const ImagePreviewSchema = z.object({
  file: z.instanceof(File),
  preview: z.string()
})

export const createPostSchema = (t: (key: string) => string) => {
  return z.object({
    type: z.enum(Object.values(PostType) as [string, ...string[]]),
    description: z.string().min(1, { message: t('descriptionRequired') }),
    scheduledDate: z.date({ required_error: t('dateRequired') }),
    scheduledTime: z.string().min(1, { message: t('timeRequired') }),
    images: z.array(ImagePreviewSchema).optional(),
    scheduleAll: z.boolean().optional(),
    selectedPages: z.array(z.string()).optional(),
    isRecurring: z.boolean().default(false),
    recurringType: z.enum(['daily', 'weekly']).default('daily'),
    recurringDays: z.array(z.string()).default([]),
    recurringDateRange: z
      .object({
        from: z.date().optional(),
        to: z.date().optional()
      })
      .optional(),
    updateType: z.enum(['single', 'all']).optional()
  })
}

export type PostSchema = z.infer<ReturnType<typeof createPostSchema>>
