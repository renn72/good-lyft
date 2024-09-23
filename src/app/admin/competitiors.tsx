'use client'
import { Card, CardContent, CardHeader } from '~/components/ui/card'
import { cn } from '~/lib/utils'
import { ScrollArea } from '~/components/ui/scroll-area'

import { Entry } from './_components/entry'
import { EntryForm } from './_components/entry-form'
import { AddFakeUsers } from './_components/add-fake-users'
import { DeleteAllEntries } from './_components/delete-all-entries'

import type { GetCompetitionById } from '~/lib/types'

export const dynamic = 'force-dynamic'

export const Competitors = ({
  competition,
  className,
}: {
  competition: GetCompetitionById | undefined
  className?: string
}) => {

  if (!competition) return null
  return (
    <ScrollArea className={cn(className, 'flex w-full flex-col items-center gap-2 text-lg font-medium h-[calc(100vh-139px)]')}>
      <Card className='w-full'>
        <CardHeader>Entries</CardHeader>
        <CardContent>
          <div className='flex w-full flex-col gap-2'>
            <div className='flex w-full justify-end gap-4'>
              <EntryForm competition={competition} />
              <AddFakeUsers competition={competition} />
            </div>
            {competition.entries?.map((entry) => (
              <Entry
                key={entry.id}
                entry={entry}
              />
            ))}
            <DeleteAllEntries compId={competition.id} />
          </div>
        </CardContent>
      </Card>
    </ScrollArea>
  )
}
