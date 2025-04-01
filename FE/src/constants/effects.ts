import { AnimationProps, Variants } from 'motion/react'

const fadeInVariants: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 }
}

export const FADE_IN_ANIMATION: AnimationProps = {
  initial: 'hidden',
  animate: 'visible',
  transition: { duration: 0.5 },
  variants: fadeInVariants
}

const fadeInStaggerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.2
    }
  }
}

export const FADE_IN_STAGGER_ANIMATION: AnimationProps = {
  initial: 'hidden',
  animate: 'visible',
  transition: { duration: 0.5 },
  variants: fadeInStaggerVariants
}

export const fadeInChildVariants: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5 } }
}
