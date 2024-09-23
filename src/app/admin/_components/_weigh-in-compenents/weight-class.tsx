'use client'
import { useFormContext } from 'react-hook-form'
import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from '~/components/ui/form'
import { Input } from '~/components/ui/input'
import { Card, CardContent, CardTitle, CardHeader } from '~/components/ui/card'
import type { GetCompetitionByUuid } from '~/lib/types'

const WeightClass = ({
  competition,
}: {
  competition: GetCompetitionByUuid
}) => {
  const form = useFormContext()
  return (
    <Card className='w-full sm:max-w-2xl'>
      <CardHeader>
        <CardTitle>Weight Class</CardTitle>
      </CardHeader>
      <CardContent className='mt-4 flex flex-col gap-2'>
        <FormField
          control={form.control}
          name='predictedWeight'
          render={({ field }) => (
            <FormItem className='w-full'>
              <FormLabel>Target Body Weight</FormLabel>
              <FormControl>
                <Input
                  placeholder='in kg'
                  type='text'
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        {competition.wc_male && (
          <div>
            <div className='text-lg font-medium'>Male</div>
            <div className='flex flex-wrap gap-2 text-sm'>
              {competition.wc_male?.split('/').map((item) => (
                <div
                  key={item}
                  className='text-nowrap'
                >
                  {item}
                  kg
                </div>
              ))}
            </div>
          </div>
        )}
        {competition.wc_female && (
          <div>
            <div className='text-lg font-medium'>Female</div>
            <div className='flex flex-wrap gap-2 text-sm'>
              {competition.wc_female?.split('/').map((item) => (
                <div
                  key={item}
                  className='text-nowrap'
                >
                  {item}
                  kg
                </div>
              ))}
            </div>
          </div>
        )}
        {competition.wc_mix && (
          <div className='hidden'>
            <div className='text-lg font-medium'>Mixed</div>
            <div className='flex gap-2 text-sm'>
              {competition.wc_mix?.split('/').map((item) => (
                <div
                  key={item}
                  className='text-nowrap'
                >
                  {item}
                  kg
                </div>
              ))}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
export default WeightClass
