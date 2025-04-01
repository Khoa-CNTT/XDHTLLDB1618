import { dummyPostDetails } from '@/data/post.dummy'
import { currentUser, User } from '@clerk/nextjs/server'

import { Post } from '@/types/post'
import PostDetails from '@/app/(private)/posts/components/post-details'

export default async function PostRedditDetailsPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const user = await currentUser()

  // TODO: Fetch post

  const post: Post & { user: User | null } = {
    ...dummyPostDetails,
    id,
    user
  }

  // pass error: Only plain objects, and a few built-ins, can be passed to Client Components from Server Components. Classes or null prototypes are not supported
  const postParsed = JSON.parse(JSON.stringify(post))

  return <PostDetails post={postParsed} />
}
