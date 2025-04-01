import { useEffect, useRef, useState } from 'react'

interface DebounceOptions {
  delay?: number
  maxWait?: number //
  leading?: boolean // trigger in first time
  trailing?: boolean // trigger in last time
}

export function useDebounce<T>(value: T, options: number | DebounceOptions = 500) {
  const [debouncedValue, setDebouncedValue] = useState<T>(value)
  const timeoutRef = useRef<NodeJS.Timeout | undefined>(undefined)
  const maxWaitRef = useRef<NodeJS.Timeout | undefined>(undefined)
  const lastCallRef = useRef<number>(Date.now())

  // Normalize options
  const opts = typeof options === 'number' ? { delay: options } : { delay: 500, ...options }

  const { delay, maxWait, leading = false, trailing = true } = opts

  useEffect(() => {
    const now = Date.now()
    const isInitialCall = lastCallRef.current === 0

    // Handle leading edge
    if (leading && (isInitialCall || now - lastCallRef.current >= delay)) {
      setDebouncedValue(value)
      lastCallRef.current = now
      return
    }

    // Clear existing timeout
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current)
    }

    // Set new timeout
    timeoutRef.current = setTimeout(() => {
      if (trailing) {
        setDebouncedValue(value)
      }
      lastCallRef.current = Date.now()

      // Clear maxWait timeout
      if (maxWaitRef.current) {
        clearTimeout(maxWaitRef.current)
        maxWaitRef.current = undefined
      }
    }, delay)

    // Handle maxWait
    if (maxWait && !maxWaitRef.current) {
      maxWaitRef.current = setTimeout(() => {
        setDebouncedValue(value)
        lastCallRef.current = Date.now()

        // Clear normal timeout
        if (timeoutRef.current) {
          clearTimeout(timeoutRef.current)
          timeoutRef.current = undefined
        }
      }, maxWait)
    }

    // Cleanup
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current)
      }
      if (maxWaitRef.current) {
        clearTimeout(maxWaitRef.current)
      }
    }
  }, [value, delay, maxWait, leading, trailing])

  return debouncedValue
}
