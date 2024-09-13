import { ModeToggle } from '@/components/layout/mode-toggle'

export const Navbar = () => {
  return (
    <div className='flex h-16 items-center justify-between'>
      <div className='flex items-center gap-4'>
        <h1 className='text-2xl font-bold'>Good Lyft</h1>
      </div>
      <div className='flex items-center gap-4'>
        <a
          href='#'
          className='text-gray-500 hover:text-gray-700'
        >
          About
        </a>
        <a
          href='#'
          className='text-gray-500 hover:text-gray-700'
        >
          Contact
        </a>
        <a
          href='#'
          className='text-gray-500 hover:text-gray-700'
        >
          Blog
        </a>
        <ModeToggle />
      </div>
    </div>
  )
}
