import { useEffect, useState } from 'react'
import { zodResolver } from '@hookform/resolvers/zod'
import { ArrowLeft, Edit2, Hash, X } from 'lucide-react'
import { useTranslations } from 'next-intl'
import { flushSync } from 'react-dom'
import { useForm } from 'react-hook-form'
import * as z from 'zod'

import { cn } from '@/lib/utils'
import { useToast } from '@/hooks/use-toast'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'

import { Button } from '../ui/button'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '../ui/form'
import { Input } from '../ui/input'
import ColorSelector from './color-selector'
import HashtagInput from './hashtags-input'

// Types
interface Hashtag {
  id: string
  name: string
  value: string[]
  color: string
}

// Schema
const hashtagFormSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  value: z.array(z.string()).min(1, 'At least one hashtag is required'),
  color: z.string().min(1, 'Color is required')
})

type HashtagFormValues = z.infer<typeof hashtagFormSchema>

interface Props {
  onAddHashtags: (hashtags: string[]) => void
}

const TwoStepPopover = ({ onAddHashtags }: Props) => {
  const [open, setOpen] = useState(false)
  const [step, setStep] = useState(1)
  const [searchQuery, setSearchQuery] = useState('')
  const [editingHashtag, setEditingHashtag] = useState<Hashtag | null>(null)
  const [hashtags, setHashtags] = useState<Hashtag[]>([
    {
      id: '1',
      name: 'Lunaria',
      value: ['#lunaria', '#candle', '#shop'],
      color: 'bg-red-500'
    },
    {
      id: '2',
      name: 'IT',
      value: ['#viral', '#javascript'],
      color: 'bg-green-500'
    }
  ])
  const { toast } = useToast()

  // Form
  const form = useForm<HashtagFormValues>({
    resolver: zodResolver(hashtagFormSchema),
    defaultValues: {
      name: '',
      value: [],
      color: 'bg-blue-500'
    }
  })

  // Effects
  useEffect(() => {
    if (editingHashtag) {
      form.reset({
        name: editingHashtag.name,
        value: editingHashtag.value,
        color: editingHashtag.color
      })
    }
  }, [editingHashtag, form])

  // Handlers
  const handleClose = () => {
    setOpen(false)
    setStep(1)
    setEditingHashtag(null)
    form.reset()
  }

  const onOpenChange = (isOpen: boolean) => {
    setOpen(isOpen)
    if (!isOpen) {
      flushSync(() => {
        handleClose()
      })
    }
  }

  const handleEdit = (hashtag: Hashtag) => {
    setEditingHashtag(hashtag)
    setStep(2)
  }

  const handleDelete = (id: string) => {
    setHashtags((prev) => prev.filter((tag) => tag.id !== id))
    toast({ title: t('success'), description: t('hashtagDeleted') })
  }

  const onSubmit = (values: HashtagFormValues) => {
    if (editingHashtag) {
      // Update existing hashtag
      setHashtags((prev) => prev.map((tag) => (tag.id === editingHashtag.id ? { ...tag, ...values } : tag)))
      toast({ title: t('success'), description: t('hashtagUpdated') })
    } else {
      // Create new hashtag
      const newHashtag: Hashtag = {
        id: Date.now().toString(), // Simple ID generation
        ...values,
        value: values.value.map((ht) => `#${ht}`)
      }
      setHashtags((prev) => [...prev, newHashtag])
      toast({ title: t('success'), description: t('hashtagCreated') })
    }
    setStep(1)
  }

  // Filter hashtags based on search query
  const filteredHashtags = hashtags.filter(
    (tag) =>
      tag.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      tag.value.some((v) => v.toLowerCase().includes(searchQuery.toLowerCase()))
  )

  const t = useTranslations('createPostModal')

  return (
    <Popover open={open} onOpenChange={onOpenChange} modal={true}>
      <PopoverTrigger asChild>
        <Hash className='size-5' />
      </PopoverTrigger>
      <PopoverContent className='w-full lg:w-[600px] max-h-[450px] overflow-y-auto w-parent-full' align='start'>
        <div className='flex justify-between items-center w-full mb-4'>
          <ArrowLeft onClick={() => setStep(1)} className={`size-4 cursor-pointer ${step === 1 && 'opacity-0'}`} />
          <span className='text-center font-bold text-xl'>
            {step === 1 ? t('hashtagManager') : `${editingHashtag ? t('editHashtag') : t('createHashtag')}`}
          </span>
          <X className={`size-4 cursor-pointer ${step === 2 && 'opacity-0'}`} onClick={handleClose} />
        </div>

        <div className='py-2'>
          {step === 1 ? (
            <div>
              <Input
                placeholder={t('searchHashtags')}
                className='mb-8'
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />

              {filteredHashtags.length === 0 ? (
                <div className='text-center text-muted-foreground'>
                  {searchQuery ? t('noHashtagsFound') : t('noHashtagsYet')}
                </div>
              ) : (
                filteredHashtags.map((tag) => (
                  <div className='mb-2 w-full flex items-center' key={tag.id}>
                    <div
                      onClick={() => onAddHashtags(tag.value)}
                      className={`rounded-lg border flex flex-col w-[90%] px-4 py-2 cursor-pointer hover:bg-accent`}
                    >
                      <div className='flex items-center justify-between'>
                        <div className='flex flex-col justify-between'>
                          <span className='font-bold text-lg block'>{tag.name}</span>
                          <div className='flex flex-wrap gap-2'>
                            {tag.value.map((value) => (
                              <span key={value} className='text-sm text-muted-foreground'>
                                {value}
                              </span>
                            ))}
                          </div>
                        </div>
                        <div className={cn('h-10 w-10 rounded-full', tag.color)}>
                          <span className='sr-only'>{tag.name}</span>
                        </div>
                      </div>
                    </div>
                    <div className='flex gap-2 ml-4'>
                      <Button variant='outline' size='icon' onClick={() => handleEdit(tag)}>
                        <Edit2 className='size-4' />
                      </Button>
                      <Button variant='outline' size='icon' onClick={() => handleDelete(tag.id)}>
                        <X className='size-4' />
                      </Button>
                    </div>
                  </div>
                ))
              )}

              <Button className='w-full mt-8' onClick={() => setStep(2)}>
                {t('createHashtag')}
              </Button>
            </div>
          ) : (
            <Form {...form}>
              <form
                onSubmit={(e) => {
                  e.preventDefault()
                  e.stopPropagation()
                  form.handleSubmit(onSubmit)(e)
                }}
                className='space-y-6'
              >
                <FormField
                  control={form.control}
                  name='name'
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{t('name')}</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name='value'
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{t('hashtags')}</FormLabel>
                      <FormControl>
                        <HashtagInput value={field.value} onChange={field.onChange} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name='color'
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{t('color')}</FormLabel>
                      <FormControl>
                        <ColorSelector value={field.value} onChange={field.onChange} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className='flex justify-end gap-2'>
                  <Button type='button' variant='outline' onClick={() => setStep(1)}>
                    {t('cancel')}
                  </Button>
                  <Button type='submit'>{editingHashtag ? t('update') : t('save')}</Button>
                </div>
              </form>
            </Form>
          )}
        </div>
      </PopoverContent>
    </Popover>
  )
}

export default TwoStepPopover
