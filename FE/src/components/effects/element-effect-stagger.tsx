'use client'

import { useLayoutEffect, useMemo, useRef, useState } from 'react'
import { AnimationProps, motion, useInView, Variants } from 'motion/react'

export interface ElementEffectStaggerProps {
  children: React.ReactNode
  animationProps: AnimationProps
  childVariants: Variants
  className?: string
  ElementType?: React.ComponentType
  ElementChildrenType?: React.ComponentType
}

export default function ElementEffectStagger({
  children,
  animationProps,
  childVariants,
  className = '',
  ElementType,
  ElementChildrenType
}: ElementEffectStaggerProps) {
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

  const ElementChildren = useMemo(
    () => (ElementChildrenType ? motion.create(ElementChildrenType) : motion.create('div')),
    [ElementChildrenType]
  )

  return (
    <Element
      ref={ref}
      className={className}
      {...animationProps}
      initial={animationProps.initial}
      animate={hasAnimated ? animationProps.animate : animationProps.initial}
    >
      {Array.isArray(children)
        ? children.map((child, index) => (
            <ElementChildren key={index} variants={childVariants}>
              {child}
            </ElementChildren>
          ))
        : children}
    </Element>
  )
}
