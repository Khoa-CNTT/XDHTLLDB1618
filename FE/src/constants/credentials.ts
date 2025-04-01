export enum Platform {
  FACEBOOK = 'facebook',
  INSTAGRAM = 'instagram',
  REDDIT = 'reddit',
  THREADS = 'threads'
}

export type PlatformType = (typeof Platform)[keyof typeof Platform]
