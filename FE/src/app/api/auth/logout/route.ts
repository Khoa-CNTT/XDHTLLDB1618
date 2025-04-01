import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'
import { TokenType } from '@/constants/token'

export async function POST() {
  const cookieStore = await cookies()
  cookieStore.delete(TokenType.ACCESS_TOKEN)
  return NextResponse.json({
    message: 'Logout successfully'
  })
}
