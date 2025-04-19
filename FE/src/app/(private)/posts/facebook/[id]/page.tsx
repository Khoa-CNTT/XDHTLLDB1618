import { cookies } from 'next/headers'
import postApi from '@/apis/posts.api'

import PostDetails from '@/app/(private)/posts/components/post-details'

export default async function PostFacebookDetailsPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params

  const cookiesStore = await cookies()
  const token = cookiesStore.get('accessToken')?.value

  const post = await postApi.getPostByIdServer(id, token ?? '')

  return <PostDetails post={post.data.data} />
}
