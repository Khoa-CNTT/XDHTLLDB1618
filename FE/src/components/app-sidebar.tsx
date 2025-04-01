'use client'

import { SIDE_BAR } from '@/constants'
import { useAppContext } from '@/contexts/app-context'
import { GalleryVerticalEnd, Plus } from 'lucide-react'
import { useTranslations } from 'next-intl'

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenuButton,
  SidebarRail,
  useSidebar
} from '@/components/ui/sidebar'

import { NavMain } from './nav-main'
import { NavUser } from './nav-user'

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const { open: sidebarOpen } = useSidebar()
  const { setOpenCreateScheduleModal } = useAppContext()
  const t = useTranslations('common')

  return (
    <Sidebar collapsible='icon' {...props}>
      <SidebarHeader>
        <div className='flex items-center gap-2'>
          <div className='flex aspect-square size-8 items-center justify-center rounded-lg bg-sidebar-primary text-sidebar-primary-foreground'>
            <GalleryVerticalEnd className='size-4' />
          </div>
          <div className='grid flex-1 text-left text-sm leading-tight'>
            <span className='truncate font-semibold'>POST PILOT</span>
            <span className='truncate text-xs'>Enterprise</span>
          </div>
        </div>
      </SidebarHeader>
      <SidebarContent>
        <div className='p-2'>
          <SidebarMenuButton
            tooltip='Create post'
            className='bg-primary text-primary-foreground hover:bg-primary/90 hover:text-primary-foreground/90 justify-center active:bg-primary/90 active:text-primary-foreground/90'
            onClick={() => setOpenCreateScheduleModal(true)}
          >
            {sidebarOpen && <span className='h-5'>{t('createPost')}</span>}
            <Plus />
          </SidebarMenuButton>
        </div>
        <NavMain items={SIDE_BAR.navMain} />
      </SidebarContent>
      <SidebarFooter>
        <NavUser />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  )
}
