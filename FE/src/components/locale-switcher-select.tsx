import { useTransition } from 'react'
import { Locale } from '@/i18n/config'

import { setUserLocale } from '@/lib/locale'

import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from './ui/select'

type Props = {
  defaultValue: string
  items: Array<{ value: string; label: string }>
  label: string
}

export default function LocaleSwitcherSelect({ defaultValue, items, label }: Props) {
  const [isPending, startTransition] = useTransition()

  function onChange(value: string) {
    const locale = value as Locale
    startTransition(() => {
      setUserLocale(locale)
    })
  }

  return (
    <div className='min-w-40'>
      <Select defaultValue={defaultValue} onValueChange={onChange}>
        <SelectTrigger className='size='>
          <SelectValue placeholder={label} />
        </SelectTrigger>
        <SelectContent>
          <SelectGroup>
            {items.map((item) => (
              <SelectItem disabled={isPending} key={item.value} value={item.value}>
                <span className='inline-block mr-2'>{item.label}</span>
              </SelectItem>
            ))}
          </SelectGroup>
        </SelectContent>
      </Select>
    </div>
  )
}
