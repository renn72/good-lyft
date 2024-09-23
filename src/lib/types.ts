import type { inferRouterInputs, inferRouterOutputs } from '@trpc/server'

import { appRouter } from '~/server/api/root'

type RouterInputs = inferRouterInputs<typeof appRouter>
type RouterOutputs = inferRouterOutputs<typeof appRouter>

export type GetCompetitionByPrettyId = RouterOutputs['competition']['getCompetitionByPrettyId']
export type GetCompetitionById = RouterOutputs['competition']['get']

// export type GetLiftById = RouterOutputs['lift']['get']
//
export type GetCompetitionEntryById = RouterOutputs['entry']['get']
