import { Skeleton } from '@/components/ui/skeleton'

export default function ScheduleSkeleton() {
  return (
    <Skeleton className='flex flex-col bg-background p-8 pt-0' style={{ height: 'calc(100vh - 96px)' }}>
      {/* Header */}
      <header className='flex justify-between flex-wrap items-center gap-2 p-4 border border-border rounded-t-lg'>
        <div className='flex space-x-4'>
          <div className='w-16 h-6 bg-muted rounded'></div>
          <div className='w-16 h-6 bg-muted rounded'></div>
          <div className='w-16 h-6 bg-muted rounded'></div>
        </div>
        <div className='w-40 h-6 bg-muted rounded'></div>
        <div className='flex space-x-2'>
          <div className='w-16 h-6 bg-muted rounded'></div>
          <div className='w-16 h-6 bg-muted rounded'></div>
          <div className='w-16 h-6 bg-muted rounded'></div>
          <div className='w-16 h-6 bg-muted rounded'></div>
        </div>
      </header>

      {/* Days Header */}
      <div className='flex border-y border-border'>
        <div className='w-20 shrink-0 border-x border-border'></div>
        {Array(7)
          .fill(0)
          .map((_, index) => (
            <div key={index} className='flex-1 border-r border-border'>
              <div className='w-full h-16 mx-auto rounded p-2 pb-0'>
                <div className='h-4 bg-muted w-full rounded'></div>
              </div>
            </div>
          ))}
      </div>

      {/* Calendar Grid */}
      <div className='flex flex-1 overflow-hidden'>
        {/* Time column */}
        <div className='w-20 shrink-0 border-x border-border'>
          {Array.from({ length: 24 }).map((_, index) => (
            <div key={index} className='h-10 border-b border-border flex items-center justify-center p-2'>
              <div className='h-4 bg-muted rounded w-full'></div>
            </div>
          ))}
        </div>

        {/* Days columns */}
        <div className='flex-1 flex'>
          {Array.from({ length: 7 }).map((_, dayIndex) => (
            <div key={dayIndex} className='flex-1 border-r border-border'>
              {/* Day header */}
              <div className='h-10 border-b border-border flex items-center justify-center'>
                <div className='w-16 h-4 bg-ac rounded'></div>
              </div>
              {/* Time slots */}
              {Array.from({ length: 24 }).map((_, timeIndex) => (
                <div key={timeIndex} className='h-10 border-b border-border'></div>
              ))}
            </div>
          ))}
        </div>
      </div>
    </Skeleton>
  )
}
