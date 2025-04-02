/* eslint-disable @typescript-eslint/no-explicit-any */
export type Credential = {
  id: string
  ownerID: string
  platform: string
  socialId: string
  credentials: {
    [key: string]: string
  }
  metadata: {
    avatar_url: string
    name: string
    [key: string]: any
  }
}
