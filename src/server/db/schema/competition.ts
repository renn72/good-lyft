import { sql, relations } from 'drizzle-orm'
import { index, int, sqliteTableCreator, text } from 'drizzle-orm/sqlite-core'
import { user } from './user'
import { entry } from './entry'
import { division } from './division'
import { event } from './event'

export const createTable = sqliteTableCreator((name) => `good-lyft_${name}`)

export const competition = createTable('competition', {
  id: int('id', { mode: 'number' }).primaryKey({ autoIncrement: true }),
  createdAt: int('created_at', { mode: 'timestamp' })
    .default(sql`(unixepoch())`)
    .notNull(),
  updatedAt: int('updated_at', { mode: 'timestamp' }).$onUpdate(
    () => new Date(),
  ),
  competitionStateId: int('competition_state_id', {
    mode: 'number',
  }).references(() => competitionState.id),
  prettyId: text('pretty_id').notNull(),
  creatorId: text('creator_id', ).references(() => user.id),
  name: text('name'),
  city: text('city'),
  state: text('state'),
  country: text('country'),
  venue: text('venue'),
  federation: text('federation'),
  date: int('date', { mode: 'timestamp' }),
  daysOfComp: int('days_of_comp'),
  platforms: int('platforms'),
  rules: text('rules'),
  wcMale: text('wc_male'),
  wcFemale: text('wc_female'),
  wcMixed: text('wc_mixed'),
  wcType: text('wc_type'),
  equipment: text('equipment'),
  formula: text('formula'),
  currentState: text('state'),
  entryLimit: int('entry_limit'),
  isStarted: int('is_started', { mode: 'boolean' }),
  isFinished: int('is_finished', { mode: 'boolean' }),
  isFourth: int('is_fourth', { mode: 'boolean' }),
  isPaid: int('is_paid', { mode: 'boolean' }),
  isRequireAddress: int('is_require_address', { mode: 'boolean' }),
  isRequirePhone: int('is_require_phone', { mode: 'boolean' }),
  notes: text('notes'),
},
  (c) => ({
    competitionStateIdIndex: index('competition_state_id_idx').on(c.competitionStateId),
    creatorIdIndex: index('competition_creator_id_idx').on(c.creatorId),
  }),
)

export const judge = createTable('judge', {
  id: int('id', { mode: 'number' }).primaryKey({ autoIncrement: true }),
  createdAt: int('created_at', { mode: 'timestamp' })
    .default(sql`(unixepoch())`)
    .notNull(),
  updatedAt: int('updated_at', { mode: 'timestamp' }).$onUpdate(
    () => new Date(),
  ),
  competitionId: int('competition_id', { mode: 'number' }).references(
    () => competition.id,
    {
      onDelete: 'cascade',
    },
  ),
  userId: text('user_id', ).references(() => user.id, {
    onDelete: 'cascade',
  }),
  role: text('role'),
},
  (j) => ({
    competitionIdIndex: index('judge_competition_id_idx').on(j.competitionId),
    userIdIndex: index('judge_user_id_idx').on(j.userId),
  }),
)

export const competitionState = createTable('competition_state', {
  id: int('id', { mode: 'number' }).primaryKey({ autoIncrement: true }),
  createdAt: int('created_at', { mode: 'timestamp' })
    .default(sql`(unixepoch())`)
    .notNull(),
  updatedAt: int('updated_at', { mode: 'timestamp' }).$onUpdate(
    () => new Date(),
  ),
  competitionId: int('competition_id', { mode: 'number' }),
  day: int('day'),
  bracket: int('bracket'),
  round: int('round'),
  liftName: text('lift_name'),
  currentLifter: int('current_lifter'),
  nextLifter: int('next_lifter'),
  state: text('state'),
},
  (s) => ({
    competitionIdIndex: index('competition_state_competition_id_idx').on(s.competitionId),
  }),
)

export const competitionRelations = relations(competition, ({ one, many }) => ({
  entries: many(entry),
  divisions: many(division),
  creator: one(user, {
    fields: [competition.creatorId],
    references: [user.id],
  }),
  judges: many(judge),
  events: many(event),
  competitionState: one(competitionState, {
    fields: [competition.competitionStateId],
    references: [competitionState.id],
  }),
}))

export const competitionStateRelations = relations(
  competitionState,
  ({ one }) => ({
    competition: one(competition, {
      fields: [competitionState.competitionId],
      references: [competition.id],
    }),
  }),
)

export const judgeRelations = relations(judge, ({ one, many }) => ({
  competition: one(competition, {
    fields: [judge.competitionId],
    references: [competition.id],
  }),
  user: one(user, {
    fields: [judge.userId],
    references: [user.id],
  }),
}))

