import React from 'react'

interface Props {
  children: React.ReactNode
}

export default function Layout({ children }: Props) {
  return <div className='h-screen flex justify-center items-center'>{children}</div>
}
