import http from '@/utils/http'

import {
  CreateRecurringRequest,
  RecurringPost,
  RecurringPostInstance,
  UpdatePostRequest,
  UpdateRecurringRequest
} from '@/types/post'
import { SuccessResponse } from '@/types/utils'

const RECURRING_API_URI = '/recurring'

const recurringApis = {
  createRecurring: (data: CreateRecurringRequest) => {
    return http.post<SuccessResponse<RecurringPost>>(RECURRING_API_URI, data)
  },
  updateRecurring: (id: string, data: UpdateRecurringRequest) => {
    return http.patch<SuccessResponse<RecurringPost>>(`${RECURRING_API_URI}/${id}`, data)
  },
  updateRecurringInstance: (id: string, data: UpdatePostRequest) => {
    return http.patch<SuccessResponse<RecurringPostInstance>>(`${RECURRING_API_URI}/${id}/instance`, data)
  },
  deleteRecurring: (id: string) => {
    return http.delete<SuccessResponse<RecurringPost>>(`${RECURRING_API_URI}/${id}`)
  },
  deleteRecurringInstance: (id: string, publicationTime: string) => {
    return http.delete<SuccessResponse<RecurringPost>>(`${RECURRING_API_URI}/${id}/instance`, {
      params: { publicationTime }
    })
  }
}

export default recurringApis
