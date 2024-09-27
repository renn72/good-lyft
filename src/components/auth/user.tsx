'use client'

import { api } from '@/trpc/react'

import { cn } from '@/lib/utils'

import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'

import { Logout } from '@/components/auth/logout'
import { SignInUp } from '@/components/auth/sign-in-up'

const User = () => {
  const ctx = api.useUtils()
  const user = ctx.user.isUser.getData()

  if (!user) return <SignInUp />
  return (
    <Popover>
      <PopoverTrigger asChild>
        <div
          className={cn(
            'flex items-center justify-center rounded-full cursor-pointer',
            'bg-secondary-foreground/40 h-8 w-8 pt-1 text-xl font-bold',
            'hover:bg-secondary-foreground/70',
          )}
        >
          {user.name.slice(0, 1).toUpperCase()}
        </div>
      </PopoverTrigger>
      <PopoverContent asChild>
        <div className='flex flex-col gap-1 w-max'>
          <div>{user.name}</div>
          <div>settings</div>
          <div className='flex items-center gap-2'>
            <Logout />
          </div>
        </div>

      </PopoverContent>
    </Popover>
  )
}

export { User }
