'use client'

import { useActionState, useEffect } from 'react'
import Form from 'next/form'
import { joinWaitList } from '@/actions/join-waitlist'
import { Loader2 } from 'lucide-react'

import { toast } from '@/hooks/use-toast'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'

const initialState = {
  email: ''
}

export default function JoinWaitListForm() {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [state, formAction, isPending] = useActionState<any, any>(joinWaitList, initialState)

  useEffect(() => {
    if (state.success) {
      toast({
        title: 'Success',
        description: 'You have been added to the waitlist'
      })
    }
  }, [state])
  return (
    <Form action={formAction} noValidate>
      <div className='flex flex-col sm:flex-row gap-4 md:max-w-md'>
        <div className='flex flex-col gap-1'>
          <Input type='email' name='email' placeholder='Enter your email address' />
          {state.errors?.email && <p className='text-red-500 text-sm'>{state.errors.email[0]}</p>}
        </div>

        <Button disabled={isPending} size='lg' variant='default' type='submit'>
          {isPending && <Loader2 className='size-4 animate-spin' />}
          Join Waitlist
        </Button>
      </div>
    </Form>
  )
}
