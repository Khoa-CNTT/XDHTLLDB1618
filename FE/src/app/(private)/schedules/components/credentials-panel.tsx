import { PostSchema } from '@/schema-validations/post'
import { getIconPlatform } from '@/utils/utils'
import { UseFormReturn } from 'react-hook-form'
import { IconType } from 'react-icons'

import { Credential } from '@/types/credentials'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Checkbox } from '@/components/ui/checkbox'
import { FormControl, FormField, FormItem, FormLabel } from '@/components/ui/form'

interface CredentialsPanelProps {
  form: UseFormReturn<PostSchema>
  credentials: Credential[]
  onScheduleAll: (checked: boolean) => void
}

export const CredentialsPanel = ({ form, credentials, onScheduleAll }: CredentialsPanelProps) => {
  return (
    <div className='lg:w-64 border-r'>
      <div className='p-6'>
        <FormField
          control={form.control}
          name='scheduleAll'
          render={({ field }) => (
            <FormItem className='flex flex-row items-start space-x-3 space-y-0 mb-4'>
              <FormControl>
                <Checkbox checked={field.value} onCheckedChange={onScheduleAll} />
              </FormControl>
              <div className='space-y-1 leading-none'>
                <FormLabel>Schedule all</FormLabel>
              </div>
            </FormItem>
          )}
        />
        <div className='space-y-4 max-h-[calc(90vh-48px)] overflow-y-auto scrollbar-none'>
          {credentials.map((credential) => (
            <FormField
              key={credential.id}
              control={form.control}
              name='selectedPages'
              render={({ field }) => {
                const PlatformIcon = getIconPlatform(credential.platform) as IconType
                return (
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
                          form.setValue('scheduleAll', newValue.length === credentials.length)
                        }}
                      />
                    </FormControl>
                    <div className='flex items-center gap-2'>
                      <Avatar className='size-8'>
                        <AvatarImage src={credential.metadata.avatar_url} />
                        <AvatarFallback>
                          <PlatformIcon className='size-8' />
                        </AvatarFallback>
                      </Avatar>
                      <FormLabel className='font-normal cursor-pointer flex items-center gap-2'>
                        <p className='line-clamp-1'>{credential.metadata.name}</p>
                        <PlatformIcon className='size-5 flex shrink-0' />
                      </FormLabel>
                    </div>
                  </FormItem>
                )
              }}
            />
          ))}
        </div>
      </div>
    </div>
  )
}
