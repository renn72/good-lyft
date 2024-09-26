'use client'

import { api } from '@/trpc/react'

import { LogOutIcon } from 'lucide-react'
import { signOut } from 'next-auth/react'
import { toast } from 'sonner'

import { Button } from '@/components/ui/button'

export const Logout = () => {
  const ctx = api.useUtils()
  const { data: user } = api.user.isUser.useQuery()
  const onClick = async () => {
    try {
      await signOut()
    } catch (error) {
      toast.error('Error logging out')
      return
    }
    ctx.user.isUser.refetch()
  }
  if (!user) return null
  return (
    <Button
      variant='outline'
      size='icon'
      onClick={() => {
        onClick()
      }}
    >
      <LogOutIcon className='h-5 w-5' />
    </Button>
  )
}
