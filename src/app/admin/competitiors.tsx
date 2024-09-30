'use client'

import { useState } from 'react'

import type { GetCompetitionById, GetCompetitionEntryById } from '@/lib/types'
import { cn } from '@/lib/utils'

import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { ScrollArea } from '@/components/ui/scroll-area'

import { AddFakeUsers } from './_components/add-fake-users'
import { DeleteAllEntries } from './_components/delete-all-entries'
import { Entry } from './_components/entry'
import { EntryForm } from './_components/entry-form'

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
    <ScrollArea
      className={cn(
        className,
        'flex w-full flex-col items-center gap-2 text-lg font-medium h-[calc(100vh-139px)]',
      )}
    >
      <Card className='w-full'>
        <CardHeader>Entries</CardHeader>
        <CardContent>
          <div className='flex w-full flex-col gap-2'>
            <div className='flex w-full justify-end gap-4'>
              <EntryForm
                competition={competition}
                isEdit={false}
              >
                <Button>Add</Button>
              </EntryForm>

              <AddFakeUsers competition={competition} />
            </div>
            {competition.entries?.map((entry) => (
              <EntryForm
                key={entry.id}
                competition={competition}
                entry={entry}
                isEdit={true}
              >
                <div>
                  <Entry entry={entry} />
                </div>
              </EntryForm>
            ))}
            <DeleteAllEntries compId={competition.id} />
          </div>
        </CardContent>
      </Card>
    </ScrollArea>
  )
}
