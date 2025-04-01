import { useState } from 'react'
import { useGenAI } from '@/queries/genAI'
import { GenAISettingSchema } from '@/schema-validations/genAI'
import {
  ArrowDownWideNarrow,
  ArrowLeft,
  ArrowUpWideNarrow,
  RefreshCcw,
  Settings,
  Sparkles,
  SpellCheck
} from 'lucide-react'
import { flushSync } from 'react-dom'

import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'

import { Button } from '../ui/button'
import { Textarea } from '../ui/textarea'
import AiSetting from './ai-setting'

interface Props {
  onContentChange: (text: string) => void
}
const TwoStepPopover = ({ onContentChange }: Props) => {
  const [open, setOpen] = useState(false)
  const [step, setStep] = useState(1)
  //Info: Temporary solution
  const [settings, setSettings] = useState<GenAISettingSchema>({})
  const genAI = useGenAI()

  const onDescribeChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setSettings({ ...settings, userDescription: e.target.value })
  }
  const handleNext = () => {
    setStep(2)
  }

  const handleBack = () => {
    setStep(1)
  }

  const onGeneratePost = () => {
    //TODO: Research and Optimize prompt for social content writing
    const prompt = `
      Tone: ${settings.tone}
      Use Emojis: ${settings.isUseEmoji ? 'Yes' : 'No'}
      Use Hashtags: ${settings.isUseHashtags ? 'Yes' : 'No'}
      Specific Hashtags: #Lunaria, #Candle
      User Description: ${settings.userDescription}
      Post Topic: ${settings.responseFormat}
      `
    genAI.mutate(
      { data: prompt },
      {
        onSuccess: (data) => {
          onContentChange(String(data.data))
        }
      }
    )
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
        <Sparkles className='text-yellow-400 size-5' />
      </PopoverTrigger>
      <PopoverContent className='w-[600px]' align='start'>
        {/* Progress indicator */}
        <div className='flex justify-between items-center w-full mb-4'>
          <ArrowLeft onClick={handleBack} className={`size-4 cursor-pointer ${step === 1 && 'opacity-0'}`} />
          <span className='text-center'>AI Generator</span>
          <Settings onClick={handleNext} className={`size-4 cursor-pointer ${step === 2 && 'opacity-0'}`} />
        </div>

        {/* Content */}
        <div className='py-2'>
          {step === 1 ? (
            <div className='space-y-3'>
              <p className='font-semibold'>Describe the post you are submitting to generate ideas</p>
              <Textarea
                onChange={onDescribeChange}
                placeholder='e.g. Promote my blog post about the best trekking tour'
              />
              <div className='flex items-center gap-2'>
                <Button className='rounded-3xl' variant='outline'>
                  <RefreshCcw />
                  Rewrite
                </Button>
                <Button className='rounded-3xl' variant='outline'>
                  <ArrowUpWideNarrow />
                  Longer
                </Button>
                <Button className='rounded-3xl' variant='outline'>
                  <ArrowDownWideNarrow />
                  Shorter
                </Button>
                <Button className='rounded-3xl' variant='outline'>
                  <SpellCheck />
                  Fix grammar
                </Button>
              </div>
              <span className='text-gray-500 text-xs italic mt-6 inline-block'>
                AI Assistant can generate inaccurate or misleading information. Always review generated content before
                posting.
              </span>
              <Button disabled={genAI.isPending} className='w-full' onClick={onGeneratePost}>
                <Sparkles />
                Generate
              </Button>
            </div>
          ) : (
            <AiSetting setStep={setStep} setSettings={setSettings} />
          )}
        </div>
      </PopoverContent>
    </Popover>
  )
}

export default TwoStepPopover
