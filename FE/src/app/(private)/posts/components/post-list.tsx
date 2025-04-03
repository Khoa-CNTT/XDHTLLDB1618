'use client'

import { Fragment, use } from 'react'
import Link from 'next/link'
import { FADE_IN_ANIMATION, FADE_IN_STAGGER_ANIMATION, fadeInChildVariants } from '@/constants/effects'
import { POST_STATUS, PostStatus, PostType } from '@/constants/post'
import { format } from 'date-fns'
import { Clock, MoreVertical } from 'lucide-react'

import { Post } from '@/types/post'
import { SuccessResponse } from '@/types/utils'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu'
import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import ElementEffect from '@/components/effects/element-effect'
import ElementEffectStagger from '@/components/effects/element-effect-stagger'

export function PostList({
  status,
  postsPromise
}: {
  status: PostStatus
  postsPromise: Promise<SuccessResponse<Post[]>>
}) {
  const posts = use(postsPromise)
  const scheduledPosts = posts?.data.filter((post) => post.status === status)

  // Group posts by date
  const groupedPosts = scheduledPosts?.reduce(
    (groups, post) => {
      const date = format(post.publicationTime, 'yyyy-MM-dd')

      if (!groups[date]) {
        groups[date] = []
      }
      groups[date].push({
        ...post
      })
      return groups
    },
    {} as Record<string, Post[]>
  )

  return (
    <div className='space-y-8'>
      {groupedPosts &&
        Object.entries(groupedPosts).map(([date, datePosts]) => (
          <ElementEffect key={date} animationProps={FADE_IN_ANIMATION}>
            <div className='space-y-4'>
              <h2 className='text-2xl font-semibold sticky top-0 bg-background/95 backdrop-blur py-2 z-10 w-max'>
                {format(new Date(date), 'EEEE, MMMM d yyyy')}
              </h2>
              <ScrollArea className='rounded-md border'>
                <Table className='overflow-hidden relative table-fixed'>
                  <TableHeader>
                    <TableRow>
                      <TableHead className='w-[250px] whitespace-nowrap'>Post</TableHead>
                      <TableHead className='w-[100px] whitespace-nowrap'>Type</TableHead>
                      <TableHead className='w-[200px] whitespace-nowrap'>Author</TableHead>
                      <TableHead className='w-[150px] whitespace-nowrap'>Scheduled Time</TableHead>
                      <TableHead className='w-[100px] text-right whitespace-nowrap'>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <ElementEffectStagger
                    ElementType={TableBody}
                    ElementChildrenType={TableRow}
                    animationProps={FADE_IN_STAGGER_ANIMATION}
                    childVariants={fadeInChildVariants}
                  >
                    {datePosts.map((post) => (
                      <Fragment key={post.id}>
                        <TableCell>
                          <div>
                            <h3 className='font-medium'>{post?.metadata?.page_name}</h3>
                            <p className='text-sm text-muted-foreground line-clamp-1'>{post?.metadata?.content}</p>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge
                            variant={
                              post.metadata.type === PostType.POST
                                ? 'default'
                                : post.metadata.type === PostType.STORY
                                  ? 'secondary'
                                  : 'outline'
                            }
                            className='capitalize'
                          >
                            {post.metadata.type}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <div className='flex items-center space-x-2'>
                            <Avatar className='size-8'>
                              <AvatarImage src={post?.socialCredential.metadata.avatar_url} />
                              <AvatarFallback>{post?.socialCredential.metadata.name.charAt(0) ?? 'A'}</AvatarFallback>
                            </Avatar>
                            <span className='text-sm font-medium'>{post?.socialCredential.metadata.name}</span>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className='flex items-center space-x-2 text-sm'>
                            <Clock className='size-4 text-muted-foreground' />
                            <span>{format(post?.publicationTime ?? '', 'h:mm a')}</span>
                          </div>
                        </TableCell>
                        <TableCell className='text-right'>
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button className='size-8 p-0'>
                                <span className='sr-only'>Open menu</span>
                                <MoreVertical className='size-4' />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align='end'>
                              <DropdownMenuLabel>Actions</DropdownMenuLabel>
                              <DropdownMenuItem>
                                <Link href={`/posts/${post.platform}/${post.id}`}>View details</Link>
                              </DropdownMenuItem>
                              {post.status === POST_STATUS.SCHEDULED && (
                                <>
                                  <DropdownMenuItem>Edit post</DropdownMenuItem>
                                  <DropdownMenuSeparator />
                                  <DropdownMenuItem className='text-red-600'>Delete post</DropdownMenuItem>
                                </>
                              )}
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </TableCell>
                      </Fragment>
                    ))}
                  </ElementEffectStagger>
                </Table>
                <ScrollBar orientation='horizontal' />
              </ScrollArea>
            </div>
          </ElementEffect>
        ))}
      {groupedPosts && Object.keys(groupedPosts).length === 0 && (
        <div className='text-center py-12'>
          <p className='text-muted-foreground'>No posts found</p>
        </div>
      )}
    </div>
  )
}
