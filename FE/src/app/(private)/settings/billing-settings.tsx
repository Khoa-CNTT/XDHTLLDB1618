import { FADE_IN_ANIMATION, FADE_IN_STAGGER_ANIMATION, fadeInChildVariants } from '@/constants/effects'

import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import ElementEffect from '@/components/effects/element-effect'
import ElementEffectStagger from '@/components/effects/element-effect-stagger'

export function BillingSettings() {
  return (
    <div className='grid gap-6'>
      <ElementEffect animationProps={FADE_IN_ANIMATION}>
        <Card>
          <CardHeader>
            <CardTitle>Current Plan</CardTitle>
            <CardDescription>You are currently on the Enterprise plan</CardDescription>
          </CardHeader>
          <CardContent className='space-y-4'>
            <div className='flex items-center justify-between'>
              <div>
                <h3 className='font-semibold'>Enterprise Plan</h3>
                <p className='text-sm text-muted-foreground'>$99/month</p>
              </div>
              <Badge>Current Plan</Badge>
            </div>
            <Button variant='outline'>Change Plan</Button>
          </CardContent>
        </Card>
      </ElementEffect>

      <ElementEffect animationProps={FADE_IN_ANIMATION}>
        <Card>
          <CardHeader>
            <CardTitle>Payment Method</CardTitle>
            <CardDescription>Manage your payment information</CardDescription>
          </CardHeader>
          <CardContent className='space-y-4'>
            <div className='flex items-center justify-between'>
              <div className='flex items-center space-x-4'>
                <div className='w-12 h-8 bg-muted rounded flex items-center justify-center'>
                  <span className='text-sm font-medium'>VISA</span>
                </div>
                <div>
                  <p className='font-medium'>Visa ending in 4242</p>
                  <p className='text-sm text-muted-foreground'>Expires 12/24</p>
                </div>
              </div>
              <Button variant='ghost' size='sm'>
                Edit
              </Button>
            </div>
            <Button variant='outline'>Add Payment Method</Button>
          </CardContent>
        </Card>
      </ElementEffect>

      <ElementEffect animationProps={FADE_IN_ANIMATION}>
        <Card>
          <CardHeader>
            <CardTitle>Billing History</CardTitle>
            <CardDescription>View your billing history and download invoices</CardDescription>
          </CardHeader>
          <CardContent>
            <ElementEffectStagger
              animationProps={FADE_IN_STAGGER_ANIMATION}
              childVariants={fadeInChildVariants}
              className='space-y-4'
            >
              {[
                { date: 'Dec 1, 2023', amount: '$99.00', status: 'Paid' },
                { date: 'Nov 1, 2023', amount: '$99.00', status: 'Paid' },
                { date: 'Oct 1, 2023', amount: '$99.00', status: 'Paid' }
              ].map((invoice, index) => (
                <div key={index} className='flex items-center justify-between'>
                  <div>
                    <p className='font-medium'>{invoice.date}</p>
                    <p className='text-sm text-muted-foreground'>{invoice.amount}</p>
                  </div>
                  <div className='flex items-center space-x-2'>
                    <Badge variant='outline'>{invoice.status}</Badge>
                    <Button variant='ghost' size='sm'>
                      Download
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
