import { CHARACTER_LIMITS, PostType } from '@/constants/post'
import { PostSchema } from '@/schema-validations/post'
import { toCapitalize } from '@/utils/utils'
import { addMonths, format, isAfter, isBefore } from 'date-fns'
import { enUS, vi } from 'date-fns/locale'
import { Calendar, CalendarIcon, Info, Upload } from 'lucide-react'
import { useLocale, useTranslations } from 'next-intl'
import { DateRange } from 'react-day-picker'
import { UseFormReturn } from 'react-hook-form'

import { cn } from '@/lib/utils'
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion'
import { Button } from '@/components/ui/button'
import { Calendar as CalendarComponent } from '@/components/ui/calendar'
import { Card, CardContent } from '@/components/ui/card'
import { Checkbox } from '@/components/ui/checkbox'
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { Switch } from '@/components/ui/switch'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip'
import AppInput from '@/components/app-input'

interface FormPanelProps {
  form: UseFormReturn<PostSchema>
  onImageUpload: (e: React.ChangeEvent<HTMLInputElement>) => void
  isEdit?: boolean
  isRecurringPost?: boolean
  updateType?: string
}

export const FormPanel = ({ form, onImageUpload, isEdit, isRecurringPost, updateType }: FormPanelProps) => {
  const t = useTranslations('createPostModal')

  const weekdays = [
    { value: 'monday', label: t('monday') },
    { value: 'tuesday', label: t('tuesday') },
    { value: 'wednesday', label: t('wednesday') },
    { value: 'thursday', label: t('thursday') },
    { value: 'friday', label: t('friday') },
    { value: 'saturday', label: t('saturday') },
    { value: 'sunday', label: t('sunday') }
  ]

  const isRecurring = form.watch('isRecurring')

  const locale = useLocale()
  const dateFnsLocale = locale === 'vi' ? vi : enUS

  return (
    <div className='flex-1'>
      <div className='px-2 md:px-6 py-6 max-h-[calc(90vh-48px)] overflow-y-auto scrollbar-none'>
        <div className='space-y-6'>
          <FormField
            control={form.control}
            name='type'
            render={({ field }) => (
              <FormItem className='space-y-3'>
                <FormLabel>
                  {t('type')} <span className='text-red-500'>*</span>
                </FormLabel>
                <FormControl>
                  <RadioGroup
                    onValueChange={field.onChange}
                    value={field.value}
                    className='flex flex-wrap gap-4'
                    disabled={isEdit && isRecurringPost && updateType === 'all'}
                  >
                    {Object.values(PostType).map((type) => (
                      <FormItem key={type}>
                        <FormControl>
                          <RadioGroupItem value={type} className='peer sr-only' id={type} />
                        </FormControl>
                        <FormLabel
                          htmlFor={type}
                          className={cn(
                            'flex items-center justify-center rounded-md border-2 border-muted bg-transparent px-6 py-2 hover:bg-muted peer-data-[state=checked]:border-primary peer-data-[state=checked]:bg-primary peer-data-[state=checked]:text-primary-foreground cursor-pointer',
                            isEdit && isRecurringPost && updateType === 'all' && 'opacity-50 cursor-not-allowed'
                          )}
                        >
                          {t(type).toUpperCase()}
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
                <FormLabel className='flex items-center justify-between'>
                  <div>
                    {t('description')} <span className='text-red-500'>*</span>
                  </div>
                  <div className='hidden lg:block'>
                    <TooltipProvider delayDuration={100}>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <span className='ml-1 cursor-pointer align-middle'>
                            <Info className='inline size-4 text-muted-foreground' />
                          </span>
                        </TooltipTrigger>
                        <TooltipContent>
                          <div>
                            <div className='font-semibold mb-1'>{t('characterLimit')}:</div>
                            <ul className='list-disc list-inside pl-1'>
                              {Object.entries(CHARACTER_LIMITS).map(([key, value]) => (
                                <li key={key}>
                                  {toCapitalize(key)}: {value} {t('characters')}
                                </li>
                              ))}
                            </ul>
                          </div>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </div>
                  <div className='lg:hidden'>
                    <Popover>
                      <PopoverTrigger asChild>
                        <Info className='inline size-4 text-muted-foreground' />
                      </PopoverTrigger>
                      <PopoverContent>
                        <div className='text-sm'>
                          <div className='font-semibold mb-1'>{t('characterLimit')}:</div>
                          <ul className='list-disc list-inside pl-1'>
                            {Object.entries(CHARACTER_LIMITS).map(([key, value]) => (
                              <li key={key}>
                                {toCapitalize(key)}: {value} {t('characters')}
                              </li>
                            ))}
                          </ul>
                        </div>
                      </PopoverContent>
                    </Popover>
                  </div>
                </FormLabel>
                <FormControl>
                  <AppInput field={field} disabled={isEdit && isRecurringPost && updateType === 'all'} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <Accordion type='single' collapsible className='w-full'>
            <AccordionItem value='media'>
              <AccordionTrigger>{t('media')}</AccordionTrigger>
              <AccordionContent>
                <FormField
                  control={form.control}
                  name='images'
                  render={({}) => (
                    <FormItem>
                      <FormControl>
                        <Card
                          className={cn(
                            'border-dashed',
                            isEdit && isRecurringPost && updateType === 'all' && 'opacity-50'
                          )}
                        >
                          <CardContent className='p-6'>
                            <Input
                              type='file'
                              accept='image/*'
                              multiple
                              className='hidden'
                              onChange={onImageUpload}
                              id='image-upload'
                              disabled={isEdit && isRecurringPost && updateType === 'all'}
                            />
                            <label
                              htmlFor='image-upload'
                              className={cn(
                                'cursor-pointer flex flex-col items-center justify-center py-6 bg-muted hover:bg-muted/80 rounded-md transition-colors',
                                isEdit && isRecurringPost && updateType === 'all' && 'opacity-50 cursor-not-allowed'
                              )}
                            >
                              <Upload className='size-8 mb-2' />
                              <p className='text-sm text-muted-foreground'>{t('uploadImages')}</p>
                            </label>
                          </CardContent>
                        </Card>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </AccordionContent>
            </AccordionItem>
          </Accordion>

          {/* Schedule Fields */}
          <div className='grid gap-4 sm:grid-cols-2'>
            <FormField
              control={form.control}
              name='scheduledDate'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t('scheduledDate')}</FormLabel>
                  <Popover>
                    <PopoverTrigger asChild>
                      <FormControl>
                        <Button
                          variant={'outline'}
                          className={cn(
                            'pl-3 text-left font-normal flex w-full',
                            !field.value && 'text-muted-foreground',
                            (isRecurring || (isEdit && isRecurringPost && updateType === 'single')) &&
                              'opacity-50 cursor-not-allowed'
                          )}
                          disabled={isRecurring || (isEdit && isRecurringPost && updateType === 'single')}
                        >
                          {field.value ? format(field.value, 'MM/dd/yyyy', { locale: dateFnsLocale }) : t('pickDate')}
                          <Calendar className='ml-auto size-4 opacity-50' />
                        </Button>
                      </FormControl>
                    </PopoverTrigger>
                    <PopoverContent className='w-auto p-0' align='start'>
                      <CalendarComponent
                        mode='single'
                        locale={dateFnsLocale}
                        selected={field.value}
                        onSelect={field.onChange}
                        initialFocus
                        disabled={(date) => isBefore(date, new Date(new Date().setHours(0, 0, 0, 0)))}
                      />
                    </PopoverContent>
                  </Popover>
                  {isRecurring && <p className='text-xs text-muted-foreground mt-1'>{t('dateNote')}</p>}
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name='scheduledTime'
              render={({ field }) => (
                <FormItem>
                  <div className='flex items-center justify-end space-x-2'>
                    <Label htmlFor='recurring-toggle' className='text-sm'>
                      {t('recurring')}
                    </Label>
                    <FormField
                      control={form.control}
                      name='isRecurring'
                      render={({ field }) => (
                        <Switch
                          id='recurring-toggle'
                          checked={field.value}
                          onCheckedChange={field.onChange}
                          disabled={isEdit && isRecurringPost && updateType === 'single'}
                        />
                      )}
                    />
                  </div>
                  <FormControl>
                    <Input type='time' {...field} disabled={isEdit && isRecurringPost && updateType === 'single'} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          {/* Recurring Schedule */}
          <FormField
            control={form.control}
            name='isRecurring'
            render={({ field }) => (
              <div>
                {field.value && (
                  <div
                    className={cn('border rounded-md p-4 space-y-4', {
                      'opacity-50 cursor-not-allowed': isEdit && isRecurringPost && updateType === 'single'
                    })}
                  >
                    <Label className='text-sm font-medium block'>{t('recurringSchedule')}</Label>

                    <FormField
                      control={form.control}
                      name='recurringType'
                      render={({ field }) => (
                        <RadioGroup
                          value={field.value}
                          onValueChange={field.onChange}
                          className='space-y-2'
                          disabled={isEdit && isRecurringPost && updateType === 'single'}
                        >
                          <div className='flex items-center space-x-2'>
                            <RadioGroupItem value='daily' id='daily' />
                            <Label htmlFor='daily'>{t('daily')}</Label>
                          </div>

                          <div className='flex items-center space-x-2'>
                            <RadioGroupItem value='weekly' id='weekly' />
                            <Label htmlFor='weekly'>{t('weekly')}</Label>
                          </div>
                        </RadioGroup>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name='recurringType'
                      render={({ field }) => (
                        <div>
                          {field.value === 'weekly' && (
                            <div className='pt-2'>
                              <Label className='text-sm font-medium mb-2 block'>{t('selectDateOfWeek')}</Label>
                              <div className='grid grid-cols-2 gap-2'>
                                {weekdays.map((day) => (
                                  <div key={day.value} className='flex items-center space-x-2'>
                                    <FormField
                                      control={form.control}
                                      name='recurringDays'
                                      render={({ field }) => (
                                        <Checkbox
                                          id={`day-${day.value}`}
                                          checked={field.value.includes(day.value)}
                                          onCheckedChange={(checked) => {
                                            if (checked) {
                                              field.onChange([...field.value, day.value])
                                            } else {
                                              field.onChange(field.value.filter((d) => d !== day.value))
                                            }
                                          }}
                                        />
                                      )}
                                    />
                                    <Label htmlFor={`day-${day.value}`}>{day.label}</Label>
                                  </div>
                                ))}
                              </div>
                            </div>
                          )}
                        </div>
                      )}
                    />

                    <div className='pt-2 border-t mt-4'>
                      <Label className='text-sm font-medium mb-2 block'>{t('dateRange')}</Label>

                      <FormField
                        control={form.control}
                        name='recurringDateRange'
                        render={({ field }) => (
                          <Popover>
                            <PopoverTrigger asChild>
                              <Button
                                variant='outline'
                                className={cn(
                                  'w-full justify-start text-left font-normal',
                                  !field.value && 'text-muted-foreground'
                                )}
                              >
                                <CalendarIcon className='mr-2 size-4' />
                                {field.value?.from ? (
                                  field.value.to ? (
                                    <>
                                      {format(field.value.from, 'PP', { locale: dateFnsLocale })} -{' '}
                                      {format(field.value.to, 'PP', { locale: dateFnsLocale })}
                                    </>
                                  ) : (
                                    format(field.value.from, 'PP', { locale: dateFnsLocale })
                                  )
                                ) : (
                                  <span>{t('selectDateRangeTitle')}</span>
                                )}
                              </Button>
                            </PopoverTrigger>
                            <PopoverContent className='w-auto p-0' align='start'>
                              <CalendarComponent
                                locale={dateFnsLocale}
                                initialFocus
                                mode='range'
                                defaultMonth={field.value?.from}
                                selected={field.value as DateRange}
                                onSelect={(range) => {
                                  if (range?.from) {
                                    if (!range.to) {
                                      field.onChange(range)
                                    } else if (range.to) {
                                      const maxEndDate = addMonths(range.from, 1)
                                      if (isAfter(range.to, maxEndDate)) {
                                        field.onChange({
                                          from: range.from,
                                          to: maxEndDate
                                        })
                                      } else {
                                        field.onChange(range)
                                      }
                                    }
                                  } else {
                                    field.onChange(undefined)
                                  }
                                }}
                                numberOfMonths={2}
                                disabled={(date) => {
                                  if (isBefore(date, new Date(new Date().setHours(0, 0, 0, 0)))) {
                                    return true
                                  }

                                  const range = field.value as DateRange
                                  if (range?.from && isAfter(date, addMonths(range.from, 1))) {
                                    return true
                                  }

                                  return false
                                }}
                              />
                              <div className='p-3 border-t text-xs text-muted-foreground'>{t('youCanSelect')}</div>
                            </PopoverContent>
                          </Popover>
                        )}
                      />
                    </div>
                  </div>
                )}
              </div>
            )}
          />
        </div>
      </div>
    </div>
  )
}
