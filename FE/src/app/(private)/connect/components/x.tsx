'use client'

import { useEffect, useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import credentialApi from '@/apis/credentials.api'
import configs from '@/configs'
import { Platform } from '@/constants/credentials'
import { useCreateCredentialMutation } from '@/queries/credentials'
import {
  getXCodeVerifierFromLocalStorage,
  removeXCodeVerifierFromLocalStorage,
  setXCodeVerifierToLocalStorage
} from '@/utils/local-storage'
import { generatePkcePair } from '@/utils/utils'
import { Loader2 } from 'lucide-react'

import { toast } from '@/hooks/use-toast'
import { Button } from '@/components/ui/button'

export default function X({ btnText }: { btnText: string }) {
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const searchParams = useSearchParams()
  const createCredentialMutation = useCreateCredentialMutation(Platform.X)
  const router = useRouter()

  useEffect(() => {
    const code = searchParams.get('code')
    if (code) handleConnectX(code)
  }, [searchParams])

  const handleConnect = async () => {
    const pkcePair = await generatePkcePair()
    const codeVerifier = pkcePair.codeVerifier
    const codeChallenge = pkcePair.codeChallenge
    setXCodeVerifierToLocalStorage(codeVerifier)
    const options = {
      response_type: 'code',
      client_id: configs.xClientId,
      redirect_uri: `https://localhost:3001/connect?platform=x`,
      scope: 'tweet.read tweet.write users.read follows.read offline.access media.write like.read like.write',
      state: 'state',
      code_challenge: codeChallenge,
      code_challenge_method: 'S256'
    }
    const url = `https://x.com/i/oauth2/authorize?${new URLSearchParams(options).toString()}`
    window.location.href = url
  }

  const handleConnectX = async (code: string) => {
    const xCodeVerifier = getXCodeVerifierFromLocalStorage()
    const data = [
      {
        platform: Platform.X,
        credentials: {
          code,
          redirect_uri: `${configs.returnUrl}/connect?platform=x`,
          code_verifier: xCodeVerifier
        }
      }
    ]
    await createCredentialMutation.mutateAsync(data)
    removeXCodeVerifierFromLocalStorage()
    router.push('/connect')
  }

  return (
    <Button onClick={handleConnect} disabled={isLoading}>
      {isLoading && <Loader2 className='size-8 animate-spin mr-2' />}
      {btnText}
    </Button>
  )
}
