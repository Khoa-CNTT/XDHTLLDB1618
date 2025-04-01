import credentialApi from '@/apis/credentials.api'
import { PlatformType } from '@/constants/credentials'
import { useQuery } from '@tanstack/react-query'

export const useCredentialQuery = (platform?: PlatformType) => {
  return useQuery({
    queryKey: ['credentials', platform],
    queryFn: () => credentialApi.getCredentialClient(platform)
  })
}
