'use client'

import { useMemo } from 'react'
import { usePathname } from 'next/navigation'

function formatBaseTitle(base: string): string {
  return base
    .split('-')
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ')
}

export function useBreadcrumbs() {
  const pathname = usePathname()

  const breadcrumbs = useMemo(() => {
    const segments = pathname?.split('/').filter(Boolean)

    return segments?.map((segment, index) => {
      const path = `/${segments?.slice(0, index + 1).join('/')}`
      return {
        title: formatBaseTitle(segment),
        link: path
      }
    })
  }, [pathname])

  return breadcrumbs
}
