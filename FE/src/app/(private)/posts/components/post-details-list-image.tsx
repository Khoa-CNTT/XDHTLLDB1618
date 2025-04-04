'use client'

import { Fragment, useState } from 'react'
import Image from 'next/image'

import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'

import ImageSlider from '../../schedules/image-slider'

export interface PostDetailsListImageProps {
  images: {
    url: string
    type: string
  }[]
}

export default function PostDetailsListImage({ images }: PostDetailsListImageProps) {
  const [showImageSlider, setShowImageSlider] = useState<boolean>(false)
  return (
    <Fragment>
      <div
        className={cn('grid gap-2', {
          'grid-cols-1': images.length === 1,
          'grid-cols-2': images.length === 2,
          'grid-rows-[2fr_1fr] grid-cols-2': images.length === 3,
          'grid-cols-2 grid-rows-2': images.length >= 4
        })}
      >
        {images.slice(0, 4).map((img, index) => (
          <div
            key={index}
            className={cn(
              'relative group aspect-[4/3] rounded-lg overflow-hidden bg-muted hover:opacity-90 transition-opacity cursor-pointer',
              {
                'col-span-2': index === 0 && images.length === 3
              }
            )}
          >
            <Image src={img.url} alt={`Preview ${index + 1}`} className='size-full object-cover rounded-md' fill />
            {images.length > 4 && index + 1 === 4 && (
              <Button
                type='button'
                variant='outline'
                className='size-full absolute top-0 left-0 bg-transparent hover:bg-transparent z-10'
                onClick={() => setShowImageSlider(true)}
              >
                <span className='text-white text-xl'>+{images.length - 4}</span>
              </Button>
            )}
          </div>
        ))}
      </div>
      <ImageSlider
        showImageSlider={showImageSlider}
        setShowImageSlider={setShowImageSlider}
        preview={{ images: images.map((img) => ({ preview: img.url })) }}
      />
    </Fragment>
  )
}
