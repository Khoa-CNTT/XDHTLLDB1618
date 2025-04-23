import authApis from '@/apis/auth.api'
import { useMutation, useQuery } from '@tanstack/react-query'

export const useAuthLogin = () => {
  return useMutation({
    mutationFn: (token: string) => authApis.login(token).then((res) => res.json() as Promise<{ token: string }>)
  })
}

export const useAuthLogout = () => {
  return useMutation({
    mutationFn: () => authApis.logout().then((res) => res.json() as Promise<{ message: string }>)
  })
}

export const useGetTelegramStatus = () => {
  return useQuery({
    queryKey: ['telegram-status'],
    queryFn: () => authApis.getTelegramStatus()
  })
}
