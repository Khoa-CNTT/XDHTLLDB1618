'use client'

import { Fragment } from 'react'
import { useTranslations } from 'next-intl'

import { useBreadcrumbs } from '@/hooks/use-breadcrumbs'
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator
} from '@/components/ui/breadcrumb'

export function BreadcrumbMolecules() {
  const t = useTranslations('sidebar')

  const breadcrumbs = useBreadcrumbs()

  if (!breadcrumbs || breadcrumbs.length === 0) return null
  return (
    <Breadcrumb>
      <BreadcrumbList className='flex-nowrap'>
        {breadcrumbs.map((breadcrumb, index) => {
          const lastBreadcrumbIndex = breadcrumbs.length - 1

          return (
            <Fragment key={breadcrumb.title}>
              {index !== lastBreadcrumbIndex && breadcrumb.link && (
                <BreadcrumbItem className='hidden md:block'>
                  <BreadcrumbLink href={breadcrumb.link} className='text-nowrap'>
                    {t(breadcrumb.title.toLocaleLowerCase())}
                  </BreadcrumbLink>
                </BreadcrumbItem>
              )}
              {index < lastBreadcrumbIndex && <BreadcrumbSeparator className='hidden md:block' />}
              {index === lastBreadcrumbIndex && (
                <BreadcrumbPage> {t(breadcrumb.title.toLocaleLowerCase())}</BreadcrumbPage>
              )}
            </Fragment>
          )
        })}
      </BreadcrumbList>
    </Breadcrumb>
  )
}
