import genAIApis from '@/apis/genAI.api'
import { useMutation } from '@tanstack/react-query'

export const useGenAI = () => {
  return useMutation({
    mutationFn: (data: { data: string }) => genAIApis.genAI(data).then((res) => res.json() as Promise<string>)
  })
}
