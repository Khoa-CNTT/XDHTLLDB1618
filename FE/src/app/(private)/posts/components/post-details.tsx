/* eslint-disable @typescript-eslint/no-explicit-any */
'use client'

import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { Platform } from '@/constants/credentials'
import { FADE_IN_ANIMATION } from '@/constants/effects'
import { dummyComments } from '@/data/post.dummy'
import { toCapitalize } from '@/utils/utils'
import { format } from 'date-fns'
import { ArrowLeft, Calendar, Clock, MessageCircle, Share2, ThumbsUp, User } from 'lucide-react'
import { FaRetweet } from 'react-icons/fa'

import { Post } from '@/types/post'
import { cn } from '@/lib/utils'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import ElementEffect from '@/components/effects/element-effect'

import PostDetailsListImage from './post-details-list-image'

export interface PostDetailsProps {
  post: Post
}

const platformColors: Record<string, string> = {
  facebook: 'bg-gradient-to-r from-[#00c6ff] to-[#0072ff]',
  x: 'bg-gradient-to-r from-[#1DA1F2] to-[#009ffc]',
  threads: 'bg-gradient-to-r from-black via-gray-800 to-white',
  instagram: 'bg-gradient-to-r from-[#833ab4] via-[#fd1d1d] to-[#fcb045]',
  reddit: 'bg-gradient-to-r from-[#ff4500] to-[#ffa500]'
}

const renderComment = (post: Post) => {
  const comments = post?.publishedPost?.metadata?.comments?.data || post?.publishedPost?.metadata?.comments || []
  return (
    comments.length > 0 && (
      <ElementEffect animationProps={FADE_IN_ANIMATION}>
        <Card>
          <CardContent className='p-6'>
            <h2 className='text-xl font-semibold mb-4'>Comments</h2>

            <div className='space-y-6'>
              {comments?.map((comment: any, index: number) => (
                <div key={comment.id ?? index} className='flex gap-4'>
                  <Avatar className='size-10'>
                    <AvatarImage src={comment?.from?.picture?.data?.url ?? ''} />
                    <AvatarFallback className={cn('text-white', platformColors[post.platform])}>
                      {comment?.from?.name.charAt(0) || comment?.username?.charAt(0) || <User className='size-4' />}
                    </AvatarFallback>
                  </Avatar>
                  <div className='flex-1'>
                    <div className='flex items-center gap-2 mb-1'>
                      <span className='font-semibold'>
                        {comment?.from?.name || comment?.username || `${toCapitalize(post.platform)} user`}
                      </span>
                      <span className='text-sm text-muted-foreground'>
                        {format(comment?.created_time || comment?.timestamp || '', "MMM d, yyyy 'at' h:mm a")}
                      </span>
                    </div>
                    <p className='text-sm'>{comment?.message || comment?.text || ''}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </ElementEffect>
    )
  )
}

export default function PostDetails({ post }: PostDetailsProps) {
  const pathname = usePathname()
  const platform = pathname.split('/')[2]
  const router = useRouter()

  console.log(post)

  return (
    <div className='min-h-screen bg-muted'>
      <div className='container mx-auto py-8'>
        <div className='max-w-4xl mx-auto'>
          <ElementEffect animationProps={FADE_IN_ANIMATION}>
            <Button variant='default' className='mb-6' onClick={() => router.back()}>
              <ArrowLeft className='size-4' />
              Back
            </Button>
          </ElementEffect>

          <ElementEffect animationProps={FADE_IN_ANIMATION}>
            <Card className='overflow-hidden mb-8'>
              <div className='border-b bg-muted/10 p-6'>
                <div className='flex items-center justify-between flex-wrap gap-4'>
                  <div className='flex items-center gap-4'>
                    <Avatar className='size-12 border-2 border-primary/10'>
                      <AvatarImage src={post?.socialCredential?.metadata.avatar_url ?? ''} />
                      <AvatarFallback>{post?.socialCredential?.metadata.name ?? 'A'}</AvatarFallback>
                    </Avatar>
                    <div>
                      <h1 className='text-2xl font-bold'>{post?.socialCredential?.metadata.name}</h1>
                      <div className='flex items-center gap-2 mt-1'>
                        <Badge className={cn('text-white border-none', platformColors[platform])}>
                          {toCapitalize(platform)}
                        </Badge>
                        <Badge variant='default'>{toCapitalize(post?.metadata.type)}</Badge>
                        <Badge variant='outline' className='capitalize'>
                          {post?.status}
                        </Badge>
                      </div>
                    </div>
                  </div>
                  <div className='flex items-center gap-6 text-muted-foreground bg-background px-4 py-2 rounded-lg'>
                    <div className='flex items-center gap-2'>
                      <Calendar className='size-4' />
                      <span>{format(new Date(post?.publicationTime ?? ''), 'MMM d, yyyy')}</span>
                    </div>
                    <div className='flex items-center gap-2'>
                      <Clock className='size-4' />
                      <span>{format(new Date(post?.publicationTime ?? ''), 'h:mm a')}</span>
                    </div>
                  </div>
                </div>
              </div>

              <CardContent className='p-6'>
                <p className='text-lg leading-relaxed mb-8'>{post?.metadata?.content ?? ''}</p>

                <PostDetailsListImage images={post?.metadata?.assets ?? []} />

                {post?.publishedPost?.metadata?.likes?.length > 0 && (
                  <div className='pt-2 pb-1'>
                    <p className='text-xs flex gap-1 items-center'>
                      <ThumbsUp className='size-3' />
                      <span className='italic'>{post?.publishedPost?.metadata?.likes[0]?.name}</span>{' '}
                      {post?.publishedPost?.metadata?.likes?.length > 1 && 'and others'}
                    </p>
                  </div>
                )}

                <div className={cn('flex items-center gap-4 pt-2 border-t')}>
                  <Button variant='outline' className='flex-1'>
                    <ThumbsUp className='mr-2 size-4' />
                    Like
                    <Badge variant='default' className='ml-2 rounded-md'>
                      {post?.publishedPost?.metadata?.likes || post?.publishedPost?.metadata?.likes?.length || 0}
                    </Badge>
                  </Button>
                  <Button variant='outline' className='flex-1'>
                    <MessageCircle className='mr-2 size-4' />
                    Comment
                    <Badge variant='default' className='ml-2 rounded-md'>
                      {post?.publishedPost?.metadata?.comments || post?.publishedPost?.metadata?.comments?.length || 0}
                    </Badge>
                  </Button>
                  {post.platform !== Platform.X && (
                    <Button variant='outline' className='flex-1'>
                      <Share2 className='mr-2 size-4' />
                      Share
                      <Badge variant='default' className='ml-2 rounded-md'>
                        {post?.publishedPost?.metadata?.shares?.length ?? 0}
                      </Badge>
                    </Button>
                  )}
                  {post.platform === Platform.X && (
                    <Button variant='outline' className='flex-1'>
                      <FaRetweet className='mr-2 size-4' />
                      Retweet
                      <Badge variant='default' className='ml-2 rounded-md'>
                        {post?.publishedPost?.metadata?.retweets ?? 0}
                      </Badge>
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          </ElementEffect>

          {renderComment(post)}
        </div>
      </div>
    </div>
  )
}
