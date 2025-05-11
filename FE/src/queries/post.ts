import postApi, { GetPostsParams } from '@/apis/posts.api'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'

import { CreatePostRequest } from '@/types/post'

export const useGetPosts = (params?: GetPostsParams) => {
  return useQuery({
    // eslint-disable-next-line @tanstack/query/exhaustive-deps
    queryKey: params ? ['posts', params] : ['posts'],
    queryFn: () => postApi.getPosts(params)
  })
}

export const useCreatePostMutation = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (data: CreatePostRequest) => postApi.createPost(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['posts'] })
    }
  })
}
