import { PLATFORM_COLORS } from '@/constants'

export const getCustomEventStyle = (platform: string) => {
  const color = PLATFORM_COLORS[platform.toUpperCase() as keyof typeof PLATFORM_COLORS]
  return {
    style: {
      backgroundColor: `${color}33`,
      borderRadius: '0.25rem',
      height: '50px !important',
      borderLeft: `4px solid ${color}`,
      color: '#000'
    }
  }
}
