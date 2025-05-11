'use client'

import { Button } from '@/components/ui/button'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu'

export default function Export() {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant='default'>Export</Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        <DropdownMenuItem onClick={() => window.open('/api/statistical/export', '_blank')}>
          Export as CSV
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => window.open('/api/statistical/export-pdf', '_blank')}>
          Export as PDF
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
