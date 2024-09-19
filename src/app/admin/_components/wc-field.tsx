'use client'

import { Card, CardContent, CardHeader, CardTitle } from '~/components/ui/card'
import { Badge } from '~/components/ui/badge'
import type { GetCompetitionByPrettyId } from '@/lib/types'

const WC_Field = ({
  competition,
  weight_class,
}: {
  competition: GetCompetitionByPrettyId
  weight_class: string
}) => {
  const wc =
    weight_class === 'wcMale'
      ? competition.wcMale?.split('/')
      : weight_class === 'wcFemale'
        ? competition.wcFemale?.split('/')
        : competition.wcMixed?.split('/')

  if (!wc ||  ( wc.length === 1 && wc[0] === '')) return null

  return (
    <Card className='w-full'>
      <CardHeader className='p-4'>
        <CardTitle className=''>
         {weight_class === 'wcMale' ? 'Male' : weight_class === 'wcFemale' ? 'Female' : 'Mixed'} Weight Class
        </CardTitle>
      </CardHeader>
      <CardContent className='pb-4 px-4'>
        <div className='flex w-full flex-wrap items-center gap-2'>
          {wc.map((e: string) => (
            <Badge
              key={e}
              className='w-14 items-center justify-center'
            >
              {e}kg
            </Badge>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}

export default WC_Field
