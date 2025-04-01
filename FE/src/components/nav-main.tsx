'use client'

import Link from 'next/link'
import { ChevronRight, type LucideIcon } from 'lucide-react'
import { useTranslations } from 'next-intl'
import { type IconType } from 'react-icons'

import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible'
import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem
} from '@/components/ui/sidebar'

export function NavMain({
  items
}: {
  items: {
    title: string
    url: string
    icon?: LucideIcon | IconType
    isActive?: boolean
    items?: {
      title: string
      url: string
      icon?: LucideIcon | IconType
    }[]
  }[]
}) {
  const t = useTranslations('sidebar')
  return (
    <SidebarGroup>
      <SidebarGroupLabel>{t('platform')}</SidebarGroupLabel>
      <SidebarMenu>
        {items.map((item) =>
          item.items ? (
            <Collapsible key={item.title} asChild defaultOpen={item.isActive} className='group/collapsible'>
              <SidebarMenuItem>
                <CollapsibleTrigger asChild>
                  <SidebarMenuButton tooltip={item.title}>
                    {item.icon && <item.icon />}
                    <span>{t(item.title)}</span>
                    {item.items && (
                      <ChevronRight className='ml-auto transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90' />
                    )}
                  </SidebarMenuButton>
                </CollapsibleTrigger>
                <CollapsibleContent>
                  <SidebarMenuSub>
                    {item.items?.map((subItem) => (
                      <SidebarMenuSubItem key={subItem.title}>
                        <SidebarMenuSubButton asChild>
                          <Link href={subItem.url}>
                            {subItem.icon && <subItem.icon />}
                            <span>{subItem.title}</span>
                          </Link>
                        </SidebarMenuSubButton>
                      </SidebarMenuSubItem>
                    ))}
                  </SidebarMenuSub>
                </CollapsibleContent>
              </SidebarMenuItem>
            </Collapsible>
          ) : (
            <SidebarMenuItem key={item.title}>
              <Link href={item.url}>
                <SidebarMenuButton tooltip={item.title}>
                  {item.icon && <item.icon />}
                  <span>{t(item.title)}</span>
                </SidebarMenuButton>
              </Link>
            </SidebarMenuItem>
          )
        )}
      </SidebarMenu>
    </SidebarGroup>
  )
}
