'use server'

import supabase from '@/configs/supabase'
import * as z from 'zod'

const schema = z.object({
  email: z.string().min(1, { message: 'Email is required' }).email({ message: 'Invalid email address' })
})

const getErrorMessages = (code: string) => {
  switch (code) {
    case '23505':
      return 'Email already exists'
    default:
      return 'Something went wrong'
  }
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export async function joinWaitList(currentState: any, formData: FormData) {
  const dataParsed = schema.safeParse(Object.fromEntries(formData))
  if (!dataParsed.success) {
    const formFieldErrors = dataParsed.error.flatten().fieldErrors
    return { errors: formFieldErrors }
  }

  const { data, error } = await supabase
    .from('waitlist')
    .insert([{ email: dataParsed.data.email }])
    .select()

  if (error) {
    return { errors: { email: [getErrorMessages(error.code)] } }
  }

  return { success: true, data }
}
