'use client'

import { LogOutIcon } from 'lucide-react'
import { signOut } from 'next-auth/react'

import { Button } from '@/components/ui/button'

import { api } from '@/trpc/react'

export const Logout = () => {
  const { data: user } = api.user.isUser.useQuery()
  console.log('isuser', user)
  if (!user) return null
  return (
    <Button
      variant='outline'
      size='icon'
      onClick={() => {
        signOut()
      }}
    >
      <LogOutIcon className='h-5 w-5' />
    </Button>
  )
}
