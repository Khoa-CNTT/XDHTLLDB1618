import SidebarProvider from '@/providers/sidebar-provider'

export default function PrivateLayout({ children }: { children: React.ReactNode }) {
  return <SidebarProvider>{children}</SidebarProvider>
}
