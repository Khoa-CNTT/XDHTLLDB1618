import React, { Dispatch, SetStateAction, useEffect } from 'react'
import { genAISettingSchema, GenAISettingSchema } from '@/schema-validations/genAI'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'

import { Button } from '../ui/button'
import { Form, FormControl, FormField, FormItem, FormLabel } from '../ui/form'
import { Input } from '../ui/input'
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from '../ui/select'
import { Switch } from '../ui/switch'

interface Props {
  setStep: Dispatch<SetStateAction<number>>
  setSettings: Dispatch<SetStateAction<GenAISettingSchema>>
  currentSettings: GenAISettingSchema
}

export default function AiSetting({ setStep, setSettings, currentSettings }: Props) {
  const TONE_OPTIONS = [
    {
      value: 'funny',
      label: '🤣 Funny'
    },
    {
      value: 'friendly',
      label: '😁 Friendly'
    },
    {
      value: 'professional',
      label: '💼 Professional'
    },
    {
      value: 'enthusiastic',
      label: '🎉 Enthusiastic'
    },
    {
      value: 'informative',
      label: '📔 Informative'
    }
  ]
  const form = useForm<GenAISettingSchema>({
    defaultValues: {
      tone: currentSettings.tone || 'professional',
      isUseEmoji: currentSettings.isUseEmoji || false,
      isUseHashtags: currentSettings.isUseHashtags || false,
      responseFormat: currentSettings.responseFormat || ''
    },
    resolver: zodResolver(genAISettingSchema)
  })

  const onInnerSubmit = (data: GenAISettingSchema) => {
    setSettings(data)
    setStep(1)
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    e.stopPropagation()
    form.handleSubmit(onInnerSubmit)(e)
  }

  useEffect(() => {
    const { tone, isUseEmoji, isUseHashtags, responseFormat } = currentSettings
    form.reset({ tone, isUseEmoji, isUseHashtags, responseFormat })
  }, [currentSettings, form])

  return (
    <Form {...form}>
      <form className='space-y-8' onSubmit={handleSubmit}>
        <div>
          <FormField
            control={form.control}
            name='tone'
            render={({ field }) => (
              <FormItem>
                <FormLabel className='mb-2 text-md font-bold'>Tone</FormLabel>
                <FormControl>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <SelectTrigger className='w-[180px]'>
                      <SelectValue placeholder='Select a tone' />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectGroup>
                        {TONE_OPTIONS.map((option) => (
                          <SelectItem key={option.value} value={option.value}>
                            {option.label}
                          </SelectItem>
                        ))}
                      </SelectGroup>
                    </SelectContent>
                  </Select>
                </FormControl>
              </FormItem>
            )}
          />
        </div>
        <div className='flex my-8 items-center gap-6'>
          <FormField
            control={form.control}
            name='isUseEmoji'
            render={({ field }) => (
              <FormItem className='flex flex-col'>
                <FormLabel className='mb-2 text-md font-bold'>Use Emoji</FormLabel>
                <FormControl>
                  <Switch checked={field.value} onCheckedChange={field.onChange} />
                </FormControl>
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name='isUseHashtags'
            render={({ field }) => (
              <FormItem className='flex flex-col'>
                <FormLabel className='mb-2 text-md font-bold'>Use Hashtags</FormLabel>
                <FormControl>
                  <Switch checked={field.value} onCheckedChange={field.onChange} />
                </FormControl>
              </FormItem>
            )}
          />
        </div>
        <FormField
          control={form.control}
          name='responseFormat'
          render={({ field }) => (
            <FormItem className='flex flex-col'>
              <FormLabel className='mb-2 text-md font-bold'>How would you like AI Assistant to respond?</FormLabel>
              <FormControl>
                <Input {...field} placeholder='e.g. write in the first person, respond as a pirate, etc.' />
              </FormControl>
            </FormItem>
          )}
        />
        <Button type='submit' className='mt-8 block ml-auto'>
          Save settings
        </Button>
      </form>
    </Form>
  )
}
