import { TokenType } from '@/constants/token'

const isClient = typeof window !== 'undefined'

export const getAccessTokenFromLocalStorage = () => (isClient ? localStorage.getItem(TokenType.ACCESS_TOKEN) : null)

export const setAccessTokenToLocalStorage = (value: string) =>
  isClient && localStorage.setItem(TokenType.ACCESS_TOKEN, value)
export const removeTokensFromLocalStorage = () => {
  if (isClient) {
    localStorage.removeItem(TokenType.ACCESS_TOKEN)
  }
}

export const setXCodeVerifierToLocalStorage = (value: string) =>
  isClient && localStorage.setItem('X_CODE_VERIFIER', value)

export const getXCodeVerifierFromLocalStorage = () => (isClient ? localStorage.getItem('X_CODE_VERIFIER') : null)

export const removeXCodeVerifierFromLocalStorage = () => {
  if (isClient) {
    localStorage.removeItem('X_CODE_VERIFIER')
  }
}
