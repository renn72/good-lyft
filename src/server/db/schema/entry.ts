
import { sql } from 'drizzle-orm'
import { index, int, sqliteTableCreator, text } from 'drizzle-orm/sqlite-core'

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
  },
)
