import { Loader2 } from 'lucide-react'

export default function LoadingIndicator() {
  return (
    <div className='fixed inset-0 z-[100] flex items-center justify-center bg-background/70'>
      <Loader2 className='size-16 animate-spin' />
    </div>
  )
}
