'use client'

import { api } from '@/trpc/react'

import { useState } from 'react'

import { zodResolver } from '@hookform/resolvers/zod'
import { signIn } from 'next-auth/react'
import { useForm } from 'react-hook-form'
import { toast } from 'sonner'
import { z } from 'zod'

import { Button } from '@/components/ui/button'
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

const wait = () => new Promise((resolve) => setTimeout(resolve, 500))

const signInSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
})

const LogIn = ({
  setIsLogin,
  setIsOpen,
}: {
  setIsLogin: React.Dispatch<React.SetStateAction<boolean>>
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>
}) => {
  const [loginError, setLoginError] = useState('')
  const ctx = api.useUtils()
  const form = useForm<z.infer<typeof signInSchema>>({
    resolver: zodResolver(signInSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  })

  return (
    <>
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
            try {
              const res = await signIn('credentials', {
                redirect: false,
                username: data.email,
                password: data.password,
              })
              console.log('res', res)
              if (res?.status === 200) {
                toast.success('Logged in')
                ctx.user.isUser.refetch()
                wait().then(() => setIsOpen(false))
              }
              if (res?.error) throw new Error(res.error)
            } catch (err : any) {
              if (err.message === 'user not found') setLoginError('Invalid email')
              if (err.message === 'invalid password') setLoginError('Invalid password')
              console.log('err', err.message)
              return
            }
          })}
          className='flex w-full max-w-2xl flex-col gap-2'
        >
          <div className='flex w-full flex-col gap-6'>
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
            <div className='text-sm text-destructive w-full text-center h-4 leading-none'>
              {loginError}
            </div>
            <div className='text-sm text-muted-foreground w-full text-center'>
              Don't have an account?{' '}
              <span
                className='cursor-pointer text-primary p-2'
                onClick={() => setIsLogin(false)}
              >
                Sign up
              </span>
            </div>
          </div>
        </form>
      </Form>
    </>
  )
}

export { LogIn }
