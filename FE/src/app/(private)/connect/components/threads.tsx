import React, { useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import configs from '@/configs'
import { PLATFORM_TYPE } from '@/constants'
import { Platform } from '@/constants/credentials'
import { useCreateCredentialMutation } from '@/queries/credentials'

import { Button } from '@/components/ui/button'

export default function Threads({ btnText }: { btnText: string }) {
  const handleLogin = () => {
    const authUrl = `https://threads.net/oauth/authorize?client_id=${configs.threadAppId}&redirect_uri=${configs.returnUrl}/connect?platform=threads&scope=threads_basic,threads_content_publish,threads_read_replies,threads_manage_replies,threads_manage_insights&response_type=code`
    window.location.href = authUrl
  }
  const router = useRouter()

  const createCredentialMutation = useCreateCredentialMutation(Platform.THREADS)

  const searchParams = useSearchParams()
  const connectThreads = async (code: string) => {
    const data = [
      {
        platform: PLATFORM_TYPE.THREADS,
        credentials: {
          code,
          redirect_uri: `${configs.returnUrl}/connect?platform=threads`
        }
      }
    ]
    await createCredentialMutation.mutateAsync(data)
    router.push('/connect')
  }
  useEffect(() => {
    const code = searchParams.get('code')
    if (code) connectThreads(code)
  }, [searchParams])

  return <Button onClick={handleLogin}>{btnText}</Button>
}
