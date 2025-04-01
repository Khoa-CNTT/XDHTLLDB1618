'use server'

import { redirect } from 'next/navigation'
import path from '@/constants/path'

export async function redirectLogout() {
  return redirect(path.logout)
}
