import mediaApis from '@/apis/media.api'
import { useMutation } from '@tanstack/react-query'

import { Credential } from '@/types/credentials'

export const useUploadImagesMutation = (credential: Credential) => {
  return useMutation({
    mutationFn: (data: File[]) => mediaApis.handleUploadImages(data, credential)
  })
}
