'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import path from '@/constants/path'
import { useAppContext, useAuthContext } from '@/contexts/app-context'
import { useAuthLogout } from '@/queries/auth'
import { removeTokensFromLocalStorage } from '@/utils/local-storage'
import { useClerk } from '@clerk/nextjs'
import { Loader2 } from 'lucide-react'

export default function LogoutPage() {
  const logoutMutation = useAuthLogout()
  const router = useRouter()
  const { signOut } = useClerk()

  const { reset: resetAuthContext } = useAuthContext()
  const { reset: resetAppContext } = useAppContext()

  const resetContext = () => {
    resetAuthContext()
    resetAppContext()
  }

  useEffect(() => {
    logoutMutation.mutateAsync().then(() => {
      removeTokensFromLocalStorage()
      signOut(() => {
        resetContext()
        router.push(path.login)
      })
    })

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <div className='flex h-screen items-center justify-center text-xl'>
      <Loader2 className='size-8 animate-spin mr-2' />
      You are not authorized, logging out...
    </div>
  )
}
