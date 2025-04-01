'use client'

import { useLocale, useTranslations } from 'next-intl'

import LocaleSwitcherSelect from '@/components/locale-switcher-select'

export default function LocaleSwitcher() {
  const t = useTranslations('common')
  const locale = useLocale()

  return (
    <LocaleSwitcherSelect
      defaultValue={locale}
      items={[
        {
          value: 'en',
          label: t('en')
        },
        {
          value: 'vi',
          label: t('vi')
        }
      ]}
      label={t('label')}
    />
  )
}
