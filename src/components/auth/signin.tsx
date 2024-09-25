'use client'

import { useState, type FormEvent } from 'react'

import type { NextPage } from 'next'
import { useRouter } from 'next/navigation'

import { signIn } from 'next-auth/react'

export const Signin = () => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const router = useRouter()

  async function onSignin(e: FormEvent) {
    e.preventDefault()

    const result = await signIn('credentials', {
      redirect: false,
      username: email,
      password: password,
    })

    if (result?.ok) {
      // router.push('/')
      alert('Signin success')
    } else {
      alert('Signin failed')
    }
  }

  return (
    <div className='flex min-h-screen flex-col items-center justify-center bg-gradient-to-b from-[#2e026d] to-[#15162c]'>
      <h1 className='text-5xl font-extrabold text-white'>Login</h1>
      <form
        className='mt-16 flex flex-col gap-8 text-2xl'
        onSubmit={(e) => void onSignin(e)}
      >
        <div>
          <label
            htmlFor='email'
            className='inline-block w-32  text-white'
          >
            Email
          </label>
          <input
            id='email'
            type='email'
            value={email}
            onChange={(e) => setEmail(e.currentTarget.value)}
            className='ml-4 w-72 rounded border p-2'
          />
        </div>
        <div>
          <label
            htmlFor='password'
            className='inline-block w-32  text-white'
          >
            Password
          </label>
          <input
            id='password'
            type='password'
            value={password}
            onChange={(e) => setPassword(e.currentTarget.value)}
            className='ml-4 w-72 rounded border p-2'
          />
        </div>
        <input
          type='submit'
          value='Sign me in'
          className='cursor-pointer rounded border border-gray-500 py-4 text-white'
        />
      </form>
    </div>
  )
}

