import { FADE_IN_ANIMATION } from '@/constants/effects'

import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'
import ElementEffect from '@/components/effects/element-effect'

export function NotificationSettings() {
  return (
    <ElementEffect animationProps={FADE_IN_ANIMATION}>
      <Card>
        <CardHeader>
          <CardTitle>Notification Preferences</CardTitle>
          <CardDescription>Choose what notifications you want to receive</CardDescription>
        </CardHeader>
        <CardContent className='space-y-6'>
          <div className='flex items-center justify-between space-x-2'>
            <Label htmlFor='email-notifications'>Email Notifications</Label>
            <Switch id='email-notifications' defaultChecked />
          </div>
          <div className='flex items-center justify-between space-x-2'>
            <Label htmlFor='marketing-emails'>Marketing Emails</Label>
            <Switch id='marketing-emails' />
          </div>
          <div className='flex items-center justify-between space-x-2'>
            <Label htmlFor='social-notifications'>Social Notifications</Label>
            <Switch id='social-notifications' defaultChecked />
          </div>
          <div className='flex items-center justify-between space-x-2'>
            <Label htmlFor='security-notifications'>Security Updates</Label>
            <Switch id='security-notifications' defaultChecked />
          </div>
          <Button>Save Notification Settings</Button>
        </CardContent>
      </Card>
    </ElementEffect>
  )
}
