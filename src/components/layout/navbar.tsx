'use client'

import { api } from '@/trpc/react'

import Image from 'next/image'
import Link from 'next/link'

import { toast } from 'sonner'

import { Button } from '@/components/ui/button'
import { Cucumber } from '@/components/ui/cucumber'
import { Database } from '@/components/ui/database'

import { User } from '@/components/auth/user'
import { ModeToggle } from '@/components/layout/mode-toggle'

export const Navbar = () => {
  const ctx = api.useUtils()
  const { mutate: sync } = api.user.sync.useMutation({
    onSuccess: () => {
      ctx.invalidate()
      toast.success('Synced')
    },
  })
  const { data: _isUser, isLoading: isLoadingUser } = api.user.isUser.useQuery()

  return (
    <div className='h-18 flex items-center justify-between px-2'>
      <div className='flex items-center gap-4'>
        <Link
          className='hover:opacity-100 opacity-80 transition-all'
          href='/'>
          <Image
            src='/logo/logo-black.webp'
            alt='logo'
            width={100}
            height={50.78}
          />
        </Link>
      </div>
      {isLoadingUser ? null : (
        <div className='flex items-center gap-4'>
          {true ? (
            <div className='flex items-center gap-4'>
              <Button
                variant='ghost'
                onClick={() => {
                  sync()
                }}
              >
                <Database className='h-8 w-8 text-secondary' />
              </Button>
              <Link href='/super-admin'>
                <Cucumber className='h-8 w-8 text-secondary' />
              </Link>
            </div>
          ) : null}
          <Link href='/admin'>
            <Button variant='outline'>Admin</Button>
          </Link>

          <ModeToggle />
          <User />
        </div>
      )}
    </div>
  )
}
