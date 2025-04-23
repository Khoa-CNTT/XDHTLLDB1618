import http from '@/utils/http'

const genAIApis = {
  genAI: (data: { data: string }) => {
    return fetch('/api/ai', {
      method: 'POST',
      body: JSON.stringify(data)
    })
  }
}

export default genAIApis
