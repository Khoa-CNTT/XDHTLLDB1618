import { get } from 'http'
import { PLATFORM_TYPE } from '@/constants'
import http from '@/utils/http'

import { CreatePostRequest, Post, UpdatePostRequest } from '@/types/post'
import { SuccessResponse } from '@/types/utils'

export type GetPostsParams = {
  platform: (typeof PLATFORM_TYPE)[keyof typeof PLATFORM_TYPE]
  publicationStartDate?: string
  publicationEndDate?: string
}

const POST_URI = '/posts'

const postApi = {
  getPosts(params?: GetPostsParams) {
    return http.get<SuccessResponse<Post[]>>(POST_URI, { params })
  },
  createPost(data: CreatePostRequest) {
    return http.post(`${POST_URI}/schedule`, data)
  },
  getPostsServer(accessToken: string, params?: GetPostsParams) {
    return http.get<SuccessResponse<Post[]>>(POST_URI, {
      params,
      headers: {
        Authorization: `Bearer ${accessToken}`
      }
    })
  },
  getPostByIdServer(id: string, accessToken: string) {
    return http.get<SuccessResponse<Post>>(`${POST_URI}/${id}`, {
      headers: {
        Authorization: `Bearer ${accessToken}`
      }
    })
  },
  updatePost(id: string, data: UpdatePostRequest) {
    return http.patch(`${POST_URI}/${id}`, data)
  },
  deletePost(id: string) {
    return http.delete(`${POST_URI}/${id}`)
  }
}

export default postApi
