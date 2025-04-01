'use client'

import Image from 'next/image'
import Autoplay from 'embla-carousel-autoplay'
import useEmblaCarousel from 'embla-carousel-react'

export default function Preview() {
  const [emblaRef] = useEmblaCarousel(
    {
      axis: 'x',
      loop: true,
      duration: 3000,
      breakpoints: {
        '(min-width: 1024px)': {
          axis: 'y',
          duration: 3000
        }
      }
    },
    [Autoplay({ playOnInit: true, delay: 0 })]
  )
  return (
    <div className='relative overflow-hidden'>
      <div className='embla overflow-hidden' ref={emblaRef}>
        <div className='embla__container flex lg:flex-col lg:max-h-[600px]'>
          <div className='embla__slide flex-[0_0_100%]'>
            <PreviewCard
              title='Multi-Platform Posting'
              description='Post to all your social networks'
              image='/preview1.jpg'
            />
          </div>
          <div className='embla__slide flex-[0_0_100%]'>
            <PreviewCard
              title='Multi-Platform Posting'
              description='Post to all your social networks'
              image='/preview2.jpg'
            />
          </div>
          <div className='embla__slide flex-[0_0_100%]'>
            <PreviewCard
              title='Multi-Platform Posting'
              description='Post to all your social networks'
              image='/preview3.jpg'
            />
          </div>
        </div>
      </div>
    </div>
  )
}

function PreviewCard({ title, description, image }: { title: string; description: string; image: string }) {
  return (
    <div className='bg-white/10 backdrop-blur-xl rounded-xl p-4 border border-white/20 mb-0 mr-10 lg:mb-10 lg:mr-0'>
      <div className='aspect-[2/1] relative rounded-lg overflow-hidden mb-4'>
        <Image src={image || '/placeholder.svg'} alt={title} fill className='object-cover' />
      </div>
      <h3 className='font-semibold text-lg'>{title}</h3>
      <p className='text-gray-400'>{description}</p>
    </div>
  )
}
