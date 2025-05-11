'use client'

import { setTabStatus } from '@/actions/tab-status'
import { POST_STATUS } from '@/constants/post'

import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs'

export interface PostListTabWrapperProps {
  children: React.ReactNode
  statusTabs: string
  platform: string
}

export default function PostListTabWrapper({ children, statusTabs, platform }: PostListTabWrapperProps) {
  return (
    <Tabs defaultValue={statusTabs} className='w-full'>
      <TabsList className='grid w-full max-w-[400px] grid-cols-2 mb-8'>
        <TabsTrigger
          value={POST_STATUS.SCHEDULED}
          onClick={() => {
            setTabStatus(platform, POST_STATUS.SCHEDULED)
          }}
        >
          Scheduled Posts
        </TabsTrigger>
        <TabsTrigger
          value={POST_STATUS.PUBLISHED}
          onClick={() => {
            setTabStatus(platform, POST_STATUS.PUBLISHED)
          }}
        >
          Published Posts
        </TabsTrigger>
      </TabsList>
      {children}
    </Tabs>
  )
}
