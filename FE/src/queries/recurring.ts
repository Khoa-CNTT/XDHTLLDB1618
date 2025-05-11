import recurringApis from '@/apis/recurring.api'
import { useMutation, useQueryClient } from '@tanstack/react-query'

export const useCreateRecurring = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: recurringApis.createRecurring,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['posts'] })
    }
  })
}
