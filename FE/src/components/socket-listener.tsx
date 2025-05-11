import { useEffect } from 'react'
import { useSocketStore } from '@/contexts/socket-context'

interface SocketListenerProps {
  onPostProcessed?: (data: { postId: string; status: string; timestamp: string }) => void
  onPostFailed?: (data: { postId: string; status: string; error: string; timestamp: string }) => void
}

export const SocketListener = ({ onPostProcessed, onPostFailed }: SocketListenerProps) => {
  const socket = useSocketStore((state) => state.socket)

  useEffect(() => {
    if (!socket) return

    if (onPostProcessed) {
      socket.on('post:processed', onPostProcessed)
    }

    if (onPostFailed) {
      socket.on('post:failed', onPostFailed)
    }

    return () => {
      if (onPostProcessed) {
        socket.off('post:processed', onPostProcessed)
      }
      if (onPostFailed) {
        socket.off('post:failed', onPostFailed)
      }
    }
  }, [socket, onPostProcessed, onPostFailed])

  return null
}
