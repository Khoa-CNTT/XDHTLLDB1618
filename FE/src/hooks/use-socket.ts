import { useEffect, useRef } from 'react'
import configs from '@/configs'
import { io, Socket } from 'socket.io-client'

export const useSocket = () => {
  const socketRef = useRef<Socket | null>(null)

  useEffect(() => {
    if (!socketRef.current) {
      const socket = io(configs.socketUrl || 'http://localhost:3000', {
        transports: ['websocket'],
        autoConnect: true,
        reconnection: true,
        reconnectionAttempts: 5,
        reconnectionDelay: 1000
      })

      socket.on('connect', () => {
        console.log('Socket connected with ID:', socket.id)
      })

      socket.on('disconnect', () => {
        console.log('Socket disconnected')
      })

      socket.on('connect_error', (error) => {
        console.error('Socket connection error:', error)
      })

      socketRef.current = socket
      console.log('socketRef.curren1', socketRef.current)
    }

    // Cleanup function
    return () => {
      if (socketRef.current) {
        socketRef.current.disconnect()
      }
    }
  }, [])

  return socketRef.current
}
