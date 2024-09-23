import { Card, CardContent, CardHeader, CardTitle } from '~/components/ui/card'
import { GetCompetitionEntryById } from '~/lib/types'
import { getFormattedDate } from '~/lib/utils'
const PersonalInfo = ({
  entry,
}: {
  entry: GetCompetitionEntryById | undefined
}) => {
  return (
    <>
      <Card className='w-full'>
        <CardHeader className='mb-2'>
          <CardTitle>Personal Info</CardTitle>
        </CardHeader>
        <CardContent className='flex flex-col gap-0'>
          <div className='flex w-full'>
            <div className='w-[5rem] text-muted-foreground'>Name: </div>
            <div>{entry?.user?.name}</div>
          </div>
          <div className='flex w-full'>
            <div className='w-[5rem] text-muted-foreground'>DOB: </div>
            <div>{getFormattedDate(entry?.birthDate || null)}</div>
          </div>
          <div className='flex w-full'>
            <div className='w-[5rem] text-muted-foreground'>Gender:</div>
            <div>{entry?.gender}</div>
          </div>
          {entry?.user?.address && (
            <div className='flex w-full'>
              <div className='w-[5rem] text-muted-foreground'>Address:</div>
              <div>{entry?.user?.address}</div>
            </div>
          )}
        </CardContent>
      </Card>
    </>
  )
}
export default PersonalInfo
