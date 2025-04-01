import { create } from 'zustand'

import { Post } from '@/types/post'

export const useAppContext = create<{
  openCreateScheduleModal: boolean
  setOpenCreateScheduleModal: (open: boolean) => void
  post: Post | undefined
  setPost: (post: Post | undefined) => void
  reset: () => void
}>((set) => ({
  openCreateScheduleModal: false,
  setOpenCreateScheduleModal: (open) => set({ openCreateScheduleModal: open }),
  post: undefined,
  setPost: (post) => set({ post }),
  reset: () => set({ openCreateScheduleModal: false, post: undefined })
}))

export const useAuthContext = create<{
  accessToken?: string | null
  setAccessToken: (token?: string | null) => void
  isSyncAuthenticated: boolean
  setIsSyncAuthenticated: (isAuthenticated: boolean) => void
  reset: () => void
}>((set) => ({
  accessToken: null,
  setAccessToken: (accessToken) => set({ accessToken }),
  isSyncAuthenticated: false,
  setIsSyncAuthenticated: (isSyncAuthenticated) => set({ isSyncAuthenticated }),
  reset: () => set({ accessToken: null, isSyncAuthenticated: false })
}))
