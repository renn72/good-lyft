import { sql } from 'drizzle-orm'
import { index, int, sqliteTableCreator, text } from 'drizzle-orm/sqlite-core'
import { user } from './user'
import { competition } from './competition'

export const createTable = sqliteTableCreator((name) => `good-lyft_${name}`)

export const entry = createTable('entry', {
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
})
