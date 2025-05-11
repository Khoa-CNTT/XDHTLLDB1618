import http from '@/utils/http'

import { CreateRecurringRequest, RecurringPost } from '@/types/post'
import { SuccessResponse } from '@/types/utils'

const RECURRING_API_URI = '/recurring'

const recurringApis = {
  createRecurring: (data: CreateRecurringRequest) => {
    return http.post<SuccessResponse<RecurringPost>>(RECURRING_API_URI, data)
  }
}

export default recurringApis
