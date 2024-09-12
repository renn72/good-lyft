import { sql, relations } from 'drizzle-orm'
import { index, int, sqliteTableCreator, text } from 'drizzle-orm/sqlite-core'
import { entry } from './entry'
import { competition } from './competition'
import { lift } from './lift'
import { judge } from './competition'

export const createTable = sqliteTableCreator((name) => `good-lyft_${name}`)

export const user = createTable(
  'user',
  {
    id: int('id', { mode: 'number' }).primaryKey({ autoIncrement: true }),
    name: text('name'),
    clerkId: text('clerk_id'),
    birthDate: text('birth_date'),
    gender: text('gender'),
    address: text('address'),
    notes: text('notes'),
    instagram: text('instagram'),
    openLifter: text('open_lifter'),
    phone: text('phone'),
    email: text('email'),
    isFake: int('is_fake', { mode: 'boolean' }),
    createdAt: int('created_at', { mode: 'timestamp' })
      .default(sql`(unixepoch())`)
      .notNull(),
    updatedAt: int('updated_at', { mode: 'timestamp' }).$onUpdate(
      () => new Date(),
    ),
  },
  (u) => ({
    nameIndex: index('name_idx').on(u.name),
    clerkIdIndex: index('clerk_id_idx').on(u.clerkId),
  }),
)

export const userRelations = relations(user, ({ one, many }) => ({
  entries: many(entry),
  competitions: many(competition),
  lifts: many(lift),
  judges: many(judge),
}))
