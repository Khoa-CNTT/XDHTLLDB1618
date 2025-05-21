/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable react-hooks/exhaustive-deps */
'use client'

import { useEffect, useState } from 'react'
import { CHARACTER_LIMITS, PostType } from '@/constants/post'
import { useAppContext } from '@/contexts/app-context'
import { useUploadImagesMutation } from '@/queries/media'
import { useCreatePostMutation, useUpdatePostMutation } from '@/queries/post'
import { useCreateRecurring, useUpdateRecurringInstanceMutation, useUpdateRecurringMutation } from '@/queries/recurring'
import { PostSchema } from '@/schema-validations/post'
import moment from 'moment'
import { useTranslations } from 'next-intl'

import { Credential } from '@/types/credentials'
import { ImagePreview } from '@/types/media'
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
  const t = useTranslations('createPostModal')
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
  const updatePostMutation = useUpdatePostMutation(post?.id || '')
  const updateRecurringMutation = useUpdateRecurringMutation(post?.recurringPostId || '')
  const updateRecurringInstanceMutation = useUpdateRecurringInstanceMutation(post?.recurringPostId || '')

  const isLoading =
    createPostMutation.isPending ||
    uploadImagesMutation.isPending ||
    createRecurringMutation.isPending ||
    updatePostMutation.isPending ||
    updateRecurringMutation.isPending ||
    updateRecurringInstanceMutation.isPending

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
      // Set default updateType to 'single' for recurring posts
      if (post.recurringPostId) {
        form.setValue('updateType', 'single')
      }
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

  // Watch for updateType changes to handle recurring config
  useEffect(() => {
    const subscription = form.watch((value, { name }) => {
      if (name === 'updateType' && post?.recurringPost) {
        if (value.updateType === 'all') {
          // When switching to "Update All Recurring", populate the recurring config
          form.setValue('isRecurring', true)
          form.setValue('recurringType', post.recurringPost.frequency)
          form.setValue('recurringDateRange', {
            from: post.recurringPost.startDate ? new Date(post.recurringPost.startDate) : undefined,
            to: post.recurringPost.endDate ? new Date(post.recurringPost.endDate) : undefined
          })
          const dayNumberToName = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday']
          form.setValue(
            'recurringDays',
            (post.recurringPost.daysOfWeek || []).map((num: number) => dayNumberToName[num])
          )
        } else if (value.updateType === 'single') {
          // When switching back to "Update Single Post", unset recurring config
          form.setValue('isRecurring', false)
          form.setValue('recurringType', 'daily')
          form.setValue('recurringDateRange', undefined)
          form.setValue('recurringDays', [])
        }
      }
    })
    return () => subscription.unsubscribe()
  }, [form, post])

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
    if (isLoading) return
    if (form.getValues('selectedPages')?.length === 0) {
      toast({
        title: 'Error',
        description: t('selectAtLeastOnePage'),
        variant: 'destructive'
      })
      return
    }

    const selectedPlatforms = credentials
      .filter((credential) => data?.selectedPages?.includes(credential.id))
      .map((credential) => credential.platform)

    const overLimit = selectedPlatforms.some((platform) => {
      const limit = CHARACTER_LIMITS[platform]
      return limit && data.description && data.description.length > limit
    })

    if (overLimit) {
      toast({
        title: 'Error',
        description: t('overLimit'),
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
        description: t('instagramNote'),
        variant: 'destructive'
      })
      return
    }

    if (moment(data.scheduledTime, 'HH:mm').isBefore(moment()) && moment(data.scheduledDate).isSame(moment(), 'day')) {
      form.setError('scheduledTime', {
        message: t('pastSchedule')
      })
      return
    }

    try {
      // Handle images
      let uploadImagesResponse: any = null
      const newImages = data.images?.filter((img) => img.preview.startsWith('blob:')) || []
      const existingImages = data.images?.filter((img) => !img.preview.startsWith('blob:')) || []

      if (newImages.length > 0) {
        const files = newImages.map((image) => image.file)
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
            assets: [
              ...existingImages.map((img) => ({
                type: 'image',
                url: img.preview
              })),
              ...(uploadImagesResponse?.data?.data?.map((image: any) => ({
                type: image.type,
                url: image.url
              })) || [])
            ]
          }
        }))

      if (data.isRecurring && !post) {
        await handleCreateRecurringPost(data, socialPosts)
      } else if (post) {
        await handleUpdatePost(data, socialPosts)
      } else {
        await handleCreatePost(data, socialPosts)
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

  const handleCreatePost = async (data: PostSchema, socialPosts: any[]) => {
    const scheduledDate = moment(data.scheduledDate).format('YYYY-MM-DD')
    const body = {
      publicationTime: moment(`${scheduledDate} ${data.scheduledTime}`).utc().format('YYYY-MM-DDTHH:mm:ss[Z]'),
      socialPosts
    }
    await createPostMutation.mutateAsync(body)
    toast({
      title: 'Success',
      description: t('postScheduled')
    })
  }

  const handleCreateRecurringPost = async (data: PostSchema, socialPosts: any[]) => {
    // Check if date range is chosen
    if (!data.recurringDateRange?.from || !data.recurringDateRange?.to) {
      toast({
        title: 'Error',
        description: t('selectDateRange'),
        variant: 'destructive'
      })
      return
    }

    if (
      data.recurringDateRange?.from &&
      moment(data.recurringDateRange?.from).isSame(moment(), 'day') &&
      moment(data.scheduledTime, 'HH:mm').isBefore(moment())
    ) {
      toast({
        title: 'Error',
        description: t('pastSchedule'),
        variant: 'destructive'
      })
      return
    }

    // Check if weekly is selected and at least one day is chosen
    if (data.recurringType === 'weekly' && data.recurringDays.length === 0) {
      toast({
        title: 'Error',
        description: t('selectAtLeastOneDay'),
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

    const body = {
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
      description: t('recurringScheduleCreated')
    })
  }

  const handleUpdatePost = async (data: PostSchema, socialPosts: any[]) => {
    if (post?.status === 'published') return

    const scheduledDate = moment(data.scheduledDate).format('YYYY-MM-DD')
    const body: any = {
      publicationTime: moment(`${scheduledDate} ${data.scheduledTime}`).utc().format('YYYY-MM-DDTHH:mm:ss[Z]'),
      metadata: {
        ...socialPosts[0].metadata
      }
    }

    // Case 1: Update normal post
    if (!post?.recurringPostId) {
      await updatePostMutation.mutateAsync(body)
      toast({
        title: 'Success',
        description: t('postUpdated')
      })
      return
    }

    // Case 2 & 3: Update recurring post
    if (data.updateType === 'all') {
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

      const bodyRecurring = {
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
          startDate: moment(data.recurringDateRange?.from)
            .set({
              hour: parseInt(data.scheduledTime.split(':')[0]),
              minute: parseInt(data.scheduledTime.split(':')[1])
            })
            .utc()
            .format('YYYY-MM-DDTHH:mm:ss[Z]'),
          endDate: moment(data.recurringDateRange?.to)
            .set({
              hour: parseInt(data.scheduledTime.split(':')[0]),
              minute: parseInt(data.scheduledTime.split(':')[1])
            })
            .utc()
            .format('YYYY-MM-DDTHH:mm:ss[Z]')
        }
      }
      // Case 3: Update all recurring posts
      await updateRecurringMutation.mutateAsync({
        ...body,
        ...bodyRecurring
      })
      toast({
        title: 'Success',
        description: t('allRecurringPostsUpdated')
      })
    } else {
      // Case 2: Update single post in recurring series
      if (post.id && !post.id.startsWith('recurring')) {
        body.postId = post.id
      }
      await updateRecurringInstanceMutation.mutateAsync({
        ...body
      })
      toast({
        title: 'Success',
        description: t('postUpdated')
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
      <DialogContent className='max-w-[95vw] xl:max-w-screen-xl p-0 gap-0 max-h-[90vh] overflow-y-auto scrollbar-none lg:overflow-y-hidden lg:max-h-full'>
        <DialogHeader className='p-6 pb-0'>
          <DialogTitle>{t('title')}</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit, (errors) => {
              console.log(errors)
            })}
            className='flex flex-col lg:flex-row'
          >
            <CredentialsPanel form={form} credentials={credentials} onScheduleAll={handleScheduleAll} />
            <FormPanel
              form={form}
              onImageUpload={handleImageUpload}
              isEdit={!!post}
              isRecurringPost={!!post?.recurringPostId}
              updateType={form.watch('updateType')}
            />
            <PreviewPanel
              preview={preview}
              credentials={credentials}
              post={post}
              isSubmitting={isLoading}
              onRemoveImage={removeImage}
              onClose={() => setOpen(false)}
              onShowSlider={() => setShowImageSlider(true)}
              isEdit={!!post}
              isRecurringPost={!!post?.recurringPostId}
              form={form}
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
