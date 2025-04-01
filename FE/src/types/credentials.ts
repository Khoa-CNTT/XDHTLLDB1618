export type Credential = {
  id: string
  ownerID: string
  platform: string
  credential: {
    page_id: string
    page_name: string
    threads_profile_picture_url?: string
    username?: string
  }
  metadata: {
    page_id: string
    page_name: string
    fan_count: number
    picture: {
      height: number
      width: number
      url: string
    }
  }
}
