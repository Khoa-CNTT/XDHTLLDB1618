import React, { useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import credentialApi from '@/apis/credentials.api'
import configs from '@/configs'

import { Button } from '@/components/ui/button'

export default function Threads() {
  const handleLogin = () => {
    const authUrl = `https://threads.net/oauth/authorize?client_id=${configs.threadAppId}&redirect_uri=${configs.returnUrl}/connect?platform=threads&scope=threads_basic,threads_content_publish,threads_read_replies,threads_manage_replies,threads_manage_insights&response_type=code`
    window.location.href = authUrl
  }
  const router = useRouter()

  const searchParams = useSearchParams()
  const connectThreads = async (code: string) => {
    await credentialApi.connectSocialAccount([
      {
        platform: 'threads',
        credentials: {
          code,
          redirectURI: `${configs.returnUrl}/connect?platform=threads`
        }
      }
    ])
    router.push('/connect?platform=threads')
  }
  useEffect(() => {
    const code = searchParams.get('code')
    if (code) connectThreads(code)
  }, [searchParams])

  return <Button onClick={handleLogin}>Connect New Account</Button>
}
