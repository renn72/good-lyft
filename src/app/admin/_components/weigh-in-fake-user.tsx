'use client'

import { Button } from '~/components/ui/button'
import type { GetCompetitionById } from '~/lib/types'
import { api } from '~/trpc/react'

const roundPL = (num: number) => {
  return Math.round(num / 2.5) * 2.5
}

const FakeUser = ({ competition }: { competition: GetCompetitionById }) => {
  const ctx = api.useUtils()
  const { data: isAdmin } = api.user.isAdmin.useQuery()
  const { mutate: updateAndLock } = api.compEntry.updateAndLock.useMutation({
    onSettled: () => {
      ctx.competition.getMyCompetitions.refetch()
    },
  })

  console.log(competition)

  const update = () => {
    const wc_male = competition.wc_male?.split('/').map((item) => Number(item))
    const wc_female = competition.wc_female
      ?.split('/')
      .map((item) => Number(item))

    for (const entry of competition.entries) {
      const isSquat =
        entry?.events.reduce((a, c) => {
          if (c.event?.isSquat) return true
          return a
        }, false) || false
      const isBench =
        entry?.events.reduce((a, c) => {
          if (c.event?.isBench) return true
          return a
        }, false) || false
      const isDeadlift =
        entry?.events.reduce((a, c) => {
          if (c.event?.isDeadlift) return true
          return a
        }, false) || false

      const squatOpener = roundPL(50 + Math.floor(Math.random() * 270))
      const benchOpener = roundPL(50 + Math.floor(Math.random() * 270))
      const deadliftOpener = roundPL(50 + Math.floor(Math.random() * 270))
      const weight = Number(entry?.weight) || 100

      let wc = ''
      if (entry?.gender?.toLowerCase() == 'female' && wc_female) {
        wc =
          wc_female
            .reduce((a, c) => (weight < c && weight > a ? c : a), 0)
            .toString() + '-f'
      } else {
        if (wc_male && entry?.gender?.toLowerCase() !== 'female') {
          wc =
            wc_male
              .reduce((a, c) => (weight < c && weight > a ? c : a), 0)
              .toString() + '-m'
        }
      }

      updateAndLock({
        id: entry.id,
        address: entry?.address || '',
        phone: entry?.phone || '',
        instagram: entry?.instagram || '',
        openlifter: entry?.openlifter || '',
        birthDate: entry?.birthDate || new Date(),
        equipment: entry?.equipment || '',
        gender: entry?.gender || '',
        predictedWeight: entry?.predictedWeight || '',
        weight: entry?.weight || '',
        squatOpener: entry.squatOpener || '',
        squarRackHeight: entry.squarRackHeight || '',
        benchOpener: entry.benchOpener || '',
        benchRackHeight: entry.benchRackHeight || '',
        deadliftOpener: entry.deadliftOpener || '',
        squatPB: '',
        benchPB: '',
        deadliftPB: '',
        team: entry?.team || '',
        teamLift: entry?.teamLift || '',
        name: entry?.user?.name || '',
        compId: competition?.id || 0,
        userId: entry.userId || 0,
        notes: entry?.notes || '',
      })
    }
  }

  return (
    <>
      {isAdmin && (
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
