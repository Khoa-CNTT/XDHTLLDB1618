import { FADE_IN_ANIMATION, FADE_IN_STAGGER_ANIMATION, fadeInChildVariants } from '@/constants/effects'
import { getTranslations } from 'next-intl/server'

import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import ElementEffect from '@/components/effects/element-effect'
import ElementEffectStagger from '@/components/effects/element-effect-stagger'

export async function BillingSettings() {
  const t = await getTranslations('settings')
  return (
    <div className='grid gap-6'>
      <ElementEffect animationProps={FADE_IN_ANIMATION}>
        <Card>
          <CardHeader>
            <CardTitle>{t('currentPlan')}</CardTitle>
            <CardDescription>{t('currentPlanDescription')}</CardDescription>
          </CardHeader>
          <CardContent className='space-y-4'>
            <div className='flex items-center justify-between'>
              <div>
                <h3 className='font-semibold'>{t('enterprisePlan')}</h3>
                <p className='text-sm text-muted-foreground'>{t('enterprisePlanPrice', { value: 99 })}</p>
              </div>
              <Badge>{t('currentPlan')}</Badge>
            </div>
            <Button variant='outline'>{t('changePlan')}</Button>
          </CardContent>
        </Card>
      </ElementEffect>

      <ElementEffect animationProps={FADE_IN_ANIMATION}>
        <Card>
          <CardHeader>
            <CardTitle>{t('paymentMethod')}</CardTitle>
            <CardDescription>{t('paymentMethodDescription')}</CardDescription>
          </CardHeader>
          <CardContent className='space-y-4'>
            <div className='flex items-center justify-between'>
              <div className='flex items-center space-x-4'>
                <div className='w-12 h-8 bg-muted rounded flex items-center justify-center'>
                  <span className='text-sm font-medium'>VISA</span>
                </div>
                <div>
                  <p className='font-medium'>{t('visaEndingIn', { last4: '4242' })}</p>
                  <p className='text-sm text-muted-foreground'>{t('expires')}</p>
                </div>
              </div>
              <Button variant='ghost' size='sm'>
                {t('edit')}
              </Button>
            </div>
            <Button variant='outline'>{t('addPaymentMethod')}</Button>
          </CardContent>
        </Card>
      </ElementEffect>

      <ElementEffect animationProps={FADE_IN_ANIMATION}>
        <Card>
          <CardHeader>
            <CardTitle>{t('billingHistory')}</CardTitle>
            <CardDescription>{t('billingHistoryDescription')}</CardDescription>
          </CardHeader>
          <CardContent>
            <ElementEffectStagger
              animationProps={FADE_IN_STAGGER_ANIMATION}
              childVariants={fadeInChildVariants}
              className='space-y-4'
            >
              {[
                { date: 'Dec 1, 2023', amount: t('currency', { value: 99 }), status: t('paid') },
                { date: 'Nov 1, 2023', amount: t('currency', { value: 99 }), status: t('paid') },
                { date: 'Oct 1, 2023', amount: t('currency', { value: 99 }), status: t('paid') }
              ].map((invoice, index) => (
                <div key={index} className='flex items-center justify-between'>
                  <div>
                    <p className='font-medium'>{invoice.date}</p>
                    <p className='text-sm text-muted-foreground'>{invoice.amount}</p>
                  </div>
                  <div className='flex items-center space-x-2'>
                    <Badge variant='outline'>{invoice.status}</Badge>
                    <Button variant='ghost' size='sm'>
                      {t('download')}
                    </Button>
                  </div>
                </div>
              ))}
            </ElementEffectStagger>
          </CardContent>
        </Card>
      </ElementEffect>
    </div>
  )
}
