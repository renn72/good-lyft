import { type Metadata } from 'next'
import { Epilogue } from 'next/font/google'

import { TRPCReactProvider } from '@/trpc/react'

import { Toaster } from '@/components/ui/sonner'

import { Navbar } from '@/components/layout/navbar'
import { ThemeProvider } from '@/components/misc/theme-provider'
import { Providers } from '@/components/provider'

import { getServerAuthSession } from "@/server/auth";

import '@/styles/globals.css'

export const metadata: Metadata = {
  title: 'Create T3 App',

  description: 'Generated by create-t3-app',
  icons: [{ rel: 'icon', url: '/favicon.ico' }],
}

const font = Epilogue({ subsets: ['latin'] })

export default async function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const session = await getServerAuthSession();
  console.log('session', session)
  return (
    <html
      lang='en'
      className={`${font.className}`}
      suppressHydrationWarning
    >
      <body>
        <ThemeProvider
          attribute='class'
          defaultTheme='light'
          enableSystem
          disableTransitionOnChange
        >
          <Providers>
            <TRPCReactProvider>
              <Navbar />
              {children}
              <Toaster />
            </TRPCReactProvider>
          </Providers>
        </ThemeProvider>
      </body>
    </html>
  )
}
