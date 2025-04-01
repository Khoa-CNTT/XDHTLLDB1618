import { cookies } from 'next/headers'
import { NextRequest, NextResponse } from 'next/server'
import { TokenType } from '@/constants/token'

export async function POST(req: NextRequest) {
  const { token } = await req.json()
  const cookieStore = await cookies()
  cookieStore.set(TokenType.ACCESS_TOKEN, token, {
    httpOnly: true,
    secure: true,
    sameSite: 'lax'
  })
  return NextResponse.json({ token })
}
