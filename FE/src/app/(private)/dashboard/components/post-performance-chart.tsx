'use client'

import { CartesianGrid, Line, LineChart, XAxis, YAxis } from 'recharts'

import {
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig
} from '@/components/ui/chart'

// Sample data - in a real app, this would come from your API
const data = [
  { date: 'Mar 1', engagement: 4000, reach: 2400, clicks: 1200 },
  { date: 'Mar 5', engagement: 3000, reach: 1398, clicks: 900 },
  { date: 'Mar 10', engagement: 2000, reach: 9800, clicks: 2900 },
  { date: 'Mar 15', engagement: 2780, reach: 3908, clicks: 2000 },
  { date: 'Mar 20', engagement: 1890, reach: 4800, clicks: 2181 },
  { date: 'Mar 25', engagement: 2390, reach: 3800, clicks: 2500 },
  { date: 'Mar 30', engagement: 3490, reach: 4300, clicks: 2100 }
]

// Chart configuration
const chartConfig = {
  engagement: {
    label: 'Engagement',
    color: 'hsl(var(--chart-1))'
  },
  reach: {
    label: 'Reach',
    color: 'hsl(var(--chart-2))'
  },
  clicks: {
    label: 'Clicks',
    color: 'hsl(var(--chart-3))'
  }
} satisfies ChartConfig

export function PostPerformanceChart() {
  return (
    <ChartContainer config={chartConfig} className='w-full max-h-96'>
      <LineChart data={data} accessibilityLayer>
        <CartesianGrid vertical={false} />
        <XAxis dataKey='date' tickLine={false} tickMargin={10} axisLine={false} />
        <YAxis />
        <ChartTooltip cursor={false} content={<ChartTooltipContent />} />
        <ChartLegend
          content={<ChartLegendContent nameKey='dataKey' />}
          className='translate-y-4 flex-wrap gap-2 [&>*]:basis-1/4 [&>*]:justify-center'
        />
        <Line type='monotone' dataKey='engagement' stroke='var(--color-engagement)' activeDot={{ r: 8 }} />
        <Line type='monotone' dataKey='reach' stroke='var(--color-reach)' />
        <Line type='monotone' dataKey='clicks' stroke='var(--color-clicks)' />
      </LineChart>
    </ChartContainer>
  )
}
