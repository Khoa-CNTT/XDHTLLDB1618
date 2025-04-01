import { PLATFORM_TYPE } from '@/constants'

import PostListWrapper from '@/app/(private)/posts/components/post-list-wrapper'

export default function PostsRedditPage() {
  return <PostListWrapper platform={PLATFORM_TYPE.REDDIT} />
}
