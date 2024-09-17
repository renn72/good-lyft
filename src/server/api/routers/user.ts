
import { z } from 'zod'
import { currentUser } from '@clerk/nextjs/server'
import { db } from '~/server/db'

import { createTRPCRouter, publicProcedure } from '~/server/api/trpc'
import { user } from '~/server/db/schema/user'

import { eq } from 'drizzle-orm'

import { generateFullName, generateName } from '~/lib/names'

function isTuple<T>(array: T[]): array is [T, ...T[]] {
    return array.length > 0
}

const createSchema = z.object({
    name: z.string(),
    birthDate: z.string().optional(),
    address: z.string().optional(),
    phone: z.string().optional(),
    instagram: z.string().optional(),
    openLifter: z.string().optional(),
    notes: z.string().optional(),
    email: z.string().optional(),
})

export const userRouter = createTRPCRouter({
    getCurrentUser: publicProcedure.query(async ({ ctx }) => {
        const cUser = await currentUser()
        if (!cUser) {
            return false
        }
        const res = await ctx.db.query.user.findFirst({
            where: (user, { eq }) => eq(user.clerkId, user.id),
        })
        if (!res) {
            const newUser = await db
                .insert(user)
                .values({
                    clerkId: cUser.id,
                    name: cUser.fullName,
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
    isAdmin: publicProcedure.query(async ({ ctx }) => {
        const user = await currentUser()
        if (!user) {
            return false
        }
        if (user.privateMetadata?.admin == 'true') {
            console.log('true')
            return true
        }
        return false
    }),
    createUser: publicProcedure.input(createSchema).mutation(async ({ ctx, input }) => {
        const res = await ctx.db.insert(user).values({
            ...input,
        })

        return res
    }),
    generateFakeUsers: publicProcedure.mutation(async ({ ctx }) => {
        const fakeUsers = [...Array(10).keys()].map(() => {
            const name = generateFullName()
            return {
                name: name,
                // generate a random birth date
                birthDate: new Date(
                    Math.floor(Math.random() * 30) + 1980,
                    Math.floor(Math.random() * 12),
                    Math.floor(Math.random() * 26),
                ).toString(),
                isFake: true,
                address: `${Math.floor(Math.random() * 100)} ${generateName()} St`,
                // generate a random phone number
                phone: `04${Math.floor(Math.random() * 100)
                    .toString()
                    .padStart(3, '0')}${Math.floor(Math.random() * 100)
                    .toString()
                    .padStart(4, '0')}`,
                instagram: '@' + name.replace(' ', '').toLowerCase(),
                openlifter:
                    'www.openpowerlifting.org/' +
                    name.replace(' ', '').toLowerCase(),
                notes: '',
            }
        })
        const usersGen = fakeUsers.map((name) =>
            db.insert(user).values({
                name: name.name,
                birthDate: name.birthDate,
                address: name.address,
                phone: name.phone,
                instagram: name.instagram,
                openLifter: name.openlifter,
                notes: name.notes,
                isFake: true,
            }),
        )
        if (isTuple(usersGen)) {
            await ctx.db.batch(usersGen)
        }
        return true
    }),
    getFakeUsers: publicProcedure.query(async ({ ctx }) => {
        const res = await db.query.user.findMany({
            where: (users, { eq }) => eq(users.isFake, true),
        })
        return res
    }),
    deleteFakeUsers: publicProcedure.mutation(async ({ ctx }) => {
        const res = await db.delete(user).where(eq(user.isFake, true))
        return res
    }),
})

export const getCurrentUser = async () => {
    const u = await currentUser()
    return await db.query.user.findFirst({
        where: (users, { eq }) => eq(users.clerkId, u?.id || ''),
    })
}
