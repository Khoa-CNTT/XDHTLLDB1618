import { getTabStatus } from '@/actions/tab-status'
import { PLATFORM_TYPE } from '@/constants'

import PostListWrapper from '@/app/(private)/posts/components/post-list-wrapper'

export default async function PostsFacebookPage() {
  const tabStatus = await getTabStatus()
  return <PostListWrapper platform={PLATFORM_TYPE.FACEBOOK} tabStatus={tabStatus} />
}
