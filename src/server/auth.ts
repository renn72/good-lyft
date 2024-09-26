import { env } from '@/env'
import { db } from '@/server/db'
import {
  account,
  session,
  user,
  verificationToken,
} from '@/server/db/schema/user'
import { DrizzleAdapter } from '@auth/drizzle-adapter'
import { compare } from 'bcryptjs'
import {
  getServerSession,
  type DefaultSession,
  type NextAuthOptions,
} from 'next-auth'
import { type Adapter } from 'next-auth/adapters'
import CredentialsProvider from 'next-auth/providers/credentials'

/**
 * Module augmentation for `next-auth` types. Allows us to add custom properties to the `session`
 * object and keep type safety.
 *
 * @see https://next-auth.js.org/getting-started/typescript#module-augmentation
 */
declare module 'next-auth' {
  interface Session extends DefaultSession {
    user: {
      id: string
      // ...other properties
      // role: UserRole;
    } & DefaultSession['user']
  }

  // interface User {
  //   // ...other properties
  //   // role: UserRole;
  // }
}

/**
 * Options for NextAuth.js used to configure adapters, providers, callbacks, etc.
 *
 * @see https://next-auth.js.org/configuration/options
 */
export const authOptions: NextAuthOptions = {
  session: {
    strategy: 'jwt',
  },
  callbacks: {
    session: async ({ session, token }) => {
      console.log('session callback', session)
      console.log('user callback', user)
      // @ts-ignore
      if (session.user) session.user.id = token.uid
      return {
        ...session,
      }
    },
    jwt: async ({ user, token }) => {
      console.log('jwt callback', token)
      console.log('user callback', user)
      if (user) {
        token.uid = user.id
      }
      return token
    },
  },
  adapter: DrizzleAdapter(db, {
    usersTable: user,
    accountsTable: account,
    sessionsTable: session,
    verificationTokensTable: verificationToken,
  }) as Adapter,
  providers: [
    CredentialsProvider({
      // The name to display on the sign in form (e.g. "Sign in with...")
      name: 'Credentials',
      // `credentials` is used to generate a form on the sign in page.
      // You can specify which fields should be submitted, by adding keys to the `credentials` object.
      // e.g. domain, username, password, 2FA token, etc.
      // You can pass any HTML attribute to the <input> tag through the object.
      credentials: {
        username: { label: 'Username', type: 'text', placeholder: 'jsmith' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials, req) {
        // Add logic here to look up the user from the credentials supplied
        console.log('credentials', credentials)
        if (!credentials) return null
        const maybeUser = await db.query.user.findFirst({
          where: (user, { eq }) => eq(user.email, credentials.username),
        })

        if (!maybeUser) throw new Error('user not found')
        if (!maybeUser.password) throw new Error('invalid password')

        const isValid =  await compare(credentials.password, maybeUser.password)
        if (maybeUser && isValid) {
          // Any object returned will be saved in `user` property of the JWT
          return { id: maybeUser.id, email: maybeUser.email, firstName: maybeUser.firstName, lastName: maybeUser.lastName }
        } else {
          // If you return null then an error will be displayed advising the user to check their details.
          throw new Error('invalid password')

          // You can also Reject this callback with an Error thus the user will be sent to the error page with the error message as a query parameter
        }
      },
    }),
    /**
     * ...add more providers here.
     *
     * Most other providers require a bit more work than the Discord provider. For example, the
     * GitHub provider requires you to add the `refresh_token_expires_in` field to the Account
     * model. Refer to the NextAuth.js docs for the provider you want to use. Example:
     *
     * @see https://next-auth.js.org/providers/github
     */
  ],
}

function authorize(prisma: PrismaClient) {
  return async (
    credentials: Record<'email' | 'password', string> | undefined,
  ) => {
    if (!credentials) throw new Error('Missing credentials')
    if (!credentials.email)
      throw new Error('"email" is required in credentials')
    if (!credentials.password)
      throw new Error('"password" is required in credentials')
    const maybeUser = await prisma.user.findFirst({
      where: { email: credentials.email },
      select: { id: true, email: true, password: true },
    })
    if (!maybeUser?.password) return null
    // verify the input password with stored hash
    const isValid = await compare(credentials.password, maybeUser.password)
    if (!isValid) return null
    return { id: maybeUser.id, email: maybeUser.email }
  }
}
/**
 * Wrapper for `getServerSession` so that you don't need to import the `authOptions` in every file.
 *
 * @see https://next-auth.js.org/configuration/nextjs
 */
export const getServerAuthSession = () => getServerSession(authOptions)
