import { cookies } from 'next/headers'
import Link from 'next/link'
import statisticalApi from '@/apis/statistical.api'
import { Platform } from '@/constants/credentials'
import path from '@/constants/path'
import { getIconPlatform, toCapitalize } from '@/utils/utils'
import { format } from 'date-fns'
import { ArrowDownRight, ArrowUpRight, BarChartIcon, Calendar, ChevronDown, FileText, Users } from 'lucide-react'
import { getTranslations } from 'next-intl/server'
import { IconType } from 'react-icons'
import { FaFacebook, FaInstagram } from 'react-icons/fa'
import { FaThreads } from 'react-icons/fa6'
import { RiTwitterXLine } from 'react-icons/ri'

import { Post } from '@/types/post'
import { cn } from '@/lib/utils'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Separator } from '@/components/ui/separator'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'

import { BestPostingTimesChart } from './components/best-posting-times-chart'
import { EngagementMetricsChart } from './components/engagement-metrics-chart'
import Export from './components/export'
import { PlatformDistributionChart } from './components/platform-distribution-chart'
import { PostStatusChart } from './components/post-status-chart'

const platformColors: Record<string, string> = {
  facebook: 'bg-gradient-to-r from-[#00c6ff] to-[#0072ff]',
  x: 'bg-gradient-to-r from-[#1DA1F2] to-[#009ffc]',
  threads: 'bg-gradient-to-r from-black via-gray-800 to-white',
  instagram: 'bg-gradient-to-r from-[#833ab4] via-[#fd1d1d] to-[#fcb045]',
  reddit: 'bg-gradient-to-r from-[#ff4500] to-[#ffa500]'
}

export default async function DashboardPage() {
  const cookieStores = await cookies()
  const accessToken = cookieStores.get('accessToken')?.value ?? ''
  const statisticalData = await statisticalApi.getStatisticalServer(accessToken)
  const t = await getTranslations('dashboard')

  const recentPosts = statisticalData.data.data.recentPosts

  return (
    <main className='p-6'>
      <div className='flex justify-between items-center mb-6'>
        <h1 className='text-2xl font-bold'>{t('title')}</h1>

        <div className='flex items-center gap-2'>
          {/* <Select value='last-7-days'>
            <SelectTrigger className='w-[180px] border-foreground'>
              <SelectValue placeholder='Select date range' />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value='today'>{t('today')}</SelectItem>
              <SelectItem value='yesterday'>{t('yesterday')}</SelectItem>
              <SelectItem value='last-7-days'>{t('last7Days')}</SelectItem>
              <SelectItem value='last-30-days'>{t('last30Days')}</SelectItem>
              <SelectItem value='this-month'>{t('thisMonth')}</SelectItem>
              <SelectItem value='last-month'>{t('lastMonth')}</SelectItem>
            </SelectContent>
          </Select> */}

          <Export />
        </div>
      </div>

      {/* Stats Overview */}
      <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6'>
        <Card className='border-primary dark:border-primary/20 bg-muted/10'>
          <CardHeader className='pb-2'>
            <CardTitle className='text-sm font-medium '>{t('totalPosts')}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className='flex justify-between items-end'>
              <div>
                <div className='text-2xl font-bold'>{statisticalData.data.data.overallMetrics.totalPosts}</div>
                <div className='text-xs text-green-500'>{t('acrossAllPlatforms')}</div>
              </div>
              <FileText className='size-6' />
            </div>
          </CardContent>
        </Card>

        <Card className='border-primary dark:border-primary/20 bg-muted/10'>
          <CardHeader className='pb-2'>
            <CardTitle className='text-sm font-medium'>{t('totalEngagements')}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className='flex justify-between items-end'>
              <div>
                <div className='text-2xl font-bold'>{statisticalData.data.data.overallMetrics.totalEngagements}</div>
                <div className='text-xs text-green-500'>{t('likesShareComments')}</div>
              </div>
              <Users className='size-6' />
            </div>
          </CardContent>
        </Card>

        <Card className='border-primary dark:border-primary/20 bg-muted/10'>
          <CardHeader className='pb-2'>
            <CardTitle className='text-sm font-medium '>{t('scheduledPosts')}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className='flex justify-between items-end'>
              <div>
                <div className='text-2xl font-bold'>{statisticalData.data.data.overallMetrics.scheduledPosts}</div>
                <div className='text-xs text-green-500'>{t('pendingToPublish')}</div>
              </div>
              <Calendar className='size-6' />
            </div>
          </CardContent>
        </Card>

        <Card className='border-primary dark:border-primary/20 bg-muted/10'>
          <CardHeader className='pb-2'>
            <CardTitle className='text-sm font-medium '>{t('avgReach')}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className='flex justify-between items-end'>
              <div>
                <div className='text-2xl font-bold'>{statisticalData.data.data.overallMetrics.averageReach}</div>
                <div className='text-xs text-green-500'>{t('viewsPerPost')}</div>
              </div>
              <BarChartIcon className='size-6' />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Charts */}
      <div className='grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6'>
        <Card className='border-primary dark:border-primary/20 bg-muted/10'>
          <CardHeader>
            <CardTitle>{t('metricsChartTitle')}</CardTitle>
            <CardDescription className=''>{t('metricsChartDescription')}</CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue='facebook'>
              <TabsList className='w-full'>
                <TabsTrigger value='facebook' className='flex-1'>
                  Facebook
                </TabsTrigger>
                <TabsTrigger value='instagram' className='flex-1'>
                  Instagram
                </TabsTrigger>
                <TabsTrigger value='x' className='flex-1'>
                  X
                </TabsTrigger>
                <TabsTrigger value='threads' className='flex-1'>
                  Threads
                </TabsTrigger>
                {/* <TabsTrigger value='reddit' className='flex-1'>
                  Reddit
                </TabsTrigger> */}
              </TabsList>
              <TabsContent value='facebook'>
                <EngagementMetricsChart
                  platform={Platform.FACEBOOK}
                  data={statisticalData.data.data.engagementData.facebookEngagementData}
                />
              </TabsContent>
              <TabsContent value='instagram'>
                <EngagementMetricsChart
                  platform={Platform.INSTAGRAM}
                  data={statisticalData.data.data.engagementData.instagramEngagementData}
                />
              </TabsContent>
              <TabsContent value='x'>
                <EngagementMetricsChart
                  platform={Platform.X}
                  data={statisticalData.data.data.engagementData.xEngagementData}
                />
              </TabsContent>
              <TabsContent value='threads'>
                <EngagementMetricsChart
                  platform={Platform.THREADS}
                  data={statisticalData.data.data.engagementData.threadsEngagementData}
                />
              </TabsContent>
              {/* <TabsContent value='reddit'>
                <EngagementMetricsChart
                  platform={Platform.REDDIT}
                  data={statisticalData.data.data.engagementData.redditEngagementData}
                />
              </TabsContent> */}
            </Tabs>
          </CardContent>
        </Card>

        <Card className='border-primary dark:border-primary/20 bg-muted/10 flex flex-col'>
          <CardHeader>
            <CardTitle>{t('distributionChartTitle')}</CardTitle>
            <CardDescription className=''>{t('distributionChartDescription')}</CardDescription>
          </CardHeader>
          <CardContent className='flex-1'>
            <PlatformDistributionChart data={statisticalData.data.data.postsByPlatform} />
          </CardContent>
        </Card>
      </div>

      {/* Platform Performance */}
      <Card className='border-primary dark:border-primary/20 bg-muted/10 mb-6'>
        <CardHeader>
          <CardTitle>{t('performanceChartTitle')}</CardTitle>
          <CardDescription className=''>{t('performanceChartDescription')}</CardDescription>
        </CardHeader>
        <CardContent className='space-y-6'>
          <PostStatusChart data={statisticalData.data.data.postByStatusResult} />
          <Separator />
          <div className='space-y-4'>
            {Object.entries(statisticalData.data.data.postsByPlatform).map(([platform, count]) => {
              if (platform === 'reddit') {
                return null
              }
              const PlatformIcon = getIconPlatform(platform) as IconType
              const totalPosts = statisticalData.data.data.overallMetrics.totalPosts || 1
              const percentage = (count / totalPosts) * 100

              return (
                <div key={platform} className='flex items-center'>
                  <div
                    className={cn(
                      'size-10 rounded-full flex items-center justify-center mr-4',
                      platformColors[platform as keyof typeof platformColors]
                    )}
                  >
                    <PlatformIcon className='size-5 text-white' />
                  </div>
                  <div className='flex-1'>
                    <div className='flex justify-between mb-1'>
                      <span className='font-medium'>{platform}</span>
                      <span>{percentage.toFixed(2)}%</span>
                    </div>
                    <div className='w-full bg-gray-800 rounded-full h-2'>
                      <div
                        className={cn('h-2 rounded-full', platformColors[platform as keyof typeof platformColors])}
                        style={{ width: `${percentage.toFixed(2)}%` }}
                      ></div>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        </CardContent>
      </Card>

      {/* Best Posting Times */}
      <Card className='border-primary dark:border-primary/20 bg-muted/10 mb-6'>
        <CardHeader>
          <CardTitle>{t('bestPostingTimesTitle')}</CardTitle>
          <CardDescription className=''>{t('bestPostingTimesDescription')}</CardDescription>
        </CardHeader>
        <CardContent>
          <BestPostingTimesChart data={statisticalData.data.data.postsByTimeRange} />
        </CardContent>
      </Card>

      {/* Recent Posts */}
      <Card className='border-primary dark:border-primary/20 bg-muted/10'>
        <CardHeader>
          <div className='flex justify-between items-center'>
            <CardTitle>{t('recentPostsTitle')}</CardTitle>
            {recentPosts.length > 0 && <Button variant='default'>{t('viewAll')}</Button>}
          </div>
        </CardHeader>
        <CardContent>
          {recentPosts.length > 0 && (
            <div className='space-y-4'>
              {recentPosts.map((post: Post) => {
                const PlatformIcon = getIconPlatform(post.platform) as IconType
                const postLink = `${path.posts}/${post.platform}/${post.id}`
                const CardElement = post.status === 'active' ? 'div' : Link
                return (
                  <CardElement
                    key={post.id}
                    href={postLink}
                    className={cn('flex items-center p-3 rounded-lg bg-muted/50 relative overflow-hidden group', {
                      'before:absolute before:inset-0 before:bg-gradient-to-r before:from-[#833ab4] before:via-[#fd1d1d] before:to-[#fcb045] before:opacity-0 before:transition-opacity before:duration-300 before:ease-in-out hover:before:opacity-100':
                        post.platform === 'instagram',
                      'before:absolute before:inset-0 before:bg-gradient-to-r before:from-[#00c6ff] before:to-[#0072ff] before:opacity-0 before:transition-opacity before:duration-300 before:ease-in-out hover:before:opacity-100':
                        post.platform === 'facebook',
                      'before:absolute before:inset-0 before:bg-gradient-to-r before:from-[#1DA1F2] before:to-[#009ffc] before:opacity-0 before:transition-opacity before:duration-300 before:ease-in-out hover:before:opacity-100':
                        post.platform === 'x',
                      'before:absolute before:inset-0 before:bg-gradient-to-r before:from-black before:via-gray-800 before:to-white before:opacity-0 before:transition-opacity before:duration-300 before:ease-in-out hover:before:opacity-100':
                        post.platform === 'threads',
                      'before:absolute before:inset-0 before:bg-gradient-to-r before:from-[#ff4500] before:to-[#ffa500] before:opacity-0 before:transition-opacity before:duration-300 before:ease-in-out hover:before:opacity-100':
                        post.platform === 'reddit'
                    })}
                  >
                    <div className='mr-4 flex shrink-0 relative z-10'>
                      <Avatar
                        className={cn('border-2', {
                          'border-info': post.status === 'scheduled' || post.status === 'pending',
                          'border-success': post.status === 'published',
                          'border-destructive': post.status === 'failed'
                        })}
                      >
                        <AvatarFallback className={platformColors[post.platform]}>
                          {post.socialCredential.metadata.name.charAt(0)}
                        </AvatarFallback>
                        <AvatarImage
                          src={post.socialCredential.metadata.avatar_url || ''}
                          alt={post.socialCredential.metadata.name}
                        />
                      </Avatar>
                    </div>
                    <div className='flex-1 min-w-0 flex flex-col relative z-10'>
                      <div className='text-sm font-medium line-clamp-1 flex items-center gap-1'>
                        {post.socialCredential.metadata.name} <PlatformIcon className='size-4' />
                      </div>
                      <p className='text-xs line-clamp-2 text-muted-foreground'>{post.metadata.content}</p>
                    </div>
                    <div className='ml-4 flex items-end gap-2 justify-between flex-col shrink-0 relative z-10'>
                      <Badge
                        variant={
                          post.status === 'scheduled' || post.status === 'pending'
                            ? 'info'
                            : post.status === 'published'
                              ? 'success'
                              : post.status === 'active'
                                ? 'active'
                                : 'destructive'
                        }
                      >
                        {toCapitalize(post.status)}
                      </Badge>
                      <p className='text-xs'>{format(new Date(post.publicationTime), 'dd/MM/yyyy HH:mm')}</p>
                    </div>
                  </CardElement>
                )
              })}
            </div>
          )}
          {recentPosts.length === 0 && (
            <div className='flex items-center justify-center h-full'>
              <p className='text-sm text-muted-foreground'>No data available</p>
            </div>
          )}
        </CardContent>
      </Card>
    </main>
  )
}
