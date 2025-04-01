'use client'

import { useEffect } from 'react'
import { useAuthContext } from '@/contexts/app-context'

export interface AppProviderProps {
  children: React.ReactNode
  accessToken?: string | null
  isSyncAuthenticated: boolean
}

export default function AppProvider({ children, accessToken, isSyncAuthenticated }: AppProviderProps) {
  const { setAccessToken, setIsSyncAuthenticated } = useAuthContext()
  useEffect(() => {
    if (accessToken) {
      setAccessToken(accessToken)
    }
    if (isSyncAuthenticated) {
      setIsSyncAuthenticated(isSyncAuthenticated)
    }
  }, [accessToken, setAccessToken, isSyncAuthenticated, setIsSyncAuthenticated])
  return children
}
