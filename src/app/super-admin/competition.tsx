'use client'
import { api } from '~/trpc/react'
import { cn } from '~/lib/utils'
export const dynamic = 'force-dynamic'

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

const Label = ({
  children,
  className,
}: {
  children: React.ReactNode
  className?: string
}) => <div className={cn('text-sm font-medium', className)}>{children}</div>

export const Competition = () => {
  const { data: competitions } = api.competition.getAll.useQuery()
  return (
    <div className='mb-8 flex w-full flex-col gap-4'>
      <div className='flex items-center gap-4'>
        <h1 className='text-2xl font-bold'>Competition's</h1>
      </div>
      <div className='flex w-full flex-col gap-2'>
        {competitions?.map((competition) => (
          <div
            key={competition.id}
            className='flex w-full items-center justify-between gap-4 rounded-lg border border-border bg-background px-4 py-1'
          >
            <div className='flex items-center gap-4'>
              <div
                className={cn(
                  'flex h-10 w-10 justify-center rounded-full pt-2',
                  'text-center text-xl font-bold text-foreground',
                  competition.isStarted ? 'bg-primary' : 'bg-muted',
                )}
              >
                {competition.isStarted ? 'S' : 'NS'}
              </div>
              <div className='flex flex-col'>
                <div className='text-lg font-semibold'>{competition.name}</div>
                <div className='text-sm text-muted-foreground'>
                  {competition.city}
                </div>
              </div>
            </div>
            <div className='flex items-center gap-6'>
              <div className='flex items-baseline gap-2'>
                <Label>Days of Competition</Label>
                <Info>{competition.daysOfComp}</Info>
              </div>
              <div className='flex items-baseline gap-2'>
                <Label>Platforms</Label>
                <Info>{competition.platforms}</Info>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
