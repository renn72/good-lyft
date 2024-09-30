'use client'

import { useState } from 'react'

import { GetCompetitionById } from '@/lib/types'

import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet'

import { WeighInEntry } from './_components/weigh-in-entry'
import { FakeUser } from './_components/weigh-in-fake-user'
import { WeighInForm } from './_components/weigh-in-form'
import { WeightClasses } from './_components/weigh-in-weight-classes'

const WeighIn = ({ competition }: { competition: GetCompetitionById }) => {
  const [entryId, setEntryId] = useState<number | null>(null)
  const [isOpen, setIsOpen] = useState(false)

  const entry = competition?.entries?.find(
    (entry) => entry.id === Number(entryId),
  )

  if (!competition) return <div>Competition not found</div>

  return (
    <div className='flex flex-col gap-4'>
      <Sheet
        open={isOpen}
        onOpenChange={setIsOpen}
      >
        <div className='flex items-center gap-4'>
          <h2 className='text-lg font-bold'>Weight In</h2>
          {competition && <FakeUser competition={competition} />}
        </div>
        {competition && (
          <div className='mx-4 flex flex-col gap-2'>
            <WeightClasses competition={competition} />
            {competition.entries?.map((entry) => (
              <WeighInEntry
                entry={entry}
                key={entry.id}
                setEntryId={setEntryId}
              />
            ))}
          </div>
        )}
        <SheetContent className='w-[400px] overflow-y-auto sm:w-[940px] sm:max-w-3xl'>
          <SheetHeader>
            <SheetTitle>Weigh In</SheetTitle>
          </SheetHeader>
          <WeighInForm
            isOpen={isOpen}
            setIsOpen={setIsOpen}
            entry={entry || null}
            competition={competition}
          />
        </SheetContent>
      </Sheet>
    </div>
  )
}

export { WeighIn }
