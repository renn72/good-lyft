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
import { Card, CardContent, CardHeader } from '~/components/ui/card'

const Address = () => {
    const { getValues } = useFormContext()
    if (!getValues('notes')) {
        return null
    }
    return (
        <Card className='w-full sm:max-w-2xl'>
            <CardHeader></CardHeader>
            <CardContent className='flex flex-col gap-2'>
                <h2>Notes</h2>
                <Card>
                    <CardHeader></CardHeader>
                    <CardContent>{getValues('notes')}</CardContent>
                </Card>
            </CardContent>
        </Card>
    )
}
export default Address
