'use client'

import { useState } from 'react'

import { zodResolver } from '@hookform/resolvers/zod'
import { Button } from '~/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '~/components/ui/dialog'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '~/components/ui/form'
import { Input } from '~/components/ui/input'
import {
  Popover,
  PopoverClose,
  PopoverContent,
  PopoverTrigger,
} from '~/components/ui/popover'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '~/components/ui/select'
import { ToggleGroup, ToggleGroupItem } from '~/components/ui/toggle-group'
import type { GetCompetitionById, GetCompetitionEntryById } from '~/lib/types'
import { cn } from '~/lib/utils'
import { api } from '~/trpc/react'
import { format } from 'date-fns'
import { CalendarIcon, XIcon } from 'lucide-react'
import { useForm } from 'react-hook-form'
import { toast } from 'sonner'
import { z } from 'zod'

import { CalendarDrop } from '@/components/ui/calender-drop'

const formSchema = z.object({
  firstName: z.string().min(1, { message: 'First Name is required' }),
  lastName: z.string().min(1, { message: 'Last Name is required' }),
  birthDate: z.date(),
  gender: z.string().min(1, { message: 'Gender is required' }),
  address: z.string(),
  phone: z.string(),
  email: z.string(),
  equipment: z.string(),
  events: z
    .array(z.string())
    .nonempty({ message: 'Please select at least one event.' }),
  divisions: z
    .array(z.string())
    .nonempty({ message: 'Please add at least one division.' }),
  notes: z.string(),
  squatOpener: z.string(),
  benchOpener: z.string(),
  deadliftOpener: z.string(),
  squatRackHeight: z.string(),
  benchRackHeight: z.string(),
  competitionId: z.number(),
})

export const dynamic = 'force-dynamic'

const EntryForm = ({
  competition,
  isEdit,
  entry,
  children,
}: {
  competition: GetCompetitionById
  isEdit: boolean
  entry?: GetCompetitionEntryById | null
  children?: React.ReactNode
}) => {
  const equipment = competition.equipment?.split('/')

  const ctx = api.useUtils()

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      firstName: isEdit ? entry?.user?.firstName || '' : '',
      lastName: isEdit ? entry?.user?.lastName || '' : '',
      birthDate: isEdit ? entry?.birthDate || new Date() : new Date(),
      gender: isEdit ? entry?.gender || '' : '',
      address: isEdit ? entry?.user?.address || '' : '',
      phone: isEdit ? entry?.user?.phone || '' : '',
      email: isEdit ? entry?.user?.email || '' : '',
      equipment: isEdit
        ? entry?.equipment || ''
        : competition.equipment?.split('/')[0] || '',
      events: isEdit
        ? entry?.entryToEvents.map((event) => event.event?.id.toString()) || []
        : competition.events.map((event) => event.id.toString()),
      divisions: isEdit
        ? entry?.entryToDivisions?.map((division) =>
            division.division?.id.toString(),
          ) || []
        : [],
      notes: isEdit ? entry?.notes || '' : '',
      squatOpener: isEdit ? entry?.squatOpener || '' : '',
      benchOpener: isEdit ? entry?.benchOpener || '' : '',
      deadliftOpener: isEdit ? entry?.deadliftOpener || '' : '',
      squatRackHeight: isEdit ? entry?.squatRack || '' : '',
      benchRackHeight: isEdit ? entry?.benchRack || '' : '',
      competitionId: competition.id,
    },
  })
  const { mutate: createEntry } = api.entry.createEntry.useMutation({
    onError: (err) => {
      console.log(err)
      toast('Error')
    },
    onSuccess: () => {
      toast('Created')
      ctx.competition.invalidate()
      ctx.entry.invalidate()
    },
  })

  const onSubmit = (data: z.infer<typeof formSchema>) => {
    if (isEdit) {
      console.log('data', data)
    } else {
      createEntry(data)
    }
  }

  return (
    <Dialog>
      <DialogTrigger asChild>
        {children}
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>New Entry</DialogTitle>
        </DialogHeader>
        <DialogDescription></DialogDescription>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className='flex w-full flex-col gap-4'
          >
            <div className='flex w-full flex-col gap-4'>
              <div className='flex w-full items-end gap-4'>
                <FormField
                  control={form.control}
                  name='firstName'
                  render={({ field }) => (
                    <FormItem className='w-full'>
                      <FormLabel>First Name</FormLabel>
                      <FormControl>
                        <Input
                          placeholder='first name'
                          type='text'
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name='lastName'
                  render={({ field }) => (
                    <FormItem className='w-full'>
                      <FormLabel>Last Name</FormLabel>
                      <FormControl>
                        <Input
                          placeholder='last name'
                          type='text'
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <FormField
                control={form.control}
                name='birthDate'
                render={({ field }) => (
                  <FormItem className='flex w-full flex-col'>
                    <FormLabel>Birthday</FormLabel>
                    <Popover>
                      <PopoverTrigger asChild>
                        <FormControl>
                          <Button
                            variant={'outline'}
                            className={cn(
                              'min-w-[240px] pl-3 text-left font-normal',
                              !field.value && 'text-muted-foreground',
                            )}
                          >
                            {field.value ? (
                              format(field.value, 'PPP')
                            ) : (
                              <span>date</span>
                            )}
                            <CalendarIcon className='ml-auto h-4 w-4 opacity-50' />
                          </Button>
                        </FormControl>
                      </PopoverTrigger>
                      <PopoverContent
                        className='w-auto p-0'
                        align='start'
                      >
                        <div className='flex w-full justify-end'>
                          <PopoverClose asChild>
                            <XIcon className='m-1 h-6 w-6 cursor-pointer opacity-50 hover:text-destructive' />
                          </PopoverClose>
                        </div>
                        <CalendarDrop
                          mode='single'
                          captionLayout='dropdown-buttons'
                          fromYear={1900}
                          toYear={new Date().getFullYear()}
                          selected={field.value}
                          onSelect={field.onChange}
                          disabled={(date) => date > new Date()}
                          initialFocus
                        />
                        <PopoverClose asChild>
                          <Button
                            className='w-full'
                            type='button'
                            variant='secondary'
                          >
                            Set
                          </Button>
                        </PopoverClose>
                      </PopoverContent>
                    </Popover>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name='gender'
                render={({ field }) => (
                  <FormItem>
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
                        {['Male', 'Female'].map((item) => (
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
              <FormField
                control={form.control}
                name='events'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className='text-base'>Events</FormLabel>
                    <ToggleGroup
                      type='multiple'
                      defaultValue={form.getValues('events')}
                      onValueChange={(value) => {
                        field.onChange(value)
                      }}
                    >
                      <div className='flex flex-wrap justify-between gap-2 px-6'>
                        {competition.events.map((item) => (
                          <FormField
                            key={item.id}
                            control={form.control}
                            name='events'
                            render={() => {
                              return (
                                <FormItem key={item.id}>
                                  <FormControl>
                                    <ToggleGroupItem
                                      className='rounded-md border border-input'
                                      value={item.id.toString()}
                                    >
                                      {item.name}
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
              <FormField
                control={form.control}
                name='divisions'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className='text-base'>Divisions</FormLabel>
                    <ToggleGroup
                      type='multiple'
                      defaultValue={form.getValues('divisions')}
                      onValueChange={(value) => {
                        field.onChange(value)
                      }}
                    >
                      <div className='flex flex-wrap justify-between gap-2 px-6'>
                        {competition.divisions.map((item) => (
                          <FormField
                            key={item.id}
                            control={form.control}
                            name='events'
                            render={() => {
                              return (
                                <FormItem key={item.id}>
                                  <FormControl>
                                    <ToggleGroupItem
                                      className='rounded-md border border-input'
                                      value={item.id.toString()}
                                    >
                                      {item.name}
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
              {equipment && equipment.length > 0 && (
                <FormField
                  control={form.control}
                  name='equipment'
                  defaultValue={form.getValues('equipment')}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className='text-base'>Equipment</FormLabel>
                      <ToggleGroup
                        type='multiple'
                        defaultValue={[equipment[0] || '']}
                        onValueChange={(value) => {
                          field.onChange(value)
                        }}
                      >
                        <div className='flex flex-wrap justify-between gap-2 px-6'>
                          {equipment.map((item) => (
                            <FormField
                              key={item}
                              control={form.control}
                              name='events'
                              render={() => {
                                return (
                                  <FormItem key={item}>
                                    <FormControl>
                                      <ToggleGroupItem
                                        className='rounded-md border border-input'
                                        value={item}
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
              )}
              <FormField
                control={form.control}
                name='address'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Address</FormLabel>
                    <FormControl>
                      <Input
                        placeholder='address'
                        type='text'
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name='phone'
                render={({ field }) => (
                  <FormItem>
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
              <FormField
                control={form.control}
                name='email'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input
                        placeholder='email'
                        type='text'
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name='notes'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Notes</FormLabel>
                    <FormControl>
                      <Input
                        placeholder='notes'
                        type='text'
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <div className='grid w-full grid-cols-2 gap-4'>
                <FormField
                  control={form.control}
                  name='squatOpener'
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Squat Opener</FormLabel>
                      <FormControl>
                        <Input
                          placeholder='squatOpener'
                          type='text'
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name='squatRackHeight'
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Squat Rack Height</FormLabel>
                      <FormControl>
                        <Input
                          placeholder='squatRackHeight'
                          type='text'
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <div className='grid w-full grid-cols-2 gap-4'>
                <FormField
                  control={form.control}
                  name='benchOpener'
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Bench Opener</FormLabel>
                      <FormControl>
                        <Input
                          placeholder='benchOpener'
                          type='text'
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name='benchRackHeight'
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Bench Rack Height</FormLabel>
                      <FormControl>
                        <Input
                          placeholder='benchRackHeight'
                          type='text'
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <div className='grid w-full grid-cols-2 gap-4'>
                <FormField
                  control={form.control}
                  name='deadliftOpener'
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Deadlift Opener</FormLabel>
                      <FormControl>
                        <Input
                          placeholder='deadliftOpener'
                          type='text'
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <Button
                className='mt-4 w-min'
                type='submit'
              >
                Submit
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}

export { EntryForm }
