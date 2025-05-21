import { FADE_IN_ANIMATION } from '@/constants/effects'
import { getTranslations } from 'next-intl/server'

import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'
import ElementEffect from '@/components/effects/element-effect'

export async function NotificationSettings() {
  const t = await getTranslations('settings')
  return (
    <ElementEffect animationProps={FADE_IN_ANIMATION}>
      <Card>
        <CardHeader>
          <CardTitle>{t('notificationPreferences')}</CardTitle>
          <CardDescription>{t('notificationPreferencesDescription')}</CardDescription>
        </CardHeader>
        <CardContent className='space-y-6'>
          <div className='flex items-center justify-between space-x-2'>
            <Label htmlFor='email-notifications'>{t('emailNotifications')}</Label>
            <Switch id='email-notifications' defaultChecked />
          </div>
          <div className='flex items-center justify-between space-x-2'>
            <Label htmlFor='marketing-emails'>{t('marketingEmails')}</Label>
            <Switch id='marketing-emails' />
          </div>
          <div className='flex items-center justify-between space-x-2'>
            <Label htmlFor='social-notifications'>{t('socialNotifications')}</Label>
            <Switch id='social-notifications' defaultChecked />
          </div>
          <div className='flex items-center justify-between space-x-2'>
            <Label htmlFor='security-notifications'>{t('securityUpdates')}</Label>
            <Switch id='security-notifications' defaultChecked />
          </div>
          <Button>{t('saveNotificationSettings')}</Button>
        </CardContent>
      </Card>
    </ElementEffect>
  )
}
