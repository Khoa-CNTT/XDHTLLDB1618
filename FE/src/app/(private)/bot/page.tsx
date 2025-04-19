'use client'

import { useEffect, useState } from 'react'
import authApis from '@/apis/auth.api'
import configs from '@/configs'
import axios from 'axios'
import { BellRing, MessageSquare, Users } from 'lucide-react'
import { FaTelegram } from 'react-icons/fa'
import TelegramLoginButton, { TelegramUser } from 'telegram-login-button'

import { toast } from '@/hooks/use-toast'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'

const BOT_NAME = configs.telegramBotName

export default function ConnectPage() {
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const handleTelegramResponse = async (response: TelegramUser) => {
    if (isLoading) return
    try {
      setIsLoading(true)
      const res = await authApis.connectTelegram({
        telegramId: response.id,
        username: response.username
      })
      if (res.data) {
        toast({
          title: 'Success',
          description: res.data.message ?? 'Telegram connected successfully'
        })
      }
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to connect Telegram'
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className='flex flex-col gap-6 p-6'>
      <div className='flex items-center justify-between'>
        <h1 className='text-2xl font-bold'>Connect Bot</h1>
        <Button variant='outline'>
          <Users className='mr-2 size-4' />
          Manage Bot
        </Button>
      </div>

      <div className='max-w-[400px]'>
        <Card className=' hover:border-blue-600 transition-colors cursor-pointer h-full'>
          <CardHeader>
            <div className='flex items-center justify-between'>
              <CardTitle className='flex items-center'>
                <FaTelegram className='mr-2 size-7 text-blue-500' />
                Telegram
              </CardTitle>
              <span className='px-2 py-1 text-xs rounded-full bg-green-500/20 text-green-500'>Connected</span>
            </div>
            <CardDescription>Receive notifications via Telegram bot</CardDescription>
          </CardHeader>
          <CardContent>
            <p className='text-sm '>
              Connect your Telegram account to receive instant notifications about your scheduled posts.
            </p>
          </CardContent>
          <CardFooter>
            <TelegramLoginButton
              dataOnauth={handleTelegramResponse}
              botName={BOT_NAME}
              className='w-full h-12 flex items-center justify-center rounded-md text-lg font-semibold focus:outline-none'
            />
          </CardFooter>
        </Card>
      </div>
    </div>
  )
}
