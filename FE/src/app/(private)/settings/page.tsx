import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'

import { BillingSettings } from './billing-settings'
import { GeneralSettings } from './general-settings'
import { NotificationSettings } from './notification-settings'
import { SecuritySettings } from './security-settings'

export default function SettingsPage() {
  return (
    <div className='min-h-screen bg-background'>
      <div className='mx-auto p-4 md:px-10'>
        <div className='mb-8'>
          <h1 className='text-3xl font-bold'>Settings</h1>
          <p className='text-muted-foreground mt-2'>Manage your account settings and preferences</p>
        </div>

        <Tabs defaultValue='general' className='w-full'>
          <TabsList className='w-full justify-start mb-8 max-w-[340px]'>
            <TabsTrigger value='general'>General</TabsTrigger>
            <TabsTrigger value='notifications'>Notifications</TabsTrigger>
            <TabsTrigger value='security'>Security</TabsTrigger>
            <TabsTrigger value='billing'>Billing</TabsTrigger>
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
