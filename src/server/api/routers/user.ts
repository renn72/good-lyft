import { TRPCError } from '@trpc/server'
import { generateFullName, generateName } from '~/lib/names'
import {
  createTRPCRouter,
  protectedProcedure,
  publicProcedure,
} from '~/server/api/trpc'
import { client, db } from '~/server/db'
import { user } from '~/server/db/schema/user'
import { eq } from 'drizzle-orm'
import { z } from 'zod'
import { getServerAuthSession } from '@/server/auth'
import { hash } from 'bcryptjs'

function isTuple<T>(array: T[]): array is [T, ...T[]] {
  return array.length > 0
}

const createSchema = z.object({
  name: z.string(),
  birthDate: z.date().optional(),
  address: z.string().optional(),
  phone: z.string().optional(),
  instagram: z.string().optional(),
  openLifter: z.string().optional(),
  notes: z.string().optional(),
  email: z.string().optional(),
})

export const userRouter = createTRPCRouter({
  sync: publicProcedure.mutation(async ({ ctx }) => {
    // const isRoot = await isUserRoot(cUser?.id || '')
    // if (!isRoot) {
    //   throw new TRPCError({
    //     code: 'UNAUTHORIZED',
    //     message: 'You are not authorized to access this resource.',
    //   })
    // }

    await client.sync()
    return true
  }),
  getCurrentUser: protectedProcedure.query(async ({ ctx }) => {
    console.log('ctx', ctx.session)
    const userId = ctx.session?.user.id

    if (!userId) return null

    const res = await ctx.db.query.user.findFirst({
      where: (user, { eq }) => eq(user.id, userId),
    })
    return res
  }),
  isUser: publicProcedure.query(async () => {
    const session = await getServerAuthSession()
    return session?.user || false
  }),
  createUser: publicProcedure
    .input(
      z.object({
        email: z.string().email(),
        password: z.string(),
        firstName: z.string(),
        lastName: z.string(),
        birthDate: z.date().optional().nullable(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const hashedPassword = await hash(input.password, 10)
      const res = await ctx.db.insert(user).values({
        ...input,
        name: input.firstName + ' ' + input.lastName,
        password: hashedPassword,
      })


      return { user: input.email, password: input.password }
    }),
  generateFakeUsers: publicProcedure.mutation(async ({ ctx }) => {
    const fakeUsers = [...Array(9).keys()].map(() => {
      const name = generateFullName()
      return {
        name: name,
        email:
          name.toLowerCase().replaceAll(' ', '') +
          Math.floor(Math.random() * 1000).toString() +
          '@warner.systems',
        // generate a random birth date
        birthDate: new Date(
          Math.floor(Math.random() * 30) + 1980,
          Math.floor(Math.random() * 12),
          Math.floor(Math.random() * 26),
        ),
        isFake: true,
        address: `${Math.floor(Math.random() * 100)} ${generateName()} St`,
        // generate a random phone number
        phone: `04${Math.floor(Math.random() * 100)
          .toString()
          .padStart(3, '0')}${Math.floor(Math.random() * 100)
          .toString()
          .padStart(4, '0')}`,
        notes: '',
      }
    })

    for (const fUser of fakeUsers) {
      const u = await db
        .insert(user)
        .values({
          email: fUser.email,
          name: fUser.name,
          birthDate: fUser.birthDate,
          address: fUser.address,
          phone: fUser.phone,
          notes: fUser.notes,
          isFake: true,
        })
        .returning({ id: user.id })
      const res = await clerkClient.users.createUser({
        emailAddress: [fUser.email],
        firstName: fUser.name.split(' ')[0] || '',
        lastName: fUser.name.split(' ')[1] || '',
        password: 'underground55412',
      })
      await ctx.db
        .update(user)
        .set({
          clerkId: res.id,
        })
        .where(eq(user.id, u[0]?.id || 0))

      console.log(res)
    }

    return true
  }),
  deleteUser: publicProcedure
    .input(z.number())
    .mutation(async ({ ctx, input }) => {
      const res = await ctx.db
        .delete(user)
        .where(eq(user.id, input))
        .returning({ clerkId: user.clerkId })
      if (res[0]?.clerkId) await clerkClient.users.deleteUser(res[0]?.clerkId)
      return res
    }),
  getFakeUsers: publicProcedure.query(async ({ ctx }) => {
    const res = await db.query.user.findMany({
      where: (users, { eq }) => eq(users.isFake, true),
    })
    return res
  }),
  getAllUsers: publicProcedure.query(async ({ ctx }) => {
    const res = await ctx.db.query.user.findMany()
    return res
  }),
  deleteFakeUsers: publicProcedure.mutation(async ({ ctx }) => {
    const res = await db
      .delete(user)
      .where(eq(user.isFake, true))
      .returning({ clerkId: user.clerkId })
    for (const u of res) {
      if (u.clerkId) await clerkClient.users.deleteUser(u.clerkId)
    }
    return res
  }),
})
