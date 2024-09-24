import { z } from 'zod'
import { currentUser } from '@clerk/nextjs/server'
import { db } from '~/server/db'
import { client } from '~/server/db'

import { TRPCError } from '@trpc/server'
import { createTRPCRouter, publicProcedure } from '~/server/api/trpc'
import { user } from '~/server/db/schema/user'

import { eq } from 'drizzle-orm'

import { generateFullName, generateName } from '~/lib/names'

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
    const cUser = await currentUser()
    const isRoot = await isUserRoot(cUser?.id || '')
    if (!isRoot) {
      throw new TRPCError({
        code: 'UNAUTHORIZED',
        message: 'You are not authorized to access this resource.',
      })
    }

    await client.sync()
    return true
  }),
  getCurrentUser: publicProcedure.query(async ({ ctx }) => {
    const cUser = await currentUser()
    if (!cUser) {
      return false
    }
    const res = await ctx.db.query.user.findFirst({
      where: (user, { eq }) => eq(user.clerkId, cUser.id),
    })
    if (!res) {
      console.log('new user')
      const newUser = await db
        .insert(user)
        .values({
          clerkId: cUser.id,
          name: cUser.fullName,
          email: cUser.primaryEmailAddress?.emailAddress || '',
        })
        .returning({ id: user.id })
      const id = newUser[0]?.id || 0
      const newRes = await ctx.db.query.user.findFirst({
        where: (users, { eq }) => eq(users.id, id),
      })
      return newRes
    }
    return res
  }),
  updateRoot: publicProcedure
    .input(z.object({ id: z.number(), isRoot: z.boolean() }))
    .mutation(async ({ ctx, input }) => {
      const cUser = await currentUser()
      const isRoot = await isUserRoot(cUser?.id || '')
      if (!isRoot) {
        throw new TRPCError({
          code: 'UNAUTHORIZED',
          message: 'You are not authorized to access this resource.',
        })
      }

      const res = await ctx.db
        .update(user)
        .set({
          isRoot: input.isRoot,
        })
        .where(eq(user.id, input.id))

      return res
    }),

  isUserRoot: publicProcedure.query(async ({ ctx }) => {

    // const clerkId = 'user_2m8MFN14493ajBeHHWnLwkx88B1'
    // const id = 10
    // const res = await ctx.db.query.user.findFirst({
    //   where: (users, { eq }) => eq(users.id, id),
    // })
    // return res?.isRoot

    const cUser = await currentUser()
    if (!cUser) {
      return false
    }
    const res = await ctx.db.query.user.findFirst({
      where: (users, { eq }) => eq(users.clerkId, cUser.id),
    })
    return res?.isRoot
  }),

  createUser: publicProcedure
    .input(createSchema)
    .mutation(async ({ ctx, input }) => {
      const res = await ctx.db.insert(user).values({
        ...input,
      })

      return res
    }),
  generateFakeUsers: publicProcedure.mutation(async ({ ctx }) => {
    const fakeUsers = [...Array(9).keys()].map(() => {
      const name = generateFullName()
      return {
        name: name,
        email: name.toLowerCase().replaceAll(' ', '') + Math.floor(Math.random() * 1000).toString() + '@warner.systems',
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

export const getCurrentUser = async () => {
  // const u = await currentUser()
  const u = { id : 'user_2m8MFN14493ajBeHHWnLwkx88B1'}
  return await db.query.user.findFirst({
    where: (users, { eq }) => eq(users.clerkId, u?.id || ''),
  })
}

export const isUserRoot = async (userId: string) => {
  const res = await db.query.user.findFirst({
    where: (users, { eq }) => eq(users.clerkId, userId),
  })
  return res?.isRoot
}
