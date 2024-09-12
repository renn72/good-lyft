import { sql, relations } from 'drizzle-orm'
import { index, int, sqliteTableCreator, text } from 'drizzle-orm/sqlite-core'
import { competition } from './competition'
import { entryToDivision } from './entry'

export const createTable = sqliteTableCreator((name) => `good-lyft_${name}`)

export const division = createTable(
  'division',
  {
    id: int('id', { mode: 'number' }).primaryKey({ autoIncrement: true }),
    createdAt: int('created_at', { mode: 'timestamp' })
      .default(sql`(unixepoch())`)
      .notNull(),
    name: text('name'),
    minAge: int('min_age'),
    maxAge: int('max_age'),
    notes: text('notes'),
    competitionId: int('competition_id', { mode: 'number' }).references(
      () => competition.id,
      {
        onDelete: 'cascade',
      },
    ),
  },
  (d) => ({
    competitionIdIndex: index('division_competition_id_idx').on(d.competitionId),
  }),
)

export const divisionRelations = relations(division, ({ one, many }) => ({
  competition: one(competition, {
    fields: [division.competitionId],
    references: [competition.id],
  }),
  entryToDivisions: many(entryToDivision),
}))
