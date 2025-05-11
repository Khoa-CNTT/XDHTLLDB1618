/* eslint-disable @typescript-eslint/no-explicit-any */
import { cookies } from 'next/headers'
import { NextRequest, NextResponse } from 'next/server'
import statisticalApi from '@/apis/statistical.api'
import { format } from 'date-fns'

export async function GET(request: NextRequest) {
  try {
    const cookieStore = await cookies()
    const accessToken = cookieStore.get('accessToken')?.value ?? ''

    const statisticalData = await statisticalApi.getStatisticalServer(accessToken)

    // Format data for CSV
    const csvData = formatDataForCSV(statisticalData.data.data)

    // Create CSV content
    const csvContent = convertToCSV(csvData)

    // Create response with CSV file
    const response = new NextResponse(csvContent)
    response.headers.set('Content-Type', 'text/csv')
    response.headers.set(
      'Content-Disposition',
      `attachment; filename=statistical_data_${format(new Date(), 'yyyy-MM-dd')}.csv`
    )

    return response
  } catch (error) {
    return NextResponse.json({ error: 'Failed to export data' }, { status: 500 })
  }
}

function formatDataForCSV(data: any) {
  const result = []

  // Overall Metrics
  result.push(['Overall Metrics'])
  result.push(['Metric', 'Value'])
  result.push(['Total Posts', data.overallMetrics.totalPosts])
  result.push(['Total Engagements', data.overallMetrics.totalEngagements])
  result.push(['Scheduled Posts', data.overallMetrics.scheduledPosts])
  result.push(['Average Reach', data.overallMetrics.averageReach])
  result.push([])

  // Platform Distribution
  result.push(['Platform Distribution'])
  result.push(['Platform', 'Count', 'Percentage'])
  Object.entries(data.postsByPlatform).forEach(([platform, count]) => {
    const percentage = ((count as number) / data.overallMetrics.totalPosts) * 100
    result.push([platform, count, `${percentage.toFixed(2)}%`])
  })
  result.push([])

  // Recent Posts
  result.push(['Recent Posts'])
  result.push(['Platform', 'Content', 'Status', 'Publication Time'])
  data.recentPosts.forEach((post: any) => {
    result.push([
      post.platform,
      post.metadata.content,
      post.status,
      format(new Date(post.publicationTime), 'dd/MM/yyyy HH:mm')
    ])
  })

  return result
}

function convertToCSV(data: any[][]) {
  return data.map((row) => row.join(',')).join('\n')
}
