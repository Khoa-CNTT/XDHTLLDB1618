'use client'

import { useSearchParams } from 'next/navigation'
import { Platform } from '@/constants/credentials'
import { useTranslations } from 'next-intl'

import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'

import { PlatformAccounts } from './platform-accounts'

export default function ConnectPage() {
  const searchParams = useSearchParams()
  const platform = searchParams.get('platform')
  const t = useTranslations('connect')

  return (
    <div className='min-h-screen bg-muted'>
      <div className='mx-auto p-4 md:px-10'>
        <div className='bg-background rounded-xl shadow-sm p-6'>
          <div className='mb-8'>
            <h1 className='text-3xl font-bold'>{t('title')}</h1>
            <p className='text-muted-foreground mt-2'>{t('description')}</p>
          </div>

          <Tabs defaultValue={platform || 'facebook'} className='w-full'>
            <TabsList className='grid w-full grid-cols-3 mb-8'>
              <TabsTrigger value={Platform.FACEBOOK}>Facebook</TabsTrigger>
              <TabsTrigger value={Platform.THREADS}>Threads</TabsTrigger>
              <TabsTrigger value={Platform.REDDIT}>Reddit</TabsTrigger>
            </TabsList>
            <TabsContent value={Platform.FACEBOOK}>
              <PlatformAccounts platformId={Platform.FACEBOOK} />
            </TabsContent>
            <TabsContent value={Platform.THREADS}>
              <PlatformAccounts platformId={Platform.THREADS} />
            </TabsContent>
            <TabsContent value={Platform.REDDIT}>
              <PlatformAccounts platformId={Platform.REDDIT} />
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  )
}
