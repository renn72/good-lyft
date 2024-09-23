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

const Instagram = () => {
    const form = useFormContext()
    return (
        <FormField
            control={form.control}
            name='instagram'
            render={({ field }) => (
                <FormItem className='w-full'>
                    <FormLabel>Instagram</FormLabel>
                    <FormControl>
                        <Input
                            placeholder='instagram'
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
export default Instagram
