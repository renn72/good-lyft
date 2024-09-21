import {
  MessageCircleIcon,
  MessageSquare,
  Trash,
  Trash2,
  PlusCircle,
} from 'lucide-react'
import { useState } from 'react'
import { api } from '@/trpc/react'
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'
import { Button } from '@/components/ui/button'
import { toast } from 'sonner'
import { cn } from '@/lib/utils'
import { Icons } from '~/components/ui/icons'

export const dynamic = 'force-dynamic'

export const Users = () => {
  const [isAddingFUsers, setIsAddingFUsers] = useState(false)
  const [isDeletingFUsers, setIsDeletingFUsers] = useState(false)

  const ctx = api.useUtils()
  const { data: users } = api.user.getAllUsers.useQuery()
  const { mutate: deleteFakeUsers } = api.user.deleteFakeUsers.useMutation({
    onMutate: () => {
      setIsDeletingFUsers(true)
    },
    onSettled: () => {
      void ctx.user.getAllUsers.invalidate()
      setIsDeletingFUsers(false)
    },
    onSuccess: () => {
      toast.success('Deleted')
    },
    onError: (err) => {
      console.log(err)
    },
  })
  const { mutate: generateFakeUsers } = api.user.generateFakeUsers.useMutation({
    onMutate: () => {
      setIsAddingFUsers(true)
    },
    onSettled: () => {
      void ctx.user.getAllUsers.invalidate()
      setIsAddingFUsers(false)
    },
    onSuccess: () => {
      toast.success('Generated')
    },
    onError: (err) => {
      console.log(err)
    },
  })
  const { mutate: deleteUser } = api.user.deleteUser.useMutation({
    onSettled: () => {
      void ctx.user.getAllUsers.invalidate()
    },
    onSuccess: () => {
      toast.success('Deleted')
    },
    onError: (err) => {
      console.log(err)
    },
  })
  const { mutate: updateRoot } = api.user.updateRoot.useMutation({
    onMutate: async (newValue) => {
      await ctx.user.getAllUsers.cancel()

      const prevData = ctx.user.getAllUsers.getData()

      ctx.user.getAllUsers.setData(
        undefined,
        prevData?.map((user) => {
          if (user.id === newValue.id) {
            return {
              ...user,
              isRoot: newValue.isRoot,
            }
          }
          return user
        }),
      )
      return { prevData }
    },
    onSuccess: () => {
      toast.success('Updated')
    },
    onError: (err, newValue, context) => {
      ctx.user.getAllUsers.setData(undefined, context?.prevData)
    },
  })
  return (
    <div className='mb-8 flex w-full flex-col gap-4'>
      <div className='flex items-center gap-4'>
        <h1 className='text-2xl font-bold'>Users</h1>
        <Button
          onClick={() => {
            generateFakeUsers()
          }}
          className='flex items-center gap-2'
        >
          {isAddingFUsers ? (
            <Icons.spinner className='h-5 w-5 animate-spin text-white' />
          ) : (
            <PlusCircle className='h-5 w-5' />
          )}
          Add 10 FakeUsers
        </Button>
        <Button
          variant='destructive'
          onClick={() => {
            deleteFakeUsers()
          }}
          className='flex items-center gap-2'
        >
          {isDeletingFUsers ? (
            <Icons.spinner className='h-5 w-5 animate-spin text-white' />
          ) : (
            <Trash2 className='h-5 w-5' />
          )}
          Delete FakeUsers
        </Button>
      </div>
      <div className='flex w-full flex-col gap-2'>
        {users?.map((user) => (
          <div
            key={user.id}
            className='flex w-full items-center justify-between gap-4 rounded-lg border border-border bg-background px-4 py-1'
          >
            <div className='flex items-center gap-4'>
              <div
                className={cn(
                  'flex h-10 w-10 justify-center rounded-full pt-2',
                  'text-center text-xl font-bold text-primary-foreground',
                  user.isFake ? 'bg-fuchsia-900' : 'bg-primary',
                  user.isRoot ? 'bg-cyan-900' : '',
                )}
              >
                {user.name?.slice(0, 1).toUpperCase()}
              </div>
              <div className='flex flex-col'>
                <div className='text-lg font-semibold'>{user.name}</div>
                <div className='text-sm text-muted-foreground'>
                  {user.email}
                </div>
              </div>
            </div>
            <div className='flex items-center gap-6'>
              <div className='flex items-baseline gap-2'>
                <Label>Root</Label>
                <Switch
                  checked={user.isRoot ? true : false}
                  onCheckedChange={(value) => {
                    console.log(value)
                    updateRoot({ id: user.id, isRoot: value })
                    // api.user.updateRoot(user.id, value)
                  }}
                />
              </div>
              <Button className='flex h-10 w-10 items-center justify-center rounded-full bg-primary p-0 text-primary-foreground'>
                <MessageSquare />
              </Button>
              <Button
                disabled={user.isRoot ? true : false}
                onClick={() => {
                  deleteUser(user.id)
                }}
                className='flex h-10 w-10 items-center justify-center rounded-full bg-destructive p-0 text-destructive-foreground'
              >
                <Trash2 />
              </Button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
