export enum Platform {
  FACEBOOK = 'facebook',
  INSTAGRAM = 'instagram',
  REDDIT = 'reddit',
  THREADS = 'threads',
  X = 'x'
}

export type PlatformType = (typeof Platform)[keyof typeof Platform]
