'use client'
import { api } from '~/trpc/react'

import { toast } from 'sonner'
import {
  Popover,
  PopoverClose,
  PopoverContent,
  PopoverTrigger,
} from '~/components/ui/popover'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '~/components/ui/dialog'
import { Button } from '~/components/ui/button'
import { Input } from '~/components/ui/input'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '~/components/ui/form'
import { ToggleGroup, ToggleGroupItem } from '~/components/ui/toggle-group'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '~/components/ui/select'
import { CalendarIcon, XIcon } from 'lucide-react'
import { cn } from '~/lib/utils'
import { format } from 'date-fns'
import { CalendarDrop } from '@/components/ui/calender-drop'

import type { GetCompetitionById } from '~/lib/types'

const formSchema = z.object({
  name: z.string().min(2, {
    message: 'Username must be at least 2 characters.',
  }),
  birthDate: z.date(),
  gender: z.string(),
  address: z.string(),
  phone: z.string(),
  email: z.string(),
  equipment: z.string(),
  events: z.array(z.string()).nonempty(),
  divisions: z.array(z.string()).nonempty(),
  notes: z.string(),
  squatOpener: z.string(),
  benchOpener: z.string(),
  deadliftOpener: z.string(),
  squatRackHeight: z.string(),
  benchRackHeight: z.string(),
  compId: z.number(),
})

export const dynamic = 'force-dynamic'

export const EntryForm = ({
  competition,
}: {
  competition: GetCompetitionById
}) => {
  const equipment = competition.equipment?.split('/')

  const ctx = api.useUtils()

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: '',
      birthDate: new Date(),
      gender: '',
      address: '',
      phone: '',
      email: '',
      equipment: competition.equipment?.split('/')[0] || '',
      events: [],
      divisions: [],
      notes: '',
      squatOpener: '',
      benchOpener: '',
      deadliftOpener: '',
      squatRackHeight: '',
      benchRackHeight: '',
      compId: competition.id,
    },
  })
  const { mutate } = api.entry.createEntry.useMutation({
    onError: (err) => {
      console.log(err)
      toast('Error')
    },
    onSuccess: () => {
      toast('Created')
    },
  })

  const onSubmit = (data: z.infer<typeof formSchema>) => {
    // mutate(data)
  }

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button>Add</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>New Entry</DialogTitle>
          <DialogDescription>
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className='flex w-full flex-col gap-4'
              >
                <div className='flex w-full flex-col gap-4'>
                  <FormField
                    control={form.control}
                    name='name'
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Name</FormLabel>
                        <FormControl>
                          <Input
                            placeholder='name'
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
                      defaultValue={equipment[0]}
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
          </DialogDescription>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  )
}
