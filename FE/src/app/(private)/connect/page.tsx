'use client'

import { useSearchParams } from 'next/navigation'
import { Platform } from '@/constants/credentials'
import { useTranslations } from 'next-intl'

import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'

import { PlatformAccounts } from './platform-accounts'

export default function ConnectPage() {
  const searchParams = useSearchParams()
  const platform = searchParams.get('platform') || searchParams.get('state')
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
            <TabsList className='grid w-full grid-cols-4 mb-8'>
              <TabsTrigger value={Platform.FACEBOOK}>Facebook</TabsTrigger>
              <TabsTrigger value={Platform.THREADS}>Threads</TabsTrigger>
              {/* <TabsTrigger value={Platform.REDDIT}>Reddit</TabsTrigger> */}
              <TabsTrigger value={Platform.X}>X</TabsTrigger>
              <TabsTrigger value={Platform.INSTAGRAM}>Instagram</TabsTrigger>
            </TabsList>
            <TabsContent value={Platform.FACEBOOK}>
              <PlatformAccounts platformId={Platform.FACEBOOK} />
            </TabsContent>
            <TabsContent value={Platform.THREADS}>
              <PlatformAccounts platformId={Platform.THREADS} />
            </TabsContent>
            {/* <TabsContent value={Platform.REDDIT}>
              <PlatformAccounts platformId={Platform.REDDIT} />
            </TabsContent> */}
            <TabsContent value={Platform.X}>
              <PlatformAccounts platformId={Platform.X} />
            </TabsContent>
            <TabsContent value={Platform.INSTAGRAM}>
              <PlatformAccounts platformId={Platform.INSTAGRAM} />
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  )
}
