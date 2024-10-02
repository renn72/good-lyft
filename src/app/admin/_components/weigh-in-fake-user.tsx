'use client'

import { Button } from '@/components/ui/button'
import type { GetCompetitionById } from '@/lib/types'
import { api } from '@/trpc/react'

const roundPL = (num: number) => {
  return Math.round(num / 2.5) * 2.5
}

const FakeUser = ({ competition }: { competition: GetCompetitionById }) => {
  const ctx = api.useUtils()
  const { mutate: updateAndLock } = api.entry.updateAndLock.useMutation({
    onSettled: () => {
    },
  })

  const isRoot = ctx.user.isRoot.getData()

  const update = () => {
    const wcMale = competition.wcMale?.split('/').map((item) => Number(item))
    const wcFemale = competition.wcFemale
      ?.split('/')
      .map((item) => Number(item))

    for (const entry of competition.entries) {
      const isSquat =
        entry?.entryToEvents.reduce((a, c) => {
          if (c.event?.isSquat) return true
          return a
        }, false) || false
      const isBench =
        entry?.entryToEvents.reduce((a, c) => {
          if (c.event?.isBench) return true
          return a
        }, false) || false
      const isDeadlift =
        entry?.entryToEvents.reduce((a, c) => {
          if (c.event?.isDeadlift) return true
          return a
        }, false) || false

      const squatOpener = roundPL(50 + Math.floor(Math.random() * 270))
      const benchOpener = roundPL(50 + Math.floor(Math.random() * 270))
      const deadliftOpener = roundPL(50 + Math.floor(Math.random() * 270))
      const weight = Number(entry?.entryWeight) || 100

      let wc = ''
      if (entry?.gender?.toLowerCase() == 'female' && wcFemale) {
        wc =
          wcFemale
            .reduce((a, c) => (weight < c && weight > a ? c : a), 0)
            .toString() + '-f'
      } else {
        if (wcMale && entry?.gender?.toLowerCase() !== 'female') {
          wc =
            wcMale
              .reduce((a, c) => (weight < c && weight > a ? c : a), 0)
              .toString() + '-m'
        }
      }

      updateAndLock({
        id: entry.id,
        birthDate: entry?.birthDate || new Date(),
        equipment: entry?.equipment || '',
        gender: entry?.gender || '',
        entryWeight: entry?.entryWeight || '',
        squatOpener: entry.squatOpener || '',
        squatRack: entry.squatRack || '',
        benchOpener: entry.benchOpener || '',
        benchRack: entry.benchRack || '',
        deadliftOpener: entry.deadliftOpener || '',
        squatPB: '',
        benchPB: '',
        deadliftPB: '',
        compId: competition?.id || 0,
        userId: entry.userId || '',
        notes: entry?.notes || '',
      })
    }
  }

  return (
    <>
      {isRoot && (
        <div className='flex flex-col gap-4'>
          <Button
            className='w-min'
            variant='secondary'
            onClick={update}
          >
            Weigh In Fake Users
          </Button>
        </div>
      )}
    </>
  )
}

export { FakeUser }
