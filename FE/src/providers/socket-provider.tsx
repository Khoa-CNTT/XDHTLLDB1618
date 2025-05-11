'use client'

import { useEffect } from 'react'
import { useSocketStore } from '@/contexts/socket-context'

export function SocketProvider({ children }: { children: React.ReactNode }) {
  const connect = useSocketStore((state) => state.connect)
  const disconnect = useSocketStore((state) => state.disconnect)

  useEffect(() => {
    connect()
    return () => {
      disconnect()
    }
  }, [connect, disconnect])

  return children
}
