import { MessageCircleIcon, MessageSquare, Trash, Trash2 } from 'lucide-react'
import { api } from '@/trpc/react'
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'

export const dynamic = 'force-dynamic'

export const Users = () => {
  const ctx = api.useUtils()
  const { data: users } = api.user.getAllUsers.useQuery()
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
    onError: (err, newValue, context) => {
      ctx.user.getAllUsers.setData(undefined, context?.prevData)
    },
  })
  console.log(users)
  return (
    <div className='mb-8 flex w-full flex-col'>
      <h1 className='text-2xl font-bold'>Users</h1>
      <div className='flex w-full flex-col gap-4'>
        {users?.map((user) => (
          <div
            key={user.id}
            className='flex w-full items-center justify-between gap-4 rounded-lg border border-border bg-background px-4 py-2'
          >
            <div className='flex items-center gap-4'>
              <div className='flex h-10 w-10 justify-center rounded-full bg-primary pt-2 text-center text-xl font-bold text-primary-foreground'>
                {user.name?.slice(0, 1).toUpperCase()}
              </div>
              <div className='flex flex-col'>
                <div className='text-lg font-semibold'>{user.name}</div>
                <div className='text-sm text-muted-foreground'>
                  {user.email}
                </div>
              </div>
            </div>
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
            <div className='flex gap-4'>
              <button className='flex h-10 w-10 items-center justify-center rounded-full bg-primary text-primary-foreground'>
                <MessageSquare />
              </button>
              <button className='flex h-10 w-10 items-center justify-center rounded-full bg-destructive text-destructive-foreground'>
                <Trash2 />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
