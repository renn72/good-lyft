'use client'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
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
import CompInfo from './_components/comp-info'
import { useRouter, usePathname, useSearchParams } from 'next/navigation'
import { api } from '~/trpc/react'

export const HomeTab = () => {
  const searchParams = useSearchParams()
  const competitionId = searchParams.get('comp')
  const context = api.useUtils()
  const competitions = context.competition.getAllMyCompetitions.getData()
  const competition = competitions?.find((c) => c.prettyId === competitionId)

  if (!competition) return null
  return (
    <div className='grid gap-4 md:grid-cols-2 lg:grid-cols-4'>
      <CompInfo competition={competition} />
      <Card>
        <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
          <CardTitle className='text-sm font-medium'>
            Total Competitors
          </CardTitle>
          <Users className='h-4 w-4 text-muted-foreground' />
        </CardHeader>
        <CardContent>
          <div className='text-2xl font-bold'>156</div>
          <p className='text-xs text-muted-foreground'>12 new registrations</p>
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
          <CardTitle className='text-sm font-medium'>Active Judges</CardTitle>
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
          <CardTitle className='text-sm font-medium'>Records Broken</CardTitle>
          <Trophy className='h-4 w-4 text-muted-foreground' />
        </CardHeader>
        <CardContent>
          <div className='text-2xl font-bold'>7</div>
          <p className='text-xs text-muted-foreground'>2 world, 5 national</p>
        </CardContent>
      </Card>
    </div>
  )
}
