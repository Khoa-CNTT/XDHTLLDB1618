/* eslint-disable react-hooks/exhaustive-deps */
'use client'

import { useEffect, useState } from 'react'
import Image from 'next/image'
import { PostType } from '@/constants/post'
import { useAppContext } from '@/contexts/app-context'
import { useCreatePostMutation } from '@/queries/post'
import { postSchema, PostSchema } from '@/schema-validations/post'
import { zodResolver } from '@hookform/resolvers/zod'
import { Calendar, Heart, Loader2, MessageCircle, Share2, Upload, X } from 'lucide-react'
import moment from 'moment'
import { useForm } from 'react-hook-form'
import { FaFacebook } from 'react-icons/fa'
import ShowMoreText from 'react-show-more-text'

import { Credential } from '@/types/credentials'
import { ImagePreview } from '@/types/media'
import { CreatePostRequest } from '@/types/post'
import { cn, handleErrorApi } from '@/lib/utils'
import { toast } from '@/hooks/use-toast'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import { Calendar as CalendarComponent } from '@/components/ui/calendar'
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card'
import { Checkbox } from '@/components/ui/checkbox'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import AppInput from '@/components/app-input'

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
  const [showImageSlider, setShowImageSlider] = useState<boolean>(false)
  const [preview, setPreview] = useState({
    description: '',
    time: moment(time.start).format('HH:mm'),
    images: [] as ImagePreview[]
  })

  const form = useForm<PostSchema>({
    defaultValues: {
      type: post?.metadata.type || PostType.POST,
      description: post?.metadata.content || '',
      scheduleAll: false,
      scheduledDate: post?.publicationTime ? new Date(post.publicationTime) : time.start,
      scheduledTime: post?.publicationTime
        ? moment(post.publicationTime).format('HH:mm')
        : moment(time.start).format('HH:mm'),
      images:
        post?.metadata.assets.map((asset) => ({
          file: new File([asset.url], asset.url),
          preview: asset.url
        })) || [],
      selectedPages: [] as string[] // need more data from backend
    },
    resolver: zodResolver(postSchema)
  })

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
    }
  }, [post])

  useEffect(() => {
    form.setValue('scheduledTime', moment(time.start).format('HH:mm'))
    form.setValue('scheduledDate', time.start)
  }, [time])

  // Update preview when form changes
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

  const createPostMutation = useCreatePostMutation()

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

  async function onSubmit(data: PostSchema) {
    if (createPostMutation.isPending) return
    if (form.getValues('selectedPages')?.length === 0) {
      toast({
        title: 'Error',
        description: 'Please select at least one page',
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

      const body: CreatePostRequest = {
        publicationTime: moment(`${scheduledDate} ${data.scheduledTime}`).utc().format('YYYY-MM-DDTHH:mm:ss[Z]'),
        socialPosts: credentials
          .filter((credential) => data?.selectedPages?.includes(credential.id))
          .map((credential) => ({
            platform: credential.platform,
            socialCredentialID: credential.id,
            metadata: {
              //TODO: Refactor
              type: credential.platform === 'facebook' ? data.type : 'carousel',
              content: data.description,
              assets:
                data.images?.map(() => ({
                  type: 'image',
                  url: 'https://plus.unsplash.com/premium_photo-1706559780094-648dbe2b2bd0?q=80&w=2670&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D'
                })) || []
            }
          }))
      }
      await createPostMutation.mutateAsync(body)
      setOpen(false)
      resetForm()
      toast({
        title: 'Success',
        description: 'Post scheduled successfully'
      })
    } catch (error) {
      handleErrorApi({
        error,
        setError: form.setError
      })
    }
  }

  const resetForm = () => {
    form.reset()
    setPreview({
      description: '',
      time: moment(time.start).format('HH:mm'),
      images: []
    })
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

  return (
    <Dialog
      open={open}
      onOpenChange={(open) => {
        if (!open) {
          resetForm()
        }
        setOpen(open)
      }}
    >
      <DialogContent className='max-w-[95vw] xl:max-w-screen-xl p-0 overflow-x-hidden gap-0'>
        <DialogHeader className='p-6 pb-0'>
          <DialogTitle>Schedule Post</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className='flex flex-col lg:flex-row'>
            <div className='lg:w-64 border-r'>
              <div className='p-6'>
                <FormField
                  control={form.control}
                  name='scheduleAll'
                  render={({ field }) => (
                    <FormItem className='flex flex-row items-start space-x-3 space-y-0 mb-4'>
                      <FormControl>
                        <Checkbox checked={field.value} onCheckedChange={handleScheduleAll} />
                      </FormControl>
                      <div className='space-y-1 leading-none'>
                        <FormLabel>Schedule all</FormLabel>
                      </div>
                    </FormItem>
                  )}
                />
                <div className='space-y-4'>
                  {credentials.map((credential) => (
                    <FormField
                      key={credential.id}
                      control={form.control}
                      name='selectedPages'
                      render={({ field }) => (
                        <FormItem className='flex items-center space-x-3 space-y-0'>
                          <FormControl>
                            <Checkbox
                              checked={field.value?.includes(credential.id)}
                              onCheckedChange={(checked) => {
                                const currentValue = field.value || []
                                const newValue = checked
                                  ? [...currentValue, credential.id]
                                  : currentValue.filter((id) => id !== credential.id)
                                field.onChange(newValue)
                                // Update scheduleAll if all pages are selected
                                form.setValue('scheduleAll', newValue.length === credentials.length)
                              }}
                            />
                          </FormControl>
                          <div className='flex items-center gap-2'>
                            <Avatar className='size-8'>
                              <AvatarImage
                                src={
                                  credential.metadata?.picture?.url ||
                                  credential.credential?.threads_profile_picture_url
                                }
                              />
                              <AvatarFallback>
                                <FaFacebook className='size-4' />
                              </AvatarFallback>
                            </Avatar>
                            <FormLabel className='font-normal cursor-pointer'>
                              {credential.credential?.page_name || credential.credential?.username}
                            </FormLabel>
                          </div>
                        </FormItem>
                      )}
                    />
                  ))}
                </div>
              </div>
            </div>

            {/* Form Section */}
            <div className='flex-1 p-6'>
              <div className='space-y-6 flex flex-col justify-between h-full'>
                <FormField
                  control={form.control}
                  name='type'
                  render={({ field }) => (
                    <FormItem className='space-y-3'>
                      <FormLabel>
                        Type <span className='text-red-500'>*</span>
                      </FormLabel>
                      <FormControl>
                        <RadioGroup onValueChange={field.onChange} value={field.value} className='flex flex-wrap gap-4'>
                          {['post', 'story', 'reel'].map((type) => (
                            <FormItem key={type}>
                              <FormControl>
                                <RadioGroupItem value={type} className='peer sr-only' id={type} />
                              </FormControl>
                              <FormLabel
                                htmlFor={type}
                                className='flex items-center justify-center rounded-md border-2 border-muted bg-transparent px-6 py-2 hover:bg-muted peer-data-[state=checked]:border-primary peer-data-[state=checked]:bg-primary peer-data-[state=checked]:text-primary-foreground cursor-pointer'
                              >
                                {type.toUpperCase()}
                              </FormLabel>
                            </FormItem>
                          ))}
                        </RadioGroup>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name='description'
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>
                        Description <span className='text-red-500'>*</span>
                      </FormLabel>
                      <FormControl>
                        <AppInput field={field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name='images'
                  render={({}) => (
                    <FormItem>
                      <FormLabel>Media</FormLabel>
                      <FormControl>
                        <Card className='border-dashed'>
                          <CardContent className='p-6'>
                            <Input
                              type='file'
                              accept='image/*'
                              multiple
                              className='hidden'
                              onChange={handleImageUpload}
                              id='image-upload'
                            />
                            <label
                              htmlFor='image-upload'
                              className='cursor-pointer flex flex-col items-center justify-center py-6 bg-muted hover:bg-muted/80 rounded-md transition-colors'
                            >
                              <Upload className='size-8 mb-2' />
                              <p className='text-sm text-muted-foreground'>Upload Images</p>
                            </label>
                          </CardContent>
                        </Card>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className='grid gap-4 sm:grid-cols-2'>
                  <FormField
                    control={form.control}
                    name='scheduledDate'
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Scheduled Date</FormLabel>
                        <Popover>
                          <PopoverTrigger asChild>
                            <FormControl>
                              <Button
                                variant={'outline'}
                                className={cn(
                                  'pl-3 text-left font-normal flex w-full',
                                  !field.value && 'text-muted-foreground'
                                )}
                              >
                                {field.value ? moment(field.value).format('MM/DD/YYYY') : 'Pick a date'}
                                <Calendar className='ml-auto size-4 opacity-50' />
                              </Button>
                            </FormControl>
                          </PopoverTrigger>
                          <PopoverContent className='w-auto p-0' align='start'>
                            <CalendarComponent
                              mode='single'
                              selected={field.value}
                              onSelect={field.onChange}
                              initialFocus
                              disabled={(date) => moment(date).isBefore(moment(), 'day')}
                            />
                          </PopoverContent>
                        </Popover>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name='scheduledTime'
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Time</FormLabel>
                        <FormControl>
                          <Input type='time' {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <div className='flex justify-end gap-4'>
                  <Button variant='outline' onClick={() => setOpen(false)}>
                    Cancel
                  </Button>
                  <Button disabled={createPostMutation.isPending} type='submit'>
                    {createPostMutation.isPending ? 'Scheduling...' : 'Schedule Post'}
                    {createPostMutation.isPending && <Loader2 className='size-4 animate-spin' />}
                  </Button>
                </div>
              </div>
            </div>

            {/* Preview Section */}
            <div className='flex-1 border-l'>
              <div className='p-6 space-y-6 h-full flex flex-col justify-between'>
                <h3 className='font-semibold text-lg'>Preview</h3>

                <Card className='w-full mx-auto'>
                  <CardHeader className='pb-2'>
                    <div className='flex items-center gap-2'>
                      <Avatar className='size-8 bg-orange-500'>
                        <AvatarFallback>{credentials[0]?.credential?.page_name?.charAt(0) || 'A'}</AvatarFallback>
                      </Avatar>
                      <div className='flex flex-col'>
                        <span className='text-sm font-semibold'>{credentials[0]?.credential.page_name || 'Admin'}</span>
                        <span className='text-xs text-muted-foreground'>{preview.time}</span>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className='p-4'>
                    {/* Preview Text */}
                    <div className='space-y-2 mb-4 max-w-full'>
                      <ShowMoreText
                        lines={5}
                        more='Show more'
                        less='Show less'
                        className='text-sm text-justify lg:[&>span>span]:!max-w-[405px] [&>span>span]:overflow-x-hidden'
                        expanded={false}
                        truncatedEndingComponent={'... '}
                        anchorClass='max-w-full overflow-x-hidden cursor-pointer text-blue-600 font-semibold'
                      >
                        {preview.description || 'Your caption will appear here...'}
                      </ShowMoreText>
                    </div>
                    {/* Preview Image */}
                    <div
                      className={cn('aspect-square bg-muted rounded-md overflow-hidden relative max-h-[300px] w-full', {
                        'max-h-full': preview.images.length !== 2
                      })}
                    >
                      {preview.images.length > 0 ? (
                        <div
                          className={cn('grid gap-2 h-full', {
                            'grid-cols-1': preview.images.length === 1,
                            'grid-cols-2': preview.images.length === 2,
                            'grid-rows-[2fr_1fr] grid-cols-2': preview.images.length === 3,
                            'grid-cols-2 grid-rows-2': preview.images.length >= 4
                          })}
                        >
                          {preview.images.slice(0, 4).map((img, index) => (
                            <div
                              key={index}
                              className={cn('relative group', {
                                'col-span-2': index === 0 && preview.images.length === 3
                              })}
                            >
                              <Image
                                src={img.preview}
                                alt={`Preview ${index + 1}`}
                                className='size-full object-cover rounded-md'
                                fill
                              />
                              <Button
                                type='button'
                                onClick={() => removeImage(index)}
                                className='absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity size-8 z-20'
                              >
                                <X className='size-4' />
                              </Button>

                              {preview.images.length > 4 && index + 1 === 4 && (
                                <Button
                                  type='button'
                                  variant='outline'
                                  className='size-full absolute top-0 left-0 bg-transparent hover:bg-transparent z-10'
                                  onClick={() => setShowImageSlider(true)}
                                >
                                  <span className='text-white text-xl'>+{preview.images.length - 4}</span>
                                </Button>
                              )}
                            </div>
                          ))}
                        </div>
                      ) : (
                        <div className='size-full flex items-center justify-center text-muted-foreground'>
                          No image uploaded
                        </div>
                      )}
                    </div>
                  </CardContent>
                  <CardFooter className='flex justify-between p-4 border-t'>
                    <Button variant='ghost' size='sm'>
                      <Heart className='size-4 mr-2' />
                      Like
                    </Button>
                    <Button variant='ghost' size='sm'>
                      <MessageCircle className='size-4 mr-2' />
                      Comment
                    </Button>

                    <Button variant='ghost' size='sm'>
                      <Share2 className='size-4 mr-2' />
                      Share
                    </Button>
                  </CardFooter>
                </Card>
              </div>
            </div>
          </form>
        </Form>
      </DialogContent>
      <ImageSlider showImageSlider={showImageSlider} setShowImageSlider={setShowImageSlider} preview={preview} />
    </Dialog>
  )
}
