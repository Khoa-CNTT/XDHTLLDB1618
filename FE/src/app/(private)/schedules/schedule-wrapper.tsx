import { cookies } from 'next/headers'
import credentialApi from '@/apis/credentials.api'
import { TokenType } from '@/constants/token'

import { Credential } from '@/types/credentials'
import Schedule from '@/app/(private)/schedules/schedule'

export default async function ScheduleWrapper() {
  const cookiesStore = await cookies()
  const accessToken = cookiesStore.get(TokenType.ACCESS_TOKEN)?.value ?? ''
  let credentials: Credential[] = []

  // don't use try catch here, it made redirect function not work
  if (accessToken) {
    credentials = (await credentialApi.getCredential(accessToken)).data.data ?? []
  }

  return <Schedule credentials={credentials} />
}
