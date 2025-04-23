/* eslint-disable @typescript-eslint/no-explicit-any */
import { redirectLogout } from '@/actions/redirect-logout'
import authApis from '@/apis/auth.api'
import configs from '@/configs'
import path from '@/constants/path'
import axios, { AxiosError, HttpStatusCode } from 'axios'

import { toast } from '@/hooks/use-toast'

import {
  getAccessTokenFromLocalStorage,
  removeTokensFromLocalStorage,
  setAccessTokenToLocalStorage
} from './local-storage'

export const isAxiosUnprocessableEntityError = (error: AxiosError) => {
  return axios.isAxiosError(error) && error.response?.status === HttpStatusCode.UnprocessableEntity
}

export const isAxiosUnauthorizedError = (error: AxiosError) => {
  return axios.isAxiosError(error) && error.response?.status === HttpStatusCode.Unauthorized
}

type HttpErrorPayload = {
  msg: string
  [key: string]: any
}

type UnprocessableEntityErrorPayload = HttpErrorPayload & {
  errors: {
    [key: string]: string
  }
}

export class HttpError extends Error {
  status: number
  payload: {
    msg: string
    [key: string]: any
  }
  constructor(status: number, payload: HttpErrorPayload) {
    super(payload?.msg ?? 'An error occurred')
    this.status = status
    this.payload = payload
  }
}

export class UnprocessableEntityError extends HttpError {
  status = HttpStatusCode.UnprocessableEntity
  payload: UnprocessableEntityErrorPayload
  constructor(payload: UnprocessableEntityErrorPayload) {
    super(HttpStatusCode.UnprocessableEntity, payload)
    this.payload = payload
  }
}

const isClient = typeof window !== 'undefined'
const http = axios.create({
  baseURL: configs.baseUrl,
  timeout: 20000,
  headers: {
    'Content-Type': 'application/json'
  }
})

http.interceptors.request.use(
  function (config) {
    const baseUrl = config.baseURL === '' ? configs.nextServerUrl : config.baseURL
    config.baseURL = baseUrl
    // Do something before request is sent
    if (isClient) {
      const accessToken = getAccessTokenFromLocalStorage()
      if (accessToken) {
        config.headers['Authorization'] = `Bearer ${accessToken}`
      }
    }

    return config
  },
  function (error) {
    // Do something with request error
    return Promise.reject(error)
  }
)

// Add a response interceptor
http.interceptors.response.use(
  function (response) {
    // Any status code that lie within the range of 2xx cause this function to trigger
    // Do something with response data
    return response
  },
  async function (error: AxiosError) {
    let clientLogoutRequest: null | (() => Promise<any>) = null

    if (isAxiosUnprocessableEntityError(error)) {
      throw new UnprocessableEntityError(error.response?.data as UnprocessableEntityErrorPayload)
    }

    if (isAxiosUnauthorizedError(error)) {
      if (isClient) {
        if (!clientLogoutRequest) {
          clientLogoutRequest = authApis.logout
        }

        try {
          const toastId = toast({
            title: 'Error',
            description: 'You are not authorized to access this page, logging out...',
            variant: 'destructive'
          })
          await clientLogoutRequest()
          await window.Clerk.signOut({ redirectUrl: path.login })
          toastId.dismiss()
        } catch {
          console.error('Error when logout', error)
        } finally {
          clientLogoutRequest = null
        }
      } else {
        return redirectLogout()
      }
    }

    throw new HttpError(error.response?.status ?? 500, error.response?.data as HttpErrorPayload)
  }
)

export default http
