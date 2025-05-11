'use client'

import { SetStateAction, useState } from 'react'
import { useAppContext } from '@/contexts/app-context'
import { useGetPosts } from '@/queries/post'
import { getCustomEventStyle } from '@/utils/calendar'
import { useQueryClient } from '@tanstack/react-query'
import { AxiosResponse } from 'axios'
import moment from 'moment'
import { momentLocalizer, SlotInfo, Views } from 'react-big-calendar'

import { Credential } from '@/types/credentials'
import { Post } from '@/types/post'
import { SuccessResponse } from '@/types/utils'
import { toast } from '@/hooks/use-toast'
import ShadcnBigCalendar from '@/components/shadcn-big-calendar/shadcn-big-calendar'
import { SocketListener } from '@/components/socket-listener'

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
  const queryClient = useQueryClient()

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

  const handlePostProcessed = (data: {
    postId?: string
    status: string
    timestamp: string
    post?: Post
    virtualId?: string
  }) => {
    queryClient.setQueryData(['posts'], (oldData: AxiosResponse<SuccessResponse<Post[]>>) => {
      console.log(data)
      if (!oldData?.data?.data) return oldData
      const postIndex = oldData.data.data.findIndex(
        (post: Post) => post.id === data?.postId || post.id === data?.virtualId
      )

      const newData = [...oldData.data.data]
      newData[postIndex] = { ...newData[postIndex], status: data.status }

      return {
        ...oldData,
        data: {
          ...oldData.data,
          data: newData
        }
      }
    })
  }

  const handlePostFailed = (data: {
    postId: string
    status: string
    error: string
    timestamp: string
    post?: Post
    virtualId?: string
  }) => {
    queryClient.setQueryData(['posts'], (oldData: AxiosResponse<SuccessResponse<Post[]>>) => {
      if (!oldData?.data?.data) return oldData

      const postIndex = oldData.data.data.findIndex(
        (post: Post) => post.id === data?.postId || post.id === data?.virtualId
      )

      const newData = [...oldData.data.data]
      newData[postIndex] = { ...newData[postIndex], status: data.status }

      return {
        ...oldData,
        data: {
          ...oldData.data,
          data: newData
        }
      }
    })
  }

  return (
    <main className='p-8 pt-0'>
      <ShadcnBigCalendar
        dayPropGetter={(date: Date) => {
          if (moment(date).isBefore(moment(), 'minute')) {
            return { className: 'bg-muted/30 cursor-not-allowed' }
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
        dayLayoutAlgorithm='no-overlap'
        popup
        messages={{
          showMore: (count, remainingEvents, events) => {
            return `+${count} more`
          }
        }}
      />

      <CreatePostModal
        open={openCreateScheduleModal}
        setOpen={setOpenCreateScheduleModal}
        credentials={credentials}
        time={time}
      />

      <SocketListener onPostProcessed={handlePostProcessed} onPostFailed={handlePostFailed} />
    </main>
  )
}
