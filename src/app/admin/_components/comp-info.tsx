'use client'
import { cn } from '~/lib/utils'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import type { GetCompetitionByPrettyId } from '@/lib/types'
import WC_Field from './wc-field'

import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip'

const Heading = ({ children }: { children: React.ReactNode }) => (
  <div className='text-sm font-medium'>{children}</div>
)

const Info = ({
  children,
  className,
}: {
  children: React.ReactNode
  className?: string
}) => (
  <div className={cn('text-sm text-secondary-foreground', className)}>
    {children}
  </div>
)

const CompInfo = ({
  competition,
  className,
}: {
  competition: GetCompetitionByPrettyId
  className?: string
}) => {
  console.log(competition)
  return (
    <div className={cn(className, 'w-full')}>
      <TooltipProvider>
        <Card
          variant='muted'
          className={cn(className, 'w-full')}
        >
          <CardContent className='flex flex-col gap-2 p-2 font-medium'>
            <Card className='w-full'>
              <CardContent className='gap-! flex flex-col p-4'>
                <div className='flex items-baseline justify-between gap-4'>
                  <div className='text-2xl font-extrabold'>
                    {competition.name}
                  </div>
                  <Info>{competition.date?.toLocaleDateString()}</Info>
                </div>
                {(competition.city || competition.state) && (
                  <div className='flex w-full items-end gap-4'>
                    {competition.city && (
                      <div className='flex w-full items-center gap-2'>
                        <Heading>City:</Heading>
                        <Info>{competition.city}</Info>
                      </div>
                    )}
                    {competition.state && (
                      <div className='flex w-full items-center gap-2'>
                        <Heading>State:</Heading>
                        <Info>{competition.state}</Info>
                      </div>
                    )}
                  </div>
                )}
                {(competition.country || competition.federation) && (
                  <div className='flex w-full items-end gap-4'>
                    {competition.country && (
                      <div className='flex w-full items-center gap-2'>
                        <Heading>Country:</Heading>
                        <Info>{competition.country}</Info>
                      </div>
                    )}
                    {competition.federation && (
                      <div className='flex w-full items-center gap-2'>
                        <Heading>Federation:</Heading>
                        <Info>{competition.federation}</Info>
                      </div>
                    )}
                  </div>
                )}

                {competition.notes && (
                  <div className='flex w-full items-end gap-4'>
                    <div className='flex w-full items-center gap-2'>
                      <Heading>Notes:</Heading>
                      <Info>{competition.notes}</Info>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            <Card className='w-full'>
              <CardContent className='p-4'>
                <div className='flex w-full items-center justify-between gap-4 font-semibold'>
                  <div className='flex w-full gap-8'>
                    <div>Days: </div>
                    <Info>{competition.daysOfComp}</Info>
                  </div>
                  <div className='flex w-full gap-8'>
                    <div>Platforms: </div>
                    <Info>{competition.platforms}</Info>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className='w-full'>
              <CardHeader className='pb-0 pt-4'>
                <CardTitle className=''>Events</CardTitle>
              </CardHeader>
              <CardContent className='p-4'>
                <div className='flex w-full flex-wrap gap-2 leading-none'>
                  {competition.events.map((e) => (
                    <div
                      key={e.id}
                      className='rounded-xl bg-muted px-2 py-1'
                    >
                      <Info>{e.name}</Info>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card className='w-full'>
              <CardHeader className='pb-0 pt-4'>
                <CardTitle className=''>Equipment</CardTitle>
              </CardHeader>
              <CardContent className='p-4'>
                <div className='flex w-full flex-wrap gap-2 leading-none'>
                  {competition.equipment?.split('/').map((e) => (
                    <div
                      key={e}
                      className='rounded-xl bg-muted px-2 py-1'
                    >
                      <Info>{e}</Info>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card className='w-full'>
              <CardContent className='p-4'>
                <div className='flex w-full flex-col items-start gap-4'>
                  <div className='grid w-full grid-cols-6 gap-2 font-semibold'>
                    <div className='col-span-2 text-xl'>Division</div>
                    <div>Min Age</div>
                    <div>Max Age</div>
                    <div className='col-span-2'>Info</div>
                  </div>

                  {competition.divisions.map((e) => (
                    <div
                      key={e.id}
                      className='grid w-full grid-cols-6 gap-2 rounded-xl bg-muted px-2 py-1'
                    >
                      <div className='col-span-2'>
                        <Tooltip>
                          <TooltipTrigger>
                            <Info className='col-span-2'>
                              {e.name?.slice(0, 18)}
                            </Info>
                          </TooltipTrigger>
                          <TooltipContent>
                            <div>{e.name}</div>
                          </TooltipContent>
                        </Tooltip>
                      </div>
                      <Info>{e.minAge}</Info>
                      <Info>{e.maxAge}</Info>
                      <div className='col-span-2'>
                        <Tooltip>
                          <TooltipTrigger>
                            <Info className='col-span-2'>
                              {e.notes?.slice(0, 18)}
                            </Info>
                          </TooltipTrigger>
                          <TooltipContent>
                            <div>{e.notes}</div>
                          </TooltipContent>
                        </Tooltip>
                      </div>
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
                  <Heading>Formula:</Heading>
                  <Info>{competition.formula}</Info>
                </div>
              </CardContent>
            </Card>
          </CardContent>
        </Card>
      </TooltipProvider>
    </div>
  )
}

export default CompInfo
