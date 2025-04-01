import { useState } from 'react'
import { ArrowLeft, Edit2, Hash, X } from 'lucide-react'
import { flushSync } from 'react-dom'

import { cn } from '@/lib/utils'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'

import { Button } from '../ui/button'
import { FormControl, FormItem, FormLabel } from '../ui/form'
import { Input } from '../ui/input'
import ColorSelector from './color-selector'
import HashtagInput from './hashtags-input'

interface Props {
  onAddHashtags: (hashtags: string[]) => void
}
const TwoStepPopover = ({ onAddHashtags }: Props) => {
  const [open, setOpen] = useState(false)
  const [step, setStep] = useState(1)

  const HASHTAGS = [
    {
      id: 1,
      name: 'Lunaria',
      value: ['#lunaria', '#candle', '#shop'],
      color: 'bg-red-500'
    },
    {
      id: 2,
      name: 'IT',
      value: ['#viral', '#javascript'],
      color: 'bg-green-500'
    }
  ]

  const handleClose = () => {
    setOpen(false)
    setStep(1)
  }

  const onOpenChange = (isOpen: boolean) => {
    setOpen(isOpen)
    if (!isOpen) {
      flushSync(() => {
        setStep(1)
      })
    }
  }

  return (
    <Popover open={open} onOpenChange={onOpenChange}>
      <PopoverTrigger asChild>
        <Hash className='size-5' />
      </PopoverTrigger>
      <PopoverContent className='w-[600px]' align='start'>
        {/* Progress indicator */}
        <div className='flex justify-between items-center w-full mb-4'>
          <ArrowLeft onClick={() => setStep(1)} className={`size-4 cursor-pointer ${step === 1 && 'opacity-0'}`} />
          <span className='text-center font-bold text-xl'>Hashtags manager</span>
          <X className={`size-4 cursor-pointer ${step === 2 && 'opacity-0'}`} onClick={handleClose} />
        </div>

        {/* Content */}
        <div className='py-2'>
          {step === 1 ? (
            <div>
              <Input placeholder='Search hashtags' className='mb-8' />
              {HASHTAGS.map((tag) => (
                <div onClick={() => onAddHashtags(tag.value)} className='mb-2 w-full flex items-center' key={tag.id}>
                  <div className={`rounded-lg border flex flex-col w-[90%] px-4 py-2 `}>
                    <div className='flex items-center justify-between'>
                      <div className='flex flex-col justify-between'>
                        <span className='font-bold text-lg block '>{tag.name}</span>
                        <div className='flex'>
                          {tag.value.map((value) => (
                            <span className='mr-2 inline-block' key={value}>
                              {value}
                            </span>
                          ))}
                        </div>
                      </div>
                      <div className={cn('h-10 w-10 rounded-full relative', tag.color)}>
                        <span className='sr-only'>{tag.name}</span>
                      </div>
                    </div>
                  </div>
                  <Button variant='outline' className='w-[5%] ml-4 h-full'>
                    <Edit2 className='text-black dark:text-white' />
                  </Button>
                </div>
              ))}
              <Button className='w-full mt-8' onClick={() => setStep(2)}>
                Create new hashtags
              </Button>
            </div>
          ) : (
            <div className='gap-y-5 flex flex-col'>
              <FormItem>
                <FormLabel>Name</FormLabel>
                <FormControl>
                  <Input />
                </FormControl>
              </FormItem>
              <FormItem>
                <FormLabel>Hashtags</FormLabel>
                <FormControl>
                  <HashtagInput />
                </FormControl>
              </FormItem>
              <FormItem>
                <FormLabel>Select color</FormLabel>
                <FormControl>
                  <ColorSelector />
                </FormControl>
              </FormItem>

              <div className='w-full flex justify-end'>
                <Button>Save</Button>
              </div>
            </div>
          )}
        </div>
      </PopoverContent>
    </Popover>
  )
}

export default TwoStepPopover
