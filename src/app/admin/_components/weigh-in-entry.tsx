'use client'

import type { GetCompetitionEntryById } from '@/lib/types'
import { cn, getAge } from '@/lib/utils'
import { CircleCheck, CircleDot, CircleOff, Minus } from 'lucide-react'

import { Badge } from '@/components/ui/badge'
import { SheetTrigger } from '@/components/ui/sheet'

const EmptyCell = ({
  title,
  className,
}: {
  title: string
  className?: string
}) => {
  return (
    <div className={cn('flex flex-col items-center gap-0', className)}>
      <div className='text-xs text-muted-foreground'>{title}</div>
      <div className={cn('text-center text-lg font-medium text-muted')}>
        {title === '' ? (
          ''
        ) : (
          <CircleOff
            size={20}
            className='mt-1'
          />
        )}
      </div>
    </div>
  )
}

const Cell = ({
  title,
  info,
  className,
}: {
  title: string
  info: string | number | null | undefined
  className?: string
}) => {
  return (
    <div className={cn('flex flex-col items-center gap-0', className)}>
      <div className='text-xs text-muted-foreground'>{title}</div>
      <div
        className={cn(
          'text-center text-lg font-medium',
          info ? 'text-primary' : 'text-warning',
          title === 'Weight' && 'text-xl',
        )}
      >
        {info || (
          <Minus
            size={24}
            className='mt-1'
          />
        )}
      </div>
    </div>
  )
}
const CellBadge = ({
  title,
  info,
  className,
}: {
  title: string
  info: string | number | null | undefined
  className?: string
}) => {
  return (
    <div className={cn('flex flex-col items-center gap-1', className)}>
      <div className='text-xs text-muted-foreground'>{title}</div>
      {info && (
        <Badge className='flex w-16 items-center justify-center'>
          {info}kg
        </Badge>
      )}
    </div>
  )
}

const CellArray = ({
  title,
  info,
  className,
}: {
  title: string
  info: string[] | null | undefined
  className?: string
}) => {
  if (!info) {
    return null
  }
  return (
    <div
      className={cn(
        'flex flex-col items-center justify-between gap-2',
        className,
      )}
    >
      <div className='text-sm text-muted-foreground'>{title}</div>
      <div className='flex flex-wrap items-center justify-center gap-1 text-sm leading-none'>
        {info.map((item, i) => (
          <div
            className={cn(
              'flex items-center gap-1 font-medium tracking-tight',
              item ? 'text-primary' : 'text-secondary',
            )}
            key={item}
          >
            {item || '-'}
            {i !== info.length - 1 && (
              <CircleDot
                size={6}
                className='bg-muted'
              />
            )}
          </div>
        ))}
      </div>
    </div>
  )
}

const WeighInEntry = ({
  entry,
  setEntryId,
}: {
  entry: GetCompetitionEntryById
  setEntryId: (id: number) => void
}) => {
  const isSquat = entry.entryToEvents.reduce((a, c) => {
    if (c.event?.isSquat) return true
    return a
  }, false)
  const isBench = entry.entryToEvents.reduce((a, c) => {
    if (c.event?.isBench) return true
    return a
  }, false)
  const isDeadlift = entry.entryToEvents.reduce((a, c) => {
    if (c.event?.isDeadlift) return true
    return a
  }, false)

  return (
    <SheetTrigger asChild>
      <div
        onClick={() => setEntryId(entry.id)}
        className={cn(
          'grid-cols-17 grid cursor-pointer grid-flow-row justify-between rounded-full bg-background',
          'relative border border-input px-6 py-1 hover:bg-input hover:bg-opacity-10',
          entry.isLocked && 'border-4 bg-muted/50',
        )}
      >
        {entry.isLocked && (
          <CircleCheck
            size={24}
            strokeWidth={3}
            className='absolute left-6 top-1/2 -translate-y-1/2 text-complete '
          />
        )}
        <Cell
          title='Name'
          className='col-span-2'
          info={entry.user?.name}
        />
        <Cell
          title='Gender'
          info={entry?.gender}
        />
        <Cell
          title='Age'
          info={getAge(entry.birthDate, entry.competition?.date)}
        />
        <Cell
          title='Weight'
          info={entry.entryWeight}
        />
        <CellBadge
          title='WC'
          info={entry.wc?.split('-')[0]}
        />
        {isSquat ? (
          <Cell
            title='Squat'
            info={entry.squatOpener}
          />
        ) : (
          <EmptyCell title='Squat' />
        )}
        {isSquat ? (
          <Cell
            title='Squat Rack'
            info={entry.squatRack}
          />
        ) : (
          <EmptyCell title='' />
        )}
        {isBench ? (
          <Cell
            title='Bench'
            info={entry.benchOpener}
          />
        ) : (
          <EmptyCell title='Bench' />
        )}
        {isBench ? (
          <Cell
            title='Bench Rack'
            info={entry.benchRack}
          />
        ) : (
          <EmptyCell title='' />
        )}
        {isDeadlift ? (
          <Cell
            title='Deadlift'
            info={entry.deadliftOpener}
          />
        ) : (
          <EmptyCell title='Deadlift' />
        )}
        <CellArray
          title='Events'
          className='col-span-4 tracking-tighter'
          info={entry.entryToEvents?.map((event) => event.event?.name || '')}
        />
        <CellArray
          title='Divisions'
          className='col-span-2'
          info={entry.entryToDivisions?.map(
            (division) => division.division?.name || '',
          )}
        />
      </div>
    </SheetTrigger>
  )
}

export { WeighInEntry }
