import { PlatformType } from '@/constants/credentials'
import http from '@/utils/http'

import { Credential } from '@/types/credentials'

const CREDENTIAL_URI = '/social-credentials'

const credentialApi = {
  getCredential: (accessToken: string) => {
    return http.get<Credential[]>(CREDENTIAL_URI, {
      headers: {
        Authorization: `Bearer ${accessToken}`
      }
    })
  },

  getCredentialClient: (platform?: PlatformType) => {
    return http.get<Credential[]>(CREDENTIAL_URI, {
      params: {
        platform
      }
    })
  },

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  connectSocialAccount(data: any) {
    return http.post(CREDENTIAL_URI, data)
  }
}

export default credentialApi
