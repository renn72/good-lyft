'use client'
import { api } from '~/trpc/react'
import { useEffect } from 'react'
import { useAtom } from 'jotai'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'

import { selectedCompetitionAtom } from './store'

export const CompSelect = () => {
  const context = api.useUtils()
  const competitions = context.competition.getAllMyCompetitions.getData()

  const [selectedCompetition, setSelectedCompetition] = useAtom(
    selectedCompetitionAtom,
  )

  useEffect(() => {
    if (selectedCompetition == '' && competitions && competitions?.length > 0) {
      setSelectedCompetition(competitions[0]?.id.toString() || '')
    }
  }, [])

  return (
    <Select
      onValueChange={(value) => {
        setSelectedCompetition(value)
      }}
      defaultValue={competitions?.[0]?.id.toString() || ''}
    >
      <SelectTrigger className='w-[280px]'>
        <SelectValue placeholder='Select Competition' />
      </SelectTrigger>
      <SelectContent>
        {competitions?.map((competition) => (
          <SelectItem
            key={competition.id}
            value={competition.id.toString()}
          >
            {competition.name}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  )
}
