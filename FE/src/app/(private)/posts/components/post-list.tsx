'use client'

import { Fragment, use, useEffect, useState } from 'react'
import Link from 'next/link'
import postApi from '@/apis/posts.api'
import { PLATFORM_TYPE } from '@/constants'
import { FADE_IN_ANIMATION, FADE_IN_STAGGER_ANIMATION, fadeInChildVariants } from '@/constants/effects'
import { POST_STATUS, PostStatus, PostType } from '@/constants/post'
import { useAppContext } from '@/contexts/app-context'
import { useDeletePostMutation } from '@/queries/post'
import { useDeleteRecurringInstanceMutation, useDeleteRecurringMutation } from '@/queries/recurring'
import { useQueryClient } from '@tanstack/react-query'
import { format } from 'date-fns'
import { enUS, vi } from 'date-fns/locale'
import { Clock, Loader2, MoreVertical, Trash2 } from 'lucide-react'
import moment from 'moment'
import { useLocale, useTranslations } from 'next-intl'

import { Post } from '@/types/post'
import { SuccessResponse } from '@/types/utils'
import { handleErrorApi } from '@/lib/utils'
import { toast } from '@/hooks/use-toast'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger
} from '@/components/ui/alert-dialog'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { Button, buttonVariants } from '@/components/ui/button'
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

import EmptyPost from './empty-post'

export function PostList({
  status,
  posts,
  platform
}: {
  status: PostStatus
  posts: Post[]
  platform: (typeof PLATFORM_TYPE)[keyof typeof PLATFORM_TYPE]
}) {
  const t = useTranslations('posts')

  const filteredPosts = posts?.filter((post) => post.status === status)

  const deletePostMutation = useDeletePostMutation()
  const deleteRecurringInstanceMutation = useDeleteRecurringInstanceMutation()
  const deleteRecurringMutation = useDeleteRecurringMutation()

  const queryClient = useQueryClient()
  const [isModalOpen, setIsModalOpen] = useState(false)

  const handleDeletePost = async (post: Post) => {
    if (deletePostMutation.isPending) return
    try {
      await deletePostMutation.mutateAsync(post.id)
      toast({
        title: t('success'),
        description: t('deletePostSuccess')
      })
      setIsModalOpen(false)
      queryClient.invalidateQueries({ queryKey: ['posts', platform] })
      setTimeout(() => {
        document.body.style.pointerEvents = 'auto'
      }, 0)
    } catch (error) {
      handleErrorApi({ error })
    }
  }

  const handleDeleteRecurringInstance = async (post: Post) => {
    if (deleteRecurringInstanceMutation.isPending) return
    try {
      if (post.status === POST_STATUS.SCHEDULED) {
        await deletePostMutation.mutateAsync(post.id)
      } else {
        await deleteRecurringInstanceMutation.mutateAsync({
          id: post.recurringPostId as string,
          publicationTime: post.publicationTime
        })
      }
      toast({
        title: t('success'),
        description: t('deletePostSuccess')
      })
      setIsModalOpen(false)
      queryClient.invalidateQueries({ queryKey: ['posts', platform] })
      setTimeout(() => {
        document.body.style.pointerEvents = 'auto'
      }, 0)
    } catch (error) {
      handleErrorApi({ error })
    }
  }

  const handleDeleteRecurring = async (post: Post) => {
    if (deleteRecurringMutation.isPending) return
    try {
      await deleteRecurringMutation.mutateAsync(post.recurringPostId as string)
      toast({
        title: t('success'),
        description: t('deleteRecurringSuccess')
      })
      setIsModalOpen(false)
      queryClient.invalidateQueries({ queryKey: ['posts', platform] })
      setTimeout(() => {
        document.body.style.pointerEvents = 'auto'
      }, 0)
    } catch (error) {
      handleErrorApi({ error })
    }
  }

  // Group posts by date
  const groupedPosts = filteredPosts?.reduce(
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

  const locale = useLocale()

  const dateFnsLocale = locale === 'vi' ? vi : enUS

  return (
    <div className='space-y-8'>
      {groupedPosts &&
        Object.entries(groupedPosts).map(([date, datePosts]) => (
          <ElementEffect key={date} animationProps={FADE_IN_ANIMATION}>
            <div className='space-y-4'>
              <h2 className='text-2xl font-semibold sticky top-0 bg-background/95 backdrop-blur py-2 z-10 w-max'>
                {format(new Date(date), 'EEEE, MMMM d yyyy', {
                  locale: dateFnsLocale
                })}
              </h2>
              <ScrollArea className='rounded-md border'>
                <Table className='overflow-hidden relative table-fixed'>
                  <TableHeader>
                    <TableRow>
                      <TableHead className='w-[250px] whitespace-nowrap'>{t('post')}</TableHead>
                      <TableHead className='w-[100px] whitespace-nowrap'>{t('type')}</TableHead>
                      <TableHead className='w-[200px] whitespace-nowrap'>{t('author')}</TableHead>
                      <TableHead className='w-[150px] whitespace-nowrap'>{t('scheduledTime')}</TableHead>
                      <TableHead className='w-[100px] text-right whitespace-nowrap'>{t('actions')}</TableHead>
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
                              <DropdownMenuLabel>{t('actions')}</DropdownMenuLabel>
                              {post.status === POST_STATUS.PUBLISHED && (
                                <DropdownMenuItem>
                                  <Link href={`/posts/${post.platform}/${post.id}`}>{t('viewDetails')}</Link>
                                </DropdownMenuItem>
                              )}

                              {post.status !== POST_STATUS.PUBLISHED && (
                                <>
                                  <DropdownMenuItem>
                                    <Link href={`/schedules`}>{t('post')}</Link>
                                  </DropdownMenuItem>
                                  <DropdownMenuSeparator />

                                  <DropdownMenuItem asChild>
                                    <AlertDialog open={isModalOpen} onOpenChange={setIsModalOpen}>
                                      <AlertDialogTrigger asChild>
                                        <Button
                                          size='sm'
                                          variant='ghost'
                                          className='w-full flex items-center justify-start gap-2 px-2 py-1.5 text-sm text-red-500 hover:text-red-500'
                                        >
                                          <Trash2 className='size-4' />
                                          {t('delete')}
                                        </Button>
                                      </AlertDialogTrigger>
                                      <AlertDialogContent>
                                        <AlertDialogHeader>
                                          <AlertDialogTitle>{t('confirmTitle')}</AlertDialogTitle>
                                          <AlertDialogDescription>{t('confirmDescription')}</AlertDialogDescription>
                                        </AlertDialogHeader>
                                        <AlertDialogFooter>
                                          <AlertDialogCancel>{t('cancel')}</AlertDialogCancel>
                                          {post.recurringPostId ? (
                                            <>
                                              <AlertDialogAction
                                                disabled={
                                                  post.status === POST_STATUS.SCHEDULED
                                                    ? deletePostMutation.isPending
                                                    : deleteRecurringInstanceMutation.isPending
                                                }
                                                className={buttonVariants({ variant: 'destructive' })}
                                                onClick={(e) => {
                                                  e.preventDefault()
                                                  handleDeleteRecurringInstance(post)
                                                }}
                                              >
                                                {post.status === POST_STATUS.SCHEDULED
                                                  ? t('continue')
                                                  : t('deleteSingle')}
                                                {(post.status === POST_STATUS.SCHEDULED
                                                  ? deletePostMutation.isPending
                                                  : deleteRecurringInstanceMutation.isPending) && (
                                                  <Loader2 className='size-4 animate-spin ml-2' />
                                                )}
                                              </AlertDialogAction>
                                              {post.status === POST_STATUS.ACTIVE && (
                                                <AlertDialogAction
                                                  disabled={deleteRecurringMutation.isPending}
                                                  className={buttonVariants({ variant: 'destructive' })}
                                                  onClick={(e) => {
                                                    e.preventDefault()
                                                    handleDeleteRecurring(post)
                                                  }}
                                                >
                                                  {t('deleteAll')}
                                                  {deleteRecurringMutation.isPending && (
                                                    <Loader2 className='size-4 animate-spin ml-2' />
                                                  )}
                                                </AlertDialogAction>
                                              )}
                                            </>
                                          ) : (
                                            <AlertDialogAction
                                              disabled={deletePostMutation.isPending}
                                              className={buttonVariants({ variant: 'destructive' })}
                                              onClick={(e) => {
                                                e.preventDefault()
                                                handleDeletePost(post)
                                              }}
                                            >
                                              {t('continue')}
                                              {deletePostMutation.isPending && (
                                                <Loader2 className='size-4 animate-spin ml-2' />
                                              )}
                                            </AlertDialogAction>
                                          )}
                                        </AlertDialogFooter>
                                      </AlertDialogContent>
                                    </AlertDialog>
                                  </DropdownMenuItem>
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
          <EmptyPost />
        </div>
      )}
    </div>
  )
}
