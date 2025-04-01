'use client'

import { useEffect } from 'react'
import Link from 'next/link'
import { useSearchParams } from 'next/navigation'
import configs from '@/configs'
import axios from 'axios'
import { getUnixTime } from 'date-fns'

import { Button } from '@/components/ui/button'

export default function RedditSdk() {
  const returnUri = `${configs.returnUrl}/connect-accounts`
  const URL = `https://www.reddit.com/api/v1/authorize?client_id=${
    configs.redditAppId
  }&response_type=code&state=${getUnixTime(new Date())}&redirect_uri=${returnUri}&duration=temporary&scope=read`

  const searchParams = useSearchParams()

  useEffect(() => {
    const code = searchParams.get('code')
    console.log({ code })
    console.log({ searchParams }, 'params')
    if (code) {
      getAccessToken(String(code))
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchParams])

  const getAccessToken = async (code: string) => {
    try {
      const authString = `${configs.redditAppId}:${configs.redditSecret}`
      const authHeader = `Basic ${btoa(authString)}`
      const body = new URLSearchParams({
        grant_type: 'authorization_code', // Sửa grant_type cho đúng
        code,
        redirect_uri: returnUri
      })

      const res = await axios.post('https://www.reddit.com/api/v1/access_token', body, {
        headers: {
          Authorization: authHeader,
          'Content-Type': 'application/x-www-form-urlencoded'
        }
      })

      console.log(res.data, 'Access Token')
    } catch (error) {
      console.error('Error fetching access token:', error)
    }
  }

  return (
    <Link href={URL} target='_blank'>
      <Button>Connect New Account</Button>
    </Link>
  )
}
