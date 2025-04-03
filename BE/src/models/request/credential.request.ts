export interface CreateCredentialRequestBody {
  platform: string
  socialId: string
  credential: {
    code: string
    [key: string]: any
  }
  metadata: {
    avatar_url: string
    name: string
    [key: string]: any
  }
}

export interface GetCredentialRequestQuery {
  platform?: string
}
