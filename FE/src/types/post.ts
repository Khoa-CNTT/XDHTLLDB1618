export type Post = {
  id: string
  ownerID: string
  platform: string
  status: string
  publicationTime: string
  socialCredentialID: string
  metadata: {
    page_name: string
    type: string
    content: string
    assets: {
      type: string
      url: string
    }[]
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
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
