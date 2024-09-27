import { getServerAuthSession } from '@/server/auth'
import { TRPCError } from '@trpc/server'
import { generateFullName, generateName } from '~/lib/names'
import {
  createTRPCRouter,
  protectedProcedure,
  publicProcedure,
  rootProtectedProcedure,
} from '~/server/api/trpc'
import { client, db } from '~/server/db'
import { user } from '~/server/db/schema/user'
import { hash } from 'bcryptjs'
import { eq } from 'drizzle-orm'
import { z } from 'zod'

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

const isUserRoot = async (userId: string) => {
  const res = await db.query.user.findFirst({
    where: (user, { eq }) => eq(user.id, userId),
    columns: {
      isRoot: true,
    },
  })
  return res?.isRoot
}

export const userRouter = createTRPCRouter({
  sync: protectedProcedure.mutation(async () => {
    await client.sync()
    return true
  }),
  unprotectedSync: publicProcedure.mutation(async () => {
    await client.sync()
    return true
  }),
  getCurrentUser: protectedProcedure.query(async ({ ctx }) => {
    const userId = ctx.session?.user.id

    if (!userId) return null

    const res = await ctx.db.query.user.findFirst({
      where: (user, { eq }) => eq(user.id, userId),
      columns: {
        password: false,
      },
    })
    return res
  }),
  isUser: publicProcedure.query(async () => {
    const session = await getServerAuthSession()
    if (!session?.user) return null
    if (!session?.user?.id) return null
    return session.user
  }),
  isRoot: protectedProcedure.query(async ({ ctx }) => {
    const userId = ctx.session?.user.id

    if (!userId) return null

    const res = await ctx.db.query.user.findFirst({
      where: (user, { eq }) => eq(user.id, userId),
      columns: {
        isRoot: true,
      },
    })
    return res
  }),
  updateRoot: rootProtectedProcedure
    .input(z.object({ isRoot: z.boolean(), id: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const res = await ctx.db
        .update(user)
        .set({
          isRoot: input.isRoot,
        })
        .where(eq(user.id, input.id))

      return res
    }),
  createUser: publicProcedure
    .input(
      z.object({
        email: z.string().email(),
        password: z.string(),
        firstName: z.string(),
        lastName: z.string(),
        birthDate: z.date().optional().nullable(),
        isCreator: z.boolean(),
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
  generateFakeUsers: rootProtectedProcedure.mutation(async () => {
    const fakeUsers = [...Array(9).keys()].map(() => {
      const name = generateFullName()
      const pwd = generateFullName().replaceAll(' ', '')
      return {
        name: name,
        firstName: name.split(' ')[0],
        lastName: name.split(' ')[1],
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
        password: pwd,
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
          firstName: fUser.firstName,
          lastName: fUser.lastName,
          password: fUser.password,
          birthDate: fUser.birthDate,
          address: fUser.address,
          phone: fUser.phone,
          notes: fUser.notes,
          isFake: true,
        })
        .returning({ id: user.id })
    }

    return true
  }),
  deleteUser: rootProtectedProcedure
    .input(z.string())
    .mutation(async ({ ctx, input }) => {
      const res = await ctx.db
        .delete(user)
        .where(eq(user.id, input))
        .returning({ clerkId: user.clerkId })
      return res
    }),
  getFakeUsers: rootProtectedProcedure.query(async () => {
    const res = await db.query.user.findMany({
      where: (users, { eq }) => eq(users.isFake, true),
    })
    return res
  }),
  getAllUsers: protectedProcedure.query(async ({ ctx }) => {
    const res = await ctx.db.query.user.findMany()
    return res
  }),
  deleteFakeUsers: rootProtectedProcedure.mutation(async () => {
    const res = await db
      .delete(user)
      .where(eq(user.isFake, true))
      .returning({ clerkId: user.clerkId })
    return res
  }),
})
