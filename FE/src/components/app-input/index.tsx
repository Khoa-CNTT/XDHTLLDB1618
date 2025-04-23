import { useRef, useState } from 'react'
import { ControllerRenderProps, FieldValues } from 'react-hook-form'

import { EmojiEvent } from '@/types/utils'

import { Textarea } from '../ui/textarea'
import AIDialog from './ai-dialog'
import EmojiDialog from './emoji-dialog'
import HashTags from './hashtags-dialog'

interface Props<T extends FieldValues> {
  field: ControllerRenderProps<T>
}
export default function AppInput<T extends FieldValues>({ field }: Props<T>) {
  const [text, setText] = useState<string>(field.value || '')

  const textareaRef = useRef<HTMLTextAreaElement>(null)

  const insertEmoji = (emojiData: EmojiEvent) => {
    const emoji = emojiData.native
    const textarea = textareaRef.current
    if (!textarea) return

    const start = textarea.selectionStart
    const end = textarea.selectionEnd
    const newText = text.substring(0, start) + emoji + text.substring(end)

    setText(newText)
    field.onChange(newText)

    // Set cursor position after the inserted emoji
    setTimeout(() => {
      textarea.selectionStart = start + emoji.length
      textarea.selectionEnd = start + emoji.length
      textarea.focus()
    }, 0)
  }

  const onContentChange = (text: string) => {
    setText(text)
    field.onChange(text)
  }

  const onAddHashTags = (hashtags: string[]) => {
    const newText = `${text}\n${hashtags.join(' ')}`
    setText(newText)
  }

  const divRef = useRef<HTMLDivElement>(null)

  return (
    <div className='relative rounded-b-md border' ref={divRef}>
      <Textarea
        ref={textareaRef}
        value={text}
        minLength={7}
        onFocus={() => {
          divRef.current?.classList.add('border-ring')
        }}
        onBlur={() => {
          divRef.current?.classList.remove('border-ring')
        }}
        className='h-40 border-b-0 rounded-b-none resize-none focus-visible:ring-0 focus-visible:ring-offset-0'
        style={{
          scrollbarGutter: 'stable'
        }}
        onChange={(e) => onContentChange(e.target.value)}
      />

      <div className='p-4 flex gap-4 border border-y-input rounded-b-md'>
        <AIDialog onContentChange={onContentChange} text={text} />
        <EmojiDialog insertEmoji={insertEmoji} />
        <HashTags onAddHashtags={onAddHashTags} />
      </div>
    </div>
  )
}
