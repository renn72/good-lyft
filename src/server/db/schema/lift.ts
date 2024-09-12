import { sql, relations } from 'drizzle-orm'
import { index, int, sqliteTableCreator, text } from 'drizzle-orm/sqlite-core'
import { user } from './user'
import { entry } from './entry'
import { competition } from './competition'

export const createTable = sqliteTableCreator((name) => `good-lyft_${name}`)

export const lift = createTable(
  'lift',
  {
    id: int('id', { mode: 'number' }).primaryKey({ autoIncrement: true }),
    createdAt: int('created_at', { mode: 'timestamp' })
      .default(sql`(unixepoch())`)
      .notNull(),
    competitionId: int('competition_id', { mode: 'number' }).references(
      () => competition.id,
      {
        onDelete: 'cascade',
      },
    ),
    entryId: int('entry_id', { mode: 'number' }).references(() => entry.id, {
      onDelete: 'cascade',
    }),
    userId: int('user_id', { mode: 'number' }).references(() => user.id, {
      onDelete: 'cascade',
    }),
    liftName: text('lift_name'),
    liftNumber: int('lift_number'),
    weight: text('weight'),
    isOne: int('is_one', { mode: 'boolean' }),
    isTwo: int('is_two', { mode: 'boolean' }),
    isThree: int('is_three', { mode: 'boolean' }),
    order: int('order'),
    bracket: int('bracket'),
    day: int('day'),
    platform: int('platform'),
    rackHeight: text('rack_height'),
    gender: text('gender'),
    entryWeight: int('entry_weight'),
    notes: text('notes'),
  },
  (e) => {
    return {
      competitionidIdx: index('lift_competitionid_idx').on(e.competitionId),
      entryidIdx: index('lift_entryid_idx').on(e.entryId),
      userIdIndex: index('lift_user_id_idx').on(e.userId),
    }
  },
)

export const liftRelations = relations(lift, ({ one, many }) => ({
  entry: one(entry, {
    fields: [lift.entryId],
    references: [entry.id],
  }),
  user: one(user, {
    fields: [lift.userId],
    references: [user.id],
  }),
  competition: one(competition, {
    fields: [lift.competitionId],
    references: [competition.id],
  }),
}))
