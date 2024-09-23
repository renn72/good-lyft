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
} from '@/components/ui/select'
import { Card, CardContent, CardHeader, CardTitle } from '~/components/ui/card'
import { teams } from '~/lib/store'

const Team = () => {
  const { control } = useFormContext()
  return (
    <Card className='w-full'>
      <CardHeader className='mb-4'>
        <CardTitle>Team</CardTitle>
      </CardHeader>
      <CardContent className='flex items-center gap-8'>
        <FormField
          control={control}
          name='team'
          render={({ field }) => (
            <FormItem className='w-full'>
              <Select
                onValueChange={field.onChange}
                defaultValue={field.value}
              >
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder='Team Name' />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {teams.map((team) => (
                    <SelectItem value={team}>{team}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={control}
          name='teamLift'
          render={({ field }) => (
            <FormItem className='w-full'>
              <Select
                onValueChange={field.onChange}
                defaultValue={field.value}
              >
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder='Team Lift' />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {['squat', 'bench', 'deadlift'].map((team) => (
                    <SelectItem value={team} className='capitalize'>{team}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />
      </CardContent>
    </Card>
  )
}
export default Team
