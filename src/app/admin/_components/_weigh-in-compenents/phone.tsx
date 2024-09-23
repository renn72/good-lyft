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

const Phone = () => {
    const form = useFormContext()
    return (
        <FormField
            control={form.control}
            name='phone'
            render={({ field }) => (
                <FormItem className='w-full'>
                    <FormLabel>Phone</FormLabel>
                    <FormControl>
                        <Input
                            placeholder='phone'
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
export default Phone
