import { PLATFORM_COLORS } from '@/constants'

export const getCustomEventStyle = (platform: string) => {
  const colorVar = PLATFORM_COLORS[platform.toUpperCase() as keyof typeof PLATFORM_COLORS]
  return {
    style: {
      backgroundColor: `rgba(var(${colorVar}), 0.3)`,
      borderRadius: '0.25rem',
      height: '50px !important',
      borderLeft: `4px solid rgb(var(${colorVar}))`,
      color: 'var(--foreground)'
    }
  }
}
