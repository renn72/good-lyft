'use client'
import { useFormContext } from 'react-hook-form'
import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from '~/components/ui/form'
import { Textarea } from '~/components/ui/textarea'

const Address = () => {
  const { control } = useFormContext()
  return (
    <FormField
      control={control}
      name='address'
      render={({ field }) => (
        <FormItem className='w-full'>
          <FormLabel>Address</FormLabel>
          <FormControl>
            <Textarea
              placeholder='address'
              {...field}
            />
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  )
}
export default Address
