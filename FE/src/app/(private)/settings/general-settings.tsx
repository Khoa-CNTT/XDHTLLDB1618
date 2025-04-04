import { FADE_IN_ANIMATION } from '@/constants/effects'
import { currentUser } from '@clerk/nextjs/server'

import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import ElementEffect from '@/components/effects/element-effect'

export async function GeneralSettings() {
  const user = await currentUser()
  return (
    <div className='grid gap-6'>
      <ElementEffect animationProps={FADE_IN_ANIMATION}>
        <Card>
          <CardHeader>
            <CardTitle>Profile Information</CardTitle>
            <CardDescription>Update your account profile information</CardDescription>
          </CardHeader>
          <CardContent className='space-y-4'>
            <div className='grid gap-2'>
              <Label htmlFor='name'>Name</Label>
              <Input id='name' placeholder='Enter your name' defaultValue={user?.fullName ?? 'tuyen pham'} />
            </div>
            <div className='grid gap-2'>
              <Label htmlFor='email'>Email</Label>
              <Input
                id='email'
                type='email'
                placeholder='Enter your email'
                defaultValue={user?.emailAddresses[0].emailAddress ?? 'tuyenpham104.dev@gmail.com'}
              />
            </div>
            <Button>Save Changes</Button>
          </CardContent>
        </Card>
      </ElementEffect>

      <ElementEffect animationProps={FADE_IN_ANIMATION}>
        <Card>
          <CardHeader>
            <CardTitle>Preferences</CardTitle>
            <CardDescription>Manage your app preferences</CardDescription>
          </CardHeader>
          <CardContent className='space-y-4'>
            <div className='grid gap-2'>
              <Label htmlFor='language'>Language</Label>
              <Select defaultValue='en'>
                <SelectTrigger id='language'>
                  <SelectValue placeholder='Select language' />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value='en'>English</SelectItem>
                  <SelectItem value='vi'>Vietnamese</SelectItem>
                  <SelectItem value='es'>Spanish</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className='grid gap-2'>
              <Label htmlFor='timezone'>Timezone</Label>
              <Select defaultValue='utc7'>
                <SelectTrigger id='timezone'>
                  <SelectValue placeholder='Select timezone' />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value='utc7'>UTC+7</SelectItem>
                  <SelectItem value='utc8'>UTC+8</SelectItem>
                  <SelectItem value='utc9'>UTC+9</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <Button>Save Preferences</Button>
          </CardContent>
        </Card>
      </ElementEffect>
    </div>
  )
}
