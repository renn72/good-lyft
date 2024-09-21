'use client'
import Link from 'next/link'
import Image from 'next/image'
import { ModeToggle } from '@/components/layout/mode-toggle'
import { UserButton } from '@/components/layout/user-button'
import { Cucumber } from '@/components/ui/cucumber'
import { Database } from '@/components/ui/database'
import { Button } from '@/components/ui/button'
import { toast } from 'sonner'

import { api } from '@/trpc/react'

export const Navbar = () => {
  const ctx = api.useUtils()
  const { mutate: sync } = api.user.sync.useMutation({
    onSuccess: () => {
      ctx.invalidate()
      toast.success('Synced')
    },
  })
  const { data: isRoot, isLoading: isLoadingRoot } =
    api.user.isUserRoot.useQuery()

  return (
    <div className='h-18 flex items-center justify-between px-2'>
      <div className='flex items-center gap-4'>
        <Image
          src='/logo/logo-black.webp'
          alt='logo'
          width={100}
          height={50.78}
        />
      </div>
      <div className='flex items-center gap-4'>
        {isRoot && !isLoadingRoot ? (
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
          <div className='w-8 flex items-center justify-center'>
        <UserButton />
        </div>
      </div>
    </div>
  )
}
