import { FADE_IN_ANIMATION } from '@/constants/effects'
import { getTranslations } from 'next-intl/server'

import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import ElementEffect from '@/components/effects/element-effect'

export async function SecuritySettings() {
  const t = await getTranslations('settings')
  return (
    <div className='grid gap-6'>
      <ElementEffect animationProps={FADE_IN_ANIMATION}>
        <Card>
          <CardHeader>
            <CardTitle>{t('changePassword')}</CardTitle>
            <CardDescription>{t('changePasswordDescription')}</CardDescription>
          </CardHeader>
          <CardContent className='space-y-4'>
            <div className='grid gap-2'>
              <Label htmlFor='current-password'>{t('currentPassword')}</Label>
              <Input id='current-password' placeholder={t('enterYourCurrentPassword')} type='password' />
            </div>
            <div className='grid gap-2'>
              <Label htmlFor='new-password'>{t('newPassword')}</Label>
              <Input id='new-password' placeholder={t('enterYourNewPassword')} type='password' />
            </div>
            <div className='grid gap-2'>
              <Label htmlFor='confirm-password'>{t('confirmPassword')}</Label>
              <Input id='confirm-password' placeholder={t('enterYourConfirmPassword')} type='password' />
            </div>
            <Button>{t('updatePassword')}</Button>
          </CardContent>
        </Card>
      </ElementEffect>

      <ElementEffect animationProps={FADE_IN_ANIMATION}>
        <Card>
          <CardHeader>
            <CardTitle>{t('twoFactorAuth')}</CardTitle>
            <CardDescription>{t('twoFactorAuthDescription')}</CardDescription>
          </CardHeader>
          <CardContent>
            <Button variant='outline'>{t('enable2FA')}</Button>
          </CardContent>
        </Card>
      </ElementEffect>
    </div>
  )
}
