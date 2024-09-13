import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs'
import {
  Bell,
  Home,
  Users,
  Scale,
  Gavel,
  Trophy,
  Monitor,
  Calendar,
  Settings,
} from 'lucide-react'

export default function PowerliftingDashboard() {
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

  return (
    <div className='flex h-screen bg-gray-100 dark:bg-gray-900'>
      <Tabs
        defaultValue='home'
        className='flex w-full'
        orientation='vertical'
      >
        {/* Sidebar */}
        <TabsList className='hidden h-full w-64 flex-col justify-start space-y-2 bg-white p-4 dark:bg-gray-800 md:flex'>
          <div className='mb-4 text-2xl font-bold text-gray-800 dark:text-white'>
            Powerlifting
          </div>
          {tabs.map((tab) => (
            <TabsTrigger
              key={tab.value}
              value={tab.value}
              className='flex w-full items-center justify-start space-x-2 px-4 py-2 text-left'
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
            <div className='flex items-center'>
              <Select>
                <SelectTrigger className='w-[280px]'>
                  <SelectValue placeholder='Select Competition' />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value='comp1'>
                    2023 National Powerlifting Championship
                  </SelectItem>
                  <SelectItem value='comp2'>
                    Regional Qualifier Series
                  </SelectItem>
                  <SelectItem value='comp3'>University Invitational</SelectItem>
                </SelectContent>
              </Select>
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
            {tabs.map((tab) => (
              <TabsContent
                key={tab.value}
                value={tab.value}
                className='mt-0'
              >
                <h2 className='mb-4 text-2xl font-bold'>{tab.label}</h2>
                {tab.value === 'home' && (
                  <div className='grid gap-4 md:grid-cols-2 lg:grid-cols-4'>
                    <Card>
                      <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
                        <CardTitle className='text-sm font-medium'>
                          Total Competitors
                        </CardTitle>
                        <Users className='h-4 w-4 text-muted-foreground' />
                      </CardHeader>
                      <CardContent>
                        <div className='text-2xl font-bold'>156</div>
                        <p className='text-xs text-muted-foreground'>
                          12 new registrations
                        </p>
                      </CardContent>
                    </Card>
                    <Card>
                      <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
                        <CardTitle className='text-sm font-medium'>
                          Weigh-ins Completed
                        </CardTitle>
                        <Scale className='h-4 w-4 text-muted-foreground' />
                      </CardHeader>
                      <CardContent>
                        <div className='text-2xl font-bold'>89</div>
                        <p className='text-xs text-muted-foreground'>
                          57% of total competitors
                        </p>
                      </CardContent>
                    </Card>
                    <Card>
                      <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
                        <CardTitle className='text-sm font-medium'>
                          Active Judges
                        </CardTitle>
                        <Gavel className='h-4 w-4 text-muted-foreground' />
                      </CardHeader>
                      <CardContent>
                        <div className='text-2xl font-bold'>12</div>
                        <p className='text-xs text-muted-foreground'>
                          3 international, 9 national
                        </p>
                      </CardContent>
                    </Card>
                    <Card>
                      <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
                        <CardTitle className='text-sm font-medium'>
                          Records Broken
                        </CardTitle>
                        <Trophy className='h-4 w-4 text-muted-foreground' />
                      </CardHeader>
                      <CardContent>
                        <div className='text-2xl font-bold'>7</div>
                        <p className='text-xs text-muted-foreground'>
                          2 world, 5 national
                        </p>
                      </CardContent>
                    </Card>
                  </div>
                )}
                {tab.value !== 'home' && (
                  <p>Content for {tab.label} goes here.</p>
                )}
              </TabsContent>
            ))}
          </main>
        </div>
      </Tabs>
    </div>
  )
}
