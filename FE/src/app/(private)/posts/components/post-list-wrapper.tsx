import { Suspense } from 'react'
import { cookies } from 'next/headers'
import { getTabStatus } from '@/actions/tab-status'
import postApi from '@/apis/posts.api'
import { PLATFORM_TYPE } from '@/constants'
import { POST_STATUS } from '@/constants/post'
import { TokenType } from '@/constants/token'

import { TabsContent } from '@/components/ui/tabs'
import PostListSkeleton from '@/components/skeleton/post-list-skeleton'
import { PostList } from '@/app/(private)/posts/components/post-list'

import PostListTabWrapper from './post-list-tab-wrappper'

export interface PostListWrapperProps {
  platform: (typeof PLATFORM_TYPE)[keyof typeof PLATFORM_TYPE]
}

export default async function PostListWrapper({ platform }: PostListWrapperProps) {
  const cookieStore = await cookies()
  const accessToken = cookieStore.get(TokenType.ACCESS_TOKEN)?.value ?? ''

  const tabStatus = await getTabStatus()
  const statusTabs = tabStatus[platform] ?? POST_STATUS.SCHEDULED

  const postsPromise = postApi.getPostsServer(accessToken, {
    platform
  })

  return (
    <div className='bg-muted h-full'>
      <div className='mx-auto p-4 md:px-10 h-full'>
        <div className='bg-background rounded-xl shadow-sm p-6 h-full'>
          <PostListTabWrapper statusTabs={statusTabs} platform={platform}>
            <TabsContent value={POST_STATUS.SCHEDULED}>
              <Suspense fallback={<PostListSkeleton />}>
                <PostList
                  status={POST_STATUS.SCHEDULED}
                  postsPromise={postsPromise.then((response) => response.data)}
                />
              </Suspense>
            </TabsContent>
            <TabsContent value={POST_STATUS.PUBLISHED}>
              <Suspense fallback={<PostListSkeleton />}>
                <PostList
                  status={POST_STATUS.PUBLISHED}
                  postsPromise={postsPromise.then((response) => response.data)}
                />
              </Suspense>
            </TabsContent>
          </PostListTabWrapper>
        </div>
      </div>
    </div>
  )
}
