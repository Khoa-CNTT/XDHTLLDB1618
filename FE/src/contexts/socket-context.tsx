import configs from '@/configs'
import { io, Socket } from 'socket.io-client'
import { create } from 'zustand'

interface SocketStore {
  socket: Socket | null
  connect: () => void
  disconnect: () => void
}

export const useSocketStore = create<SocketStore>((set, get) => ({
  socket: null,
  connect: () => {
    const { socket } = get()
    if (!socket) {
      const newSocket = io(configs.socketUrl || 'http://localhost:3000', {
        transports: ['websocket'],
        autoConnect: true,
        reconnection: true,
        reconnectionAttempts: 5,
        reconnectionDelay: 1000
      })

      newSocket.on('connect', () => {
        console.log('Socket connected with ID:', newSocket.id)
      })

      newSocket.on('disconnect', () => {
        console.log('Socket disconnected')
      })

      newSocket.on('connect_error', (error) => {
        console.error('Socket connection error:', error)
      })

      set({ socket: newSocket })
    }
  },
  disconnect: () => {
    const { socket } = get()
    if (socket) {
      socket.disconnect()
      set({ socket: null })
    }
  }
}))
