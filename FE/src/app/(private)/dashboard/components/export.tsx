'use client'

import { useTranslations } from 'next-intl'

import { Button } from '@/components/ui/button'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu'

export default function Export() {
  const t = useTranslations('dashboard')
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant='default'>{t('export')}</Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        <DropdownMenuItem onClick={() => window.open('/api/statistical/export', '_blank')}>
          {t('exportCSV')}
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => window.open('/api/statistical/export-pdf', '_blank')}>
          {t('exportPDF')}
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
