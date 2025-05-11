/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useRef, useState } from 'react'
import { PLATFORM_ICONS } from '@/constants'
import { CalendarCheck, Check, Ellipsis, X } from 'lucide-react'
import { VscFolderActive } from 'react-icons/vsc'

import { cn } from '@/lib/utils'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip'

import { Badge } from '../ui/badge'

interface EventCardProps {
  event: any
}

export default function EventCard({ event }: EventCardProps) {
  const Icon = PLATFORM_ICONS[event.platform.toUpperCase() as keyof typeof PLATFORM_ICONS] || PLATFORM_ICONS.FACEBOOK
  const { socialCredential } = event
  const cardRef = useRef<HTMLDivElement>(null)
  const avatarRef = useRef<HTMLDivElement>(null)
  const [isCompact, setIsCompact] = useState(false)

  useEffect(() => {
    const handleResize = () => {
      if (cardRef.current) {
        const width = cardRef.current.offsetWidth
        if (width < 140) {
          avatarRef.current?.classList.add('hidden')
          if (width < 100) {
            setIsCompact(true)
          } else {
            setIsCompact(false)
          }
        } else {
          avatarRef.current?.classList.remove('hidden')
        }
      }
    }

    window.addEventListener('resize', handleResize)

    handleResize()

    // Cleanup function
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  return (
    <div ref={cardRef} className='relative size-full text-primary-foreground h-[50px]'>
      {/* Main Content */}
      <div
        className={cn('flex justify-between items-center lg:p-2 h-full lg:border-l-2', {
          'border-destructive': event.status === 'failed',
          'border-success': event.status === 'published',
          'border-info': event.status === 'scheduled' || event.status === 'pending',
          'border-accent': event.status === 'active'
        })}
      >
        <div className='flex flex-col justify-between flex-1 min-w-0'>
          {/* Account Name & Platform Icon */}
          <div className='flex items-center gap-1 mb-1'>
            <Icon className='size-4 shrink-0' />
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <span className='text-sm font-medium truncate'>{socialCredential?.metadata.name}</span>
                </TooltipTrigger>
                <TooltipContent>
                  <p>{socialCredential?.metadata.name}</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>

          {/* Status */}
          {isCompact && (
            <div
              className={cn('flex items-center justify-center gap-2 size-5 text-primary-foreground rounded-full', {
                'bg-destructive': event.status === 'failed',
                'bg-success': event.status === 'published',
                'bg-info': event.status === 'scheduled' || event.status === 'pending',
                'bg-gray-600': event.status === 'active'
              })}
            >
              {event.status === 'scheduled' && <CalendarCheck className='size-3' />}
              {event.status === 'pending' && <Ellipsis className='size-3' />}
              {event.status === 'published' && <Check className='size-3' />}
              {event.status === 'failed' && <X className='size-3' />}
              {event.status === 'active' && <VscFolderActive className='size-3' />}
            </div>
          )}
          {!isCompact && (
            <div className='flex items-center gap-2'>
              <Badge
                variant={
                  event.status === 'scheduled' || event.status === 'pending'
                    ? 'info'
                    : event.status === 'published'
                      ? 'success'
                      : event.status === 'active'
                        ? 'active'
                        : 'destructive'
                }
              >
                {event.status}
              </Badge>
            </div>
          )}
        </div>

        {/* Avatar */}
        <Avatar
          ref={avatarRef}
          className={cn('size-8 border-2', {
            'border-info': event.status === 'scheduled' || event.status === 'pending',
            'border-success': event.status === 'published',
            'border-destructive': event.status === 'failed'
          })}
        >
          <AvatarImage src={socialCredential?.metadata.avatar_url || ''} alt={socialCredential?.metadata.name} />
          <AvatarFallback>{socialCredential?.metadata.name.charAt(0) || 'A'}</AvatarFallback>
        </Avatar>
      </div>
    </div>
  )
}
