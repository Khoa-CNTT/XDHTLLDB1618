/* eslint-disable react-hooks/exhaustive-deps */
'use client'

import { useEffect, useState } from 'react'
import { PostType } from '@/constants/post'
import { useAppContext } from '@/contexts/app-context'
import { useUploadImagesMutation } from '@/queries/media'
import { useCreatePostMutation } from '@/queries/post'
import { useCreateRecurring } from '@/queries/recurring'
import { PostSchema } from '@/schema-validations/post'
import moment from 'moment'

import { Credential } from '@/types/credentials'
import { ImagePreview } from '@/types/media'
import { CreatePostRequest, CreateRecurringRequest } from '@/types/post'
import { handleErrorApi } from '@/lib/utils'
import { usePostForm } from '@/hooks/use-post-form'
import { toast } from '@/hooks/use-toast'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Form } from '@/components/ui/form'

import { CredentialsPanel } from './components/credentials-panel'
import { FormPanel } from './components/form-panel'
import { PreviewPanel } from './components/preview-panel'
import ImageSlider from './image-slider'

export interface CreatePostModalProps {
  open: boolean
  setOpen: (open: boolean) => void
  credentials: Credential[]
  time: {
    start: Date
    end: Date
  }
}

export default function CreatePostModal({ open, setOpen, credentials, time }: CreatePostModalProps) {
  const { post } = useAppContext()
  const [showImageSlider, setShowImageSlider] = useState(false)
  const form = usePostForm(post, time)
  const [preview, setPreview] = useState({
    description: '',
    time: moment(time.start).format('HH:mm'),
    images: [] as ImagePreview[]
  })

  const createPostMutation = useCreatePostMutation()
  const createRecurringMutation = useCreateRecurring()
  const uploadImagesMutation = useUploadImagesMutation()

  // Effect handlers
  useEffect(() => {
    if (post) {
      form.setValue('scheduledDate', new Date(post.publicationTime))
      form.setValue('scheduledTime', moment(post?.publicationTime).format('HH:mm'))
      form.setValue('description', post?.metadata.content || '')
      form.setValue(
        'images',
        post?.metadata.assets.map((asset) => ({
          file: new File([asset.url], asset.url),
          preview: asset.url
        })) || []
      )
      form.setValue('type', post?.metadata.type || PostType.POST)
      form.setValue('selectedPages', [post.socialCredentialID])
    }
  }, [post])

  useEffect(() => {
    form.setValue('scheduledTime', moment(time.start).format('HH:mm'))
    form.setValue('scheduledDate', time.start)
  }, [time])

  useEffect(() => {
    const subscription = form.watch((value, { name }) => {
      if (name === 'images' && value.images) {
        const newPreviews = value.images.map((image) => ({
          file: image?.file,
          preview: image?.preview
        }))
        setPreview((prev) => ({ ...prev, images: newPreviews.filter(Boolean) as ImagePreview[] }))
      } else {
        setPreview((prev) => ({
          ...prev,
          description: value.description || '',
          time: value.scheduledTime || moment().format('HH:mm')
        }))
      }
    })
    return () => subscription.unsubscribe()
  }, [form])

  const handleScheduleAll = (checked: boolean) => {
    form.setValue('scheduleAll', checked)
    if (checked) {
      form.setValue(
        'selectedPages',
        credentials.map((credential) => credential.id)
      )
    } else {
      form.setValue('selectedPages', [])
    }
  }

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || [])
    const currentImages = form.getValues('images') || []
    const newImages = [...currentImages, ...files.map((file) => ({ file, preview: URL.createObjectURL(file) }))]
    form.setValue('images', newImages)
  }

  const removeImage = (index: number) => {
    const currentImages = form.getValues('images')
    currentImages?.splice(index, 1)
    form.setValue('images', currentImages || [])
  }

  const onSubmit = async (data: PostSchema) => {
    if (createPostMutation.isPending || uploadImagesMutation.isPending || createRecurringMutation.isPending) return
    if (form.getValues('selectedPages')?.length === 0) {
      toast({
        title: 'Error',
        description: 'Please select at least one page',
        variant: 'destructive'
      })
      return
    }

    // Check if Instagram is selected and no media is uploaded
    const selectedCredentials = credentials.filter((credential) => data?.selectedPages?.includes(credential.id))
    const hasInstagram = selectedCredentials.some((credential) => credential.platform === 'instagram')
    if (hasInstagram && (!data.images || data.images.length === 0)) {
      toast({
        title: 'Error',
        description: 'Instagram posts require at least one image',
        variant: 'destructive'
      })
      return
    }

    if (moment(data.scheduledTime, 'HH:mm').isBefore(moment()) && moment(data.scheduledDate).isSame(moment(), 'day')) {
      form.setError('scheduledTime', {
        message: 'You cannot schedule posts in the past'
      })
      return
    }

    try {
      const scheduledDate = moment(data.scheduledDate).format('YYYY-MM-DD')
      const files = data.images?.map((image) => image.file) || []
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      let uploadImagesResponse: any
      if (files.length > 0) {
        uploadImagesResponse = await uploadImagesMutation.mutateAsync(files as File[])
      }

      const socialPosts = credentials
        .filter((credential) => data?.selectedPages?.includes(credential.id))
        .map((credential) => ({
          platform: credential.platform,
          socialCredentialID: credential.id,
          metadata: {
            type: credential.platform === 'facebook' ? data.type : 'post',
            content: data.description,
            assets:
              // eslint-disable-next-line @typescript-eslint/no-explicit-any
              uploadImagesResponse?.data?.data?.map((image: any) => ({
                type: image.type,
                url: image.url
              })) || []
          }
        }))

      // If there is recurring, call the recurring API, otherwise call the post API
      if (data.isRecurring) {
        // Check if date range is chosen
        if (!data.recurringDateRange?.from || !data.recurringDateRange?.to) {
          toast({
            title: 'Error',
            description: 'Please select a date range for the recurring schedule',
            variant: 'destructive'
          })
          return
        }

        // Check if weekly is selected and at least one day is chosen
        if (data.recurringType === 'weekly' && data.recurringDays.length === 0) {
          toast({
            title: 'Error',
            description: 'Please select at least one day in the week',
            variant: 'destructive'
          })
          return
        }

        // Convert day name to number (0-6, 0 is Sunday)
        const dayMapping: Record<string, number> = {
          sunday: 0,
          monday: 1,
          tuesday: 2,
          wednesday: 3,
          thursday: 4,
          friday: 5,
          saturday: 6
        }

        const daysOfWeek =
          data.recurringType === 'weekly'
            ? data.recurringDays.map((day) => dayMapping[day]).sort((a, b) => a - b)
            : undefined

        const body: CreateRecurringRequest = {
          socialPosts,
          publicationTime: moment()
            .set({
              hour: parseInt(data.scheduledTime.split(':')[0]),
              minute: parseInt(data.scheduledTime.split(':')[1])
            })
            .utc()
            .format('HH:mm'),
          recurring: {
            frequency: data.recurringType as 'daily' | 'weekly',
            daysOfWeek,
            startDate: moment(data.recurringDateRange.from)
              .set({
                hour: parseInt(data.scheduledTime.split(':')[0]),
                minute: parseInt(data.scheduledTime.split(':')[1])
              })
              .utc()
              .format('YYYY-MM-DDTHH:mm:ss[Z]'),
            endDate: moment(data.recurringDateRange.to)
              .set({
                hour: parseInt(data.scheduledTime.split(':')[0]),
                minute: parseInt(data.scheduledTime.split(':')[1])
              })
              .utc()
              .format('YYYY-MM-DDTHH:mm:ss[Z]')
          }
        }

        await createRecurringMutation.mutateAsync(body)
        toast({
          title: 'Success',
          description: 'Recurring schedule has been created successfully'
        })
      } else {
        const body: CreatePostRequest = {
          publicationTime: moment(`${scheduledDate} ${data.scheduledTime}`).utc().format('YYYY-MM-DDTHH:mm:ss[Z]'),
          socialPosts
        }

        await createPostMutation.mutateAsync(body)
        toast({
          title: 'Success',
          description: 'Post has been scheduled successfully'
        })
      }

      setOpen(false)
      form.reset()
      setPreview({
        description: '',
        time: moment(time.start).format('HH:mm'),
        images: []
      })
    } catch (error) {
      handleErrorApi({
        error,
        setError: form.setError
      })
    }
  }

  return (
    <Dialog
      open={open}
      onOpenChange={(open) => {
        if (!open) {
          form.reset()
          setPreview({
            description: '',
            time: moment(time.start).format('HH:mm'),
            images: []
          })
          form.setValue('isRecurring', false)
        }
        setOpen(open)
      }}
    >
      <DialogContent className='max-w-[95vw] xl:max-w-screen-xl p-0 gap-0'>
        <DialogHeader className='p-6 pb-0'>
          <DialogTitle>Schedule Post</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className='flex flex-col lg:flex-row'>
            <CredentialsPanel form={form} credentials={credentials} onScheduleAll={handleScheduleAll} />
            <FormPanel form={form} onImageUpload={handleImageUpload} />
            <PreviewPanel
              preview={preview}
              credentials={credentials}
              post={post}
              isSubmitting={
                createPostMutation.isPending || uploadImagesMutation.isPending || createRecurringMutation.isPending
              }
              onRemoveImage={removeImage}
              onClose={() => setOpen(false)}
              onShowSlider={() => setShowImageSlider(true)}
            />
          </form>
        </Form>
      </DialogContent>
      <ImageSlider
        showImageSlider={showImageSlider}
        setShowImageSlider={setShowImageSlider}
        preview={{ images: preview.images.map((img) => ({ preview: img.preview })) }}
      />
    </Dialog>
  )
}
