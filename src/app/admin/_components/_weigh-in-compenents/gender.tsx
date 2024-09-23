'use client'
import { useFormContext } from 'react-hook-form'
import {
    FormField,
    FormItem,
    FormLabel,
    FormControl,
    FormMessage,
} from '~/components/ui/form'
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '~/components/ui/select'

const Gender = () => {
    const form = useFormContext()
    return (
        <FormField
            control={form.control}
            name='gender'
            rules={{ required: true }}
            render={({ field }) => (
                <FormItem className='w-full'>
                    <FormLabel>Gender</FormLabel>
                    <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                    >
                        <FormControl>
                            <SelectTrigger>
                                <SelectValue placeholder='Gender' />
                            </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                            {['Male', 'Female', 'NA'].map((item) => (
                                <SelectItem
                                    key={item}
                                    value={item}
                                >
                                    {item}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                    <FormMessage />
                </FormItem>
            )}
        />
    )
}
export default Gender
