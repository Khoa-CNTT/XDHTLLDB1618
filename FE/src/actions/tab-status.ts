'use server'

import { cookies } from 'next/headers'

const TAB_STATUS_KEY = 'platform_tab_status'

export const setTabStatus = async (platform: string, status: string) => {
  const cookieStore = await cookies()
  const currentStatus = cookieStore.get(TAB_STATUS_KEY)?.value
  const tabStatus = currentStatus ? JSON.parse(currentStatus) : {}

  const newStatus = {
    ...tabStatus,
    [platform]: status
  }

  cookieStore.set(TAB_STATUS_KEY, JSON.stringify(newStatus))
}

export const getTabStatus = async () => {
  const cookieStore = await cookies()
  const status = cookieStore.get(TAB_STATUS_KEY)?.value
  return status ? JSON.parse(status) : {}
}
