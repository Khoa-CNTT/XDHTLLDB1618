import { Separator } from '@/components/ui/separator'
import { SidebarInset, SidebarProvider as SidebarProviderComponent, SidebarTrigger } from '@/components/ui/sidebar'
import { AppSidebar } from '@/components/app-sidebar'
import { BreadcrumbMolecules } from '@/components/breadcrumb-molecules'
import LocaleSwitcher from '@/components/locale-switcher'
import ThemeSwitch from '@/components/theme-switch'

export interface SidebarProviderProps {
  children: React.ReactNode
}

export default function SidebarProvider({ children }: SidebarProviderProps) {
  return (
    <SidebarProviderComponent>
      <AppSidebar />
      <SidebarInset className='overflow-auto'>
        <header className='flex justify-between pr-8 h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-[[data-collapsible=icon]]/sidebar-wrapper:h-12'>
          <div className='flex items-center gap-2 px-4'>
            <SidebarTrigger className='-ml-1' />
            <Separator orientation='vertical' className='mr-2 h-4' />
            <BreadcrumbMolecules />
          </div>
          <div className='flex items-center gap-2'>
            <ThemeSwitch />
            <LocaleSwitcher />
          </div>
        </header>
        {children}
      </SidebarInset>
    </SidebarProviderComponent>
  )
}
