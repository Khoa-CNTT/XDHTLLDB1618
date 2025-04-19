import { cookies } from 'next/headers'
import statisticalApi from '@/apis/statistical.api'
import { getIconPlatform, toCapitalize } from '@/utils/utils'
import { ArrowDownRight, ArrowUpRight, BarChartIcon, Calendar, ChevronDown, FileText, Users } from 'lucide-react'
import { IconType } from 'react-icons'
import { FaFacebook, FaInstagram } from 'react-icons/fa'
import { FaThreads } from 'react-icons/fa6'
import { RiTwitterXLine } from 'react-icons/ri'

import { Post } from '@/types/post'
import { cn } from '@/lib/utils'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'

import { BestPostingTimesChart } from './components/best-posting-times-chart'
import { PlatformDistributionChart } from './components/platform-distribution-chart'
import { PostPerformanceChart } from './components/post-performance-chart'

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

  const recentPosts = statisticalData.data.data.recentPosts

  return (
    <main className='p-6'>
      <div className='flex justify-between items-center mb-6'>
        <h1 className='text-2xl font-bold'>Analytics Dashboard</h1>

        <div className='flex items-center gap-2'>
          <Select value='last-7-days'>
            <SelectTrigger className='w-[180px] border-foreground'>
              <SelectValue placeholder='Select date range' />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value='today'>Today</SelectItem>
              <SelectItem value='yesterday'>Yesterday</SelectItem>
              <SelectItem value='last-7-days'>Last 7 days</SelectItem>
              <SelectItem value='last-30-days'>Last 30 days</SelectItem>
              <SelectItem value='this-month'>This month</SelectItem>
              <SelectItem value='last-month'>Last month</SelectItem>
            </SelectContent>
          </Select>

          <Button variant='default'>Export</Button>
        </div>
      </div>

      {/* Stats Overview */}
      <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6'>
        <Card className='border-primary dark:border-primary/20 bg-muted/10'>
          <CardHeader className='pb-2'>
            <CardTitle className='text-sm font-medium '>Total Posts</CardTitle>
          </CardHeader>
          <CardContent>
            <div className='flex justify-between items-end'>
              <div>
                <div className='text-2xl font-bold'>1,248</div>
                <div className='flex items-center text-xs text-green-500'>
                  <ArrowUpRight className='mr-1 size-3' />
                  <span>12% from last month</span>
                </div>
              </div>
              <FileText className='size-6' />
            </div>
          </CardContent>
        </Card>

        <Card className='border-primary dark:border-primary/20 bg-muted/10'>
          <CardHeader className='pb-2'>
            <CardTitle className='text-sm font-medium'>Engagement Rate</CardTitle>
          </CardHeader>
          <CardContent>
            <div className='flex justify-between items-end'>
              <div>
                <div className='text-2xl font-bold'>4.6%</div>
                <div className='flex items-center text-xs text-green-500'>
                  <ArrowUpRight className='mr-1 size-3' />
                  <span>2.1% from last month</span>
                </div>
              </div>
              <Users className='size-6' />
            </div>
          </CardContent>
        </Card>

        <Card className='border-primary dark:border-primary/20 bg-muted/10'>
          <CardHeader className='pb-2'>
            <CardTitle className='text-sm font-medium '>Scheduled Posts</CardTitle>
          </CardHeader>
          <CardContent>
            <div className='flex justify-between items-end'>
              <div>
                <div className='text-2xl font-bold'>87</div>
                <div className='flex items-center text-xs text-red-500'>
                  <ArrowDownRight className='mr-1 size-3' />
                  <span>5% from last month</span>
                </div>
              </div>
              <Calendar className='size-6' />
            </div>
          </CardContent>
        </Card>

        <Card className='border-primary dark:border-primary/20 bg-muted/10'>
          <CardHeader className='pb-2'>
            <CardTitle className='text-sm font-medium '>Avg. Reach</CardTitle>
          </CardHeader>
          <CardContent>
            <div className='flex justify-between items-end'>
              <div>
                <div className='text-2xl font-bold'>5.2K</div>
                <div className='flex items-center text-xs text-green-500'>
                  <ArrowUpRight className='mr-1 size-3' />
                  <span>18% from last month</span>
                </div>
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
            <CardTitle>Post Performance</CardTitle>
            <CardDescription className=''>Post engagement over time</CardDescription>
          </CardHeader>
          <CardContent>
            <PostPerformanceChart />
          </CardContent>
        </Card>

        <Card className='border-primary dark:border-primary/20 bg-muted/10'>
          <CardHeader>
            <CardTitle>Platform Distribution</CardTitle>
            <CardDescription className=''>Posts by social media platform</CardDescription>
          </CardHeader>
          <CardContent>
            <PlatformDistributionChart data={statisticalData.data.data.postsByPlatform} />
          </CardContent>
        </Card>
      </div>

      {/* Platform Performance */}
      <Card className='border-primary dark:border-primary/20 bg-muted/10 mb-6'>
        <CardHeader>
          <CardTitle>Platform Performance</CardTitle>
          <CardDescription className=''>Engagement metrics across different social media platforms</CardDescription>
        </CardHeader>
        <CardContent>
          <div className='space-y-4'>
            <div className='flex items-center'>
              <div
                className={cn('size-10 rounded-full flex items-center justify-center mr-4', platformColors.facebook)}
              >
                <FaFacebook className='size-5 text-white' />
              </div>
              <div className='flex-1'>
                <div className='flex justify-between mb-1'>
                  <span className='font-medium'>Facebook</span>
                  <span>78%</span>
                </div>
                <div className='w-full bg-gray-800 rounded-full h-2'>
                  <div className={cn('h-2 rounded-full', platformColors.facebook)} style={{ width: '78%' }}></div>
                </div>
              </div>
            </div>

            <div className='flex items-center'>
              <div
                className={cn('size-10 rounded-full flex items-center justify-center mr-4', platformColors.instagram)}
              >
                <FaInstagram className='size-5 text-white' />
              </div>
              <div className='flex-1'>
                <div className='flex justify-between mb-1'>
                  <span className='font-medium'>Instagram</span>
                  <span>92%</span>
                </div>
                <div className='w-full bg-gray-800 rounded-full h-2'>
                  <div className={cn('h-2 rounded-full', platformColors.instagram)} style={{ width: '92%' }}></div>
                </div>
              </div>
            </div>

            <div className='flex items-center'>
              <div className={cn('size-10 rounded-full flex items-center justify-center mr-4', platformColors.x)}>
                <RiTwitterXLine className='size-5 text-white' />
              </div>
              <div className='flex-1'>
                <div className='flex justify-between mb-1'>
                  <span className='font-medium'>X (Twitter)</span>
                  <span>64%</span>
                </div>
                <div className='w-full bg-gray-800 rounded-full h-2'>
                  <div className={cn('h-2 rounded-full', platformColors.x)} style={{ width: '64%' }}></div>
                </div>
              </div>
            </div>

            <div className='flex items-center'>
              <div className={cn('size-10 rounded-full flex items-center justify-center mr-4', platformColors.threads)}>
                <FaThreads className='size-5 text-white' />
              </div>
              <div className='flex-1'>
                <div className='flex justify-between mb-1'>
                  <span className='font-medium'>Threads</span>
                  <span>45%</span>
                </div>
                <div className='w-full bg-gray-800 rounded-full h-2'>
                  <div className={cn('h-2 rounded-full', platformColors.threads)} style={{ width: '45%' }}></div>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Best Posting Times */}
      <Card className='border-primary dark:border-primary/20 bg-muted/10 mb-6'>
        <CardHeader>
          <CardTitle>Best Posting Times</CardTitle>
          <CardDescription className=''>Engagement by time of day</CardDescription>
        </CardHeader>
        <CardContent>
          <BestPostingTimesChart data={statisticalData.data.data.postsByTimeRange} />
        </CardContent>
      </Card>

      {/* Recent Posts */}
      <Card className='border-primary dark:border-primary/20 bg-muted/10'>
        <CardHeader>
          <div className='flex justify-between items-center'>
            <CardTitle>Recent Posts</CardTitle>
            <Button variant='default'>View All</Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className='space-y-4'>
            {recentPosts.map((post: Post) => {
              const PlatformIcon = getIconPlatform(post.platform) as IconType
              return (
                <div key={post.id} className='flex items-center p-3 rounded-lg bg-muted/50'>
                  <div className='mr-4 flex shrink-0'>
                    <Avatar>
                      <AvatarFallback>
                        <PlatformIcon className='size-5 text-white' />
                      </AvatarFallback>
                    </Avatar>
                  </div>
                  <div className='flex-1 min-w-0'>
                    <p className='text-sm font-medium line-clamp-2'>{post.metadata.content}</p>
                  </div>
                  <div className='ml-4 flex items-end gap-2 justify-between flex-col shrink-0'>
                    <Badge variant={post.status === 'scheduled' ? 'secondary' : 'default'}>
                      {toCapitalize(post.status)}
                    </Badge>
                    <p className='text-xs'>{new Date(post.publicationTime).toLocaleDateString()}</p>
                  </div>
                </div>
              )
            })}
          </div>
        </CardContent>
      </Card>
    </main>
  )
}
