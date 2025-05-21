import { PlatformType } from '@/constants/credentials'
import http from '@/utils/http'

import { Credential } from '@/types/credentials'
import { SuccessResponse } from '@/types/utils'

const CREDENTIAL_URI = '/social-credentials'

const credentialApi = {
  getCredential: (accessToken: string) => {
    return http.get<SuccessResponse<Credential[]>>(CREDENTIAL_URI, {
      headers: {
        Authorization: `Bearer ${accessToken}`
      }
    })
  },

  getCredentialClient: (platform?: PlatformType) => {
    return http.get<SuccessResponse<Credential[]>>(CREDENTIAL_URI, {
      params: {
        platform
      }
    })
  },

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  connectSocialAccount(data: any) {
    return http.post(CREDENTIAL_URI, data)
  },

  disconnectSocialAccount(id: string) {
    return http.patch<{ message: string }>(`${CREDENTIAL_URI}/${id}/disconnect`)
  }
}

export default credentialApi
