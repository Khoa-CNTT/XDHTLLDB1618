import recurringApis from '@/apis/recurring.api'
import { useMutation, useQueryClient } from '@tanstack/react-query'

import { UpdatePostRequest, UpdateRecurringRequest } from '@/types/post'

export const useCreateRecurring = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: recurringApis.createRecurring,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['posts'] })
    }
  })
}

export const useUpdateRecurringMutation = (id: string) => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (data: UpdateRecurringRequest) => recurringApis.updateRecurring(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['posts'] })
    }
  })
}

export const useUpdateRecurringInstanceMutation = (id: string) => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (data: UpdatePostRequest) => recurringApis.updateRecurringInstance(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['posts'] })
    }
  })
}

export const useDeleteRecurringMutation = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (id: string) => recurringApis.deleteRecurring(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['posts'] })
    }
  })
}

export const useDeleteRecurringInstanceMutation = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (data: { id: string; publicationTime: string }) =>
      recurringApis.deleteRecurringInstance(data.id, data.publicationTime),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['posts'] })
    }
  })
}
