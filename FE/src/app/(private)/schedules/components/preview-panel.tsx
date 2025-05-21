import Image from 'next/image'
import { PostSchema } from '@/schema-validations/post'
import { Heart, Loader2, MessageCircle, Share2, X } from 'lucide-react'
import { useTranslations } from 'next-intl'
import { UseFormReturn } from 'react-hook-form'
import ShowMoreText from 'react-show-more-text'

import { Credential } from '@/types/credentials'
import { ImagePreview } from '@/types/media'
import { Post } from '@/types/post'
import { cn } from '@/lib/utils'
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'

interface PreviewPanelProps {
  preview: {
    description: string
    time: string
    images: ImagePreview[]
  }
  credentials: Credential[]
  post: Post | undefined
  isSubmitting: boolean
  onRemoveImage: (index: number) => void
  onClose: () => void
  onShowSlider: () => void
  isEdit?: boolean
  isRecurringPost?: boolean
  form: UseFormReturn<PostSchema>
}

export const PreviewPanel = ({
  preview,
  credentials,
  post,
  isSubmitting,
  onRemoveImage,
  onClose,
  onShowSlider,
  isEdit,
  isRecurringPost,
  form
}: PreviewPanelProps) => {
  const t = useTranslations('createPostModal')
  return (
    <div className='flex-1 border-l'>
      <div className='px-2 md:px-6 py-6 flex flex-col justify-between h-full gap-4'>
        <h3 className='font-semibold text-lg'>{t('preview')}</h3>
        <div
          className={cn(' overflow-y-auto scrollbar-none', {
            'max-h-[calc(90vh-300px)]': isEdit && isRecurringPost,
            'max-h-[calc(90vh-200px)]': !(isEdit && isRecurringPost)
          })}
        >
          <Card className='w-full max-w-md mx-auto'>
            <CardHeader className='pb-0 px-4'>
              <div className='flex items-center gap-2'>
                <Avatar className='size-8 bg-orange-500'>
                  <AvatarImage src={credentials[0]?.metadata.avatar_url} />
                  <AvatarFallback>{credentials[0]?.metadata?.name?.charAt(0) || 'A'}</AvatarFallback>
                </Avatar>
                <div className='flex flex-col'>
                  <span className='text-sm font-semibold'>{credentials[0]?.metadata.name || 'Admin'}</span>
                  <span className='text-xs text-muted-foreground'>{preview.time}</span>
                </div>
              </div>
            </CardHeader>
            <CardContent className='p-4'>
              <div className='space-y-2 mb-4'>
                <ShowMoreText
                  lines={5}
                  more='Show more'
                  less='Show less'
                  className='text-sm text-justify'
                  expanded={false}
                  truncatedEndingComponent={'... '}
                  anchorClass='cursor-pointer text-blue-600 font-semibold'
                >
                  {preview.description || t('captionAppear')}
                </ShowMoreText>
              </div>

              {preview.images.length > 0 && (
                <div
                  className={cn('aspect-square bg-muted rounded-md overflow-hidden relative max-h-[300px]', {
                    'max-h-full': preview.images.length !== 2
                  })}
                >
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
                          onClick={() => onRemoveImage(index)}
                          className='absolute top-1 right-1 bg-red-500 hover:bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 size-8 z-20'
                        >
                          <X className='size-4' />
                        </Button>

                        {preview.images.length > 4 && index + 1 === 4 && (
                          <Button
                            type='button'
                            variant='outline'
                            className='size-full absolute top-0 left-0 bg-transparent hover:bg-transparent z-10'
                            onClick={onShowSlider}
                          >
                            <span className='text-white text-xl'>+{preview.images.length - 4}</span>
                          </Button>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </CardContent>
            <CardFooter className='flex justify-between p-4 border-t'>
              <Button variant='ghost' size='sm'>
                <Heart className='size-4 mr-2' />
                {t('like')}
              </Button>
              <Button variant='ghost' size='sm'>
                <MessageCircle className='size-4 mr-2' />
                {t('comment')}
              </Button>
              <Button variant='ghost' size='sm'>
                <Share2 className='size-4 mr-2' />
                {t('share')}
              </Button>
            </CardFooter>
          </Card>
        </div>

        {!post || (post && post?.status !== 'published') ? (
          <div className='flex flex-col gap-4'>
            {isEdit && isRecurringPost && (
              <Accordion type='single' collapsible className='w-full' defaultValue='updateOptions'>
                <AccordionItem value='updateOptions'>
                  <AccordionTrigger>{t('updateOptions')}</AccordionTrigger>
                  <AccordionContent>
                    <FormField
                      control={form.control}
                      name='updateType'
                      render={({ field }) => (
                        <FormItem className='space-y-3'>
                          <FormControl>
                            <RadioGroup
                              onValueChange={field.onChange}
                              value={field.value}
                              className='flex flex-col space-y-2'
                            >
                              <FormItem className='flex items-center space-x-2 space-y-0'>
                                <FormControl>
                                  <RadioGroupItem value='single' />
                                </FormControl>
                                <FormLabel className='font-normal'>{t('updateSinglePost')}</FormLabel>
                              </FormItem>
                              <FormItem className='flex items-center space-x-2 space-y-0'>
                                <FormControl>
                                  <RadioGroupItem value='all' />
                                </FormControl>
                                <FormLabel className='font-normal'>{t('updateAllRecurring')}</FormLabel>
                              </FormItem>
                            </RadioGroup>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            )}
            <div className='flex justify-end gap-4'>
              <Button variant='outline' onClick={onClose}>
                {t('cancel')}
              </Button>
              <Button disabled={isSubmitting} type='submit'>
                {isSubmitting
                  ? isEdit
                    ? t('updating')
                    : t('scheduling')
                  : isEdit
                    ? isRecurringPost
                      ? t('updateRecurringPost')
                      : t('updatePost')
                    : t('schedulePost')}
                {isSubmitting && <Loader2 className='size-4 animate-spin ml-2' />}
              </Button>
            </div>
          </div>
        ) : (
          <div></div>
        )}
      </div>
    </div>
  )
}
