import { PostSchema } from '@/schema-validations/post'
import { addMonths, format, isAfter, isBefore } from 'date-fns'
import { Calendar, CalendarIcon, Upload } from 'lucide-react'
import moment from 'moment'
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
import AppInput from '@/components/app-input'

interface FormPanelProps {
  form: UseFormReturn<PostSchema>
  onImageUpload: (e: React.ChangeEvent<HTMLInputElement>) => void
}

export const FormPanel = ({ form, onImageUpload }: FormPanelProps) => {
  const weekdays = [
    { value: 'monday', label: 'Monday' },
    { value: 'tuesday', label: 'Tuesday' },
    { value: 'wednesday', label: 'Wednesday' },
    { value: 'thursday', label: 'Thursday' },
    { value: 'friday', label: 'Friday' },
    { value: 'saturday', label: 'Saturday' },
    { value: 'sunday', label: 'Sunday' }
  ]

  const isRecurring = form.watch('isRecurring')

  return (
    <div className='flex-1'>
      <div className='p-6 max-h-[calc(90vh-48px)] overflow-y-auto scrollbar-none'>
        <div className='space-y-6'>
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

          <Accordion type='single' collapsible className='w-full'>
            <AccordionItem value='media'>
              <AccordionTrigger>Media</AccordionTrigger>
              <AccordionContent>
                <FormField
                  control={form.control}
                  name='images'
                  render={({}) => (
                    <FormItem>
                      <FormControl>
                        <Card className='border-dashed'>
                          <CardContent className='p-6'>
                            <Input
                              type='file'
                              accept='image/*'
                              multiple
                              className='hidden'
                              onChange={onImageUpload}
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
                  <FormLabel>Scheduled Date</FormLabel>
                  <Popover>
                    <PopoverTrigger asChild>
                      <FormControl>
                        <Button
                          variant={'outline'}
                          className={cn(
                            'pl-3 text-left font-normal flex w-full',
                            !field.value && 'text-muted-foreground',
                            isRecurring && 'opacity-50 cursor-not-allowed'
                          )}
                          disabled={isRecurring}
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
                  {isRecurring && (
                    <p className='text-xs text-muted-foreground mt-1'>
                      Scheduled date will be determined by regular posting schedule
                    </p>
                  )}
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name='scheduledTime'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    <div className='flex items-center justify-end space-x-2'>
                      <Label htmlFor='recurring-toggle' className='text-sm'>
                        Recurring
                      </Label>
                      <FormField
                        control={form.control}
                        name='isRecurring'
                        render={({ field }) => (
                          <Switch id='recurring-toggle' checked={field.value} onCheckedChange={field.onChange} />
                        )}
                      />
                    </div>
                  </FormLabel>
                  <FormControl>
                    <Input type='time' {...field} />
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
                  <div className='border rounded-md p-4 space-y-4'>
                    <Label className='text-sm font-medium block'>Recurring Schedule</Label>

                    <FormField
                      control={form.control}
                      name='recurringType'
                      render={({ field }) => (
                        <RadioGroup value={field.value} onValueChange={field.onChange} className='space-y-2'>
                          <div className='flex items-center space-x-2'>
                            <RadioGroupItem value='daily' id='daily' />
                            <Label htmlFor='daily'>Daily</Label>
                          </div>

                          <div className='flex items-center space-x-2'>
                            <RadioGroupItem value='weekly' id='weekly' />
                            <Label htmlFor='weekly'>Weekly</Label>
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
                              <Label className='text-sm font-medium mb-2 block'>Select days of week</Label>
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
                      <Label className='text-sm font-medium mb-2 block'>Date Range (up to one month)</Label>

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
                                      {format(field.value.from, 'MMM dd, yyyy')} -{' '}
                                      {format(field.value.to, 'MMM dd, yyyy')}
                                    </>
                                  ) : (
                                    format(field.value.from, 'PPP')
                                  )
                                ) : (
                                  <span>Select date range</span>
                                )}
                              </Button>
                            </PopoverTrigger>
                            <PopoverContent className='w-auto p-0' align='start'>
                              <CalendarComponent
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
                                  if (moment(date).isBefore(moment(), 'day')) {
                                    return true
                                  }

                                  const range = field.value as DateRange
                                  if (range?.from && moment(date).isAfter(moment(range.from).add(1, 'month'), 'day')) {
                                    return true
                                  }

                                  return false
                                }}
                              />
                              <div className='p-3 border-t text-xs text-muted-foreground'>
                                You can select a date range up to one month
                              </div>
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
