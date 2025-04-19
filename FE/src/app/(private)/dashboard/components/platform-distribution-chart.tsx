'use client'

import { Pie, PieChart } from 'recharts'

import { Statistical } from '@/types/utils'
import { cn } from '@/lib/utils'
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
  },
  reddit: {
    label: 'Reddit',
    color: 'hsl(var(--chart-5))'
  }
} satisfies ChartConfig

export function PlatformDistributionChart({ data }: { data: Statistical['postsByPlatform'] }) {
  const chartData = Object.entries(data).map(([platform, count]) => ({
    name: platform,
    value: count,
    fill: chartConfig[platform as keyof typeof chartConfig].color
  }))

  return (
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
  )
}
