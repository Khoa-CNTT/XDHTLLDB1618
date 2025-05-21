import credentialApi from '@/apis/credentials.api'
import { PlatformType } from '@/constants/credentials'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'

export const useCredentialQuery = (platform?: PlatformType, notAllowFetching?: boolean) => {
  return useQuery({
    queryKey: ['credentials', platform],
    queryFn: () => credentialApi.getCredentialClient(platform),
    enabled: !notAllowFetching
  })
}

export const useCreateCredentialMutation = (platform?: PlatformType) => {
  const queryClient = useQueryClient()
  return useMutation({
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    mutationFn: (data: any) => credentialApi.connectSocialAccount(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['credentials', platform] })
    }
  })
}

export const useDisconnectSocialAccountMutation = (platform?: PlatformType) => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (id: string) => credentialApi.disconnectSocialAccount(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['credentials', platform] })
    }
  })
}
