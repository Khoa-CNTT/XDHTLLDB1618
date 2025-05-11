'use client'

import { useCallback, useRef } from 'react'
import { format } from 'date-fns'
import html2canvas from 'html2canvas-pro'
import { Download } from 'lucide-react'
import { CartesianGrid, Line, LineChart, XAxis, YAxis } from 'recharts'

import { Statistical } from '@/types/utils'
import { Button } from '@/components/ui/button'
import {
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig
} from '@/components/ui/chart'

// Chart configuration
const chartConfig = {
  published: {
    label: 'Published',
    color: 'hsl(var(--chart-1))'
  },
  scheduled: {
    label: 'Scheduled',
    color: 'hsl(var(--chart-2))'
  },
  recurring: {
    label: 'Recurring',
    color: 'hsl(var(--chart-3))'
  },
  failed: {
    label: 'Failed',
    color: 'hsl(var(--chart-4))'
  }
} satisfies ChartConfig

export function PostStatusChart({ data }: { data: Statistical['postByStatusResult'] }) {
  const chartData = Object.keys(data.published)
    .map((date) => ({
      name: date,
      published: data.published[date],
      scheduled: data.scheduled[date],
      recurring: data.recurring[date],
      failed: data.failed[date]
    }))
    .sort((a, b) => {
      return new Date(a.name).getTime() - new Date(b.name).getTime()
    })

  const chartRef = useRef<HTMLDivElement>(null)
  const handleExportChart = useCallback(async () => {
    if (chartRef.current) {
      // Get the chart's dimensions
      const chartRect = chartRef.current.getBoundingClientRect()

      // Get the actual background color
      const bgColor = window.getComputedStyle(document.body).backgroundColor

      // Calculate padding to center the chart
      const padding = 20
      const width = chartRect.width + padding * 2
      const height = chartRect.height + padding * 2

      const canvas = await html2canvas(chartRef.current, {
        backgroundColor: bgColor,
        scale: 1,
        width,
        height,
        x: -padding,
        y: -padding
      })
      const link = document.createElement('a')
      link.download = `post-status-${format(new Date(), 'yyyy-MM-dd')}.png`
      link.href = canvas.toDataURL()
      link.click()
    }
  }, [])

  return (
    <div className='relative'>
      <div className='absolute -top-16 right-0 z-10'>
        <Button variant='outline' size='icon' onClick={handleExportChart} title='Export as image'>
          <Download className='size-4' />
        </Button>
      </div>
      <div ref={chartRef}>
        <ChartContainer config={chartConfig} className='w-full max-h-96'>
          <LineChart data={chartData} accessibilityLayer>
            <CartesianGrid vertical={false} />
            <XAxis dataKey='name' tickLine={false} tickMargin={10} axisLine={false} />
            <YAxis />
            <ChartTooltip cursor={false} content={<ChartTooltipContent />} />
            <ChartLegend
              content={<ChartLegendContent nameKey='dataKey' />}
              className='translate-y-4 flex-wrap gap-2 [&>*]:basis-1/4 [&>*]:justify-center'
            />
            <Line type='monotone' dataKey='published' stroke='var(--color-published)' activeDot={{ r: 8 }} />
            <Line type='monotone' dataKey='scheduled' stroke='var(--color-scheduled)' />
            <Line type='monotone' dataKey='recurring' stroke='var(--color-recurring)' />
            <Line type='monotone' dataKey='failed' stroke='var(--color-failed)' />
          </LineChart>
        </ChartContainer>
      </div>
    </div>
  )
}
