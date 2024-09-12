import { sql, relations } from 'drizzle-orm'
import { index, int, sqliteTableCreator, text } from 'drizzle-orm/sqlite-core'
import { user } from './user'
import { division } from './division'
import { event } from './event'
import { competition } from './competition'
import { lift } from './lift'

export const createTable = sqliteTableCreator((name) => `good-lyft_${name}`)

export const entry = createTable(
  'entry',
  {
    id: int('id', { mode: 'number' }).primaryKey({ autoIncrement: true }),
    createdAt: int('created_at', { mode: 'timestamp' })
      .default(sql`(unixepoch())`)
      .notNull(),
    updatedAt: int('updated_at', { mode: 'timestamp' }).$onUpdate(
      () => new Date(),
    ),
    userId: int('user_id', { mode: 'number' }).references(() => user.id, {
      onDelete: 'cascade',
    }),
    competitionId: int('competition_id', { mode: 'number' }).references(
      () => competition.id,
      {
        onDelete: 'cascade',
      },
    ),
    birthDate: int('birth_date', { mode: 'timestamp' }),
    gender: text('gender'),
    predictedWeight: int('predicted_weight'),
    entryWeight: int('entry_weight'),
    wc: text('wc'),
    squatPB: text('squat_pb'),
    benchPB: text('bench_pb'),
    deadliftPB: text('deadlift_pb'),
    squatOpener: text('squat_opener'),
    benchOpener: text('bench_opener'),
    deadliftOpener: text('deadlift_opener'),
    squatRack: text('squat_rack'),
    benchRack: text('bench_rack'),
    currentState: text('state'),
    isLocked: int('is_locked', { mode: 'boolean' }),
    notes: text('notes'),
  },
  (e) => {
    return {
      useridIdx: index('entry_userid_idx').on(e.userId),
      competitionidIdx: index('entry_competitionid_idx').on(e.competitionId),
    }
  },
)

export const entryToDivision = createTable(
  'entry_to_division',
  {
    entryId: int('entry_id', { mode: 'number' }).references(() => entry.id, {
      onDelete: 'cascade',
    }),
    divisionId: int('division_id', { mode: 'number' }).references(
      () => division.id,
      {
        onDelete: 'cascade',
      },
    ),
  },
  (e) => {
    return {
      entryidIdx: index('entry_to_division_entryid_idx').on(e.entryId),
      divisionidIdx: index('entry_to_division_divisionid_idx').on(e.divisionId),
    }
  },
)

export const entryToEvent = createTable(
  'entry_to_event',
  {
    entryId: int('entry_id', { mode: 'number' }).references(() => entry.id, {
      onDelete: 'cascade',
    }),
    eventId: int('event_id', { mode: 'number' }).references(() => event.id, {
      onDelete: 'cascade',
    }),
  },
  (e) => {
    return {
      entryidIdx: index('entry_to_event_entryid_idx').on(e.entryId),
      eventidIdx: index('entry_to_event_eventid_idx').on(e.eventId),
    }
  },
)

// relations
//
export const entryRelations = relations(entry, ({ one, many }) => ({
  user: one(user, {
    fields: [entry.userId],
    references: [user.id],
  }),
  competition: one(competition, {
    fields: [entry.competitionId],
    references: [competition.id],
  }),
  entryToDivisions: many(entryToDivision),
  entryToEvents: many(entryToEvent),
  lifts: many(lift),
}))

export const entryToDivisionRelations = relations(
  entryToDivision,
  ({ one }) => ({
    entry: one(entry, {
      fields: [entryToDivision.entryId],
      references: [entry.id],
    }),
    division: one(division, {
      fields: [entryToDivision.divisionId],
      references: [division.id],
    }),
  }),
)

export const entryToEventRelations = relations(entryToEvent, ({ one }) => ({
  entry: one(entry, {
    fields: [entryToEvent.entryId],
    references: [entry.id],
  }),
  event: one(event, {
    fields: [entryToEvent.eventId],
    references: [event.id],
  }),
}))
