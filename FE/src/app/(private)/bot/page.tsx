import Link from 'next/link'
import { BotIcon, ExternalLink } from 'lucide-react'

import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Label } from '@/components/ui/label'
import { Separator } from '@/components/ui/separator'
import { Switch } from '@/components/ui/switch'

import TelegramBot from './components/telegram'

export default async function ConnectPage() {
  return (
    <div className='min-h-screen bg-background'>
      <div className='mx-auto p-4 md:px-10 flex flex-col gap-6'>
        <div className='flex flex-col md:flex-row items-start md:items-center justify-between gap-3'>
          <h1 className='text-2xl lg:text-3xl font-bold'>Connect Telegram Bot</h1>
          <Link href='https://core.telegram.org/bots/tutorial' target='_blank'>
            <Button variant='default'>
              <ExternalLink className='mr-2 size-4' />
              Telegram Help
            </Button>
          </Link>
        </div>

        <div className='grid gap-6 lg:grid-cols-2'>
          <Card className='flex flex-col border-primary dark:border-primary/20 bg-muted/20'>
            <CardHeader>
              <CardTitle className='flex items-center text-lg md:text-2xl gap-2'>
                <BotIcon className='flex shrink-0 size-5 text-blue-500' />
                Start receiving notifications
              </CardTitle>
              <CardDescription>Follow these steps to start receiving notifications</CardDescription>
            </CardHeader>
            <CardContent className='space-y-4 flex-1'>
              <div className='rounded-md p-4 space-y-4 h-full bg-primary/10'>
                <div className='flex items-start space-x-3'>
                  <div className='flex size-5 shrink-0 items-center justify-center rounded-full bg-blue-500 text-white text-sm mt-1'>
                    1
                  </div>
                  <div className='space-y-1'>
                    <p className='font-medium'>Create a Telegram account</p>
                    <p className='text-sm text-muted-foreground text-justify'>Create an account on Telegram.</p>
                  </div>
                </div>

                <div className='flex items-start space-x-3'>
                  <div className='flex size-5 shrink-0 items-center justify-center rounded-full bg-blue-500 text-white text-sm mt-1'>
                    2
                  </div>
                  <div className='space-y-1'>
                    <p className='font-medium'>Start a conversation with Post-pilot bot</p>
                    <p className='text-sm text-muted-foreground text-justify'>
                      Open Telegram and search for @PostpilotVN_bot. Start a chat.
                    </p>
                  </div>
                </div>

                <div className='flex items-start space-x-3'>
                  <div className='flex size-5 shrink-0 items-center justify-center rounded-full bg-blue-500 text-white text-sm mt-1'>
                    3
                  </div>
                  <div className='space-y-1'>
                    <p className='font-medium'>Connect your Telegram account</p>
                    <p className='text-sm text-muted-foreground text-justify'>
                      Click on the Connect Telegram button on the side of the card to connect your Telegram account to
                      Post-pilot.
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <TelegramBot />

          <Card className='border-primary dark:border-primary/20 bg-muted/20 lg:col-span-2'>
            <CardHeader>
              <CardTitle>Notification Settings</CardTitle>
              <CardDescription>Configure when you want to receive Telegram notifications</CardDescription>
            </CardHeader>
            <CardContent>
              <div className='space-y-4'>
                <div className='flex items-center justify-between gap-1'>
                  <div className='space-y-0.5'>
                    <Label className='text-base'>Post Published</Label>
                    <p className='text-sm text-muted-foreground'>Receive notification when a post is published</p>
                  </div>
                  <Switch />
                </div>
                <Separator />
                <div className='flex items-center justify-between gap-1'>
                  <div className='space-y-0.5'>
                    <Label className='text-base'>Post Failed</Label>
                    <p className='text-sm text-muted-foreground'>Receive notification when a post fails to publish</p>
                  </div>
                  <Switch defaultChecked />
                </div>
                <Separator />
                <div className='flex items-center justify-between gap-1'>
                  <div className='space-y-0.5'>
                    <Label className='text-base'>High Engagement</Label>
                    <p className='text-sm text-muted-foreground'>
                      Receive notification when a post gets high engagement
                    </p>
                  </div>
                  <Switch />
                </div>
                <Separator />
                <div className='flex items-center justify-between gap-1'>
                  <div className='space-y-0.5'>
                    <Label className='text-base'>Daily Summary</Label>
                    <p className='text-sm text-muted-foreground'>Receive a daily summary of your posts performance</p>
                  </div>
                  <Switch defaultChecked />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
