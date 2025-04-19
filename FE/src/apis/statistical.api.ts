import http from '@/utils/http'

import { Statistical, SuccessResponse } from '@/types/utils'

const STATISTICAL_URI = '/statistical'

const statisticalApi = {
  getStatisticalServer: (accessToken: string) =>
    http.get<SuccessResponse<Statistical>>(STATISTICAL_URI, {
      headers: {
        Authorization: `Bearer ${accessToken}`
      }
    })
}

export default statisticalApi
