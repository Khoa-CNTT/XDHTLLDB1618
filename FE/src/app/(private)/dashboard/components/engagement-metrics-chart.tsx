'use client'

import { useCallback, useRef } from 'react'
import { Platform } from '@/constants/credentials'
import { format } from 'date-fns'
import html2canvas from 'html2canvas-pro'
import { Download } from 'lucide-react'
import { Bar, BarChart, XAxis, YAxis } from 'recharts'

import { Button } from '@/components/ui/button'
import { ChartConfig, ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart'

const chartConfig = {
  value: {
    label: 'value',
    color: 'hsl(var(--chart-1))'
  },
  facebook: {
    label: 'Facebook',
    color: 'hsl(var(--chart-1))'
  },
  instagram: {
    label: 'Instagram',
    color: 'hsl(var(--chart-2))'
  },
  x: {
    label: 'X',
    color: 'hsl(var(--chart-3))'
  },
  threads: {
    label: 'Threads',
    color: 'hsl(var(--chart-4))'
  },
  reddit: {
    label: 'Reddit',
    color: 'hsl(var(--chart-5))'
  }
} satisfies ChartConfig

export function EngagementMetricsChart({ platform, data }: { platform: Platform; data: { [key: string]: number } }) {
  const chartData = Object.entries(data).map(([key, value]) => ({
    name: key,
    value: value
  }))

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
      link.download = `engagement-metrics-${platform}-${format(new Date(), 'yyyy-MM-dd')}.png`
      link.href = canvas.toDataURL()
      link.click()
    }
  }, [platform])

  return (
    <div className='relative'>
      <div className='absolute -top-28 right-0 z-10'>
        <Button variant='outline' size='icon' onClick={handleExportChart} title='Export as image'>
          <Download className='size-4' />
        </Button>
      </div>
      <div ref={chartRef}>
        <ChartContainer config={chartConfig}>
          <BarChart
            accessibilityLayer
            data={chartData}
            layout='vertical'
            margin={{
              left: 20
            }}
          >
            <XAxis type='number' dataKey='value' />
            <YAxis dataKey='name' type='category' tickLine={false} tickMargin={10} axisLine={false} />
            <ChartTooltip cursor={false} content={<ChartTooltipContent />} />
            <Bar dataKey='value' fill={chartConfig[platform as keyof typeof chartConfig].color} radius={5} />
          </BarChart>
        </ChartContainer>
      </div>
    </div>
  )
}
