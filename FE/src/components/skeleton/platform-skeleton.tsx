import { Skeleton } from '@/components/ui/skeleton'

export default function PlatformSkeleton() {
  return (
    <Skeleton className='flex flex-col sm:flex-row sm:items-center justify-between gap-1 bg-background border p-4'>
      <div className='flex items-center gap-4'>
        <div className='size-12 border rounded-full' />
        <div className='space-y-2'>
          <h4 className='bg-muted w-32 rounded-md h-4'></h4>
          <p className='bg-muted w-16 rounded-md h-4'></p>
        </div>
      </div>
      <div className='flex items-center gap-2 ml-auto'>
        <div className='bg-muted size-8 rounded-md'></div>
        <div className='bg-muted size-8 rounded-md'></div>
      </div>
    </Skeleton>
  )
}
