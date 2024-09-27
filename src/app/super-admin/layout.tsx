import { db } from '~/server/db'
import { getServerAuthSession } from '@/server/auth'

export default async function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const session = await getServerAuthSession()
  if (!session?.user) return null
  const user = await db.query.user.findFirst({
    where: (user, { eq }) => eq(user.id, session.user.id),
    columns: {
      isRoot: true,
    }
  })
  if (!user) return null
  if (!user.isRoot) return null
  return <>{children}</>
}
