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
    const data = statisticalData.data.data

    // Dynamic import jsPDF and jspdf-autotable
    const { jsPDF } = await import('jspdf')
    const autoTable = (await import('jspdf-autotable')).default

    // Create PDF document
    const doc = new jsPDF()

    // Title
    doc.setFontSize(20)
    doc.text('Statistical Report', doc.internal.pageSize.width / 2, 20, { align: 'center' })

    // Generated date
    doc.setFontSize(10)
    doc.text(`Generated on ${format(new Date(), 'dd/MM/yyyy HH:mm')}`, doc.internal.pageSize.width / 2, 30, {
      align: 'center'
    })

    // Overall Metrics
    doc.setFontSize(16)
    doc.text('Overall Metrics', 14, 45)
    autoTable(doc, {
      startY: 50,
      head: [['Metric', 'Value']],
      body: [
        ['Total Posts', data.overallMetrics.totalPosts.toString()],
        ['Total Engagements', data.overallMetrics.totalEngagements.toString()],
        ['Scheduled Posts', data.overallMetrics.scheduledPosts.toString()],
        ['Average Reach', data.overallMetrics.averageReach.toString()]
      ],
      theme: 'grid',
      headStyles: { fillColor: [26, 26, 26] },
      styles: { fontSize: 10 }
    })

    // Platform Distribution
    doc.setFontSize(16)
    const lastTableY = (doc as any).lastAutoTable.finalY
    doc.text('Platform Distribution', 14, lastTableY + 20)
    autoTable(doc, {
      startY: lastTableY + 25,
      head: [['Platform', 'Count', 'Percentage']],
      body: Object.entries(data.postsByPlatform).map(([platform, count]) => [
        platform,
        count.toString(),
        `${(((count as number) / data.overallMetrics.totalPosts) * 100).toFixed(2)}%`
      ]),
      theme: 'grid',
      headStyles: { fillColor: [26, 26, 26] },
      styles: { fontSize: 10 }
    })

    // Recent Posts
    doc.setFontSize(16)
    const lastTableY2 = (doc as any).lastAutoTable.finalY
    doc.text('Recent Posts', 14, lastTableY2 + 20)
    autoTable(doc, {
      startY: lastTableY2 + 25,
      head: [['Platform', 'Content', 'Status', 'Publication Time']],
      body: data.recentPosts.map((post: any) => [
        post.platform,
        post.metadata.content,
        post.status,
        format(new Date(post.publicationTime), 'dd/MM/yyyy HH:mm')
      ]),
      theme: 'grid',
      headStyles: { fillColor: [26, 26, 26] },
      styles: { fontSize: 10 },
      columnStyles: {
        1: { cellWidth: 'auto' }
      }
    })

    // Get PDF buffer
    const pdfBuffer = Buffer.from(doc.output('arraybuffer'))

    // Create response with PDF file
    const response = new NextResponse(pdfBuffer)
    response.headers.set('Content-Type', 'application/pdf')
    response.headers.set(
      'Content-Disposition',
      `attachment; filename=statistical_data_${format(new Date(), 'yyyy-MM-dd')}.pdf`
    )

    return response
  } catch (error) {
    console.error('PDF export error:', error)
    return NextResponse.json({ error: 'Failed to export PDF' }, { status: 500 })
  }
}
