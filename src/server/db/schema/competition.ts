import { sql } from 'drizzle-orm'
import { index, int, sqliteTableCreator, text } from 'drizzle-orm/sqlite-core'
import { user } from './user'

export const createTable = sqliteTableCreator((name) => `good-lyft_${name}`)

export const competition = createTable('competition', {
  id: int('id', { mode: 'number' }).primaryKey({ autoIncrement: true }),
  createdAt: int('created_at', { mode: 'timestamp' })
    .default(sql`(unixepoch())`)
    .notNull(),
  updatedAt: int('updated_at', { mode: 'timestamp' }).$onUpdate(
    () => new Date(),
  ),
  prettyId: text('pretty_id'),
  ownerId: int('owner_id', { mode: 'number' }).references(() => user.id),
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
})
