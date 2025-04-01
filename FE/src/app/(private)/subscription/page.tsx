import { useTranslations } from 'next-intl'

import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'

import SubscriptionList from './subscription-list'

const PricingHeader = ({ title, subtitle }: { title: string; subtitle: string }) => (
  <section className='text-center'>
    <h2 className='text-3xl font-bold'>{title}</h2>
    <p className='text-xl pt-1'>{subtitle}</p>
    <br />
  </section>
)

export default function SubscriptionPage() {
  const t = useTranslations('subscription')
  return (
    <div className='py-8'>
      <PricingHeader title={t('title')} subtitle={t('description')} />
      <Tabs defaultValue='monthly' className='w-full px-4'>
        <TabsList className='grid w-full max-w-[400px] grid-cols-2 mb-8 mx-auto'>
          <TabsTrigger value='monthly'>{t('monthly')}</TabsTrigger>
          <TabsTrigger value='yearly'>{t('yearly')}</TabsTrigger>
        </TabsList>
        <TabsContent value='monthly'>
          <SubscriptionList type='monthly' />
        </TabsContent>
        <TabsContent value='yearly'>
          <SubscriptionList type='yearly' />
        </TabsContent>
      </Tabs>
    </div>
  )
}
