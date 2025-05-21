export enum PostType {
  POST = 'post',
  STORY = 'story',
  REEL = 'reel'
}

export const POST_STATUS = {
  SCHEDULED: 'scheduled',
  PUBLISHED: 'published',
  ACTIVE: 'active'
} as const

export type PostStatus = (typeof POST_STATUS)[keyof typeof POST_STATUS]

export const CHARACTER_LIMITS: Record<string, number> = {
  facebook: 5000,
  instagram: 2200,
  x: 280,
  thread: 500,
  reddit: 40000
}
