import { PLATFORM_TYPE } from '@/constants'
import http from '@/utils/http'

import { CreatePostRequest, Post } from '@/types/post'

export type GetPostsParams = {
  platform: (typeof PLATFORM_TYPE)[keyof typeof PLATFORM_TYPE]
  publicationStartDate?: string
  publicationEndDate?: string
}

const postApi = {
  getPosts(params?: GetPostsParams) {
    return http.get<Post[]>('/posts', { params })
  },
  createPost(data: CreatePostRequest) {
    return http.post('/schedule', data)
  },
  getPostsServer(accessToken: string, params?: GetPostsParams) {
    return http.get<Post[]>('/posts', {
      params,
      headers: {
        Authorization: `Bearer ${accessToken}`
      }
    })
  }
}

export default postApi
