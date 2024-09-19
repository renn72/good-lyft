import { z } from 'zod'
import { eq } from 'drizzle-orm'

import { client } from '~/server/db'

import { createTRPCRouter, publicProcedure } from '~/server/api/trpc'

import { competition, competitionState } from '~/server/db/schema/competition'
import { division } from '~/server/db/schema/division'
import { event } from '~/server/db/schema/event'

import { getCurrentUser } from './user'
import { TRPCError } from '@trpc/server'
import { getDateFromDate } from '~/lib/utils'

function isTuple<T>(array: T[]): array is [T, ...T[]] {
  return array.length > 0
}

const createSchema = z.object({
  name: z.string().min(2),
  federation: z.string(),
  country: z.string().optional(),
  state: z.string().optional(),
  city: z.string().optional(),
  date: z.date(),
  ownerId: z.number().optional(),
  daysOfCompetition: z.number().nonnegative().int().min(1),
  platforms: z.number().nonnegative().int().min(1),
  rules: z.string().optional(),
  notes: z.string(),
  events: z.array(z.string()),
  equipment: z.string(),
  formular: z.string(),
  wc_male: z.string().optional(),
  currentState: z.string().optional(),
  competitorLimit: z.number().nonnegative().int().optional(),
  venue: z.string().optional(),
  divisions: z
    .array(
      z.object({
        name: z.string(),
        minAge: z.number().positive().or(z.string()),
        maxAge: z.number().positive().or(z.string()),
        notes: z.string(),
      }),
    )
    .nonempty(),
  wc_female: z.string().optional(),
  wc_mix: z.string().optional(),
})

const updateDaysOfCompetitionSchema = z.object({
  id: z.number(),
  daysOfCompetition: z.number().nonnegative().int().min(1),
})

const updatePlatformsSchema = z.object({
  id: z.number(),
  platforms: z.number().nonnegative().int().min(1),
})

export const competitionRouter = createTRPCRouter({
  create: publicProcedure
    .input(createSchema)
    .mutation(async ({ ctx, input }) => {
      const user = await getCurrentUser()
      if (!user) {
        throw new TRPCError({
          code: 'UNAUTHORIZED',
          message: 'You are not authorized to access this resource.',
        })
      }
      input.ownerId = user.id
      console.log('input', input)

      let comp_id =
        input.name.trim().toLowerCase().replaceAll(/\s/g, '-') +
        '-' +
        getDateFromDate(input.date)
      const idCheck = await ctx.db.query.competition.findFirst({
        where: (competition, { eq }) =>
          eq(competition.name, input.name) && eq(competition.date, input.date),
      })
      if (idCheck) {
        comp_id = comp_id + '-' + Math.random().toString(36).substring(2, 8)
      }

      const resComp = await ctx.db
        .insert(competition)
        .values({
          ...input,
          prettyId: comp_id,
        })
        .returning({ id: competition.id })

      const ins = input.divisions.map(
        (d: {
          name: string
          minAge: string | number
          maxAge: string | number
          notes: string | null
        }) =>
          ctx.db.insert(division).values({
            name: d.name,
            minAge: d.minAge === '' ? null : Number(d.minAge),
            maxAge: d.maxAge === '' ? null : Number(d.maxAge),
            notes: d.notes || '',
            competitionId: resComp[0]?.id || 0,
          }),
      )

      const insEvent = input.events.map((e) => {
        if (e.toLowerCase() === 'squat only') {
          return ctx.db.insert(event).values({
            name: 'Squat only',
            isSquat: true,
            isBench: false,
            isDeadlift: false,
            competitionId: resComp[0]?.id || 0,
          })
        } else if (e.toLowerCase() === 'bench only') {
          return ctx.db.insert(event).values({
            name: 'Bench only',
            isSquat: false,
            isBench: true,
            isDeadlift: false,
            competitionId: resComp[0]?.id || 0,
          })
        } else if (e.toLowerCase() === 'deadlift only') {
          return ctx.db.insert(event).values({
            name: 'Deadlift only',
            isSquat: false,
            isBench: false,
            isDeadlift: true,
            competitionId: resComp[0]?.id || 0,
          })
        } else if (e.toLowerCase() === 'squat, bench') {
          return ctx.db.insert(event).values({
            name: 'Squat, Bench',
            isSquat: true,
            isBench: true,
            isDeadlift: false,
            competitionId: resComp[0]?.id || 0,
          })
        } else if (e.toLowerCase() === 'squat, deadlift') {
          return ctx.db.insert(event).values({
            name: 'Squat, Deadlift',
            isSquat: true,
            isBench: false,
            isDeadlift: true,
            competitionId: resComp[0]?.id || 0,
          })
        } else if (e.toLowerCase() === 'bench, deadlift') {
          return ctx.db.insert(event).values({
            name: 'Bench, Deadlift',
            isSquat: false,
            isBench: true,
            isDeadlift: true,
            competitionId: resComp[0]?.id || 0,
          })
        }

        return ctx.db.insert(event).values({
          name: 'Squat, Bench, Deadlift',
          isSquat: true,
          isBench: true,
          isDeadlift: true,
          competitionId: resComp[0]?.id || 0,
        })
      })

      if (isTuple(ins)) {
        await ctx.db.batch(ins)
      }
      if (isTuple(insEvent)) {
        await ctx.db.batch(insEvent)
      }
      await ctx.db.insert(competitionState).values({
        competitionId: resComp[0]?.id || 0,
        day: 1,
        bracket: 1,
        round: 1,
        liftName: 'squat',
        state: 'created',
        currentLifter: null,
        nextLifter: null,
      })
    }),

  updateDaysOfCompetition: publicProcedure
    .input(updateDaysOfCompetitionSchema)
    .mutation(async ({ ctx, input }) => {
      const user = await getCurrentUser()
      if (!user) {
        throw new TRPCError({
          code: 'UNAUTHORIZED',
          message: 'You are not authorized to access this resource.',
        })
      }

      const res = await ctx.db
        .update(competition)
        .set({
          daysOfComp: input.daysOfCompetition,
        })
        .where(eq(competition.id, input.id))

      return res
    }),

  updatePlatforms: publicProcedure
    .input(updatePlatformsSchema)
    .mutation(async ({ ctx, input }) => {
      const user = await getCurrentUser()
      if (!user) {
        throw new TRPCError({
          code: 'UNAUTHORIZED',
          message: 'You are not authorized to access this resource.',
        })
      }

      const res = await ctx.db
        .update(competition)
        .set({
          platforms: input.platforms,
        })
        .where(eq(competition.id, input.id))

      return res
    }),

  getAll: publicProcedure.query(async ({ ctx }) => {
    const res = await ctx.db.query.competition.findMany({
      orderBy: (competitions, { desc }) => [desc(competitions.createdAt)],
      with: {
        divisions: true,
        competitionState: true,
        events: true,
        entries: {
          with: {
            lifts: true,
            user: true,
            competition: true,
            entryToDivisions: {
              with: {
                division: true,
              },
            },
            entryToEvents: {
              with: {
                event: true,
              },
            },
          },
        },
      },
    })
    return res
  }),
  getAllOpen: publicProcedure.query(async ({ ctx }) => {
    const res = await ctx.db.query.competition.findMany({
      where: (competitions, { eq }) => eq(competitions.currentState, 'open'),
      orderBy: (competitions, { desc }) => [desc(competitions.createdAt)],
      with: {
        divisions: true,
        events: true,
      },
    })
    return res
  }),
  getAllMyCompetitions: publicProcedure.query(async ({ ctx }) => {
    const user = await getCurrentUser()
    if (!user) {
      throw new TRPCError({
        code: 'UNAUTHORIZED',
        message: 'You are not authorized to access this resource.',
      })
    }

    // REMOVE THIS
    await client.sync()


    const res = await ctx.db.query.competition.findMany({
      where: (competitions, { eq }) => eq(competitions.ownerId, user.id),
      orderBy: (competitions, { desc }) => [desc(competitions.createdAt)],
      with: {
        divisions: true,
        competitionState: true,
        events: true,
        entries: {
          with: {
            lifts: true,
            user: true,
            competition: true,
            entryToDivisions: {
              with: {
                division: true,
              },
            },
            entryToEvents: {
              with: {
                event: true,
              },
            },
          },
        },
      },
    })
    return res
  }),
  get: publicProcedure.input(z.number()).query(async ({ ctx, input }) => {
    const res = await ctx.db.query.competition.findFirst({
      where: (competitions, { eq }) => eq(competitions.id, input),
      with: {
        divisions: true,
        competitionState: true,
        events: true,
        entries: {
          with: {
            lifts: true,
            user: true,
            competition: true,
            entryToDivisions: {
              with: {
                division: true,
              },
            },
            entryToEvents: {
              with: {
                event: true,
              },
            },
          },
        },
      },
    })
    if (!res) {
      throw new TRPCError({
        code: 'NOT_FOUND',
        message: 'Competition not found.',
      })
    }
    return res
  }),
  getCompetitionByPrettyId: publicProcedure
    .input(z.string())
    .query(async ({ ctx, input }) => {
      const res = await ctx.db.query.competition.findFirst({
        where: (competitions, { eq }) => eq(competitions.prettyId, input),
        with: {
          divisions: true,
          competitionState: true,
          events: true,
          entries: {
            with: {
              lifts: true,
              user: true,
              competition: true,
              entryToDivisions: {
                with: {
                  division: true,
                },
              },
              entryToEvents: {
                with: {
                  event: true,
                },
              },
            },
          },
        },
      })
      if (!res) {
        throw new TRPCError({
          code: 'NOT_FOUND',
          message: 'Competition not found.',
        })
      }
      return res
    }),
  openCompetition: publicProcedure
    .input(z.number())
    .mutation(async ({ ctx, input }) => {
      const user = await getCurrentUser()
      if (!user) {
        throw new TRPCError({
          code: 'UNAUTHORIZED',
          message: 'You are not authorized to access this resource.',
        })
      }

      const comp = await ctx.db.query.competition.findFirst({
        where: (competitions, { eq }) => eq(competitions.id, input),
        with: {
          owner: true,
        },
      })

      if (!comp) {
        throw new TRPCError({
          code: 'NOT_FOUND',
          message: 'Competition not found.',
        })
      }
      if (comp.ownerId !== user.id) {
        throw new TRPCError({
          code: 'FORBIDDEN',
          message: 'Unauthorized.',
        })
      }

      await ctx.db
        .update(competition)
        .set({
          currentState: 'open',
        })
        .where(eq(competition.id, input))

      return true
    }),
  closeCompetition: publicProcedure
    .input(z.number())
    .mutation(async ({ ctx, input }) => {
      const user = await getCurrentUser()
      if (!user) {
        throw new TRPCError({
          code: 'UNAUTHORIZED',
          message: 'You are not authorized to access this resource.',
        })
      }

      const comp = await ctx.db.query.competition.findFirst({
        where: (competitions, { eq }) => eq(competitions.id, input),
      })

      if (!comp) {
        throw new TRPCError({
          code: 'NOT_FOUND',
          message: 'Competition not found.',
        })
      }
      if (comp.ownerId !== user.id) {
        throw new TRPCError({
          code: 'FORBIDDEN',
          message: 'Unauthorized.',
        })
      }

      await ctx.db
        .update(competition)
        .set({
          currentState: 'closed',
        })
        .where(eq(competition.id, input))

      return true
    }),
  startCompetition: publicProcedure
    .input(z.number())
    .mutation(async ({ ctx, input }) => {
      const user = await getCurrentUser()
      if (!user) {
        throw new TRPCError({
          code: 'UNAUTHORIZED',
          message: 'You are not authorized to access this resource.',
        })
      }

      const comp = await ctx.db.query.competition.findFirst({
        where: (competitions, { eq }) => eq(competitions.id, input),
      })

      if (!comp) {
        throw new TRPCError({
          code: 'NOT_FOUND',
          message: 'Competition not found.',
        })
      }
      if (comp.ownerId !== user.id) {
        throw new TRPCError({
          code: 'FORBIDDEN',
          message: 'Unauthorized.',
        })
      }

      await ctx.db
        .update(competition)
        .set({
          currentState: 'started',
        })
        .where(eq(competition.id, input))

      return true
    }),
  pauseCompetition: publicProcedure
    .input(z.number())
    .mutation(async ({ ctx, input }) => {
      const user = await getCurrentUser()
      if (!user) {
        throw new TRPCError({
          code: 'UNAUTHORIZED',
          message: 'You are not authorized to access this resource.',
        })
      }

      const comp = await ctx.db.query.competition.findFirst({
        where: (competitions, { eq }) => eq(competitions.id, input),
      })

      if (!comp) {
        throw new TRPCError({
          code: 'NOT_FOUND',
          message: 'Competition not found.',
        })
      }
      if (comp.ownerId !== user.id) {
        throw new TRPCError({
          code: 'FORBIDDEN',
          message: 'Unauthorized.',
        })
      }

      await ctx.db
        .update(competition)
        .set({
          currentState: 'paused',
        })
        .where(eq(competition.id, input))

      return true
    }),
  deleteCompetition: publicProcedure
    .input(z.number())
    .mutation(async ({ ctx, input }) => {
      const user = await getCurrentUser()
      if (!user) {
        throw new TRPCError({
          code: 'UNAUTHORIZED',
          message: 'You are not authorized to access this resource.',
        })
      }

      const comp = await ctx.db.query.competition.findFirst({
        where: (competitions, { eq }) => eq(competitions.id, input),
      })

      if (!comp) {
        throw new TRPCError({
          code: 'NOT_FOUND',
          message: 'Competition not found.',
        })
      }
      if (comp.ownerId !== user.id) {
        throw new TRPCError({
          code: 'FORBIDDEN',
          message: 'Unauthorized.',
        })
      }

      await ctx.db.delete(competition).where(eq(competition.id, input))

      return true
    }),
})
