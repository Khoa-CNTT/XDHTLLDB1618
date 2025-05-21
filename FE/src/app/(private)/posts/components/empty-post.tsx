'use client'

import { useRouter } from 'next/navigation'
import path from '@/constants/path'
import { FileText, Plus } from 'lucide-react'
import { useTranslations } from 'next-intl'

import { Button } from '@/components/ui/button'

export default function EmptyPost() {
  const router = useRouter()
  const t = useTranslations('posts')
  return (
    <div className='flex flex-col items-center justify-center py-16 px-4'>
      <div className='p-6 rounded-full'>
        <FileText className='size-12 text-muted-foreground' />
      </div>
      <h3 className='text-xl font-semibold text-foreground mb-2'>{t('noPostsFound')}</h3>
      <p className='text-muted-foreground text-center max-w-md mb-6'>{t('noPostsDescription')}</p>
      <Button variant='default' onClick={() => router.push(path.schedules)}>
        <Plus className='size-4' />
        {t('createPost')}
      </Button>
    </div>
  )
}
