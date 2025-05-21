'use client'

import { Fragment, useCallback, useRef } from 'react'
import { format } from 'date-fns'
import html2canvas from 'html2canvas-pro'
import { Download } from 'lucide-react'
import { Pie, PieChart } from 'recharts'

import { Statistical } from '@/types/utils'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { ChartContainer, ChartLegend, ChartTooltip, ChartTooltipContent, type ChartConfig } from '@/components/ui/chart'

// Chart configuration
const chartConfig = {
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
  }
  // reddit: {
  //   label: 'Reddit',
  //   color: 'hsl(var(--chart-5))'
  // }
} satisfies ChartConfig

export function PlatformDistributionChart({ data }: { data: Statistical['postsByPlatform'] }) {
  const hasZeroValues = Object.values(data).every((value) => value === 0)
  const chartData = Object.entries(data).map(([platform, count]) => {
    if (platform === 'reddit') {
      return null
    }
    return {
      name: platform,
      value: count,
      fill: chartConfig[platform as keyof typeof chartConfig].color
    }
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
      link.download = `platform-distribution-${format(new Date(), 'yyyy-MM-dd')}.png`
      link.href = canvas.toDataURL()
      link.click()
    }
  }, [])

  return (
    <div className='relative h-full'>
      <div className='absolute top-0 right-0 z-10'>
        <Button variant='outline' size='icon' onClick={handleExportChart} title='Export as image'>
          <Download className='size-4' />
        </Button>
      </div>
      {!hasZeroValues && (
        <div ref={chartRef}>
          <ChartContainer config={chartConfig}>
            <PieChart>
              <Pie data={chartData} dataKey='value' nameKey='name' label className='text-base' />
              <ChartTooltip content={<ChartTooltipContent />} />
              <ChartLegend
                height={36}
                content={({ payload }) => {
                  if (!payload || !payload.length) return null
                  return (
                    <div
                      className={cn(
                        'flex items-center justify-center pt-3 -translate-y-2 flex-wrap gap-2 [&>*]:basis-1/4 [&>*]:justify-center'
                      )}
                    >
                      {payload.map((entry, index) => (
                        <div key={`item-${index}`} className='flex items-center gap-1.5'>
                          <div className='size-2 shrink-0 rounded-[2px]' style={{ backgroundColor: entry.color }} />
                          <span>{entry.value}</span>
                        </div>
                      ))}
                    </div>
                  )
                }}
              />
            </PieChart>
          </ChartContainer>
        </div>
      )}
      {hasZeroValues && (
        <div className='flex items-center justify-center h-full'>
          <p className='text-sm text-muted-foreground'>No data available</p>
        </div>
      )}
    </div>
  )
}
