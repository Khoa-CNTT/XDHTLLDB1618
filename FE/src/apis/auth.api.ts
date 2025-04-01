import http from '@/utils/http'

const authApis = {
  login: (token: string) =>
    http.post<{ token: string }>(
      '/api/auth/login',
      { token },
      {
        baseURL: ''
      }
    ),

  logout: () =>
    http.post<{ message: string }>(
      '/api/auth/logout',
      {},
      {
        baseURL: ''
      }
    )
}

export default authApis
