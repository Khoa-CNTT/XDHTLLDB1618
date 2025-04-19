import { PLATFORM_COLORS } from '@/constants'

export const getCustomEventStyle = (platform: string) => {
  const colorVar = PLATFORM_COLORS[platform.toUpperCase() as keyof typeof PLATFORM_COLORS]
  return {
    style: {
      background: colorVar,
      borderRadius: '0.25rem',
      height: '50px !important',
      color: 'var(--foreground)'
    }
  }
}
