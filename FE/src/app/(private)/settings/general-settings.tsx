import { FADE_IN_ANIMATION } from '@/constants/effects'
import { currentUser } from '@clerk/nextjs/server'
import { getLocale, getTranslations } from 'next-intl/server'

import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import ElementEffect from '@/components/effects/element-effect'

export async function GeneralSettings() {
  const user = await currentUser()
  const t = await getTranslations('settings')
  const locale = await getLocale()
  return (
    <div className='grid gap-6'>
      <ElementEffect animationProps={FADE_IN_ANIMATION}>
        <Card>
          <CardHeader>
            <CardTitle>{t('profileInformation')}</CardTitle>
            <CardDescription>{t('profileInformationDescription')}</CardDescription>
          </CardHeader>
          <CardContent className='space-y-4'>
            <div className='grid gap-2'>
              <Label htmlFor='name'>{t('name')}</Label>
              <Input id='name' placeholder={t('enterYourName')} defaultValue={user?.fullName ?? 'tuyen pham'} />
            </div>
            <div className='grid gap-2'>
              <Label htmlFor='email'>{t('email')}</Label>
              <Input
                id='email'
                type='email'
                placeholder={t('enterYourEmail')}
                defaultValue={user?.emailAddresses[0].emailAddress ?? 'tuyenpham104.dev@gmail.com'}
              />
            </div>
            <Button>{t('saveChanges')}</Button>
          </CardContent>
        </Card>
      </ElementEffect>

      <ElementEffect animationProps={FADE_IN_ANIMATION}>
        <Card>
          <CardHeader>
            <CardTitle>{t('preferences')}</CardTitle>
            <CardDescription>{t('preferencesDescription')}</CardDescription>
          </CardHeader>
          <CardContent className='space-y-4'>
            <div className='grid gap-2'>
              <Label htmlFor='language'>{t('language')}</Label>
              <Select defaultValue={locale}>
                <SelectTrigger id='language'>
                  <SelectValue placeholder={t('selectLanguage')} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value='en'>{t('english')}</SelectItem>
                  <SelectItem value='vi'>{t('vietnamese')}</SelectItem>
                  <SelectItem value='es'>{t('spanish')}</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className='grid gap-2'>
              <Label htmlFor='timezone'>{t('timezone')}</Label>
              <Select defaultValue='utc7'>
                <SelectTrigger id='timezone'>
                  <SelectValue placeholder={t('selectTimezone')} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value='utc7'>{t('utc7')}</SelectItem>
                  <SelectItem value='utc8'>{t('utc8')}</SelectItem>
                  <SelectItem value='utc9'>{t('utc9')}</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <Button>{t('savePreferences')}</Button>
          </CardContent>
        </Card>
      </ElementEffect>
    </div>
  )
}
