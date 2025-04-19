'use client'

import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from 'recharts'

import { Statistical } from '@/types/utils'
import { ChartConfig, ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart'

const chartConfig = {
  engagement: {
    label: 'Engagement',
    color: 'hsl(var(--chart-1))'
  }
} satisfies ChartConfig

export function BestPostingTimesChart({ data }: { data: Statistical['postsByTimeRange'] }) {
  const chartData = Object.entries(data).map(([key, value]) => ({
    time: key,
    engagement: value
  }))

  return (
    <ChartContainer config={chartConfig} className='w-full max-h-96'>
      <BarChart data={chartData} accessibilityLayer>
        <CartesianGrid vertical={false} />
        <XAxis dataKey='time' tickLine={false} tickMargin={10} axisLine={false} interval={0} className='text-xs' />
        <YAxis
          tickFormatter={(value) => `${value.toLocaleString()}`}
          className='text-xs'
          allowDecimals={false}
          domain={[0, 10]}
          ticks={[0, 2, 4, 6, 8, 10]}
        />
        <ChartTooltip cursor={false} content={<ChartTooltipContent />} />
        <Bar dataKey='engagement' fill='var(--color-engagement)' radius={8} />
      </BarChart>
    </ChartContainer>
  )
}
