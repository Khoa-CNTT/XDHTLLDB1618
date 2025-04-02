import mediaApis from '@/apis/media.api'
import { useMutation } from '@tanstack/react-query'

export const useUploadImagesMutation = () => {
  return useMutation({
    mutationFn: (data: File[]) => mediaApis.handleUploadImages(data)
  })
}
