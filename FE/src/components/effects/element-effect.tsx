'use client'

import { useLayoutEffect, useMemo, useRef, useState } from 'react'
import { AnimationProps, motion, useInView } from 'motion/react'

export interface ElementEffectProps {
  children: React.ReactNode
  animationProps: AnimationProps
  className?: string
  ElementType?: React.ComponentType | React.ElementType
}

export default function ElementEffect({ children, animationProps, className, ElementType }: ElementEffectProps) {
  const ref = useRef(null)
  const [hasAnimated, setHasAnimated] = useState(false)
  const isInView = useInView(ref, { once: true, amount: 0.2 })

  useLayoutEffect(() => {
    if (isInView && !hasAnimated) {
      setHasAnimated(true)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isInView])

  const Element = useMemo(() => (ElementType ? motion.create(ElementType) : motion.create('div')), [ElementType])

  return (
    <Element
      ref={ref}
      className={className}
      {...animationProps}
      initial={animationProps.initial}
      animate={hasAnimated ? animationProps.animate : animationProps.initial}
    >
      {children}
    </Element>
  )
}
