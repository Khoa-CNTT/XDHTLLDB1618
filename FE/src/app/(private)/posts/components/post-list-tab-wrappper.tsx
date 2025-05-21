'use client'

import { use } from 'react'
import { setTabStatus } from '@/actions/tab-status'
import { POST_STATUS } from '@/constants/post'
import { useTranslations } from 'next-intl'

import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs'

export interface PostListTabWrapperProps {
  children: React.ReactNode
  statusTabs: string
  platform: string
}

export default function PostListTabWrapper({ children, statusTabs, platform }: PostListTabWrapperProps) {
  const t = useTranslations('posts')
  return (
    <Tabs defaultValue={statusTabs} className='w-full'>
      <TabsList className='grid w-full max-w-[700px] grid-cols-3 mb-8'>
        <TabsTrigger
          value={POST_STATUS.SCHEDULED}
          onClick={() => {
            setTabStatus(platform, POST_STATUS.SCHEDULED)
          }}
        >
          {t('scheduledPosts')}
        </TabsTrigger>
        <TabsTrigger
          value={POST_STATUS.PUBLISHED}
          onClick={() => {
            setTabStatus(platform, POST_STATUS.PUBLISHED)
          }}
        >
          {t('publishedPosts')}
        </TabsTrigger>
        <TabsTrigger
          value={POST_STATUS.ACTIVE}
          onClick={() => {
            setTabStatus(platform, POST_STATUS.ACTIVE)
          }}
        >
          {t('activePosts')}
        </TabsTrigger>
      </TabsList>
      {children}
    </Tabs>
  )
}
