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
    ),

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  connectTelegram: (body: any) => http.post<{ message: string }>('/auth/telegram', body)
}

export default authApis
