import { sql } from 'drizzle-orm'
import { index, int, sqliteTableCreator, text } from 'drizzle-orm/sqlite-core'

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
  (example) => ({
    nameIndex: index('name_idx').on(example.name),
  }),
)
