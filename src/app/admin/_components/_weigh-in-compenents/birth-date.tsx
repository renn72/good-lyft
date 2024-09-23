'use client'
import { useFormContext } from 'react-hook-form'
import {
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '~/components/ui/form'
import { Button } from '~/components/ui/button'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '~/components/ui/popover'
import { PopoverClose } from '@radix-ui/react-popover'
import { CalendarDrop } from '~/components/ui/calendar-drop'
import { cn } from '~/lib/utils'
import { format } from 'date-fns'
import { CalendarIcon } from 'lucide-react'

const BirthDate = () => {
  const form = useFormContext()
  return (
    <FormField
      control={form.control}
      name='birthDate'
      rules={{ required: true }}
      render={({ field }) => (
        <FormItem className='flex w-full flex-col justify-end'>
          <FormLabel>Birth Date</FormLabel>
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant={'outline'}
                className={cn(
                  'w-full justify-start text-left font-normal',
                  !field.value && 'text-muted-foreground',
                )}
              >
                <CalendarIcon className='mr-2 h-4 w-4' />
                {field.value ? (
                  format(field.value, 'PPP')
                ) : (
                  <span>Pick a date</span>
                )}
              </Button>
            </PopoverTrigger>
            <PopoverContent
              align='start'
              className=' w-auto p-0'
            >
              <CalendarDrop
                mode='single'
                captionLayout='dropdown-buttons'
                selected={field.value}
                onSelect={field.onChange}
                fromYear={1930}
                toYear={2020}
              />
              <PopoverClose asChild>
                <p className='mb-2 flex w-full items-center justify-center'>
                  <Button
                    size='sm'
                    variant='outline'
                  >
                    Set
                  </Button>
                </p>
              </PopoverClose>
            </PopoverContent>
          </Popover>
          <FormMessage />
        </FormItem>
      )}
    />
  )
}
export default BirthDate
