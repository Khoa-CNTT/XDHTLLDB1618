'use client'

import { useRouter } from 'next/navigation'
import path from '@/constants/path'
import { useAppContext, useAuthContext } from '@/contexts/app-context'
import { useAuthLogout } from '@/queries/auth'
import { useClerk, useUser } from '@clerk/nextjs'
import { AvatarFallback } from '@radix-ui/react-avatar'
import { BadgeCheck, ChevronsUpDown, CreditCard, LogOut, Sparkles } from 'lucide-react'

import { handleErrorApi } from '@/lib/utils'
import { useToast } from '@/hooks/use-toast'
import { Avatar, AvatarImage } from '@/components/ui/avatar'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu'
import { SidebarMenu, SidebarMenuButton, SidebarMenuItem, useSidebar } from '@/components/ui/sidebar'

export function NavUser() {
  const { isMobile } = useSidebar()
  const logoutMutation = useAuthLogout()
  const { toast, dismiss } = useToast()
  const { isLoaded, user } = useUser()
  const { signOut, openUserProfile } = useClerk()
  const router = useRouter()
  const { reset: resetAuthContext } = useAuthContext()
  const { reset: resetAppContext } = useAppContext()

  if (!isLoaded) return null
  if (!user?.id) return null

  const resetContext = () => {
    resetAuthContext()
    resetAppContext()
  }

  const handleLogout = async () => {
    if (logoutMutation.isPending) return

    try {
      const toastId = toast({
        title: 'Logging out...',
        description: 'Please wait while we log you out.'
      })
      await logoutMutation.mutateAsync()
      signOut(() => {
        dismiss(toastId.id)
        resetContext()
        router.push(path.login)
      })
    } catch (error) {
      handleErrorApi({ error })
    }
  }

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <SidebarMenuButton
              size='lg'
              className='data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground'
            >
              <Avatar className='size-8 rounded-full'>
                <AvatarImage src={user?.imageUrl} alt={user?.primaryEmailAddress?.emailAddress} />
                <AvatarFallback>{user?.firstName?.[0]}</AvatarFallback>
              </Avatar>
              <div className='grid flex-1 text-left text-sm leading-tight'>
                <span className='truncate font-semibold'>{user?.fullName}</span>
                <span className='truncate text-xs'>{user?.primaryEmailAddress?.emailAddress}</span>
              </div>
              <ChevronsUpDown className='ml-auto size-4' />
            </SidebarMenuButton>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            className='w-[--radix-dropdown-menu-trigger-width] min-w-56 rounded-lg'
            side={isMobile ? 'bottom' : 'right'}
            align='end'
            sideOffset={4}
          >
            <DropdownMenuLabel className='p-0 font-normal'>
              <div className='flex items-center gap-2 px-1 py-1.5 text-left text-sm'>
                <Avatar className='size-8 rounded-lg'>
                  <AvatarImage src={user?.imageUrl} alt={user?.primaryEmailAddress?.emailAddress} />
                  <AvatarFallback>{user?.firstName?.[0]}</AvatarFallback>
                </Avatar>
                <div className='grid flex-1 text-left text-sm leading-tight'>
                  <span className='truncate font-semibold'>{user?.fullName}</span>
                  <span className='truncate text-xs'>{user?.primaryEmailAddress?.emailAddress}</span>
                </div>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuGroup>
              <DropdownMenuItem>
                <Sparkles />
                Upgrade to Pro
              </DropdownMenuItem>
            </DropdownMenuGroup>
            <DropdownMenuSeparator />
            <DropdownMenuGroup>
              <DropdownMenuItem onClick={() => openUserProfile()}>
                <BadgeCheck />
                Account
              </DropdownMenuItem>
              <DropdownMenuItem>
                <CreditCard />
                Billing
              </DropdownMenuItem>
            </DropdownMenuGroup>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={handleLogout}>
              <LogOut />
              Log out
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarMenuItem>
    </SidebarMenu>
  )
}
