'use client'

import { useState } from 'react'
import { api } from '@/trpc/react'

import { cn } from '@/lib/utils'
import { LogInIcon } from 'lucide-react'

import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogTrigger } from '@/components/ui/dialog'

import { LogIn } from '@/components/auth/login'
import { SignUp } from '@/components/auth/sign-up'

export const SignInUp = () => {
  const ctx = api.useUtils()
  const [isLogin, setIsLogin] = useState(true)
  const [isOpen, setIsOpen] = useState(false)
  const isUser = ctx.user.isUser.getData()

  if (isUser) return null

  return (
    <Dialog
      open={isOpen}
      onOpenChange={setIsOpen}
    >
      <DialogTrigger asChild>
        <Button
          variant='outline'
          size='icon'
          className=''
        >
          <LogInIcon className='h-5 w-5' />
          <span className='sr-only'>Log in</span>
        </Button>
      </DialogTrigger>
      <DialogContent
        className={cn(
          'w-full flex flex-col justify-start max-w-[440px] transition-all duration-300 ease-in-out overflow-hidden',
          isLogin ? 'h-[420px]' : 'h-[600px]',
        )}
      >
        {isLogin ? (
          <LogIn setIsLogin={setIsLogin} setIsOpen={setIsOpen} />
        ) : (
          <SignUp setIsLogin={setIsLogin} setIsOpen={setIsOpen} />
        )}
      </DialogContent>
    </Dialog>
  )
}
