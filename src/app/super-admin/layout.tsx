import { db } from '~/server/db'

export default async function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return <>{children}</>
}
