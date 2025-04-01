import genAIApis from '@/apis/genAI.api'
import { useMutation } from '@tanstack/react-query'

export const useGenAI = () => {
  return useMutation({
    mutationFn: (data: { data: string }) => genAIApis.genAI(data)
  })
}
