'use client'
import { cn } from '~/lib/utils'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
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
      variant='muted'
      className={cn(className, 'w-full')}
    >
      <CardContent className='flex flex-col gap-2 p-2 font-medium'>
        <Card className='w-full'>
          <CardContent className='flex flex-col gap-2 p-4'>
            <div className='flex items-baseline justify-between gap-4'>
              <div className='text-2xl font-extrabold'>{competition.name}</div>
              <div className='text-muted-foreground'>
                {competition.date?.toLocaleDateString()}
              </div>
            </div>
            {(competition.city || competition.state) && (
              <div className='flex w-full items-end gap-4'>
                {competition.city && <div>City: {competition.city}</div>}
                {competition.state && <div>State: {competition.state}</div>}
              </div>
            )}
            {(competition.country || competition.federation) && (
              <div className='flex w-full items-end gap-4'>
                {competition.country && (
                  <div>Country: {competition.country}</div>
                )}
                {competition.federation && (
                  <div>Federation: {competition.federation}</div>
                )}
              </div>
            )}

            {competition.notes && (
              <div className='flex w-full items-end gap-4'>
                {competition.notes && <div>Notes: {competition.notes}</div>}
              </div>
            )}
          </CardContent>
        </Card>

        <Card className='w-full'>
          <CardContent className='p-4'>
            <div className='flex w-full items-center justify-between gap-4 font-semibold'>
              <div className='flex w-full gap-8 '>
                <div>Days: </div>
                <div
                  className='text-muted-foreground font-extrabold'
                >{competition.daysOfComp}</div>
              </div>
              <div className='flex w-full gap-8 '>
                <div>Platforms: </div>
                <div className='text-muted-foreground font-extrabold'>{competition.platforms}</div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className='w-full'>
          <CardHeader className=''>
            <CardTitle className=''>
              Events
            </CardTitle>
          </CardHeader>
          <CardContent className='p-4'>
            <div className='flex w-full items-center gap-4'>
              <div>
                {competition.events.map((e) => e.name).join(' * ')}
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
