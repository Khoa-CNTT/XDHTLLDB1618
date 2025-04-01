import { FADE_IN_ANIMATION, FADE_IN_STAGGER_ANIMATION, fadeInChildVariants } from '@/constants/effects'
import { BarChart, Bot, Clock, Globe, Lock, LucideIcon, Sparkles, Zap } from 'lucide-react'
import { IconType } from 'react-icons'
import { FaFacebook, FaInstagram, FaReddit } from 'react-icons/fa'

import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import ElementEffect from '@/components/effects/element-effect'
import ElementEffectStagger from '@/components/effects/element-effect-stagger'
import LocaleSwitcher from '@/components/locale-switcher'
import ThemeSwitch from '@/components/theme-switch'
import SubscriptionList from '@/app/(private)/subscription/subscription-list'
import JoinWaitListForm from '@/app/waitlist/join-form'
import Preview from '@/app/waitlist/preview'

export default function LandingPage() {
  return (
    <div className='min-h-screen'>
      <ElementEffect
        animationProps={{
          initial: { opacity: 0, y: -50 },
          animate: { opacity: 1, y: 0 },
          transition: { duration: 0.5 }
        }}
        ElementType='header'
        className='container flex items-center justify-between py-6'
      >
        <div className='flex items-center gap-2 text-xl font-bold'>
          <Sparkles className='size-6' />
          PostPilot
        </div>
        <div className='flex items-center gap-2'>
          <ThemeSwitch />
          <LocaleSwitcher />
          <Button className='hidden md:block' variant='default'>
            Early Access
          </Button>
        </div>
      </ElementEffect>

      <main className='container grid lg:grid-cols-2 gap-12 py-12 lg:py-24 items-center min-h-screen'>
        <ElementEffect
          animationProps={{
            initial: { opacity: 0, x: -50 },
            animate: { opacity: 1, x: 0 },
            transition: { duration: 0.5, delay: 0.2 }
          }}
          className='space-y-8'
        >
          <h1
            className='text-center md:text-left
           text-5xl xl:text-7xl font-bold tracking-tight leading-tight'
          >
            Automate your social presence with AI power
          </h1>
          <p className='text-justify md:text-left text-lg sm:text-xl text-muted-foreground max-w-[600px]'>
            Schedule, generate, and manage your social media content across all platforms with AI-powered automation.
            Save time and boost your engagement.
          </p>

          <JoinWaitListForm />

          <div className='flex gap-8 pt-4 justify-between flex-wrap'>
            <div className='flex flex-col items-center'>
              <div className='text-3xl font-bold'>500+</div>
              <div className='text-muted-foreground'>Beta Users</div>
            </div>
            <div className='flex flex-col items-center'>
              <div className='text-3xl font-bold'>10k+</div>
              <div className='text-muted-foreground'>Posts Generated</div>
            </div>
            <div className='flex flex-col items-center'>
              <div className='text-3xl font-bold'>24/7</div>
              <div className='text-muted-foreground'>Automation</div>
            </div>
          </div>
        </ElementEffect>

        <ElementEffect
          animationProps={{
            initial: { opacity: 0, x: 50 },
            animate: { opacity: 1, x: 0 },
            transition: { duration: 0.5, delay: 0.2 }
          }}
          className='overflow-hidden'
        >
          <Preview />
        </ElementEffect>
      </main>

      <section className='py-20 bg-muted/70'>
        <ElementEffect animationProps={FADE_IN_ANIMATION} className='container text-center'>
          <Badge variant='default' className='mb-4'>
            Supported Platforms
          </Badge>
          <h2 className='text-3xl font-bold mb-12'>Connect Once, Post Everywhere</h2>
          <ElementEffectStagger
            animationProps={FADE_IN_STAGGER_ANIMATION}
            childVariants={fadeInChildVariants}
            className='flex gap-8 items-center justify-between flex-wrap'
          >
            <PlatformIcon icon={FaFacebook} name='Facebook' />
            <PlatformIcon icon={FaInstagram} name='Instagram' />
            <PlatformIcon icon={FaReddit} name='Reddit' />
          </ElementEffectStagger>
        </ElementEffect>
      </section>

      <section className='py-20'>
        <div className='container'>
          <ElementEffect animationProps={FADE_IN_ANIMATION} className='text-center mb-12'>
            <Badge variant='default' className='mb-4'>
              Features
            </Badge>
            <h2 className='text-3xl font-bold mb-4'>Everything You Need to Succeed</h2>
            <p className='text-muted-foreground max-w-2xl mx-auto'>
              Our platform combines AI-powered content generation with powerful automation tools to help you maintain a
              strong social media presence.
            </p>
          </ElementEffect>

          <ElementEffectStagger
            animationProps={FADE_IN_STAGGER_ANIMATION}
            childVariants={fadeInChildVariants}
            className='grid md:grid-cols-2 lg:grid-cols-3 gap-8'
          >
            <FeatureCard
              icon={Bot}
              title='AI Content Writer'
              description='Generate engaging posts tailored to each platform using advanced AI. Create weeks of content in minutes.'
            />
            <FeatureCard
              icon={Clock}
              title='Smart Scheduling'
              description='AI-powered scheduling that automatically posts at the best times for maximum engagement.'
            />
            <FeatureCard
              icon={Zap}
              title='Instant Variations'
              description='Generate multiple versions of your content optimized for different platforms and audiences.'
            />
            <FeatureCard
              icon={BarChart}
              title='Analytics & Insights'
              description='Track performance across all platforms with unified analytics and AI-powered recommendations.'
            />
            <FeatureCard
              icon={Globe}
              title='Multi-Language Support'
              description='Automatically translate and adapt your content for global audiences while maintaining context.'
            />
            <FeatureCard
              icon={Lock}
              title='Content Compliance'
              description='AI-powered content checking ensures your posts meet platform guidelines and brand standards.'
            />
          </ElementEffectStagger>
        </div>
      </section>

      <ElementEffect animationProps={FADE_IN_ANIMATION} className='py-20 bg-muted/70'>
        <div className='container text-center'>
          <Badge variant='default' className='mb-4'>
            Early Access Pricing
          </Badge>
          <h2 className='text-3xl font-bold mb-4'>Join the Waitlist for Special Pricing</h2>
          <p className='text-muted-foreground max-w-2xl mx-auto mb-8'>
            Be among the first to access our platform and receive exclusive founding member benefits.
          </p>
          <Tabs defaultValue='monthly' className='w-full px-4'>
            <TabsList className='grid w-full max-w-[400px] grid-cols-2 mb-8 mx-auto'>
              <TabsTrigger value='monthly'>Monthly</TabsTrigger>
              <TabsTrigger value='yearly'>Yearly</TabsTrigger>
            </TabsList>
            <TabsContent value='monthly'>
              <SubscriptionList type='monthly' />
            </TabsContent>
            <TabsContent value='yearly'>
              <SubscriptionList type='yearly' />
            </TabsContent>
          </Tabs>
        </div>
      </ElementEffect>
    </div>
  )
}

function PlatformIcon({ icon: Icon, name }: { icon: IconType; name: string }) {
  return (
    <div className='flex flex-col items-center gap-2'>
      <div className='size-16 rounded-full bg-card flex items-center justify-center'>
        <Icon className='size-8' />
      </div>
      <span className='text-sm text-muted-foreground'>{name}</span>
    </div>
  )
}

function FeatureCard({ icon: Icon, title, description }: { icon: LucideIcon; title: string; description: string }) {
  return (
    <Card className='bg-card border-border h-full'>
      <CardContent className='p-6'>
        <div className='size-12 rounded-lg bg-card flex items-center justify-center mb-4'>
          <Icon className='size-6' />
        </div>
        <h3 className='text-xl font-semibold mb-2'>{title}</h3>
        <p className='text-muted-foreground'>{description}</p>
      </CardContent>
    </Card>
  )
}
