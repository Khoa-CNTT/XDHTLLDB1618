import { Platform } from '@/constants/credentials'

import { Post } from './post'

export interface EmojiEvent {
  id: string
  keywords: string[]
  name: string
  native: string
  shortcodes: string
  unified: string
}

export interface SuccessResponse<Data> {
  data: Data
  message: string
}

export interface Statistical {
  totalPosts: number
  postsByPlatform: {
    [key in keyof typeof Platform]: number
  }
  recentPosts: Post[]
  postsByTimeRange: {
    [key: string]: number
  }
}
