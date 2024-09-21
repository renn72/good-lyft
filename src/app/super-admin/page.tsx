'use client'
import { Button } from '@/components/ui/button'
import { useEffect } from 'react'
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs'
import {
  Home,
  Users as UsersIcon,
  Scale,
  Settings,
} from 'lucide-react'

import { useRouter, usePathname, useSearchParams } from 'next/navigation'
import { api } from '~/trpc/react'

import { Users } from './users'

export default function PowerliftingDashboard() {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const currentTab = searchParams.get('tab')
  useEffect(() => {
    if (!currentTab || currentTab === 'null') {
      router.push(`${pathname}?tab=home`)
    }
  }, [])
  const tabs = [
    { value: 'home', label: 'Home', icon: Home },
    { value: 'users', label: 'Users', icon: UsersIcon },
    { value: 'competitions', label: 'Competition\'s', icon: Scale },
    { value: 'settings', label: 'Settings', icon: Settings },
  ]
  return (
    <div className='flex h-screen bg-gray-100 dark:bg-gray-900'>
      <Tabs
        defaultValue={currentTab || 'home'}
        className='flex w-full'
        orientation='vertical'
        onValueChange={(value) => {
          router.push(`${pathname}?tab=${value}`)
        }}
      >
        {/* Sidebar */}
        <TabsList className='hidden h-full w-64 flex-col justify-start space-y-2 bg-white p-4 dark:bg-gray-800 md:flex'>
          <div className='mb-4 text-2xl font-bold text-gray-800 dark:text-white'>
            Admin Dashboard
          </div>
          {tabs.map((tab) => (
            <TabsTrigger
              key={tab.value}
              value={tab.value}
              className='flex w-full items-center justify-start space-x-2 px-4 py-2 text-left cursor-pointer'
            >
              <tab.icon className='h-5 w-5' />
              <span>{tab.label}</span>
            </TabsTrigger>
          ))}
        </TabsList>

        {/* Main Content */}
        <div className='flex flex-1 flex-col overflow-hidden'>
          {/* Header */}
          <header className='flex h-14 items-center justify-between border-b bg-white px-4 dark:bg-gray-800'>
            <Button
              variant='ghost'
              size='icon'
              className='md:hidden'
            >
              <svg
                xmlns='http://www.w3.org/2000/svg'
                width='24'
                height='24'
                viewBox='0 0 24 24'
                fill='none'
                stroke='currentColor'
                strokeWidth='2'
                strokeLinecap='round'
                strokeLinejoin='round'
              >
                <line
                  x1='3'
                  y1='12'
                  x2='21'
                  y2='12'
                ></line>
                <line
                  x1='3'
                  y1='6'
                  x2='21'
                  y2='6'
                ></line>
                <line
                  x1='3'
                  y1='18'
                  x2='21'
                  y2='18'
                ></line>
              </svg>
              <span className='sr-only'>Open menu</span>
            </Button>
            <div className='flex w-full items-center justify-between'>
            </div>
          </header>

          {/* Dashboard Content */}
          <main className='flex-1 overflow-y-auto p-4'>
            <TabsContent
              value={'home'}
              className='mt-0'
            >
              home
            </TabsContent>
            <TabsContent
              value={'users'}
              className='mt-0'
            >
              <Users />
            </TabsContent>
            <TabsContent
              value={'competitions'}
              className='mt-0'
            >
              <h2 className='mb-4 text-2xl font-bold'>Competition's</h2>
            </TabsContent>
            <TabsContent
              value={'settings'}
              className='mt-0'
            >
              <h2 className='mb-4 text-2xl font-bold'>Settings</h2>
            </TabsContent>
          </main>
        </div>
      </Tabs>
    </div>
  )
}

