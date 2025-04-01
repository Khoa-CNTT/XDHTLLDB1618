import http from '@/utils/http'

const genAIApis = {
  genAI: (data: { data: string }) => {
    return http.post<string>('/api/ai', data, {
      baseURL: ''
    })
  }
}

export default genAIApis
