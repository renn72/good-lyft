'use client'
import { api } from '~/trpc/react'

import { toast } from 'sonner'
import { Button } from '~/components/ui/button'
import { cn } from '~/lib/utils'

import type { GetCompetitionById } from '~/lib/types'

export const dynamic = 'force-dynamic'

export const AddFakeUsers = ({
  competition,
  className,
}: {
  competition: GetCompetitionById
  className?: string
}) => {
  const ctx = api.useUtils()

  const { data: fakeUsers } = api.user.getFakeUsers.useQuery()

  const { mutate } = api.entry.createEntry.useMutation({
    onError: (err) => {
      console.log(err)
      toast('Error')
    },
    onSuccess: () => {
      toast('Created')
    },
  })

  const createFake = () => {
    if (!fakeUsers) {
      return
    }
    const divisions = competition?.divisions?.map((division) =>
      division.id.toString(),
    )
    const equipment = competition?.equipment?.split('/') || []
    const events = competition?.events?.map((event) => event.id.toString())

    for (const user of fakeUsers) {
      if (!user.birthDate) continue
      const birthDate = new Date(user.birthDate)

      let pickedEvents = events
        .filter((_) => Math.random() > 0.5)
        .map((event) => event)
      if (pickedEvents.length == 0 && events[0]) {
        pickedEvents = [events[0]]
      }

      let pickedDivisions = divisions
        .filter((_division) => Math.random() > 0.5)
        .map((division) => division)
      if (pickedDivisions.length == 0 && divisions[0]) {
        pickedDivisions = [divisions[0]]
      }

      mutate({
        name: user.name || '',
        birthDate: birthDate,
        address: user.address || '',
        phone: user.phone || '',
        equipment:
          equipment[Math.floor(Math.random() * equipment.length)] || '',
        gender: Math.random() > 0.5 ? 'Male' : 'Female',
        events: pickedEvents,
        divisions: pickedDivisions,
        squatOpener: '',
        squatRack: '',
        benchOpener: '',
        benchRack: '',
        deadliftOpener: '',
        competitionId: competition.id,
        notes: '',
        userId: user.id,
      })
    }
  }

  return (
    <Button
      className={cn(className)}
      onClick={createFake}
    >
      Add Fake Lifters
    </Button>
  )
}

