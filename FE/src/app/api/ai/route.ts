import { NextRequest, NextResponse } from 'next/server'
import configs from '@/configs'
import { GoogleGenerativeAI } from '@google/generative-ai'

const genAI = new GoogleGenerativeAI(configs.geminiApiKey)

const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' })

export async function POST(req: NextRequest) {
  const { data } = await req.json()

  const result = await model.generateContent([data])

  return NextResponse.json(result.response.text())
}
