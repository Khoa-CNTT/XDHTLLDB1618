import { Suspense } from 'react'

import ScheduleSkeleton from '@/components/skeleton/schedule-skeleton'

import ScheduleWrapper from './schedule-wrapper'

export default function SchedulePage() {
  return (
    <Suspense fallback={<ScheduleSkeleton />}>
      <ScheduleWrapper />
    </Suspense>
  )
}
