import React from 'react'
import { Check } from 'lucide-react'

import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'

interface ColorSelectorProps {
  value: string
  onChange: (value: string) => void
}

const ColorSelector = ({ value, onChange }: ColorSelectorProps) => {
  const colors = [
    { name: 'Red', value: 'bg-red-500', className: 'bg-red-500 hover:bg-red-600' },
    { name: 'Blue', value: 'bg-blue-500', className: 'bg-blue-500 hover:bg-blue-600' },
    { name: 'Green', value: 'bg-green-500', className: 'bg-green-500 hover:bg-green-600' },
    { name: 'Yellow', value: 'bg-yellow-500', className: 'bg-yellow-500 hover:bg-yellow-600' },
    { name: 'Purple', value: 'bg-purple-500', className: 'bg-purple-500 hover:bg-purple-600' },
    { name: 'Pink', value: 'bg-pink-500', className: 'bg-pink-500 hover:bg-pink-600' },
    { name: 'Orange', value: 'bg-orange-500', className: 'bg-orange-500 hover:bg-orange-600' },
    { name: 'Gray', value: 'bg-gray-500', className: 'bg-gray-500 hover:bg-gray-600' }
  ]

  return (
    <div className='flex flex-wrap gap-2'>
      {colors.map((color) => (
        <Button
          key={color.value}
          variant='outline'
          size='icon'
          type='button'
          className={cn(
            'h-10 w-10 rounded-full relative',
            color.className,
            value === color.value && 'ring-2 ring-offset-2 ring-offset-white dark:ring-offset-gray-950'
          )}
          onClick={() => onChange(color.value)}
          title={color.name}
        >
          <span className='sr-only'>{color.name}</span>
          {value === color.value && <Check className='size-4 text-white absolute' />}
        </Button>
      ))}
    </div>
  )
}

export default ColorSelector
