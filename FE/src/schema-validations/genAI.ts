import * as z from 'zod'

export const genAISettingSchema = z.object({
  tone: z.string().optional(),
  isUseEmoji: z.boolean().optional(),
  isUseHashtags: z.boolean().optional(),
  responseFormat: z.string().optional(),
  userDescription: z.string().optional()
})

export type GenAISettingSchema = z.infer<typeof genAISettingSchema>
