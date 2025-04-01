import { Suspense } from 'react'
import { cookies } from 'next/headers'
import postApi from '@/apis/posts.api'
import { PLATFORM_TYPE } from '@/constants'
import { POST_STATUS } from '@/constants/post'
import { TokenType } from '@/constants/token'

import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import PostListSkeleton from '@/components/skeleton/post-list-skeleton'
import { PostList } from '@/app/(private)/posts/components/post-list'

export interface PostListWrapperProps {
  platform: (typeof PLATFORM_TYPE)[keyof typeof PLATFORM_TYPE]
}

export default async function PostListWrapper({ platform }: PostListWrapperProps) {
  const cookieStore = await cookies()
  const accessToken = cookieStore.get(TokenType.ACCESS_TOKEN)?.value ?? ''
  const postsPromise = postApi.getPostsServer(accessToken, {
    platform
  })
  return (
    <div className='bg-muted h-full'>
      <div className='mx-auto p-4 md:px-10 h-full'>
        <div className='bg-background rounded-xl shadow-sm p-6 h-full'>
          <Tabs defaultValue='scheduled' className='w-full'>
            <TabsList className='grid w-full max-w-[400px] grid-cols-2 mb-8'>
              <TabsTrigger value={POST_STATUS.SCHEDULED}>Scheduled Posts</TabsTrigger>
              <TabsTrigger value={POST_STATUS.PUBLISHED}>Published Posts</TabsTrigger>
            </TabsList>
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
          </Tabs>
        </div>
      </div>
    </div>
  )
}
