'use client'

import { api } from '@/trpc/react'

import { useSearchParams } from 'next/navigation'

import { Scale, Trophy, Users } from 'lucide-react'
import { toast } from 'sonner'

import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

import { CompInfo } from './_components/comp-info'

export const HomeTab = () => {
  const searchParams = useSearchParams()
  const competitionId = searchParams.get('comp')
  const context = api.useUtils()
  const competitions = context.competition.getAllMyCompetitions.getData()
  const competition = competitions?.find((c) => c.prettyId === competitionId)

  if (!competition) return null
  return (
    <div className='grid grid-cols-4'>
      <CompInfo
        className='col-span-1'
        competition={competition}
      />
      <div className='col-span-3 grid gap-4 md:grid-cols-2 lg:grid-cols-4'>
        <Card className='h-min'>
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
        <Card className='h-min'>
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

        <Card className='h-min'>
          <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
            <CardTitle className='text-sm font-medium'>
              Records Broken
            </CardTitle>
            <Trophy className='h-4 w-4 text-muted-foreground' />
          </CardHeader>
          <CardContent>
            <div className='text-2xl font-bold'>7</div>
            <p className='text-xs text-muted-foreground'>2 world, 5 national</p>
          </CardContent>
        </Card>
        <Card className='h-min'>
          <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
            <CardTitle className='text-sm font-medium'>
              Records Broken
            </CardTitle>
            <Trophy className='h-4 w-4 text-muted-foreground' />
          </CardHeader>
          <CardContent>
            <Button
              onClick={() => {
                toast.success('Success')
              }}
            >
              Toast
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
