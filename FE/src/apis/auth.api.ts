import http from '@/utils/http'

const authApis = {
  login: (token: string) =>
    fetch('/api/auth/login', {
      method: 'POST',
      body: JSON.stringify({ token })
    }),

  logout: () =>
    fetch('/api/auth/logout', {
      method: 'POST'
    }),

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  connectTelegram: (body: any) => http.post<{ message: string }>('/auth/telegram', body),

  getTelegramStatus: () => http.get<{ linked: boolean }>('/auth/telegram-status')
}

export default authApis
