'use client'
import { useRouter, usePathname, useSearchParams } from 'next/navigation'
import { useEffect } from 'react'
import { api } from '~/trpc/react'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'


export const CompSelect = () => {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const competitionId = searchParams.get('comp')
  const currentTab = searchParams.get('tab')
  console.log(competitionId)

  const context = api.useUtils()
  const competitions = context.competition.getAllMyCompetitions.getData()

  useEffect(() => {
    if (!competitionId || competitionId === 'null') {
      if (competitions && competitions?.length > 0) {
        router.push(`${pathname}?comp=${competitions[0]?.prettyId}&tab=home`)
      }
    }
  }, [])

  if (competitionId == 'null') return null

  return (
    <Select
      onValueChange={(value) => {
        const t = currentTab || 'home'
        router.push(`${pathname}?comp=${value}&tab=${t}`)
      }}
      defaultValue={competitionId || ''}
    >
      <SelectTrigger className='w-[280px]'>
        <SelectValue placeholder='Select Competition' />
      </SelectTrigger>
      <SelectContent>
        {competitions?.map((competition) => (
          <SelectItem
            key={competition.id}
            value={competition.prettyId?.toLowerCase()}
          >
            {competition.name}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  )
}
