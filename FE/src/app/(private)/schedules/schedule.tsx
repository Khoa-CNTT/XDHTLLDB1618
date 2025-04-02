'use client'

import { SetStateAction, useState } from 'react'
import { useAppContext } from '@/contexts/app-context'
import { useGetPosts } from '@/queries/post'
import { getCustomEventStyle } from '@/utils/calendar'
import moment from 'moment'
import { momentLocalizer, SlotInfo, Views } from 'react-big-calendar'

import { Credential } from '@/types/credentials'
import { Post } from '@/types/post'
import { toast } from '@/hooks/use-toast'
import ShadcnBigCalendar from '@/components/shadcn-big-calendar/shadcn-big-calendar'

import EventCard from '../../../components/calendar/event-card'
import CreatePostModal from './create-post-modal'

type Event = Post & {
  start: Date
  end: Date
  title: string
}

const localizer = momentLocalizer(moment)

export default function Schedule({ credentials }: { credentials: Credential[] }) {
  const [view, setView] = useState(Views.WEEK)
  const [time, setTime] = useState({
    start: new Date(),
    end: new Date()
  })
  const [date, setDate] = useState(new Date())

  const { data: posts } = useGetPosts()

  const events = posts?.data.data.map((post) => ({
    ...post,
    start: moment(post.publicationTime).toDate(),
    end: moment(post.publicationTime).toDate(),
    title: post.metadata.content
  }))

  const { openCreateScheduleModal, setOpenCreateScheduleModal, setPost } = useAppContext()

  const handleNavigate = (newDate: Date) => {
    setDate(newDate)
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const handleViewChange = (newView: SetStateAction<any>) => {
    setView(newView)
  }
  const handleSelectSlot = ({ start, end }: SlotInfo) => {
    if (moment(start).isBefore(moment(), 'minute')) {
      toast({
        title: 'Error',
        description: 'You cannot schedule posts in the past',
        variant: 'destructive'
      })
      return
    }
    setTime({
      start,
      end
    })
    setPost(undefined)
    setOpenCreateScheduleModal(true)
  }

  const handleSelectEvent = (event: Event) => {
    const { start, end, title, ...post } = event
    setPost({
      ...post
    })
    setOpenCreateScheduleModal(true)
  }

  return (
    <main className='p-8 pt-0'>
      <ShadcnBigCalendar
        dayPropGetter={(date: Date) => {
          if (moment(date).isBefore(moment(), 'minute')) {
            return { className: 'bg-muted/50 cursor-not-allowed' }
          }
          return {}
        }}
        eventPropGetter={(event: Event) => getCustomEventStyle(event.platform)}
        localizer={localizer}
        style={{ height: 'calc(100vh - 96px)', width: '100%' }}
        selectable
        date={date}
        onNavigate={handleNavigate}
        view={view}
        views={[Views.DAY, Views.WEEK, Views.MONTH]}
        onView={handleViewChange}
        onSelectSlot={handleSelectSlot}
        onSelectEvent={handleSelectEvent}
        events={events}
        components={{
          event: ({ event }) => <EventCard event={event} />
        }}
      />

      <CreatePostModal
        open={openCreateScheduleModal}
        setOpen={setOpenCreateScheduleModal}
        credentials={credentials}
        time={time}
      />
    </main>
  )
}
