'use client'

import { api } from '@/trpc/react'

import type { GetCompetitionEntryById } from '@/lib/types'
import { XIcon } from 'lucide-react'

import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'

const DeleteEntryButton = ({ entry }: { entry: GetCompetitionEntryById }) => {
  const ctx = api.useUtils()
  const isRoot = ctx.user.isRoot.getData()
  const { mutate: deleteEntry } = api.entry.deleteEntry.useMutation({
    onError: (err) => {
      console.log(err)
    },
    onSuccess: () => {
      console.log('deleted')
      void ctx.competition.invalidate()
    },
  })

  const { mutate: deleteEntryAndUser } =
    api.entry.deleteEntryAndUser.useMutation({
      onError: (err) => {
        console.log(err)
      },
      onSuccess: () => {
        console.log('deleted')
        void ctx.competition.invalidate()
      },
    })
  return (
    <div
      onClick={(e) => {
        e.stopPropagation()
      }}
      className='flex items-center justify-center'
    >
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
                deleteEntry(entry.id)
              }}
            >
              Delete
            </Button>
            {isRoot ? (
              <Button
                className='w-full'
                type='button'
                variant='secondary'
                onClick={() => {
                  if (!entry.user?.id) return
                  deleteEntryAndUser({ userId: entry.user.id, entryId: entry.id })
                }}
              >
                Delete and User
              </Button>
            ) : null}
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}

export { DeleteEntryButton }
