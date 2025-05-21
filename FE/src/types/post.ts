/* eslint-disable @typescript-eslint/no-explicit-any */
export type Post = {
  id: string
  ownerID: string
  platform: string
  status: string
  publicationTime: string
  socialCredentialID: string
  socialCredential: {
    metadata: {
      avatar_url: string
      name: string
      [key: string]: any
    }
  }
  publishedPost: any
  metadata: {
    type: string
    content: string
    assets: {
      type: string
      url: string
    }[]
    [key: string]: any
  }
  recurringPostId?: string
  recurringPost?: any
}

export type CreatePostRequest = {
  publicationTime: string
  socialPosts: {
    platform: string
    socialCredentialID: string
    metadata: {
      type: string
      content: string
      assets: {
        type: string
        url: string
      }[]
    }
  }[]
}

export type UpdatePostRequest = {
  publicationTime: string
  metadata: {
    type: string
    content: string
    assets: {
      type: string
      url: string
    }[]
  }
}

export type RecurringPost = {
  id: string
  frequency: 'daily' | 'weekly'
  daysOfWeek?: number[]
  startDate: string
  endDate: string
  status: string
  lastScheduledDate: string
  metadata: {
    type: string
    content: string
    assets: {
      type: string
      url: string
    }[]
    [key: string]: any
  }
  platform: string
  publicationTime: string
  socialCredentialID: string
  socialCredential: any
}
export type CreateRecurringRequest = {
  socialPosts: {
    platform: string
    socialCredentialID: string
    metadata: {
      type: string
      content: string
      assets: { type: string; url: string }[]
    }
  }[]
  publicationTime: string
  recurring: {
    frequency: 'daily' | 'weekly'
    daysOfWeek?: number[]
    startDate: string
    endDate: string
  }
}

export type UpdateRecurringRequest = {
  publicationTime: string
  metadata: {
    type: string
    content: string
    assets: { type: string; url: string }[]
  }
  recurring: {
    frequency: 'daily' | 'weekly'
    daysOfWeek?: number[]
    startDate: string
    endDate: string
  }
}

export type RecurringPostInstance = {
  id: string
  publicationTime: string
  metadata: {
    type: string
    content: string
    assets: { type: string; url: string }[]
  }
  status: string
  recurringPostId: string
}
