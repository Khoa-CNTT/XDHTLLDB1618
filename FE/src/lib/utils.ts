/* eslint-disable @typescript-eslint/no-explicit-any */
import { TokenPayloadType } from '@/constants/token'
import { HttpError, UnprocessableEntityError } from '@/utils/http'
import { clsx, type ClassValue } from 'clsx'
import { decode } from 'jsonwebtoken'
import { UseFormSetError } from 'react-hook-form'
import { twMerge } from 'tailwind-merge'

import { toast } from '@/hooks/use-toast'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export const decodeToken = (token: string) => decode(token) as TokenPayloadType

export const handleErrorApi = ({
  error,
  setError
}: {
  error: any
  setError?: UseFormSetError<any>
  duration?: number
}) => {
  if (error instanceof UnprocessableEntityError && setError) {
    const errors = error.payload.errors
    Object.entries(errors).forEach(([key, value]) => {
      setError(key.toLowerCase(), {
        type: 'server',
        message: value
      })
    })
  } else if (error instanceof HttpError) {
    toast({
      title: 'Error',
      description: error.payload?.msg || 'Something went wrong',
      variant: 'destructive'
    })
  } else {
    toast({
      title: 'Error',
      description: error.message || 'Something went wrong',
      variant: 'destructive'
    })
  }
}
