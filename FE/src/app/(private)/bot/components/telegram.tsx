'use client'

import authApis from '@/apis/auth.api'
import configs from '@/configs'
import { useGetTelegramStatus } from '@/queries/auth'
import { useTranslations } from 'next-intl'
import { FaTelegram } from 'react-icons/fa'
import TelegramLoginButton, { TelegramUser } from 'telegram-login-button'

import { cn } from '@/lib/utils'
import { toast } from '@/hooks/use-toast'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'

const BOT_NAME = configs.telegramBotName

export default function TelegramBot() {
  const t = useTranslations('bot')
  const { data: telegramStatus, refetch } = useGetTelegramStatus()
  const handleTelegramResponse = async (response: TelegramUser) => {
    try {
      const res = await authApis.connectTelegram({
        id: response.id,
        first_name: response.first_name,
        username: response.username,
        photo_url: response.photo_url,
        auth_date: response.auth_date,
        hash: response.hash
      })
      toast({
        title: 'Success',
        description: res.data.message ?? t('telegramConnected')
      })
      await refetch()
    } catch (error) {
      toast({
        title: 'Error',
        description: t('telegramFailed')
      })
    }
  }
  return (
    <Card className='border-primary dark:border-primary/20 bg-muted/20 hover:border-blue-600 transition-colors cursor-pointer h-full flex flex-col'>
      <CardHeader>
        <div className='flex items-center justify-between'>
          <CardTitle className='flex items-center'>
            <FaTelegram className='mr-2 size-7 text-blue-500' />
            {t('telegram')}
          </CardTitle>
          <span
            className={cn(
              'px-2 py-1 text-xs rounded-full',
              telegramStatus?.data.linked ? 'bg-green-500/20 text-green-500' : 'bg-red-500/20 text-red-500'
            )}
          >
            {telegramStatus?.data.linked ? t('connected') : t('notConnected')}
          </span>
        </div>
        <CardDescription>{t('telegramDes')}</CardDescription>
      </CardHeader>
      <CardContent className='flex-1 flex flex-col gap-4'>
        <p className='font-medium'>{t('telegramContent')}</p>
        <TelegramLoginButton
          dataOnauth={handleTelegramResponse}
          botName={BOT_NAME}
          className='size-full flex items-center justify-center rounded-md text-lg font-semibold focus:outline-none'
        />
      </CardContent>
    </Card>
  )
}
