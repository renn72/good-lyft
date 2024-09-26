'use client'

import { useState, } from 'react'

import { zodResolver } from '@hookform/resolvers/zod'
import { LogInIcon } from 'lucide-react'
import { useForm } from 'react-hook-form'
import { z } from 'zod'

import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"

const signInSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
})

export const LogIn = () => {

  const form = useForm<z.infer<typeof signInSchema>>({
    resolver: zodResolver(signInSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  })

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button
          variant='outline'
          size='icon'
          className=''
        >
          <LogInIcon className='h-5 w-5' />
          <span className='sr-only'>Log in</span>
        </Button>
      </DialogTrigger>
      <DialogContent className='w-full max-w-[440px] place-items-center'>
        <DialogHeader>
          <DialogTitle>Log in</DialogTitle>
          <DialogDescription>
            Welcome back! Please enter your email and password.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(async (data) => {
              console.log('data', data)
              // await signIn('credentials', {
              //   redirect: false,
              //   username: data.email,
              //   password: data.password,
              // })
            })}
            className='flex w-full max-w-2xl flex-col gap-2'
          >
            <div className='flex w-full flex-col gap-8'>
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
            <Button
              className='w-full'
              type='submit'
            >
              Log in
            </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}
