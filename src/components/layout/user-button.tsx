'use client'
import {
  SignInButton,
  SignedIn,
  SignedOut,
  UserButton as ClerkUserButton,
} from '@clerk/nextjs'
import { LogIn } from 'lucide-react'

import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip'

const UserButton = () => {
  return (
    <>
      <SignedOut>
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger className='w-9'>
              <SignInButton mode='modal'>
                <div className='rounded-lg p-1 hover:bg-secondary hover:text-secondary-foreground hover:outline hover:outline-2 hover:outline-secondary-foreground/50'>
                  <LogIn
                    size={24}
                    strokeWidth={2}
                  />
                </div>
              </SignInButton>
            </TooltipTrigger>
            <TooltipContent>
              <div>login</div>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </SignedOut>
      <SignedIn>
        <ClerkUserButton />
      </SignedIn>
    </>
  )
}

export { UserButton }
