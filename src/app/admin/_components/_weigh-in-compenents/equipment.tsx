'use client'
import { useFormContext } from 'react-hook-form'
import { useState } from 'react'
import {
  FormField,
  FormItem,
  FormControl,
  FormMessage,
} from '~/components/ui/form'
import { ToggleGroup, ToggleGroupItem } from '~/components/ui/toggle-group'
import { Card, CardContent, CardTitle, CardHeader } from '~/components/ui/card'
import type { GetCompetitionByUuid } from '~/lib/types'

const Equipment = ({ competition }: { competition: GetCompetitionByUuid }) => {
  const form = useFormContext()
  const [selected, setSelected] = useState<string>()
  return (
    <Card className='w-full sm:max-w-2xl'>
      <CardHeader>
        <CardTitle>Equipment</CardTitle>
      </CardHeader>
      <CardContent className='mt-4 flex flex-col gap-2'>
        <FormField
          control={form.control}
          name='equipment'
          render={({ field }) => (
            <FormItem>
              <ToggleGroup
                type='single'
                defaultValue={form.getValues('equipment') || 'nil'}
                value={selected}
                onValueChange={(value) => {
                  setSelected(value)
                  field.onChange(value)
                }}
              >
                <div className='flex flex-wrap justify-around gap-2 px-6'>
                  {competition.equipment?.split('/').map((item) => (
                    <FormField
                      key={item}
                      control={form.control}
                      name='events'
                      render={() => {
                        return (
                          <FormItem key={item}>
                            <FormControl>
                              <ToggleGroupItem
                                variant='secondary'
                                className='rounded-md border border-input'
                                value={item}
                                onClick={(e) => {
                                  item === selected && e.preventDefault()
                                }}
                              >
                                {item}
                              </ToggleGroupItem>
                            </FormControl>
                          </FormItem>
                        )
                      }}
                    />
                  ))}
                </div>
              </ToggleGroup>
              <FormMessage />
            </FormItem>
          )}
        />
      </CardContent>
    </Card>
  )
}
export default Equipment
