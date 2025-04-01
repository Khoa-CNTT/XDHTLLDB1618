import authApis from '@/apis/auth.api'
import { useMutation } from '@tanstack/react-query'

export const useAuthLogin = () => {
  return useMutation({
    mutationFn: (token: string) => authApis.login(token)
  })
}

export const useAuthLogout = () => {
  return useMutation({
    mutationFn: () => authApis.logout()
  })
}
