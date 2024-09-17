'use client'
import { useState } from 'react'
import { useFieldArray } from 'react-hook-form'
import { z } from 'zod'

import { PlusCircle, XCircle } from 'lucide-react'
import { cn } from '~/lib/utils'

import { Card, CardContent, CardHeader } from '~/components/ui/card'
import { Input } from '~/components/ui/input'
import { Button } from '~/components/ui/button'
import {
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from '~/components/ui/form'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTrigger,
  DialogClose,
} from '~/components/ui/dialog'

import type { UseFormReturn } from 'react-hook-form'
import { formSchema } from '~/components/competition/create/create-dialog'

export const dynamic = 'force-dynamic'

export const WC_Field = ({
  form,
  label,
  data,
  name,
}: {
  form: UseFormReturn<z.infer<typeof formSchema>>
  label: string
  data: number[]
  name: 'wc_male' | 'wc_female' | 'wc_mix'
}) => {
  const [index, setIndex] = useState<number>(0)
  const [open, setOpen] = useState<boolean>(false)

  const control = form.control

  const { fields, append, remove, replace } = useFieldArray({
    control: control,
    // @ts-expect-error
    name: name,
  })

  return (
    <Card>
      <CardHeader></CardHeader>
      <CardContent className='flex flex-col gap-4'>
        <div className='flex items-center justify-between'>
          <div>{label}</div>
          <div className='flex gap-2'>
            <Button
              variant='outline'
              onClick={(e) => {
                e.preventDefault()
                replace([])
              }}
            >
              Clear
            </Button>
            <Button
              variant='outline'
              onClick={(e) => {
                e.preventDefault()
                // @ts-expect-error
                replace(data)
              }}
            >
              Reset
            </Button>
          </div>
        </div>
        <Dialog
          open={open}
          onOpenChange={setOpen}
        >
          <div className='flex flex-wrap gap-4 px-8'>
            {fields?.map((field, index) => (
              <DialogTrigger
                key={field.id}
                asChild
                onClick={() => {
                  setIndex(index)
                }}
              >
                <div
                  className={cn(
                    'flex cursor-pointer items-center gap-2 rounded-full border border-border px-2 py-1 hover:bg-secondary hover:text-secondary-foreground',
                    form
                      .getValues(name)
                      .reduce(
                        (a, c, i) =>
                          i == index || c !== form.getValues(`${name}.${index}`)
                            ? a
                            : true,
                        false,
                      ) && 'border-destructive',
                  )}
                >
                  <FormField
                    control={control}
                    name={`${name}.${index}`}
                    render={({ field }) => <div>{field.value}</div>}
                  />
                  <XCircle
                    className='cursor-pointer place-self-center hover:text-destructive'
                    strokeWidth={1}
                    onClick={(e) => {
                      e.stopPropagation()
                      remove(index)
                    }}
                  />
                </div>
              </DialogTrigger>
            ))}
          </div>
          <DialogContent className='w-full max-w-[240px] place-items-center'>
            <DialogHeader></DialogHeader>
            <DialogDescription asChild>
              <FormField
                control={control}
                name={`${name}.${index}`}
                render={({ field }) => (
                  <FormItem className='flex flex-col gap-4'>
                    <FormControl>
                      <Input
                        placeholder='weight class'
                        type='number'
                        {...field}
                        onChange={(e) => {
                          field.onChange(parseFloat(e.target.value))
                        }}
                      />
                    </FormControl>
                    <DialogClose asChild>
                      <Button
                        className='w-full'
                        type='button'
                        variant='secondary'
                        autoFocus
                        onClick={() => {
                          const values = form.getValues(name) as number[]
                          // @ts-expect-error
                          replace(values.sort((a, b) => a - b))
                        }}
                      >
                        Set
                      </Button>
                    </DialogClose>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </DialogDescription>
          </DialogContent>
        </Dialog>
        <PlusCircle
          className='center w-full cursor-pointer hover:text-secondary'
          onClick={() => {
            setOpen(true)
            // @ts-expect-error
            append('')
            setIndex(fields.length)
          }}
        />
      </CardContent>
    </Card>
  )
}
