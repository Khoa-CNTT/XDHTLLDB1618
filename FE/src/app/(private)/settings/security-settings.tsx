import { FADE_IN_ANIMATION } from '@/constants/effects'

import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import ElementEffect from '@/components/effects/element-effect'

export function SecuritySettings() {
  return (
    <div className='grid gap-6'>
      <ElementEffect animationProps={FADE_IN_ANIMATION}>
        <Card>
          <CardHeader>
            <CardTitle>Change Password</CardTitle>
            <CardDescription>Update your password to keep your account secure</CardDescription>
          </CardHeader>
          <CardContent className='space-y-4'>
            <div className='grid gap-2'>
              <Label htmlFor='current-password'>Current Password</Label>
              <Input id='current-password' type='password' />
            </div>
            <div className='grid gap-2'>
              <Label htmlFor='new-password'>New Password</Label>
              <Input id='new-password' type='password' />
            </div>
            <div className='grid gap-2'>
              <Label htmlFor='confirm-password'>Confirm New Password</Label>
              <Input id='confirm-password' type='password' />
            </div>
            <Button>Update Password</Button>
          </CardContent>
        </Card>
      </ElementEffect>

      <ElementEffect animationProps={FADE_IN_ANIMATION}>
        <Card>
          <CardHeader>
            <CardTitle>Two-Factor Authentication</CardTitle>
            <CardDescription>Add an extra layer of security to your account</CardDescription>
          </CardHeader>
          <CardContent>
            <Button variant='outline'>Enable 2FA</Button>
          </CardContent>
        </Card>
      </ElementEffect>
    </div>
  )
}
