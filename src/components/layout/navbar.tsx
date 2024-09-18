'use client'
import Image from 'next/image'
import { ModeToggle } from '@/components/layout/mode-toggle'
import { UserButton } from '@/components/layout/user-button'

export const Navbar = () => {
  return (
    <div className='flex h-18 items-center justify-between px-2'>
      <div className='flex items-center gap-4'>
        <Image
          src='/logo/logo-black.webp'
          alt='logo'
          width={100}
          height={50.78}
        />
      </div>
      <div className='flex items-center gap-4'>
        <ModeToggle />
        <UserButton />
      </div>
    </div>
  )
}
