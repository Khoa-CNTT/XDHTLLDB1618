import { useState } from 'react'
import Image from 'next/image'
import useEmblaCarousel from 'embla-carousel-react'
import { ChevronLeft, ChevronRight } from 'lucide-react'

import { ImagePreview } from '@/types/media'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'

export interface ImageSliderProps {
  showImageSlider: boolean
  setShowImageSlider: (show: boolean) => void
  preview: {
    description: string
    time: string
    images: ImagePreview[]
  }
}

export default function ImageSlider({ showImageSlider, setShowImageSlider, preview }: ImageSliderProps) {
  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: true })
  const [currentImageIndex, setCurrentImageIndex] = useState(0)

  return (
    <Dialog open={showImageSlider} onOpenChange={setShowImageSlider}>
      <DialogContent className='sm:max-w-[800px]'>
        <DialogHeader>
          <DialogTitle>Image Preview</DialogTitle>
        </DialogHeader>
        <div className='relative'>
          <div className='embla overflow-hidden' ref={emblaRef}>
            <div className='embla__container flex'>
              {preview.images.map((img, index) => (
                <div key={index} className='embla__slide flex-[0_0_100%]'>
                  <Image
                    src={img.preview}
                    alt={`Preview ${index + 1}`}
                    className='w-full h-[400px] object-contain'
                    width={400}
                    height={400}
                  />
                </div>
              ))}
            </div>
          </div>
          <Button
            variant='outline'
            size='icon'
            className='absolute left-2 top-1/2 -translate-y-1/2'
            onClick={() => {
              emblaApi?.scrollPrev()
              setCurrentImageIndex((prev) => (prev - 1 + preview.images.length) % preview.images.length)
            }}
          >
            <ChevronLeft className='size-4' />
          </Button>
          <Button
            variant='outline'
            size='icon'
            className='absolute right-2 top-1/2 -translate-y-1/2'
            onClick={() => {
              emblaApi?.scrollNext()
              setCurrentImageIndex((prev) => (prev + 1) % preview.images.length)
            }}
          >
            <ChevronRight className='size-4' />
          </Button>
        </div>
        <p className='text-center'>
          {currentImageIndex + 1} / {preview.images.length}
        </p>
      </DialogContent>
    </Dialog>
  )
}
