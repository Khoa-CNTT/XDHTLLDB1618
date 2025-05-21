import path from '@/constants/path'
import { CalendarCheck, CreditCard, FileText, LayoutDashboard, Settings2 } from 'lucide-react'
import { FaFacebook, FaInstagram, FaReddit, FaRobot, FaUserPlus } from 'react-icons/fa'
import { FaThreads } from 'react-icons/fa6'
import { RiTwitterXLine } from 'react-icons/ri'

export const SIDE_BAR = {
  navMain: [
    {
      title: 'dashboard',
      url: path.dashboard,
      icon: LayoutDashboard
    },
    {
      title: 'schedules',
      url: path.schedules,
      icon: CalendarCheck
    },
    {
      title: 'posts',
      url: path.posts,
      icon: FileText,
      isActive: true,
      items: [
        {
          title: 'Facebook',
          url: path.posts_facebook,
          icon: FaFacebook
        },
        {
          title: 'Threads',
          url: path.posts_threads,
          icon: FaThreads
        },
        // {
        //   title: 'Reddit',
        //   url: path.posts_reddit,
        //   icon: FaReddit
        // },
        {
          title: 'X',
          url: path.posts_x,
          icon: RiTwitterXLine
        },
        {
          title: 'Instagram',
          url: path.posts_instagram,
          icon: FaInstagram
        }
      ]
    },
    {
      title: 'connect',
      url: path.connect,
      icon: FaUserPlus
    },
    {
      title: 'settings',
      url: path.settings,
      icon: Settings2
    },
    {
      title: 'subscription',
      url: path.subscription,
      icon: CreditCard
    },
    {
      title: 'bot',
      url: path.bot,
      icon: FaRobot
    }
  ]
}

export const PLATFORM_COLORS = {
  FACEBOOK: 'linear-gradient(to right, #00c6ff, #0072ff)',
  THREADS: 'linear-gradient(to right, #000000, #55565B, #FFFFFF)',
  INSTAGRAM: 'linear-gradient(to right, #833ab4, #fd1d1d, #fcb045)',
  REDDIT: 'linear-gradient(to right, #ff4500, #ffa500)',
  X: 'linear-gradient(to right, #1DA1F2, #009ffc)'
}
export const PLATFORM_TYPE = {
  FACEBOOK: 'facebook',
  INSTAGRAM: 'instagram',
  REDDIT: 'reddit',
  THREADS: 'threads',
  X: 'x'
} as const
export const PLATFORM_ICONS = {
  FACEBOOK: FaFacebook,
  INSTAGRAM: FaInstagram,
  REDDIT: FaReddit,
  THREADS: FaThreads,
  X: RiTwitterXLine
}

export const DEFAULT_NUMBER_OF_SKELETON = 3
