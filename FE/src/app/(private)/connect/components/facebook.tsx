'use client'

/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect } from 'react'
import configs from '@/configs'
import { Platform } from '@/constants/credentials'
import { useCreateCredentialMutation } from '@/queries/credentials'

import { Button } from '@/components/ui/button'

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

export default function FacebookSdk({ btnText }: { btnText: string }) {
  const createCredentialMutation = useCreateCredentialMutation(Platform.FACEBOOK)
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
      window.FB.api('me/accounts?fields=id,name,picture,access_token,fan_count', (response: any) => {
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
          if (response.authResponse) {
            const authResponse = response.authResponse
            getPages()
              .then(async (response) => {
                const pageData = response.data
                if (pageData.length > 0) {
                  const body = pageData.map((item: any) => ({
                    platform: 'facebook',
                    socialOwnerId: authResponse.userID,
                    socialId: item.id,
                    credentials: {
                      page_id: item.id,
                      code: item.access_token
                    },
                    metadata: {
                      avatar_url: item.picture.data.url,
                      name: item.name,
                      fan_count: item.fan_count
                    }
                  }))
                  await createCredentialMutation.mutateAsync(body)
                }
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
          scope:
            'email,read_insights,pages_show_list,instagram_basic,instagram_manage_insights,pages_read_engagement,pages_manage_metadata,pages_read_user_content,pages_manage_posts,pages_manage_engagement,public_profile'
        }
      )
    } else {
      console.error('Facebook SDK not initialized yet.')
    }
  }
  return <Button onClick={handleLogin}>{btnText}</Button>
}
