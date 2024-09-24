'use client'

import Link from 'next/link'

import { Check, Shield, Star, Zap } from 'lucide-react'

import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'

export default function Home() {
  return (
    <div className='flex min-h-screen flex-col'>
      <main className='flex-1'>
        <section className='flex h-screen w-full flex-col justify-center bg-background py-12 md:py-24 lg:py-32 xl:py-48'>
          <div className='container px-4 md:px-6'>
            <div className='flex flex-col items-center space-y-4 text-center'>
              <div className='space-y-2'>
                <h1 className='text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl lg:text-6xl/none'>
                  Welcome to Our Revolutionary Platform
                </h1>
                <p className='mx-auto max-w-[700px] text-muted-foreground dark:text-gray-400 md:text-xl'>
                  Empower your workflow, boost productivity, and achieve your
                  goals with our cutting-edge solution. Experience innovation
                  like never before.
                </p>
              </div>
              <div className='space-x-4'>
                <Link
                  href='/admin'
                  passHref
                >
                  <Button>Get Started for Free</Button>
                </Link>
                <Link
                  href='#'
                  passHref
                >
                  <Button variant='outline'>Learn More</Button>
                </Link>
              </div>
            </div>
          </div>
        </section>
        <section
          id='features'
          className='w-full bg-gray-100 py-12 dark:bg-gray-800 md:py-24 lg:py-32'
        >
          <div className='container px-4 md:px-6'>
            <h2 className='mb-12 text-center text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl'>
              Powerful Features
            </h2>
            <div className='grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3'>
              <Card>
                <CardHeader>
                  <Zap className='mb-2 h-8 w-8 text-primary' />
                  <CardTitle>Lightning Fast</CardTitle>
                </CardHeader>
                <CardContent>
                  <p>
                    Experience blazing fast performance that keeps you ahead of
                    the competition.
                  </p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <Shield className='mb-2 h-8 w-8 text-primary' />
                  <CardTitle>Secure & Reliable</CardTitle>
                </CardHeader>
                <CardContent>
                  <p>
                    Your data is protected with state-of-the-art security
                    measures, ensuring peace of mind.
                  </p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <Star className='mb-2 h-8 w-8 text-primary' />
                  <CardTitle>Intuitive Design</CardTitle>
                </CardHeader>
                <CardContent>
                  <p>
                    Our user-friendly interface makes complex tasks simple and
                    enjoyable.
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>
        <section
          id='pricing'
          className='w-full py-12 md:py-24 lg:py-32'
        >
          <div className='container px-4 md:px-6'>
            <h2 className='mb-12 text-center text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl'>
              Flexible Pricing Plans
            </h2>
            <div className='grid grid-cols-1 gap-8 md:grid-cols-3'>
              {['Basic', 'Pro', 'Enterprise'].map((plan) => (
                <Card
                  key={plan}
                  className='flex flex-col'
                >
                  <CardHeader>
                    <CardTitle>{plan}</CardTitle>
                    <CardDescription>
                      {plan === 'Basic' && 'Perfect for starters'}
                      {plan === 'Pro' && 'Ideal for growing businesses'}
                      {plan === 'Enterprise' && 'For large-scale operations'}
                    </CardDescription>
                  </CardHeader>
                  <CardContent className='flex-1'>
                    <p className='mb-4 text-3xl font-bold'>
                      {plan === 'Basic' && '$9.99'}
                      {plan === 'Pro' && '$29.99'}
                      {plan === 'Enterprise' && 'Custom'}
                    </p>
                    <ul className='space-y-2'>
                      {['Feature 1', 'Feature 2', 'Feature 3'].map(
                        (feature) => (
                          <li
                            key={feature}
                            className='flex items-center'
                          >
                            <Check className='mr-2 h-4 w-4 text-green-500' />
                            {feature}
                          </li>
                        ),
                      )}
                    </ul>
                  </CardContent>
                  <CardFooter>
                    <Button className='w-full'>
                      {plan === 'Enterprise' ? 'Contact Sales' : 'Get Started'}
                    </Button>
                  </CardFooter>
                </Card>
              ))}
            </div>
          </div>
        </section>
      </main>
      <footer className='flex w-full shrink-0 flex-col items-center gap-2 border-t px-4 py-6 sm:flex-row md:px-6'>
        <p className='text-xs text-gray-500 dark:text-gray-400'>
          © 2024 Good Lyft. All rights reserved.
        </p>
        <nav className='flex gap-4 sm:ml-auto sm:gap-6'>
          <Link
            className='text-xs underline-offset-4 hover:underline'
            href='#'
          >
            Terms of Service
          </Link>
          <Link
            className='text-xs underline-offset-4 hover:underline'
            href='#'
          >
            Privacy
          </Link>
        </nav>
      </footer>
    </div>
  )
}
