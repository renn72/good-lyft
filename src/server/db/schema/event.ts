import { sql, relations } from 'drizzle-orm'
import { index, int, sqliteTableCreator, text } from 'drizzle-orm/sqlite-core'
import { competition } from './competition'
import { entryToEvent } from './entry'

export const createTable = sqliteTableCreator((name) => `good-lyft_${name}`)

export const event = createTable('event', {
  id: int('id', { mode: 'number' }).primaryKey({ autoIncrement: true }),
  createdAt: int('created_at', { mode: 'timestamp' })
    .default(sql`(unixepoch())`)
    .notNull(),
  name: text('name'),
  isSquat: int('is_squat', { mode: 'boolean' }),
  isDeadlift: int('is_deadlift', { mode: 'boolean' }),
  isBench: int('is_bench', { mode: 'boolean' }),
  notes: text('notes'),
  competitionId: int('competition_id', { mode: 'number' }).references(
    () => competition.id,
    {
      onDelete: 'cascade',
    },
  ),
})

export const eventRelations = relations(event, ({ one, many }) => ({
  competition: one(competition, {
    fields: [event.competitionId],
    references: [competition.id],
  }),
  entryToEvents: many(entryToEvent),
}))
