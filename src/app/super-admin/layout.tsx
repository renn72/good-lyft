import { currentUser } from '@clerk/nextjs/server'
import { db } from '~/server/db'

export default async function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const cUser = await currentUser()
  const user = await db.query.user.findFirst({
    where: (users, { eq }) => eq(users.clerkId, cUser?.id || ''),
  })

  if (!user) return null
  if (!user.isRoot) return null

  return <>{children}</>
}
