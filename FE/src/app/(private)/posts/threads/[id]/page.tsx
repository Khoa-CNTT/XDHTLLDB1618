import postApi from '@/apis/posts.api'

import PostDetails from '@/app/(private)/posts/components/post-details'

export default async function PostInstagramDetailsPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params

  const post = await postApi.getPostByIdServer(id)

  return <PostDetails post={post.data.data} />
}
