'use client'

import { api } from '~/trpc/react'

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from '~/components/ui/dialog'
import { Button } from '~/components/ui/button'

import { XIcon } from 'lucide-react'
import type { GetCompetitionEntryById } from '~/lib/types'

export const DeleteEntryButton = ({ entry }: { entry: GetCompetitionEntryById }) => {
  const ctx = api.useUtils()
  // const { mutate: deleteEntry } = api.compEntry.deleteEntry.useMutation({
  //   onError: (err) => {
  //     console.log(err)
  //   },
  //   onSuccess: () => {
  //     console.log('deleted')
  //     void ctx.competition.getCompetitionByUuid.invalidate()
  //   },
  // })
  //
  // const { mutate: deleteEntryAndUser } =
  //   api.compEntry.deleteEntryAndUser.useMutation({
  //     onError: (err) => {
  //       console.log(err)
  //     },
  //     onSuccess: () => {
  //       console.log('deleted')
  //       void ctx.competition.getCompetitionByUuid.invalidate()
  //     },
  //   })
  return (
    <Dialog>
      <DialogTrigger asChild>
        <XIcon
          size={24}
          strokeWidth={3}
          className='cursor-pointer place-self-end self-center text-destructive hover:scale-110 hover:text-red-500'
        />
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Delete Entry</DialogTitle>
          <DialogDescription>
            Are you sure you want to delete this entry?
          </DialogDescription>
        </DialogHeader>
        <DialogFooter className='flex gap-6'>
          <Button
            className='w-full'
            type='button'
            variant='secondary'
            onClick={() => {
              console.log('delete')
              // deleteEntry(entry.id)
            }}
          >
            Delete
          </Button>
          <Button
            className='w-full'
            type='button'
            variant='secondary'
            onClick={() => {
              if (!entry.user?.id) return
              // deleteEntryAndUser({ userId: entry.user.id, entryId: entry.id })
            }}
          >
            Delete and User
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

