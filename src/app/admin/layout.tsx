import { getServerAuthSession } from '@/server/auth'

export default async function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
    const session = await getServerAuthSession()
    if (!session?.user) return <div>Please login</div>
    if (!session?.user?.id) return <div>Please login</div>
  return (
  <>
    {children}
  </>
  )
}
