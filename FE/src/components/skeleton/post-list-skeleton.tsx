import { DEFAULT_NUMBER_OF_SKELETON } from '@/constants'

import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area'
import { Skeleton } from '@/components/ui/skeleton'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'

export default function PostListSkeleton() {
  return (
    <Skeleton className='bg-background space-y-8 '>
      {Array(DEFAULT_NUMBER_OF_SKELETON - 1)
        .fill(0)
        .map((_, index) => (
          <div className='space-y-4' key={index}>
            <h2 className='bg-muted w-72 h-6 rounded-md'></h2>
            <ScrollArea className='rounded-md border'>
              <Table className='overflow-hidden relative table-fixed'>
                <TableHeader>
                  <TableRow>
                    <TableHead className='w-[250px] whitespace-nowrap'>
                      <p className='bg-muted w-10 h-4 rounded-md'></p>
                    </TableHead>
                    <TableHead className='w-[100px] whitespace-nowrap'>
                      <p className='bg-muted w-10 h-4 rounded-md'></p>
                    </TableHead>
                    <TableHead className='w-[200px] whitespace-nowrap'>
                      <p className='bg-muted w-12 h-4 rounded-md'></p>
                    </TableHead>
                    <TableHead className='w-[150px] whitespace-nowrap'>
                      <p className='bg-muted w-24 h-4 rounded-md'></p>
                    </TableHead>

                    <TableHead className='w-[100px] whitespace-nowrap'>
                      <p className='bg-muted w-16 h-4 ml-auto rounded-md'></p>
                    </TableHead>
                  </TableRow>
                </TableHeader>

                <TableBody>
                  {Array(DEFAULT_NUMBER_OF_SKELETON)
                    .fill(0)
                    .map((_, index) => (
                      <TableRow key={index}>
                        <TableCell>
                          <div className='space-y-2'>
                            <h3 className='font-medium h-5 bg-muted w-10 rounded-md'></h3>
                            <p className='text-sm bg-muted line-clamp-1 h-5 w-full rounded-md'></p>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className='h-5 bg-muted w-16 rounded-md'></div>
                        </TableCell>
                        <TableCell>
                          <div className='flex items-center space-x-2'>
                            <div className='size-8 bg-muted rounded-full'></div>
                            <p className='bg-muted w-20 h-5 rounded-md'></p>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className='flex items-center space-x-2'>
                            <div className='size-5 rounded-full bg-muted'></div>
                            <p className='bg-muted w-16 h-5 rounded-md'></p>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className='size-8 bg-muted rounded-md ml-auto'></div>
                        </TableCell>
                      </TableRow>
                    ))}
                </TableBody>
              </Table>
              <ScrollBar orientation='horizontal' />
            </ScrollArea>
          </div>
        ))}
    </Skeleton>
  )
}
