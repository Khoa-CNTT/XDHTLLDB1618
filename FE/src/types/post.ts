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
