'use client'

import { Suspense } from 'react'
import { PLATFORM_TYPE } from '@/constants'
import { POST_STATUS } from '@/constants/post'
import { useGetPosts } from '@/queries/post'

import { TabsContent } from '@/components/ui/tabs'
import PostListSkeleton from '@/components/skeleton/post-list-skeleton'
import { PostList } from '@/app/(private)/posts/components/post-list'

import PostListTabWrapper from './post-list-tab-wrappper'

export interface PostListWrapperProps {
  platform: (typeof PLATFORM_TYPE)[keyof typeof PLATFORM_TYPE]
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  tabStatus: any
}

export default function PostListWrapper({ platform, tabStatus }: PostListWrapperProps) {
  const posts = useGetPosts({ platform })
  const statusTabs = tabStatus?.[platform] || POST_STATUS.SCHEDULED

  const isLoading = posts.isLoading || posts.isPending || posts.isFetching

  return (
    <div className='bg-muted h-full'>
      <div className='mx-auto p-4 md:px-10 h-full'>
        <div className='bg-background rounded-xl shadow-sm p-6 h-full'>
          <PostListTabWrapper statusTabs={statusTabs} platform={platform}>
            <TabsContent value={POST_STATUS.SCHEDULED}>
              {isLoading && <PostListSkeleton />}
              {!isLoading && (
                <PostList platform={platform} status={POST_STATUS.SCHEDULED} posts={posts.data?.data.data ?? []} />
              )}
            </TabsContent>
            <TabsContent value={POST_STATUS.PUBLISHED}>
              {isLoading && <PostListSkeleton />}
              {!isLoading && (
                <PostList platform={platform} status={POST_STATUS.PUBLISHED} posts={posts.data?.data.data ?? []} />
              )}
            </TabsContent>
            <TabsContent value={POST_STATUS.ACTIVE}>
              {isLoading && <PostListSkeleton />}
              {!isLoading && (
                <PostList platform={platform} status={POST_STATUS.ACTIVE} posts={posts.data?.data.data ?? []} />
              )}
            </TabsContent>
          </PostListTabWrapper>
        </div>
      </div>
    </div>
  )
}
