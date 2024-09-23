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

const Openlifter = () => {
    const form = useFormContext()
    return (
        <FormField
            control={form.control}
            name='openlifter'
            render={({ field }) => (
                <FormItem className='hidden w-full'>
                    <FormLabel>Openlifter</FormLabel>
                    <FormControl>
                        <Input
                            placeholder='openlifter'
                            type='text'
                            {...field}
                        />
                    </FormControl>
                    <FormMessage />
                </FormItem>
            )}
        />
    )
}
export default Openlifter
