export enum TokenType {
  ACCESS_TOKEN = 'accessToken'
}

export type TokenPayloadType = {
  role: string
  exp: number
  user_id: string
}
