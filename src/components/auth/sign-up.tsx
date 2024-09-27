'use client'

import { api } from '@/trpc/react'

import { cn } from '@/lib/utils'
import { zodResolver } from '@hookform/resolvers/zod'
import { CalendarIcon } from '@radix-ui/react-icons'
import { format } from 'date-fns'
import { signIn } from 'next-auth/react'
import { useForm } from 'react-hook-form'
import { z } from 'zod'

import { Checkbox } from '@/components/ui/checkbox'
import { Button } from '@/components/ui/button'
import { CalendarDrop } from '@/components/ui/calender-drop'
import {
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
  PopoverClose,
} from '@/components/ui/popover'

const wait = () => new Promise((resolve) => setTimeout(resolve, 500))

const signInSchema = z.object({
  firstName: z.string({ required_error: 'First Name is required' }).min(1),
  lastName: z.string({ required_error: 'Last Name is required' }).min(1),
  birthDate: z.date().optional().nullable(),
  email: z.string({ required_error: 'Email is required' }).email(),
  password: z.string({ required_error: 'Password is required' }).min(6),
  isCreator: z.boolean(),
})

const SignUp = ({
  setIsLogin,
  setIsOpen,
}: {
  setIsLogin: React.Dispatch<React.SetStateAction<boolean>>
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>
}) => {
  const ctx = api.useUtils()
  const form = useForm<z.infer<typeof signInSchema>>({
    resolver: zodResolver(signInSchema),
    defaultValues: {
      email: '',
      password: '',
      firstName: '',
      lastName: '',
      birthDate: null,
      isCreator: false,
    },
  })

  const { mutate: signup } = api.user.createUser.useMutation({
    onSuccess: async (e) => {
      console.log('e', e)
      await signIn('credentials', {
        redirect: false,
        username: e.user,
        password: e.password,
      })
      ctx.user.isUser.refetch()
      wait().then(() => setIsOpen(false))
    },
  })

  return (
    <>
      <DialogHeader>
        <DialogTitle>Create your account</DialogTitle>
        <DialogDescription>
          Welcome! Please fill in the details to get started.
        </DialogDescription>
      </DialogHeader>
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(async (data) => {
            console.log('data', data)
            signup(data)
          })}
          className='flex w-full max-w-2xl flex-col gap-2'
        >
          <div className='flex w-full flex-col gap-6'>
            <div className='flex w-full gap-2'>
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
                <FormItem className='flex flex-col'>
                  <FormLabel>Date of birth</FormLabel>
                  <Popover>
                    <PopoverTrigger asChild>
                      <FormControl>
                        <Button
                          variant={'outline'}
                          className={cn(
                            'w-full pl-3 text-left font-normal',
                            !field.value && 'text-muted-foreground',
                          )}
                        >
                          {field.value ? (
                            format(field.value, 'PPP')
                          ) : (
                            <span>Pick a date</span>
                          )}
                          <CalendarIcon className='ml-auto h-4 w-4 opacity-50' />
                        </Button>
                      </FormControl>
                    </PopoverTrigger>
                    <PopoverContent
                      className='w-auto p-0'
                      align='start'
                      sideOffset={-80}
                    >
                      <CalendarDrop
                        mode='single'
                        captionLayout='dropdown-buttons'
                        fromYear={1930}
                        toYear={2020}
                        // @ts-ignore
                        selected={field.value}
                        onSelect={field.onChange}
                        disabled={(date) =>
                          date > new Date() || date < new Date('1900-01-01')
                        }
                        initialFocus
                      />
                      <PopoverClose asChild>
                        <p className='mb-2 flex w-full items-center justify-center'>
                          <Button
                            size='sm'
                            variant='outline'
                          >
                            Set
                          </Button>
                        </p>
                      </PopoverClose>
                    </PopoverContent>
                  </Popover>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name='email'
              render={({ field }) => (
                <FormItem className='w-full'>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input
                      placeholder='email'
                      type='email'
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name='password'
              render={({ field }) => (
                <FormItem className='w-full'>
                  <FormLabel>Password</FormLabel>
                  <FormControl>
                    <Input
                      placeholder='password'
                      type='password'
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name='isCreator'
              render={({ field }) => (
                <FormItem className='w-full flex gap-4 items-end h-6 space-y-0'>
                  <FormLabel>Do you want to create events?</FormLabel>
                  <FormControl>
                    <Checkbox
                      className='h-4'
                      checked={field.value}
                      onCheckedChange={(value) => {
                        field.onChange(value)
                      }}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button
              className='w-full'
              type='submit'
            >
              Create Account
            </Button>
            <div className='text-sm text-muted-foreground w-full text-center'>
              Have an account?
              <span
                className='cursor-pointer text-primary p-2'
                onClick={() => setIsLogin(true)}
              >
                Sign in
              </span>
            </div>
          </div>
        </form>
      </Form>
    </>
  )
}

export { SignUp }
