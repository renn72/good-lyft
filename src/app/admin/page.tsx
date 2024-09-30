'use client'

import { useEffect } from 'react'

import Link from 'next/link'
import { usePathname, useRouter, useSearchParams } from 'next/navigation'

import { api } from '~/trpc/react'
import {
  Bell,
  Calendar,
  Gavel,
  Home,
  Monitor,
  Scale,
  Settings,
  Trophy,
  Users,
} from 'lucide-react'

import { Button } from '@/components/ui/button'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'

import { CompSelect } from './comp-select'
import { Competitors } from './competitiors'
import { HomeTab } from './home'
import { WeighIn } from './weigh-in'

export const dynamic = 'force-dynamic'

export default function PowerliftingDashboard() {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const competitionId = searchParams.get('comp')
  const currentTab = searchParams.get('tab')
  useEffect(() => {
    if (!currentTab || currentTab === 'null') {
      router.push(`${pathname}?comp=${competitionId}&tab=home`)
    }
  }, [])

  const tabs = [
    { value: 'home', label: 'Home', icon: Home },
    { value: 'competitors', label: 'Competitors', icon: Users },
    { value: 'weigh-in', label: 'Weigh In', icon: Scale },
    { value: 'judges', label: 'Judges', icon: Gavel },
    { value: 'leaderboards', label: 'Leaderboards', icon: Trophy },
    { value: 'screen-management', label: 'Screen Management', icon: Monitor },
    { value: 'comp-day', label: 'Comp Day', icon: Calendar },
    { value: 'settings', label: 'Settings', icon: Settings },
  ]
  const { data: competitions, isLoading: isLoadingCompetitions } =
    api.competition.getAllMyCompetitions.useQuery(undefined, {
      refetchInterval: 1000 * 60 * 1,
    })

  const selectedCompetition = competitions?.find(
    (c) => c.prettyId.toLowerCase() === competitionId?.toLowerCase(),
  )

  if (isLoadingCompetitions) return null

  return (
    <div className='flex bg-gray-100 dark:bg-gray-900 h-[calc(100vh-51px)]'>
      <Tabs
        defaultValue={currentTab || 'home'}
        className='flex w-full'
        orientation='vertical'
        onValueChange={(value) => {
          router.push(`${pathname}?comp=${competitionId}&tab=${value}`)
        }}
      >
        {/* Sidebar */}
        <TabsList className='hidden h-full w-64 flex-col justify-start space-y-2 bg-white p-4 dark:bg-gray-800 md:flex'>
          <div className='mb-4 text-2xl font-bold text-gray-800 dark:text-white'>
            Dashboard
          </div>
          {tabs.map((tab) => (
            <TabsTrigger
              key={tab.value}
              value={tab.value}
              className='flex w-full cursor-pointer items-center justify-start space-x-2 px-4 py-2 text-left'
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
              <div className='flex items-center gap-4'>
                <CompSelect />
                <Link
                  href='/admin/create'
                  passHref
                >
                  <Button
                    variant='ghost'
                    className='ml-4'
                  >
                    Create Competition
                  </Button>
                </Link>
              </div>
              <Button
                variant='ghost'
                size='icon'
                className='ml-4'
              >
                <Bell className='h-5 w-5' />
                <span className='sr-only'>View notifications</span>
              </Button>
            </div>
          </header>

          {/* Dashboard Content */}
          <main className='flex-1 overflow-y-auto p-4'>
            <TabsContent
              value={'home'}
              className='mt-0'
            >
              <HomeTab />
            </TabsContent>
            <TabsContent
              value={'competitors'}
              className='mt-0'
            >
              <Competitors competition={selectedCompetition} />
            </TabsContent>
            <TabsContent
              value={'weigh-in'}
              className='mt-0'
            >
              <WeighIn competition={selectedCompetition} />
            </TabsContent>
            <TabsContent
              value={'judges'}
              className='mt-0'
            >
              <h2 className='mb-4 text-2xl font-bold'>Judges</h2>
            </TabsContent>
            <TabsContent
              value={'leaderboards'}
              className='mt-0'
            >
              <h2 className='mb-4 text-2xl font-bold'>Leaderboards</h2>
            </TabsContent>
            <TabsContent
              value={'screen-management'}
              className='mt-0'
            >
              <h2 className='mb-4 text-2xl font-bold'>Screen Management</h2>
            </TabsContent>
            <TabsContent
              value={'comp-day'}
              className='mt-0'
            >
              <h2 className='mb-4 text-2xl font-bold'>Comp Day</h2>
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
