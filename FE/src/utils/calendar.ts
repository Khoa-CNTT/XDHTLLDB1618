import { PLATFORM_COLORS } from '@/constants'

export const getCustomEventStyle = (platform: string) => {
  const colorVar = PLATFORM_COLORS[platform.toUpperCase() as keyof typeof PLATFORM_COLORS] || PLATFORM_COLORS.FACEBOOK
  return {
    style: {
      background: colorVar,
      borderRadius: '0.25rem',
      color: 'var(--foreground)'
    }
  }
}
