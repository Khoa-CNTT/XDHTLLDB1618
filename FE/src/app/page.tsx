'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import path from '@/constants/path'
import { useAuthContext } from '@/contexts/app-context'
import { useAuthLogin } from '@/queries/auth'

import LoadingIndicator from '@/components/loading-indicator'

export default function Home() {
  const { accessToken, isSyncAuthenticated, setIsSyncAuthenticated } = useAuthContext()
  const { mutateAsync: login } = useAuthLogin()
  const router = useRouter()

  useEffect(() => {
    if (isSyncAuthenticated && accessToken) {
      return router.push(path.schedules)
    }
    if (!isSyncAuthenticated && accessToken) {
      const getTokenAsync = async () => {
        await login(accessToken)
        setIsSyncAuthenticated(true)
        return router.push(path.schedules)
      }
      getTokenAsync()
    }

    return router.push(path.login)
  }, [login, router, accessToken, isSyncAuthenticated, setIsSyncAuthenticated])

  return <LoadingIndicator />
}
