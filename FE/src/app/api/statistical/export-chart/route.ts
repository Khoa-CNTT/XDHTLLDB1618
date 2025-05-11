import { cookies } from 'next/headers'
import { NextRequest, NextResponse } from 'next/server'
import statisticalApi from '@/apis/statistical.api'
import { format } from 'date-fns'
import html2canvas from 'html2canvas'

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const chartId = searchParams.get('chartId')

    if (!chartId) {
      return NextResponse.json({ error: 'Chart ID is required' }, { status: 400 })
    }

    const cookieStore = await cookies()
    const accessToken = cookieStore.get('accessToken')?.value ?? ''

    const statisticalData = await statisticalApi.getStatisticalServer(accessToken)
    const data = statisticalData.data.data

    // Get chart element from DOM
    const chartElement = document.getElementById(chartId)
    if (!chartElement) {
      return NextResponse.json({ error: 'Chart not found' }, { status: 404 })
    }

    // Convert chart to image
    const canvas = await html2canvas(chartElement)
    const base64Data = canvas.toDataURL('image/png').split(',')[1]
    const imageBuffer = Buffer.from(base64Data, 'base64')

    // Create response with image file
    const response = new NextResponse(imageBuffer)
    response.headers.set('Content-Type', 'image/png')
    response.headers.set(
      'Content-Disposition',
      `attachment; filename=${chartId}_${format(new Date(), 'yyyy-MM-dd')}.png`
    )

    return response
  } catch (error) {
    console.error('Chart export error:', error)
    return NextResponse.json({ error: 'Failed to export chart' }, { status: 500 })
  }
}
