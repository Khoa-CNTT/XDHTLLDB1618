'use client'

import { useRef } from 'react'
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
  const isInView = useInView(ref, { once: true, amount: 0.2 })
  const Element = ElementType ? motion.create(ElementType) : motion.create('div')
  const ElementChildren = ElementChildrenType ? motion.create(ElementChildrenType) : motion.create('div')

  const animations = {
    ...animationProps,
    animate: isInView ? animationProps.animate : animationProps.initial
  }

  return (
    <Element ref={ref} className={className} {...animations}>
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
