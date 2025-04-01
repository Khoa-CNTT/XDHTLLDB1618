export enum PostType {
  POST = 'post',
  STORY = 'story',
  REEL = 'reel'
}

export const POST_STATUS = {
  SCHEDULED: 'scheduled',
  PUBLISHED: 'published'
} as const

export type PostStatus = (typeof POST_STATUS)[keyof typeof POST_STATUS]
