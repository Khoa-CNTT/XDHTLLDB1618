'use client'

import { useEffect } from 'react'
import Link from 'next/link'
import { AlertCircle, ArrowLeft, Home, RefreshCw } from 'lucide-react'

import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'

export default function Error({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error(error)
  }, [error])

  return (
    <div className='flex items-center justify-center min-h-[70vh] p-4'>
      <Card className='w-full max-w-md shadow-lg'>
        <CardHeader className='space-y-1 pb-2'>
          <div className='flex items-center gap-2'>
            <div className='bg-red-100 p-2 rounded-full'>
              <AlertCircle className='size-6 text-red-600' />
            </div>
            <CardTitle className='text-xl'>Something went wrong</CardTitle>
          </div>
          <CardDescription className='pt-1'>We encountered an unexpected error</CardDescription>
        </CardHeader>
        <CardContent className='pb-2'>
          <div className='bg-muted p-3 rounded-md text-sm'>
            <p className='font-mono text-muted-foreground break-all'>
              {error.digest ? `Error ID: ${error.digest}` : error.message || 'An unknown error occurred'}
            </p>
          </div>
        </CardContent>
        <CardFooter className='flex flex-col space-y-2 sm:flex-row sm:space-x-2 sm:space-y-0'>
          <Button variant='outline' className='w-full sm:w-auto' onClick={() => reset()}>
            <RefreshCw className='mr-2 size-4' />
            Try again
          </Button>
          <Button asChild className='w-full sm:w-auto'>
            <Link href='/'>
              <Home className='mr-2 size-4' />
              Back to home
            </Link>
          </Button>
          <Button variant='ghost' className='w-full sm:w-auto' onClick={() => window.history.back()}>
            <ArrowLeft className='mr-2 size-4' />
            Go back
          </Button>
        </CardFooter>
      </Card>
    </div>
  )
}
