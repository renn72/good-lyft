'use client'
import {
  Card,
  CardContent,
  CardTitle,
  CardHeader,
  CardDescription,
} from '~/components/ui/card'
import type { GetCompetitionByUuid } from '~/lib/types'
import { getFormattedDate } from '~/lib/utils'

const CompInfo = ({ competition }: { competition: GetCompetitionByUuid }) => {
  return (
    <Card className='w-full sm:max-w-2xl'>
      <CardHeader>
        <CardTitle>{competition?.name}</CardTitle>
        <CardDescription className='flex flex-col gap-1'>
          <div>
            {competition.date ? getFormattedDate(competition.date) : ''}
          </div>
          <div>{competition.venue ? competition.venue + ',' : ''}</div>
          <div className='flex items-center gap-1 text-xs'>
            <div>{competition.city ? competition.city + ',' : ''}</div>
            <div>{competition.state ? competition.state + ',' : ''}</div>
          </div>
        </CardDescription>
      </CardHeader>
      <CardContent className='flex flex-col gap-2'></CardContent>
    </Card>
  )
}
export default CompInfo
