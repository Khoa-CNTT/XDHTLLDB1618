import React, { useState } from 'react'
import { Check } from 'lucide-react'

import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'

const ColorSelector = () => {
  const [selectedColor, setSelectedColor] = useState('')

  const colors = [
    { name: 'Red', value: '#EF4444', className: 'bg-red-500 hover:bg-red-600' },
    { name: 'Blue', value: '#3B82F6', className: 'bg-blue-500 hover:bg-blue-600' },
    { name: 'Green', value: '#22C55E', className: 'bg-green-500 hover:bg-green-600' },
    { name: 'Yellow', value: '#EAB308', className: 'bg-yellow-500 hover:bg-yellow-600' },
    { name: 'Purple', value: '#A855F7', className: 'bg-purple-500 hover:bg-purple-600' },
    { name: 'Pink', value: '#EC4899', className: 'bg-pink-500 hover:bg-pink-600' },
    { name: 'Orange', value: '#F97316', className: 'bg-orange-500 hover:bg-orange-600' },
    { name: 'Gray', value: '#6B7280', className: 'bg-gray-500 hover:bg-gray-600' }
  ]

  return (
    <div className='flex flex-wrap gap-2'>
      {colors.map((color) => (
        <Button
          key={color.value}
          variant='outline'
          size='icon'
          className={cn(
            'h-10 w-10 rounded-full relative',
            color.className,
            selectedColor === color.value && 'ring-2 ring-offset-2 ring-offset-white'
          )}
          onClick={() => setSelectedColor(color.value)}
          title={color.name}
        >
          <span className='sr-only'>{color.name}</span>
          {selectedColor === color.value && <Check className='size-4 text-white absolute' />}
        </Button>
      ))}
    </div>
  )
}

export default ColorSelector
