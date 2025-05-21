import { getTranslations } from 'next-intl/server'

import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'

import { BillingSettings } from './billing-settings'
import { GeneralSettings } from './general-settings'
import { NotificationSettings } from './notification-settings'
import { SecuritySettings } from './security-settings'

export default async function SettingsPage() {
  const t = await getTranslations('settings')
  return (
    <div className='min-h-screen bg-background'>
      <div className='mx-auto p-4 md:px-10'>
        <div className='mb-8'>
          <h1 className='text-3xl font-bold'>{t('title')}</h1>
          <p className='text-muted-foreground mt-2'>{t('description')}</p>
        </div>

        <Tabs defaultValue='general' className='w-full'>
          <TabsList className='w-full justify-start mb-8 max-w-[400px]'>
            <TabsTrigger className='w-full' value='general'>
              {t('general')}
            </TabsTrigger>
            <TabsTrigger className='w-full' value='notifications'>
              {t('notifications')}
            </TabsTrigger>
            <TabsTrigger className='w-full' value='security'>
              {t('security')}
            </TabsTrigger>
            <TabsTrigger className='w-full' value='billing'>
              {t('billing')}
            </TabsTrigger>
          </TabsList>

          <TabsContent value='general'>
            <GeneralSettings />
          </TabsContent>

          <TabsContent value='notifications'>
            <NotificationSettings />
          </TabsContent>

          <TabsContent value='security'>
            <SecuritySettings />
          </TabsContent>

          <TabsContent value='billing'>
            <BillingSettings />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
