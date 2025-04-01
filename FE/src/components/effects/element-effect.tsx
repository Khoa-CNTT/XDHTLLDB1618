'use client'

import { useRef } from 'react'
import { AnimationProps, motion, useInView } from 'motion/react'

export interface ElementEffectProps {
  children: React.ReactNode
  animationProps: AnimationProps
  className?: string
  ElementType?: React.ComponentType | React.ElementType
}

export default function ElementEffect({ children, animationProps, className, ElementType }: ElementEffectProps) {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, amount: 0.2 })

  const animations = {
    ...animationProps,
    animate: isInView ? animationProps.animate : animationProps.initial
  }

  const Element = ElementType ? motion.create(ElementType) : motion.create('div')
  return (
    <Element ref={ref} className={className} {...animations}>
      {children}
    </Element>
  )
}
