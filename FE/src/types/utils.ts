export interface EmojiEvent {
  id: string
  keywords: string[]
  name: string
  native: string
  shortcodes: string
  unified: string
}

export interface SuccessResponse<Data> {
  data: Data
  message: string
}
