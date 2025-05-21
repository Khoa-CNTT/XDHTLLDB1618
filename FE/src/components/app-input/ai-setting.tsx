import React, { Dispatch, SetStateAction, useEffect } from 'react'
import { genAISettingSchema, GenAISettingSchema } from '@/schema-validations/genAI'
import { zodResolver } from '@hookform/resolvers/zod'
import { useTranslations } from 'next-intl'
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
  const t = useTranslations('createPostModal')
  const TONE_OPTIONS = [
    {
      value: 'funny',
      label: `🤣 ${t('funny')}`
    },
    {
      value: 'friendly',
      label: `😁 ${t('friendly')}`
    },
    {
      value: 'professional',
      label: `💼 ${t('professional')}`
    },
    {
      value: 'enthusiastic',
      label: `🎉 ${t('enthusiastic')}`
    },
    {
      value: 'informative',
      label: `📔 ${t('informative')}`
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
                <FormLabel className='mb-2 text-md font-bold'>{t('tone')}</FormLabel>
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
                <FormLabel className='mb-2 text-md font-bold'>{t('useEmoji')}</FormLabel>
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
                <FormLabel className='mb-2 text-md font-bold'>{t('useHashtag')}</FormLabel>
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
              <FormLabel className='mb-2 text-md font-bold'>{t('howAiRespond')}</FormLabel>
              <FormControl>
                <Input {...field} placeholder={t('exampleResponse')} />
              </FormControl>
            </FormItem>
          )}
        />
        <Button type='submit' className='block ml-auto'>
          {t('saveSettings')}
        </Button>
      </form>
    </Form>
  )
}
