/* eslint-disable @typescript-eslint/no-explicit-any */
import postApi, { GetPostsParams } from '@/apis/posts.api'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'

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
    mutationFn: (data: any) => postApi.createPost(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['posts'] })
    }
  })
}

export const useUpdatePostMutation = (id: string) => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (data: any) => postApi.updatePost(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['posts'] })
    }
  })
}

export const useDeletePostMutation = () => {
  return useMutation({
    mutationFn: (id: string) => postApi.deletePost(id)
  })
}
