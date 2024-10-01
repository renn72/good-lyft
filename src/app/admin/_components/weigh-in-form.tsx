'use client'
import { useEffect, useState } from 'react'

import { api } from '~/trpc/react'

import { zodResolver } from '@hookform/resolvers/zod'
import { useForm, FormProvider } from 'react-hook-form'
import { z } from 'zod'

import { Button } from '~/components/ui/button'
import { Form } from '~/components/ui/form'
import { toast } from 'sonner'


import Equipment from './_weigh-in-compenents/equipment'
import Personal from './_weigh-in-compenents/personal'
import PersonalInfo from './_weigh-in-compenents/personal-info'
import Events from './_weigh-in-compenents/events'
import Divisions from './_weigh-in-compenents/divisions'
import LiftInfo from './_weigh-in-compenents/lift-info'
import Notes from './_weigh-in-compenents/notes'
import WeighIn from './_weigh-in-compenents/weigh-in'

import { GetCompetitionEntryById, GetCompetitionById } from '~/lib/types'

export const dynamic = 'force-dynamic'

const formSchema = z.object({
  address: z.string(),
  phone: z.string(),
  instagram: z.string(),
  openLifter: z.string(),
  birthDate: z.date(),
  equipment: z.string(),
  gender: z.string(),
  predictedWeight: z.string(),
  entryWeight: z.string(),
  events: z.array(z.string()),
  division: z.array(z.string()),
  squatOpener: z.string(),
  squatRack: z.string(),
  benchOpener: z.string(),
  benchRack: z.string(),
  deadliftOpener: z.string(),
  squatPB: z.string(),
  benchPB: z.string(),
  deadliftPB: z.string(),
  notes: z.string(),
  team: z.string().optional(),
  teamLift: z.string().optional(),
})

const WeighInForm = ({
  entry,
  competition,
  setIsOpen,
}: {
  entry: GetCompetitionEntryById | null
  competition: GetCompetitionById
  isOpen: boolean
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>
}) => {
  const [isPending, setIsPending] = useState(false)
  const [submitText, setSubmitText] = useState('Submit')

  const [isEditPersonal, setIsEditPersonal] = useState(true)

  const ctx = api.useUtils()
  const { mutate: updateAndLock } = api.compEntry.updateAndLock.useMutation({
    onMutate: () => {
      setIsPending(true)
      setSubmitText('Submitting...')
    },
    onSettled: () => {
      ctx.competition.getAllMyCompetitions.refetch()
      setIsPending(false)
      setSubmitText('Submit')
    },
    onSuccess: () => {
      toast.success('Weight In Submitted')
      setIsOpen(false)
    },
    onError: () => {
      toast.error('Error Submitting Weight In')
    },
  })

  const isSquat =
    entry?.entryToEvents.reduce((a, c) => {
      if (c.event?.isSquat) return true
      return a
    }, false) || false
  const isBench =
    entry?.entryToEvents.reduce((a, c) => {
      if (c.event?.isBench) return true
      return a
    }, false) || false
  const isDeadlift =
    entry?.entryToEvents.reduce((a, c) => {
      if (c.event?.isDeadlift) return true
      return a
    }, false) || false

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      address: entry?.user && entry.user.address ? entry.user.address : '',
      phone: entry?.user && entry.user.phone ? entry.user.phone : '',
      instagram:
        entry?.user && entry.user.instagram ? entry.user.instagram : '',
      openLifter:
        entry?.user && entry.user.openLifter ? entry.user.openLifter : '',
      birthDate:
        entry?.user && entry.user.birthDate ? entry.user.birthDate : undefined,
      equipment: entry?.equipment ? entry.equipment : '',
      gender: entry?.gender ? entry.gender : '',
      predictedWeight: entry?.predictedWeight ? entry.predictedWeight : '',
      entryWeight: entry?.entryWeight ? entry.entryWeight : '',
      events: entry?.entryToEvents
        ? entry.entryToEvents.map((event) => event.event?.id.toString())
        : [],
      division:
        entry?.entryToDivisions?.map((division) =>
          division.division?.id.toString(),
        ) || [],
      squatOpener: entry?.squatOpener ? entry.squatOpener : '',
      squatRack: entry?.squatRack ? entry.squatRack : '',
      benchOpener: entry?.benchOpener ? entry.benchOpener : '',
      benchRack: entry?.benchRack ? entry.benchRack : '',
      deadliftOpener: entry?.deadliftOpener ? entry.deadliftOpener : '',
      squatPB: entry?.squatPB ? entry.squatPB : '',
      benchPB: entry?.benchPB ? entry.benchPB : '',
      deadliftPB: entry?.deadliftPB ? entry.deadliftPB : '',
      notes: entry?.notes ? entry.notes : '',
    },
  })

  const onSubmit = (data: z.infer<typeof formSchema>) => {
    console.log('formData', data)
    if (!entry) return
    if (!competition) return
    // updateAndLock({
    //   ...data,
    //   id: entry.id,
    //   compId: competition.id,
    //   event: entry.events.map((event) => event.event?.id.toString() || '') || [],
    //   division: entry.compEntryToDivisions.map(
    //     (division) => division.division?.id.toString() || '',
    //   ),
    // })
  }

  useEffect(() => {
    if (entry) {
      form.reset({
        address: entry?.user && entry.user.address ? entry.user.address : '',
        phone: entry?.user && entry.user.phone ? entry.user.phone : '',
        instagram:
          entry?.user && entry.user.instagram ? entry.user.instagram : '',
        openLifter:
          entry?.user && entry.user.openLifter ? entry.user.openLifter : '',
        birthDate: entry.birthDate ? entry.birthDate : undefined,
        equipment: entry?.equipment ? entry.equipment : '',
        gender: entry?.gender ? entry.gender : '',
        predictedWeight: entry?.predictedWeight ? entry.predictedWeight : '',
        entryWeight: entry?.entryWeight ? entry.entryWeight : '',
        events: entry.entryToEvents
          ? entry.entryToEvents.map((event) => event.event?.id.toString())
          : [],
        division:
          entry?.entryToDivisions?.map((division) =>
            division.division?.id.toString(),
          ) || [],
        squatOpener: entry?.squatOpener ? entry.squatOpener : '',
        squatRack: entry?.squatRack ? entry.squatRack : '',
        benchOpener: entry?.benchOpener ? entry.benchOpener : '',
        benchRack: entry?.benchRack ? entry.benchRack : '',
        deadliftOpener: entry?.deadliftOpener ? entry.deadliftOpener : '',
        squatPB: entry?.squatPB ? entry.squatPB : '',
        benchPB: entry?.benchPB ? entry.benchPB : '',
        deadliftPB: entry?.deadliftPB ? entry.deadliftPB : '',
        notes: entry?.notes ? entry.notes : '',
      })
    }
    console.log('formData', form.getValues())
  }, [entry])

  if (!competition) {
    return <div>Competition not found</div>
  }

  if (!entry) return <div>Entry not found</div>

  return (
    <>
      <div className='flex w-full flex-col items-center gap-4'>
        <FormProvider {...form}>
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(onSubmit)}
              className='flex w-full max-w-2xl flex-col items-center gap-2'
            >
              {isEditPersonal ? (
                <Personal name={entry?.user?.name || ''} />
              ) : (
                <PersonalInfo entry={entry} />
              )}
              <Equipment competition={competition} />
              <Events competition={competition} />
              <Divisions competition={competition} />
              <WeighIn />
              <LiftInfo
                isSquat={isSquat}
                isBench={isBench}
                isDeadlift={isDeadlift}
              />
              <Notes />
              <Button
                className='mt-4 w-min min-w-[170px]'
                type='submit'
              >
                {isPending && (
                  <div className='mr-3 animate-spin'>
                    <div className='h-4 w-4 rounded-full border-b-2 border-t-2 border-border' />
                  </div>
                )}
                {submitText}
              </Button>
            </form>
          </Form>
        </FormProvider>
      </div>
    </>
  )
}


export { WeighInForm }
