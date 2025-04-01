'use client'

/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect } from 'react'
import credentialApi from '@/apis/credentials.api'
import configs from '@/configs'
import { QueryObserverResult, RefetchOptions } from '@tanstack/react-query'

import { Button } from '@/components/ui/button'

interface Props {
  btnText: string
  refetch: (options?: RefetchOptions) => Promise<QueryObserverResult>
}

const loadFacebookSDK = () => {
  return new Promise((resolve, reject) => {
    if (window.FB) {
      resolve(window.FB)
      return
    }

    const script = document.createElement('script')
    script.src = 'https://connect.facebook.net/en_US/sdk.js'
    script.async = true
    script.defer = true
    script.crossOrigin = 'anonymous'
    script.onload = () => {
      window.FB.init({
        appId: configs.fbAppId,
        cookie: true,
        xfbml: true,
        version: configs.fbAppVer
      })
      resolve(window.FB)
    }
    script.onerror = () => reject('Failed to load Facebook SDK')

    document.body.appendChild(script)
  })
}

export default function FacebookSdk({ refetch, btnText }: Props) {
  useEffect(() => {
    const initializeFacebookSDK = async () => {
      try {
        await loadFacebookSDK()
        console.log('Facebook SDK loaded and initialized.')
      } catch (error) {
        console.error(error)
      }
    }

    initializeFacebookSDK()
  }, [])

  const getPages = () => {
    return new Promise<any>((resolve, reject) => {
      window.FB.api('/me/accounts', (response: any) => {
        if (response && !response.error) {
          resolve(response)
        } else {
          reject(response.error)
        }
      })
    })
  }

  const handleLogin = () => {
    if (window.FB) {
      window.FB.login(
        (response: any) => {
          console.log('res: ', response)
          if (response.authResponse) {
            getPages()
              .then(async (response) => {
                const pageData = response.data
                console.log('pageData: ', pageData)

                console.log('Good to see you, ' + response.name + '.')
              })
              .catch((error) => {
                console.error(error)
              })
          } else {
            console.log('User cancelled login or did not fully authorize.')
          }
        },
        {
          scope: 'public_profile,email,pages_manage_metadata,pages_messaging,pages_read_engagement,pages_manage_posts'
        }
      )
    } else {
      console.error('Facebook SDK not initialized yet.')
    }
  }
  return <Button onClick={handleLogin}>{btnText}</Button>
}
