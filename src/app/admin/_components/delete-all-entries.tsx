import { Button } from '~/components/ui/button'
import { api } from '~/trpc/react'

export const DeleteAllEntries = ({ compId }: { compId: number }) => {
  const ctx = api.useUtils()

  const { mutate } = api.entry.deleteAllEntries.useMutation({
    onError: (err) => {
      console.log(err)
    },
    onSuccess: () => {
      console.log('deleted')
    },
  })
  return (
    <div className='flex w-full justify-end'>
      <Button
        variant='secondary'
        onClick={() => mutate(compId)}
      >
        Delete All
      </Button>
    </div>
  )
}

