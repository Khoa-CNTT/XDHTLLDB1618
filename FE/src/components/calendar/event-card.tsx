/* eslint-disable @typescript-eslint/no-explicit-any */
import { PLATFORM_ICONS } from '@/constants'

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'

interface Props {
  event: any
}

export default function EventCard({ event }: Props) {
  const Icon = PLATFORM_ICONS[event.platform.toUpperCase() as keyof typeof PLATFORM_ICONS] || PLATFORM_ICONS.FACEBOOK
  return (
    <div className='flex justify-between items-center size-full'>
      <div className='px-1 text-white'>
        <span className='block mb-1 !line-clamp-1'>{event.socialCredential.metadata.name}</span>
        <Icon className='size-4' />
      </div>
      <Avatar className='size-8 border-2 border-primary/10'>
        <AvatarImage src={event.socialCredential.metadata.avatar_url || ''} />
        <AvatarFallback className='text-black'>{event.socialCredential.metadata.name.charAt(0) || 'A'}</AvatarFallback>
      </Avatar>
    </div>
  )
}
