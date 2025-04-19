'use client'

import { useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import configs from '@/configs'
import { PLATFORM_TYPE } from '@/constants'
import { Platform } from '@/constants/credentials'
import { useCreateCredentialMutation } from '@/queries/credentials'

import { Button } from '@/components/ui/button'

export default function Instagram({ btnText }: { btnText: string }) {
  const handleConnect = async () => {
    const url = `https://www.instagram.com/oauth/authorize?enable_fb_login=0&force_authentication=1&client_id=${configs.instagramAppId}&redirect_uri=${configs.instagramRedirectUri}&response_type=code&scope=instagram_business_basic%2Cinstagram_business_manage_messages%2Cinstagram_business_manage_comments%2Cinstagram_business_content_publish%2Cinstagram_business_manage_insights&state=instagram`
    window.location.href = url
  }

  const router = useRouter()

  const createCredentialMutation = useCreateCredentialMutation(Platform.INSTAGRAM)

  const searchParams = useSearchParams()
  const connectInstagram = async (code: string) => {
    const data = [
      {
        platform: PLATFORM_TYPE.INSTAGRAM,
        credentials: {
          code,
          redirect_uri: `${configs.returnUrl}/connect`
        }
      }
    ]
    await createCredentialMutation.mutateAsync(data)
    router.push('/connect')
  }
  useEffect(() => {
    const code = searchParams.get('code')
    if (code) connectInstagram(code)
  }, [searchParams])

  return <Button onClick={handleConnect}>{btnText}</Button>
}
