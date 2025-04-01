import React from 'react'
import data from '@emoji-mart/data'
import Picker from '@emoji-mart/react'
import { Smile } from 'lucide-react'
import { useTheme } from 'next-themes'

import { EmojiEvent } from '@/types/utils'

import { Popover, PopoverContent, PopoverTrigger } from '../ui/popover'

interface Props {
  insertEmoji: (emojiData: EmojiEvent) => void
}
export default function EmojiDialog({ insertEmoji }: Props) {
  const { resolvedTheme } = useTheme()
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Smile className='size-5' />
      </PopoverTrigger>
      <PopoverContent className='bg-transparent border-none shadow-none drop-shadow-none  mb-16'>
        <Picker theme={resolvedTheme} data={data} onEmojiSelect={insertEmoji} />
      </PopoverContent>
    </Popover>
  )
}
