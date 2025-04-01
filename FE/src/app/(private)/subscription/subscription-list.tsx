import { FADE_IN_STAGGER_ANIMATION, fadeInChildVariants } from '@/constants/effects'
import { CheckCircle2, Sparkles } from 'lucide-react'

import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import ElementEffectStagger from '@/components/effects/element-effect-stagger'

const plans = [
  {
    title: 'Basic',
    monthlyPrice: 0,
    yearlyPrice: 0,
    description: 'Essential features you need to get started',
    features: ['Example Feature Number 1', 'Example Feature Number 2', 'Example Feature Number 3'],
    actionLabel: 'Get Started',
    isFree: true,
    popular: false
  },
  {
    title: 'Pro',
    monthlyPrice: 25,
    yearlyPrice: 250,
    description: 'Perfect for owners of small & medium businessess',
    features: ['Example Feature Number 1', 'Example Feature Number 2', 'Example Feature Number 3'],
    actionLabel: 'Get Started',
    popular: true
  },
  {
    title: 'Enterprise',
    price: 'Custom',
    description: 'Dedicated support and infrastructure to fit your needs',
    features: [
      'Example Feature Number 1',
      'Example Feature Number 2',
      'Example Feature Number 3',
      'Super Exclusive Feature'
    ],
    actionLabel: 'Contact Sales',
    exclusive: true
  }
]

const CheckItem = ({ text }: { text: string }) => (
  <div className='flex gap-2'>
    <CheckCircle2 size={18} className='my-auto text-green-400' />
    <p className='pt-0.5 text-zinc-700 dark:text-zinc-300 text-sm'>{text}</p>
  </div>
)

type PricingCardProps = {
  isYearly?: boolean
  title: string
  monthlyPrice?: number
  yearlyPrice?: number
  description: string
  features: string[]
  actionLabel: string
  popular?: boolean
  exclusive?: boolean
  isFree?: boolean
}

//TODO: Replace red color
const PricingCard = ({
  isYearly,
  title,
  monthlyPrice,
  yearlyPrice,
  description,
  features,
  actionLabel,
  popular,
  isFree,
  exclusive
}: PricingCardProps) => (
  <Card
    className={cn(
      `w-72 flex h-full relative flex-col justify-between py-1 ${popular ? 'border-rose-400' : 'border-zinc-700'} mx-auto sm:mx-0`,
      {
        'animate-background-shine bg-white dark:bg-[linear-gradient(110deg,#000103,45%,#1e2631,55%,#000103)] bg-[length:200%_100%] transition-colors':
          exclusive
      }
    )}
  >
    <div>
      {popular && (
        <div
          className={cn({
            'absolute top-0 flex items-center left-1/2 -translate-x-1/2 -translate-y-1/2 rounded-3xl text-xs bg-red-500 text-white px-4 py-2':
              popular
          })}
        >
          <Sparkles className='mr-2' size={18} />
          Recommended
        </div>
      )}
      <CardHeader className='py-8'>
        {isYearly && yearlyPrice && monthlyPrice ? (
          <div className='flex justify-between'>
            <CardTitle className='text-zinc-700 dark:text-zinc-300 text-lg'>{title}</CardTitle>
            <div
              className={cn(
                'px-2.5 rounded-xl h-fit text-sm py-1 bg-zinc-200 text-black dark:bg-zinc-800 dark:text-white',
                {
                  'bg-gradient-to-r from-orange-400 to-rose-400 dark:text-black ': popular
                }
              )}
            >
              Save ${monthlyPrice * 12 - yearlyPrice}
            </div>
          </div>
        ) : (
          <CardTitle className='text-zinc-700 dark:text-zinc-300 text-lg'>{title}</CardTitle>
        )}
        <div className='flex gap-0.5'>
          {isFree ? (
            <h3 className='text-3xl font-bold'>Free</h3>
          ) : (
            <>
              <h3 className='text-3xl font-bold'>
                {yearlyPrice && isYearly ? '$' + yearlyPrice : monthlyPrice ? '$' + monthlyPrice : 'Custom'}
              </h3>
              <span className='flex flex-col justify-end text-sm mb-1'>
                {yearlyPrice && isYearly ? '/year' : monthlyPrice ? '/month' : null}
              </span>
            </>
          )}
        </div>
        <CardDescription className='pt-1.5 h-12'>{description}</CardDescription>
      </CardHeader>
      <CardContent className='flex flex-col gap-2'>
        {features.map((feature: string) => (
          <CheckItem key={feature} text={feature} />
        ))}
      </CardContent>
    </div>
    <CardFooter className='mt-2'>
      <Button className='relative inline-flex w-full items-center justify-center rounded-md bg-black text-white dark:bg-white px-6 font-medium  dark:text-black transition-colors focus:outline-none focus:ring-2 focus:ring-slate-400 focus:ring-offset-2 focus:ring-offset-slate-50'>
        <div className='absolute -inset-0.5 -z-10 rounded-lg bg-gradient-to-b from-[#c7d2fe] to-[#8678f9] opacity-75 blur' />
        {actionLabel}
      </Button>
    </CardFooter>
  </Card>
)

export default function SubscriptionList({ type }: { type: 'monthly' | 'yearly' }) {
  return (
    <ElementEffectStagger
      className='flex flex-col sm:flex-row sm:flex-wrap justify-center gap-8 mt-12'
      animationProps={FADE_IN_STAGGER_ANIMATION}
      childVariants={fadeInChildVariants}
    >
      {type === 'monthly'
        ? plans.map((plan) => <PricingCard key={plan.title} {...plan} isYearly={false} />)
        : plans.map((plan) => <PricingCard key={plan.title} {...plan} isYearly={true} />)}
    </ElementEffectStagger>
  )
}
