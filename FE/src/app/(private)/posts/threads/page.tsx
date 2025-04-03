import { PLATFORM_TYPE } from '@/constants'

import PostListWrapper from '@/app/(private)/posts/components/post-list-wrapper'

export default function PostsInstagramPage() {
  return <PostListWrapper platform={PLATFORM_TYPE.THREADS} />
}
