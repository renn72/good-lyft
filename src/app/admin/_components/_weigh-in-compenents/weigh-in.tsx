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
import { Card, CardContent, CardHeader, CardTitle } from '~/components/ui/card'

const WeighIn = () => {
  const { control } = useFormContext()
  return (
    <Card className='w-full'>
      <CardHeader className='mb-4'>
        <CardTitle>Weigh In</CardTitle>
      </CardHeader>
      <CardContent className=''>
        <FormField
          control={control}
          name='weight'
          render={({ field }) => (
            <FormItem className='w-full'>
              <FormControl>
                <div className='relative w-full'>
                <Input
                  className='h-24 text-center text-5xl font-medium'
                  placeholder='Weight'
                  type='number'
                  {...field}
                />
                <div className='absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 text-lg'>kg</div>
                </div>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </CardContent>
    </Card>
  )
}
export default WeighIn
