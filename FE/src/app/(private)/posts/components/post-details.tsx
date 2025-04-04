'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { FADE_IN_ANIMATION } from '@/constants/effects'
import { dummyComments } from '@/data/post.dummy'
import { toCapitalize } from '@/utils/utils'
import { format } from 'date-fns'
import { ArrowLeft, Calendar, Clock, MessageCircle, Share2, ThumbsUp } from 'lucide-react'

import { Post } from '@/types/post'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import ElementEffect from '@/components/effects/element-effect'

import PostDetailsListImage from './post-details-list-image'

export interface PostDetailsProps {
  post: Post
}

export default function PostDetails({ post }: PostDetailsProps) {
  const pathname = usePathname()
  const platform = pathname.split('/')[2]

  return (
    <div className='min-h-screen bg-muted'>
      <div className='container mx-auto py-8'>
        <div className='max-w-4xl mx-auto'>
          <ElementEffect animationProps={FADE_IN_ANIMATION}>
            <Link href={`/posts/${platform}`}>
              <Button variant='ghost' className='mb-6 -ml-4 text-muted-foreground'>
                <ArrowLeft className='mr-2 size-4' />
                Back to Posts
              </Button>
            </Link>
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

                <div className='flex items-center gap-4 pt-6 border-t'>
                  <Button variant='outline' className='flex-1'>
                    <ThumbsUp className='mr-2 size-4' />
                    Like
                  </Button>
                  <Button variant='outline' className='flex-1'>
                    <MessageCircle className='mr-2 size-4' />
                    Comment
                  </Button>
                  <Button variant='outline' className='flex-1'>
                    <Share2 className='mr-2 size-4' />
                    Share
                  </Button>
                </div>
              </CardContent>
            </Card>
          </ElementEffect>

          <ElementEffect animationProps={FADE_IN_ANIMATION}>
            <Card>
              <CardContent className='p-6'>
                <h2 className='text-xl font-semibold mb-4'>Comments</h2>

                <div className='space-y-6'>
                  {dummyComments.map((comment) => (
                    <div key={comment.id} className='flex gap-4'>
                      <Avatar className='size-10'>
                        <AvatarImage src={comment?.author?.image ?? ''} />
                        <AvatarFallback>{comment?.author?.name?.[0] ?? ''}</AvatarFallback>
                      </Avatar>
                      <div className='flex-1'>
                        <div className='flex items-center gap-2 mb-1'>
                          <span className='font-semibold'>{comment.author.name}</span>
                          <span className='text-sm text-muted-foreground'>
                            {format(comment?.createdAt ?? '', "MMM d, yyyy 'at' h:mm a")}
                          </span>
                        </div>
                        <p className='text-sm'>{comment?.content ?? ''}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </ElementEffect>
        </div>
      </div>
    </div>
  )
}
