'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useSearchParams } from 'next/navigation'
import { DEFAULT_NUMBER_OF_SKELETON } from '@/constants'
import { Platform, PlatformType } from '@/constants/credentials'
import { useCredentialQuery, useDisconnectSocialAccountMutation } from '@/queries/credentials'
import { ExternalLink, Loader2, Unlink } from 'lucide-react'
import { useTranslations } from 'next-intl'

import { handleErrorApi } from '@/lib/utils'
import { toast } from '@/hooks/use-toast'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import PlatformSkeleton from '@/components/skeleton/platform-skeleton'

import { Facebook, Threads, X } from './components'
import Instagram from './components/instagram'

// import { useCredentialQuery } from '@/queries/credentials'

export interface Account {
  id: string
  name: string
  email: string
  avatar: string
  pages: Array<{
    id: string
    name: string
    type: string
    url: string
  }>
}

interface PlatformAccountsProps {
  platformId: PlatformType
}

export function PlatformAccounts({ platformId = Platform.FACEBOOK }: PlatformAccountsProps) {
  const searchParams = useSearchParams()
  const isNotAllowFetching = Boolean(
    searchParams.get('code') || searchParams.get('oauth_token') || searchParams.get('oauth_verifier')
  )

  const { data: credentials, isLoading } = useCredentialQuery(platformId, isNotAllowFetching)
  const t = useTranslations('connect')
  const btnTextConnect = t('connectAccount')

  const [disconnectingAccountId, setDisconnectingAccountId] = useState<string | null>(null)

  const getPlatformButton = () => {
    switch (platformId) {
      case Platform.FACEBOOK:
        return <Facebook btnText={btnTextConnect} />
      case Platform.THREADS:
        return <Threads btnText={btnTextConnect} />
      case Platform.X:
        return <X btnText={btnTextConnect} />
      case Platform.INSTAGRAM:
        return <Instagram btnText={btnTextConnect} />
      default:
        return null
    }
  }

  const { mutateAsync: disconnectSocialAccount } = useDisconnectSocialAccountMutation(platformId)

  const handleDisconnect = async (accountId: string) => {
    if (disconnectingAccountId) return
    try {
      setDisconnectingAccountId(accountId)
      const res = await disconnectSocialAccount(accountId)
      toast({
        title: t('success'),
        description: t('disconnectSuccess')
      })
    } catch (error) {
      handleErrorApi({
        error
      })
    } finally {
      setDisconnectingAccountId(null)
    }
  }

  return (
    <Card>
      <CardContent className='pt-6'>
        <div className='flex justify-end mb-6'>{getPlatformButton()}</div>
        {isLoading || isNotAllowFetching ? (
          <div className='space-y-4'>
            {Array(DEFAULT_NUMBER_OF_SKELETON)
              .fill(0)
              .map((_, index) => (
                <PlatformSkeleton key={index} />
              ))}
          </div>
        ) : (
          <div className='space-y-4'>
            {credentials?.data.data && credentials.data.data.length > 0 ? (
              credentials?.data?.data.map((account) => (
                <div
                  key={account.id}
                  className='flex flex-col sm:flex-row sm:items-center justify-between rounded-lg border p-4 gap-1'
                >
                  <div className='flex items-center gap-4'>
                    {/* INFO: BE do not return avatar yet */}
                    <Avatar className='size-12 border'>
                      <AvatarImage src={account.metadata.avatar_url} />
                      <AvatarFallback>{account.metadata.name.charAt(0) ?? ''}</AvatarFallback>
                    </Avatar>
                    <div>
                      <h4 className='font-semibold'>{account.metadata.name}</h4>
                      <p className='text-sm text-muted-foreground'>
                        {account.metadata.fan_count ?? account.metadata.username}
                      </p>
                    </div>
                  </div>
                  <div className='flex items-center gap-2 ml-auto'>
                    {/* TODO: replace by url link */}
                    <Link href={account.metadata.name || '#'}>
                      <ExternalLink />
                    </Link>
                    <Button
                      variant='destructive'
                      onClick={() => handleDisconnect(account.id)}
                      disabled={disconnectingAccountId === account.id}
                    >
                      {disconnectingAccountId === account.id && <Loader2 className='size-4 animate-spin mr-2' />}
                      <Unlink />
                    </Button>
                  </div>
                </div>
              ))
            ) : (
              <div className='text-center py-8 text-muted-foreground'>{t('noConnectedPlatform')}</div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
