'use client'
import { cn } from '~/lib/utils'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import type { GetCompetitionByPrettyId } from '@/lib/types'
import WC_Field from './wc-field'

const CompInfo = ({
  competition,
  className,
}: {
  competition: GetCompetitionByPrettyId
  className?: string
}) => {
  console.log(competition)
  return (
    <Card
      variant='secondary'
      className={cn(className, 'w-full')}
    >
      <CardContent className='flex flex-col gap-2 p-2'>
        <Card className='w-full'>
          <CardContent className='flex flex-col gap-2 p-4'>
            <div className='flex w-full items-end gap-4'>
              <div>Name: {competition.name}</div>
              <div>Date: {competition.date?.toLocaleDateString()}</div>
            </div>

            <div className='flex w-full items-end gap-4'>
              <div>City: {competition.city}</div>
              <div>State: {competition.state}</div>
            </div>
            <div className='flex w-full items-end gap-4'>
              <div>Country: {competition.country}</div>
              <div>Federation: {competition.federation}</div>
            </div>

            <div className='flex w-full items-end gap-4'>
              <div>Notes: {competition.notes}</div>
            </div>
          </CardContent>
        </Card>

        <Card className='w-full'>
          <CardContent className='p-4'>
            <div className='flex w-full items-center gap-4'>
              <div>Days: {competition.daysOfComp}</div>
              <div>Platforms: {competition.platforms}</div>
            </div>
          </CardContent>
        </Card>

        <Card className='w-full'>
          <CardContent className='p-4'>
            <div className='flex w-full items-center gap-4'>
              <div>
                Events: {competition.events.map((e) => e.name).join(' * ')}
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className='w-full'>
          <CardContent className='p-4'>
            <div className='flex w-full items-center gap-4'>
              <div>Equipment: {competition.equipment}</div>
            </div>
          </CardContent>
        </Card>

        <Card className='w-full'>
          <CardContent className='p-4'>
            <div className='flex w-full flex-col items-start gap-4'>
              <div className='grid w-full grid-cols-4 gap-2'>
                <div>Division</div>
                <div>Min Age</div>
                <div>Max Age</div>
                <div>Info</div>
              </div>

              {competition.divisions.map((e) => (
                <div
                  key={e.id}
                  className='grid w-full grid-cols-4 gap-2'
                >
                  <div>{e.name}</div>
                  <div>{e.minAge}</div>
                  <div>{e.maxAge}</div>
                  <div>{e.notes}</div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <WC_Field
          competition={competition}
          weight_class='wcMale'
        />

        <WC_Field
          competition={competition}
          weight_class='wcFemale'
        />
        <WC_Field
          competition={competition}
          weight_class='wcMixed'
        />

        <Card className='w-full'>
          <CardContent className='p-4'>
            <div className='flex w-full items-center gap-4'>
              <div>Formula: {competition.formula}</div>
            </div>
          </CardContent>
        </Card>
      </CardContent>
    </Card>
  )
}

export default CompInfo
